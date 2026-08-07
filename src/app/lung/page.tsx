"use client";

import { useState } from "react";
import { Loader2, Video, Mic } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useLanguage } from "@/lib/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import { RecordingView } from "@/components/lung/RecordingView";
import { ResultsView } from "@/components/lung/ResultsView";

interface LungResult {
  condition: string;
  conditionTh: string;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  breathing: {
    rate: number;
    pattern: string;
    patternTh: string;
  };
  audio: {
    quality: string;
    qualityTh: string;
    abnormalities: string[];
    abnormalitiesTh: string[];
  };
}

export default function LungScreeningPage() {
  const [step, setStep] = useState<'intro' | 'recording' | 'analyzing' | 'results'>('intro');
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [result, setResult] = useState<LungResult | null>(null);
  const { language } = useLanguage();
  const t = useTranslation(language);

  const handleStartRecording = () => {
    setStep('recording');
  };

  const handleRecordingComplete = async (video: Blob, audio: Blob) => {
    setVideoBlob(video);
    setAudioBlob(audio);
    setStep('analyzing');

    // Simulate AI analysis with mock data
    setTimeout(() => {
      // Mock result - in production, this would call actual ML model
      const mockResult: LungResult = {
        condition: 'Normal Breathing',
        conditionTh: 'การหายใจปกติ',
        confidence: 0.87,
        risk: 'low',
        breathing: {
          rate: 16,
          pattern: 'Regular',
          patternTh: 'สม่ำเสมอ'
        },
        audio: {
          quality: 'Clear breath sounds',
          qualityTh: 'เสียงการหายใจชัดเจน',
          abnormalities: [],
          abnormalitiesTh: []
        }
      };

      setResult(mockResult);
      setStep('results');
    }, 3000);
  };

  const handleCancelRecording = () => {
    setStep('intro');
  };

  const handleNewScan = () => {
    setStep('intro');
    setVideoBlob(null);
    setAudioBlob(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block bg-terracotta-tint text-terracotta text-sm font-medium px-4 py-1.5 rounded-pill mb-4">
            {language === 'th' ? '🫁 ตรวจปอด' : '🫁 Lung Screening'}
          </div>
          <h1 className="text-4xl font-serif mb-4">
            <em className="text-terracotta not-italic">AI</em> {language === 'th' ? 'ตรวจสุขภาพปอด' : 'Lung Health Screening'}
          </h1>
          <p className="text-lg text-muted">
            {language === 'th'
              ? 'ใช้กล้องและไมโครโฟนเพื่อตรวจหาโรคปอดด้วย AI'
              : 'Use webcam and microphone to detect lung diseases with AI'}
          </p>
        </div>

        {/* Intro Step */}
        {step === 'intro' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'th' ? 'วิธีการตรวจ' : 'How It Works'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-terracotta-tint rounded-full flex items-center justify-center flex-shrink-0">
                    <Video className="w-6 h-6 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">
                      {language === 'th' ? '1. บันทึกวิดีโอการหายใจ' : '1. Record Breathing Video'}
                    </h3>
                    <p className="text-sm text-muted">
                      {language === 'th'
                        ? 'กล้องจะติดตามการเคลื่อนไหวของหน้าอกขณะหายใจเข้า-ออก'
                        : 'Camera tracks your chest movement as you breathe in and out'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-terracotta-tint rounded-full flex items-center justify-center flex-shrink-0">
                    <Mic className="w-6 h-6 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">
                      {language === 'th' ? '2. บันทึกเสียงการหายใจ' : '2. Record Breathing Sounds'}
                    </h3>
                    <p className="text-sm text-muted">
                      {language === 'th'
                        ? 'ไมโครโฟนจะบันทึกเสียงการหายใจและไอ เพื่อตรวจหาเสียงผิดปกติ'
                        : 'Microphone captures breathing and cough sounds to detect abnormalities'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-terracotta-tint rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">
                      {language === 'th' ? '3. AI วิเคราะห์ทั้งสองสัญญาณ' : '3. AI Analyzes Both Signals'}
                    </h3>
                    <p className="text-sm text-muted">
                      {language === 'th'
                        ? 'AI รวมข้อมูลจากวิดีโอและเสียงเพื่อให้การวินิจฉัยที่แม่นยำยิ่งขึ้น'
                        : 'AI combines video and audio data for more accurate diagnosis'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-terracotta bg-terracotta-tint">
              <CardContent className="pt-6">
                <h3 className="font-serif text-lg mb-2">
                  {language === 'th' ? 'โรคที่สามารถตรวจได้' : 'Detectable Conditions'}
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta">•</span>
                    <span>{language === 'th' ? 'ปอดบวม (Pneumonia)' : 'Pneumonia'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta">•</span>
                    <span>{language === 'th' ? 'หอบหืด (Asthma)' : 'Asthma'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta">•</span>
                    <span>{language === 'th' ? 'ถุงลมโป่งพอง (COPD)' : 'COPD'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta">•</span>
                    <span>{language === 'th' ? 'หลอดลมอักเสบ (Bronchitis)' : 'Bronchitis'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta">•</span>
                    <span>{language === 'th' ? 'รูปแบบการหายใจผิดปกติ' : 'Abnormal Breathing Patterns'}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button size="lg" onClick={handleStartRecording}>
                {language === 'th' ? 'เริ่มการตรวจ' : 'Start Screening'}
              </Button>
            </div>
          </div>
        )}

        {/* Recording Step */}
        {step === 'recording' && (
          <RecordingView
            language={language}
            onComplete={handleRecordingComplete}
            onCancel={handleCancelRecording}
          />
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-terracotta animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-serif mb-2">
                  {language === 'th' ? 'กำลังวิเคราะห์...' : 'Analyzing...'}
                </h3>
                <p className="text-muted">
                  {language === 'th'
                    ? 'AI กำลังวิเคราะห์การเคลื่อนไหวของหน้าอกและเสียงการหายใจ'
                    : 'AI is analyzing chest movement and breathing sounds'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Step */}
        {step === 'results' && result && (
          <ResultsView
            language={language}
            result={result}
            onNewScan={handleNewScan}
          />
        )}
      </div>
    </div>
  );
}
