// CHROM algorithm for rPPG
// de Haan & Jeanne 2013

import type { RGB } from './pos';

/**
 * Extract heart rate signal using CHROM algorithm
 */
export function extractCHROM(rgbSignals: RGB[]): number[] {
  if (rgbSignals.length < 30) {
    throw new Error('Insufficient data for CHROM algorithm');
  }

  // Normalize RGB channels
  const normalized = normalizeRGB(rgbSignals);

  // Build chrominance signals
  const Xs: number[] = [];
  const Ys: number[] = [];

  for (const s of normalized) {
    Xs.push(3 * s.r - 2 * s.g);
    Ys.push(1.5 * s.r + s.g - 1.5 * s.b);
  }

  // Calculate alpha
  const stdX = std(Xs);
  const stdY = std(Ys);
  const alpha = stdX / stdY;

  // Build pulse signal
  const pulse: number[] = [];
  for (let i = 0; i < Xs.length; i++) {
    pulse.push(Xs[i] - alpha * Ys[i]);
  }

  return pulse;
}

/**
 * Normalize RGB signals
 */
function normalizeRGB(rgbSignals: RGB[]): RGB[] {
  const meanR = mean(rgbSignals.map(s => s.r));
  const meanG = mean(rgbSignals.map(s => s.g));
  const meanB = mean(rgbSignals.map(s => s.b));

  return rgbSignals.map(s => ({
    r: s.r / meanR,
    g: s.g / meanG,
    b: s.b / meanB,
  }));
}

/**
 * Calculate mean
 */
function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * Calculate standard deviation
 */
function std(arr: number[]): number {
  const m = mean(arr);
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / arr.length;
  return Math.sqrt(variance);
}
