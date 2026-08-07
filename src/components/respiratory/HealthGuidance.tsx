import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { AlertCircle, Activity, Wind, Stethoscope } from "lucide-react";

interface HealthGuidanceProps {
  classification: string;
}

export function HealthGuidance({ classification }: HealthGuidanceProps) {
  const isAbnormal = classification !== 'Normal';

  return (
    <div className="space-y-6">
      {/* What This Means */}
      <Card>
        <CardHeader>
          <CardTitle>What This Means</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="prose prose-sm max-w-none text-muted">
            <p>
              <strong className="text-ink">Your Result: {classification}</strong>
            </p>

            {classification === 'Normal' && (
              <p>
                No abnormal breathing sounds were detected in this recording. Normal breath sounds are
                typically smooth and consistent, without crackles, wheezes, or other adventitious sounds.
              </p>
            )}

            {classification === 'Crackles' && (
              <>
                <p>
                  <strong>Crackles</strong> are discontinuous, popping or clicking sounds heard during breathing.
                  They sound like the noise made when separating velcro or crumpling cellophane.
                </p>
                <p>
                  Crackles may indicate:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Fluid in the airways (pneumonia, pulmonary edema)</li>
                  <li>Inflammation or scarring (fibrosis)</li>
                  <li>Opening of previously closed airways</li>
                  <li>Mucus in the airways (bronchitis)</li>
                </ul>
              </>
            )}

            {classification === 'Wheezes' && (
              <>
                <p>
                  <strong>Wheezes</strong> are continuous, high-pitched whistling sounds that occur when air flows
                  through narrowed airways. They're most commonly heard during exhalation.
                </p>
                <p>
                  Wheezes may indicate:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Asthma (reversible airway narrowing)</li>
                  <li>Chronic obstructive pulmonary disease (COPD)</li>
                  <li>Bronchitis or bronchiolitis</li>
                  <li>Allergic reactions</li>
                  <li>Foreign object in airway (rare)</li>
                </ul>
              </>
            )}

            {classification === 'Both (Crackles + Wheezes)' && (
              <>
                <p>
                  Both <strong>crackles</strong> and <strong>wheezes</strong> were detected. This combination
                  suggests multiple respiratory issues may be present.
                </p>
                <p>
                  This pattern may indicate:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Acute exacerbation of COPD</li>
                  <li>Severe asthma with mucus buildup</li>
                  <li>Pneumonia with airway narrowing</li>
                  <li>Bronchiectasis</li>
                  <li>Congestive heart failure affecting lungs</li>
                </ul>
              </>
            )}

            <p className="mt-3 text-xs">
              <strong>Note:</strong> This screening cannot diagnose specific conditions. Only a healthcare
              provider can determine the cause and appropriate treatment.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className={`border-2 ${isAbnormal ? 'border-yellow-500' : 'border-green-500'}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isAbnormal ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              <AlertCircle className={`w-5 h-5 ${
                isAbnormal ? 'text-yellow-600' : 'text-green-600'
              }`} />
            </div>
            <CardTitle>Next Steps</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAbnormal ? (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="font-medium text-yellow-900 mb-2">
                  Abnormal breathing patterns detected
                </p>
                <p className="text-sm text-yellow-800">
                  Consult a healthcare provider, especially if you have symptoms like:
                </p>
                <ul className="list-disc pl-5 mt-2 text-sm text-yellow-800 space-y-1">
                  <li>Shortness of breath or difficulty breathing</li>
                  <li>Persistent cough (lasting more than 3 weeks)</li>
                  <li>Chest tightness or pain</li>
                  <li>Fever or chills</li>
                  <li>Coughing up blood or thick mucus</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-800">
                  <strong>Seek immediate medical care if:</strong>
                </p>
                <ul className="list-disc pl-5 mt-2 text-sm text-red-800 space-y-1">
                  <li>Severe breathing difficulty or gasping for air</li>
                  <li>Bluish lips or fingernails</li>
                  <li>Chest pain or pressure</li>
                  <li>Confusion or extreme drowsiness</li>
                  <li>High fever with breathing problems</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="font-medium text-green-900 mb-2">
                No concerning patterns detected
              </p>
              <p className="text-sm text-green-800">
                Continue monitoring your symptoms if you're feeling unwell. If respiratory symptoms
                develop or persist, consult a healthcare provider.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Self-Care & Monitoring */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-terracotta-tint rounded-full flex items-center justify-center">
              <Wind className="w-5 h-5 text-terracotta" />
            </div>
            <CardTitle>Self-Care & Monitoring</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-terracotta-tint rounded-full flex items-center justify-center mt-0.5">
                <span className="text-terracotta text-xs font-bold">1</span>
              </div>
              <div>
                <h5 className="font-medium mb-1">Keep a Symptom Diary</h5>
                <p className="text-sm text-muted">
                  Track cough frequency, breathing difficulty, triggers, and when symptoms are worst.
                  Note any patterns related to time of day, activity, or environment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-terracotta-tint rounded-full flex items-center justify-center mt-0.5">
                <span className="text-terracotta text-xs font-bold">2</span>
              </div>
              <div>
                <h5 className="font-medium mb-1">Peak Flow Monitoring (if applicable)</h5>
                <p className="text-sm text-muted">
                  If you have asthma or COPD, use a peak flow meter regularly to track lung function.
                  Share measurements with your healthcare provider.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-terracotta-tint rounded-full flex items-center justify-center mt-0.5">
                <span className="text-terracotta text-xs font-bold">3</span>
              </div>
              <div>
                <h5 className="font-medium mb-1">Avoid Triggers</h5>
                <p className="text-sm text-muted">
                  Stay away from smoke, strong odors, allergens, and cold air if they worsen symptoms.
                  Use air purifiers and maintain good indoor air quality.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-terracotta-tint rounded-full flex items-center justify-center mt-0.5">
                <span className="text-terracotta text-xs font-bold">4</span>
              </div>
              <div>
                <h5 className="font-medium mb-1">Stay Hydrated & Practice Breathing Exercises</h5>
                <p className="text-sm text-muted">
                  Drink plenty of water to help thin mucus. Practice pursed-lip breathing and
                  diaphragmatic breathing to improve respiratory efficiency.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* When to See a Doctor */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-terracotta-tint rounded-full flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-terracotta" />
            </div>
            <CardTitle>When to See a Doctor</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted mb-3">
            Schedule a medical appointment if you experience:
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted">Persistent cough lasting more than 3 weeks</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted">Wheezing that doesn't improve with inhaler use</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted">Coughing up blood or thick, discolored mucus</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted">Fever accompanied by breathing difficulty</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted">Worsening symptoms despite home care measures</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted">Night sweats or unexplained weight loss</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
