"use client";

/**
 * Controller class for Happy Birthday audio playback
 * Handles persistent single-instance playback, smooth fade-in, and celebration fade-out.
 */
export class BirthdayAudioController {
  private static instance: BirthdayAudioController | null = null;
  private audio: HTMLAudioElement | null = null;
  private fadeInterval: NodeJS.Timeout | null = null;
  private isPlaying = false;

  public static getInstance(): BirthdayAudioController {
    if (!BirthdayAudioController.instance) {
      BirthdayAudioController.instance = new BirthdayAudioController();
    }
    return BirthdayAudioController.instance;
  }

  private constructor() {
    if (typeof window !== "undefined") {
      this.audio = new Audio("/audio/happy-birthday.mp3");
      this.audio.preload = "auto";
      this.audio.loop = false;
      this.audio.volume = 0;
    }
  }

  public playAndFadeIn(targetVolume: number = 0.65, durationMs: number = 800): Promise<void> {
    if (!this.audio) return Promise.resolve();
    if (this.isPlaying) return Promise.resolve();

    this.isPlaying = true;
    this.audio.currentTime = 0;
    this.audio.volume = 0;

    return this.audio
      .play()
      .then(() => {
        this.fadeVolume(targetVolume, durationMs);
      })
      .catch((e) => {
        console.warn("Birthday audio autoplay prevented by browser policy:", e);
      });
  }

  public fadeOutAndPause(durationMs: number = 1200) {
    if (!this.audio || !this.isPlaying) return;

    this.fadeVolume(0, durationMs, () => {
      if (this.audio) {
        this.audio.pause();
        this.isPlaying = false;
      }
    });
  }

  private fadeVolume(toVolume: number, durationMs: number, onComplete?: () => void) {
    if (!this.audio) {
      onComplete?.();
      return;
    }

    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const startVolume = this.audio.volume;
    const startTime = performance.now();

    this.fadeInterval = setInterval(() => {
      if (!this.audio) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        return;
      }

      const elapsed = performance.now() - startTime;
      const t = Math.min(1.0, elapsed / durationMs);
      const newVol = startVolume + (toVolume - startVolume) * t;

      this.audio.volume = Math.max(0, Math.min(1, newVol));

      if (t >= 1.0) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        onComplete?.();
      }
    }, 25);
  }

  public stop() {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
    }
  }
}
