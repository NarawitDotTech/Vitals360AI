// Respiratory rate extraction from rPPG signal

import { bandpassFilter } from './bandpass';
import { findDominantFrequency } from './fft';

/**
 * Extract respiratory rate from pulse signal
 * Uses amplitude modulation of the PPG signal
 */
export function extractRespiratoryRate(
  pulseSignal: number[],
  sampleRate: number
): number {
  // Respiratory rate is typically 0.15-0.4 Hz (9-24 breaths per minute)
  const minRR = 0.15;
  const maxRR = 0.4;

  // Extract amplitude envelope (respiratory modulation)
  const envelope = extractEnvelope(pulseSignal, sampleRate);

  // Bandpass filter for respiratory frequency range
  const filtered = bandpassFilter(envelope, {
    low: minRR,
    high: maxRR,
    fs: sampleRate,
  });

  // Find dominant frequency
  const dominantFreq = findDominantFrequency(filtered, sampleRate, minRR, maxRR);

  // Convert to breaths per minute
  const respiratoryRate = dominantFreq * 60;

  return respiratoryRate;
}

/**
 * Extract amplitude envelope from signal
 */
function extractEnvelope(signal: number[], sampleRate: number): number[] {
  const envelope: number[] = [];
  const windowSize = Math.floor(sampleRate * 0.5); // 0.5 second window

  for (let i = 0; i < signal.length; i++) {
    const start = Math.max(0, i - windowSize);
    const end = Math.min(signal.length, i + windowSize);

    let max = -Infinity;
    for (let j = start; j < end; j++) {
      max = Math.max(max, Math.abs(signal[j]));
    }

    envelope.push(max);
  }

  return envelope;
}
