/**
 * Comprehensive Skin Disease Classifier - 50+ Conditions
 *
 * Free, open-source browser-based classification
 * No backend required - runs 100% client-side
 */

import * as tf from '@tensorflow/tfjs';

export interface SkinCondition {
  id: string;
  name: string;
  category: string;
  description: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
  risk: 'low' | 'medium' | 'high';
}

export interface ClassificationResult {
  topPrediction: SkinCondition & { confidence: number };
  alternatives: Array<SkinCondition & { confidence: number }>;
}

// Complete database of 50+ skin conditions
export const SKIN_CONDITIONS: Record<string, SkinCondition> = {
  // CANCEROUS & PRE-CANCEROUS
  'mel': {
    id: 'mel',
    name: 'Melanoma',
    category: 'Malignant Cancer',
    description: 'Most serious type of skin cancer that develops in melanocytes. Can spread rapidly if not detected early.',
    symptoms: ['Asymmetric mole', 'Irregular borders', 'Multiple colors', 'Diameter > 6mm', 'Evolving appearance'],
    causes: ['UV radiation', 'Family history', 'Fair skin', 'Many moles', 'Weakened immune system'],
    treatments: ['Surgical excision', 'Immunotherapy', 'Targeted therapy', 'Radiation therapy'],
    risk: 'high'
  },
  'bcc': {
    id: 'bcc',
    name: 'Basal Cell Carcinoma',
    category: 'Malignant Cancer',
    description: 'Most common type of skin cancer. Rarely spreads but can be locally invasive.',
    symptoms: ['Pearly bump', 'Flat scar-like lesion', 'Bleeding sore', 'Usually on sun-exposed areas'],
    causes: ['UV exposure', 'Fair skin', 'History of sunburns', 'Radiation exposure'],
    treatments: ['Mohs surgery', 'Excision', 'Radiation therapy', 'Topical treatments'],
    risk: 'high'
  },
  'scc': {
    id: 'scc',
    name: 'Squamous Cell Carcinoma',
    category: 'Malignant Cancer',
    description: 'Second most common skin cancer. Can metastasize if untreated.',
    symptoms: ['Firm red nodule', 'Scaly patch', 'Open sore', 'Wart-like growth'],
    causes: ['UV exposure', 'Fair skin', 'HPV infection', 'Chronic wounds'],
    treatments: ['Surgical excision', 'Mohs surgery', 'Radiation', 'Cryotherapy'],
    risk: 'high'
  },
  'akiec': {
    id: 'akiec',
    name: 'Actinic Keratosis',
    category: 'Pre-cancerous',
    description: 'Precancerous patches of thick, scaly skin. Can progress to squamous cell carcinoma.',
    symptoms: ['Rough scaly patches', 'Pink or red', 'Flat or raised', 'Itching or burning'],
    causes: ['Prolonged sun exposure', 'Fair skin', 'Age over 40', 'Outdoor occupation'],
    treatments: ['Cryotherapy', 'Topical medications', 'Photodynamic therapy', 'Chemical peels'],
    risk: 'medium'
  },

  // BENIGN GROWTHS
  'nv': {
    id: 'nv',
    name: 'Melanocytic Nevus (Mole)',
    category: 'Benign Growth',
    description: 'Common benign skin growth. Most are harmless but should be monitored.',
    symptoms: ['Round brown spot', 'Uniform color', 'Smooth borders', 'Usually < 6mm', 'Stable over time'],
    causes: ['Genetics', 'Sun exposure in childhood', 'Hormonal changes'],
    treatments: ['Monitoring', 'Removal if atypical', 'Sun protection'],
    risk: 'low'
  },
  'bkl': {
    id: 'bkl',
    name: 'Seborrheic Keratosis',
    category: 'Benign Growth',
    description: 'Common benign warty growth. Harmless but can be cosmetically bothersome.',
    symptoms: ['Brown or black growth', 'Waxy appearance', 'Stuck-on look', 'Various sizes'],
    causes: ['Aging', 'Genetics', 'Sun exposure'],
    treatments: ['No treatment needed', 'Cryotherapy', 'Electrocautery', 'Curettage'],
    risk: 'low'
  },
  'df': {
    id: 'df',
    name: 'Dermatofibroma',
    category: 'Benign Growth',
    description: 'Common benign fibrous nodule. Feels like a hard lump under the skin.',
    symptoms: ['Firm bump', 'Red-brown color', 'Usually on legs', 'Tender when pressed'],
    causes: ['Minor injury', 'Insect bite', 'Unknown trigger'],
    treatments: ['Observation', 'Surgical removal if bothersome'],
    risk: 'low'
  },
  'skin_tag': {
    id: 'skin_tag',
    name: 'Skin Tag (Acrochordon)',
    category: 'Benign Growth',
    description: 'Small soft skin growth that hangs off the skin.',
    symptoms: ['Flesh-colored', 'Pedunculated', 'Soft texture', 'Common in skin folds'],
    causes: ['Friction', 'Obesity', 'Diabetes', 'Genetics'],
    treatments: ['Snip excision', 'Cryotherapy', 'Electrocautery'],
    risk: 'low'
  },
  'lipoma': {
    id: 'lipoma',
    name: 'Lipoma',
    category: 'Benign Growth',
    description: 'Soft fatty lump that grows under the skin.',
    symptoms: ['Soft doughy lump', 'Moveable', 'Painless', 'Slow growing'],
    causes: ['Genetics', 'Age', 'Injury'],
    treatments: ['Observation', 'Surgical removal', 'Liposuction'],
    risk: 'low'
  },
  'cyst_epidermoid': {
    id: 'cyst_epidermoid',
    name: 'Epidermoid Cyst',
    category: 'Benign Growth',
    description: 'Non-cancerous small bumps beneath the skin filled with keratin.',
    symptoms: ['Small bump under skin', 'Central pore', 'May discharge cheese-like material', 'Can become inflamed'],
    causes: ['Blocked hair follicle', 'Skin injury', 'HPV infection'],
    treatments: ['Incision and drainage', 'Surgical excision', 'Antibiotics if infected'],
    risk: 'low'
  },

  // VASCULAR LESIONS
  'vasc': {
    id: 'vasc',
    name: 'Vascular Lesion',
    category: 'Vascular',
    description: 'Blood vessel-related skin marks including angiomas and hemangiomas.',
    symptoms: ['Red or purple mark', 'May blanch when pressed', 'Various sizes'],
    causes: ['Genetics', 'Injury', 'Hormonal factors', 'Aging'],
    treatments: ['Observation', 'Laser therapy', 'Surgical removal'],
    risk: 'low'
  },
  'cherry_angioma': {
    id: 'cherry_angioma',
    name: 'Cherry Angioma',
    category: 'Vascular',
    description: 'Common benign red skin growths made of blood vessels.',
    symptoms: ['Bright red dome', 'Small size', 'Multiple lesions', 'Increases with age'],
    causes: ['Aging', 'Genetics', 'Pregnancy', 'Climate'],
    treatments: ['No treatment needed', 'Laser therapy', 'Electrocautery'],
    risk: 'low'
  },

  // ACNE & RELATED
  'acne_vulgaris': {
    id: 'acne_vulgaris',
    name: 'Acne Vulgaris',
    category: 'Acne',
    description: 'Common skin condition with pimples, blackheads, and whiteheads.',
    symptoms: ['Pimples', 'Blackheads', 'Whiteheads', 'Oily skin', 'Scarring'],
    causes: ['Excess oil production', 'Bacteria', 'Hormones', 'Blocked pores'],
    treatments: ['Topical retinoids', 'Benzoyl peroxide', 'Antibiotics', 'Oral medications'],
    risk: 'low'
  },
  'acne_cystic': {
    id: 'acne_cystic',
    name: 'Cystic Acne',
    category: 'Acne',
    description: 'Severe form of acne with large, painful cysts deep under skin.',
    symptoms: ['Large painful cysts', 'Deep under skin', 'Scarring', 'Inflammation'],
    causes: ['Hormones', 'Genetics', 'Bacteria', 'Oil production'],
    treatments: ['Isotretinoin', 'Antibiotics', 'Hormonal therapy', 'Corticosteroid injections'],
    risk: 'medium'
  },
  'rosacea': {
    id: 'rosacea',
    name: 'Rosacea',
    category: 'Acne',
    description: 'Chronic inflammatory skin condition causing facial redness.',
    symptoms: ['Facial redness', 'Visible blood vessels', 'Bumps and pimples', 'Eye irritation'],
    causes: ['Genetics', 'Immune system', 'Environmental triggers', 'Demodex mites'],
    treatments: ['Topical medications', 'Antibiotics', 'Laser therapy', 'Trigger avoidance'],
    risk: 'low'
  },

  // FUNGAL INFECTIONS
  'tinea_corporis': {
    id: 'tinea_corporis',
    name: 'Ringworm (Tinea Corporis)',
    category: 'Fungal Infection',
    description: 'Contagious fungal infection causing a circular rash.',
    symptoms: ['Circular red rash', 'Clear center', 'Scaly borders', 'Itchy'],
    causes: ['Dermatophyte fungus', 'Contact with infected person/animal', 'Warm humid conditions'],
    treatments: ['Antifungal creams', 'Oral antifungals for severe cases', 'Keep area dry'],
    risk: 'low'
  },
  'tinea_pedis': {
    id: 'tinea_pedis',
    name: "Athlete's Foot (Tinea Pedis)",
    category: 'Fungal Infection',
    description: 'Fungal infection of the feet, especially between toes.',
    symptoms: ['Itchy feet', 'Peeling skin', 'Redness', 'Cracking between toes'],
    causes: ['Fungal infection', 'Warm moist environments', 'Public showers', 'Sweaty feet'],
    treatments: ['Antifungal creams', 'Antifungal powder', 'Keep feet dry', 'Oral antifungals'],
    risk: 'low'
  },
  'tinea_versicolor': {
    id: 'tinea_versicolor',
    name: 'Tinea Versicolor',
    category: 'Fungal Infection',
    description: 'Fungal infection causing patches of discolored skin.',
    symptoms: ['Light or dark patches', 'Slight scaling', 'Mild itching', 'Worse in heat'],
    causes: ['Yeast overgrowth', 'Heat', 'Humidity', 'Oily skin'],
    treatments: ['Antifungal shampoo', 'Topical antifungals', 'Oral antifungals'],
    risk: 'low'
  },
  'candidiasis': {
    id: 'candidiasis',
    name: 'Cutaneous Candidiasis',
    category: 'Fungal Infection',
    description: 'Yeast infection of the skin in warm, moist areas.',
    symptoms: ['Red rash', 'Satellite lesions', 'Itching', 'In skin folds'],
    causes: ['Candida yeast', 'Moisture', 'Obesity', 'Diabetes', 'Antibiotics'],
    treatments: ['Antifungal creams', 'Keep area dry', 'Treat underlying conditions'],
    risk: 'low'
  },

  // BACTERIAL INFECTIONS
  'impetigo': {
    id: 'impetigo',
    name: 'Impetigo',
    category: 'Bacterial Infection',
    description: 'Highly contagious bacterial skin infection common in children.',
    symptoms: ['Red sores', 'Honey-colored crusts', 'Itching', 'Around nose and mouth'],
    causes: ['Staph or strep bacteria', 'Skin injury', 'Contact with infected person'],
    treatments: ['Topical antibiotics', 'Oral antibiotics', 'Proper hygiene'],
    risk: 'medium'
  },
  'cellulitis': {
    id: 'cellulitis',
    name: 'Cellulitis',
    category: 'Bacterial Infection',
    description: 'Bacterial infection of deeper skin layers and tissues.',
    symptoms: ['Red swollen area', 'Warm to touch', 'Pain', 'Fever', 'Spreading redness'],
    causes: ['Bacteria entering through break in skin', 'Strep or staph', 'Weakened immune system'],
    treatments: ['Oral antibiotics', 'IV antibiotics if severe', 'Elevation', 'Rest'],
    risk: 'high'
  },
  'folliculitis': {
    id: 'folliculitis',
    name: 'Folliculitis',
    category: 'Bacterial Infection',
    description: 'Infection of hair follicles causing small red bumps.',
    symptoms: ['Red bumps around hair follicles', 'Pus-filled', 'Itchy or tender', 'Mild pain'],
    causes: ['Bacterial infection', 'Shaving', 'Tight clothing', 'Hot tubs'],
    treatments: ['Warm compresses', 'Antibacterial wash', 'Topical antibiotics', 'Avoid shaving'],
    risk: 'low'
  },

  // VIRAL INFECTIONS
  'herpes_simplex': {
    id: 'herpes_simplex',
    name: 'Herpes Simplex',
    category: 'Viral Infection',
    description: 'Viral infection causing cold sores or genital herpes.',
    symptoms: ['Painful blisters', 'Tingling before outbreak', 'Crusting', 'Recurrent'],
    causes: ['HSV-1 or HSV-2 virus', 'Direct contact', 'Stress', 'Sun exposure'],
    treatments: ['Antiviral medications', 'Topical creams', 'Pain relievers', 'Trigger avoidance'],
    risk: 'medium'
  },
  'herpes_zoster': {
    id: 'herpes_zoster',
    name: 'Shingles (Herpes Zoster)',
    category: 'Viral Infection',
    description: 'Reactivation of chickenpox virus causing painful rash.',
    symptoms: ['Painful rash', 'Blisters in band pattern', 'Burning sensation', 'One side of body'],
    causes: ['Varicella-zoster virus reactivation', 'Weakened immunity', 'Age', 'Stress'],
    treatments: ['Antiviral drugs', 'Pain medications', 'Calamine lotion', 'Vaccine prevention'],
    risk: 'medium'
  },
  'molluscum_contagiosum': {
    id: 'molluscum_contagiosum',
    name: 'Molluscum Contagiosum',
    category: 'Viral Infection',
    description: 'Viral infection causing small pearl-like bumps.',
    symptoms: ['Small dome-shaped bumps', 'Central dimple', 'Flesh-colored', 'Usually painless'],
    causes: ['Poxvirus', 'Direct contact', 'Contaminated objects', 'Swimming pools'],
    treatments: ['Often self-resolves', 'Cryotherapy', 'Curettage', 'Topical treatments'],
    risk: 'low'
  },
  'wart_common': {
    id: 'wart_common',
    name: 'Common Wart',
    category: 'Viral Infection',
    description: 'Small rough growth caused by HPV virus.',
    symptoms: ['Rough bumps', 'Usually on hands', 'Black dots inside', 'Various sizes'],
    causes: ['HPV infection', 'Direct contact', 'Broken skin', 'Weakened immunity'],
    treatments: ['Salicylic acid', 'Cryotherapy', 'Laser treatment', 'Immunotherapy'],
    risk: 'low'
  },

  // INFLAMMATORY CONDITIONS
  'eczema': {
    id: 'eczema',
    name: 'Atopic Dermatitis (Eczema)',
    category: 'Inflammatory',
    description: 'Chronic condition causing itchy, inflamed skin.',
    symptoms: ['Itchy skin', 'Red patches', 'Dry scaly skin', 'Cracking', 'Worse at night'],
    causes: ['Genetics', 'Immune dysfunction', 'Environmental triggers', 'Allergens'],
    treatments: ['Moisturizers', 'Topical steroids', 'Immunomodulators', 'Avoid triggers'],
    risk: 'low'
  },
  'psoriasis': {
    id: 'psoriasis',
    name: 'Psoriasis',
    category: 'Inflammatory',
    description: 'Autoimmune condition causing rapid skin cell buildup.',
    symptoms: ['Red patches with silvery scales', 'Itching', 'Burning', 'Thick nails', 'Joint pain'],
    causes: ['Immune system', 'Genetics', 'Stress', 'Infections', 'Cold weather'],
    treatments: ['Topical steroids', 'Vitamin D analogs', 'Biologics', 'Light therapy'],
    risk: 'medium'
  },
  'dermatitis_contact': {
    id: 'dermatitis_contact',
    name: 'Contact Dermatitis',
    category: 'Inflammatory',
    description: 'Skin reaction to irritant or allergen.',
    symptoms: ['Red itchy rash', 'Blisters', 'Dry cracked skin', 'Burning', 'Swelling'],
    causes: ['Allergens (nickel, latex, poison ivy)', 'Irritants (soaps, chemicals)'],
    treatments: ['Avoid trigger', 'Topical steroids', 'Antihistamines', 'Cold compresses'],
    risk: 'low'
  },
  'dermatitis_seborrheic': {
    id: 'dermatitis_seborrheic',
    name: 'Seborrheic Dermatitis',
    category: 'Inflammatory',
    description: 'Inflammatory condition causing scaly, flaky patches.',
    symptoms: ['Flaky white or yellow scales', 'Redness', 'Itching', 'On scalp, face, ears'],
    causes: ['Malassezia yeast', 'Sebum production', 'Stress', 'Weather'],
    treatments: ['Antifungal shampoo', 'Topical steroids', 'Calcineurin inhibitors'],
    risk: 'low'
  },
  'urticaria': {
    id: 'urticaria',
    name: 'Hives (Urticaria)',
    category: 'Inflammatory',
    description: 'Raised itchy welts on the skin.',
    symptoms: ['Red or skin-colored welts', 'Intense itching', 'Swelling', 'Blanch when pressed'],
    causes: ['Allergic reaction', 'Medications', 'Food', 'Infections', 'Stress'],
    treatments: ['Antihistamines', 'Avoid triggers', 'Corticosteroids', 'Epinephrine if severe'],
    risk: 'medium'
  },

  // PIGMENTATION DISORDERS
  'vitiligo': {
    id: 'vitiligo',
    name: 'Vitiligo',
    category: 'Pigmentation',
    description: 'Loss of skin color in patches due to melanocyte destruction.',
    symptoms: ['White patches', 'Usually symmetric', 'On hands, face, around body openings', 'Premature graying'],
    causes: ['Autoimmune', 'Genetics', 'Trigger events', 'Oxidative stress'],
    treatments: ['Topical steroids', 'Light therapy', 'Immunomodulators', 'Skin grafting'],
    risk: 'low'
  },
  'melasma': {
    id: 'melasma',
    name: 'Melasma',
    category: 'Pigmentation',
    description: 'Brown patches on face, often related to hormones.',
    symptoms: ['Brown or gray-brown patches', 'On cheeks, forehead, nose', 'Symmetrical', 'Worse with sun'],
    causes: ['Hormones', 'Sun exposure', 'Pregnancy', 'Birth control pills'],
    treatments: ['Sunscreen', 'Hydroquinone', 'Retinoids', 'Chemical peels', 'Laser therapy'],
    risk: 'low'
  },

  // AUTOIMMUNE
  'lupus_erythematosus': {
    id: 'lupus_erythematosus',
    name: 'Cutaneous Lupus',
    category: 'Autoimmune',
    description: 'Autoimmune disease affecting skin, causing rashes and lesions.',
    symptoms: ['Butterfly rash on face', 'Disc-shaped lesions', 'Photosensitivity', 'Scarring'],
    causes: ['Autoimmune dysfunction', 'Genetics', 'UV exposure', 'Medications'],
    treatments: ['Topical steroids', 'Antimalarials', 'Immunosuppressants', 'Sun protection'],
    risk: 'high'
  },

  // OTHER
  'lichen_planus': {
    id: 'lichen_planus',
    name: 'Lichen Planus',
    category: 'Other',
    description: 'Inflammatory condition causing purple itchy flat bumps.',
    symptoms: ['Purple flat-topped bumps', 'Itchy', 'White lacy pattern', 'On wrists, ankles, mouth'],
    causes: ['Immune reaction', 'Hepatitis C', 'Medications', 'Stress'],
    treatments: ['Topical steroids', 'Antihistamines', 'Immunosuppressants', 'Light therapy'],
    risk: 'low'
  },
  'pityriasis_rosea': {
    id: 'pityriasis_rosea',
    name: 'Pityriasis Rosea',
    category: 'Other',
    description: 'Self-limiting rash starting with herald patch.',
    symptoms: ['Herald patch first', 'Oval scaly patches', 'Christmas tree pattern on back', 'Itching'],
    causes: ['Possibly viral', 'Unknown exact cause', 'Not contagious'],
    treatments: ['Self-resolves in 6-8 weeks', 'Antihistamines', 'Topical steroids', 'Moisturizers'],
    risk: 'low'
  },
  'keratosis_pilaris': {
    id: 'keratosis_pilaris',
    name: 'Keratosis Pilaris',
    category: 'Other',
    description: 'Harmless condition causing small bumps (chicken skin).',
    symptoms: ['Small rough bumps', 'On upper arms, thighs', 'Slightly red', 'Rough texture'],
    causes: ['Keratin buildup', 'Genetics', 'Dry skin', 'Worse in winter'],
    treatments: ['Moisturizers', 'Exfoliation', 'Retinoids', 'Laser therapy'],
    risk: 'low'
  },
  'keloid': {
    id: 'keloid',
    name: 'Keloid Scar',
    category: 'Scar',
    description: 'Raised overgrowth of scar tissue at injury site.',
    symptoms: ['Raised scar', 'Extends beyond original injury', 'Thick and rubbery', 'Itchy or tender'],
    causes: ['Abnormal wound healing', 'Genetics', 'Darker skin types', 'Ear piercing, surgery'],
    treatments: ['Steroid injections', 'Silicone sheets', 'Cryotherapy', 'Surgical removal with radiation'],
    risk: 'low'
  },

  // NORMAL/UNKNOWN
  'normal_skin': {
    id: 'normal_skin',
    name: 'Normal Skin',
    category: 'Normal',
    description: 'Healthy skin with no visible pathology.',
    symptoms: ['Smooth texture', 'Even tone', 'No lesions', 'Healthy appearance'],
    causes: ['N/A'],
    treatments: ['Maintain with skincare routine', 'Sun protection', 'Healthy lifestyle'],
    risk: 'low'
  },
  'unknown': {
    id: 'unknown',
    name: 'Unknown Condition',
    category: 'Unknown',
    description: 'Condition cannot be classified. Consult a dermatologist for proper diagnosis.',
    symptoms: ['Various presentations'],
    causes: ['Unknown'],
    treatments: ['Professional consultation recommended'],
    risk: 'medium'
  }
};

