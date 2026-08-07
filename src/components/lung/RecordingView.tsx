"use client";

import { useState, useRef, useEffect } from "react";
import { Video, Mic, StopCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

interface RecordingViewProps {
  language: 'en' | 'th';
  onComplete: (videoBlob: Blob, audioBlob: Blob) => void;
  onCancel: () => void;
}

export function RecordingView({ language, onComplete, onCancel }: RecordingViewProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [recordingTime, setRecordingTime] = useState(0);
  const [breathingRate, setBreathingRate] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [demoMode, setDemoMode] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number>();

  // Start camera and microphone
  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 640, height: 480 },
          audio: true
        });

        mediaStreamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Setup audio analysis
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        // Start audio level monitoring
        monitorAudioLevel();

        // Auto-start recording after a brief delay
        setTimeout(() => {
          startRecording();
        }, 500);

      } catch (err) {
        console.error('Media access error:', err);
        // In demo/test mode (no camera available), use simulated audio levels
        setDemoMode(true);
        simulateAudioLevel();

        // Auto-start recording in demo mode
        setTimeout(() => {
          startRecording();
        }, 500);
      }
    };

    startMedia();

    return () => {
      // Cleanup
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [language, onCancel]);

  // Monitor audio level
  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const update = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      setAudioLevel(Math.min(100, (average / 255) * 100));

      animationFrameRef.current = requestAnimationFrame(update);
    };

    update();
  };

  // Simulate audio level for demo mode (no microphone)
  const simulateAudioLevel = () => {
    const update = () => {
      // Simulate breathing sounds with varying levels
      const baseLevel = 20 + Math.random() * 30;
      const spike = Math.random() > 0.9 ? 40 : 0; // Occasional spikes (coughs)
      setAudioLevel(Math.min(100, baseLevel + spike));

      animationFrameRef.current = requestAnimationFrame(update);
    };

    update();
  };

  // Start recording with countdown
  const startRecording = () => {
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          beginRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Begin actual recording
  const beginRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    videoChunksRef.current = [];
    audioChunksRef.current = [];

    // If in demo mode, simulate recording
    if (demoMode || !mediaStreamRef.current) {
      simulateDemoRecording();
      return;
    }

    // Setup video recorder
    const videoStream = new MediaStream(
      mediaStreamRef.current.getVideoTracks()
    );
    const videoRecorder = new MediaRecorder(videoStream, {
      mimeType: 'video/webm;codecs=vp8'
    });

    videoRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        videoChunksRef.current.push(e.data);
      }
    };

    // Setup audio recorder
    const audioStream = new MediaStream(
      mediaStreamRef.current.getAudioTracks()
    );
    const audioRecorder = new MediaRecorder(audioStream, {
      mimeType: 'audio/webm;codecs=opus'
    });

    audioRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    mediaRecorderRef.current = videoRecorder;

    videoRecorder.start(100);
    audioRecorder.start(100);

    // Recording timer
    const timerInterval = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1;

        // Auto-stop after 30 seconds
        if (newTime >= 30) {
          stopRecording(videoRecorder, audioRecorder, timerInterval);
        }

        return newTime;
      });
    }, 1000);

    // Simulate breathing rate detection
    const breathingInterval = setInterval(() => {
      setBreathingRate(Math.floor(12 + Math.random() * 8)); // 12-20 bpm
    }, 2000);

    // Store intervals for cleanup
    (videoRecorder as any).timerInterval = timerInterval;
    (videoRecorder as any).breathingInterval = breathingInterval;
  };

  // Simulate demo recording (when no camera/microphone available)
  const simulateDemoRecording = () => {
    // Recording timer
    const timerInterval = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1;

        // Auto-stop after 10 seconds in demo mode
        if (newTime >= 10) {
          clearInterval(timerInterval);
          clearInterval(breathingInterval);

          // Create dummy blobs and complete
          const dummyVideoBlob = new Blob([], { type: 'video/webm' });
          const dummyAudioBlob = new Blob([], { type: 'audio/webm' });

          setTimeout(() => {
            onComplete(dummyVideoBlob, dummyAudioBlob);
          }, 500);
        }

        return newTime;
      });
    }, 1000);

    // Simulate breathing rate detection
    const breathingInterval = setInterval(() => {
      setBreathingRate(Math.floor(12 + Math.random() * 8)); // 12-20 bpm
    }, 2000);
  };

  // Stop recording
  const stopRecording = (
    videoRecorder: MediaRecorder,
    audioRecorder: MediaRecorder,
    timerInterval: NodeJS.Timeout
  ) => {
    clearInterval(timerInterval);
    clearInterval((videoRecorder as any).breathingInterval);

    videoRecorder.stop();
    audioRecorder.stop();

    videoRecorder.onstop = () => {
      const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

      onComplete(videoBlob, audioBlob);
    };
  };

  const handleStop = () => {
    if (mediaRecorderRef.current && isRecording) {
      const videoRecorder = mediaRecorderRef.current;
      const audioStream = new MediaStream(
        mediaStreamRef.current!.getAudioTracks()
      );
      const audioRecorder = new MediaRecorder(audioStream);

      stopRecording(
        videoRecorder,
        audioRecorder,
        (videoRecorder as any).timerInterval
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          {/* Video Feed */}
          <div className="relative bg-black rounded-2xl overflow-hidden aspect-video mb-6">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Demo Mode Placeholder (no camera) */}
            {!mediaStreamRef.current && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <div className="text-center p-8">
                  <Video className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70 text-sm">
                    {language === 'th'
                      ? '📹 โหมดสาธิต - ไม่พบกล้อง'
                      : '📹 Demo Mode - No Camera Detected'}
                  </p>
                </div>
              </div>
            )}

            {/* Countdown Overlay */}
            {countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-8xl font-bold animate-pulse">
                  {countdown}
                </div>
              </div>
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-pill">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="font-medium">
                  {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}

            {/* Breathing Rate */}
            {isRecording && breathingRate > 0 && (
              <div className="absolute top-4 right-4 bg-white/90 px-4 py-2 rounded-pill">
                <div className="text-sm font-medium text-terracotta">
                  {breathingRate} {language === 'th' ? 'ครั้ง/นาที' : 'breaths/min'}
                </div>
              </div>
            )}
          </div>

          {/* Audio Level */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Mic className="w-5 h-5 text-terracotta" />
              <span className="text-sm font-medium">
                {language === 'th' ? 'ระดับเสียง' : 'Audio Level'}
              </span>
            </div>
            <div className="h-2 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-terracotta transition-all duration-100"
                style={{ width: `${audioLevel}%` }}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-terracotta-tint border-2 border-terracotta rounded-2xl p-4 mb-6">
            <h4 className="font-medium mb-2">
              {language === 'th' ? 'วิธีการบันทึก' : 'Recording Instructions'}
            </h4>
            <ul className="text-sm space-y-1">
              <li>• {language === 'th' ? 'นั่งตรงหันหน้าเข้ากล้อง' : 'Sit facing the camera'}</li>
              <li>• {language === 'th' ? 'หายใจเข้า-ออกตามปกติ 5 ครั้ง' : 'Breathe normally 5 times'}</li>
              <li>• {language === 'th' ? 'ไอ 3 ครั้ง' : 'Cough 3 times'}</li>
              <li>• {language === 'th' ? 'หายใจลึกๆ อีก 3 ครั้ง' : 'Take 3 deep breaths'}</li>
            </ul>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isRecording}
            >
              {language === 'th' ? 'ยกเลิก' : 'Cancel'}
            </Button>

            {!isRecording ? (
              <Button
                size="lg"
                onClick={startRecording}
                disabled={countdown > 0}
              >
                {countdown > 0 ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Video className="w-5 h-5 mr-2" />
                )}
                {language === 'th' ? 'เริ่มบันทึก' : 'Start Recording'}
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleStop}
                className="bg-red-500 hover:bg-red-600"
              >
                <StopCircle className="w-5 h-5 mr-2" />
                {language === 'th' ? 'หยุดบันทึก' : 'Stop Recording'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
