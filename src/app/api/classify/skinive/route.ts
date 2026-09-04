/**
 * Skinive API integration for professional skin disease detection
 *
 * This route integrates with Skinive's commercial API for accurate
 * skin disease classification using their trained neural networks.
 *
 * API Documentation: https://api.skiniver.com
 *
 * Env vars (add to .env.local):
 *   SKINIVE_API_TOKEN - Your Skinive API token
 */

import { NextRequest, NextResponse } from "next/server";

const SKINIVE_API_URL = "https://api.skiniver.com";
const API_TOKEN = process.env.SKINIVE_API_TOKEN;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Lang = "en" | "ru";

export interface SkiniveValidateResponse {
  prob: string;
  isgood: string;
}

export interface SkinivePredictResponse {
  atlas_page_link: string;
  check_datetime: string;
  class: string;
  class_raw: string;
  colored_s3_url: string;
  description: string;
  desease: string;
  error: string | null;
  image_url: string;
  masked_s3_url: string;
  prob: string;
  risk: string;
  risk_level: string;
  s3_url: string;
  status: boolean;
}

export interface DermClassificationResult {
  classId: string;
  label: string;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  overview: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
  // Skinive-specific fields
  atlasLink?: string;
  imageUrl?: string;
  maskedImageUrl?: string;
  coloredImageUrl?: string;
  diseaseType?: string;
  checkDatetime?: string;
}

function parseDataUrl(dataUrl: string): { buffer: Buffer; mime: string; ext: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image data URL");
  const mime = match[1];
  const ext = mime.includes("png") ? "png" : "jpg";
  return { buffer: Buffer.from(match[2], "base64"), mime, ext };
}

/**
 * Validate image suitability for recognition
 */
async function validateImage(imageBuffer: Buffer, mime: string): Promise<SkiniveValidateResponse> {
  if (!API_TOKEN) {
    throw new Error("SKINIVE_API_TOKEN is not configured");
  }

  const form = new FormData();
  form.append("img", new Blob([imageBuffer], { type: mime }), "image.jpg");

  const response = await fetch(`${SKINIVE_API_URL}/validate`, {
    method: "POST",
    headers: {
      "Authorization": API_TOKEN,
    },
    body: form,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Validation failed (${response.status}): ${errorText || response.statusText}`);
  }

  return await response.json();
}

/**
 * Predict skin disease
 */
async function predictDisease(
  imageBuffer: Buffer,
  mime: string,
  lang: Lang
): Promise<SkinivePredictResponse> {
  if (!API_TOKEN) {
    throw new Error("SKINIVE_API_TOKEN is not configured");
  }

  const form = new FormData();
  form.append("img", new Blob([imageBuffer], { type: mime }), "image.jpg");

  const headers: Record<string, string> = {
    "Authorization": API_TOKEN,
    "Locale": lang,
  };

  const response = await fetch(`${SKINIVE_API_URL}/predict`, {
    method: "POST",
    headers,
    body: form,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");

    // Check for specific error codes
    try {
      const errorJson = await response.json();
      if (errorJson.error_code === 1) {
        throw new Error("API token limit exceeded. Please contact support.");
      }
      if (errorJson.error_code === 4) {
        throw new Error("Failed to load image. Please try a different photo.");
      }
    } catch {
      // Not JSON or couldn't parse
    }

    throw new Error(`Prediction failed (${response.status}): ${errorText || response.statusText}`);
  }

  return await response.json();
}

/**
 * Parse description to extract symptoms, causes, and treatments
 */
function parseDescription(description: string): {
  overview: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
} {
  // Skinive returns a formatted description with sections
  // Extract the different parts
  const lines = description.split('\n').filter(line => line.trim());

  const overview = lines[0] || description;
  const symptoms: string[] = [];
  const causes: string[] = [];
  const treatments: string[] = [];

  // Look for treatment and diagnosis info
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes('treatment:')) {
      treatments.push(line.split(':')[1]?.trim() || line);
    } else if (lower.includes('diagnosis:')) {
      symptoms.push(line.split(':')[1]?.trim() || line);
    } else if (lower.includes('advice:')) {
      treatments.push(line.split(':')[1]?.trim() || line);
    }
  }

  return { overview, symptoms, causes, treatments };
}

/**
 * Map Skinive risk level to our format
 */
function mapRiskLevel(riskLevel: string): 'low' | 'medium' | 'high' {
  const level = riskLevel.toLowerCase();
  if (level === 'low') return 'low';
  if (level === 'medium' || level === 'moderate') return 'medium';
  if (level === 'high') return 'high';
  return 'low';
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { image?: string; lang?: string };

    if (!body.image) {
      return NextResponse.json({ error: "Missing 'image' field" }, { status: 400 });
    }

    if (!API_TOKEN) {
      return NextResponse.json(
        { error: "Skinive API is not configured. Please add SKINIVE_API_TOKEN to environment variables." },
        { status: 503 }
      );
    }

    // Skinive only supports English and Russian
    const lang: Lang = body.lang === "ru" ? "ru" : "en";

    const { buffer, mime } = parseDataUrl(body.image);

    // Step 1: Validate the image
    console.log("[Skinive] Validating image...");
    const validation = await validateImage(buffer, mime);

    if (validation.isgood === "false") {
      return NextResponse.json(
        {
          error: "The photo is not suitable for analysis. Please take a clearer, well-lit photo of the affected skin area. Ensure the lesion fills most of the frame.",
        },
        { status: 400 }
      );
    }

    // Step 2: Get prediction
    console.log("[Skinive] Getting prediction...");
    const prediction = await predictDisease(buffer, mime, lang);

    if (!prediction.status || prediction.error) {
      throw new Error(prediction.error || "Prediction failed");
    }

    // Step 3: Parse and format the result
    const { overview, symptoms, causes, treatments } = parseDescription(prediction.description);

    const confidence = parseFloat(prediction.prob) / 100; // Convert percentage to decimal

    const result: DermClassificationResult = {
      classId: prediction.class_raw,
      label: prediction.class,
      confidence,
      risk: mapRiskLevel(prediction.risk_level),
      overview,
      symptoms,
      causes,
      treatments,
      // Skinive-specific fields
      atlasLink: prediction.atlas_page_link,
      imageUrl: prediction.image_url,
      maskedImageUrl: prediction.masked_s3_url,
      coloredImageUrl: prediction.colored_s3_url,
      diseaseType: prediction.desease,
      checkDatetime: prediction.check_datetime,
    };

    console.log("[Skinive] Classification successful:", prediction.class);
    return NextResponse.json(result);

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/classify/skinive]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
