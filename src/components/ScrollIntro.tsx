"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FrameCanvas } from "./FrameCanvas";
import { FrameManager, TOTAL_FRAMES } from "@/lib/frameLoader";
import { AudioManager } from "@/lib/audioManager";
import { Loader2 } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollIntroProps {
  frameManager: FrameManager | null;
  audioManager: AudioManager | null;
  isUnlocked: boolean;
  onHandoffProgress: (progress: number) => void;
  onHeroReached: (reached: boolean) => void;
  onTransitionOpacityChange: (opacity: number) => void;
}

export const ScrollIntro: React.FC<ScrollIntroProps> = ({
  frameManager,
  audioManager,
  isUnlocked,
  onHandoffProgress,
  onHeroReached,
  onTransitionOpacityChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isHero, setIsHero] = useState<boolean>(false);

  // Initialize frame preloading
  useEffect(() => {
    if (!frameManager) return;

    frameManager.setCallbacks(
      () => {
        setIsReady(true);
      },
      (loaded) => {
        setLoadedCount(loaded);
      }
    );

    frameManager.initPreload().then(() => {
      setIsReady(true);
    });

    return () => {
      frameManager.destroy();
    };
  }, [frameManager]);

  // Set up GSAP ScrollTrigger
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isReady) return;

    // Prefers-reduced-motion check
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setCurrentFrameIndex(TOTAL_FRAMES - 1);
      setIsHero(true);
      onHeroReached(true);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5, // Responsive smooth scrub
        onUpdate: (self) => {
          const progress = self.progress;
          const frameIndex = Math.min(
            TOTAL_FRAMES - 1,
            Math.floor(progress * (TOTAL_FRAMES - 1))
          );

          setCurrentFrameIndex(frameIndex);
          frameManager?.updateTarget(frameIndex);
          audioManager?.syncToScroll(progress);
          onHandoffProgress(progress);

          // Section 8: TransitionOverlay softens handoff near the very end
          // 0 -> 0.35 -> 0 behavior between progress 0.91 and 1.00
          if (progress >= 0.91 && progress < 0.96) {
            const t = (progress - 0.91) / 0.05;
            onTransitionOpacityChange(t * 0.32);
          } else if (progress >= 0.96 && progress <= 1.0) {
            const t = (progress - 0.96) / 0.04;
            onTransitionOpacityChange((1 - t) * 0.32);
          } else {
            onTransitionOpacityChange(0);
          }

          // Section 7 & 9: Final frame handoff into HeroSection underneath
          if (progress >= 0.985) {
            setIsHero(true);
            onHeroReached(true);
            audioManager?.enterHero();
          } else {
            setIsHero(false);
            onHeroReached(false);
          }
        },
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [
    isReady,
    frameManager,
    audioManager,
    onHandoffProgress,
    onHeroReached,
    onTransitionOpacityChange,
  ]);

  return (
    <div
      ref={containerRef}
      id="scroll-intro-container"
      className="relative w-full"
      style={{ height: "500vh" }} // 500vh scroll distance to scrub through the video
    >
      {/* 
        Fixed Viewport Stage (z-20):
        Stays locked fullscreen in the viewport while scrolling so the video scrubs in place!
        Fades smoothly at the very end to reveal the exact matching HeroSection right underneath it.
      */}
      <div
        className={`fixed inset-0 z-20 w-full h-[100dvh] overflow-hidden flex items-center justify-center bg-[#080608] pointer-events-none transition-opacity duration-700 ease-out ${
          isHero ? "opacity-0" : "opacity-100"
        }`}
      >
        <FrameCanvas
          frameManager={frameManager}
          currentFrameIndex={currentFrameIndex}
          isReady={isReady}
        />

        {/* Minimal Black Loading Screen (Prompt Section 4) */}
        {!isReady && (
          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#080608] text-ivory transition-opacity duration-500 pointer-events-auto"
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-gold animate-spin stroke-[2]" />
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-arabic tracking-wide text-champagne-light">
                  لحظات ونبدأ...
                </span>
                <div className="w-36 h-1 rounded-full bg-stone-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold/60 to-gold transition-all duration-200"
                    style={{ width: `${Math.min(100, (loadedCount / 15) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subtle scroll cue indicator during start of intro */}
        {isReady && isUnlocked && currentFrameIndex < 30 && !isHero && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none opacity-80 animate-bounce">
            <span className="text-xs text-champagne/80 font-arabic tracking-wider">
              مرري للأسفل ✨
            </span>
            <div className="w-4 h-7 rounded-full border border-gold/40 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-gold animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
