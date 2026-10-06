"use client";

import React from "react";
import { motion } from "framer-motion";

interface FlameProps {
  isExtinguished: boolean;
  flickerDuration?: number;
}

export const Flame: React.FC<FlameProps> = ({
  isExtinguished,
  flickerDuration = 1.0,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-end w-6 h-10 select-none pointer-events-none">
      {/* Active Flame */}
      {!isExtinguished ? (
        <motion.div
          animate={{
            scale: [0.95, 1.08, 0.92, 1.04, 0.95],
            rotate: [-2, 2.5, -1.5, 1, -2],
            opacity: [0.88, 1, 0.92, 1, 0.88],
          }}
          transition={{
            duration: flickerDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(255,183,77,0.85)]"
        >
          {/* Outer glow ring */}
          <div className="absolute -inset-1 rounded-full bg-orange-500/25 blur-[3px]" />

          {/* Flame SVG Body */}
          <svg
            width="14"
            height="22"
            viewBox="0 0 14 22"
            fill="none"
            className="relative"
          >
            <defs>
              <radialGradient id="flameGrad" cx="50%" cy="75%" r="60%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#FFF176" />
                <stop offset="60%" stopColor="#FFA726" />
                <stop offset="100%" stopColor="#E65100" stopOpacity="0.8" />
              </radialGradient>
            </defs>
            {/* Organic teardrop flame shape */}
            <path
              d="M7 0C7 0 1 7 1 14C1 17.866 3.686 21 7 21C10.314 21 13 17.866 13 14C13 7 7 0 7 0Z"
              fill="url(#flameGrad)"
            />
            {/* Hot inner core */}
            <ellipse cx="7" cy="15" rx="2.5" ry="4" fill="#FFFFFF" opacity="0.9" />
          </svg>
        </motion.div>
      ) : (
        /* Smoke Effect when Extinguished */
        <motion.div
          initial={{ opacity: 0.8, y: 0, scale: 0.8 }}
          animate={{ opacity: 0, y: -22, scale: 1.6 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="absolute -top-1 flex flex-col items-center"
        >
          <svg width="12" height="18" viewBox="0 0 12 18" fill="none">
            <path
              d="M6 18C4 14 8 10 5 6C3 3 7 0 7 0"
              stroke="rgba(210, 205, 215, 0.65)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="blur-[0.5px]"
            />
          </svg>
        </motion.div>
      )}
    </div>
  );
};
