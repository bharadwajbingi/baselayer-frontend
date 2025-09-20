"use client";

import { useEffect, useState } from "react";

interface SimpleLoadingProps {
  isGenerating: boolean;
  steps?: string[];
}

export default function SimpleLoading({
  isGenerating,
  steps = ["Initializing", "Installing", "Configuring", "Finalizing"],
}: SimpleLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1500); // change step every 1.5s
    return () => clearInterval(interval);
  }, [isGenerating, steps.length]);

  if (!isGenerating) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-10">
      {/* Large DaisyUI Infinity Loader */}
      <span className="loading loading-infinity loading-xl text-primary"></span>

      {/* One Step at a Time */}
      <div className="relative h-6 w-full flex items-center justify-center">
        <p className="absolute text-center text-sm text-muted-foreground transition-opacity duration-700 opacity-100">
          {steps[currentStep]}
        </p>
      </div>
    </div>
  );
}
