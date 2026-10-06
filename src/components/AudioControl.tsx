"use client";

import React from "react";
import { Volume2, VolumeX } from "lucide-react";

interface AudioControlProps {
  isMuted: boolean;
  isVisible: boolean;
  onToggle: () => void;
}

export const AudioControl: React.FC<AudioControlProps> = ({
  isMuted,
  isVisible,
  onToggle,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed top-4 right-4 z-40 transition-all duration-500 ease-out"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
        className="group relative flex items-center justify-center min-w-[44px] min-h-[44px] px-3.5 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-gold/30 text-gold shadow-lg shadow-black/40 active:scale-95 transition-transform"
      >
        <span className="flex items-center gap-2 text-xs font-medium text-amber-100 select-none">
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-rose-300 stroke-[2.2]" />
              <span className="opacity-90">مكتوم</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-gold-light animate-pulse stroke-[2.2]" />
              <span className="opacity-90">الصوت</span>
            </>
          )}
        </span>
        <span className="absolute inset-0 rounded-full bg-gold/10 opacity-0 group-active:opacity-100 transition-opacity" />
      </button>
    </div>
  );
};
