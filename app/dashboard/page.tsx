"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Bell, Box, GitBranch, Activity } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/navbar";
import { FeatureCard } from "@/components/feature-card";
import { GenerateButton } from "@/components/generate-button";
import { generateProject } from "@/lib/api";
import { toast } from "sonner";
import {
  Shield,
  CreditCard,
  Database,
  Mail,
  Zap,
  Users,
  FileText,
  BarChart,
} from "lucide-react";

// --- Types ---
type ProjectInput = {
  stack: string;
  version: string;
  features: string[];
  userId?: string; // ✅ Add userId as optional
};

// --- Constants ---
const stacks = [
  { value: "nextjs-ts", label: "Next.js + TypeScript" },
  { value: "nextjs-js", label: "Next.js + JavaScript" },
  { value: "react-ts", label: "React + TypeScript" },
  { value: "vue-ts", label: "Vue + TypeScript" },
  { value: "svelte-ts", label: "Svelte + TypeScript" },
  { value: "mern", label: "MERN (Mongo + Express + React + Node)" },
  { value: "node-express", label: "Node.js + Express (Backend)" },
  { value: "fastapi", label: "Python + FastAPI (Backend)" },
];

const versions = [{ value: "stable", label: "Stable (Latest)" }];

const availableFeatures = [
  {
    id: "auth",
    title: "Authentication",
    description:
      "Sign up, login, password reset, and social logins with Clerk/Auth.js",
    category: "Security",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    id: "billing",
    title: "Billing & Payments",
    description:
      "Stripe integration with subscriptions, invoices, and webhooks",
    category: "Payments",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "database",
    title: "Database Setup",
    description: "Pre-configured Postgres/Mongo with ORM (Prisma/SQLAlchemy)",
    category: "Data",
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: "api",
    title: "API Routes",
    description: "REST/GraphQL endpoints with error handling and validation",
    category: "Backend",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: "email",
    title: "Email Service",
    description:
      "Transactional emails (welcome, reset password) via Resend/SendGrid",
    category: "Communication",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Real-time in-app and push notifications",
    category: "Communication",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    id: "admin",
    title: "Admin Dashboard",
    description: "Role-based access, user management, and system monitoring",
    category: "Management",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "cms",
    title: "Content Management",
    description: "Headless CMS integration (Sanity/Strapi) for content editing",
    category: "Content",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Basic user analytics with privacy-first setup",
    category: "Insights",
    icon: <BarChart className="h-4 w-4" />,
  },
  {
    id: "logging",
    title: "Logging & Monitoring",
    description: "Error logging with Sentry and server health monitoring",
    category: "Insights",
    icon: <Activity className="h-4 w-4" />,
  },
  {
    id: "ci-cd",
    title: "CI/CD Setup",
    description: "GitHub Actions pre-configured for testing & deployments",
    category: "DevOps",
    icon: <GitBranch className="h-4 w-4" />,
  },
  {
    id: "docker",
    title: "Docker Setup",
    description: "Pre-configured Dockerfile and docker-compose for local dev",
    category: "DevOps",
    icon: <Box className="h-4 w-4" />,
  },
];

// --- Component ---
export default function Dashboard() {
  const { isLoaded, userId } = useAuth();
  const [stack, setStack] = useState<string>("nextjs-ts");
  const [version, setVersion] = useState<string>("stable");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const router = useRouter();

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleGenerate = async () => {
    try {
      const projectData: ProjectInput = {
        stack,
        version,
        features: selectedFeatures,
        userId: userId || "anonymous-user",
      };

      const response = await generateProject(projectData);

      toast.success("Project generated successfully!");
      router.push(`/result/${response.manifest.id}`);
    } catch (error) {
      toast.error("Failed to generate project. Please try again.");
      console.error("Generation error:", error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showAuth={true} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuth={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Project Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Configure your project settings and select the features you need.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stack Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Tech Stack</CardTitle>
                <CardDescription>
                  Choose your preferred framework and language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={stack} onValueChange={setStack}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tech stack" />
                  </SelectTrigger>
                  <SelectContent>
                    {stacks.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Version Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Framework Version</CardTitle>
                <CardDescription>
                  Select the version you want to use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={version} onValueChange={setVersion}>
                  {versions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Card>
              <CardContent className="pt-6">
                <GenerateButton
                  onGenerate={handleGenerate}
                  selectedFeatures={selectedFeatures}
                />
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">
                Features ({selectedFeatures.length} selected)
              </h2>
              <p className="text-muted-foreground">
                Select the features you want to include in your project.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableFeatures.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  title={feature.title}
                  description={feature.description}
                  category={feature.category}
                  icon={feature.icon}
                  isSelected={selectedFeatures.includes(feature.id)}
                  onToggle={() => toggleFeature(feature.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
