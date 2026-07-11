/**
 * Synthesized sound effects for the player Spin Wheel engine -- generated at
 * runtime with the Web Audio API (oscillators + gain envelopes), not audio
 * files. There are no licensed/uploaded audio assets in this project yet;
 * synthesizing avoids shipping a silent feature or a placeholder asset path
 * that would 404 in production. Every export is a no-op outside the browser
 * (safe to import from a module that could theoretically be evaluated
 * during SSR) and lazily creates a single shared `AudioContext` on first
 * use, inside a user-gesture-triggered call (e.g. a button click), which is
 * what browser autoplay policies require.
 */

let sharedContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!sharedContext) {
    const AudioContextCtor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return null;
    sharedContext = new AudioContextCtor();
  }

  if (sharedContext.state === "suspended") {
    void sharedContext.resume();
  }

  return sharedContext;
}

interface ToneOptions {
  type?: OscillatorType;
  volume?: number;
  delayMs?: number;
}

function playTone(frequency: number, durationMs: number, options: ToneOptions = {}) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const { type = "sine", volume = 0.15, delayMs = 0 } = options;
  const startTime = ctx.currentTime + delayMs / 1000;
  const durationSeconds = durationMs / 1000;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSeconds);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + durationSeconds + 0.02);
}

/** Short rising two-note cue when a spin begins. */
export function playSpinStartSound(): void {
  playTone(220, 120, { type: "triangle", volume: 0.12 });
  playTone(330, 140, { type: "triangle", volume: 0.1, delayMs: 60 });
}

/** Single soft click, fired once per wheel-segment boundary crossed (see `lib/wheel.ts#scheduleSpinTicks`). */
export function playTickSound(): void {
  playTone(880, 40, { type: "square", volume: 0.08 });
}

/** Four-note ascending fanfare when a spin resolves to a prize. */
export function playWinSound(): void {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((frequency, index) => playTone(frequency, 220, { type: "sine", volume: 0.16, delayMs: index * 90 }));
}

/** Low descending buzz for a failed action (session expired, out of attempts, etc.). */
export function playErrorSound(): void {
  playTone(180, 220, { type: "sawtooth", volume: 0.12 });
}
