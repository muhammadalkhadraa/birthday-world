"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Candle } from "./Candle";

export interface CandleState {
  id: number;
  extinguished: boolean;
  xPercent: number;
  yPercent: number;
  flickerDuration: number;
}

interface BirthdayCakeProps {
  candles: CandleState[];
  onExtinguishCandle: (id: number) => void;
  onCakeTapFallback?: () => void;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({
  candles,
  onExtinguishCandle,
  onCakeTapFallback,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82, y: 60 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1], // Smooth premium spring/easeOut
      }}
      onClick={onCakeTapFallback}
      className="relative flex flex-col items-center justify-center cursor-pointer select-none"
      style={{
        width: "min(84vw, 360px)",
      }}
    >
      {/* Warm golden glow & pedestal shadow underneath cake */}
      <div
        aria-hidden="true"
        className="absolute -bottom-6 w-4/5 h-12 rounded-[50%] bg-gold/25 blur-xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-4 w-3/5 h-6 rounded-[50%] bg-black/60 blur-md pointer-events-none"
      />

      {/* Interactive Cake Container */}
      <div className="relative w-full aspect-square">
        {/* Render 5 Candles with relative percentage positioning */}
        {candles.map((candle) => (
          <Candle
            key={candle.id}
            id={candle.id}
            xPercent={candle.xPercent}
            yPercent={candle.yPercent}
            isExtinguished={candle.extinguished}
            onExtinguish={onExtinguishCandle}
            flickerDuration={candle.flickerDuration}
          />
        ))}

        {/* Transparent Cake Asset */}
        <Image
          src="/images/birthday-cake.webp"
          alt="Birthday Cake for Toka"
          fill
          sizes="(max-width: 430px) 85vw, 380px"
          priority
          className="object-contain pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
        />
      </div>
    </motion.div>
  );
};
