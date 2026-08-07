"use client";

import { useRef, useState, useCallback } from "react";
import { Video, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { extractROIMeanRGB, getForeheadROI } from "@/lib/signal/roiExtractor";
import type { RGB } from "@/lib/signal/pos";

interface WebcamCaptureProps {
  onCaptureComplete: (rgbSignals: RGB[], sampleRate: number) => void;
  duration?: number; // seconds
  captureAudio?: boolean;
}

export function WebcamCapture({
  onCaptureComplete,
  duration = 10,
  captureAudio = false
}: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const rgbDataRef = useRef<RGB[]>([]);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startCapture = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
      };

      if (captureAudio) {
        constraints.audio = {
          echoCancellation: true,
          noiseSuppression: true,
        };
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);

        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });

        // Start audio recording if needed
        if (captureAudio && mediaStream.getAudioTracks().length > 0) {
          const audioRecorder = new MediaRecorder(mediaStream, {
            mimeType: 'audio/webm',
          });

          audioChunksRef.current = [];

          audioRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          audioRecorder.start(100);
          mediaRecorderRef.current = audioRecorder;
        }

        // Start RGB signal capture
        rgbDataRef.current = [];
        setIsCapturing(true);
        setTimeLeft(duration);

        const fps = 30;
        const frameInterval = 1000 / fps;

        captureIntervalRef.current = setInterval(() => {
          captureFrame();
        }, frameInterval);

        // Countdown timer
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              stopCapture();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !isCapturing) return;

    const video = videoRef.current;
    const roi = getForeheadROI(video.videoWidth, video.videoHeight);

    try {
      const rgb = extractROIMeanRGB(video, roi);
      rgbDataRef.current.push(rgb);
    } catch (error) {
      console.error('Error capturing frame:', error);
    }
  }, [isCapturing]);

  const stopCapture = () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    setIsCapturing(false);

    // Return captured data
    if (rgbDataRef.current.length > 0) {
      onCaptureComplete(rgbDataRef.current, 30); // 30 fps
    }
  };

  return (
    <div className="space-y-6">
      {!isCapturing && !stream && (
        <div className="text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-terracotta-tint rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-12 h-12 text-terracotta" />
            </div>
            <h3 className="text-xl font-serif mb-2">Ready to Measure</h3>
            <p className="text-muted">
              Position your face in the frame for {duration} seconds
            </p>
          </div>

          <div className="bg-surface rounded-xl p-6 mb-6 text-left">
            <h4 className="font-medium mb-3">Measurement Tips:</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>• Sit still in a well-lit environment</li>
              <li>• Face the camera directly</li>
              <li>• Keep your forehead visible and in the green box</li>
              <li>• Avoid movement and talking during measurement</li>
              <li>• Breathe normally</li>
            </ul>
          </div>

          <Button onClick={startCapture} size="lg">
            <Video className="w-5 h-5 mr-2" />
            Start Measurement
          </Button>
        </div>
      )}

      {isCapturing && (
        <div className="space-y-4">
          <div className="relative aspect-video bg-charcoal rounded-2xl overflow-hidden border-2 border-border">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />

            {/* ROI Overlay */}
            <div className="absolute inset-0 flex items-start justify-center pt-[20%]">
              <div className="border-4 border-green-500 rounded-xl" style={{ width: '30%', height: '15%' }}>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-pill">
                  Keep forehead here
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-charcoal/80 backdrop-blur text-white px-6 py-3 rounded-pill">
              <div className="text-3xl font-serif">{timeLeft}s</div>
            </div>

            {/* Recording indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-pill">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-medium">Recording</span>
            </div>
          </div>

          <div className="text-center">
            <Button onClick={stopCapture} variant="outline" size="lg">
              <Square className="w-5 h-5 mr-2" />
              Stop Early
            </Button>
            <p className="text-sm text-muted mt-3">
              Captured {rgbDataRef.current.length} frames
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
