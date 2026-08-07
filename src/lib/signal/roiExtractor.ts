// Extract ROI (Region of Interest) mean RGB values from video frame

/**
 * Extract mean RGB values from a region of interest
 */
export function extractROIMeanRGB(
  videoElement: HTMLVideoElement,
  roi: { x: number; y: number; width: number; height: number }
): { r: number; g: number; b: number } {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Draw current video frame
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Get image data for ROI
  const imageData = ctx.getImageData(roi.x, roi.y, roi.width, roi.height);
  const data = imageData.data;

  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  const pixelCount = roi.width * roi.height;

  // Calculate mean RGB
  for (let i = 0; i < data.length; i += 4) {
    rSum += data[i];
    gSum += data[i + 1];
    bSum += data[i + 2];
  }

  return {
    r: rSum / pixelCount,
    g: gSum / pixelCount,
    b: bSum / pixelCount,
  };
}

/**
 * Get forehead ROI coordinates based on video dimensions
 */
export function getForeheadROI(
  videoWidth: number,
  videoHeight: number
): { x: number; y: number; width: number; height: number } {
  // Center-top region (forehead area)
  const width = Math.floor(videoWidth * 0.3);
  const height = Math.floor(videoHeight * 0.15);
  const x = Math.floor((videoWidth - width) / 2);
  const y = Math.floor(videoHeight * 0.2);

  return { x, y, width, height };
}
