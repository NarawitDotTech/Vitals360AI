import { AlertCircle } from "lucide-react";

export function DisclaimerFooter() {
  return (
    <footer className="bg-charcoal text-white py-12 mt-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-terracotta flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-serif text-lg mb-3">Medical Disclaimer</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              This tool is for informational and educational purposes only. It does NOT provide
              medical advice, diagnosis, or treatment. All results are screening estimates and should
              not replace professional medical consultation. If you have health concerns, consult a
              qualified healthcare provider. In case of medical emergency, call 911 or your local
              emergency number immediately.
            </p>
            <p className="text-xs text-gray-400 mt-4">
              © 2026 Vitals360 AI. Not intended for medical diagnosis. Use at your own risk.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
