import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

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

    const userProjects = await prisma.userProject.findMany({
      where: { user_id: userId },
      include: {
        project: true,
      },
    });

    const projects = userProjects.map((userProject) => userProject.project);

    return NextResponse.json({ success: true, projects }, { status: 200 });
  } catch (error: unknown) {
    console.error("💥 Unexpected error in /api/projects/user:", error);

    // Narrow the error type safely
    const message = error instanceof Error ? error.message : "Server error";

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
