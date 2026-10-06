"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { FrameDrawable, FrameManager, TOTAL_FRAMES } from "@/lib/frameLoader";

interface FrameCanvasProps {
  frameManager: FrameManager | null;
  currentFrameIndex: number;
  isReady: boolean;
  className?: string;
}

export const FrameCanvas: React.FC<FrameCanvasProps> = ({
  frameManager,
  currentFrameIndex,
  isReady,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastDrawnRef = useRef<number>(-1);
  const animationFrameRef = useRef<number | null>(null);

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !frameManager || !isReady) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const targetFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, currentFrameIndex));
    const drawable = frameManager.getFrame(targetFrame);
    if (!drawable) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const pixelWidth = Math.round(width * dpr);
    const pixelHeight = Math.round(height * dpr);

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // object-fit: cover center crop algorithm
    const imgWidth = "width" in drawable ? drawable.width : (drawable as HTMLImageElement).naturalWidth;
    const imgHeight = "height" in drawable ? drawable.height : (drawable as HTMLImageElement).naturalHeight;

    const imgRatio = imgWidth / imgHeight;
    const screenRatio = width / height;

    let drawW: number;
    let drawH: number;
    let offsetX = 0;
    let offsetY = 0;

    if (screenRatio > imgRatio) {
      drawW = width;
      drawH = width / imgRatio;
      offsetY = (height - drawH) / 2;
    } else {
      drawH = height;
      drawW = height * imgRatio;
      offsetX = (width - drawW) / 2;
    }

    ctx.drawImage(drawable, offsetX, offsetY, drawW, drawH);
    ctx.restore();

    lastDrawnRef.current = targetFrame;
  }, [frameManager, currentFrameIndex, isReady]);

  // Request animation frame for smooth redraw
  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [renderFrame]);

  // Redraw on window resize
  useEffect(() => {
    const handleResize = () => {
      renderFrame();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [renderFrame]);

  return (
    <canvas
      ref={canvasRef}
      id="cinematic-canvas"
      aria-label="Cinematic birthday scroll intro"
      className={`block w-full h-full object-cover select-none pointer-events-none ${className}`}
    />
  );
};
