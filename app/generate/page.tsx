"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/navbar";
import { CheckCircle } from "lucide-react";
import { ProgressSpinner } from "@/components/loading-spinner";
import { Loader2 } from "lucide-react";

const generationSteps = [
  "Initializing project structure...",
  "Installing dependencies...",
  "Configuring selected features...",
  "Setting up authentication...",
  "Configuring database...",
  "Generating API routes...",
  "Finalizing project...",
  "Creating download package...",
];

export default function GeneratePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < generationSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 2;
        }
        setIsComplete(true);
        setTimeout(() => {
          router.push("/result/demo-project-123");
        }, 1500);
        return prev;
      });
    }, 300);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Generating Your Project
          </h1>
          <p className="text-lg text-muted-foreground">
            We&apos;re creating your custom boilerplate with the selected
            features.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-6">
              {isComplete ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <ProgressSpinner progress={progress} className="w-16 h-16" />
              )}
            </div>

            <div className="space-y-4">
              <Progress value={progress} className="w-full h-2" />

              <div className="text-center">
                <p className="text-lg font-medium text-foreground mb-2">
                  {isComplete
                    ? "Generation Complete!"
                    : generationSteps[currentStep]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isComplete
                    ? "Redirecting to your project..."
                    : `${progress}% complete`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {generationSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                index <= currentStep
                  ? "text-foreground bg-muted/50"
                  : "text-muted-foreground"
              }`}
            >
              {index < currentStep ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : index === currentStep ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
              )}
              <span className="text-sm">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
