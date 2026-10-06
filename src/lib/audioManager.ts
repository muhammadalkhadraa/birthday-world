/**
 * AudioManager for Scroll-Synchronized Intro Audio
 * Handles mobile unlock, scroll seeking smoothing, volume fading, and hero handoff.
 */

export class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private isUnlocked = false;
  private isMuted = false;
  private targetVolume = 0.85;
  private currentVolume = 0.85;
  private idleTimeout: NodeJS.Timeout | null = null;
  private fadeInterval: NodeJS.Timeout | null = null;
  private isHeroReached = false;
  private audioSrc: string;

  constructor(src: string = "/audio/intro.mp3") {
    this.audioSrc = src;
  }

  public init(): HTMLAudioElement | null {
    if (typeof window === "undefined") return null;
    if (!this.audio) {
      this.audio = new Audio(this.audioSrc);
      this.audio.preload = "metadata";
      this.audio.loop = false;
      this.audio.volume = 0; // Starts at 0 for smooth fade-in
    }
    return this.audio;
  }

  /**
   * Called on the first user interaction modal tap
   */
  public async unlock(): Promise<boolean> {
    const audio = this.init();
    if (!audio) return false;

    try {
      // Prime audio playback
      audio.volume = 0;
      await audio.play();
      audio.pause();
      this.isUnlocked = true;

      // Initial smooth volume fade-in
      this.fadeVolume(this.targetVolume, 700);
      return true;
    } catch (e) {
      console.warn("Audio unlock pending further user interaction:", e);
      this.isUnlocked = true;
      return false;
    }
  }

  public getUnlocked(): boolean {
    return this.isUnlocked;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.audio) {
      if (this.isMuted) {
        this.audio.volume = 0;
      } else if (!this.isHeroReached) {
        this.audio.volume = this.targetVolume;
      }
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Synchronize audio timestamp to scroll progress (0.0 to 1.0)
   * With lightweight smoothing and idle detection.
   */
  public syncToScroll(progress: number) {
    if (!this.audio || !this.isUnlocked || this.isHeroReached) return;
    if (isNaN(this.audio.duration) || this.audio.duration <= 0) return;

    const targetTime = Math.max(0, Math.min(this.audio.duration, progress * this.audio.duration));

    // Smoothing threshold: only seek if difference is meaningful
    if (Math.abs(this.audio.currentTime - targetTime) > 0.08) {
      try {
        this.audio.currentTime = targetTime;
      } catch {
        // Ignore seek error during media loading
      }
    }

    // End-of-intro fade out behavior:
    // Near the end (progress > 0.88), gradually fade audio to 0 before Hero
    if (progress >= 0.88) {
      const remainingProgress = (1.0 - progress) / 0.12; // 1 -> 0
      const fadeVol = Math.max(0, Math.min(this.targetVolume, remainingProgress * this.targetVolume));
      if (!this.isMuted) {
        this.audio.volume = fadeVol;
      }
    } else if (!this.isMuted && this.audio.volume < this.targetVolume) {
      this.audio.volume = this.targetVolume;
    }

    // If scrolling forward or backward, keep audio playing gently
    if (this.audio.paused && !this.isHeroReached && progress < 0.98) {
      this.audio.play().catch(() => {});
    }

    // Clear previous idle timer
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }

    // If user stops scrolling for 250ms, pause audio so it doesn't wander far ahead
    this.idleTimeout = setTimeout(() => {
      if (this.audio && !this.audio.paused) {
        this.audio.pause();
      }
    }, 250);
  }

  /**
   * Permanent handoff to HeroSection - fully fades out and silences intro audio
   */
  public enterHero() {
    this.isHeroReached = true;
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    if (this.audio) {
      this.fadeVolume(0, 900, () => {
        if (this.audio) {
          this.audio.pause();
          this.audio.currentTime = 0;
        }
      });
    }
  }

  /**
   * Smooth volume transition
   */
  public fadeVolume(toVolume: number, durationMs: number = 600, onComplete?: () => void) {
    if (!this.audio || this.isMuted) {
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

  public destroy() {
    if (this.idleTimeout) clearTimeout(this.idleTimeout);
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
}
