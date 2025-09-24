import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabaseClient";
import fetch from "node-fetch";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

// Features type
type Features = Record<string, unknown>;

function stableStringify(obj: unknown): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;
  const keys = Object.keys(obj).sort();
  return `{${keys
    .map(
      (k) =>
        JSON.stringify(k) +
        ":" +
        stableStringify((obj as Record<string, unknown>)[k])
    )
    .join(",")}}`;
}

const generateConfigHash = (
  stack: string,
  version: string,
  features: Features
) => {
  const hash = crypto.createHash("sha256");
  const normalized = `${stack}:${version}:${stableStringify(features)}`;
  hash.update(normalized);
  return hash.digest("hex");
};

type ProjectResponse = {
  success: boolean;
  project: {
    id?: string;
    stack: string;
    version: string;
    features: Features;
    zip_url: string;
    pdf_url: string;
    created_at?: string;
    expires_at?: string;
  };
  message?: string;
};

export async function POST(req: NextRequest) {
  console.log("➡️ Incoming POST /api/projects");

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await req.json()) as {
      stack?: string;
      version?: string;
      features?: Features;
    };
    const { stack, version, features } = body;

    if (!stack || !version || !features) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const config_hash = generateConfigHash(stack, version, features);
    console.log("computed config_hash:", config_hash);

    // Check how many projects user created in the last 24h
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const { data: recentUserProjects, error: recentError } = await supabase
      .from("UserProject")
      .select("id")
      .eq("user_id", userId)
      .gte("created_at", oneDayAgo.toISOString());

    if (recentError) throw recentError;

    const maxFilesPerDay = 3;
    if ((recentUserProjects?.length ?? 0) >= maxFilesPerDay) {
      return NextResponse.json(
        {
          success: false,
          message: "You have reached the limit of 3 file generations per day.",
        },
        { status: 403 }
      );
    }

    // Check if project with same config_hash exists
    const { data: existingProjects, error: existingError } = await supabase
      .from("Project")
      .select("*")
      .eq("config_hash", config_hash)
      .limit(1)
      .single();

    if (existingError && existingError.code !== "PGRST116") throw existingError;

    if (existingProjects) {
      console.log("✅ Project already exists:", existingProjects.id);

      // Link user to existing project
      const userProjectId = uuidv4(); // Generate a new UUID for the 'id' in UserProject

      const { error: linkNewError } = await supabase
        .from("UserProject")
        .insert([
          {
            id: userProjectId, // Provide UUID for UserProject
            user_id: userId,
            project_id: existingProjects.id,
            created_at: new Date().toISOString(),
          },
        ]);

      if (linkNewError && linkNewError.code !== "23505") {
        console.warn("warning while linking userProject:", linkNewError);
      }

      return NextResponse.json(
        { success: true, project: existingProjects },
        { status: 200 }
      );
    }

    console.log("➡️ Not found in DB — calling backend generator");

    const backendUrl = process.env.BACKEND_SERVICE!;
    const backendRes = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stack, version, features, userId }),
    });

    if (!backendRes.ok) {
      const bodyText = await backendRes.text().catch(() => "");
      console.error("backend generator failed:", backendRes.status, bodyText);
      return NextResponse.json(
        {
          success: false,
          message: `Backend generator error: ${backendRes.status}`,
        },
        { status: backendRes.status }
      );
    }

    const result = (await backendRes.json()) as ProjectResponse;

    if (!result.success || !result.project) {
      console.error("Invalid response from backend generator:", result);
      return NextResponse.json(
        { success: false, message: "Invalid response from generator" },
        { status: 500 }
      );
    }

    const zip_url = result.project.zip_url ?? "";
    const pdf_url = result.project.pdf_url ?? "";

    const newProjectId = uuidv4(); // New UUID for the 'id' in Project

    // Upsert project
    const { data: upsertedProject, error: upsertError } = await supabase
      .from("Project")
      .upsert(
        [
          {
            id: newProjectId, // Provide generated UUID here
            config_hash,
            stack: result.project.stack ?? stack,
            version: result.project.version ?? version,
            features: result.project.features ?? features,
            zip_url,
            pdf_url,
          },
        ],
        { onConflict: "config_hash" }
      )
      .select()
      .single();

    if (upsertError) throw upsertError;

    // Now that upsertedProject is available, link user to the new project
    const userProjectId = uuidv4(); // Generate a new UUID for the 'id' in UserProject

    const { error: linkNewError } = await supabase.from("UserProject").insert([
      {
        id: userProjectId, // UUID for UserProject
        user_id: userId,
        project_id: upsertedProject.id,
        created_at: new Date().toISOString(),
      },
    ]);

    if (linkNewError && linkNewError.code !== "23505") {
      console.warn("warning while linking userProject:", linkNewError);
    }

    return NextResponse.json(
      { success: true, project: upsertedProject },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("💥 Unexpected error in /api/projects:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
