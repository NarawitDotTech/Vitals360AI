"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Video, Square, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { extractROIMeanRGB, getForeheadROI } from "@/lib/signal/roiExtractor";
import type { RGB } from "@/lib/signal/pos";

interface WebcamCaptureProps {
  onCaptureComplete: (rgbSignals: RGB[], sampleRate: number) => void;
  duration?: number; // seconds
  captureAudio?: boolean;
}

function getCameraErrorMessage(error: unknown): string {
  const name = error instanceof Error ? error.name : "";
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
    return "Camera access requires a secure connection (HTTPS). Please open this page over HTTPS.";
  }
  if (name === "NotAllowedError") {
    return "Camera permission was denied. Allow camera access in your browser settings and try again.";
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return "No camera was found on this device.";
  }
  if (name === "NotReadableError") {
    return "The camera is already in use by another application. Close it and try again.";
  }
  return "Could not access the camera. Please check permissions and try again.";
}

export function WebcamCapture({
  onCaptureComplete,
  duration = 10,
  captureAudio = false
}: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [error, setError] = useState<string | null>(null);

  const captureIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rgbDataRef = useRef<RGB[]>([]);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const clearTimers = () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Always stop tracks through the ref — state can be stale inside callbacks.
  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    return () => {
      clearTimers();
      stopStream();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCapture = useCallback(() => {
    clearTimers();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    stopStream();
    setIsCapturing(false);

    if (rgbDataRef.current.length > 0) {
      onCaptureComplete(rgbDataRef.current, 30); // 30 fps
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCapture = async () => {
    setError(null);

    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setError(getCameraErrorMessage(new Error("insecure")));
      return;
    }

    const constraints: MediaStreamConstraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user",
      },
    };

    if (captureAudio) {
      constraints.audio = {
        echoCancellation: true,
        noiseSuppression: true,
      };
    }

    let mediaStream: MediaStream;
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(getCameraErrorMessage(err));
      return;
    }

    streamRef.current = mediaStream;

    const video = videoRef.current;
    if (!video) return;

    video.srcObject = mediaStream;

    // Wait for the video to be ready (handles both fresh loads and
    // streams whose metadata arrives before we attach).
    await new Promise<void>((resolve) => {
      if (video.readyState >= video.HAVE_METADATA) {
        resolve();
        return;
      }
      video.onloadedmetadata = () => resolve();
    });

    try {
      await video.play();
    } catch {
      /* muted autoplay should always be permitted */
    }

    // Start audio recording if needed
    if (captureAudio && mediaStream.getAudioTracks().length > 0) {
      const audioRecorder = new MediaRecorder(mediaStream, {
        mimeType: "audio/webm",
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

    rgbDataRef.current = [];
    setIsCapturing(true);
    setTimeLeft(duration);

    const fps = 30;
    const frameInterval = 1000 / fps;

    captureIntervalRef.current = setInterval(captureFrame, frameInterval);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopCapture();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const roi = getForeheadROI(video.videoWidth, video.videoHeight);

    try {
      const rgb = extractROIMeanRGB(video, roi);
      rgbDataRef.current.push(rgb);
    } catch (error) {
      console.error("Error capturing frame:", error);
    }
  }, []);

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Camera unavailable</AlertTitle>
          <AlertDescription>
            {error}{" "}
            <button className="underline underline-offset-2" onClick={startCapture}>
              Try again
            </button>
          </AlertDescription>
        </Alert>
      )}

      {!isCapturing && !streamRef.current && (
        <div className="text-center">
          <div className="mb-6">
            <div className="mb-4 mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
              <Video className="h-12 w-12 text-primary" />
            </div>
            <h3 className="font-serif text-xl mb-2">Ready to Measure</h3>
            <p className="text-muted">
              Position your face in the frame for {duration} seconds
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 mb-6 text-left shadow-sm">
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
            <Video className="w-5 h-5" />
            Start Measurement
          </Button>
        </div>
      )}

      {isCapturing && (
        <div className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-2xl border bg-foreground">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full scale-x-[-1] object-cover"
            />

            {/* ROI Overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-[20%]">
              <div className="rounded-xl border-4 border-emerald-500" style={{ width: "30%", height: "15%" }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-white">
                  Keep forehead here
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/60 px-6 py-3 text-white backdrop-blur">
              <div className="font-serif text-3xl">{timeLeft}s</div>
            </div>

            {/* Recording indicator */}
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-white">
              <div className="h-3 w-3 animate-pulse rounded-full bg-white" />
              <span className="text-sm font-medium">Recording</span>
            </div>
          </div>

          <div className="text-center">
            <Button onClick={stopCapture} variant="outline" size="lg">
              <Square className="w-5 h-5" />
              Stop Early
            </Button>
            <p className="mt-3 text-sm text-muted">Captured {rgbDataRef.current.length} frames</p>
          </div>
        </div>
      )}
    </div>
  );
}
