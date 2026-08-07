// Health ranges and advice for vital signs

export interface HealthAdvice {
  label: string;
  advice: string;
  shouldSeeDoctor: boolean;
  color: 'green' | 'yellow' | 'red';
}

// Heart Rate Ranges
export const HEART_RATE_RANGES = {
  low: { max: 60, label: 'Low', shouldSeeDoctor: true, color: 'yellow' as const },
  normal: { min: 60, max: 100, label: 'Normal', shouldSeeDoctor: false, color: 'green' as const },
  elevated: { min: 100, max: 120, label: 'Elevated', shouldSeeDoctor: false, color: 'yellow' as const },
  high: { min: 120, label: 'High', shouldSeeDoctor: true, color: 'red' as const },
};

export function getHeartRateAdvice(bpm: number): HealthAdvice {
  if (bpm < 60) {
    return {
      label: 'Low',
      advice: 'Your heart rate is below normal range. This may be normal if you are an athlete, but consult a doctor if you experience dizziness or fatigue.',
      shouldSeeDoctor: true,
      color: 'yellow',
    };
  } else if (bpm <= 100) {
    return {
      label: 'Normal',
      advice: 'Your heart rate is within the normal resting range for adults.',
      shouldSeeDoctor: false,
      color: 'green',
    };
  } else if (bpm <= 120) {
    return {
      label: 'Elevated',
      advice: 'Your heart rate is slightly elevated. This may be due to stress, caffeine, or recent activity. Consider monitoring it over time.',
      shouldSeeDoctor: false,
      color: 'yellow',
    };
  } else {
    return {
      label: 'High',
      advice: 'Your heart rate is significantly elevated. If persistent at rest, consult a healthcare provider to rule out underlying conditions.',
      shouldSeeDoctor: true,
      color: 'red',
    };
  }
}

// HRV Ranges (RMSSD in milliseconds)
export function getHRVAdvice(rmssd: number): HealthAdvice {
  if (rmssd < 20) {
    return {
      label: 'Low',
      advice: 'Low HRV may indicate stress, poor recovery, or reduced cardiovascular fitness. Prioritize sleep, stress management, and recovery.',
      shouldSeeDoctor: true,
      color: 'red',
    };
  } else if (rmssd <= 35) {
    return {
      label: 'Fair',
      advice: 'Your HRV is in the fair range. Focus on improving sleep quality and managing stress for better cardiovascular health.',
      shouldSeeDoctor: false,
      color: 'yellow',
    };
  } else if (rmssd <= 60) {
    return {
      label: 'Good',
      advice: 'Your HRV indicates good cardiovascular fitness and stress resilience. Maintain your current health practices.',
      shouldSeeDoctor: false,
      color: 'green',
    };
  } else {
    return {
      label: 'Excellent',
      advice: 'Excellent HRV indicates strong cardiovascular health and good recovery capacity.',
      shouldSeeDoctor: false,
      color: 'green',
    };
  }
}

// Respiratory Rate Ranges (breaths per minute)
export function getRespiratoryRateAdvice(rate: number): HealthAdvice {
  if (rate < 12) {
    return {
      label: 'Low',
      advice: 'Your respiratory rate is below normal. This may be normal during deep relaxation, but consult a doctor if you feel short of breath.',
      shouldSeeDoctor: true,
      color: 'yellow',
    };
  } else if (rate <= 20) {
    return {
      label: 'Normal',
      advice: 'Your respiratory rate is within the normal range for adults at rest.',
      shouldSeeDoctor: false,
      color: 'green',
    };
  } else if (rate <= 25) {
    return {
      label: 'Elevated',
      advice: 'Your respiratory rate is slightly elevated. This may be due to anxiety, recent activity, or environmental factors.',
      shouldSeeDoctor: false,
      color: 'yellow',
    };
  } else {
    return {
      label: 'High',
      advice: 'Your respiratory rate is significantly elevated. If persistent at rest without exertion, consult a healthcare provider.',
      shouldSeeDoctor: true,
      color: 'red',
    };
  }
}

// Skin Lesion Risk Levels
export const SKIN_RISK_LEVELS = {
  low: {
    urgency: 'Continue routine skin monitoring',
    advice: 'While this appears to be low risk, continue monthly self-examinations and see a dermatologist annually for skin checks. Seek professional evaluation if you notice any changes.',
    shouldSeeDoctor: false,
  },
  medium: {
    urgency: 'Schedule a dermatology appointment',
    advice: 'Schedule a dermatology appointment within 1-2 months for professional evaluation and monitoring. These lesions warrant closer examination by a trained specialist.',
    shouldSeeDoctor: true,
  },
  high: {
    urgency: 'Consult a dermatologist promptly',
    advice: 'Consult a dermatologist within 1-2 weeks. High-risk classifications require prompt professional evaluation. Early detection significantly improves treatment outcomes.',
    shouldSeeDoctor: true,
  },
};
