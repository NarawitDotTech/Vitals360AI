// Peak detection for inter-beat interval calculation

/**
 * Find peaks in signal
 */
export function findPeaks(signal: number[], minDistance: number = 10): number[] {
  const peaks: number[] = [];

  for (let i = 1; i < signal.length - 1; i++) {
    // Check if this is a local maximum
    if (signal[i] > signal[i - 1] && signal[i] > signal[i + 1]) {
      // Check minimum distance from last peak
      if (peaks.length === 0 || i - peaks[peaks.length - 1] >= minDistance) {
        peaks.push(i);
      } else {
        // If closer than minDistance, keep the higher peak
        const lastPeak = peaks[peaks.length - 1];
        if (signal[i] > signal[lastPeak]) {
          peaks[peaks.length - 1] = i;
        }
      }
    }
  }

  return peaks;
}

/**
 * Calculate inter-beat intervals from peaks
 */
export function calculateIBI(peaks: number[], sampleRate: number): number[] {
  const ibi: number[] = [];

  for (let i = 1; i < peaks.length; i++) {
    const interval = ((peaks[i] - peaks[i - 1]) / sampleRate) * 1000; // in milliseconds
    ibi.push(interval);
  }

  return ibi;
}

/**
 * Calculate heart rate from inter-beat intervals
 */
export function calculateHeartRate(ibi: number[]): number {
  if (ibi.length === 0) return 0;

  const meanIBI = ibi.reduce((a, b) => a + b, 0) / ibi.length;
  return 60000 / meanIBI; // Convert to BPM
}
