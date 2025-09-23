import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client"; // ✅ correct
import prisma from "@/lib/prisma"; // your client instance

import fetch from "node-fetch";
import crypto from "crypto";

// Prisma-compatible Features type
type Features = Prisma.InputJsonValue;

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

    const existing = await prisma.project.findUnique({
      where: { config_hash },
    });

    if (existing) {
      console.log("✅ Project already exists:", existing.id);
      try {
        await prisma.userProject.create({
          data: { user_id: userId, project_id: existing.id },
        });
      } catch (error: unknown) {
        if ((error as { code?: string }).code === "P2002") {
          console.log("userProject link already exists; ignoring");
        } else {
          console.warn("warning while linking userProject:", error);
        }
      }
      return NextResponse.json(
        { success: true, project: existing },
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

    if (!zip_url || !pdf_url) {
      console.warn("Backend did not return file URLs. URLs may be empty.");
    }

    const upsertedProject = await prisma.project.upsert({
      where: { config_hash },
      update: {
        zip_url,
        pdf_url,
        stack: result.project.stack ?? stack,
        version: result.project.version ?? version,
        features: result.project.features ?? features,
      },
      create: {
        config_hash,
        stack: result.project.stack ?? stack,
        version: result.project.version ?? version,
        features: result.project.features ?? features,
        zip_url,
        pdf_url,
      },
    });

    console.log("✅ Project upserted:", upsertedProject.id);

    try {
      await prisma.userProject.create({
        data: { user_id: userId, project_id: upsertedProject.id },
      });
    } catch (error: unknown) {
      if ((error as { code?: string }).code === "P2002") {
        console.log("userProject link already exists; ignoring");
      } else {
        console.warn("warning while linking userProject:", error);
      }
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
