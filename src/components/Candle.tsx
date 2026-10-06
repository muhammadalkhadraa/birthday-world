"use client";

import React from "react";
import { Flame } from "./Flame";

interface CandleProps {
  id: number;
  xPercent: number;
  yPercent: number;
  isExtinguished: boolean;
  onExtinguish: (id: number) => void;
  flickerDuration: number;
}

export const Candle: React.FC<CandleProps> = ({
  id,
  xPercent,
  yPercent,
  isExtinguished,
  onExtinguish,
  flickerDuration,
}) => {
  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!isExtinguished) {
      onExtinguish(id);
    }
  };

  return (
    <div
      style={{
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        transform: "translate(-50%, -100%)",
      }}
      className="absolute z-20 flex flex-col items-center cursor-pointer select-none"
    >
      {/* 48px Touch Target Area (Section 10) */}
      <button
        type="button"
        aria-label={isExtinguished ? `شمعة ${id} مطفأة` : `اطفئي الشمعة ${id}`}
        onClick={handleTap}
        onTouchEnd={handleTap}
        className="group relative flex flex-col items-center justify-end min-w-[48px] min-h-[58px] pb-1 focus:outline-none"
      >
        {/* Flame element */}
        <div className="mb-[-2px]">
          <Flame
            isExtinguished={isExtinguished}
            flickerDuration={flickerDuration}
          />
        </div>

        {/* Tiny dark wick */}
        <div className="w-[1.5px] h-[4px] bg-stone-800 rounded-t-sm" />

        {/* Candle Body: Slender ivory candle with golden metallic accent */}
        <div className="relative w-[7px] h-[34px] rounded-t-sm rounded-b-xs overflow-hidden shadow-sm bg-gradient-to-r from-amber-100 via-white to-amber-200 border-x border-amber-300/40">
          {/* Subtle gold diagonal stripes */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #d4af37 0px, #d4af37 2px, transparent 2px, transparent 6px)",
            }}
          />
        </div>

        {/* Soft candle base shadow on the cake frosting */}
        <div className="w-[10px] h-[2px] rounded-full bg-stone-900/40 blur-[0.5px] mt-[-1px]" />
      </button>
    </div>
  );
};
