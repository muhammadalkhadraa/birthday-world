"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

interface LetterPaperProps {
  paragraphs: string[];
  activeParagraphCount: number;
  onFinish: () => void;
  isExiting: boolean;
}

export const LetterPaper: React.FC<LetterPaperProps> = ({
  paragraphs,
  activeParagraphCount,
  onFinish,
  isExiting,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const allParagraphsRevealed = activeParagraphCount >= paragraphs.length;

  // Check scroll position to determine if user reached near the bottom
  const checkScrollPosition = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const threshold = 40;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;

    if (isAtBottom) {
      setIsScrolledToBottom(true);
    }
  };

  const handleScroll = () => {
    setHasScrolled(true);
    if (allParagraphsRevealed) {
      checkScrollPosition();
    }
  };

  // Only check bottom state AFTER all paragraphs have fully appeared
  useEffect(() => {
    if (!allParagraphsRevealed) {
      setIsScrolledToBottom(false);
      return;
    }

    const el = scrollContainerRef.current;
    if (!el) return;

    // Small delay to allow DOM to finish layout calculations
    const timer = setTimeout(() => {
      // If the content is short enough that it doesn't need scrolling at all
      if (el.scrollHeight <= el.clientHeight + 30) {
        setIsScrolledToBottom(true);
      } else {
        checkScrollPosition();
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [allParagraphsRevealed]);
  const showFinishButton = allParagraphsRevealed && isScrolledToBottom;

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.92,
        y: 40,
      }}
      animate={
        isExiting
          ? {
              opacity: 0,
              scale: 0.96,
              y: -20,
              transition: { duration: 0.5, ease: "easeInOut" },
            }
          : {
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              },
            }
      }
      className="relative z-30 flex flex-col items-center justify-between overflow-hidden rounded-2xl select-none"
      style={{
        width: "min(88vw, 390px)",
        maxHeight: "70svh",
        boxShadow: "0 22px 55px rgba(0, 0, 0, 0.48), 0 0 0 1px rgba(212, 175, 55, 0.35)",
        background: "linear-gradient(175deg, #FFFDF9 0%, #FBF6ED 55%, #F6EFE2 100%)",
      }}
    >
      {/* Delicate vintage paper grain & golden ornamental inner border */}
      <div
        aria-hidden="true"
        className="absolute inset-1.5 sm:inset-2.5 rounded-xl border border-gold/30 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 15px rgba(212, 175, 55, 0.08)",
        }}
      />

      {/* Decorative top header filigree line */}
      <div className="relative z-10 w-full pt-4 sm:pt-5 pb-2 px-6 flex items-center justify-center gap-2">
        <span className="h-[0.75px] flex-1 bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
        <span className="text-gold font-amiri text-sm select-none">✦</span>
        <span className="h-[0.75px] flex-1 bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
      </div>

      {/* Scrollable Letter Body (Prompt Section 14: internal scroll, smoothed) */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative z-10 w-full flex-1 overflow-y-auto px-5 sm:px-6 pt-1 pb-8 scroll-smooth"
        style={{
          direction: "rtl",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(212, 175, 55, 0.35) transparent",
        }}
      >
        <div className="flex flex-col gap-3.5 sm:gap-4 text-right">
          {paragraphs.map((text, idx) => {
            const isVisible = idx < activeParagraphCount;
            const isHeading = idx === 0;
            const isEnglishHighlight = idx === 6; // "Happy 20th Birthday, Toka 🎂❤️"

            if (!isVisible) return null;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 1, 0.5, 1],
                }}
              >
                {isHeading ? (
                  <h3 className="text-lg sm:text-xl font-bold font-arabic text-[#4A0E17] text-center mb-1 drop-shadow-sm leading-snug">
                    {text}
                  </h3>
                ) : isEnglishHighlight ? (
                  <div className="my-2 py-1 text-center border-y border-gold/30">
                    <p className="text-base sm:text-lg font-bold font-sans text-[#4A0E17] tracking-tight text-center">
                      {text}
                    </p>
                  </div>
                ) : (
                  <p className="text-[15px] sm:text-[16.5px] font-arabic font-normal text-[#2E2425] leading-[1.85] sm:leading-[1.95] text-justify">
                    {text}
                  </p>
                )}
              </motion.div>
            );
          })}

          {/* End of Letter divider & heart (Prompt Section 15) */}
          {allParagraphsRevealed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="pt-4 pb-2 flex flex-col items-center justify-center gap-2 select-none"
            >
              <div className="flex items-center gap-2 w-full justify-center">
                <span className="w-12 h-[0.75px] bg-gradient-to-r from-transparent to-gold/40" />
                <span className="text-gold text-xs">✦</span>
                <span className="w-12 h-[0.75px] bg-gradient-to-l from-transparent to-gold/40" />
              </div>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/80 animate-pulse" />
            </motion.div>
          )}

          {/* Scroll down prompt if user hasn't scrolled yet and there is more content */}
          {allParagraphsRevealed && !isScrolledToBottom && !hasScrolled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center pt-1 pb-1"
            >
              <span className="text-xs font-arabic text-[#8C7662] animate-bounce inline-block">
                اسحبي لتحت لقراءة باقي الرسالة ↓
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* 15. Next Action Button: "خلصت ❤️" (Section 15 & 16) */}
      <AnimatePresence>
        {showFinishButton && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative z-20 w-full px-5 pb-4 pt-2 bg-gradient-to-t from-[#F6EFE2] via-[#F6EFE2]/90 to-transparent flex items-center justify-center"
          >
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={onFinish}
              className="group relative flex items-center justify-center gap-2 px-7 py-2.5 rounded-full bg-gradient-to-r from-[#6E1421] via-[#8C1B2A] to-[#6E1421] text-ivory border border-gold/45 shadow-[0_6px_20px_rgba(110,20,33,0.38)] cursor-pointer active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-gold-light group-hover:rotate-12 transition-transform" />
              <span className="text-sm sm:text-base font-bold font-arabic text-amber-100 tracking-wide">
                خلصت ❤️
              </span>
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/15 via-white/10 to-gold/15 pointer-events-none" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
