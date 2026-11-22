import { SoundKind } from "./cues";

interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

/**
 * Short sounds made with oscillators. No audio files.
 * Call unlock() inside a pointer or click handler before the first play
 * (iOS Safari will not start an AudioContext otherwise).
 */
export class GameAudio {
  muted: boolean;
  private context: AudioContext | null;

  constructor() {
    this.muted = false;
    this.context = null;
  }

  unlock(): void {
    if (this.context !== null) {
      if (this.context.state === "suspended") {
        void this.context.resume();
      }
      return;
    }
    const host = window as WindowWithWebkitAudio;
    const Context = window.AudioContext || host.webkitAudioContext;
    if (Context === undefined) {
      return;
    }
    try {
      this.context = new Context();
    } catch (error) {
      void error;
      this.context = null;
    }
  }

  play(kind: SoundKind): void {
    if (this.muted) {
      return;
    }
    const context = this.context;
    if (context === null) {
      return;
    }
    if (context.state === "suspended") {
      void context.resume();
    }
    const now = context.currentTime;
    if (kind === "tap") {
      this.tone(context, 720, now, 0.045, "sine", 0.05);
      return;
    }
    if (kind === "select") {
      this.tone(context, 520, now, 0.07, "sine", 0.05, 860);
      return;
    }
    if (kind === "pickup") {
      this.tone(context, 280, now, 0.06, "triangle", 0.05, 640);
      return;
    }
    if (kind === "place") {
      this.tone(context, 180, now, 0.09, "sine", 0.06);
      this.noise(context, now, 0.04, 0.04);
      return;
    }
    this.tone(context, 196, now, 0.05, "square", 0.03);
    this.tone(context, 140, now + 0.07, 0.06, "square", 0.03);
  }

  /** Stand-in for haptics. No-op where vibrate is missing (including iOS Safari). */
  haptic(pattern: number | number[]): void {
    if (this.muted) {
      return;
    }
    if (typeof navigator.vibrate !== "function") {
      return;
    }
    navigator.vibrate(pattern);
  }

  private tone(
    context: AudioContext,
    frequency: number,
    when: number,
    duration: number,
    type: OscillatorType,
    gainValue: number,
    slideTo?: number
  ): void {
    const oscillator = context.createOscillator();
    const amp = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, when);
    if (slideTo !== undefined) {
      oscillator.frequency.linearRampToValueAtTime(slideTo, when + duration);
    }
    amp.gain.setValueAtTime(gainValue, when);
    amp.gain.exponentialRampToValueAtTime(0.001, when + duration);
    oscillator.connect(amp);
    amp.connect(context.destination);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.02);
  }

  private noise(
    context: AudioContext,
    when: number,
    duration: number,
    gainValue: number
  ): void {
    const length = Math.max(1, Math.floor(context.sampleRate * duration));
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < length; index++) {
      data[index] = Math.random() * 2 - 1;
    }
    const source = context.createBufferSource();
    source.buffer = buffer;
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(480, when);
    const amp = context.createGain();
    amp.gain.setValueAtTime(gainValue, when);
    amp.gain.exponentialRampToValueAtTime(0.001, when + duration);
    source.connect(filter);
    filter.connect(amp);
    amp.connect(context.destination);
    source.start(when);
    source.stop(when + duration + 0.02);
  }
}
