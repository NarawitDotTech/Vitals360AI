"use client";

import { useState, useEffect } from "react";
import { Loader2, Camera } from "lucide-react";
import { CameraCapture } from "@/components/derm/CameraCapture";
import { ClassificationResult } from "@/components/derm/ClassificationResult";
import { HealthAdvice } from "@/components/derm/HealthAdvice";
import { Button } from "@/components/ui/Button";
import { analyzeABCDE } from "@/lib/ml/abcde";
import { saveScan } from "@/lib/storage";
import { useLanguage } from "@/lib/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import type { DermClassificationResult } from "@/app/api/classify/derm/route";
import type { ABCDEAnalysis } from "@/lib/ml/abcde";

export default function DermPage() {
  const [step, setStep] = useState<'capture' | 'analyzing' | 'results'>('capture');
  const [imageData, setImageData] = useState<string | null>(null);
  const [classification, setClassification] = useState<DermClassificationResult | null>(null);
  const [abcdeAnalysis, setAbcdeAnalysis] = useState<ABCDEAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = useTranslation(language);

  // Re-fetch classification when language changes (only if we have results)
  useEffect(() => {
    if (step === 'results' && imageData) {
      const reFetch = async () => {
        try {
          const response = await fetch('/api/classify/derm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: `data:image/jpeg;base64,${imageData}`,
              lang: language,
            }),
          });

          if (!response.ok) {
            throw new Error('Re-fetch failed');
          }

          const result = await response.json();
          setClassification(result);
        } catch (err) {
          console.error('Re-fetch error:', err);
        }
      };

      reFetch();
    }
  }, [language, imageData, step]);

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

      // Call classification API with language parameter
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
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block bg-terracotta-tint text-terracotta text-sm font-medium px-4 py-1.5 rounded-pill mb-4">
            {t.derm.title}
          </div>
          <h1 className="text-4xl font-serif mb-4">
            <em className="text-terracotta not-italic">AI</em> {t.derm.title}
          </h1>
          <p className="text-lg text-muted">
            {t.derm.subtitle}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
            <p className="text-red-800">
              <strong>{t.common.error}:</strong> {error}
            </p>
          </div>
        )}

        {/* Capture Step */}
        {step === 'capture' && (
          <div className="bg-white border-2 border-border rounded-2xl p-8">
            <CameraCapture onCapture={handleCapture} />
          </div>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <div className="bg-white border-2 border-border rounded-2xl p-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-terracotta animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-serif mb-2">{t.derm.analyzing}</h3>
              <p className="text-muted">
                {language === 'th' ? 'กำลังวิเคราะห์ภาพด้วย AI และวิเคราะห์ตามหลัก ABCDE' : 'Running AI classification and ABCDE heuristic analysis'}
              </p>
            </div>
          </div>
        )}

        {/* Results Step */}
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

            <div className="flex justify-center pt-4">
              <Button onClick={handleNewScan} size="lg">
                <Camera className="w-5 h-5 mr-2" />
                {t.derm.newScan}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
