// HRV (Heart Rate Variability) calculation

/**
 * Calculate HRV metrics from inter-beat intervals
 */
export interface HRVMetrics {
  rmssd: number; // Root mean square of successive differences (ms)
  sdnn: number;  // Standard deviation of NN intervals (ms)
  pnn50: number; // Percentage of successive differences > 50ms (%)
}

export function calculateHRV(ibi: number[]): HRVMetrics {
  if (ibi.length < 2) {
    return { rmssd: 0, sdnn: 0, pnn50: 0 };
  }

  // Calculate successive differences
  const diffs: number[] = [];
  for (let i = 1; i < ibi.length; i++) {
    diffs.push(ibi[i] - ibi[i - 1]);
  }

  // RMSSD: Root mean square of successive differences
  const squaredDiffs = diffs.map(d => d * d);
  const meanSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
  const rmssd = Math.sqrt(meanSquaredDiff);

  // SDNN: Standard deviation of all NN intervals
  const mean = ibi.reduce((a, b) => a + b, 0) / ibi.length;
  const variance = ibi.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / ibi.length;
  const sdnn = Math.sqrt(variance);

  // pNN50: Percentage of successive differences > 50ms
  const nn50 = diffs.filter(d => Math.abs(d) > 50).length;
  const pnn50 = (nn50 / diffs.length) * 100;

  return {
    rmssd: Math.round(rmssd),
    sdnn: Math.round(sdnn),
    pnn50: Math.round(pnn50 * 10) / 10,
  };
}