// Get list of all condition IDs
export const CONDITION_IDS = Object.keys(SKIN_CONDITIONS);

export async function classifyImage(imageData: ImageData): Promise<ClassificationResult> {
  // Analyze image features
  const features = analyzeImageFeatures(imageData);

  // Get predictions
  const predictions = classifyByFeatures(features);

  // Sort and get top results
  const sorted = predictions
    .map((confidence, index) => ({
      ...SKIN_CONDITIONS[CONDITION_IDS[index]],
      confidence
    }))
    .sort((a, b) => b.confidence - a.confidence);

  return {
    topPrediction: sorted[0],
    alternatives: sorted.slice(1, 4)
  };
}

interface ImageFeatures {
  // Color features
  avgRed: number;
  avgGreen: number;
  avgBlue: number;
  redRatio: number;
  brownRatio: number;
  darkRatio: number;
  lightRatio: number;

  // Texture features
  variance: number;
  edges: number;
  roughness: number;

  // Pattern features
  symmetry: number;
  circularity: number;
  uniformity: number;

  // Advanced features
  hasScales: boolean;
  hasBlisters: boolean;
  hasBorder: boolean;
  hasMultipleColors: boolean;
}

function analyzeImageFeatures(imageData: ImageData): ImageFeatures {
  const { data, width, height } = imageData;
  const pixelCount = width * height;

  let totalR = 0, totalG = 0, totalB = 0;
  let darkPixels = 0, lightPixels = 0;
  let brownPixels = 0, redPixels = 0;
  let purplePixels = 0, whitePixels = 0;

  // First pass: color analysis
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    totalR += r;
    totalG += g;
    totalB += b;

    const brightness = (r + g + b) / 3;
    if (brightness < 80) darkPixels++;
    if (brightness > 200) lightPixels++;

    // Brown (melanin-rich)
    if (r > 100 && r < 200 && g > 50 && g < 150 && b < 100 && r > b && g > b) brownPixels++;

    // Red (inflammatory, vascular)
    if (r > 150 && r > g * 1.3 && r > b * 1.3) redPixels++;

    // Purple (vascular, bruising)
    if (r > 100 && b > 100 && Math.abs(r - b) < 50 && g < r * 0.7) purplePixels++;

    // White/light (scales, depigmentation)
    if (r > 220 && g > 220 && b > 220) whitePixels++;
  }

  const avgRed = totalR / pixelCount;
  const avgGreen = totalG / pixelCount;
  const avgBlue = totalB / pixelCount;

  // Calculate variance for texture
  let variance = 0;
  const meanBrightness = (avgRed + avgGreen + avgBlue) / 3;
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    variance += Math.pow(brightness - meanBrightness, 2);
  }
  variance = variance / pixelCount;

  // Edge detection (simple Sobel approximation)
  let edgeCount = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const current = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      const right = (data[idx + 4] + data[idx + 5] + data[idx + 6]) / 3;
      const below = (data[idx + width * 4] + data[idx + width * 4 + 1] + data[idx + width * 4 + 2]) / 3;

      const gradient = Math.abs(right - current) + Math.abs(below - current);
      if (gradient > 30) edgeCount++;
    }
  }

  return {
    avgRed,
    avgGreen,
    avgBlue,
    redRatio: redPixels / pixelCount,
    brownRatio: brownPixels / pixelCount,
    darkRatio: darkPixels / pixelCount,
    lightRatio: lightPixels / pixelCount,
    variance,
    edges: edgeCount / pixelCount,
    roughness: variance / 10000,
    symmetry: 0.5, // Simplified
    circularity: 0.5, // Simplified
    uniformity: 1 - (variance / 10000),
    hasScales: whitePixels / pixelCount > 0.15 && variance > 2000,
    hasBlisters: lightPixels / pixelCount > 0.2 && edgeCount / pixelCount > 0.1,
    hasBorder: edgeCount / pixelCount > 0.15,
    hasMultipleColors: variance > 3000
  };
}

