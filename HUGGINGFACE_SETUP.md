# FREE AI Skin Disease Detection Setup

## ✅ What You Got

**REAL AI MODEL** from Hugging Face that detects 8 skin conditions:

1. **Acne** - Pimples, blackheads, inflammatory lesions
2. **Eczema** - Itchy, inflamed, red patches
3. **Melanoma** - Serious skin cancer (high risk)
4. **Psoriasis** - Red patches with silvery scales
5. **Rosacea** - Facial redness, visible blood vessels
6. **Vitiligo** - Loss of skin pigmentation
7. **Warts** - HPV-caused rough bumps
8. **Normal** - No condition detected

## 🆓 100% FREE

- **API:** Hugging Face Inference API
- **Free Tier:** 30,000 requests/month
- **Model:** [Arko007/skin-disease-detector-ai](https://huggingface.co/Arko007/skin-disease-detector-ai)
- **Trained on:** 33,000+ images with EfficientNet architecture
- **No credit card required**

## 🚀 Setup (2 minutes)

### Step 1: Get FREE API Token

1. Go to: https://huggingface.co/settings/tokens
2. Click "New token"
3. Name it: `skin-detection-app`
4. Type: `Read`
5. Click "Generate token"
6. Copy the token (starts with `hf_...`)

### Step 2: Add to Your App

1. Open `.env.local` file (already created)
2. Replace `your_token_here` with your actual token:
   ```
   HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxx
   ```
3. Save the file

### Step 3: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 4: Test It!

1. Go to: http://localhost:3000/derm
2. Upload a skin image
3. Get AI results in 3-20 seconds!

## 🔥 Features

✅ **Real trained AI model** (not heuristics!)
✅ **Accurate predictions** with confidence scores
✅ **8 common conditions** covered
✅ **FREE 30,000 requests/month** (1,000/day)
✅ **ABCDE analysis** for melanoma screening
✅ **Detailed info** for each condition
✅ **No credit card needed**

## 📊 How It Works

1. User uploads image
2. Your app sends it to Hugging Face API
3. Pre-trained EfficientNet model analyzes it
4. Returns top prediction + confidence score
5. Your app displays full diagnosis info

## ⚠️ First Request Note

The first request might take **20 seconds** because the model needs to "wake up" (cold start). After that, it's fast (3-5 seconds).

If you get a 503 error, just wait 20 seconds and try again.

## 🆚 Comparison with Previous Solutions

| Feature | Hugging Face (Current) | Heuristic (Old) | Skinive (Paid) |
|---------|----------------------|-----------------|----------------|
| **Accuracy** | ⭐⭐⭐⭐ Real AI | ⭐ Color analysis | ⭐⭐⭐⭐⭐ Medical-grade |
| **Cost** | FREE (30k/month) | FREE | PAID per request |
| **Conditions** | 8 | 50+ (fake) | 30+ |
| **Setup** | 2 min | None | Complex |
| **Speed** | 3-20s | Instant | 3-5s |

## 🔗 Alternative FREE AI Options

If you want more conditions, you can also use:

1. **[davidfred/vit_skin_disease_model](https://huggingface.co/davidfred/vit_skin_disease_model)** - 10 conditions
2. **[arkito/VeritaDerm](https://huggingface.co/arkito/VeritaDerm)** - YOLO11-based
3. **[syaha/skin_cancer_detection_model](https://huggingface.co/syaha/skin_cancer_detection_model)** - 7 cancer types

Just change the `HF_API_URL` in `/api/classify/huggingface/route.ts`

## 📝 Notes

- This is a **screening tool**, not a replacement for professional diagnosis
- Always include medical disclaimer
- Model was trained by community researchers
- Results should be verified by dermatologists

## 🎉 You're Done!

Your app now has REAL AI skin disease detection, completely free!

**Sources:**
- [Hugging Face Model](https://huggingface.co/Arko007/skin-disease-detector-ai)
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference/index)
- [Free API Docs](https://huggingface.co/docs/api-inference/quicktour)
