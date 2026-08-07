// FFT implementation for frequency analysis

/**
 * Simple FFT implementation (Cooley-Tukey algorithm)
 */
export function fft(signal: number[]): { real: number[]; imag: number[] } {
  const n = signal.length;

  // Ensure power of 2
  if (!isPowerOfTwo(n)) {
    throw new Error('Signal length must be a power of 2');
  }

  const real = new Array(n).fill(0);
  const imag = new Array(n).fill(0);

  // Copy signal to real part
  for (let i = 0; i < n; i++) {
    real[i] = signal[i];
  }

  // Bit reversal
  let j = 0;
  for (let i = 0; i < n - 1; i++) {
    if (i < j) {
      [real[i], real[j]] = [real[j], real[i]];
      [imag[i], imag[j]] = [imag[j], imag[i]];
    }

    let k = n / 2;
    while (k <= j) {
      j -= k;
      k /= 2;
    }
    j += k;
  }

  // FFT computation
  for (let len = 2; len <= n; len *= 2) {
    const halfLen = len / 2;
    const angle = -2 * Math.PI / len;

    for (let i = 0; i < n; i += len) {
      for (let k = 0; k < halfLen; k++) {
        const idx1 = i + k;
        const idx2 = i + k + halfLen;

        const thetaReal = Math.cos(angle * k);
        const thetaImag = Math.sin(angle * k);

        const tempReal = real[idx2] * thetaReal - imag[idx2] * thetaImag;
        const tempImag = real[idx2] * thetaImag + imag[idx2] * thetaReal;

        real[idx2] = real[idx1] - tempReal;
        imag[idx2] = imag[idx1] - tempImag;
        real[idx1] = real[idx1] + tempReal;
        imag[idx1] = imag[idx1] + tempImag;
      }
    }
  }

  return { real, imag };
}

/**
 * Calculate magnitude spectrum from FFT
 */
export function getMagnitudeSpectrum(fftResult: { real: number[]; imag: number[] }): number[] {
  const { real, imag } = fftResult;
  const magnitude = new Array(real.length);

  for (let i = 0; i < real.length; i++) {
    magnitude[i] = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]);
  }

  return magnitude;
}

/**
 * Find dominant frequency in signal
 */
export function findDominantFrequency(
  signal: number[],
  sampleRate: number,
  minFreq: number,
  maxFreq: number
): number {
  // Pad to next power of 2
  const paddedLength = nextPowerOfTwo(signal.length);
  const padded = new Array(paddedLength).fill(0);
  for (let i = 0; i < signal.length; i++) {
    padded[i] = signal[i];
  }

  // Compute FFT
  const fftResult = fft(padded);
  const magnitude = getMagnitudeSpectrum(fftResult);

  // Find peak in frequency range
  const minIdx = Math.floor((minFreq / sampleRate) * paddedLength);
  const maxIdx = Math.floor((maxFreq / sampleRate) * paddedLength);

  let maxMag = 0;
  let maxIdx_found = minIdx;

  for (let i = minIdx; i <= maxIdx && i < magnitude.length / 2; i++) {
    if (magnitude[i] > maxMag) {
      maxMag = magnitude[i];
      maxIdx_found = i;
    }
  }

  // Convert index to frequency
  const dominantFreq = (maxIdx_found * sampleRate) / paddedLength;

  return dominantFreq;
}

function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

function nextPowerOfTwo(n: number): number {
  let power = 1;
  while (power < n) {
    power *= 2;
  }
  return power;
}
