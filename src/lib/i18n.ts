export type Language = 'en' | 'th';

export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      skinScreening: 'Skin Screening',
      respiratory: 'Respiratory',
      vitals: 'Vital Signs',
      settings: 'Settings',
    },

    // Home page
    home: {
      badge: 'Most loved health screening tool',
      heroTitle: 'AI-Powered Health Screening at Your Fingertips',
      heroSubtitle: 'Comprehensive health screening using advanced AI and computer vision. Analyze skin lesions, breathing sounds, and vital signs—all from your device.',
      startButton: 'Start Screening',
      historyButton: 'View History',

      featuresTitle: 'Three Powerful Screening Tools',
      featuresSubtitle: 'Each feature uses cutting-edge AI to provide actionable health insights',

      skinCard: {
        title: 'Skin Lesion Screening',
        description: 'AI classification using HAM10000 taxonomy with ABCDE heuristic analysis. Detect melanoma risk factors early.',
        button: 'Start Skin Analysis',
      },
      respiratoryCard: {
        badge: 'Popular',
        title: 'Respiratory Analysis',
        description: 'Deep learning model detects crackles, wheezes, and abnormal breathing patterns. 100% browser-based.',
        button: 'Analyze Breathing',
      },
      vitalsCard: {
        title: 'Vital Signs Monitoring',
        description: 'Camera-based rPPG technology measures heart rate, HRV, and respiratory rate. No wearables needed.',
        button: 'Measure Vitals',
      },

      howItWorksTitle: 'Simple and Secure',
      howItWorksSubtitle: 'Privacy-first design with powerful AI analysis',

      feature1Title: 'Quick Screening',
      feature1Text: 'Each screening takes 10-30 seconds. Get instant results with detailed explanations.',

      feature2Title: 'Privacy Protected',
      feature2Text: 'All processing happens in your browser. Data stored locally only. No server storage.',

      feature3Title: 'Medical Guidance',
      feature3Text: 'Clear advice on when to see a doctor and self-care tips for every result.',

      ctaTitle: 'Ready to Start Your Health Journey?',
      ctaSubtitle: 'Choose any screening tool to begin. All features work completely in your browser with no registration required.',
      ctaButton1: 'Skin Analysis',
      ctaButton2: 'Breathing Test',
      ctaButton3: 'Vitals Check',
    },

    // Skin screening page
    derm: {
      title: 'Skin Condition Screening',
      subtitle: 'Take or upload a photo of the skin area',
      captureButton: 'Take Photo',
      uploadButton: 'Upload Image',
      analyzing: 'Analyzing image...',
      newScan: 'New Scan',

      // Easy summary for elderly
      summary: {
        title: 'What We Found (Simple Explanation)',
        low: 'This looks like a common skin condition that is usually not serious. It may need basic care.',
        medium: 'This skin condition should be checked by a doctor. It may need treatment.',
        high: 'This condition needs medical attention soon. Please see a doctor.',
        footer: 'This is only a screening tool. Always consult a doctor for proper diagnosis.',
      },

      result: {
        title: 'Analysis Result',
        confidence: 'Confidence',
        overview: 'What is it?',
        symptoms: 'What you might notice',
        causes: 'What causes it',
        treatments: 'How to treat it',
        abcdeTitle: 'Detailed Analysis',
      },

      risk: {
        low: 'LOW RISK',
        medium: 'MODERATE RISK',
        high: 'HIGH RISK',
      },
    },

    // Common
    common: {
      back: 'Back',
      close: 'Close',
      loading: 'Loading...',
      error: 'Error',
      retry: 'Try Again',
    },
  },

  th: {
    // Navigation
    nav: {
      home: 'หน้าหลัก',
      skinScreening: 'ตรวจผิวหนัง',
      respiratory: 'ตรวจการหายใจ',
      vitals: 'ตรวจสัญญาณชีพ',
      settings: 'ตั้งค่า',
    },

    // Home page
    home: {
      badge: 'เครื่องมือตรวจสุขภาพที่ได้รับความนิยมสูงสุด',
      heroTitle: 'ตรวจสุขภาพด้วย AI อยู่ในมือคุณ',
      heroSubtitle: 'ตรวจสุขภาพแบบครบวงจรด้วย AI และคอมพิวเตอร์วิทัศน์ขั้นสูง วิเคราะห์ผิวหนัง เสียงการหายใจ และสัญญาณชีพ—ทั้งหมดจากอุปกรณ์ของคุณ',
      startButton: 'เริ่มตรวจสุขภาพ',
      historyButton: 'ดูประวัติ',

      featuresTitle: 'เครื่องมือตรวจสุขภาพ 3 อย่างที่ทรงพลัง',
      featuresSubtitle: 'แต่ละฟีเจอร์ใช้ AI ล้ำสมัยเพื่อให้คำแนะนำด้านสุขภาพที่ใช้ได้จริง',

      skinCard: {
        title: 'ตรวจสภาพผิวหนัง',
        description: 'AI วิเคราะห์ตามมาตรฐาน HAM10000 พร้อมการวิเคราะห์ ABCDE ตรวจหาความเสี่ยงเมลาโนมาได้ตั้งแต่เนิ่นๆ',
        button: 'เริ่มวิเคราะห์ผิวหนัง',
      },
      respiratoryCard: {
        badge: 'ยอดนิยม',
        title: 'วิเคราะห์การหายใจ',
        description: 'โมเดล Deep Learning ตรวจจับเสียงแตก เสียงหวีด และรูปแบบการหายใจผิดปกติ ทำงาน 100% ในเบราว์เซอร์',
        button: 'วิเคราะห์การหายใจ',
      },
      vitalsCard: {
        title: 'ตรวจสัญญาณชีพ',
        description: 'เทคโนโลยี rPPG แบบใช้กล้องวัดอัตราการเต้นหัวใจ HRV และอัตราการหายใจ ไม่ต้องใช้อุปกรณ์สวมใส่',
        button: 'วัดสัญญาณชีพ',
      },

      howItWorksTitle: 'ง่ายและปลอดภัย',
      howItWorksSubtitle: 'ออกแบบให้ความสำคัญกับความเป็นส่วนตัว พร้อมการวิเคราะห์ AI ที่ทรงพลัง',

      feature1Title: 'ตรวจเร็ว',
      feature1Text: 'แต่ละการตรวจใช้เวลา 10-30 วินาที รับผลทันทีพร้อมคำอธิบายโดยละเอียด',

      feature2Title: 'ปกป้องความเป็นส่วนตัว',
      feature2Text: 'การประมวลผลทั้งหมดเกิดขึ้นในเบราว์เซอร์ของคุณ ข้อมูลเก็บในเครื่องเท่านั้น ไม่มีการเก็บบนเซิร์ฟเวอร์',

      feature3Title: 'คำแนะนำทางการแพทย์',
      feature3Text: 'คำแนะนำที่ชัดเจนว่าเมื่อไหร่ควรพบแพทย์ พร้อมเคล็ดลับการดูแลตัวเองสำหรับทุกผลการตรวจ',

      ctaTitle: 'พร้อมเริ่มต้นการดูแลสุขภาพแล้วหรือยัง?',
      ctaSubtitle: 'เลือกเครื่องมือตรวจสุขภาพใดก็ได้เพื่อเริ่มต้น ฟีเจอร์ทั้งหมดทำงานในเบราว์เซอร์ของคุณโดยไม่ต้องลงทะเบียน',
      ctaButton1: 'วิเคราะห์ผิวหนัง',
      ctaButton2: 'ตรวจการหายใจ',
      ctaButton3: 'ตรวจสัญญาณชีพ',
    },

    // Skin screening page
    derm: {
      title: 'ตรวจสภาพผิวหนัง',
      subtitle: 'ถ่ายหรืออัปโหลดรูปบริเวณผิวหนัง',
      captureButton: 'ถ่ายรูป',
      uploadButton: 'อัปโหลดรูป',
      analyzing: 'กำลังวิเคราะห์รูปภาพ...',
      newScan: 'ตรวจใหม่',

      // Easy summary for elderly
      summary: {
        title: 'สรุปผลการตรวจ (อธิบายง่ายๆ)',
        low: 'นี่เป็นอาการผิวหนังที่พบได้ทั่วไป ไม่ร้ายแรง อาจต้องดูแลเบื้องต้น',
        medium: 'อาการผิวหนังนี้ควรให้แพทย์ตรวจ อาจต้องได้รับการรักษา',
        high: 'อาการนี้ต้องพบแพทย์โดยเร็ว กรุณาไปพบแพทย์',
        footer: 'นี่เป็นเพียงเครื่องมือคัดกรองเบื้องต้น ต้องปรึกษาแพทย์เสมอเพื่อการวินิจฉัยที่ถูกต้อง',
      },

      result: {
        title: 'ผลการวิเคราะห์',
        confidence: 'ความมั่นใจ',
        overview: 'คืออะไร?',
        symptoms: 'อาการที่อาจพบ',
        causes: 'สาเหตุ',
        treatments: 'วิธีรักษา',
        abcdeTitle: 'การวิเคราะห์โดยละเอียด',
      },

      risk: {
        low: 'ความเสี่ยงต่ำ',
        medium: 'ความเสี่ยงปานกลาง',
        high: 'ความเสี่ยงสูง',
      },
    },

    // Common
    common: {
      back: 'กลับ',
      close: 'ปิด',
      loading: 'กำลังโหลด...',
      error: 'เกิดข้อผิดพลาด',
      retry: 'ลองอีกครั้ง',
    },
  },
};

export function useTranslation(lang: Language) {
  return translations[lang];
}
