import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Download, Play, Pause } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { downloadWAV } from "@/lib/audio/wavEncoder";
import type { RespiratoryPrediction } from "@/lib/ml/respiratoryOnnx";

interface ScreeningResultProps {
  prediction: RespiratoryPrediction;
  audioData: Float32Array;
  sampleRate: number;
}

export function ScreeningResult({ prediction, audioData, sampleRate }: ScreeningResultProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const getRiskColor = (className: string) => {
    if (className === 'Normal') return 'success';
    if (className.includes('Both')) return 'danger';
    return 'warning';
  };

  const playAudio = async () => {
    if (isPlaying) {
      // Stop playback
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    try {
      // Create audio context if not exists
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;

      // Create audio buffer
      const audioBuffer = audioContext.createBuffer(1, audioData.length, sampleRate);
      // Copy data to avoid ArrayBufferLike type issues
      const channelData = audioBuffer.getChannelData(0);
      channelData.set(audioData);

      // Create source
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);

      source.onended = () => {
        setIsPlaying(false);
        sourceRef.current = null;
      };

      sourceRef.current = source;
      source.start();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
      alert('Failed to play audio');
    }
  };

  const handleDownload = () => {
    const filename = `respiratory-recording-${Date.now()}.wav`;
    downloadWAV(audioData, sampleRate, filename);
  };

  return (
    <div className="space-y-6">
      {/* Main Result */}
      <Card className="border-terracotta">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Screening Result</CardTitle>
            <Badge variant={getRiskColor(prediction.class)}>
              {prediction.class.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-2xl font-serif text-ink mb-2">{prediction.class}</h4>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted">Confidence</span>
                  <span className="text-sm font-medium">{(prediction.confidence * 100).toFixed(1)}%</span>
                </div>
                <Progress value={prediction.confidence * 100} />
              </div>
            </div>
          </div>

          <div className="bg-cream rounded-xl p-4">
            <p className="text-sm text-muted">
              {prediction.class === 'Normal' &&
                'No concerning breathing patterns detected in this recording.'
              }
              {prediction.class === 'Crackles' &&
                'Crackles detected - discontinuous popping sounds that may indicate fluid or inflammation in airways.'
              }
              {prediction.class === 'Wheezes' &&
                'Wheezes detected - continuous high-pitched sounds often associated with airway narrowing.'
              }
              {prediction.class === 'Both (Crackles + Wheezes)' &&
                'Both crackles and wheezes detected - may indicate multiple respiratory issues requiring evaluation.'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* All Probabilities */}
      <Card>
        <CardHeader>
          <CardTitle>Detection Confidence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {prediction.probabilities.map((prob, idx) => (
            <div key={prob.class}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-ink">{prob.class}</span>
                <span className="text-sm font-medium">{(prob.probability * 100).toFixed(1)}%</span>
              </div>
              <Progress
                value={prob.probability * 100}
                color={idx === 0 ? "terracotta" : "green"}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Audio Playback */}
      <Card>
        <CardHeader>
          <CardTitle>Recording Playback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={playAudio} className="flex-1">
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Stop Playback
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Play Recording
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-5 h-5 mr-2" />
              Download WAV
            </Button>
          </div>
          <p className="text-xs text-muted mt-3 text-center">
            Duration: {(audioData.length / sampleRate).toFixed(1)}s | Sample Rate: {sampleRate}Hz
          </p>
        </CardContent>
      </Card>

      {/* Limitations */}
      <Card className="bg-surface">
        <CardContent className="pt-6">
          <div className="text-sm text-muted space-y-2">
            <p>
              <strong>Important Limitations:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Consumer microphone quality significantly affects accuracy</li>
              <li>Model sensitivity/specificity: ~68% on ICBHI 2017 research dataset</li>
              <li>This detects sound patterns, NOT specific diseases</li>
              <li>Background noise can affect results</li>
              <li>Results are screening estimates only</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
