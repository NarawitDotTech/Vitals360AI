// POS (Plane-Orthogonal-to-Skin) algorithm for rPPG
// Wang et al. 2017

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Extract heart rate signal using POS algorithm
 */
export function extractPOS(rgbSignals: RGB[]): number[] {
  if (rgbSignals.length < 30) {
    throw new Error('Insufficient data for POS algorithm');
  }

  // Normalize RGB channels
  const normalized = normalizeRGB(rgbSignals);

  // Build projection signals
  const C1: number[] = [];
  const C2: number[] = [];

  for (const s of normalized) {
    C1.push(s.g - s.r);
    C2.push(s.g + s.r - 2 * s.b);
  }

  // Calculate alpha
  const alpha = std(C1) / std(C2);

  // Build pulse signal
  const pulse: number[] = [];
  for (let i = 0; i < C1.length; i++) {
    pulse.push(C1[i] - alpha * C2[i]);
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
