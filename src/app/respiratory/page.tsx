"use client";

import { useState, useEffect } from "react";
import { Loader2, Mic, AlertTriangle } from "lucide-react";
import { MicRecorder } from "@/components/respiratory/MicRecorder";
import { ScreeningResult } from "@/components/respiratory/ScreeningResult";
import { HealthGuidance } from "@/components/respiratory/HealthGuidance";
import { Button } from "@/components/ui/Button";
import { classifyRespiratoryPcm, checkModelAvailability } from "@/lib/ml/respiratoryOnnx";
import { saveScan } from "@/lib/storage";
import type { RespiratoryPrediction } from "@/lib/ml/respiratoryOnnx";

export default function RespiratoryPage() {
  const [step, setStep] = useState<'check' | 'record' | 'analyzing' | 'results'>('check');
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  const [sampleRate, setSampleRate] = useState<number>(0);
  const [prediction, setPrediction] = useState<RespiratoryPrediction | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [modelAvailable, setModelAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    checkModelAvailability().then(setModelAvailable);
  }, []);

  useEffect(() => {
    if (modelAvailable === false) {
      setStep('check');
    } else if (modelAvailable === true && step === 'check') {
      setStep('record');
    }
  }, [modelAvailable, step]);

  const handleRecordingComplete = async (pcm: Float32Array, sr: number) => {
    setAudioData(pcm);
    setSampleRate(sr);
    setStep('analyzing');
    setError(null);
    setAnalysisProgress(0);

    try {
      const result = await classifyRespiratoryPcm(pcm, sr, (progress) => {
        setAnalysisProgress(progress * 100);
      });

      setPrediction(result);

      // Save to history
      saveScan({
        id: `respiratory-${Date.now()}`,
        type: 'respiratory',
        timestamp: new Date().toISOString(),
        data: {
          prediction: result,
          sampleRate: sr,
          duration: pcm.length / sr,
        },
      });

      setStep('results');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      setStep('record');
    }
  };

  const handleNewRecording = () => {
    setStep('record');
    setAudioData(null);
    setPrediction(null);
    setError(null);
    setAnalysisProgress(0);
  };

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block bg-terracotta-tint text-terracotta text-sm font-medium px-4 py-1.5 rounded-pill mb-4">
            Respiratory Sound Analysis
          </div>
          <h1 className="text-4xl font-serif mb-4">
            <em className="text-terracotta not-italic">Deep Learning</em> Respiratory Screening
          </h1>
          <p className="text-lg text-muted">
            AI-powered detection of abnormal breathing patterns including crackles, wheezes, and combined sounds.
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-terracotta-tint rounded-full flex items-center justify-center">
              <Mic className="w-5 h-5 text-terracotta" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Privacy & Processing</h3>
              <p className="text-sm text-muted">
                All audio processing happens entirely in your browser using WebAssembly.
                No audio data is sent to servers. Results are stored locally only.
              </p>
            </div>
          </div>
        </div>

        {/* Model Check */}
        {step === 'check' && (
          <div className="bg-white border-2 border-border rounded-2xl p-12">
            <div className="text-center">
              {modelAvailable === null && (
                <>
                  <Loader2 className="w-12 h-12 text-terracotta animate-spin mx-auto mb-4" />
                  <h3 className="text-xl font-serif mb-2">Checking Model Availability...</h3>
                  <p className="text-muted">Verifying ONNX model is ready</p>
                </>
              )}

              {modelAvailable === false && (
                <>
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-serif mb-2">Model Not Available</h3>
                  <p className="text-muted mb-4">
                    The respiratory analysis model (ast-icbhi-int8.onnx) is not found.
                    Please ensure the model file is placed in <code className="bg-surface px-2 py-1 rounded text-sm">/public/models/respiratory/</code>
                  </p>
                  <p className="text-sm text-muted">
                    Expected location: <code className="bg-surface px-2 py-1 rounded">/public/models/respiratory/ast-icbhi-int8.onnx</code> (86.6 MB)
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
            <p className="text-red-800">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Record Step */}
        {step === 'record' && (
          <div className="bg-white border-2 border-border rounded-2xl p-8">
            <MicRecorder onRecordingComplete={handleRecordingComplete} duration={10} />
          </div>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <div className="bg-white border-2 border-border rounded-2xl p-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-terracotta animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-serif mb-2">Analyzing Breathing Sounds...</h3>
              <p className="text-muted mb-4">
                Running deep learning model on audio data
              </p>
              <div className="max-w-md mx-auto">
                <div className="bg-surface rounded-pill h-2 overflow-hidden">
                  <div
                    className="h-full bg-terracotta transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted mt-2">{Math.round(analysisProgress)}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Step */}
        {step === 'results' && prediction && audioData && (
          <div className="space-y-6">
            <ScreeningResult
              prediction={prediction}
              audioData={audioData}
              sampleRate={sampleRate}
            />

            <HealthGuidance classification={prediction.class} />

            <div className="flex justify-center pt-4">
              <Button onClick={handleNewRecording} size="lg">
                <Mic className="w-5 h-5 mr-2" />
                Record Another Sample
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
