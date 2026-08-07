/**
 * Skin disease classifier — proxies the SkinDiseasesDetection API
 * (https://github.com/pacificrm/skinDiseasesDetection), a FastAPI service
 * hosting a Vision Transformer (ONNX) that detects 22 skin conditions.
 *
 * The upstream endpoint is `POST {SKINDETECT_API_URL}/detect` and expects
 * multipart/form-data with a single image file field named `im`.
 *
 * The upstream returns English-only content. When the client passes
 * `lang: "th"`, the response text is translated to Thai server-side.
 *
 * Env vars (see .env.local.example):
 *   SKINDETECT_API_URL — base URL of the detection service
 *   SKINDETECT_API_KEY — optional Bearer token if your deployment requires one
 */

import { NextRequest, NextResponse } from "next/server";

const API_URL = (
  process.env.SKINDETECT_API_URL ?? "https://skindiseasesdetect-2.onrender.com"
).replace(/\/$/, "");

export const dynamic = "force-dynamic";

type Lang = "en" | "th";

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

/** Thai display names for the 22 upstream disease classes. */
const DISEASE_TH: Record<string, string> = {
  Acne: "สิว",
  Actinic_Keratosis: "แอคทินิกเคอะโทซิส (ผื่นจากแสงแดด)",
  Benign_tumors: "เนื้องอกไม่ร้ายแรง",
  Bullous: "โรคตุ่มน้ำพองผิวหนัง",
  Candidiasis: "โรคเชื้อราแคนดิดา",
  DrugEruption: "ผื่นแพ้ยา",
  Eczema: "ผื่นภูมิแพ้ผิวหนัง (เอ็กซีมา)",
  Infestations_Bites: "การติดเชื้อ/กัดต่อยจากแมลงหรือปรสิต",
  Lichen: "ลิเคน",
  Lupus: "ลูปัส",
  Moles: "ไฝ",
  Psoriasis: "โรคสะเก็ดเงิน",
  Rosacea: "โรสเซเชีย (ผื่นแดงบนใบหน้า)",
  Seborrh_Keratoses: "กระหนังอ่อน (ซีโบรีอิกเคอะโทซิส)",
  SkinCancer: "มะเร็งผิวหนัง",
  Sun_Sunlight_Damage: "ผิวเสียจากแสงแดด",
  Tinea: "กลากเกลื้อน",
  Unknown_Normal: "ไม่ทราบ/ผิวปกติ",
  Vascular_Tumors: "เนื้องอกหลอดเลือด",
  Vasculitis: "หลอดเลือดอักเสบ",
  Vitiligo: "โรคด่างขาว",
  Warts: "หูด",
};

/** Map a detected condition to a screening risk tier. */
function riskFor(disease: string): "low" | "medium" | "high" {
  const d = disease.toLowerCase();
  if (d.includes("cancer")) return "high";
  if (d.includes("actinic") || d.includes("lupus") || d.includes("vasculitis")) {
    return "medium";
  }
  if (d.includes("unknown") || d.includes("normal")) return "low";
  return "low";
}

function parseDataUrl(dataUrl: string): { buffer: Buffer; mime: string; ext: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image data URL");
  const mime = match[1];
  const ext = mime.includes("png") ? "png" : "jpg";
  return { buffer: Buffer.from(match[2], "base64"), mime, ext };
}

/**
 * Translate one English string to Thai using the free Google Translate
 * endpoint. Falls back to the original text on any failure.
 */
async function translateToThai(text: string): Promise<string> {
  if (!text.trim()) return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=th&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return text;
    const data = (await res.json()) as Array<Array<[string, ...unknown[]]>>;
    const translated = (data[0] ?? []).map((seg) => seg[0]).join("");
    return translated || text;
  } catch {
    return text;
  }
}

async function translateFields(fields: {
  overview: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
}): Promise<typeof fields> {
  const flat = [fields.overview, ...fields.symptoms, ...fields.causes, ...fields.treatments];
  const translated = await Promise.all(flat.map(translateToThai));
  let i = 0;
  const overview = translated[i++];
  const symptoms = translated.slice(i, (i += fields.symptoms.length));
  const causes = translated.slice(i, (i += fields.causes.length));
  const treatments = translated.slice(i, i + fields.treatments.length);
  return { overview, symptoms, causes, treatments };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { image?: string; lang?: Lang };
    if (!body.image) {
      return NextResponse.json({ error: "Missing 'image' field" }, { status: 400 });
    }
    const lang: Lang = body.lang === "th" ? "th" : "en";

    const { buffer, mime, ext } = parseDataUrl(body.image);

    // Build the multipart payload expected by the upstream FastAPI service.
    const form = new FormData();
    form.append("im", new Blob([new Uint8Array(buffer)], { type: mime }), `lesion.${ext}`);

    const headers: Record<string, string> = {};
    const apiKey = process.env.SKINDETECT_API_KEY;
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    let upstream: Response;
    try {
      upstream = await fetch(`${API_URL}/detect`, {
        method: "POST",
        headers,
        body: form,
        signal: AbortSignal.timeout(60_000), // free-tier instances can cold-start
      });
    } catch {
      return NextResponse.json(
        {
          error:
            "Could not reach the skin detection service. It may be waking up (free hosting) — please try again in a few seconds.",
        },
        { status: 502 }
      );
    }

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => "");
      return NextResponse.json(
        { error: `Detection service error (${upstream.status}): ${errText || upstream.statusText}` },
        { status: 502 }
      );
    }

    const data = (await upstream.json()) as {
      disease?: string;
      overview?: string;
      symptoms?: string[];
      causes?: string[];
      treatments?: string[];
      probability?: number;
    };

    if (!data.disease) throw new Error("Detection service did not return a disease");

    const confidence =
      typeof data.probability === "number" && Number.isFinite(data.probability)
        ? Math.min(1, Math.max(0, data.probability))
        : 0;

    let label = data.disease.replace(/_/g, " ");
    let fields = {
      overview: data.overview ?? "",
      symptoms: data.symptoms ?? [],
      causes: data.causes ?? [],
      treatments: data.treatments ?? [],
    };

    if (lang === "th") {
      label = DISEASE_TH[data.disease] ?? label;
      fields = await translateFields(fields);
    }

    return NextResponse.json({
      classId: data.disease,
      label,
      confidence,
      risk: riskFor(data.disease),
      ...fields,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/classify/derm]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
