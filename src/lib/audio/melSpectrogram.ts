// Mel spectrogram computation for audio analysis

export interface MelSpectrogramOptions {
  sampleRate: number;
  nMels: number;
  nFft?: number;
  hopLength?: number;
  fMin?: number;
  fMax?: number;
}

/**
 * Compute mel spectrogram from audio PCM data
 */
export function computeMelSpectrogram(
  pcm: Float32Array,
  options: MelSpectrogramOptions
): Float32Array {
  const {
    sampleRate,
    nMels,
    nFft = 2048,
    hopLength = 512,
    fMin = 0,
    fMax = sampleRate / 2,
  } = options;

  // Compute STFT
  const frames = Math.floor((pcm.length - nFft) / hopLength) + 1;
  const stft = new Float32Array(frames * (nFft / 2 + 1));

  for (let frame = 0; frame < frames; frame++) {
    const start = frame * hopLength;
    const segment = pcm.slice(start, start + nFft);

    // Apply Hann window
    const windowed = applyHannWindow(segment, nFft);

    // Compute FFT magnitude
    const magnitude = computeFFTMagnitude(windowed);

    // Store in STFT matrix
    for (let i = 0; i < magnitude.length; i++) {
      stft[i * frames + frame] = magnitude[i];
    }
  }

  // Create mel filterbank
  const melFilters = createMelFilterbank(nMels, nFft, sampleRate, fMin, fMax);

  // Apply mel filters
  const melSpectrogram = new Float32Array(nMels * frames);

  for (let mel = 0; mel < nMels; mel++) {
    for (let frame = 0; frame < frames; frame++) {
      let value = 0;
      for (let freq = 0; freq < nFft / 2 + 1; freq++) {
        value += stft[freq * frames + frame] * melFilters[mel * (nFft / 2 + 1) + freq];
      }
      melSpectrogram[mel * frames + frame] = Math.log(Math.max(value, 1e-10));
    }
  }

  return melSpectrogram;
}

function applyHannWindow(signal: Float32Array, length: number): Float32Array {
  const windowed = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const window = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (length - 1)));
    windowed[i] = (signal[i] || 0) * window;
  }
  return windowed;
}

function computeFFTMagnitude(signal: Float32Array): Float32Array {
  const n = signal.length;
  const real = new Float32Array(n);
  const imag = new Float32Array(n);

  // Copy signal to real part
  real.set(signal);

  // Simple DFT (not optimized, but works for our purposes)
  // For production, use a proper FFT library
  const output = new Float32Array(n / 2 + 1);

  for (let k = 0; k < n / 2 + 1; k++) {
    let re = 0;
    let im = 0;

    for (let n_idx = 0; n_idx < n; n_idx++) {
      const angle = (-2 * Math.PI * k * n_idx) / n;
      re += real[n_idx] * Math.cos(angle);
      im += real[n_idx] * Math.sin(angle);
    }

    output[k] = Math.sqrt(re * re + im * im);
  }

  return output;
}

function createMelFilterbank(
  nMels: number,
  nFft: number,
  sampleRate: number,
  fMin: number,
  fMax: number
): Float32Array {
  const nFreqs = nFft / 2 + 1;
  const filters = new Float32Array(nMels * nFreqs);

  // Convert to mel scale
  const melMin = hzToMel(fMin);
  const melMax = hzToMel(fMax);

  // Create mel points
  const melPoints = new Float32Array(nMels + 2);
  for (let i = 0; i < nMels + 2; i++) {
    melPoints[i] = melMin + (i * (melMax - melMin)) / (nMels + 1);
  }

  // Convert back to Hz
  const hzPoints = melPoints.map(melToHz);

  // Convert to FFT bin numbers
  const binPoints = hzPoints.map((hz) => Math.floor(((nFft + 1) * hz) / sampleRate));

  // Create triangular filters
  for (let mel = 0; mel < nMels; mel++) {
    const left = binPoints[mel];
    const center = binPoints[mel + 1];
    const right = binPoints[mel + 2];

    for (let freq = left; freq < center; freq++) {
      filters[mel * nFreqs + freq] = (freq - left) / (center - left);
    }

    for (let freq = center; freq < right; freq++) {
      filters[mel * nFreqs + freq] = (right - freq) / (right - center);
    }
  }

  return filters;
}

function hzToMel(hz: number): number {
  return 2595 * Math.log10(1 + hz / 700);
}

function melToHz(mel: number): number {
  return 700 * (Math.pow(10, mel / 2595) - 1);
}

/**
 * Normalize mel spectrogram to [-1, 1] range
 */
export function normalizeMelSpectrogram(mel: Float32Array): Float32Array {
  const min = Math.min(...mel);
  const max = Math.max(...mel);
  const range = max - min;

  const normalized = new Float32Array(mel.length);
  for (let i = 0; i < mel.length; i++) {
    normalized[i] = range > 0 ? 2 * ((mel[i] - min) / range) - 1 : 0;
  }

  return normalized;
}
