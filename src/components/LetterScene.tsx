"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Envelope } from "./Envelope";
import { LetterPaper } from "./LetterPaper";
import { FloatingPetals } from "./FloatingPetals";

interface LetterSceneProps {
  onFinishLetter: () => void;
}

const LETTER_PARAGRAPHS = [
  "كل سنة وانتي طيبة يا تقى ❤️",
  "النهارده مش مجرد عيد ميلادك، ده اليوم اللي بدأت فيه حكاية واحدة من أكتر الناس المميزة اللي عرفتها.",
  "بقالنا سنين نعرف بعض، وعدّى علينا وقت كتير وحاجات كتير اتغيرت، وحتى لو حصل بينا وقت بعدنا فيه عن بعض، في الآخر رجعنا نتكلم تاني، وده خلاني أقدّر وجودك أكتر.",
  "يمكن لحد دلوقتي إحنا متقابلناش، بس رغم كده وجودك كان ليه مكانه ومعناه، وعشان كده حبيت أعملك حاجة مختلفة تبقى مخصوص ليكي انتي.",
  "أتمنى السنة الجديدة من عمرك تكون أخف على قلبك، وأهدى، وأجمل، وتحققي فيها حاجات كتير نفسك فيها، وتكوني فخورة بنفسك وبكل خطوة بتاخديها.",
  "وأتمنى تفضلي زي ما انتي… بروحك، وضحكتك، وطريقتك اللي بتخلي ليكي طابع مختلف عن أي حد.",
  "Happy 20th Birthday, Toka 🎂❤️",
  "وإن شاء الله اللي جاي يكون أحلى بكتير من اللي فات.",
  "ويا رب أول صورة لينا سوا متتأخرش أوي بقى 😂❤️",
];

export const LetterScene: React.FC<LetterSceneProps> = ({ onFinishLetter }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLetterCentered, setIsLetterCentered] = useState(false);
  const [activeParagraphCount, setActiveParagraphCount] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const paragraphTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Step 1 & 2: User taps envelope -> open flap -> slide letter out
  const handleOpenEnvelope = useCallback(() => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    // Flap rotates open, then paper begins sliding out into focus
    setTimeout(() => {
      setIsOpen(true);
    }, 450);

    // Once paper settles into screen center (Prompt Section 9 & 10)
    setTimeout(() => {
      setIsLetterCentered(true);
    }, 900);
  }, [isOpening, isOpen]);

  // Step 3: Reveal paragraphs sequentially (Prompt Section 12: ~250ms apart, no typewriter)
  useEffect(() => {
    if (!isLetterCentered) return;

    // Start with 1st paragraph
    setActiveParagraphCount(1);
    let currentCount = 1;

    const interval = setInterval(() => {
      currentCount += 1;
      setActiveParagraphCount(currentCount);

      if (currentCount >= LETTER_PARAGRAPHS.length) {
        clearInterval(interval);
      }
    }, 320); // Gentle, comfortable reading cadence

    return () => clearInterval(interval);
  }, [isLetterCentered]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (paragraphTimerRef.current) clearTimeout(paragraphTimerRef.current);
    };
  }, []);

  // Step 4: User taps "خلصت ❤️" (Prompt Section 16)
  const handleFinishLetter = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);

    setTimeout(() => {
      onFinishLetter();
    }, 500);
  }, [isExiting, onFinishLetter]);

  return (
    <div
      id="letter-scene"
      className="fixed inset-0 z-30 w-full h-[100svh] overflow-hidden flex flex-col items-center justify-center select-none"
      style={{
        backgroundImage: "url(/images/cake-garden-bg.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "env(safe-area-inset-top, 20px)",
        paddingBottom: "env(safe-area-inset-bottom, 20px)",
      }}
    >
      {/* 2. Visual Continuity Overlay: subtle dark tint rgba(20, 10, 15, 0.20) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-colors duration-700"
        style={{
          backgroundColor: isLetterCentered
            ? "rgba(10, 6, 8, 0.45)"
            : "rgba(20, 10, 15, 0.20)",
        }}
      />

      {/* 10. Background Focus Blur when reading letter */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          backdropFilter: isLetterCentered ? "blur(5px)" : "blur(0px)",
          WebkitBackdropFilter: isLetterCentered ? "blur(5px)" : "blur(0px)",
        }}
      />

      {/* Subtle floating flower petals & warm glow (Section 2) */}
      <FloatingPetals />

      {/* Subtle radial golden vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 35%, rgba(12, 6, 10, 0.55) 100%)",
        }}
      />

      {/* 3. Intro Text before envelope opens (Prompt Section 3: "في رسالة مستنياكي... 💌") */}
      <AnimatePresence>
        {!isOpen && !isOpening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="absolute top-10 sm:top-14 z-20 px-6 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ivory font-arabic drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] tracking-wide">
              في رسالة مستنياكي... 💌
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Envelope & Letter Container with exit animation (Prompt Section 1) */}
      <motion.div
        animate={
          isExiting
            ? { opacity: 0, scale: 0.96, y: -15, transition: { duration: 0.5, ease: "easeInOut" } }
            : { opacity: 1, scale: 1, y: 0 }
        }
        className="relative z-20 flex flex-col items-center justify-center w-full px-4 max-w-lg"
      >
        {/* The Envelope */}
        <div
          className={`transition-all duration-700 ease-out ${
            isOpen ? "opacity-0 scale-95 pointer-events-none absolute -bottom-10" : "relative"
          }`}
        >
          <Envelope
            isOpen={isOpen}
            isOpening={isOpening}
            onOpen={handleOpenEnvelope}
          />
        </div>

        {/* 8 & 9. The Letter Paper (revealed after envelope opens) */}
        {isOpen && (
          <div className="relative flex items-center justify-center w-full">
            <LetterPaper
              paragraphs={LETTER_PARAGRAPHS}
              activeParagraphCount={activeParagraphCount}
              onFinish={handleFinishLetter}
              isExiting={isExiting}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};
