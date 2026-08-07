"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface LungResult {
  condition: string;
  conditionTh: string;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  breathing: {
    rate: number;
    pattern: string;
    patternTh: string;
  };
  audio: {
    quality: string;
    qualityTh: string;
    abnormalities: string[];
    abnormalitiesTh: string[];
  };
}

interface ResultsViewProps {
  language: 'en' | 'th';
  result: LungResult;
  onNewScan: () => void;
}

export function ResultsView({ language, result, onNewScan }: ResultsViewProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'medium':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  const getRiskLabel = (risk: string) => {
    if (language === 'th') {
      switch (risk) {
        case 'high': return 'ความเสี่ยงสูง';
        case 'medium': return 'ความเสี่ยงปานกลาง';
        default: return 'ความเสี่ยงต่ำ';
      }
    }
    switch (risk) {
      case 'high': return 'High Risk';
      case 'medium': return 'Medium Risk';
      default: return 'Low Risk';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <Card className={`border-2 ${getRiskColor(result.risk)}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{language === 'th' ? 'การวินิจฉัย' : 'Diagnosis'}</span>
            <span className="text-sm font-normal">
              {getRiskLabel(result.risk)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-2xl font-serif mb-2">
              {language === 'th' ? result.conditionTh : result.condition}
            </h3>
            <p className="text-sm opacity-80">
              {language === 'th' ? 'ความมั่นใจ' : 'Confidence'}: {Math.round(result.confidence * 100)}%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Breathing Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'th' ? '📊 การวิเคราะห์การหายใจ' : '📊 Breathing Analysis'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface p-4 rounded-2xl">
              <p className="text-sm text-muted mb-1">
                {language === 'th' ? 'อัตราการหายใจ' : 'Breathing Rate'}
              </p>
              <p className="text-2xl font-semibold">
                {result.breathing.rate} <span className="text-sm font-normal text-muted">
                  {language === 'th' ? 'ครั้ง/นาที' : 'bpm'}
                </span>
              </p>
            </div>
            <div className="bg-surface p-4 rounded-2xl">
              <p className="text-sm text-muted mb-1">
                {language === 'th' ? 'รูปแบบ' : 'Pattern'}
              </p>
              <p className="text-lg font-medium">
                {language === 'th' ? result.breathing.patternTh : result.breathing.pattern}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'th' ? '🎵 การวิเคราะห์เสียง' : '🎵 Audio Analysis'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted mb-2">
              {language === 'th' ? 'คุณภาพเสียง' : 'Sound Quality'}
            </p>
            <p className="font-medium">
              {language === 'th' ? result.audio.qualityTh : result.audio.quality}
            </p>
          </div>

          {result.audio.abnormalities.length > 0 && (
            <div>
              <p className="text-sm text-muted mb-2">
                {language === 'th' ? 'สัญญาณที่ตรวจพบ' : 'Detected Signals'}
              </p>
              <ul className="space-y-1">
                {(language === 'th' ? result.audio.abnormalitiesTh : result.audio.abnormalities).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-terracotta">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-2 border-terracotta bg-terracotta-tint">
        <CardHeader>
          <CardTitle>{language === 'th' ? '💡 คำแนะนำ' : '💡 Recommendations'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.risk === 'high' && (
            <div className="bg-white p-4 rounded-2xl">
              <p className="font-medium mb-2">
                {language === 'th' ? '⚠️ แนะนำให้พบแพทย์ทันที' : '⚠️ Seek Medical Attention'}
              </p>
              <p className="text-sm text-muted">
                {language === 'th'
                  ? 'ผลการตรวจพบสัญญาณที่อาจบ่งชี้ถึงปัญหาสุขภาพที่ต้องได้รับการรักษา กรุณาพบแพทย์เพื่อรับการวินิจฉัยและรักษาที่เหมาะสม'
                  : 'Results indicate potential health issues that require treatment. Please consult a healthcare professional for proper diagnosis and treatment.'}
              </p>
            </div>
          )}

          {result.risk === 'medium' && (
            <div className="bg-white p-4 rounded-2xl">
              <p className="font-medium mb-2">
                {language === 'th' ? '⚠️ ควรติดตามอาการ' : '⚠️ Monitor Symptoms'}
              </p>
              <p className="text-sm text-muted">
                {language === 'th'
                  ? 'พบสัญญาณที่อาจต้องติดตามเฝ้าระวัง หากอาการแย่ลง หรือมีอาการเพิ่มเติม ควรปรึกษาแพทย์'
                  : 'Some concerning signs detected. Monitor your symptoms, and consult a doctor if they worsen or new symptoms appear.'}
              </p>
            </div>
          )}

          {result.risk === 'low' && (
            <div className="bg-white p-4 rounded-2xl">
              <p className="font-medium mb-2">
                {language === 'th' ? '✅ สุขภาพปอดดูดี' : '✅ Healthy Lung Function'}
              </p>
              <p className="text-sm text-muted">
                {language === 'th'
                  ? 'การหายใจและเสียงปอดดูปกติ ควรดูแลสุขภาพต่อไปด้วยการออกกำลังกายสมํ่าเสมอ และหลีกเลี่ยงมลพิษทางอากาศ'
                  : 'Breathing and lung sounds appear normal. Continue maintaining good health with regular exercise and avoid air pollution.'}
              </p>
            </div>
          )}

          <div className="bg-white p-4 rounded-2xl">
            <p className="font-medium mb-2">
              {language === 'th' ? '📝 ข้อควรระวัง' : '📝 Important Note'}
            </p>
            <p className="text-sm text-muted">
              {language === 'th'
                ? 'เครื่องมือนี้เป็นเพียงการตรวจคัดกรองเบื้องต้น ไม่สามารถใช้แทนการวินิจฉัยโดยแพทย์ผู้เชี่ยวชาญได้'
                : 'This tool is for preliminary screening only and cannot replace professional medical diagnosis.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* New Scan Button */}
      <div className="flex justify-center pt-4">
        <Button size="lg" onClick={onNewScan}>
          <RefreshCw className="w-5 h-5 mr-2" />
          {language === 'th' ? 'ตรวจใหม่' : 'New Scan'}
        </Button>
      </div>
    </div>
  );
}
