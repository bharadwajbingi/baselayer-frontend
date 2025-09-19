export async function generateProject(payload: {
  stack: string;
  version: string;
  features: string[];
}) {
  return {
    id: "demo-123",
    zipUrl: "/dummy/project.zip",
    manifest: {
      stack: payload.stack,
      version: payload.version,
      features: payload.features,
      summary: "Demo project boilerplate generated for preview.",
    },
  };
}
