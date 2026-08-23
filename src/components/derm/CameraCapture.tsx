"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Upload, X, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { cn } from "@/lib/utils/cn";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
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
    return "No camera was found on this device. You can upload a photo instead.";
  }
  if (name === "NotReadableError") {
    return "The camera is already in use by another application. Close it and try again.";
  }
  return "Could not access the camera. Please check permissions and try again.";
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsStreaming(false);
  }, []);

  // Attach the stream to the <video> element whenever it mounts.
  // This also covers the "Retake" flow where the video element is
  // re-created by React after the preview is dismissed.
  useEffect(() => {
    if (isStreaming && videoRef.current && streamRef.current) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      video.play().catch(() => {
        /* autoplay is allowed because the element is muted */
      });
    }
  }, [isStreaming]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  const startCamera = async () => {
    setError(null);
    setPreviewImage(null);

    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setError(getCameraErrorMessage(new Error("insecure")));
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      streamRef.current = mediaStream;
      // Flip this only after the stream exists so the effect above can
      // attach it once React renders the <video> element.
      setIsStreaming(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(getCameraErrorMessage(err));
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    setPreviewImage(imageData);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const confirmImage = () => {
    if (previewImage) {
      const base64 = previewImage.split(",")[1];
      onCapture(base64);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Camera unavailable</AlertTitle>
          <AlertDescription>
            {error}{" "}
            <button className="underline underline-offset-2" onClick={startCamera}>
              Try again
            </button>{" "}
            or upload an image below.
          </AlertDescription>
        </Alert>
      )}

      {/* Idle state */}
      {!isStreaming && !previewImage && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={startCamera} className="flex-1">
            <Camera className="w-5 h-5" />
            Open Camera
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
            <Upload className="w-5 h-5" />
            Upload Image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Live camera */}
      {isStreaming && (
        <div className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-2xl border bg-foreground/90">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-dashed border-white/60" />
            <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1 text-xs text-white backdrop-blur">
              Fill the frame with the skin area to analyze
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={captureImage} className="flex-1">
              <Camera className="w-5 h-5" />
              Capture Photo
            </Button>
            <Button variant="outline" onClick={stopCamera}>
              <X className="w-5 h-5" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewImage && (
        <div className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-2xl border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewImage} alt="Captured lesion" className="h-full w-full object-contain" />
          </div>
          <div className="flex gap-3">
            <Button onClick={confirmImage} className={cn("flex-1")}>
              Analyze This Image
            </Button>
            <Button variant="outline" onClick={() => setPreviewImage(null)} className="flex-1">
              <RotateCcw className="w-5 h-5" />
              Retake Photo
            </Button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
