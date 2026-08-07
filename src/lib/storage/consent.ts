// Consent storage management

export interface ConsentData {
  accepted: boolean;
  timestamp: string;
  version: string;
}

const CONSENT_KEY = 'vitals360_consent';

export function getConsent(): ConsentData | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading consent:', error);
    return null;
  }
}

export function saveConsent(consent: ConsentData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch (error) {
    console.error('Error saving consent:', error);
  }
}

export function clearConsent(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch (error) {
    console.error('Error clearing consent:', error);
  }
}
