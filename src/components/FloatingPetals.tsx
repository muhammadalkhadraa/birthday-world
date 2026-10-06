"use client";

import React, { useMemo } from "react";

export const FloatingPetals: React.FC = () => {
  // Generate a fixed set of subtle petals and glow particles
  const particles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: `${(i * 7.5 + 4) % 96}%`,
      delay: `${(i * 1.3) % 7}s`,
      duration: `${8 + (i % 5) * 1.5}s`,
      size: `${12 + (i % 4) * 4}px`,
      rotate: `${(i * 45) % 360}deg`,
      swayDuration: `${3 + (i % 3)}s`,
      type: i % 3 === 0 ? "glow" : "petal",
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden z-10"
    >
      {particles.map((p) =>
        p.type === "petal" ? (
          <div
            key={p.id}
            className="absolute top-[-40px] opacity-70 will-change-transform animate-fall"
            style={{
              left: p.left,
              animationDuration: p.duration,
              animationDelay: p.delay,
              animationIterationCount: "infinite",
              animationTimingFunction: "linear",
            }}
          >
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              className="fill-rose-300/60 drop-shadow-[0_2px_6px_rgba(230,160,180,0.3)] animate-sway"
              style={{
                transform: `rotate(${p.rotate})`,
                animationDuration: p.swayDuration,
                animationIterationCount: "infinite",
              }}
            >
              <path d="M12 2C7 5 3 10 3 15c0 4.5 4 7 9 7s9-2.5 9-7c0-5-4-10-9-13z" />
            </svg>
          </div>
        ) : (
          <div
            key={p.id}
            className="absolute top-[-20px] rounded-full bg-gold/50 blur-[1px] shadow-[0_0_8px_rgba(212,175,55,0.8)] animate-fall"
            style={{
              left: p.left,
              width: "4px",
              height: "4px",
              animationDuration: p.duration,
              animationDelay: p.delay,
              animationIterationCount: "infinite",
              animationTimingFunction: "ease-in-out",
            }}
          />
        )
      )}

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          15% {
            opacity: 0.75;
          }
          85% {
            opacity: 0.75;
          }
          100% {
            transform: translateY(105vh);
            opacity: 0;
          }
        }
        @keyframes sway {
          0%,
          100% {
            transform: rotate(-10deg) translateX(-8px);
          }
          50% {
            transform: rotate(15deg) translateX(8px);
          }
        }
        .animate-fall {
          animation-name: fall;
        }
        .animate-sway {
          animation-name: sway;
          animation-timing-function: ease-in-out;
        }
      `}</style>
    </div>
  );
};
