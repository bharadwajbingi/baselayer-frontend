"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerateButtonProps {
  onGenerate: () => Promise<void>;
  disabled?: boolean;
  selectedFeatures: string[];
  className?: string;
}

export function GenerateButton({
  onGenerate,
  disabled,
  selectedFeatures,
  className,
}: GenerateButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (selectedFeatures.length === 0) return;

    setIsGenerating(true);
    try {
      await onGenerate();
    } finally {
      setIsGenerating(false);
    }
  };

  const isDisabled = disabled || selectedFeatures.length === 0 || isGenerating;

  return (
    <div className={cn("space-y-2", className)}>
      <Button
        onClick={handleGenerate}
        disabled={isDisabled}
        size="lg"
        className={cn(
          "w-full transition-all duration-300",
          "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary",
          "shadow-lg hover:shadow-xl",
          isGenerating && "cursor-not-allowed"
        )}
      >
        <div className="flex items-center justify-center gap-3">
          {isGenerating ? (
            <span className="font-medium">Generating...</span>
          ) : (
            <>
              <Download className="h-5 w-5" />
              <span className="font-medium">Generate Project</span>
              <Zap className="h-4 w-4 opacity-70" />
            </>
          )}
        </div>
      </Button>

      {/* Feature count indicator */}
      {!isGenerating && (
        <p className="text-sm text-muted-foreground text-center">
          {selectedFeatures.length === 0
            ? "Select at least one feature to continue"
            : `${selectedFeatures.length} feature${
                selectedFeatures.length !== 1 ? "s" : ""
              } selected`}
        </p>
      )}
    </div>
  );
}
