"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FINAL_FRAME } from "@/lib/frameLoader";
import { BirthdayAudioController } from "./BirthdayAudio";
import { ArrowLeft, Sparkles } from "lucide-react";

interface HeroSectionProps {
  isActive: boolean;
  onExploreClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isActive,
  onExploreClick,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [showContent, setShowContent] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      // Wait approximately: 500ms, then fade in the hero content
      timer = setTimeout(() => {
        setShowContent(true);
      }, shouldReduceMotion ? 0 : 500);
    } else {
      setShowContent(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isActive, shouldReduceMotion]);

  const handleButtonClick = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Section 2: Unlock and start the birthday music during transition
    const audio = BirthdayAudioController.getInstance();
    audio.playAndFadeIn(0.65, 800);

    // Section 1: Animate out title, subtitle, button over 500ms
    setTimeout(() => {
      onExploreClick?.();
    }, 550);
  };

  return (
    <section
      id="hero-section"
      aria-label="Welcome Hero"
      className={`fixed inset-0 z-10 w-full h-[100svh] overflow-hidden flex flex-col justify-end sm:justify-center items-center text-center select-none transition-opacity duration-700 ease-out ${
        isActive ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{
        backgroundImage: `url(${FINAL_FRAME})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Subtle overlay for text readability without darkening heavily */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Hero Content Container */}
      <motion.div
        animate={
          isTransitioning
            ? { opacity: 0, y: -15, transition: { duration: 0.5, ease: "easeInOut" } }
            : { opacity: 1, y: 0 }
        }
        className="relative z-10 w-full max-w-xl mx-auto px-6 pb-12 sm:pb-0 flex flex-col items-center justify-center text-center"
        style={{
          paddingBottom: "max(3rem, env(safe-area-inset-bottom, 24px))",
        }}
      >
        {/* Decorative celestial badge */}
        {showContent && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/25 backdrop-blur-md border border-gold/30 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-light animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-champagne tracking-wider font-arabic">
              يوم ميلاد سعيد
            </span>
          </motion.div>
        )}

        {/* Title: opacity 0 -> 1, y 20px -> 0 */}
        {showContent && (
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl min-[360px]:text-4xl min-[410px]:text-5xl font-extrabold tracking-tight text-ivory font-arabic drop-shadow-md leading-tight mb-3"
          >
            أهلاً بيكي في عالمك ✨
          </motion.h1>
        )}

        {/* Subtitle: appears 200ms after title */}
        {showContent && (
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: shouldReduceMotion ? 0 : 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-base min-[360px]:text-lg sm:text-xl text-champagne/95 font-arabic font-normal leading-relaxed max-w-md drop-shadow mb-8 px-2"
          >
            كل حاجة هنا معمولة مخصوص علشانك.
          </motion.p>
        )}

        {/* Primary Button: appears 300ms after subtitle */}
        {showContent && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: shouldReduceMotion ? 0 : 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full sm:w-auto"
          >
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={handleButtonClick}
              className="group relative flex items-center justify-center gap-3 w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-gold/40 text-ivory shadow-gold-glow transition-all active:scale-[0.96]"
            >
              <span className="text-base sm:text-lg font-semibold font-arabic text-amber-100 tracking-wide">
                ابدئي الرحلة
              </span>
              <ArrowLeft className="w-5 h-5 text-gold-light stroke-[2.2] transition-transform duration-300 group-hover:-translate-x-1 group-active:-translate-x-1" />
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/10 via-white/10 to-gold/10 pointer-events-none" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};
