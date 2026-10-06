"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { FloatingPetals } from "./FloatingPetals";
import { BirthdayAudioController } from "./BirthdayAudio";

export interface FinalSceneProps {}

const WHATSAPP_NUMBER = "201005421228";
const PREFILLED_MESSAGE = "شوفت الموقع ❤️ وعايزة أقولك رأيي...";

export const FinalScene: React.FC<FinalSceneProps> = () => {
  const shouldReduceMotion = useReducedMotion();
  const [showMainText, setShowMainText] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // 9. Ensure any lingering audio is faded out smoothly over 800ms and paused
  useEffect(() => {
    if (typeof window !== "undefined") {
      const audioController = BirthdayAudioController.getInstance();
      audioController.fadeOutAndPause(800);
    }
  }, []);

  // Timed sequence for calm, emotional pacing (Sections 3, 4, 5)
  useEffect(() => {
    // 3. Wait ~300ms, then reveal main final text
    const timer1 = setTimeout(() => {
      setShowMainText(true);
    }, shouldReduceMotion ? 0 : 300);

    // 4. Wait ~200ms after main text, then reveal subtitle
    const timer2 = setTimeout(() => {
      setShowSubtitle(true);
    }, shouldReduceMotion ? 0 : 550);

    // 5. Wait ~300ms after subtitle, then reveal WhatsApp button
    const timer3 = setTimeout(() => {
      setShowButton(true);
    }, shouldReduceMotion ? 0 : 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [shouldReduceMotion]);

  // Handle WhatsApp button tap (Sections 5, 6, 7)
  const handleOpenWhatsApp = () => {
    const encodedMessage = encodeURIComponent(PREFILLED_MESSAGE);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    if (typeof window !== "undefined") {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = whatsappUrl;
      } else {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <div
      id="final-scene"
      className="fixed inset-0 z-30 w-full h-[100svh] overflow-hidden flex flex-col items-center justify-center select-none"
      style={{
        backgroundImage: "url(/images/cake-garden-bg.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "env(safe-area-inset-top, 24px)",
        paddingBottom: "env(safe-area-inset-bottom, 24px)",
      }}
    >
      {/* 2. Final Background Overlay: subtle dark tint rgba(15, 8, 12, 0.25) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: "rgba(15, 8, 12, 0.25)",
        }}
      />

      {/* Subtle radial darkening towards edges for intimacy */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(10, 4, 8, 0.55) 100%)",
        }}
      />

      {/* Atmospheric gentle floating petals & soft warm glow */}
      <FloatingPetals />

      {/* Center Content Container (Sections 10 & 11) */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 w-full max-w-[90vw] sm:max-w-md">
        {/* 3. Main Final Text: "كده الموقع خلص ❤️" */}
        {showMainText && (
          <motion.h1
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 12, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.45,
              ease: "easeOut",
            }}
            className="text-2xl min-[360px]:text-3xl sm:text-4xl font-extrabold font-arabic text-ivory drop-shadow-[0_2px_15px_rgba(212,175,55,0.45)] mb-3 tracking-wide leading-snug"
          >
            كده الموقع خلص ❤️
          </motion.h1>
        )}

        {/* 4. Subtitle: "يارب يكون عجبك" */}
        {showSubtitle && (
          <motion.p
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
            className="text-base min-[360px]:text-lg sm:text-xl font-arabic font-normal text-champagne/90 drop-shadow mb-8 sm:mb-10"
          >
            يارب يكون عجبك
          </motion.p>
        )}

        {/* 5, 6, 7. WhatsApp CTA Button: "قوليلي رأيك 💬" */}
        {showButton && (
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
            className="flex flex-col items-center w-full"
          >
            <motion.button
              type="button"
              aria-label="قوليلي رأيك على واتساب"
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              onClick={handleOpenWhatsApp}
              className="group relative flex items-center justify-center gap-2.5 min-h-[48px] min-w-[180px] px-8 py-3.5 rounded-full bg-black/40 hover:bg-black/50 active:bg-black/60 backdrop-blur-xl border border-gold/45 text-ivory shadow-[0_8px_30px_rgba(0,0,0,0.45),0_0_20px_rgba(212,175,55,0.25)] transition-all cursor-pointer"
            >
              {/* Subtle pulsing glow ring */}
              <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-gold/20 via-pink-500/15 to-gold/20 blur-sm pointer-events-none opacity-75 group-hover:opacity-100 transition-opacity" />

              <MessageCircle className="relative z-10 w-5 h-5 text-emerald-400 stroke-[2.2]" />
              <span className="relative z-10 text-base sm:text-lg font-bold font-arabic text-amber-100 tracking-wide">
                قوليلي رأيك 💬
              </span>

              {/* Shimmer overlay */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            </motion.button>

            {/* 8. Optional Small Text: "مستني رأيك 👀" */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-3.5 text-xs sm:text-sm font-arabic font-light text-champagne/70 drop-shadow-sm select-none"
            >
              مستني رأيك 👀
            </motion.span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
