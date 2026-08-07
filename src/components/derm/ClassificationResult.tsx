import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import type { DermClassificationResult } from "@/app/api/classify/derm/route";
import type { ABCDEAnalysis } from "@/lib/ml/abcde";

interface ClassificationResultProps {
  result: DermClassificationResult;
  abcdeAnalysis: ABCDEAnalysis;
  imageData: string;
}

export function ClassificationResult({ result, abcdeAnalysis, imageData }: ClassificationResultProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low':
        return <CheckCircle className="w-5 h-5" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5" />;
      case 'high':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  // Get simplified summary for elderly
  const getSimpleSummary = (risk: string) => {
    if (risk === 'low') return t.derm.summary.low;
    if (risk === 'medium') return t.derm.summary.medium;
    return t.derm.summary.high;
  };

  return (
    <div className="space-y-6">
      {/* Simple Summary for Elderly - TOP PRIORITY */}
      <Card className="border-4 border-terracotta bg-terracotta-tint">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            {getRiskIcon(result.risk)}
            {t.derm.summary.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white rounded-xl p-6">
            <p className="text-xl leading-relaxed text-ink font-medium">
              {getSimpleSummary(result.risk)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-base text-muted leading-relaxed">
              {t.derm.summary.footer}
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Captured Image */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'th' ? 'รูปที่วิเคราะห์' : 'Analyzed Image'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-charcoal rounded-xl overflow-hidden border-2 border-border">
            <img
              src={`data:image/jpeg;base64,${imageData}`}
              alt="Analyzed lesion"
              className="w-full h-full object-contain"
            />
          </div>
        </CardContent>
      </Card>

      {/* Primary Classification */}
      <Card className="border-terracotta">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t.derm.result.title}</CardTitle>
            <Badge variant={getRiskColor(result.risk)}>
              {t.derm.risk[result.risk]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-2xl font-serif text-ink mb-2">{result.label}</h4>
            <div className="flex items-center gap-3">
              {getRiskIcon(result.risk)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted">{t.derm.result.confidence}</span>
                  <span className="text-sm font-medium">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <Progress value={result.confidence * 100} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disease Information */}
      {result.overview && (
        <Card>
          <CardHeader>
            <CardTitle>{t.derm.result.overview}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted leading-relaxed">{result.overview}</p>
          </CardContent>
        </Card>
      )}

      {/* Symptoms */}
      {result.symptoms && result.symptoms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.derm.result.symptoms}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.symptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-sm text-muted">{symptom}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Causes */}
      {result.causes && result.causes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.derm.result.causes}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.causes.map((cause, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-sm text-muted">{cause}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Treatments */}
      {result.treatments && result.treatments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.derm.result.treatments}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.treatments.map((treatment, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-sm text-muted">{treatment}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* ABCDE Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>{t.derm.result.abcdeTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Asymmetry */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">A - Asymmetry</span>
                <span className="text-sm font-bold">{abcdeAnalysis.score.asymmetry}/2</span>
              </div>
              <Progress
                value={(abcdeAnalysis.score.asymmetry / 2) * 100}
                color={abcdeAnalysis.score.asymmetry === 0 ? "green" : abcdeAnalysis.score.asymmetry === 1 ? "yellow" : "red"}
              />
              <p className="text-xs text-muted mt-1">{abcdeAnalysis.details.asymmetry}</p>
            </div>

            {/* Border */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">B - Border</span>
                <span className="text-sm font-bold">{abcdeAnalysis.score.border}/2</span>
              </div>
              <Progress
                value={(abcdeAnalysis.score.border / 2) * 100}
                color={abcdeAnalysis.score.border === 0 ? "green" : abcdeAnalysis.score.border === 1 ? "yellow" : "red"}
              />
              <p className="text-xs text-muted mt-1">{abcdeAnalysis.details.border}</p>
            </div>

            {/* Color */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">C - Color</span>
                <span className="text-sm font-bold">{abcdeAnalysis.score.color}/3</span>
              </div>
              <Progress
                value={(abcdeAnalysis.score.color / 3) * 100}
                color={abcdeAnalysis.score.color <= 1 ? "green" : abcdeAnalysis.score.color === 2 ? "yellow" : "red"}
              />
              <p className="text-xs text-muted mt-1">{abcdeAnalysis.details.color}</p>
            </div>

            {/* Diameter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">D - Diameter</span>
                <span className="text-sm font-bold">{abcdeAnalysis.score.diameter}/2</span>
              </div>
              <Progress
                value={(abcdeAnalysis.score.diameter / 2) * 100}
                color={abcdeAnalysis.score.diameter === 0 ? "green" : abcdeAnalysis.score.diameter === 1 ? "yellow" : "red"}
              />
              <p className="text-xs text-muted mt-1">{abcdeAnalysis.details.diameter}</p>
            </div>
          </div>

          {/* Total Score */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif text-lg">Total ABCDE Score</span>
              <span className="font-bold text-xl">{abcdeAnalysis.score.total}/9</span>
            </div>
            <Progress
              value={(abcdeAnalysis.score.total / 9) * 100}
              color={abcdeAnalysis.score.riskLevel === 'low' ? "green" : abcdeAnalysis.score.riskLevel === 'medium' ? "yellow" : "red"}
            />
            <div className="mt-3 bg-cream rounded-xl p-4">
              <p className="text-sm text-muted">
                <strong>Risk Level:</strong> {abcdeAnalysis.score.riskLevel.toUpperCase()}
                {abcdeAnalysis.score.riskLevel === 'low' && ' - Low concern based on heuristic analysis'}
                {abcdeAnalysis.score.riskLevel === 'medium' && ' - Moderate concern, monitoring recommended'}
                {abcdeAnalysis.score.riskLevel === 'high' && ' - Higher concern, professional evaluation recommended'}
              </p>
            </div>
          </div>

          {/* Evolution Note */}
          <div className="bg-surface rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-medium mb-1">E - Evolution</h5>
                <p className="text-sm text-muted">{abcdeAnalysis.details.evolution}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
