// ONNX model inference for respiratory sound classification
import { computeMelSpectrogram, normalizeMelSpectrogram } from '@/lib/audio/melSpectrogram';

export interface RespiratoryPrediction {
  class: string;
  confidence: number;
  probabilities: Array<{
    class: string;
    probability: number;
  }>;
}

// ICBHI 2017 dataset classes
const RESPIRATORY_CLASSES = [
  'Normal',
  'Crackles',
  'Wheezes',
  'Both (Crackles + Wheezes)',
];

let sessionCache: any | null = null;
let ortModule: any = null;

/**
 * Lazy load ONNX Runtime Web
 */
async function loadOnnxRuntime() {
  if (ortModule) {
    return ortModule;
  }

  try {
    // Dynamic import to avoid build-time issues
    ortModule = await import('onnxruntime-web');
    return ortModule;
  } catch (error) {
    console.error('Failed to load ONNX Runtime:', error);
    throw new Error('ONNX Runtime could not be loaded');
  }
}

/**
 * Load the ONNX model (cached after first load)
 */
async function loadModel() {
  if (sessionCache) {
    return sessionCache;
  }

  try {
    const ort = await loadOnnxRuntime();

    // Set WASM paths for ONNX Runtime
    ort.env.wasm.wasmPaths = '/node_modules/onnxruntime-web/dist/';

    // Load model
    const session = await ort.InferenceSession.create(
      '/models/respiratory/ast-icbhi-int8.onnx',
      {
        executionProviders: ['wasm'],
      }
    );

    sessionCache = session;
    return session;
  } catch (error) {
    console.error('Error loading ONNX model:', error);
    throw new Error('Failed to load respiratory analysis model');
  }
}

/**
 * Classify respiratory sounds from PCM audio data
 */
export async function classifyRespiratoryPcm(
  pcm: Float32Array,
  sampleRate: number,
  onProgress?: (progress: number) => void
): Promise<RespiratoryPrediction> {
  try {
    onProgress?.(0.1);

    const ort = await loadOnnxRuntime();

    // Load model
    const session = await loadModel();
    onProgress?.(0.3);

    // Compute mel spectrogram
    const mel = computeMelSpectrogram(pcm, {
      sampleRate,
      nMels: 128,
      nFft: 2048,
      hopLength: 512,
    });

    onProgress?.(0.5);

    // Normalize
    const normalized = normalizeMelSpectrogram(mel);

    // Prepare input tensor
    // Expected shape: [batch, channels, height, width]
    // For AST model: [1, 1, 128, time_steps]
    const timeSteps = Math.floor(normalized.length / 128);
    const inputData = new Float32Array(1 * 1 * 128 * timeSteps);

    // Reshape to [1, 1, 128, timeSteps]
    for (let i = 0; i < normalized.length; i++) {
      inputData[i] = normalized[i];
    }

    const inputTensor = new ort.Tensor('float32', inputData, [1, 1, 128, timeSteps]);

    onProgress?.(0.7);

    // Run inference
    const feeds: Record<string, any> = {};
    feeds[session.inputNames[0]] = inputTensor;

    const outputs = await session.run(feeds);
    const outputTensor = outputs[session.outputNames[0]];

    onProgress?.(0.9);

    // Get logits
    const logits = outputTensor.data as Float32Array;

    // Apply softmax
    const probs = softmax(Array.from(logits).slice(0, RESPIRATORY_CLASSES.length));

    // Find top prediction
    const topIdx = argmax(probs);

    onProgress?.(1.0);

    return {
      class: RESPIRATORY_CLASSES[topIdx],
      confidence: probs[topIdx],
      probabilities: RESPIRATORY_CLASSES.map((cls, idx) => ({
        class: cls,
        probability: probs[idx],
      })).sort((a, b) => b.probability - a.probability),
    };
  } catch (error) {
    console.error('Classification error:', error);
    throw new Error('Failed to classify respiratory sounds');
  }
}

/**
 * Softmax function
 */
function softmax(logits: number[]): number[] {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((x) => Math.exp(x - maxLogit));
  const sumExps = exps.reduce((a, b) => a + b, 0);
  return exps.map((x) => x / sumExps);
}

/**
 * Argmax function
 */
function argmax(arr: number[]): number {
  let maxIdx = 0;
  let maxVal = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxVal) {
      maxVal = arr[i];
      maxIdx = i;
    }
  }

  return maxIdx;
}

/**
 * Check if model is available
 */
export async function checkModelAvailability(): Promise<boolean> {
  try {
    const response = await fetch('/models/respiratory/ast-icbhi-int8.onnx', {
      method: 'HEAD',
    });
    return response.ok;
  } catch {
    return false;
  }
}
