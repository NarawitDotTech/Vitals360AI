# Vitals360 AI - Personal Health Screening Application

A modern, AI-powered health screening web application built with Next.js 14, TypeScript, and cutting-edge machine learning technologies.

## Features

### 🩺 Three Core Screening Tools

1. **Skin Lesion Screening** (`/derm`)
   - AI classification using HAM10000 taxonomy (7 classes)
   - ABCDE heuristic analysis for melanoma risk assessment
   - Advanced deep learning model for accurate classification
   - Actionable health advice and doctor consultation guidance

2. **Respiratory Sound Analysis** (`/respiratory`)
   - ONNX deep learning model (Audio Spectrogram Transformer)
   - Detects crackles, wheezes, and combined patterns
   - 100% browser-based processing (86.6 MB model)
   - Audio playback and WAV download

3. **Vital Signs Monitoring** (`/vitals`)
   - Camera-based rPPG (remote photoplethysmography)
   - Heart rate (BPM)
   - Heart rate variability (HRV: RMSSD, SDNN, pNN50)
   - Respiratory rate (breaths per minute)
   - No wearables required

## Tech Stack

- **Framework**: Next.js 14.2.29 (App Router)
- **Language**: TypeScript 5.7.3
- **Styling**: Tailwind CSS 3.4.17
- **AI/ML**: 
  - ONNX Runtime Web 1.27.0
  - Hugging Face Transformers 4.2.0
  - Custom AI classification models
- **UI**: 
  - Framer Motion 11.15.0
  - Lucide React 0.468.0
- **State**: Zustand 5.0.3
- **Utilities**: date-fns 4.1.0, clsx, tailwind-merge

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your AI service credentials:

```
MAXPLUS_API_KEY=your_api_key_here
MAXPLUS_BASE_URL=https://api.example.com/v1
MAXPLUS_DERM_MODEL=vision-model
```

### 3. Add ONNX Model (Required for Respiratory Feature)

The respiratory analysis feature requires a pre-trained ONNX model:

1. Download the Audio Spectrogram Transformer model:
   - Model: `ast-icbhi-int8.onnx` (86.6 MB)
   - Place it in: `public/models/respiratory/`

2. Create the directory if it doesn't exist:
   ```bash
   mkdir -p public/models/respiratory
   ```

3. The expected path is:
   ```
   public/models/respiratory/ast-icbhi-int8.onnx
   ```

**Note**: If the model is not present, the respiratory feature will show an error message.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
vitals360-ai/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── derm/              # Skin lesion screening
│   │   ├── respiratory/       # Respiratory analysis
│   │   ├── vitals/            # Vital signs monitoring
│   │   ├── settings/          # Settings & history
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── derm/             # Skin screening components
│   │   ├── respiratory/      # Respiratory components
│   │   └── vitals/           # Vitals components
│   └── lib/                   # Utilities & logic
│       ├── ml/               # ML models & algorithms
│       ├── signal/           # Signal processing
│       ├── audio/            # Audio utilities
│       ├── storage/          # Local storage management
│       └── utils/            # Helper functions
├── public/
│   └── models/               # ONNX models
│       └── respiratory/
│           └── ast-icbhi-int8.onnx
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## Key Features

### Design System
- **Color Palette**: Warm, professional (cream background, terracotta accent)
- **Typography**: Fraunces serif for headings, Inter for body
- **Components**: Fully rounded buttons (999px), editorial layout
- **Responsive**: Mobile-first design

### Privacy & Data
- **Local Storage**: All results stored in browser localStorage only
- **No Server Storage**: Medical data never stored on servers
- **Skin Images**: Processed via secure AI service for classification
- **In-Browser Processing**: Respiratory and vitals processed entirely client-side

### Medical Disclaimer
All results are **screening estimates only** and do NOT constitute medical diagnosis. Users must consult qualified healthcare professionals for medical advice.

## Browser Requirements

- Modern browser with:
  - WebAssembly support (for ONNX model)
  - Camera access (for vitals monitoring)
  - Microphone access (for respiratory analysis)
  - localStorage support

### Tested Browsers
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Limitations

1. **Skin Lesion Screening**:
   - Requires valid AI service API key
   - Internet connection required for classification
   - AI accuracy depends on image quality

2. **Respiratory Analysis**:
   - Model file must be manually added (86.6 MB)
   - Consumer microphone quality affects accuracy
   - ~68% sensitivity/specificity on ICBHI 2017 dataset

3. **Vital Signs Monitoring**:
   - Motion artifacts reduce accuracy significantly
   - Requires good lighting conditions
   - NOT validated for medical diagnosis
   - Cannot measure SpO₂ (blood oxygen)

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Style
- TypeScript strict mode enabled
- ESLint configuration included
- Tailwind CSS for styling

## License

This project is for educational and informational purposes only. Not intended for medical diagnosis or treatment.

## Support

For issues or questions, refer to the project documentation or contact the development team.

---

**Built with ❤️ for wellness monitoring and education**
