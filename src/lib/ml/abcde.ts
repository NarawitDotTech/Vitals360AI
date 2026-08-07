// ABCDE heuristic analysis for skin lesions
// This is a simplified client-side heuristic, not a replacement for professional diagnosis

export interface ABCDEScore {
  asymmetry: number; // 0-2
  border: number; // 0-2
  color: number; // 0-3
  diameter: number; // 0-2
  evolution: string; // Cannot assess from single image
  total: number; // out of 9
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ABCDEAnalysis {
  score: ABCDEScore;
  details: {
    asymmetry: string;
    border: string;
    color: string;
    diameter: string;
    evolution: string;
  };
}

/**
 * Analyze skin lesion image using ABCDE criteria
 * This is a simplified heuristic based on image properties
 */
export function analyzeABCDE(imageData: ImageData): ABCDEAnalysis {
  const { width, height, data } = imageData;

  // A - Asymmetry (0-2)
  const asymmetryScore = calculateAsymmetry(data, width, height);

  // B - Border irregularity (0-2)
  const borderScore = calculateBorderIrregularity(data, width, height);

  // C - Color variation (0-3)
  const colorScore = calculateColorVariation(data);

  // D - Diameter (0-2) - estimate based on image size
  const diameterScore = estimateDiameter(width, height);

  const total = asymmetryScore + borderScore + colorScore + diameterScore;

  // Risk level based on total score
  let riskLevel: 'low' | 'medium' | 'high';
  if (total <= 3) riskLevel = 'low';
  else if (total <= 6) riskLevel = 'medium';
  else riskLevel = 'high';

  return {
    score: {
      asymmetry: asymmetryScore,
      border: borderScore,
      color: colorScore,
      diameter: diameterScore,
      evolution: 'Cannot assess from single image',
      total,
      riskLevel,
    },
    details: {
      asymmetry: getAsymmetryDescription(asymmetryScore),
      border: getBorderDescription(borderScore),
      color: getColorDescription(colorScore),
      diameter: getDiameterDescription(diameterScore),
      evolution: 'Evolution requires comparing multiple images over time. Monitor for changes in size, shape, or color.',
    },
  };
}

function calculateAsymmetry(data: Uint8ClampedArray, width: number, height: number): number {
  // Simplified: compare left/right halves
  const midX = Math.floor(width / 2);
  let leftSum = 0;
  let rightSum = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < midX; x++) {
      const leftIdx = (y * width + x) * 4;
      const rightIdx = (y * width + (width - 1 - x)) * 4;

      leftSum += data[leftIdx] + data[leftIdx + 1] + data[leftIdx + 2];
      rightSum += data[rightIdx] + data[rightIdx + 1] + data[rightIdx + 2];
    }
  }

  const diff = Math.abs(leftSum - rightSum) / (leftSum + rightSum);

  if (diff < 0.1) return 0; // Symmetric
  if (diff < 0.25) return 1; // Mildly asymmetric
  return 2; // Highly asymmetric
}

function calculateBorderIrregularity(data: Uint8ClampedArray, width: number, height: number): number {
  // Simplified: detect edge variations
  let edgeVariance = 0;
  const samples = 100;

  for (let i = 0; i < samples; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const idx = (y * width + x) * 4;

    if (x > 0 && x < width - 1 && y > 0 && y < height - 1) {
      const curr = data[idx] + data[idx + 1] + data[idx + 2];
      const right = data[idx + 4] + data[idx + 5] + data[idx + 6];
      const down = data[idx + width * 4] + data[idx + width * 4 + 1] + data[idx + width * 4 + 2];

      edgeVariance += Math.abs(curr - right) + Math.abs(curr - down);
    }
  }

  const avgVariance = edgeVariance / samples;

  if (avgVariance < 50) return 0; // Smooth border
  if (avgVariance < 150) return 1; // Somewhat irregular
  return 2; // Very irregular
}

function calculateColorVariation(data: Uint8ClampedArray): number {
  // Count distinct color regions
  const colors = new Set<string>();
  const sampleSize = Math.min(1000, data.length / 4);

  for (let i = 0; i < sampleSize; i++) {
    const idx = Math.floor(Math.random() * (data.length / 4)) * 4;
    const r = Math.floor(data[idx] / 50);
    const g = Math.floor(data[idx + 1] / 50);
    const b = Math.floor(data[idx + 2] / 50);
    colors.add(`${r},${g},${b}`);
  }

  const uniqueColors = colors.size;

  if (uniqueColors <= 3) return 0; // 1-2 colors
  if (uniqueColors <= 6) return 1; // 3-4 colors
  if (uniqueColors <= 10) return 2; // 5-6 colors
  return 3; // 6+ colors
}

function estimateDiameter(width: number, height: number): number {
  // Rough estimate: assume captured lesion fills 60% of frame
  // and typical capture distance gives ~1mm per 10 pixels
  const avgDimension = (width + height) / 2;
  const estimatedMm = (avgDimension * 0.6) / 10;

  if (estimatedMm < 6) return 0; // Small
  if (estimatedMm < 10) return 1; // Medium
  return 2; // Large (>6mm is concerning)
}

function getAsymmetryDescription(score: number): string {
  switch (score) {
    case 0:
      return 'Symmetric - both halves of the lesion appear similar';
    case 1:
      return 'Mildly asymmetric - some differences between halves';
    case 2:
      return 'Highly asymmetric - one half noticeably different from the other';
    default:
      return 'Unknown';
  }
}

function getBorderDescription(score: number): string {
  switch (score) {
    case 0:
      return 'Smooth, well-defined borders';
    case 1:
      return 'Somewhat irregular borders with minor variations';
    case 2:
      return 'Very irregular, poorly defined, or notched borders';
    default:
      return 'Unknown';
  }
}

function getColorDescription(score: number): string {
  switch (score) {
    case 0:
      return 'Uniform color (1-2 colors)';
    case 1:
      return 'Some color variation (3-4 colors)';
    case 2:
      return 'Multiple colors present (5-6 colors)';
    case 3:
      return 'Many different colors or unusual color patterns';
    default:
      return 'Unknown';
  }
}

function getDiameterDescription(score: number): string {
  switch (score) {
    case 0:
      return 'Small lesion (estimated < 6mm)';
    case 1:
      return 'Medium lesion (estimated 6-10mm)';
    case 2:
      return 'Large lesion (estimated > 6mm diameter - warrants attention)';
    default:
      return 'Unknown';
  }
}
