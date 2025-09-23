"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  FileText,
  Trash2,
  Calendar,
  Clock,
  Package,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { SkeletonCard } from "@/components/skeletonLoad";

type Features = Prisma.JsonValue;

type Project = {
  id: string;
  stack: string;
  version: string;
  features: Features;
  zip_url: string;
  pdf_url: string;
  created_at: string;
  expires_at: string;
};

interface DeleteStatus {
  canDelete: boolean;
  remaining: string | null;
}

const getDeleteStatus = (createdAt: string): DeleteStatus => {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diffMs = now - created;
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours >= 24) return { canDelete: true, remaining: null };

  const remainingMs = 24 * 60 * 60 * 1000 - diffMs;
  const hrs = Math.floor(remainingMs / (1000 * 60 * 60));
  const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

  return { canDelete: false, remaining: `${hrs}h ${mins}m` };
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects/list");
        const data = await res.json();

        if (!res.ok)
          throw new Error(data.message || "Failed to fetch projects");

        setProjects(data.projects || []);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Error fetching projects";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  const handleDownloadPdf = async (pdfUrl: string) => {
    if (!pdfUrl) return;

    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "project.pdf"; // specify file name
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url); // free memory
    } catch (err) {
      console.error("Failed to download PDF:", err);
    }
  };
  const handleDelete = async (projectId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setDeletingId(projectId);

    try {
      const res = await fetch(`/api/projects/get/${projectId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete project");

      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error deleting project";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  if (loading)
    return (
      <>
        <Navbar showAuth={true} />
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center lg:justify-start lg:pt-32 min-h-screen">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {Array.from({ length: 9 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          </div>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Navbar showAuth={true} />
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <Card className="w-full max-w-md">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="font-medium">Error loading projects</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="w-full mt-4"
                    variant="outline"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );

  return (
    <>
      <Navbar showAuth={true} />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Codebases
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage and access all your generated boilerplate projects
            </p>
          </div>

          {projects.length === 0 ? (
            <Card className="w-full max-w-2xl mx-auto">
              <CardContent className="pt-12 pb-12">
                <div className="flex flex-col items-center space-y-4">
                  <Package className="h-16 w-16 text-muted-foreground" />
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      No projects yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Generate your first project to see it here
                    </p>
                    <Button onClick={() => router.push("/dashboard")}>
                      Get your first codebase
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const { canDelete, remaining } = getDeleteStatus(
                  project.created_at
                );

                return (
                  <Card
                    key={project.id}
                    className={cn(
                      "group y",
                      isExpired(project.expires_at) && "border-destructive/50"
                    )}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-xl flex items-center space-x-2">
                            <Package className="h-5 w-5" />
                            <span>{project.stack}</span>
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{project.version}</Badge>
                            {isExpired(project.expires_at) && (
                              <Badge
                                variant="destructive"
                                className="flex items-center space-x-1"
                              >
                                <Clock className="h-3 w-3" />
                                <span>Expired</span>
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                          Features
                        </h4>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <code className="text-xs font-mono">
                            {JSON.stringify(project.features, null, 2)}
                          </code>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Created: {formatDate(project.created_at)}</span>
                        </div>
                        {project.expires_at && (
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              Expires: {formatDate(project.expires_at)}
                            </span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="flex items-center space-x-2">
                        <Button asChild size="sm" className="flex-1">
                          <a
                            href={project.zip_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </a>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPdf(project.pdf_url)}
                          className="flex items-center space-x-2"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>

                        {/* Delete button with 24h restriction */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                          disabled={deletingId === project.id || !canDelete}
                          className="text-destructive hover:text-destructive flex items-center space-x-1"
                        >
                          {deletingId === project.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          {!canDelete && remaining && (
                            <span className="text-xs text-muted-foreground ml-1">
                              Delete in {remaining}
                            </span>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
