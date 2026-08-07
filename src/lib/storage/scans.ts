// Scan history storage management

export interface ScanResult {
  id: string;
  type: 'derm' | 'respiratory' | 'vitals';
  timestamp: string;
  data: any; // Type varies by scan type
}

const SCANS_KEY = 'vitals360_scans';

export function getAllScans(): ScanResult[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(SCANS_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading scans:', error);
    return [];
  }
}

export function getScansByType(type: ScanResult['type']): ScanResult[] {
  return getAllScans().filter(scan => scan.type === type);
}

export function saveScan(scan: ScanResult): void {
  if (typeof window === 'undefined') return;

  try {
    const scans = getAllScans();
    scans.unshift(scan); // Add to beginning

    // Keep only last 100 scans
    const trimmed = scans.slice(0, 100);

    localStorage.setItem(SCANS_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error saving scan:', error);
  }
}

export function deleteScan(id: string): void {
  if (typeof window === 'undefined') return;

  try {
    const scans = getAllScans();
    const filtered = scans.filter(scan => scan.id !== id);
    localStorage.setItem(SCANS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting scan:', error);
  }
}

export function clearAllScans(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(SCANS_KEY);
  } catch (error) {
    console.error('Error clearing scans:', error);
  }
}

export function exportScans(): string {
  const scans = getAllScans();
  return JSON.stringify(scans, null, 2);
}
