/**
 * Hugging Face Inference API for Skin Disease Detection
 *
 * Uses Arko007/skin-disease-detector-ai model (8 conditions)
 * FREE tier: 30,000 requests/month
 *
 * Get your free API token: https://huggingface.co/settings/tokens
 */

import { NextRequest, NextResponse } from "next/server";

const HF_API_URL = "https://api-inference.huggingface.co/models/Arko007/skin-disease-detector-ai";
const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export interface DermClassificationResult {
  classId: string;
  label: string;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  overview: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
}

// Condition database for the 8 classes
const CONDITIONS: Record<string, {
  name: string;
  risk: 'low' | 'medium' | 'high';
  overview: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
}> = {
  'acne': {
    name: 'Acne',
    risk: 'low',
    overview: 'Common skin condition causing pimples, blackheads, and inflamed lesions.',
    symptoms: ['Pimples', 'Blackheads', 'Whiteheads', 'Oily skin', 'Potential scarring'],
    causes: ['Excess oil production', 'Clogged pores', 'Bacteria', 'Hormonal changes'],
    treatments: ['Topical retinoids', 'Benzoyl peroxide', 'Antibiotics', 'Oral medications']
  },
  'eczema': {
    name: 'Eczema (Atopic Dermatitis)',
    risk: 'low',
    overview: 'Chronic inflammatory skin condition causing itchy, red, dry patches.',
    symptoms: ['Intense itching', 'Red inflamed skin', 'Dry scaly patches', 'Cracking', 'Oozing'],
    causes: ['Genetics', 'Immune system dysfunction', 'Environmental triggers', 'Allergens'],
    treatments: ['Moisturizers', 'Topical corticosteroids', 'Immunomodulators', 'Antihistamines']
  },
  'melanoma': {
    name: 'Melanoma',
    risk: 'high',
    overview: 'Most serious type of skin cancer. Early detection is critical for successful treatment.',
    symptoms: ['Asymmetric mole', 'Irregular borders', 'Multiple colors', 'Diameter > 6mm', 'Evolving'],
    causes: ['UV radiation', 'Genetics', 'Fair skin', 'Many moles', 'History of sunburns'],
    treatments: ['Surgical excision', 'Immunotherapy', 'Targeted therapy', 'Radiation therapy']
  },
  'psoriasis': {
    name: 'Psoriasis',
    risk: 'medium',
    overview: 'Autoimmune condition causing rapid skin cell buildup with red patches and silvery scales.',
    symptoms: ['Red patches with silvery scales', 'Dry cracked skin', 'Itching/burning', 'Thickened nails'],
    causes: ['Immune system malfunction', 'Genetics', 'Stress', 'Infections', 'Cold weather'],
    treatments: ['Topical corticosteroids', 'Vitamin D analogs', 'Biologics', 'Phototherapy']
  },
  'rosacea': {
    name: 'Rosacea',
    risk: 'low',
    overview: 'Chronic inflammatory condition causing facial redness and visible blood vessels.',
    symptoms: ['Facial redness', 'Visible blood vessels', 'Bumps and pimples', 'Eye irritation'],
    causes: ['Genetics', 'Immune response', 'Environmental triggers', 'Demodex mites'],
    treatments: ['Topical medications', 'Oral antibiotics', 'Laser therapy', 'Trigger avoidance']
  },
  'vitiligo': {
    name: 'Vitiligo',
    risk: 'low',
    overview: 'Loss of skin pigmentation in patches due to melanocyte destruction.',
    symptoms: ['White patches on skin', 'Usually symmetric', 'Premature graying of hair', 'Color loss in mouth'],
    causes: ['Autoimmune condition', 'Genetics', 'Trigger events', 'Oxidative stress'],
    treatments: ['Topical corticosteroids', 'Phototherapy', 'Immunomodulators', 'Skin grafting']
  },
  'warts': {
    name: 'Warts (Verruca)',
    risk: 'low',
    overview: 'Small rough growths caused by human papillomavirus (HPV) infection.',
    symptoms: ['Rough bumps', 'Small black dots', 'Usually on hands/feet', 'Can spread'],
    causes: ['HPV infection', 'Direct contact', 'Broken skin', 'Weakened immune system'],
    treatments: ['Salicylic acid', 'Cryotherapy', 'Laser treatment', 'Immunotherapy']
  },
  'normal': {
    name: 'Normal Skin / No Condition Detected',
    risk: 'low',
    overview: 'No visible skin condition detected. Skin appears healthy.',
    symptoms: ['Clear skin', 'Even tone', 'No lesions', 'Healthy appearance'],
    causes: ['N/A'],
    treatments: ['Maintain with regular skincare', 'Sun protection', 'Healthy lifestyle']
  }
};

function parseDataUrl(dataUrl: string): Buffer {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image data URL");
  return Buffer.from(match[2], "base64");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { image?: string };

    if (!body.image) {
      return NextResponse.json({ error: "Missing 'image' field" }, { status: 400 });
    }

    if (!HF_TOKEN) {
      return NextResponse.json(
        { error: "Hugging Face API token not configured. Add HUGGINGFACE_API_TOKEN to .env" },
        { status: 503 }
      );
    }

    const imageBuffer = parseDataUrl(body.image);

    console.log('[HuggingFace] Calling skin disease detection model...');
    console.log('[HuggingFace] API URL:', HF_API_URL);
    console.log('[HuggingFace] Token present:', !!HF_TOKEN);
    console.log('[HuggingFace] Image size:', imageBuffer.length, 'bytes');

    // Call Hugging Face Inference API with better error handling
    let response: Response;
    try {
      response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: imageBuffer.toString('base64')
        }),
      });
    } catch (fetchError) {
      console.error('[HuggingFace] Fetch error:', fetchError);
      return NextResponse.json(
        {
          error: `Network error connecting to Hugging Face: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`
        },
        { status: 503 }
      );
    }

    console.log('[HuggingFace] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[HuggingFace] API Error:', response.status, errorText);

      // Model might be loading (cold start)
      if (response.status === 503) {
        return NextResponse.json(
          { error: "Model is loading. Please wait 20 seconds and try again." },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: `Hugging Face API error (${response.status}): ${errorText}` },
        { status: response.status }
      );
    }

    const predictions = await response.json() as Array<{
      label: string;
      score: number;
    }>;

    console.log('[HuggingFace] Predictions:', predictions);

    if (!predictions || predictions.length === 0) {
      throw new Error("No predictions returned from model");
    }

    // Get top prediction
    const topPrediction = predictions[0];
    const classId = topPrediction.label.toLowerCase().replace(/\s+/g, '_');
    const confidence = topPrediction.score;

    console.log('[HuggingFace] Top prediction:', topPrediction.label, confidence);

    // Get condition info
    const condition = CONDITIONS[classId] || CONDITIONS['normal'];

    const result: DermClassificationResult = {
      classId,
      label: condition.name,
      confidence,
      risk: condition.risk,
      overview: condition.overview,
      symptoms: condition.symptoms,
      causes: condition.causes,
      treatments: condition.treatments,
    };

    return NextResponse.json(result);

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[/api/classify/huggingface]', msg);
    console.error('[/api/classify/huggingface] Stack:', err instanceof Error ? err.stack : 'No stack');
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
