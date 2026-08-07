"use client";

import { useState, useEffect } from "react";
import { Shield, Check } from "lucide-react";
import { getConsent, saveConsent } from "@/lib/storage/consent";

export function ConsentGate() {
  const [showConsent, setShowConsent] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    if (acknowledged) {
      saveConsent({
        accepted: true,
        timestamp: new Date().toISOString(),
        version: "1.0",
      });
      setShowConsent(false);
    }
  };

  if (!showConsent) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-terracotta-tint rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-terracotta" />
          </div>
          <h2 className="text-2xl font-serif">Before You Begin</h2>
        </div>

        <div className="space-y-4 mb-6 text-muted">
          <p className="leading-relaxed">
            Welcome to <strong className="text-ink">Vitals360 AI</strong>. Before using our health screening tools, please understand and acknowledge the following:
          </p>

          <div className="bg-cream rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-terracotta-tint rounded-full flex items-center justify-center mt-0.5">
                <span className="text-terracotta text-xs font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-ink mb-1">Not a Medical Diagnostic Tool</h3>
                <p className="text-sm">
                  This application provides <strong>screening estimates only</strong> and does not diagnose medical conditions.
                  Always consult qualified healthcare professionals for medical advice.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-terracotta-tint rounded-full flex items-center justify-center mt-0.5">
                <span className="text-terracotta text-xs font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-ink mb-1">Data Handling & Privacy</h3>
                <p className="text-sm">
                  All processing happens entirely in your browser using local AI models and algorithms.
                  All results are stored locally in your browser only. No server-side medical data storage.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-terracotta-tint rounded-full flex items-center justify-center mt-0.5">
                <span className="text-terracotta text-xs font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium text-ink mb-1">Accuracy Limitations</h3>
                <p className="text-sm">
                  Results depend on hardware quality (camera, microphone) and environmental conditions.
                  AI models have inherent limitations and may not detect all conditions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-terracotta-tint rounded-full flex items-center justify-center mt-0.5">
                <span className="text-terracotta text-xs font-bold">4</span>
              </div>
              <div>
                <h3 className="font-medium text-ink mb-1">Emergency Situations</h3>
                <p className="text-sm">
                  If experiencing a medical emergency, <strong className="text-terracotta">call 911</strong> immediately.
                  Do not rely on this tool for urgent medical decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <label className="flex items-start gap-3 mb-6 cursor-pointer group">
          <div className="flex-shrink-0">
            <div
              className={`
                w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                ${acknowledged ? "bg-terracotta border-terracotta" : "border-border group-hover:border-terracotta"}
              `}
            >
              {acknowledged && <Check className="w-4 h-4 text-white" />}
            </div>
          </div>
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="sr-only"
          />
          <span className="text-sm text-muted">
            I understand that this is not a medical diagnostic tool and that I should consult healthcare professionals for medical advice.
            I acknowledge the data handling practices and limitations described above.
          </span>
        </label>

        <button
          onClick={handleAccept}
          disabled={!acknowledged}
          className={`
            w-full py-3.5 rounded-pill font-medium transition-all
            ${
              acknowledged
                ? "bg-terracotta hover:bg-terracotta-hover text-white hover:-translate-y-0.5 hover:shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          I Understand - Continue to App
        </button>
      </div>
    </div>
  );
}
