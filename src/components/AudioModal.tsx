"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Volume2 } from "lucide-react";

interface AudioModalProps {
  isOpen: boolean;
  onStart: () => void;
}

export const AudioModal: React.FC<AudioModalProps> = ({ isOpen, onStart }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="audio-modal-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl px-6 text-center select-none"
          style={{
            paddingTop: "env(safe-area-inset-top, 24px)",
            paddingBottom: "env(safe-area-inset-bottom, 24px)",
          }}
        >
          {/* Subtle celestial background glow */}
          <div className="absolute w-72 h-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          <div className="absolute w-60 h-60 rounded-full bg-rose/15 blur-2xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 flex flex-col items-center max-w-sm"
          >
            {/* Sparkle decorative icon */}
            <div className="mb-6 p-3 rounded-full bg-white/5 border border-gold/20 shadow-gold-glow">
              <Sparkles className="w-8 h-8 text-gold-light animate-pulse" />
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold tracking-wide text-ivory mb-3 font-arabic">
              جاهزة؟ ✨
            </h2>

            <p className="text-sm sm:text-base text-champagne-dark mb-10 leading-relaxed font-arabic">
              رحلة سينمائية ساحرة تم تصميمها بكل حب من أجلك
            </p>

            {/* Primary Action Button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={onStart}
              className="group relative flex items-center justify-center gap-3 w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-full bg-gradient-to-r from-gold/20 via-gold/30 to-gold/20 hover:from-gold/30 hover:to-gold/30 border border-gold/40 text-ivory shadow-gold-glow backdrop-blur-md cursor-pointer transition-all active:scale-[0.97]"
            >
              <Volume2 className="w-5 h-5 text-gold-light stroke-[2.2]" />
              <span className="text-base sm:text-lg font-semibold tracking-wide font-arabic text-amber-100">
                ابدئي التجربة بالصوت 🔊
              </span>
              <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-active:opacity-100 transition-opacity" />
            </motion.button>

            <span className="mt-4 text-xs text-stone-400 font-arabic">
              (يُنصح بارتداء السماعات لتجربة غامرة)
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
