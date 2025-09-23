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

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch projects");
        }

        setProjects(data.projects || []);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "An error occurred while fetching projects.";

        setError(message || "An error occurred while fetching projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

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

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete project");
      }

      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectId)
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching projects.";

      setError(message || "An error occurred while deleting the project.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <>
        <Navbar showAuth={true} />
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  Loading your projects...
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
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
  }

  return (
    <>
      <Navbar showAuth={true} />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Your Projects
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
                    <Button onClick={() => router.push("/")}>
                      Create Your First Project
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
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
                    {/* Features */}
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

                    {/* Dates */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Created: {formatDate(project.created_at)}</span>
                      </div>
                      {project.expires_at && (
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Expires: {formatDate(project.expires_at)}</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Actions */}
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

                      <Button asChild variant="outline" size="sm">
                        <a
                          href={project.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2"
                        >
                          <FileText className="h-4 w-4" />
                        </a>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="text-destructive hover:text-destructive"
                      >
                        {deletingId === project.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
