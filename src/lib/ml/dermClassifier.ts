/**
 * Client-side comprehensive skin disease classification
 *
 * Classifies 50+ skin conditions using browser-based analysis
 * No backend required - runs 100% client-side
 */

import {
  classifyImage,
  loadModel,
  type ClassificationResult,
  SKIN_CONDITIONS
} from '@/lib/ml/comprehensiveSkinClassifier';

export interface DermClassificationResult {
  classId: string;
  label: string;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  overview: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
  // Additional predictions
  alternatives?: Array<{
    label: string;
    confidence: number;
  }>;
}

/**
 * Classify skin lesion image locally in the browser
 */
export async function classifyDermImageLocally(
  base64Image: string
): Promise<DermClassificationResult> {
  try {
    // Ensure model is loaded
    await loadModel();

    // Convert base64 to ImageData
    const imageData = await base64ToImageData(base64Image);

    // Classify
    const result: ClassificationResult = await classifyImage(imageData);

    const { topPrediction, alternatives } = result;
    const condition = SKIN_CONDITIONS[topPrediction.id];

    return {
      classId: condition.id,
      label: condition.name,
      confidence: topPrediction.confidence,
      risk: condition.risk,
      overview: condition.description,
      symptoms: condition.symptoms,
      causes: condition.causes,
      treatments: condition.treatments,
      alternatives: alternatives.map(alt => ({
        label: alt.name,
        confidence: alt.confidence
      }))
    };

  } catch (error) {
    console.error('[classifyDermImageLocally] Error:', error);
    throw error;
  }
}

/**
 * Convert base64 image to ImageData
 */
async function base64ToImageData(base64: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Handle both data URL and raw base64
    if (base64.startsWith('data:')) {
      img.src = base64;
    } else {
      img.src = `data:image/jpeg;base64,${base64}`;
    }
  });
}
