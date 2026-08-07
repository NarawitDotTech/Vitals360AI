"use client";

import { useRef, useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MicRecorderProps {
  onRecordingComplete: (audioData: Float32Array, sampleRate: number) => void;
  duration?: number; // seconds
}

export function MicRecorder({ onRecordingComplete, duration = 10 }: MicRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);

        // Combine chunks into blob
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });

        // Convert to PCM
        const pcm = await blobToPCM(blob);

        // Clean up
        stream.getTracks().forEach(track => track.stop());

        setIsProcessing(false);
        onRecordingComplete(pcm.samples, pcm.sampleRate);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Collect data every 100ms

      setIsRecording(true);
      setTimeLeft(duration);

      // Countdown timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  return (
    <div className="space-y-6">
      {!isRecording && !isProcessing && (
        <div className="text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-terracotta-tint rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="w-12 h-12 text-terracotta" />
            </div>
            <h3 className="text-xl font-serif mb-2">Ready to Record</h3>
            <p className="text-muted">
              Record {duration} seconds of breathing sounds for analysis
            </p>
          </div>

          <div className="bg-surface rounded-xl p-6 mb-6 text-left">
            <h4 className="font-medium mb-3">Recording Tips:</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>• Find a quiet environment to minimize background noise</li>
              <li>• Position microphone 10-15cm from your mouth</li>
              <li>• Breathe normally and deeply during recording</li>
              <li>• Take 3-4 full breath cycles during the 10 seconds</li>
            </ul>
          </div>

          <Button onClick={startRecording} size="lg">
            <Mic className="w-5 h-5 mr-2" />
            Start Recording
          </Button>
        </div>
      )}

      {isRecording && (
        <div className="text-center">
          <div className="mb-6">
            <div className="relative w-32 h-32 mx-auto mb-4">
              {/* Pulsing animation */}
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
              <div className="relative w-full h-full bg-red-500 rounded-full flex items-center justify-center">
                <Mic className="w-16 h-16 text-white" />
              </div>
            </div>

            <div className="text-5xl font-serif text-terracotta mb-2">
              {timeLeft}s
            </div>
            <p className="text-muted">Recording in progress...</p>
          </div>

          <Button onClick={stopRecording} variant="outline" size="lg">
            <Square className="w-5 h-5 mr-2" />
            Stop Early
          </Button>
        </div>
      )}

      {isProcessing && (
        <div className="text-center py-8">
          <Loader2 className="w-12 h-12 text-terracotta animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-serif mb-2">Processing Audio...</h3>
          <p className="text-muted">Converting to analysis format</p>
        </div>
      )}
    </div>
  );
}

/**
 * Convert audio blob to PCM Float32Array
 */
async function blobToPCM(blob: Blob): Promise<{ samples: Float32Array; sampleRate: number }> {
  const arrayBuffer = await blob.arrayBuffer();

  // Create audio context
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  // Decode audio data
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Get mono channel
  const samples = audioBuffer.getChannelData(0);

  return {
    samples: new Float32Array(samples),
    sampleRate: audioBuffer.sampleRate,
  };
}
