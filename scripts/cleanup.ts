import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role key needed
);

async function cleanupProjects() {
  console.log("🧹 Starting cleanup...");

  // Fetch orphaned projects (projects with no users linked)
  const { data: orphanedProjects, error: fetchError } = await supabase
    .from("projects") // Table name
    .select("*")
    .is("user_id", null); // Check if user_id is null or has no links to users

  if (fetchError) {
    console.error("❌ Error fetching orphaned projects:", fetchError.message);
    process.exit(1);
  }

  for (const project of orphanedProjects) {
    console.log(`Deleting project ${project.id}`);

    const filesToDelete: string[] = [];
    if (project.zip_url) filesToDelete.push(project.zip_url.split("/").pop()!);
    if (project.pdf_url) filesToDelete.push(project.pdf_url.split("/").pop()!);

    // Delete project files from Supabase Storage
    if (filesToDelete.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from("projects") // Storage bucket name
        .remove(filesToDelete);

      if (deleteError) {
        console.error("❌ Supabase delete error:", deleteError.message);
      }
    }

    // Delete the project record from Supabase (no Prisma involved)
    const { error: deleteProjectError } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    if (deleteProjectError) {
      console.error(
        `❌ Error deleting project ${project.id}:`,
        deleteProjectError.message
      );
    }
  }

  console.log("✅ Cleanup done");
  process.exit(0);
}

cleanupProjects().catch((err) => {
  console.error("❌ Cleanup failed:", err);
  process.exit(1);
});
