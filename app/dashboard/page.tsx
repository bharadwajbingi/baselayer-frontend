"use client";

import { useClerk } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  Activity,
  BarChart,
  Bell,
  Box,
  Brain,
  Building,
  CreditCard,
  FileText,
  Folder,
  Globe,
  Globe2,
  GitBranch,
  List,
  Lock,
  Mail,
  Paintbrush,
  Search,
  Shield,
  Smartphone,
  Zap,
  Users,
  Clock,
} from "lucide-react";

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
import ProjectReadyCard from "@/components/result";

/**
 * STORAGE KEYS
 * We only store "pending generation" in localStorage to support resume
 * across auth redirects. We DO NOT persist the form fields on each change.
 */
const STORAGE_KEYS = {
  pending: "pg_pendingGeneration",
};

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
    icon: <Folder className="h-4 w-4" />,
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
  {
    id: "multi-tenancy",
    title: "Multi-Tenancy",
    description: "Support for workspaces, teams, and organizations",
    category: "Management",
    icon: <Building className="h-4 w-4" />,
  },
  {
    id: "rbac",
    title: "Role-Based Access Control",
    description: "Fine-grained user roles and permissions",
    category: "Security",
    icon: <Lock className="h-4 w-4" />,
  },
  {
    id: "file-storage",
    title: "File Storage",
    description: "Upload, manage, and serve files via AWS S3/Cloudflare R2",
    category: "Data",
    icon: <Folder className="h-4 w-4" />,
  },
  {
    id: "search",
    title: "Full-Text Search",
    description:
      "Search across content and data with Elastic/Lucene/Meilisearch",
    category: "Insights",
    icon: <Search className="h-4 w-4" />,
  },
  {
    id: "i18n",
    title: "Internationalization",
    description: "Multi-language and localization support",
    category: "Content",
    icon: <Globe className="h-4 w-4" />,
  },
  {
    id: "webhooks",
    title: "Webhooks",
    description: "Send and receive webhooks for external integrations",
    category: "Backend",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: "ai-integration",
    title: "AI/ML Features",
    description: "LLM integration (chat, summarization, embeddings, etc.)",
    category: "Insights",
    icon: <Brain className="h-4 w-4" />,
  },
  {
    id: "audit-logs",
    title: "Audit Logs",
    description: "Track user actions and system changes for compliance",
    category: "Security",
    icon: <List className="h-4 w-4" />,
  },
  {
    id: "custom-domains",
    title: "Custom Domains",
    description: "Users can bring their own domain with SSL support",
    category: "DevOps",
    icon: <Globe2 className="h-4 w-4" />,
  },
  {
    id: "theming",
    title: "Custom Theming",
    description: "User-specific themes, branding, and white-labeling",
    category: "Content",
    icon: <Paintbrush className="h-4 w-4" />,
  },
  {
    id: "mobile-app",
    title: "Mobile App Support",
    description: "API & components ready for React Native / Flutter clients",
    category: "Frontend",
    icon: <Smartphone className="h-4 w-4" />,
  },
  {
    id: "scheduler",
    title: "Task Scheduler",
    description: "Background jobs and cron tasks with BullMQ/Sidekiq",
    category: "Backend",
    icon: <Clock className="h-4 w-4" />,
  },
];

