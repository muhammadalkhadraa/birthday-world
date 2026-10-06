/**
 * Frame Loader and Cache Manager for Birthday Cinematic Scroll Intro
 * Optimized for mobile memory efficiency and instantaneous response.
 */

export const TOTAL_FRAMES = 969; // Sequence ends at the garden frame (f_0969)
export const INITIAL_PRELOAD_COUNT = 15; // Preload only first 15 frames for fast first paint

export const FINAL_FRAME_INDEX = TOTAL_FRAMES - 1; // Index 968 is f_0969
export const FINAL_FRAME = "/frames/frame_final.webp"; // Static asset for hero background

export interface FrameLoaderConfig {
  useSmall?: boolean;
  concurrency?: number;
  ahead?: number;
  behind?: number;
  keepWindow?: number;
}

/**
 * Generates dynamic frame URL based on 0-based frame index
 * Index 0 -> f_0001.webp
 * Index 968 -> f_0969.webp
 */
export function getFrameUrl(index: number, useSmall: boolean = true): string {
  const frameNumber = Math.min(TOTAL_FRAMES, Math.max(1, index + 1));
  const padded = String(frameNumber).padStart(4, "0");
  const folder = useSmall ? "sm" : "hd";
  return `/frames/${folder}/f_${padded}.webp`;
}

export type FrameDrawable = ImageBitmap | HTMLImageElement;

export class FrameManager {
  private bitmaps = new Map<number, FrameDrawable>();
  private loading = new Set<number>();
  private queue: number[] = [];
  private concurrency: number;
  private ahead: number;
  private behind: number;
  private keepWindow: number;
  private useSmall: boolean;
  private onReadyCallback?: () => void;
  private onProgressCallback?: (loaded: number, target: number) => void;
  private isReadySignaled = false;
  private lastDrawnIndex = -1;

  constructor(config: FrameLoaderConfig = {}) {
    this.useSmall = config.useSmall ?? (typeof window !== "undefined" ? Math.min(window.innerWidth, window.innerHeight) <= 820 : true);
    this.concurrency = config.concurrency ?? 6;
    this.ahead = config.ahead ?? (this.useSmall ? 32 : 20);
    this.behind = config.behind ?? (this.useSmall ? 16 : 10);
    this.keepWindow = config.keepWindow ?? (this.useSmall ? 60 : 35);
  }

  public setCallbacks(
    onReady: () => void,
    onProgress?: (loaded: number, target: number) => void
  ) {
    this.onReadyCallback = onReady;
    this.onProgressCallback = onProgress;
  }

  /**
   * Preload initial burst of frames + final frame for seamless handoff
   */
  public initPreload(initialCount: number = INITIAL_PRELOAD_COUNT): Promise<void> {
    return new Promise((resolve) => {
      let resolved = false;

      // Also prime final frame into browser HTTP cache early
      if (typeof window !== "undefined") {
        const primeFinal = new Image();
        primeFinal.src = FINAL_FRAME;
      }

      const checkResolved = () => {
        if (!resolved && this.bitmaps.size >= Math.min(initialCount, 10)) {
          resolved = true;
          this.isReadySignaled = true;
          this.onReadyCallback?.();
          resolve();
        }
      };

      for (let i = 0; i < initialCount; i++) {
        this.enqueue(i, 0);
      }
      this.pump();

      // Fallback timeout in case slow network
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          this.isReadySignaled = true;
          this.onReadyCallback?.();
          resolve();
        }
      }, 3000);
    });
  }

  public updateTarget(currentIndex: number) {
    const lo = Math.max(0, currentIndex - this.behind);
    const hi = Math.min(TOTAL_FRAMES - 1, currentIndex + this.ahead);

    // Build wanted list sorted by proximity to current
    const wanted: number[] = [];
    for (let i = lo; i <= hi; i++) {
      if (!this.bitmaps.has(i) && !this.loading.has(i)) {
        wanted.push(i);
      }
    }

    wanted.sort((a, b) => Math.abs(a - currentIndex) - Math.abs(b - currentIndex));
    this.queue = wanted;
    this.pump();
    this.evict(currentIndex);
  }

  private enqueue(index: number, priorityIndex: number) {
    if (this.bitmaps.has(index) || this.loading.has(index)) return;
    if (!this.queue.includes(index)) {
      this.queue.push(index);
      this.queue.sort((a, b) => Math.abs(a - priorityIndex) - Math.abs(b - priorityIndex));
    }
  }

  private pump() {
    if (!this.isReadySignaled && this.bitmaps.size >= INITIAL_PRELOAD_COUNT) {
      this.isReadySignaled = true;
      this.onReadyCallback?.();
    }

    if (this.onProgressCallback && !this.isReadySignaled) {
      this.onProgressCallback(this.bitmaps.size, INITIAL_PRELOAD_COUNT);
    }

    while (this.loading.size < this.concurrency && this.queue.length > 0) {
      const nextIndex = this.queue.shift();
      if (nextIndex !== undefined) {
        this.loadFrame(nextIndex);
      }
    }
  }

  private async loadFrame(index: number) {
    if (this.bitmaps.has(index) || this.loading.has(index)) return;
    this.loading.add(index);

    const frameUrl = getFrameUrl(index, this.useSmall);

    try {
      if (typeof window !== "undefined" && "createImageBitmap" in window) {
        const response = await fetch(frameUrl, { cache: "force-cache" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        const bmp = await createImageBitmap(blob);
        this.bitmaps.set(index, bmp);
      } else {
        await new Promise<void>((res, rej) => {
          const img = new Image();
          img.onload = () => {
            this.bitmaps.set(index, img);
            res();
          };
          img.onerror = rej;
          img.src = frameUrl;
        });
      }
    } catch {
      // Retry once or allow nearest fallback
    } finally {
      this.loading.delete(index);
      this.pump();
    }
  }

  /**
   * Find exact or nearest decoded frame to avoid any blank flicker
   */
  public getFrame(index: number): FrameDrawable | null {
    if (this.bitmaps.has(index)) {
      this.lastDrawnIndex = index;
      return this.bitmaps.get(index)!;
    }

    // Search nearest available frame
    for (let delta = 1; delta < TOTAL_FRAMES; delta++) {
      const prev = index - delta;
      if (prev >= 0 && this.bitmaps.has(prev)) {
        return this.bitmaps.get(prev)!;
      }
      const next = index + delta;
      if (next < TOTAL_FRAMES && this.bitmaps.has(next)) {
        return this.bitmaps.get(next)!;
      }
    }

    return null;
  }

  /**
   * Release out-of-range frames to keep memory lightweight on mobile devices
   */
  private evict(currentIndex: number) {
    if (this.bitmaps.size <= this.keepWindow * 2) return;

    for (const [idx, item] of this.bitmaps.entries()) {
      if (Math.abs(idx - currentIndex) > this.keepWindow) {
        if ("close" in item && typeof item.close === "function") {
          item.close();
        }
        this.bitmaps.delete(idx);
      }
    }
  }

  public destroy() {
    for (const [, item] of this.bitmaps.entries()) {
      if ("close" in item && typeof item.close === "function") {
        item.close();
      }
    }
    this.bitmaps.clear();
    this.loading.clear();
    this.queue = [];
  }
}
