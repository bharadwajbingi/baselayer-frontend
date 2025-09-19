'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner, PulseLoader } from '@/components/loading-spinner';
import { Download, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  className 
}: GenerateButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  const loadingStages = [
    'Initializing project...',
    'Installing dependencies...',
    'Configuring features...',
    'Finalizing setup...'
  ];

  const handleGenerate = async () => {
    if (selectedFeatures.length === 0) return;
    
    setIsGenerating(true);
    setLoadingStage(0);

    // Simulate loading stages
    const stageInterval = setInterval(() => {
      setLoadingStage(prev => {
        if (prev < loadingStages.length - 1) {
          return prev + 1;
        }
        clearInterval(stageInterval);
        return prev;
      });
    }, 1500);

    try {
      await onGenerate();
    } finally {
      clearInterval(stageInterval);
      setIsGenerating(false);
      setLoadingStage(0);
    }
  };

  const isDisabled = disabled || selectedFeatures.length === 0 || isGenerating;

  return (
    <div className={cn('space-y-4', className)}>
      <Button 
        onClick={handleGenerate}
        disabled={isDisabled}
        size="lg"
        className={cn(
          'w-full relative overflow-hidden transition-all duration-300',
          'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary',
          'shadow-lg hover:shadow-xl',
          isGenerating && 'cursor-not-allowed'
        )}
      >
        <div className="flex items-center justify-center gap-3">
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" className="text-primary-foreground" />
              <span className="font-medium">Generating...</span>
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              <span className="font-medium">Generate Project</span>
              <Zap className="h-4 w-4 opacity-70" />
            </>
          )}
        </div>
        
        {/* Animated background effect */}
        {isGenerating && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
        )}
      </Button>

      {/* Loading status */}
      {isGenerating && (
        <div className="flex flex-col items-center space-y-3 p-4 bg-muted/30 rounded-lg border">
          <div className="flex items-center space-x-3">
            <PulseLoader />
            <span className="text-sm font-medium text-muted-foreground">
              {loadingStages[loadingStage]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            This usually takes 10–30 seconds
          </p>
        </div>
      )}

      {/* Feature count indicator */}
      {!isGenerating && (
        <p className="text-sm text-muted-foreground text-center">
          {selectedFeatures.length === 0 
            ? 'Select at least one feature to continue' 
            : `${selectedFeatures.length} feature${selectedFeatures.length !== 1 ? 's' : ''} selected`
          }
        </p>
      )}
    </div>
  );
}