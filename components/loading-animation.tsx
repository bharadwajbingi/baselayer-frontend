"use client";

import { useEffect, useRef, useState } from "react";

interface SimpleLoadingProps {
  isGenerating: boolean;
  steps?: string[];
  /** total time per step in ms (including fade out + fade in) */
  stepDuration?: number;
  /** fade duration in ms (should be < stepDuration) */
  fadeDuration?: number;
  /** scale multiplier for the loader (1 = default size). Use e.g. 1.6 or 2 */
  size?: number;
}

export default function SimpleLoading({
  isGenerating,
  steps = [
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
  ],
  stepDuration = 2000,
  fadeDuration = 700,
  size = 2,
}: SimpleLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // cleanup helper
    const clearAll = () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };

    if (!isGenerating) {
      clearAll();
      setVisible(true); // reset visible for next run
      return;
    }

    // safety: ensure sensible timings
    const safeFade = Math.max(0, Math.min(fadeDuration, stepDuration - 50));
    const visibleTime = stepDuration - safeFade; // how long text stays visible before fading out

    // start with visible text
    setVisible(true);

    // loop function
    const loop = () => {
      // wait visibleTime, then fade out
      const t1 = setTimeout(() => {
        setVisible(false);

        // after fade completes, update step and show again
        const t2 = setTimeout(() => {
          setCurrentStep((prev) => (prev + 1) % steps.length);
          setVisible(true);

          // schedule next cycle
          loop();
        }, safeFade);

        timersRef.current.push(t2);
      }, visibleTime);

      timersRef.current.push(t1);
    };

    loop();

    return () => {
      clearAll();
    };
  }, [isGenerating, steps.length, stepDuration, fadeDuration]);

  if (!isGenerating) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-2">
      {/* Scaled DaisyUI Infinity Loader */}
      <span
        className="loading loading-infinity loading-xl inline-block"
        style={{
          transform: `scale(${size})`,
          display: "inline-block",
        }}
        aria-hidden="true"
      />

      {/* One Step at a Time with fade-in/out */}
      <div className="relative h-6 w-full flex items-center justify-center pt-2">
        <p
          // transition classes — duration should match fadeDuration prop
          className={`absolute text-center text-sm text-muted-foreground transition-opacity ease-in-out ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          // keep screen readers aware of the changing content
          aria-live="polite"
          // inline style to make Tailwind duration match fadeDuration prop
          style={{ transitionDuration: `${fadeDuration}ms` }}
        >
          {steps[currentStep]}
        </p>
      </div>
    </div>
  );
}