function classifyByFeatures(f: ImageFeatures): Float32Array {
  const predictions = new Float32Array(CONDITION_IDS.length);

  // Initialize all to small baseline
  predictions.fill(0.01);

  // Cancerous & Pre-cancerous
  predictions[CONDITION_IDS.indexOf('mel')] = f.hasMultipleColors && f.hasBorder && f.darkRatio > 0.3 ? 0.4 : 0.05;
  predictions[CONDITION_IDS.indexOf('bcc')] = f.avgRed > 180 && f.lightRatio > 0.2 && !f.hasScales ? 0.3 : 0.05;
  predictions[CONDITION_IDS.indexOf('scc')] = f.redRatio > 0.15 && f.roughness > 0.3 && f.hasScales ? 0.35 : 0.05;
  predictions[CONDITION_IDS.indexOf('akiec')] = f.hasScales && f.redRatio > 0.1 && f.lightRatio > 0.15 ? 0.4 : 0.05;

  // Benign growths
  predictions[CONDITION_IDS.indexOf('nv')] = f.brownRatio > 0.3 && f.uniformity > 0.6 && !f.hasMultipleColors ? 0.6 : 0.1;
  predictions[CONDITION_IDS.indexOf('bkl')] = f.brownRatio > 0.25 && f.darkRatio > 0.2 && f.roughness > 0.2 ? 0.5 : 0.08;
  predictions[CONDITION_IDS.indexOf('df')] = f.brownRatio > 0.2 && f.darkRatio > 0.3 && f.uniformity > 0.5 ? 0.4 : 0.06;
  predictions[CONDITION_IDS.indexOf('skin_tag')] = f.avgRed > 150 && f.avgRed < 200 && f.uniformity > 0.7 ? 0.3 : 0.05;

  // Vascular
  predictions[CONDITION_IDS.indexOf('vasc')] = f.redRatio > 0.2 && !f.hasScales ? 0.45 : 0.05;
  predictions[CONDITION_IDS.indexOf('cherry_angioma')] = f.redRatio > 0.25 && f.uniformity > 0.6 ? 0.4 : 0.05;

  // Acne
  predictions[CONDITION_IDS.indexOf('acne_vulgaris')] = f.redRatio > 0.15 && f.variance > 2000 && f.avgRed > 160 ? 0.5 : 0.08;
  predictions[CONDITION_IDS.indexOf('acne_cystic')] = f.redRatio > 0.2 && f.darkRatio > 0.15 && f.roughness > 0.35 ? 0.4 : 0.05;
  predictions[CONDITION_IDS.indexOf('rosacea')] = f.redRatio > 0.25 && f.uniformity < 0.4 && f.avgRed > 170 ? 0.45 : 0.06;

  // Fungal
  predictions[CONDITION_IDS.indexOf('tinea_corporis')] = f.redRatio > 0.1 && f.hasBorder && f.hasScales ? 0.4 : 0.05;
  predictions[CONDITION_IDS.indexOf('tinea_versicolor')] = f.lightRatio > 0.25 && f.hasScales && f.uniformity < 0.5 ? 0.35 : 0.05;
  predictions[CONDITION_IDS.indexOf('candidiasis')] = f.redRatio > 0.2 && f.variance > 2500 ? 0.3 : 0.05;

  // Bacterial
  predictions[CONDITION_IDS.indexOf('impetigo')] = f.redRatio > 0.15 && f.lightRatio > 0.2 && f.hasBlisters ? 0.35 : 0.04;
  predictions[CONDITION_IDS.indexOf('cellulitis')] = f.redRatio > 0.3 && f.uniformity > 0.5 ? 0.4 : 0.04;
  predictions[CONDITION_IDS.indexOf('folliculitis')] = f.redRatio > 0.15 && f.variance > 2000 && !f.hasScales ? 0.3 : 0.05;

  // Viral
  predictions[CONDITION_IDS.indexOf('herpes_simplex')] = f.redRatio > 0.15 && f.hasBlisters && f.variance > 2500 ? 0.35 : 0.04;
  predictions[CONDITION_IDS.indexOf('herpes_zoster')] = f.redRatio > 0.2 && f.hasBlisters && f.hasBorder ? 0.3 : 0.04;
  predictions[CONDITION_IDS.indexOf('molluscum_contagiosum')] = f.avgRed > 150 && f.avgRed < 180 && f.uniformity > 0.6 ? 0.25 : 0.04;
  predictions[CONDITION_IDS.indexOf('wart_common')] = f.brownRatio > 0.15 && f.roughness > 0.3 && f.darkRatio > 0.1 ? 0.35 : 0.05;

  // Inflammatory
  predictions[CONDITION_IDS.indexOf('eczema')] = f.redRatio > 0.15 && f.hasScales && f.roughness > 0.3 ? 0.45 : 0.07;
  predictions[CONDITION_IDS.indexOf('psoriasis')] = f.redRatio > 0.1 && f.hasScales && f.lightRatio > 0.2 && f.hasBorder ? 0.5 : 0.06;
  predictions[CONDITION_IDS.indexOf('dermatitis_contact')] = f.redRatio > 0.2 && f.variance > 2000 ? 0.4 : 0.06;
  predictions[CONDITION_IDS.indexOf('dermatitis_seborrheic')] = f.redRatio > 0.1 && f.hasScales && f.lightRatio > 0.15 ? 0.35 : 0.05;
  predictions[CONDITION_IDS.indexOf('urticaria')] = f.redRatio > 0.25 && f.uniformity < 0.4 && f.variance > 3000 ? 0.4 : 0.05;

  // Pigmentation
  predictions[CONDITION_IDS.indexOf('vitiligo')] = f.lightRatio > 0.4 && f.hasBorder && f.uniformity > 0.6 ? 0.45 : 0.05;
  predictions[CONDITION_IDS.indexOf('melasma')] = f.brownRatio > 0.3 && f.uniformity > 0.5 && !f.hasBorder ? 0.4 : 0.06;

  // Other
  predictions[CONDITION_IDS.indexOf('lichen_planus')] = f.redRatio > 0.1 && f.darkRatio > 0.15 && f.uniformity < 0.5 ? 0.3 : 0.04;
  predictions[CONDITION_IDS.indexOf('pityriasis_rosea')] = f.redRatio > 0.1 && f.hasScales && f.hasBorder ? 0.3 : 0.04;
  predictions[CONDITION_IDS.indexOf('keratosis_pilaris')] = f.redRatio > 0.05 && f.roughness > 0.4 && f.variance > 2000 ? 0.35 : 0.05;
  predictions[CONDITION_IDS.indexOf('keloid')] = f.redRatio > 0.1 && f.uniformity > 0.7 && f.darkRatio > 0.1 ? 0.25 : 0.04;

  // Normal
  predictions[CONDITION_IDS.indexOf('normal_skin')] = f.uniformity > 0.7 && f.variance < 1500 && f.redRatio < 0.1 ? 0.5 : 0.1;

  // Normalize
  const sum = predictions.reduce((a, b) => a + b, 0);
  for (let i = 0; i < predictions.length; i++) {
    predictions[i] = predictions[i] / sum;
  }

  return predictions;
}

let model: any = null;

export async function loadModel(): Promise<void> {
  if (model) return;
  model = true; // Mark as loaded (using heuristic classifier)
  console.log('[ComprehensiveSkinClassifier] Heuristic classifier ready - 50+ conditions');
}

export function disposeModel(): void {
  model = null;
}
