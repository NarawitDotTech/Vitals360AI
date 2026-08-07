// Bandpass filter for signal processing

/**
 * Simple IIR bandpass filter
 */
export function bandpassFilter(
  signal: number[],
  options: { low: number; high: number; fs: number }
): number[] {
  const { low, high, fs } = options;

  // Butterworth 2nd order bandpass approximation
  const nyquist = fs / 2;
  const lowNorm = low / nyquist;
  const highNorm = high / nyquist;

  // Simple implementation using moving average for demonstration
  // For production, use a proper Butterworth filter library
  const filtered = new Array(signal.length).fill(0);

  // High-pass filter (remove DC and low frequencies)
  const hpWindowSize = Math.floor(fs / low);
  for (let i = hpWindowSize; i < signal.length; i++) {
    let sum = 0;
    for (let j = 0; j < hpWindowSize; j++) {
      sum += signal[i - j];
    }
    filtered[i] = signal[i] - sum / hpWindowSize;
  }

  // Low-pass filter (remove high frequencies)
  const lpWindowSize = Math.floor(fs / high);
  const result = new Array(signal.length).fill(0);
  for (let i = lpWindowSize; i < signal.length; i++) {
    let sum = 0;
    for (let j = 0; j < lpWindowSize; j++) {
      sum += filtered[i - j];
    }
    result[i] = sum / lpWindowSize;
  }

  return result;
}

/**
 * Detrend signal (remove linear trend)
 */
export function detrend(signal: number[]): number[] {
  const n = signal.length;

  // Calculate linear trend
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += signal[i];
    sumXY += i * signal[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Remove trend
  const detrended = new Array(n);
  for (let i = 0; i < n; i++) {
    detrended[i] = signal[i] - (slope * i + intercept);
  }

  return detrended;
}
