// Local storage management for scan results and user preferences

export interface ScanResult {
  id: string;
  type: 'derm' | 'respiratory' | 'vitals';
  timestamp: string;
  data: any;
}

const STORAGE_KEYS = {
  SCANS: 'vitals360_scans',
  CONSENT: 'vitals360_consent',
};

/**
 * Save a scan result to localStorage
 */
export function saveScan(scan: ScanResult): void {
  try {
    const scans = getAllScans();
    scans.push(scan);
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(scans));
  } catch (error) {
    console.error('Error saving scan:', error);
  }
}

/**
 * Get all scan results from localStorage
 */
export function getAllScans(): ScanResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCANS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading scans:', error);
    return [];
  }
}

/**
 * Get scans by type
 */
export function getScansByType(type: ScanResult['type']): ScanResult[] {
  return getAllScans().filter(scan => scan.type === type);
}

/**
 * Delete a specific scan
 */
export function deleteScan(id: string): void {
  try {
    const scans = getAllScans();
    const filtered = scans.filter(scan => scan.id !== id);
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting scan:', error);
  }
}

/**
 * Clear all scans
 */
export function clearAllScans(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SCANS);
  } catch (error) {
    console.error('Error clearing scans:', error);
  }
}

/**
 * Export scans as JSON
 */
export function exportScans(): string {
  const scans = getAllScans();
  return JSON.stringify(scans, null, 2);
}

/**
 * Check if consent has been given
 */
export function hasConsent(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.CONSENT) === 'true';
  } catch (error) {
    return false;
  }
}

/**
 * Save consent
 */
export function saveConsent(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONSENT, 'true');
  } catch (error) {
    console.error('Error saving consent:', error);
  }
}

/**
 * Clear consent
 */
export function clearConsent(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CONSENT);
  } catch (error) {
    console.error('Error clearing consent:', error);
  }
}
