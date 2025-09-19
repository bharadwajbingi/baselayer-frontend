export async function generateProject(payload: {
  stack: string;
  version: string;
  features: string[];
}) {
  return {
    zipUrl: "/dummy/project.zip",
    manifest: {
      id: "demo-123", // move id here
      stack: payload.stack,
      version: payload.version,
      features: payload.features,
      summary: "Demo project boilerplate generated for preview.",
    },
  };
}
