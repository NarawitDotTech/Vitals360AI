"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Trash2, Download, History, Shield, AlertTriangle } from "lucide-react";
import {
  getAllScans,
  clearAllScans,
  clearConsent,
  exportScans,
  deleteScan,
  type ScanResult,
} from "@/lib/storage";
import { format } from "date-fns";

export default function SettingsPage() {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = () => {
    const allScans = getAllScans();
    setScans(allScans);
  };

  const handleClearAll = () => {
    clearAllScans();
    loadScans();
    setShowClearConfirm(false);
  };

  const handleDeleteScan = (id: string) => {
    deleteScan(id);
    loadScans();
  };

  const handleExport = () => {
    const data = exportScans();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitals360-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetConsent = () => {
    if (confirm('This will reset your consent and show the consent screen on next page load. Continue?')) {
      clearConsent();
      alert('Consent cleared. Refresh the page to see the consent screen again.');
    }
  };

  const getScanTypeLabel = (type: string) => {
    switch (type) {
      case 'derm':
        return 'Skin Lesion';
      case 'respiratory':
        return 'Respiratory';
      case 'vitals':
        return 'Vital Signs';
      default:
        return type;
    }
  };

  const getScanTypeColor = (type: string): 'default' | 'success' | 'warning' => {
    switch (type) {
      case 'derm':
        return 'warning';
      case 'respiratory':
        return 'success';
      case 'vitals':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif mb-4">
            Settings & <em className="text-terracotta not-italic">History</em>
          </h1>
          <p className="text-lg text-muted">
            Manage your scan history, data storage, and privacy preferences
          </p>
        </div>

        {/* Data Overview */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Data Storage Overview</CardTitle>
              <Badge variant="default">{scans.length} scans</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-surface rounded-xl">
                <div className="text-3xl font-serif text-ink mb-1">
                  {scans.filter(s => s.type === 'derm').length}
                </div>
                <div className="text-sm text-muted">Skin Scans</div>
              </div>
              <div className="text-center p-4 bg-surface rounded-xl">
                <div className="text-3xl font-serif text-ink mb-1">
                  {scans.filter(s => s.type === 'respiratory').length}
                </div>
                <div className="text-sm text-muted">Respiratory Scans</div>
              </div>
              <div className="text-center p-4 bg-surface rounded-xl">
                <div className="text-3xl font-serif text-ink mb-1">
                  {scans.filter(s => s.type === 'vitals').length}
                </div>
                <div className="text-sm text-muted">Vitals Measurements</div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={scans.length === 0}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Export History
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowClearConfirm(true)}
                disabled={scans.length === 0}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Clear Confirmation */}
        {showClearConfirm && (
          <Card className="mb-6 border-2 border-red-500">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-900 mb-1">Confirm Data Deletion</h3>
                  <p className="text-sm text-red-800">
                    This will permanently delete all {scans.length} scan(s) from your browser storage.
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleClearAll}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  Yes, Delete All Data
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scan History */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-terracotta" />
              <CardTitle>Scan History</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {scans.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-muted mx-auto mb-3 opacity-50" />
                <p className="text-muted">No scans yet. Complete your first screening to see results here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {scans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-4 bg-surface rounded-xl"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Badge variant={getScanTypeColor(scan.type)}>
                          {getScanTypeLabel(scan.type)}
                        </Badge>
                        <span className="text-sm text-muted">
                          {format(new Date(scan.timestamp), 'MMM d, yyyy · h:mm a')}
                        </span>
                      </div>
                      <div className="text-xs text-muted">
                        {scan.type === 'derm' && scan.data.classification && (
                          <span>Classification: {scan.data.classification.label}</span>
                        )}
                        {scan.type === 'respiratory' && scan.data.prediction && (
                          <span>Result: {scan.data.prediction.class}</span>
                        )}
                        {scan.type === 'vitals' && scan.data.heartRate && (
                          <span>HR: {scan.data.heartRate} BPM</span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteScan(scan.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-terracotta" />
              <CardTitle>Privacy & Consent</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-surface rounded-xl p-4">
                <h4 className="font-medium mb-2">Current Settings</h4>
                <ul className="text-sm text-muted space-y-2">
                  <li>✓ Consent acknowledged</li>
                  <li>✓ Data stored locally in browser only</li>
                  <li>✓ No server-side storage of medical data</li>
                  <li>✓ All processing happens in-browser</li>
                  <li>✓ No external services used</li>
                </ul>
              </div>

              <Button variant="outline" onClick={handleResetConsent} className="w-full">
                Reset Consent & Privacy Preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About Vitals360 AI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-muted">
              <p>
                Vitals360 AI is an advanced health screening application that uses artificial intelligence
                to provide preliminary health insights. It includes:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Skin lesion classification using HAM10000 taxonomy</li>
                <li>Respiratory sound analysis with ONNX deep learning model</li>
                <li>Camera-based vital signs monitoring (rPPG technology)</li>
              </ul>
              <p className="mt-3 text-xs">
                <strong>Version:</strong> 1.0.0 | <strong>Built:</strong> 2026
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
