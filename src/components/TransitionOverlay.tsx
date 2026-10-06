"use client";

import React from "react";

interface TransitionOverlayProps {
  opacity: number;
}

export const TransitionOverlay: React.FC<TransitionOverlayProps> = ({ opacity }) => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-20 pointer-events-none bg-black transition-opacity duration-300 ease-out"
      style={{
        opacity: Math.max(0, Math.min(0.4, opacity)),
      }}
    />
  );
};
