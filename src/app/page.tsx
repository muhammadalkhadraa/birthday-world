"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ScrollIntro } from "@/components/ScrollIntro";
import { TransitionOverlay } from "@/components/TransitionOverlay";
import { HeroSection } from "@/components/HeroSection";
import { CakeScene } from "@/components/CakeScene";
import { LetterScene } from "@/components/LetterScene";
import { FinalScene } from "@/components/FinalScene";
import { AudioModal } from "@/components/AudioModal";
import { AudioControl } from "@/components/AudioControl";
import { FrameManager } from "@/lib/frameLoader";
import { AudioManager } from "@/lib/audioManager";

export default function BirthdayPage() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [transitionOpacity, setTransitionOpacity] = useState<number>(0);
  const [isHeroActive, setIsHeroActive] = useState<boolean>(false);
  const [, setHandoffProgress] = useState<number>(0);
  const [showCakeScene, setShowCakeScene] = useState<boolean>(false);
  const [showLetterScene, setShowLetterScene] = useState<boolean>(false);
  const [showFinalScene, setShowFinalScene] = useState<boolean>(false);

  // Initialize persistent singletons
  const frameManager = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new FrameManager();
  }, []);

  const audioManager = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new AudioManager("/audio/intro.mp3");
  }, []);

  // Allow direct testing of scenes via query parameters (?final=true, ?letter=true, ?cake=true)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("final") === "true" || params.has("testFinal")) {
        setIsUnlocked(true);
        setShowCakeScene(false);
        setShowLetterScene(false);
        setShowFinalScene(true);
      } else if (params.get("letter") === "true" || params.has("testLetter")) {
        setIsUnlocked(true);
        setShowCakeScene(false);
        setShowLetterScene(true);
      } else if (params.get("cake") === "true" || params.has("testCake")) {
        setIsUnlocked(true);
        setShowCakeScene(true);
      }
    }
  }, []);

  // Handle first user tap to unlock audio & start experience
  const handleStartExperience = useCallback(async () => {
    if (audioManager) {
      await audioManager.unlock();
      setIsMuted(audioManager.getMuted());
    }
    setIsUnlocked(true);
  }, [audioManager]);

  // Handle sound mute toggle
  const handleToggleMute = useCallback(() => {
    if (audioManager) {
      const muted = audioManager.toggleMute();
      setIsMuted(muted);
    }
  }, [audioManager]);

  // Transition from Hero to Cake Scene
  const handleStartCakeScene = useCallback(() => {
    setShowCakeScene(true);
  }, []);

  // Transition from Cake Scene to Birthday Letter Scene
  const handleOpenLetter = useCallback(() => {
    setShowCakeScene(false);
    setShowLetterScene(true);
  }, []);

  // Transition from Letter Scene to final website ending (Section 1)
  const handleFinishLetter = useCallback(() => {
    setShowLetterScene(false);
    setShowFinalScene(true);
  }, []);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audioManager?.destroy();
      frameManager?.destroy();
    };
  }, [audioManager, frameManager]);

  return (
    <main className="relative w-full min-h-screen bg-[#080608] selection:bg-gold/20 selection:text-gold-light">
      {/* 1. Mobile Audio Autoplay Modal (Prompt Section 19 - z-50) */}
      <AudioModal
        isOpen={!isUnlocked && !showCakeScene && !showLetterScene && !showFinalScene}
        onStart={handleStartExperience}
      />

      {/* 2. Top-Right Audio Control (Visible during Intro only - z-40) */}
      <AudioControl
        isMuted={isMuted}
        isVisible={isUnlocked && !isHeroActive && !showCakeScene && !showLetterScene && !showFinalScene}
        onToggle={handleToggleMute}
      />

      {/* 3. Soft Handoff Transition Overlay (Prompt Section 1 & 8 - z-30) */}
      <TransitionOverlay opacity={transitionOpacity} />

      {/* 4. Cinematic Fixed Scroll Intro (Prompt Section 1 & 2 - z-20) */}
      {!showCakeScene && !showLetterScene && !showFinalScene && (
        <ScrollIntro
          frameManager={frameManager}
          audioManager={audioManager}
          isUnlocked={isUnlocked}
          onHandoffProgress={setHandoffProgress}
          onHeroReached={setIsHeroActive}
          onTransitionOpacityChange={setTransitionOpacity}
        />
      )}

      {/* 5. Static Hero Section positioned UNDER the intro - z-10 */}
      {!showCakeScene && !showLetterScene && !showFinalScene && (
        <HeroSection
          isActive={isHeroActive}
          onExploreClick={handleStartCakeScene}
        />
      )}

      {/* 6. Interactive Birthday Cake Scene for Toka (Section 2 - z-30) */}
      {showCakeScene && (
        <CakeScene onOpenLetter={handleOpenLetter} />
      )}

      {/* 7. Romantic Birthday Letter Scene (Prompt Section 1 - 19 - z-30) */}
      {showLetterScene && (
        <LetterScene onFinishLetter={handleFinishLetter} />
      )}

      {/* 8. Final Ending Scene (Prompt Section 1 - 14 - z-30) */}
      {showFinalScene && (
        <FinalScene />
      )}
    </main>
  );
}