export default function Dashboard() {
  const { isLoaded, userId } = useAuth();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const pathname = usePathname();

  // form state (only in-memory; NOT persisted automatically)
  const [stack, setStack] = useState<string>("nextjs-ts");
  const [version, setVersion] = useState<string>("stable");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [, setProgress] = useState(0);
  const [, setCurrentStep] = useState(0);

  // results
  const [showResult, setShowResult] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState<string>("test.txt");
  const [manifest, setManifest] = useState<unknown | null>(null);

  const pendingResumeRef = useRef(false);
  const prevPathRef = useRef<string | null>(null);

  const generationSteps = [
    "Cooking your boilerplate...",
    "Adding some magic...",
    "Mixing ingredients...",
    "Whipping up your project...",
    "Applying secret sauce...",
    "Fine-tuning everything...",
    "Almost ready...",
    "Putting final touches...",
    "Your project is getting spicy...",
    "Serving hot soon...",
  ];

  const toggleFeature = (featureId: string) =>
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );

  // Save pending to localStorage only when unauthenticated user clicks "Generate"
  const savePendingToLocal = (payload: {
    stack: string;
    version: string;
    features: string[];
  }) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.pending,
        JSON.stringify({ ...payload, createdAt: Date.now() })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const clearPending = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.pending);
    } catch {}
  };

  // core generation routine (used for initial start and resume)
  const startGeneration = async (payload?: {
    stack?: string;
    version?: string;
    features?: string[];
  }) => {
    const genStack = payload?.stack ?? stack;
    const genVersion = payload?.version ?? version;
    const genFeatures = payload?.features ?? selectedFeatures;

    if (!genFeatures || genFeatures.length === 0) {
      toast.error("Select at least one feature!");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setCurrentStep(0);

    try {
      const data = {
        zipUrl: "/dummy/project.zip",
        manifest: {
          id: "demo-123",
          stack: genStack,
          version: genVersion,
          features: genFeatures,
          summary: "Demo project boilerplate generated for preview.",
        },
      };

      // Simulate progress
      const generationDuration = 5000;
      const stepDuration = generationDuration / generationSteps.length;

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
        }, Math.max(10, stepDuration / Math.max(1, stepEnd - stepStart)));

        await new Promise((resolve) => setTimeout(resolve, stepDuration));
      }

      // Download the dummy zip (must exist in public/)
      const fileResponse = await fetch(data.zipUrl);
      const blob = await fileResponse.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      setDownloadUrl(objectUrl);
      setDownloadFileName(
        (data.zipUrl && data.zipUrl.split("/").pop()) || "project.zip"
      );
      setManifest(data.manifest);

      // clean pending (if any)
      clearPending();

      setIsGenerating(false);
      setShowResult(true);
      setProgress(100);
      setCurrentStep(0);
    } catch (err) {
      console.error("Error generating project:", err);
      toast.error("Error generating project!");
      setIsGenerating(false);
    }
  };

  // Handle clicking generate
  const handleGenerate = async () => {
    // if not loaded or not logged in -> save pending and open sign-in
    if (!isLoaded || !userId) {
      savePendingToLocal({ stack, version, features: selectedFeatures });

      if (typeof openSignIn === "function") {
        openSignIn();
      } else {
        router.push("/sign-in");
      }

      toast("Please sign in to continue generation.");
      return;
    }

    // If logged in, start right away
    startGeneration();
  };

  // Resume pending generation after sign-in (only once)
  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) return;

    if (pendingResumeRef.current) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.pending);
      if (!raw) return;
      const pending = JSON.parse(raw);
      if (
        pending &&
        Array.isArray(pending.features) &&
        pending.features.length
      ) {
        pendingResumeRef.current = true;
        setTimeout(() => {
          toast.success("Resuming generation...");
          // apply pending features into state (so UI reflects them while generating)
          setStack(pending.stack || stack);
          setVersion(pending.version || version);
          setSelectedFeatures(pending.features || selectedFeatures);

          startGeneration({
            stack: pending.stack,
            version: pending.version,
            features: pending.features,
          });
        }, 300);
      }
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, userId]);

  // Clear selections when user navigates to Home ("/")
  useEffect(() => {
    // const prev = prevPathRef.current;
    // if the current path is "/" clear the selections
    if (pathname === "/") {
      setStack("nextjs-ts");
      setVersion("stable");
      setSelectedFeatures([]);
      // Also clear any pending generation since user intentionally left to home
      clearPending();
      pendingResumeRef.current = false;
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  // Download helper
  const handleDownloadClick = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = downloadFileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success("Download started");
  };

  // Back to dashboard (keep selections cleared or not depending on your preference)
  // You asked that going back to home resets; here Back just returns to selection state (not clearing unless
  // they actually navigated to home).
  const handleBackToDashboard = () => {
    if (downloadUrl) {
      window.URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
    setShowResult(false);
    setIsGenerating(false);
    setProgress(0);
    setCurrentStep(0);
    setSelectedFeatures([]);
    // do NOT clear selectedFeatures here so user can tweak; the requirement
    // was only to start fresh when they go to Home.
  };

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (downloadUrl) window.URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

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
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:pl-20 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div
            className={`lg:col-span-1 space-y-6 lg:sticky top-0 lg:mt-20 ${
              isGenerating || showResult ? "hidden lg:block" : ""
            }`}
          >
            <div className="mb-6 pl-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Project Generator
              </h1>
              <p className="text-lg text-muted-foreground">
                Configure your project settings and select the features you
                need.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tech Stack</CardTitle>
                <CardDescription>
                  Choose your preferred framework and language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={stack}
                  onValueChange={(v: string) => setStack(v)}
                >
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

            <Card>
              <CardHeader>
                <CardTitle>Framework Version</CardTitle>
                <CardDescription>
                  Select the version you want to use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={version}
                  onValueChange={(v: string) => setVersion(v)}
                >
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

            <Card className="hidden lg:block">
              <CardContent className="pt-6">
                <div
                  className={
                    isGenerating || showResult
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }
                >
                  <GenerateButton
                    onGenerate={handleGenerate}
                    selectedFeatures={selectedFeatures}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 h-[calc(100vh-150px)] lg:overflow-auto hide-scrollbar lg:pr-10 ">
            {!isGenerating && !showResult && (
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

            {isGenerating && (
              <div className="transform -translate-y-5 h-full">
                <LoadingAnimation
                  isGenerating={isGenerating}
                  steps={generationSteps}
                />
              </div>
            )}

            {showResult && (
              <div className="lg:col-span-2  h-full lg:overflow-auto hide-scrollbar ">
                <ProjectReadyCard
                  stack="Next.js + TS"
                  version="1.0.0"
                  selectedFeatures={selectedFeatures}
                  availableFeatures={availableFeatures}
                  manifest={manifest}
                  downloadUrl={downloadUrl}
                  handleBackToDashboard={handleBackToDashboard}
                  handleDownloadClick={handleDownloadClick}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile floating generate */}
      <Card className="lg:hidden fixed bottom-0 left-0 right-0 z-50 py-4 px-6 bg-background">
        <CardContent className="pt-6">
          <div
            className={
              isGenerating || showResult ? "opacity-50 pointer-events-none" : ""
            }
          >
            <GenerateButton
              onGenerate={handleGenerate}
              selectedFeatures={selectedFeatures}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
