"use client";

import { useState, useEffect } from "react";
import { Loader2, RotateCcw, AlertTriangle } from "lucide-react";
import { CameraCapture } from "@/components/derm/CameraCapture";
import { ClassificationResult } from "@/components/derm/ClassificationResult";
import { HealthAdvice } from "@/components/derm/HealthAdvice";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { analyzeABCDE } from "@/lib/ml/abcde";
import { saveScan } from "@/lib/storage";
import { useLanguage } from "@/lib/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import type { ABCDEAnalysis } from "@/lib/ml/abcde";

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

export default function DermPage() {
  const [step, setStep] = useState<'capture' | 'analyzing' | 'results'>('capture');
  const [imageData, setImageData] = useState<string | null>(null);
  const [classification, setClassification] = useState<DermClassificationResult | null>(null);
  const [abcdeAnalysis, setAbcdeAnalysis] = useState<ABCDEAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = useTranslation(language);

  const handleCapture = async (base64Image: string) => {
    setImageData(base64Image);
    setStep('analyzing');
    setError(null);

    try {
      // Perform ABCDE analysis
      const img = new Image();
      img.src = `data:image/jpeg;base64,${base64Image}`;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const abcde = analyzeABCDE(imageData);
      setAbcdeAnalysis(abcde);

      // Call classification API (fallback to working derm API)
      console.log('[DermPage] Calling classification API...');
      const response = await fetch('/api/classify/derm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: `data:image/jpeg;base64,${base64Image}`,
          lang: language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Classification failed');
      }

      const result = await response.json();
      setClassification(result);

      // Save to history
      saveScan({
        id: `derm-${Date.now()}`,
        type: 'derm',
        timestamp: new Date().toISOString(),
        data: {
          image: base64Image,
          classification: result,
          abcde,
        },
      });

      setStep('results');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      setStep('capture');
    }
  };

  const handleNewScan = () => {
    setStep('capture');
    setImageData(null);
    setClassification(null);
    setAbcdeAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <header className="mb-10">
          <Badge className="mb-4">{t.derm.title}</Badge>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">
            <span className="text-primary">AI</span> {t.derm.title}
          </h1>
          <p className="mt-3 text-lg text-muted">{t.derm.subtitle}</p>
        </header>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t.common.error}</AlertTitle>
            <AlertDescription>
              {error}{" "}
              <button className="underline underline-offset-2" onClick={() => setError(null)}>
                Dismiss
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Capture */}
        {step === 'capture' && (
          <Card>
            <CardHeader>
              <CardTitle>Capture or upload a photo</CardTitle>
              <CardDescription>
                Use a clear, well-lit photo of the affected skin area.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CameraCapture onCapture={handleCapture} />
            </CardContent>
          </Card>
        )}

        {/* Analyzing */}
        {step === 'analyzing' && (
          <Card>
            <CardContent className="flex flex-col items-center px-6 py-16 text-center">
              <Loader2 className="mb-5 h-12 w-12 animate-spin text-primary" />
              <h3 className="font-serif text-xl font-semibold">{t.derm.analyzing}</h3>
              <p className="mt-2 max-w-sm text-muted">
                {language === 'th'
                  ? 'กำลังวิเคราะห์ภาพด้วย AI จริงจาก Hugging Face และวิเคราะห์ตามหลัก ABCDE'
                  : 'Analyzing with real AI model from Hugging Face + ABCDE heuristics. First analysis may take 20 seconds while the model loads.'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {step === 'results' && classification && abcdeAnalysis && imageData && (
          <div className="space-y-6">
            <ClassificationResult
              result={classification}
              abcdeAnalysis={abcdeAnalysis}
              imageData={imageData}
            />

            <HealthAdvice
              risk={classification.risk}
              classification={classification.label}
            />

            <div className="flex justify-center pt-2 pb-8">
              <Button onClick={handleNewScan} size="lg">
                <RotateCcw className="w-5 h-5" />
                {t.derm.newScan}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
