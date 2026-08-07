import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { AlertCircle, Eye, Activity, Sun, AlertTriangle } from "lucide-react";
import { SKIN_RISK_LEVELS } from "@/lib/utils/healthRanges";

interface HealthAdviceProps {
  risk: 'low' | 'medium' | 'high';
  classification: string;
}

export function HealthAdvice({ risk, classification }: HealthAdviceProps) {
  const riskInfo = SKIN_RISK_LEVELS[risk];

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
              The AI classified this lesion as <strong className="text-ink">{classification}</strong>.
              {classification === 'Melanoma' && ' Melanoma is a type of skin cancer that develops from pigment-producing cells.'}
              {classification === 'Basal cell carcinoma' && ' Basal cell carcinoma is the most common type of skin cancer, typically slow-growing.'}
              {classification === 'Melanocytic nevus' && ' A melanocytic nevus is commonly known as a mole - typically benign.'}
              {classification === 'Benign keratosis' && ' Benign keratosis includes harmless skin growths like seborrheic keratosis.'}
              {classification === 'Actinic keratosis' && ' Actinic keratosis is a precancerous skin condition caused by sun damage.'}
              {classification === 'Dermatofibroma' && ' Dermatofibroma is a common benign skin nodule.'}
              {classification === 'Vascular lesion' && ' Vascular lesions are abnormalities of blood vessels in the skin.'}
            </p>
            <p className="mt-2">
              Monitor for changes in:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Size (growing larger)</li>
              <li>Color (darkening, multiple colors)</li>
              <li>Shape or borders (becoming irregular)</li>
              <li>Bleeding or oozing</li>
              <li>Itching or tenderness</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className={`border-2 ${risk === 'high' ? 'border-red-500' : risk === 'medium' ? 'border-yellow-500' : 'border-green-500'}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              risk === 'high' ? 'bg-red-100' : risk === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              <AlertTriangle className={`w-5 h-5 ${
                risk === 'high' ? 'text-red-600' : risk === 'medium' ? 'text-yellow-600' : 'text-green-600'
              }`} />
            </div>
            <CardTitle>Next Steps & Care</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-cream rounded-xl p-4">
            <p className="font-medium text-ink mb-2">{riskInfo.urgency}</p>
            <p className="text-sm text-muted">{riskInfo.advice}</p>
          </div>

          {risk === 'high' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-800">
                <strong>Important:</strong> High-risk classifications require prompt professional evaluation.
                Do not delay seeking medical attention. Early detection significantly improves treatment outcomes.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Self-Care Tips */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-terracotta-tint rounded-full flex items-center justify-center">
              <Sun className="w-5 h-5 text-terracotta" />
            </div>
            <CardTitle>Self-Care Tips</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-terracotta-tint rounded-full flex items-center justify-center mt-0.5">
                <span className="text-terracotta text-xs font-bold">1</span>
              </div>
              <div>
                <h5 className="font-medium mb-1">Sun Protection</h5>
                <p className="text-sm text-muted">
                  Use broad-spectrum SPF 30+ sunscreen daily, reapply every 2 hours when outdoors.
                  Seek shade between 10 AM - 4 PM when UV rays are strongest.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-terracotta-tint rounded-full flex items-center justify-center mt-0.5">
                <span className="text-terracotta text-xs font-bold">2</span>
              </div>
              <div>
                <h5 className="font-medium mb-1">Monthly Self-Examination</h5>
                <p className="text-sm text-muted">
                  Check your entire body monthly for new spots or changes to existing ones.
                  Use a mirror for hard-to-see areas or ask a partner to help.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-terracotta-tint rounded-full flex items-center justify-center mt-0.5">
                <span className="text-terracotta text-xs font-bold">3</span>
              </div>
              <div>
                <h5 className="font-medium mb-1">Photo Documentation</h5>
                <p className="text-sm text-muted">
                  Take photos of concerning spots every few months to track changes over time.
                  Compare photos side-by-side to detect subtle evolution.
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
              <Activity className="w-5 h-5 text-terracotta" />
            </div>
            <CardTitle>Should I See a Doctor?</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted mb-3">
            Consult a dermatologist or healthcare provider if:
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted">The lesion changes in size, shape, or color</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted">It bleeds, itches, or doesn't heal within a few weeks</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted">You have a personal or family history of skin cancer</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted">You're unsure about any skin changes or have concerns</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted">You have many moles or atypical-looking lesions</p>
            </div>
          </div>

          <div className="mt-4 bg-surface rounded-xl p-4">
            <p className="text-xs text-muted">
              <strong>Remember:</strong> When in doubt, get it checked out. Dermatologists are trained to
              distinguish between benign and malignant lesions. Early detection saves lives.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Medical Disclaimer */}
      <Card className="bg-charcoal text-white border-charcoal">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="mb-2">
                <strong>Medical Disclaimer:</strong> This screening tool is NOT a substitute for professional
                medical diagnosis. AI classification has inherent limitations and may not detect all conditions.
              </p>
              <p>
                Always consult qualified healthcare professionals for medical advice, diagnosis, and treatment.
                If you have concerns about a skin lesion, see a dermatologist for proper evaluation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
