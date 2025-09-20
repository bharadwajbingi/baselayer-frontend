"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Bell, Box, GitBranch, Activity } from "lucide-react";
import LoadingAnimation from "@components/loading-animation";

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
  // Generation simulation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const generationSteps = [
    "Initializing project structure...",
    "Installing dependencies...",
    "Configuring selected features...",
    "Finalizing setup...",
  ];

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleGenerate = async () => {
    if (!isLoaded || !userId) {
      router.push("/sign-up"); // redirect to Clerk signup page

      toast.error("You must be logged in to generate a project!");
      return;
    }
    if (selectedFeatures.length === 0) {
      toast.error("Select at least one feature!");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setCurrentStep(0);

    const generationDuration = 5000; // total animation duration in ms
    const stepDuration = generationDuration / generationSteps.length;

    // Simulate steps and progress
    for (let i = 0; i < generationSteps.length; i++) {
      setCurrentStep(i);

      const stepStart = (i / generationSteps.length) * 100;
      const stepEnd = ((i + 1) / generationSteps.length) * 100;

      const stepInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < stepEnd) return prev + 1;
          clearInterval(stepInterval);
          return prev;
        });
      }, stepDuration / (stepEnd - stepStart));

      await new Promise((resolve) => setTimeout(resolve, stepDuration));
    }

    // After animation, just show success toast for now
    toast.success("Project generation simulated successfully!");
    setIsGenerating(false);
    setProgress(0);
    setCurrentStep(0);
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
    <div className="min-h-screen bg-background lg:fixed">
      <Navbar showAuth={true} />
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:pl-20 lg:ml-10 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel (Sticky on large screens) */}
          <div className="lg:col-span-1 space-y-6 lg:sticky top-0 lg:mt-20">
            <div className="mb-6 pl-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Project Generator
              </h1>
              <p className="text-lg text-muted-foreground">
                Configure your project settings and select the features you
                need.
              </p>
            </div>
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

            {/* Generate Button (for large screens) */}
            <Card className="hidden lg:block">
              <CardContent className="pt-6">
                <GenerateButton
                  onGenerate={handleGenerate}
                  selectedFeatures={selectedFeatures}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Features + Simulation */}
          <div className="lg:col-span-2 h-[calc(100vh-100px)] lg:overflow-auto hide-scrollbar">
            {/* Before generation: show features */}
            {!isGenerating && (
              <>
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Select the features you want to include in your project.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              </>
            )}

            {/* During generation: show loading animation */}
            {isGenerating && (
              <div className="transform -translate-y-5 h-full">
                <LoadingAnimation
                  isGenerating={isGenerating}
                  steps={generationSteps}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Generate Button for Mobile */}
      <Card className="lg:hidden fixed bottom-0 left-0 right-0 z-50 py-4 px-6 bg-background">
        <CardContent className="pt-6">
          <GenerateButton
            onGenerate={handleGenerate}
            selectedFeatures={selectedFeatures}
          />
        </CardContent>
      </Card>
    </div>
  );
}
