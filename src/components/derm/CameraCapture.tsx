"use client";

import { useRef, useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setPreviewImage(imageData);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setPreviewImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const confirmImage = () => {
    if (previewImage) {
      // Convert to base64 without data URL prefix
      const base64 = previewImage.split(',')[1];
      onCapture(base64);
    }
  };

  const retake = () => {
    setPreviewImage(null);
    startCamera();
  };

  return (
    <div className="space-y-4">
      {/* Camera/Upload Controls */}
      {!isStreaming && !previewImage && (
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={startCamera} className="flex-1">
            <Camera className="w-5 h-5 mr-2" />
            Open Camera
          </Button>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
          >
            <Upload className="w-5 h-5 mr-2" />
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

      {/* Video Stream */}
      {isStreaming && (
        <div className="space-y-4">
          <div className="relative aspect-video bg-charcoal rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-4">
            <Button onClick={captureImage} className="flex-1">
              <Camera className="w-5 h-5 mr-2" />
              Capture Photo
            </Button>
            <Button variant="outline" onClick={stopCamera}>
              <X className="w-5 h-5 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewImage && (
        <div className="space-y-4">
          <div className="relative aspect-video bg-charcoal rounded-2xl overflow-hidden border-2 border-border">
            <img
              src={previewImage}
              alt="Captured lesion"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex gap-4">
            <Button onClick={confirmImage} className="flex-1">
              Analyze This Image
            </Button>
            <Button variant="outline" onClick={retake} className="flex-1">
              Retake Photo
            </Button>
          </div>
        </div>
      )}

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
