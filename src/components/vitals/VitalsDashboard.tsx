import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Heart, Activity, Wind } from "lucide-react";
import type { HRVMetrics } from "@/lib/signal/hrv";
import {
  getHeartRateAdvice,
  getHRVAdvice,
  getRespiratoryRateAdvice,
} from "@/lib/utils/healthRanges";

export interface VitalsData {
  heartRate: number;
  hrv: HRVMetrics;
  respiratoryRate: number;
}

interface VitalsDashboardProps {
  vitals: VitalsData;
}

export function VitalsDashboard({ vitals }: VitalsDashboardProps) {
  const hrAdvice = getHeartRateAdvice(vitals.heartRate);
  const hrvAdvice = getHRVAdvice(vitals.hrv.rmssd);
  const rrAdvice = getRespiratoryRateAdvice(vitals.respiratoryRate);

  const getColorClass = (color: 'green' | 'yellow' | 'red') => {
    switch (color) {
      case 'green':
        return 'bg-green-50 border-green-500 text-green-700';
      case 'yellow':
        return 'bg-yellow-50 border-yellow-500 text-yellow-700';
      case 'red':
        return 'bg-red-50 border-red-500 text-red-700';
    }
  };

  const allNormal = hrAdvice.color === 'green' &&
                    hrvAdvice.color === 'green' &&
                    rrAdvice.color === 'green';

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card className={`border-2 ${allNormal ? 'border-green-500' : 'border-yellow-500'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif mb-1">Overall Assessment</h3>
              <p className="text-sm text-muted">
                {allNormal
                  ? 'All measurements within normal range'
                  : 'Some values outside normal range'
                }
              </p>
            </div>
            <Badge variant={allNormal ? 'success' : 'warning'}>
              {allNormal ? 'NORMAL' : 'REVIEW NEEDED'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Heart Rate */}
      <Card className={`border-2 ${getColorClass(hrAdvice.color)}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              hrAdvice.color === 'green' ? 'bg-green-100' :
              hrAdvice.color === 'yellow' ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <Heart className={`w-6 h-6 ${
                hrAdvice.color === 'green' ? 'text-green-600' :
                hrAdvice.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
            <div className="flex-1">
              <CardTitle>Heart Rate</CardTitle>
              <p className="text-sm text-muted">Beats per minute</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-serif">{Math.round(vitals.heartRate)}</div>
              <div className="text-xs text-muted">BPM</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted">Normal range: 60-100 BPM</span>
              <Badge variant={hrAdvice.color === 'green' ? 'success' : 'warning'}>
                {hrAdvice.label}
              </Badge>
            </div>
            <Progress
              value={Math.min(100, (vitals.heartRate / 120) * 100)}
              color={hrAdvice.color}
            />
          </div>
          <div className="bg-cream rounded-xl p-3">
            <p className="text-sm text-muted">{hrAdvice.advice}</p>
          </div>
        </CardContent>
      </Card>

      {/* HRV */}
      <Card className={`border-2 ${getColorClass(hrvAdvice.color)}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              hrvAdvice.color === 'green' ? 'bg-green-100' :
              hrvAdvice.color === 'yellow' ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <Activity className={`w-6 h-6 ${
                hrvAdvice.color === 'green' ? 'text-green-600' :
                hrvAdvice.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
            <div className="flex-1">
              <CardTitle>Heart Rate Variability</CardTitle>
              <p className="text-sm text-muted">Cardiovascular fitness indicator</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-surface rounded-xl">
              <div className="text-2xl font-serif text-ink">{vitals.hrv.rmssd}</div>
              <div className="text-xs text-muted mt-1">RMSSD (ms)</div>
            </div>
            <div className="text-center p-3 bg-surface rounded-xl">
              <div className="text-2xl font-serif text-ink">{vitals.hrv.sdnn}</div>
              <div className="text-xs text-muted mt-1">SDNN (ms)</div>
            </div>
            <div className="text-center p-3 bg-surface rounded-xl">
              <div className="text-2xl font-serif text-ink">{vitals.hrv.pnn50}</div>
              <div className="text-xs text-muted mt-1">pNN50 (%)</div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted">RMSSD Assessment</span>
              <Badge variant={hrvAdvice.color === 'green' ? 'success' : 'warning'}>
                {hrvAdvice.label}
              </Badge>
            </div>
            <Progress
              value={Math.min(100, (vitals.hrv.rmssd / 80) * 100)}
              color={hrvAdvice.color}
            />
          </div>

          <div className="bg-cream rounded-xl p-3">
            <p className="text-sm text-muted">{hrvAdvice.advice}</p>
          </div>
        </CardContent>
      </Card>

      {/* Respiratory Rate */}
      <Card className={`border-2 ${getColorClass(rrAdvice.color)}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              rrAdvice.color === 'green' ? 'bg-green-100' :
              rrAdvice.color === 'yellow' ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <Wind className={`w-6 h-6 ${
                rrAdvice.color === 'green' ? 'text-green-600' :
                rrAdvice.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
            <div className="flex-1">
              <CardTitle>Respiratory Rate</CardTitle>
              <p className="text-sm text-muted">Breaths per minute</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-serif">{Math.round(vitals.respiratoryRate)}</div>
              <div className="text-xs text-muted">BR/min</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted">Normal range: 12-20 breaths/min</span>
              <Badge variant={rrAdvice.color === 'green' ? 'success' : 'warning'}>
                {rrAdvice.label}
              </Badge>
            </div>
            <Progress
              value={Math.min(100, (vitals.respiratoryRate / 25) * 100)}
              color={rrAdvice.color}
            />
          </div>
          <div className="bg-cream rounded-xl p-3">
            <p className="text-sm text-muted">{rrAdvice.advice}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
