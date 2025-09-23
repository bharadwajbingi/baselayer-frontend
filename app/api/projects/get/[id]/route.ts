// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function DELETE(req: NextRequest) {
//   // parse id from the request URL to avoid Next.js param-type mismatches
//   const url = new URL(req.url);
//   const parts = url.pathname.split("/").filter(Boolean);
//   const id = parts[parts.length - 1]; // last segment is the [id]

//   if (!id) {
//     return NextResponse.json(
//       { success: false, message: "Missing id" },
//       { status: 400 }
//     );
//   }

//   try {
//     const project = await prisma.project.findUnique({ where: { id } });
//     if (!project) {
//       return NextResponse.json(
//         { success: false, message: "Project not found" },
//         { status: 404 }
//       );
//     }

//     await prisma.project.delete({ where: { id } });
//     return NextResponse.json({
//       success: true,
//       message: "Project deleted successfully",
//     });
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : "Server error";
//     return NextResponse.json({ success: false, message }, { status: 500 });
//   }
// }

// app/api/projects/[id]/route.test('should
//

// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
    // Find the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    // 24-hour restriction based on created_at
    const created = project.created_at.getTime();
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

    // Delete the project (or user-project relation if per-user)
    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
