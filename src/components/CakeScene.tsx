"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { BirthdayCake, CandleState } from "./BirthdayCake";
import { FloatingPetals } from "./FloatingPetals";
import { BirthdayAudioController } from "./BirthdayAudio";
import { Mail, Sparkles } from "lucide-react";

interface CakeSceneProps {
  onOpenLetter: () => void;
}

const INITIAL_CANDLES: CandleState[] = [
  { id: 1, extinguished: false, xPercent: 34, yPercent: 19, flickerDuration: 1.0 },
  { id: 2, extinguished: false, xPercent: 42, yPercent: 16.5, flickerDuration: 1.15 },
  { id: 3, extinguished: false, xPercent: 50, yPercent: 15, flickerDuration: 0.92 },
  { id: 4, extinguished: false, xPercent: 58, yPercent: 16.5, flickerDuration: 1.08 },
  { id: 5, extinguished: false, xPercent: 66, yPercent: 19, flickerDuration: 0.97 },
];

export const CakeScene: React.FC<CakeSceneProps> = ({ onOpenLetter }) => {
  const [candles, setCandles] = useState<CandleState[]>(INITIAL_CANDLES);
  const [celebrationStarted, setCelebrationStarted] = useState<boolean>(false);
  const [showNextButton, setShowNextButton] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const celebrationTriggeredRef = useRef<boolean>(false);
  const audioController = useRef(BirthdayAudioController.getInstance());

  // Extinguish individual candle
  const handleExtinguishCandle = useCallback((id: number) => {
    setCandles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, extinguished: true } : c))
    );
  }, []);

  // Easier mobile accessibility: tap cake to extinguish next lit candle
  const handleCakeTapFallback = useCallback(() => {
    setCandles((prev) => {
      const nextLit = prev.find((c) => !c.extinguished);
      if (!nextLit) return prev;
      return prev.map((c) =>
        c.id === nextLit.id ? { ...c, extinguished: true } : c
      );
    });
  }, []);

  // Check when all candles are extinguished
  useEffect(() => {
    const allExtinguished = candles.every((c) => c.extinguished);

    if (allExtinguished && !celebrationTriggeredRef.current) {
      celebrationTriggeredRef.current = true;

      // Section 13: Pause 300ms then trigger celebration
      const timer = setTimeout(() => {
        setCelebrationStarted(true);

        // Section 14: Confetti bursts from bottom-left & bottom-right
        const count = 35;
        const colors = ["#F7D1D5", "#FFFDF9", "#D4AF37", "#4A0E17", "#E57373"];

        confetti({
          particleCount: count,
          angle: 60,
          spread: 55,
          origin: { x: 0.1, y: 0.8 },
          colors: colors,
          disableForReducedMotion: true,
        });

        confetti({
          particleCount: count,
          angle: 120,
          spread: 55,
          origin: { x: 0.9, y: 0.8 },
          colors: colors,
          disableForReducedMotion: true,
        });

        setTimeout(() => {
          confetti({
            particleCount: 40,
            spread: 70,
            origin: { x: 0.5, y: 0.75 },
            colors: colors,
            disableForReducedMotion: true,
          });
        }, 350);

        // Section 16: Fade audio down smoothly after celebration
        setTimeout(() => {
          audioController.current.fadeOutAndPause(1400);
        }, 2200);

        // Section 17: Show next button after 800ms
        setTimeout(() => {
          setShowNextButton(true);
        }, 1200);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [candles]);

  // Handle Letter button tap (Prompt Section 1: fade out opacity 1 -> 0, translateY 0 -> -15px, fade music to 0)
  const handleOpenLetterClick = () => {
    setIsExiting(true);
    audioController.current.fadeOutAndPause(600);
    setTimeout(() => {
      onOpenLetter();
    }, 600);
  };

  return (
    <div
      id="cake-scene"
      className="fixed inset-0 z-30 w-full h-[100svh] overflow-hidden flex flex-col items-center justify-between select-none"
      style={{
        backgroundImage: "url(/images/cake-garden-bg.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "env(safe-area-inset-top, 24px)",
        paddingBottom: "env(safe-area-inset-bottom, 24px)",
      }}
    >
      {/* Whole Scene Content with Exit Animation (opacity: 1 -> 0, y: 0 -> -15px, 600ms) */}
      <motion.div
        animate={
          isExiting
            ? { opacity: 0, y: -15, transition: { duration: 0.6, ease: "easeInOut" } }
            : { opacity: 1, y: 0 }
        }
        className="relative z-10 w-full h-full flex flex-col items-center justify-between"
      >
      {/* Subtle garden atmosphere overlay (Section 3) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(20,10,15,0.12) 0%, rgba(20,10,15,0.22) 50%, rgba(20,10,15,0.40) 100%)",
        }}
      />

      {/* Subtle radial vignette around edges */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(10,5,8,0.55) 100%)",
        }}
      />

      {/* Atmospheric drifting flower petals (Section 4) */}
      <FloatingPetals />

      {/* Top Header & Instruction Texts (Section 9 & 15) */}
      <div className="relative z-20 w-full max-w-sm px-6 pt-6 sm:pt-10 flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          {!celebrationStarted ? (
            <motion.div
              key="wish-instructions"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15, transition: { duration: 0.4 } }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="mb-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md border border-gold/30">
                <Sparkles className="w-3.5 h-3.5 text-gold-light animate-pulse" />
                <span className="text-xs font-arabic text-champagne-light">
                  لحظة الاحتفال
                </span>
              </div>

              <h2 className="text-2xl min-[360px]:text-3xl font-extrabold text-ivory font-arabic drop-shadow-md mb-1.5 leading-snug">
                اتمني أمنية الأول 🎂
              </h2>
              <p className="text-sm min-[360px]:text-base text-champagne/90 font-arabic font-medium drop-shadow">
                وبعدين اطفي الشمع ✨
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="birthday-congrats"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <h2 className="text-2xl min-[360px]:text-3xl sm:text-4xl font-extrabold font-arabic text-ivory drop-shadow-[0_0_20px_rgba(212,175,55,0.7)] leading-tight mb-2">
                كل سنة وانتي طيبة يا تقى ❤️
              </h2>
              <p className="text-sm sm:text-base text-gold-light font-arabic font-medium tracking-wide">
                عسى كل أمنياتك تتحقق في سنتك الجديدة
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Middle: 2.5D Layered Birthday Cake & Candles (Section 5 & 6) */}
      <div
        className={`relative z-20 flex-1 flex items-center justify-center w-full px-4 transition-opacity duration-500 ${
          isExiting ? "opacity-0" : "opacity-100"
        }`}
      >
        <BirthdayCake
          candles={candles}
          onExtinguishCandle={handleExtinguishCandle}
          onCakeTapFallback={handleCakeTapFallback}
        />
      </div>

      {/* Bottom Area: Next Button "افتحي رسالتك 💌" (Section 17 & 18) */}
      <div className="relative z-20 w-full max-w-sm px-6 pb-6 sm:pb-8 flex flex-col items-center justify-center min-h-[72px]">
        <AnimatePresence>
          {showNextButton && !isExiting && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full sm:w-auto"
            >
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={handleOpenLetterClick}
                className="group relative flex items-center justify-center gap-3 w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-full bg-ivory/15 hover:bg-ivory/25 backdrop-blur-md border border-gold/45 text-ivory shadow-[0_0_25px_rgba(212,175,55,0.35)] transition-all cursor-pointer active:scale-[0.96]"
              >
                <Mail className="w-5 h-5 text-gold-light stroke-[2.2]" />
                <span className="text-base sm:text-lg font-bold font-arabic text-amber-100 tracking-wide">
                  افتحي رسالتك 💌
                </span>
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/15 via-white/10 to-gold/15 pointer-events-none" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </motion.div>
    </div>
  );
};
