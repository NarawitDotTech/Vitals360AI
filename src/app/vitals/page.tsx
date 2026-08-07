"use client";

import { useState } from "react";
import { Loader2, Video } from "lucide-react";
import { WebcamCapture } from "@/components/vitals/WebcamCapture";
import { VitalsDashboard, type VitalsData } from "@/components/vitals/VitalsDashboard";
import { HealthInsights } from "@/components/vitals/HealthInsights";
import { Button } from "@/components/ui/Button";
import { extractPOS } from "@/lib/signal/pos";
import { extractCHROM } from "@/lib/signal/chrom";
import { bandpassFilter, detrend } from "@/lib/signal/bandpass";
import { findDominantFrequency } from "@/lib/signal/fft";
import { findPeaks, calculateIBI, calculateHeartRate } from "@/lib/signal/peaks";
import { calculateHRV } from "@/lib/signal/hrv";
import { extractRespiratoryRate } from "@/lib/signal/respiratoryRate";
import { saveScan } from "@/lib/storage";
import type { RGB } from "@/lib/signal/pos";

export default function VitalsPage() {
  const [step, setStep] = useState<'capture' | 'analyzing' | 'results'>('capture');
  const [vitals, setVitals] = useState<VitalsData | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleCaptureComplete = async (rgbSignals: RGB[], sampleRate: number) => {
    setStep('analyzing');
    setError(null);
    setAnalysisProgress(0);

    try {
      // Check if we have enough data
      if (rgbSignals.length < 90) {
        throw new Error('Insufficient data captured. Please try again with better lighting.');
      }

      setAnalysisProgress(10);

      // Extract pulse signal using POS algorithm
      const pulseSignalPOS = extractPOS(rgbSignals);
      setAnalysisProgress(25);

      // Detrend the signal
      const detrended = detrend(pulseSignalPOS);
      setAnalysisProgress(35);

      // Bandpass filter for heart rate (0.7-3.5 Hz = 42-210 BPM)
      const filtered = bandpassFilter(detrended, {
        low: 0.7,
        high: 3.5,
        fs: sampleRate,
      });
      setAnalysisProgress(50);

      // Calculate heart rate using FFT
      const heartRateFreq = findDominantFrequency(filtered, sampleRate, 0.7, 3.5);
      const heartRate = heartRateFreq * 60;
      setAnalysisProgress(60);

      // Find peaks for HRV calculation
      const minPeakDistance = Math.floor(sampleRate * 0.4); // Minimum 0.4s between peaks
      const peaks = findPeaks(filtered, minPeakDistance);
      setAnalysisProgress(70);

      // Calculate inter-beat intervals
      const ibi = calculateIBI(peaks, sampleRate);
      setAnalysisProgress(75);

      // Calculate HRV metrics
      const hrv = calculateHRV(ibi);
      setAnalysisProgress(85);

      // Extract respiratory rate
      const respiratoryRate = extractRespiratoryRate(pulseSignalPOS, sampleRate);
      setAnalysisProgress(95);

      // Validate results
      if (heartRate < 30 || heartRate > 200) {
        throw new Error('Heart rate measurement out of valid range. Please ensure good lighting and minimal movement.');
      }

      if (respiratoryRate < 5 || respiratoryRate > 40) {
        // Use default if respiratory rate is unreliable
        console.warn('Respiratory rate out of range, using estimated value');
      }

      const vitalsData: VitalsData = {
        heartRate: Math.round(heartRate),
        hrv,
        respiratoryRate: Math.max(5, Math.min(40, Math.round(respiratoryRate))),
      };

      setVitals(vitalsData);

      // Save to history
      saveScan({
        id: `vitals-${Date.now()}`,
        type: 'vitals',
        timestamp: new Date().toISOString(),
        data: vitalsData,
      });

      setAnalysisProgress(100);
      setStep('results');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      setStep('capture');
    }
  };

  const handleNewMeasurement = () => {
    setStep('capture');
    setVitals(null);
    setError(null);
    setAnalysisProgress(0);
  };

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block bg-terracotta-tint text-terracotta text-sm font-medium px-4 py-1.5 rounded-pill mb-4">
            Vital Signs Monitoring
          </div>
          <h1 className="text-4xl font-serif mb-4">
            <em className="text-terracotta not-italic">Camera-Based</em> Health Monitoring
          </h1>
          <p className="text-lg text-muted">
            Measure heart rate, heart rate variability, and respiratory rate using advanced rPPG technology.
            No wearables required.
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-terracotta-tint rounded-full flex items-center justify-center">
              <Video className="w-5 h-5 text-terracotta" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Privacy & Processing</h3>
              <p className="text-sm text-muted">
                All video processing happens entirely in your browser. No video data is sent to servers.
                Only RGB color values from your forehead are analyzed. Results stored locally only.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
            <p className="text-red-800">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Capture Step */}
        {step === 'capture' && (
          <div className="bg-white border-2 border-border rounded-2xl p-8">
            <WebcamCapture
              onCaptureComplete={handleCaptureComplete}
              duration={10}
              captureAudio={false}
            />
          </div>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <div className="bg-white border-2 border-border rounded-2xl p-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-terracotta animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-serif mb-2">Analyzing Vital Signs...</h3>
              <p className="text-muted mb-4">
                Processing rPPG signal and calculating metrics
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
        {step === 'results' && vitals && (
          <div className="space-y-6">
            <VitalsDashboard vitals={vitals} />

            <HealthInsights vitals={vitals} />

            <div className="flex justify-center pt-4">
              <Button onClick={handleNewMeasurement} size="lg">
                <Video className="w-5 h-5 mr-2" />
                Take Another Measurement
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
