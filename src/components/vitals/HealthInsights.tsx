import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { AlertCircle, TrendingUp, Moon, Activity, Wind as WindIcon } from "lucide-react";
import type { VitalsData } from "./VitalsDashboard";
import {
  getHeartRateAdvice,
  getHRVAdvice,
  getRespiratoryRateAdvice,
} from "@/lib/utils/healthRanges";

interface HealthInsightsProps {
  vitals: VitalsData;
}

export function HealthInsights({ vitals }: HealthInsightsProps) {
  const hrAdvice = getHeartRateAdvice(vitals.heartRate);
  const hrvAdvice = getHRVAdvice(vitals.hrv.rmssd);
  const rrAdvice = getRespiratoryRateAdvice(vitals.respiratoryRate);

  const hasAbnormal = hrAdvice.shouldSeeDoctor ||
                      hrvAdvice.shouldSeeDoctor ||
                      rrAdvice.shouldSeeDoctor;

  return (
    <div className="space-y-6">
      {/* What These Numbers Mean */}
      <Card>
        <CardHeader>
          <CardTitle>What These Numbers Mean</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Heart Rate */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <div className="w-6 h-6 bg-terracotta-tint rounded-full flex items-center justify-center">
                <span className="text-terracotta text-xs font-bold">HR</span>
              </div>
              Heart Rate
            </h4>
            <div className="text-sm text-muted space-y-1">
              <p>
                <strong>Your result:</strong> {Math.round(vitals.heartRate)} BPM
              </p>
              <p>
                <strong>Normal range:</strong> 60-100 BPM at rest
              </p>
              <p>
                <strong>Interpretation:</strong> {hrAdvice.label}
              </p>
              <p className="text-xs">
                Factors affecting HR: fitness level, stress, caffeine intake, medications, time of day
              </p>
            </div>
          </div>

          {/* HRV */}
          <div className="pt-3 border-t border-border">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <div className="w-6 h-6 bg-terracotta-tint rounded-full flex items-center justify-center">
                <Activity className="w-3 h-3 text-terracotta" />
              </div>
              Heart Rate Variability (HRV)
            </h4>
            <div className="text-sm text-muted space-y-1">
              <p>
                Higher HRV generally indicates better cardiovascular fitness and stress resilience.
                Your RMSSD: <strong>{vitals.hrv.rmssd} ms</strong> - {hrvAdvice.label}
              </p>
              <p className="text-xs">
                What affects HRV: sleep quality, stress levels, recovery from exercise, alcohol, illness
              </p>
            </div>
          </div>

          {/* Respiratory Rate */}
          <div className="pt-3 border-t border-border">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <div className="w-6 h-6 bg-terracotta-tint rounded-full flex items-center justify-center">
                <WindIcon className="w-3 h-3 text-terracotta" />
              </div>
              Respiratory Rate
            </h4>
            <div className="text-sm text-muted space-y-1">
              <p>
                <strong>Your result:</strong> {Math.round(vitals.respiratoryRate)} breaths/min
              </p>
              <p>
                <strong>Normal adult range:</strong> 12-20 breaths per minute at rest
              </p>
              <p>
                <strong>Interpretation:</strong> {rrAdvice.label}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What to Monitor */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-terracotta-tint rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-terracotta" />
            </div>
            <CardTitle>What to Monitor</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-terracotta-tint rounded-full flex items-center justify-center mt-0.5">
                <span className="text-terracotta text-xs font-bold">1</span>
              </div>
              <div>
                <h5 className="font-medium mb-1">Track Over Time</h5>
                <p className="text-sm text-muted">
                  Single measurements provide a snapshot. Track your vitals over days and weeks to establish
                  your personal baseline and identify trends.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-terracotta-tint rounded-full flex items-center justify-center mt-0.5">
                <span className="text-terracotta text-xs font-bold">2</span>
              </div>
              <div>
                <h5 className="font-medium mb-1">Consistent Conditions</h5>
                <p className="text-sm text-muted">
                  Best time to measure: morning after waking, before caffeine, while rested and calm.
                  Consistency matters more than absolute values.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-terracotta-tint rounded-full flex items-center justify-center mt-0.5">
                <span className="text-terracotta text-xs font-bold">3</span>
              </div>
              <div>
                <h5 className="font-medium mb-1">Context Matters</h5>
                <p className="text-sm text-muted">
                  Note factors that affect readings: exercise, stress, illness, medications, sleep quality,
                  hydration, and recent meals.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Self-Care Tips */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-terracotta-tint rounded-full flex items-center justify-center">
              <Moon className="w-5 h-5 text-terracotta" />
            </div>
            <CardTitle>Self-Care Tips</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {hrAdvice.color !== 'green' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <h5 className="font-medium text-yellow-900 mb-1">For Elevated Heart Rate:</h5>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc pl-5">
                  <li>Reduce caffeine and stimulant intake</li>
                  <li>Practice stress management (meditation, deep breathing)</li>
                  <li>Ensure adequate sleep (7-9 hours)</li>
                  <li>Stay hydrated throughout the day</li>
                </ul>
              </div>
            )}

            {hrvAdvice.color !== 'green' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <h5 className="font-medium text-yellow-900 mb-1">For Low HRV:</h5>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc pl-5">
                  <li>Prioritize sleep quality and consistency</li>
                  <li>Reduce training load and allow more recovery</li>
                  <li>Manage stress through relaxation techniques</li>
                  <li>Avoid alcohol and late-night eating</li>
                </ul>
              </div>
            )}

            {rrAdvice.color !== 'green' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <h5 className="font-medium text-yellow-900 mb-1">For Abnormal Respiratory Rate:</h5>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc pl-5">
                  <li>Practice breathing exercises (4-7-8 technique, box breathing)</li>
                  <li>Manage anxiety and stress</li>
                  <li>Ensure good posture for unrestricted breathing</li>
                  <li>Consider underlying conditions if persistent</li>
                </ul>
              </div>
            )}

            {hrAdvice.color === 'green' && hrvAdvice.color === 'green' && rrAdvice.color === 'green' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <h5 className="font-medium text-green-900 mb-1">Maintain Your Healthy Status:</h5>
                <ul className="text-sm text-green-800 space-y-1 list-disc pl-5">
                  <li>Continue regular physical activity</li>
                  <li>Maintain consistent sleep schedule</li>
                  <li>Practice stress management techniques</li>
                  <li>Stay hydrated and eat a balanced diet</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* When to See a Doctor */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-terracotta-tint rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-terracotta" />
            </div>
            <CardTitle>When to See a Doctor</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted mb-3">
            Consult a healthcare provider if you experience:
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted">Resting heart rate consistently &gt;100 or &lt;50 BPM</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted">Irregular heartbeat or palpitations</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted">Breathing rate &gt;20 at rest with no exertion</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted">Chest pain, dizziness, or shortness of breath</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted">Sudden changes from your personal baseline</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted">Symptoms persisting despite lifestyle changes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accuracy Warning */}
      <Card className="bg-surface border-2 border-border">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted">
              <p className="mb-2">
                <strong>Important Limitations:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Motion artifacts significantly reduce accuracy</li>
                <li>Poor lighting conditions affect measurements</li>
                <li>This method is NOT validated for medical diagnosis</li>
                <li>SpO₂ (blood oxygen) is NOT measured - RGB cameras cannot reliably measure this</li>
                <li>Results are estimates for general wellness tracking only</li>
                <li>For medical decisions, use FDA-approved medical devices</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
