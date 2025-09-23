import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role key needed
);

async function cleanupProjects() {
  console.log("🧹 Starting cleanup...");

  const orphanedProjects = await prisma.project.findMany({
    where: {
      users: { none: {} }, // no linked users
    },
  });

  for (const project of orphanedProjects) {
    console.log(`Deleting project ${project.id}`);

    const filesToDelete: string[] = [];
    if (project.zip_url) filesToDelete.push(project.zip_url.split("/").pop()!);
    if (project.pdf_url) filesToDelete.push(project.pdf_url.split("/").pop()!);

    if (filesToDelete.length > 0) {
      const { error } = await supabase.storage
        .from("projects")
        .remove(filesToDelete);
      if (error) console.error("❌ Supabase delete error:", error.message);
    }

    await prisma.project.delete({ where: { id: project.id } });
  }

  console.log("✅ Cleanup done");
  process.exit(0);
}

cleanupProjects().catch((err) => {
  console.error("❌ Cleanup failed:", err);
  process.exit(1);
});
