import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  console.log("➡️ Incoming GET /api/projects/user");

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all UserProject rows for this user and include project details
    const { data: userProjects, error } = await supabase
      .from("UserProject")
      .select("project:Project(*)")
      .eq("user_id", userId);

    if (error) throw error;

    // Extract the projects
    const projects = userProjects?.map((up) => up.project) ?? [];

    return NextResponse.json({ success: true, projects }, { status: 200 });
  } catch (error: unknown) {
    console.error("💥 Unexpected error in /api/projects/user:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
