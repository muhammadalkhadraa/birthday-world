"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

interface EnvelopeProps {
  isOpen: boolean;
  onOpen: () => void;
  isOpening: boolean;
}

export const Envelope: React.FC<EnvelopeProps> = ({
  isOpen,
  onOpen,
  isOpening,
}) => {
  const [sealPopped, setSealPopped] = useState(false);

  const handleEnvelopeClick = () => {
    if (isOpening || isOpen) return;
    setSealPopped(true);
    // Allow wax seal to shrink & fade, then signal opening
    setTimeout(() => {
      onOpen();
    }, 250);
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* 5. Envelope Entrance & Gentle Idle Floating (Prompt Section 5) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={
          isOpen
            ? { opacity: 0.35, scale: 0.95, y: 40, transition: { duration: 0.7, ease: "easeOut" } }
            : {
                opacity: 1,
                scale: 1,
                y: [0, -4, 0],
                transition: {
                  opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  y: {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6,
                  },
                },
              }
        }
        id="envelope-card"
        onClick={handleEnvelopeClick}
        className={`relative cursor-pointer transition-transform duration-300 ${
          !isOpen && !isOpening ? "hover:scale-[1.02] active:scale-[0.98]" : ""
        }`}
        style={{
          width: "min(80vw, 340px)",
          height: "min(52vw, 220px)",
          perspective: "1200px",
        }}
      >
        {/* Soft atmospheric golden backglow */}
        <div
          aria-hidden="true"
          className="absolute -inset-4 rounded-3xl bg-gold/15 blur-2xl pointer-events-none transition-opacity duration-500"
          style={{ opacity: isOpen ? 0.2 : 0.8 }}
        />

        {/* Envelope Base Shadow */}
        <div
          aria-hidden="true"
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4/5 h-6 rounded-[50%] bg-black/45 blur-md pointer-events-none"
        />

        {/* Outer Envelope Wrapper */}
        <div className="relative w-full h-full rounded-2xl overflow-visible shadow-[0_16px_36px_rgba(0,0,0,0.38)] border border-gold/30 bg-[#F4EDE2]">
          {/* Back Wall & Pocket Interior Lining */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#E7DAC8] via-[#ECE1D2] to-[#E2D4C0] overflow-hidden">
            {/* Subtle paper grain texture */}
            <div
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#C5A059 0.75px, transparent 0.75px)",
                backgroundSize: "12px 12px",
              }}
            />
          </div>

          {/* Front Fold: Left, Right & Bottom Flaps creating real envelope pocket */}
          <svg
            viewBox="0 0 340 220"
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="pocketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FAF5EC" />
                <stop offset="60%" stopColor="#F5ECE0" />
                <stop offset="100%" stopColor="#EADECF" />
              </linearGradient>
              <linearGradient id="sideFlapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F3E9DC" />
                <stop offset="100%" stopColor="#EFE3D4" />
              </linearGradient>
              <filter id="flapShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="-2" stdDeviation="3" floodColor="#000000" floodOpacity="0.14" />
              </filter>
            </defs>

            {/* Left triangle flap */}
            <path
              d="M0 0 L155 125 L0 220 Z"
              fill="url(#sideFlapGrad)"
              stroke="#D4AF37"
              strokeWidth="0.75"
              strokeOpacity="0.35"
            />

            {/* Right triangle flap */}
            <path
              d="M340 0 L185 125 L340 220 Z"
              fill="url(#sideFlapGrad)"
              stroke="#D4AF37"
              strokeWidth="0.75"
              strokeOpacity="0.35"
            />

            {/* Bottom trapezoid/triangle pocket flap with soft upward shadow */}
            <path
              d="M0 220 L170 110 L340 220 Z"
              fill="url(#pocketGrad)"
              stroke="#D4AF37"
              strokeWidth="0.75"
              strokeOpacity="0.45"
              filter="url(#flapShadow)"
            />

            {/* Delicate gold corner accents on bottom pocket */}
            <path
              d="M10 215 L170 115 L330 215"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.5"
              strokeDasharray="3 3"
              strokeOpacity="0.4"
            />
          </svg>

          {/* Top Flap (Rotates upward 0 -> 160deg upon tapping, Section 7) */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={{
              rotateX: isOpening || isOpen ? 160 : 0,
            }}
            transition={{
              duration: 0.55,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              zIndex: isOpening || isOpen ? 5 : 20,
            }}
            className="absolute top-0 left-0 w-full h-[62%]"
          >
            {/* Front of Top Flap */}
            <svg
              viewBox="0 0 340 136"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="topFlapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FCF8F2" />
                  <stop offset="80%" stopColor="#F6EEE2" />
                  <stop offset="100%" stopColor="#EDE1D1" />
                </linearGradient>
                <filter id="topShadow" x="-10%" y="-10%" width="120%" height="130%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.22" />
                </filter>
              </defs>
              <path
                d="M0 0 L170 132 L340 0 Z"
                fill="url(#topFlapGrad)"
                stroke="#D4AF37"
                strokeWidth="0.8"
                strokeOpacity="0.45"
                filter="url(#topShadow)"
              />
              <path
                d="M12 4 L170 124 L328 4"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="0.5"
                strokeDasharray="4 2"
                strokeOpacity="0.5"
              />
            </svg>

            {/* Wax Seal (Section 4 & 7: Burgundy wax seal with gold crest, fades & scales down) */}
            <AnimatePresence>
              {!sealPopped && !isOpen && (
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  exit={{
                    scale: 0.2,
                    opacity: 0,
                    transition: { duration: 0.25, ease: "easeIn" },
                  }}
                  className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 flex items-center justify-center cursor-pointer pointer-events-auto"
                  style={{ zIndex: 30 }}
                >
                  {/* Wax Seal Outer Organic Ring */}
                  <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-[#8C1424] via-[#5C0A15] to-[#3B050D] shadow-[0_4px_14px_rgba(74,14,23,0.65)] border border-gold/60">
                    {/* Inner pressed ring */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gold/40 bg-gradient-to-tr from-[#6E121E] to-[#8C1424]">
                      <Heart className="w-4 h-4 text-amber-200 fill-amber-200/90 drop-shadow-sm" />
                    </div>

                    {/* Subtle golden wax sparkle accent */}
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gold-light/80 blur-[0.5px]" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      {/* 6. Tap Hint Text (Prompt Section 6: "دوسي على الظرف ✨") */}
      <AnimatePresence>
        {!isOpen && !isOpening && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-5 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/25 backdrop-blur-sm border border-gold/25 pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-light animate-pulse" />
            <span className="text-xs sm:text-sm font-arabic font-medium text-champagne-light drop-shadow">
              دوسي على الظرف ✨
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
