import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);
  const projectId = parts[parts.length - 1];

  if (!projectId) {
    return NextResponse.json(
      { success: false, message: "Missing project ID" },
      { status: 400 }
    );
  }

  try {
    // Fetch the project
    const { data: project, error: fetchError } = await supabase
      .from("Project")
      .select("*")
      .eq("id", projectId)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json(
          { success: false, message: "Project not found" },
          { status: 404 }
        );
      }
      throw fetchError;
    }

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    // 24-hour restriction
    const created = new Date(project.created_at).getTime();
    const now = Date.now();
    const diffMs = now - created;

    if (diffMs < 24 * 60 * 60 * 1000) {
      const remainingMs = 24 * 60 * 60 * 1000 - diffMs;
      const hrs = Math.floor(remainingMs / (1000 * 60 * 60));
      const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      return NextResponse.json(
        {
          success: false,
          message: `You can delete this project in ${hrs}h ${mins}m`,
        },
        { status: 403 }
      );
    }

    // Delete the project
    const { error: deleteError } = await supabase
      .from("Project")
      .delete()
      .eq("id", projectId);

    if (deleteError) throw deleteError;

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
