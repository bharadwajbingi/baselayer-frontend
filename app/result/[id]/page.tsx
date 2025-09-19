"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import {
  Download,
  Package,
  Settings,
  CheckCircle,
  ExternalLink,
  Copy,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

// Mock data - in real app this would come from API
const mockManifest = {
  id: "demo-project-123",
  stack: "nextjs-ts",
  version: "14",
  features: ["auth", "billing", "database", "email"],
  timestamp: "2025-01-14T10:30:00Z",
  zipUrl: "https://example.com/downloads/project-demo-123.zip",
};

const featureLabels = {
  auth: "Authentication",
  billing: "Billing & Payments",
  database: "Database Setup",
  email: "Email Service",
  api: "API Routes",
  admin: "Admin Dashboard",
  cms: "Content Management",
  analytics: "Analytics",
};

export default function ResultPage() {
  const params = useParams();
  const projectId = params.id as string;

  const handleDownload = () => {
    // In real app, this would trigger actual download
    toast.success("Download started!");
    window.open(mockManifest.zipUrl, "_blank");
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(projectId);
    toast.success("Project ID copied to clipboard");
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h1 className="text-3xl font-bold text-foreground">
              Project Generated Successfully!
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Your custom boilerplate is ready to download and use.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Download Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Your Project
                </CardTitle>
                <CardDescription>
                  Get your complete project package with all selected features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Project ZIP
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  The package includes all source code, configuration files, and
                  documentation.
                </p>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Project Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Tech Stack
                    </Label>
                    <p className="font-semibold">Next.js + TypeScript</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Version
                    </Label>
                    <p className="font-semibold">v{mockManifest.version}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Project ID
                    </Label>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {projectId}
                      </code>
                      <Button variant="ghost" size="sm" onClick={handleCopyId}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Generated
                    </Label>
                    <p className="font-semibold">
                      {new Date(mockManifest.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Included Features ({mockManifest.features.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockManifest.features.map((feature) => (
                    <Badge
                      key={feature}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {featureLabels[feature as keyof typeof featureLabels] ||
                        feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Project
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Documentation
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    File Size
                  </span>
                  <span className="text-sm font-medium">~2.3 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Est. Setup Time
                  </span>
                  <span className="text-sm font-medium">5 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Dependencies
                  </span>
                  <span className="text-sm font-medium">23 packages</span>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Extract the downloaded ZIP file</li>
                  <li>
                    Run{" "}
                    <code className="bg-muted px-1 rounded">npm install</code>
                  </li>
                  <li>Configure environment variables</li>
                  <li>
                    Run{" "}
                    <code className="bg-muted px-1 rounded">npm run dev</code>
                  </li>
                  <li>Start building your project!</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`text-sm font-medium ${className || ""}`} {...props}>
      {children}
    </label>
  );
}
