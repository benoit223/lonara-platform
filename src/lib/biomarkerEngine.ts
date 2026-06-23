// ─────────────────────────────────────────────────────────────────────────────
// biomarkerEngine.ts
// Lonara Labs — Moteur d'interprétation des biomarqueurs scientifiques
//
// Rôle : reçoit les valeurs brutes des panels PreQuiz (1→8), les interprète
// selon des plages de référence cliniques, génère des ajustements de scores
// Engine A, des flags supplémentaires, et un contexte pour la narrative IA.
//
// Accès par niveau :
//   premium   → panels 1, 2, 3 (métabolique, hormonal, inflammation)
//   executive → tous les panels (1→8)
// ─────────────────────────────────────────────────────────────────────────────

export type BiomarkerStatus = 'optimal' | 'borderline' | 'elevated' | 'low' | 'critical'

export interface BiomarkerResult {
  key: string           // identifiant interne ex: 'ldl'
  label: string         // nom affiché ex: 'LDL Cholesterol'
  value: number         // valeur saisie
  unit: string          // unité ex: 'mg/dL'
  status: BiomarkerStatus
  panel: string         // 'metabolic' | 'hormonal' | 'inflammatory' | 'epigenetic' | 'telomere' | 'omics' | 'neuro' | 'cardio'
  category: string      // label affiché pour la catégorie
  impact: 'High' | 'Moderate' | 'Low'
  scoreImpact: {        // quels scores Engine A ajuster et de combien
    domain: string
    delta: number       // positif = améliore, négatif = dégrade
  }[]
  flagMessage?: string  // message de flag si critique/elevated
  flagSeverity?: 'critical' | 'warning'
}

export interface BiomarkerEngineOutput {
  results: BiomarkerResult[]
  scoreAdjustments: Record<string, number>   // domaine → delta total à appliquer
  additionalFlags: { message: string; severity: 'critical' | 'warning' }[]
  longevityScoreAdjustment: number           // delta sur le longevityScore global
  biologicalAgeAdjustment: number            // delta sur l'âge biologique (années)
  narrativeContext: string                   // texte injecté dans la narrative IA
  hasBiomarkers: boolean                     // true si au moins 1 valeur fournie
  panelsUsed: string[]                       // panels avec données
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAGES DE RÉFÉRENCE CLINIQUES
// Chaque marqueur : { optimal, borderlineHigh?, high?, low?, criticalHigh?, criticalLow? }
// Toutes les valeurs sont en mg/dL, mmol/L, ng/mL, etc. selon le standard clinique
// ─────────────────────────────────────────────────────────────────────────────

interface BiomarkerRef {
  label: string
  unit: string
  panel: string
  category: string
  impact: 'High' | 'Moderate' | 'Low'
  optimalMin?: number
  optimalMax?: number
  borderlineHighMin?: number
  borderlineHighMax?: number
  highMin?: number
  lowMax?: number         // en dessous = low
  criticalLowMax?: number
  criticalHighMin?: number
  scoreImpactDomains: { domain: string; direction: 'inverse' | 'direct' }[]
  // direction: 'inverse' = valeur haute → score bas (ex: CRP)
  //            'direct'  = valeur haute → score haut (ex: HDL)
}

const BIOMARKER_REFS: Record<string, BiomarkerRef> = {

  // ── PANEL 1 : MÉTABOLIQUE ─────────────────────────────────────────────────
  fastingGlucose: {
    label: 'Fasting Glucose',
    unit: 'mg/dL',
    panel: 'metabolic',
    category: 'Metabolic Panel',
    impact: 'High',
    optimalMin: 70, optimalMax: 85,
    borderlineHighMin: 86, borderlineHighMax: 99,
    highMin: 100,
    criticalHighMin: 126,
    lowMax: 69,
    criticalLowMax: 55,
    scoreImpactDomains: [
      { domain: 'longevity', direction: 'inverse' },
      { domain: 'energy', direction: 'inverse' },
      { domain: 'inflammation', direction: 'inverse' },
    ],
  },
  hba1c: {
    label: 'HbA1c',
    unit: '%',
    panel: 'metabolic',
    category: 'Metabolic Panel',
    impact: 'High',
    optimalMin: 4.6, optimalMax: 5.3,
    borderlineHighMin: 5.4, borderlineHighMax: 5.6,
    highMin: 5.7,
    criticalHighMin: 6.5,
    scoreImpactDomains: [
      { domain: 'longevity', direction: 'inverse' },
      { domain: 'inflammation', direction: 'inverse' },
      { domain: 'cardiovascular', direction: 'inverse' },
    ],
  },
  ldl: {
    label: 'LDL Cholesterol',
    unit: 'mg/dL',
    panel: 'metabolic',
    category: 'Metabolic Panel',
    impact: 'High',
    optimalMin: 0, optimalMax: 99,
    borderlineHighMin: 100, borderlineHighMax: 129,
    highMin: 130,
    criticalHighMin: 190,
    scoreImpactDomains: [
      { domain: 'cardiovascular', direction: 'inverse' },
      { domain: 'longevity', direction: 'inverse' },
    ],
  },
  hdl: {
    label: 'HDL Cholesterol',
    unit: 'mg/dL',
    panel: 'metabolic',
    category: 'Metabolic Panel',
    impact: 'High',
    optimalMin: 60, optimalMax: 120,
    borderlineHighMin: 40, borderlineHighMax: 59, // zone borderline = entre 40-59
    lowMax: 39,
    criticalLowMax: 30,
    scoreImpactDomains: [
      { domain: 'cardiovascular', direction: 'direct' },
      { domain: 'longevity', direction: 'direct' },
    ],
  },
  triglycerides: {
    label: 'Triglycerides',
    unit: 'mg/dL',
    panel: 'metabolic',
    category: 'Metabolic Panel',
    impact: 'High',
    optimalMin: 0, optimalMax: 100,
    borderlineHighMin: 101, borderlineHighMax: 150,
    highMin: 151,
    criticalHighMin: 500,
    scoreImpactDomains: [
      { domain: 'cardiovascular', direction: 'inverse' },
      { domain: 'inflammation', direction: 'inverse' },
    ],
  },
  apoB: {
    label: 'ApoB',
    unit: 'mg/dL',
    panel: 'metabolic',
    category: 'Metabolic Panel',
    impact: 'High',
    optimalMin: 0, optimalMax: 80,
    borderlineHighMin: 81, borderlineHighMax: 100,
    highMin: 101,
    criticalHighMin: 130,
    scoreImpactDomains: [
      { domain: 'cardiovascular', direction: 'inverse' },
      { domain: 'longevity', direction: 'inverse' },
    ],
  },

  // ── PANEL 2 : HORMONAL ────────────────────────────────────────────────────
  igf1: {
    label: 'IGF-1',
    unit: 'ng/mL',
    panel: 'hormonal',
    category: 'Hormonal Panel',
    impact: 'Moderate',
    optimalMin: 150, optimalMax: 250,
    lowMax: 100,
    criticalLowMax: 70,
    highMin: 350,
    criticalHighMin: 500,
    scoreImpactDomains: [
      { domain: 'longevity', direction: 'direct' },
      { domain: 'energy', direction: 'direct' },
      { domain: 'recovery', direction: 'direct' },
    ],
  },
  insulin: {
    label: 'Insulin (Fasting)',
    unit: 'µIU/mL',
    panel: 'hormonal',
    category: 'Hormonal Panel',
    impact: 'High',
    optimalMin: 2, optimalMax: 7,
    borderlineHighMin: 8, borderlineHighMax: 14,
    highMin: 15,
    criticalHighMin: 25,
    scoreImpactDomains: [
      { domain: 'longevity', direction: 'inverse' },
      { domain: 'energy', direction: 'inverse' },
      { domain: 'inflammation', direction: 'inverse' },
    ],
  },
  testosterone: {
    label: 'Testosterone',
    unit: 'ng/dL',
    panel: 'hormonal',
    category: 'Hormonal Panel',
    impact: 'Moderate',
    optimalMin: 500, optimalMax: 900,
    borderlineHighMin: 400, borderlineHighMax: 499,
    lowMax: 300,
    criticalLowMax: 200,
    scoreImpactDomains: [
      { domain: 'energy', direction: 'direct' },
      { domain: 'recovery', direction: 'direct' },
      { domain: 'resilience', direction: 'direct' },
    ],
  },
  dheas: {
    label: 'DHEA-S',
    unit: 'µg/dL',
    panel: 'hormonal',
    category: 'Hormonal Panel',
    impact: 'Moderate',
    optimalMin: 200, optimalMax: 400,
    lowMax: 100,
    criticalLowMax: 60,
    scoreImpactDomains: [
      { domain: 'longevity', direction: 'direct' },
      { domain: 'resilience', direction: 'direct' },
    ],
  },
  tsh: {
    label: 'TSH',
    unit: 'mIU/L',
    panel: 'hormonal',
    category: 'Hormonal Panel',
    impact: 'Moderate',
    optimalMin: 0.5, optimalMax: 2.0,
    borderlineHighMin: 2.1, borderlineHighMax: 4.0,
    highMin: 4.1,
    criticalHighMin: 10,
    lowMax: 0.4,
    criticalLowMax: 0.1,
    scoreImpactDomains: [
      { domain: 'energy', direction: 'inverse' },
      { domain: 'sleep', direction: 'inverse' },
      { domain: 'cognition', direction: 'inverse' },
    ],
  },
  vitaminD: {
    label: 'Vitamin D (25-OH)',
    unit: 'ng/mL',
    panel: 'hormonal',
    category: 'Hormonal Panel',
    impact: 'High',
    optimalMin: 50, optimalMax: 80,
    borderlineHighMin: 30, borderlineHighMax: 49,
    lowMax: 29,
    criticalLowMax: 19,
    scoreImpactDomains: [
      { domain: 'immune', direction: 'direct' },
      { domain: 'inflammation', direction: 'direct' },
      { domain: 'longevity', direction: 'direct' },
    ],
  },
  homocysteine: {
    label: 'Homocysteine',
    unit: 'µmol/L',
    panel: 'hormonal',
    category: 'Hormonal Panel',
    impact: 'High',
    optimalMin: 0, optimalMax: 9,
    borderlineHighMin: 10, borderlineHighMax: 14,
    highMin: 15,
    criticalHighMin: 20,
    scoreImpactDomains: [
      { domain: 'cardiovascular', direction: 'inverse' },
      { domain: 'cognition', direction: 'inverse' },
      { domain: 'longevity', direction: 'inverse' },
    ],
  },

  // ── PANEL 3 : INFLAMMATION ────────────────────────────────────────────────
  hsCRP: {
    label: 'hs-CRP',
    unit: 'mg/L',
    panel: 'inflammatory',
    category: 'Inflammatory Panel',
    impact: 'High',
    optimalMin: 0, optimalMax: 0.5,
    borderlineHighMin: 0.6, borderlineHighMax: 1.0,
    highMin: 1.1,
    criticalHighMin: 3.0,
    scoreImpactDomains: [
      { domain: 'inflammation', direction: 'inverse' },
      { domain: 'longevity', direction: 'inverse' },
      { domain: 'cardiovascular', direction: 'inverse' },
    ],
  },
  il6: {
    label: 'IL-6',
    unit: 'pg/mL',
    panel: 'inflammatory',
    category: 'Inflammatory Panel',
    impact: 'High',
    optimalMin: 0, optimalMax: 1.8,
    borderlineHighMin: 1.9, borderlineHighMax: 3.0,
    highMin: 3.1,
    criticalHighMin: 7.0,
    scoreImpactDomains: [
      { domain: 'inflammation', direction: 'inverse' },
      { domain: 'longevity', direction: 'inverse' },
      { domain: 'immune', direction: 'inverse' },
    ],
  },
  tnfAlpha: {
    label: 'TNF-alpha',
    unit: 'pg/mL',
    panel: 'inflammatory',
    category: 'Inflammatory Panel',
    impact: 'Moderate',
    optimalMin: 0, optimalMax: 2.8,
    borderlineHighMin: 2.9, borderlineHighMax: 5.0,
    highMin: 5.1,
    criticalHighMin: 10,
    scoreImpactDomains: [
      { domain: 'inflammation', direction: 'inverse' },
      { domain: 'immune', direction: 'inverse' },
    ],
  },
  ferritin: {
    label: 'Ferritin',
    unit: 'ng/mL',
    panel: 'inflammatory',
    category: 'Inflammatory Panel',
    impact: 'Moderate',
    optimalMin: 50, optimalMax: 150,
    borderlineHighMin: 151, borderlineHighMax: 300,
    highMin: 301,
    criticalHighMin: 500,
    lowMax: 30,
    criticalLowMax: 15,
    scoreImpactDomains: [
      { domain: 'energy', direction: 'direct' }, // low = fatigue
      { domain: 'inflammation', direction: 'inverse' }, // high = inflammation
    ],
  },

  // ── PANEL 4 : ÉPIGÉNÉTIQUE ────────────────────────────────────────────────
  horvath: {
    label: 'Horvath Clock',
    unit: 'years',
    panel: 'epigenetic',
    category: 'Epigenetic Aging',
    impact: 'High',
    // interprété en delta vs âge chronologique — traité séparément
    scoreImpactDomains: [
      { domain: 'longevity', direction: 'inverse' },
    ],
  },
  phenoAge: {
    label: 'PhenoAge',
    unit: 'years',
    panel: 'epigenetic',
    category: 'Epigenetic Aging',
    impact: 'High',
    scoreImpactDomains: [
      { domain: 'longevity', direction: 'inverse' },
      { domain: 'inflammation', direction: 'inverse' },
    ],
  },
  grimAge: {
    label: 'GrimAge',
    unit: 'years',
    panel: 'epigenetic',
    category: 'Epigenetic Aging',
    impact: 'High',
    scoreImpactDomains: [
      { domain: 'longevity', direction: 'inverse' },
      { domain: 'cardiovascular', direction: 'inverse' },
    ],
  },
  dunedinPACE: {
    label: 'DunedinPACE',
    unit: 'pace',
    panel: 'epigenetic',
    category: 'Epigenetic Aging',
    impact: 'High',
    optimalMin: 0.6, optimalMax: 0.85,
    borderlineHighMin: 0.86, borderlineHighMax: 1.0,
    highMin: 1.01,
    criticalHighMin: 1.2,
    scoreImpactDomains: [
      { domain: 'longevity', direction: 'inverse' },
      { domain: 'resilience', direction: 'inverse' },
    ],
  },

  // ── PANEL 5 : TÉLOMÈRES ───────────────────────────────────────────────────
  telomereQPCR: {
    label: 'Telomere Length (qPCR)',
    unit: 'T/S ratio',
    panel: 'telomere',
    category: 'Telomere Biology',
    impact: 'High',
    optimalMin: 1.2, optimalMax: 2.5,
    borderlineHighMin: 0.9, borderlineHighMax: 1.19,
    lowMax: 0.89,
    criticalLowMax: 0.7,
    scoreImpactDomains: [
      { domain: 'longevity', direction: 'direct' },
      { domain: 'resilience', direction: 'direct' },
    ],
  },
  telomereFISH: {
    label: 'Telomere Length (FISH)',
    unit: 'kb',
    panel: 'telomere',
    category: 'Telomere Biology',
    impact: 'Moderate',
    optimalMin: 7.5, optimalMax: 12,
    borderlineHighMin: 5.5, borderlineHighMax: 7.4,
    lowMax: 5.4,
    criticalLowMax: 4.0,
    scoreImpactDomains: [
      { domain: 'longevity', direction: 'direct' },
    ],
  },
  telomeraseActivity: {
    label: 'Telomerase Activity',
    unit: 'amoles/µg',
    panel: 'telomere',
    category: 'Telomere Biology',
    impact: 'Moderate',
    optimalMin: 4, optimalMax: 15,
    lowMax: 2,
    criticalLowMax: 1,
    scoreImpactDomains: [
      { domain: 'longevity', direction: 'direct' },
      { domain: 'recovery', direction: 'direct' },
    ],
  },

  // ── PANEL 6 : MULTI-OMICS ─────────────────────────────────────────────────
  // Ces marqueurs sont qualitatifs / scores — on les accepte comme scores 0-100
  proteomics: {
    label: 'Proteomics Score',
    unit: 'score',
    panel: 'omics',
    category: 'Multi-Omics',
    impact: 'High',
    optimalMin: 75, optimalMax: 100,
    borderlineHighMin: 50, borderlineHighMax: 74,
    lowMax: 49,
    criticalLowMax: 25,
    scoreImpactDomains: [
      { domain: 'longevity', direction: 'direct' },
      { domain: 'recovery', direction: 'direct' },
    ],
  },
  metabolomics: {
    label: 'Metabolomics Score',
    unit: 'score',
    panel: 'omics',
    category: 'Multi-Omics',
    impact: 'High',
    optimalMin: 75, optimalMax: 100,
    borderlineHighMin: 50, borderlineHighMax: 74,
    lowMax: 49,
    criticalLowMax: 25,
    scoreImpactDomains: [
      { domain: 'energy', direction: 'direct' },
      { domain: 'inflammation', direction: 'direct' },
    ],
  },
  microbiome: {
    label: 'Microbiome Score',
    unit: 'score',
    panel: 'omics',
    category: 'Multi-Omics',
    impact: 'Moderate',
    optimalMin: 75, optimalMax: 100,
    borderlineHighMin: 50, borderlineHighMax: 74,
    lowMax: 49,
    criticalLowMax: 25,
    scoreImpactDomains: [
      { domain: 'gut', direction: 'direct' },
      { domain: 'immune', direction: 'direct' },
      { domain: 'inflammation', direction: 'direct' },
    ],
  },
  gwasSNP: {
    label: 'GWAS / SNP Risk Score',
    unit: 'score',
    panel: 'omics',
    category: 'Multi-Omics',
    impact: 'Moderate',
    // score de risque : bas = bien
    optimalMin: 0, optimalMax: 25,
    borderlineHighMin: 26, borderlineHighMax: 49,
    highMin: 50,
    criticalHighMin: 75,
    scoreImpactDomains: [
      { domain: 'longevity', direction: 'inverse' },
    ],
  },

  // ── PANEL 7 : NEURO ───────────────────────────────────────────────────────
  gfap: {
    label: 'GFAP',
    unit: 'pg/mL',
    panel: 'neuro',
    category: 'Neurodegenerative Markers',
    impact: 'High',
    optimalMin: 0, optimalMax: 80,
    borderlineHighMin: 81, borderlineHighMax: 150,
    highMin: 151,
    criticalHighMin: 300,
    scoreImpactDomains: [
      { domain: 'cognition', direction: 'inverse' },
      { domain: 'longevity', direction: 'inverse' },
    ],
  },
  nfl: {
    label: 'NfL (Neurofilament Light)',
    unit: 'pg/mL',
    panel: 'neuro',
    category: 'Neurodegenerative Markers',
    impact: 'High',
    optimalMin: 0, optimalMax: 10,
    borderlineHighMin: 11, borderlineHighMax: 25,
    highMin: 26,
    criticalHighMin: 50,
    scoreImpactDomains: [
      { domain: 'cognition', direction: 'inverse' },
      { domain: 'longevity', direction: 'inverse' },
    ],
  },
  amyloidBeta: {
    label: 'Amyloid Beta 42/40',
    unit: 'ratio',
    panel: 'neuro',
    category: 'Neurodegenerative Markers',
    impact: 'High',
    // ratio : plus haut = mieux (>0.1 optimal)
    optimalMin: 0.10, optimalMax: 0.20,
    borderlineHighMin: 0.08, borderlineHighMax: 0.099,
    lowMax: 0.079,
    criticalLowMax: 0.05,
    scoreImpactDomains: [
      { domain: 'cognition', direction: 'direct' },
      { domain: 'longevity', direction: 'direct' },
    ],
  },
  pTau217: {
    label: 'pTau-217',
    unit: 'pg/mL',
    panel: 'neuro',
    category: 'Neurodegenerative Markers',
    impact: 'High',
    optimalMin: 0, optimalMax: 0.2,
    borderlineHighMin: 0.21, borderlineHighMax: 0.5,
    highMin: 0.51,
    criticalHighMin: 1.0,
    scoreImpactDomains: [
      { domain: 'cognition', direction: 'inverse' },
      { domain: 'longevity', direction: 'inverse' },
    ],
  },

  // ── PANEL 8 : CARDIO AVANCÉ ───────────────────────────────────────────────
  ntProBNP: {
    label: 'NT-proBNP',
    unit: 'pg/mL',
    panel: 'cardio',
    category: 'Advanced Cardiovascular',
    impact: 'High',
    optimalMin: 0, optimalMax: 125,
    borderlineHighMin: 126, borderlineHighMax: 300,
    highMin: 301,
    criticalHighMin: 900,
    scoreImpactDomains: [
      { domain: 'cardiovascular', direction: 'inverse' },
      { domain: 'longevity', direction: 'inverse' },
    ],
  },
  lpa: {
    label: 'Lp(a)',
    unit: 'mg/dL',
    panel: 'cardio',
    category: 'Advanced Cardiovascular',
    impact: 'High',
    optimalMin: 0, optimalMax: 30,
    borderlineHighMin: 31, borderlineHighMax: 50,
    highMin: 51,
    criticalHighMin: 75,
    scoreImpactDomains: [
      { domain: 'cardiovascular', direction: 'inverse' },
      { domain: 'longevity', direction: 'inverse' },
    ],
  },
  cacScore: {
    label: 'CAC Score',
    unit: 'AU',
    panel: 'cardio',
    category: 'Advanced Cardiovascular',
    impact: 'High',
    optimalMin: 0, optimalMax: 0,     // 0 = optimal
    borderlineHighMin: 1, borderlineHighMax: 100,
    highMin: 101,
    criticalHighMin: 400,
    scoreImpactDomains: [
      { domain: 'cardiovascular', direction: 'inverse' },
      { domain: 'longevity', direction: 'inverse' },
    ],
  },
  gdf15: {
    label: 'GDF-15',
    unit: 'pg/mL',
    panel: 'cardio',
    category: 'Advanced Cardiovascular',
    impact: 'High',
    optimalMin: 0, optimalMax: 1200,
    borderlineHighMin: 1201, borderlineHighMax: 1800,
    highMin: 1801,
    criticalHighMin: 3000,
    scoreImpactDomains: [
      { domain: 'longevity', direction: 'inverse' },
      { domain: 'cardiovascular', direction: 'inverse' },
      { domain: 'inflammation', direction: 'inverse' },
    ],
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// MARQUEURS AUTORISÉS PAR NIVEAU
//
// guest / member  → aucun biomarqueur (champs toujours désactivés)
// premium         → 12 marqueurs prise de sang standard (labo accessible ~150-300€)
// executive       → tous les 40 marqueurs (labs spécialisés)
// ─────────────────────────────────────────────────────────────────────────────

const MARKERS_BY_TIER: Record<string, Set<string>> = {
  guest:  new Set<string>([]),
  member: new Set<string>([]),

  // ── PREMIUM : prise de sang standard en clinique/labo accessible ──────────
  premium: new Set<string>([
    // Panel 1 — Métabolique standard (6)
    'fastingGlucose',
    'hba1c',
    'ldl',
    'hdl',
    'triglycerides',
    'apoB',
    // Panel 2 — Hormonal de base (4)
    'tsh',
    'vitaminD',
    'testosterone',
    'homocysteine',
    // Panel 3 — Inflammation de base (2)
    'hsCRP',
    'ferritin',
  ]),

  // ── EXECUTIVE : tous les marqueurs (40) ───────────────────────────────────
  executive: new Set<string>([
    // Panel 1 — Métabolique (6)
    'fastingGlucose', 'hba1c', 'ldl', 'hdl', 'triglycerides', 'apoB',
    // Panel 2 — Hormonal complet (7)
    'tsh', 'vitaminD', 'testosterone', 'homocysteine',
    'igf1', 'insulin', 'dheas',
    // Panel 3 — Inflammation complète (4)
    'hsCRP', 'ferritin', 'il6', 'tnfAlpha',
    // Panel 4 — Épigénétique (4)
    'horvath', 'phenoAge', 'grimAge', 'dunedinPACE',
    // Panel 5 — Télomères (3)
    'telomereQPCR', 'telomereFISH', 'telomeraseActivity',
    // Panel 6 — Multi-omics (4)
    'proteomics', 'metabolomics', 'microbiome', 'gwasSNP',
    // Panel 7 — Neuro (4)
    'gfap', 'nfl', 'amyloidBeta', 'pTau217',
    // Panel 8 — Cardio avancé (4)
    'ntProBNP', 'lpa', 'cacScore', 'gdf15',
  ]),
}

// ─────────────────────────────────────────────────────────────────────────────
// FONCTION PRINCIPALE
// ─────────────────────────────────────────────────────────────────────────────

export function interpretBiomarkers(
  raw: Record<string, string | number | undefined>,
  memberTier: 'guest' | 'member' | 'premium' | 'executive',
  chronologicalAge: number,
  healthConditions?: Array<{
    condition_key: string
    condition_label: string
    category: string
    severity: string
    family_history: boolean
  }>,
): BiomarkerEngineOutput {

  const allowedMarkers = MARKERS_BY_TIER[memberTier] ?? new Set<string>()
  const results: BiomarkerResult[] = []
  const scoreAdjustments: Record<string, number> = {}
  const additionalFlags: { message: string; severity: 'critical' | 'warning' }[] = []
  const panelsUsed = new Set<string>()

  let longevityScoreAdjustment = 0
  let biologicalAgeAdjustment = 0
  const narrativeParts: string[] = []

  // ── AJUSTEMENTS DE SEUILS SELON CONDITIONS ────────────────────────────────
  // Copie locale des refs pour ajustements sans modifier les refs globales
  const adjustedRefs: Record<string, BiomarkerRef> = {}
  const conditionKeys = new Set((healthConditions ?? []).map(c => c.condition_key))
  const hasCondition = (...keys: string[]) => keys.some(k => conditionKeys.has(k))

  // APOE4 ou family Alzheimer → amyloidBeta plus sensible
  if (hasCondition('apoe4', 'family_alzheimer')) {
    adjustedRefs['amyloidBeta'] = {
      ...BIOMARKER_REFS['amyloidBeta'],
      criticalLowMax: 0.07,  // était 0.05
      lowMax: 0.09,          // était 0.079
      borderlineHighMax: 0.109, // était 0.099
    }
    // pTau217 plus sensible aussi
    adjustedRefs['pTau217'] = {
      ...BIOMARKER_REFS['pTau217'],
      borderlineHighMin: 0.15,  // était 0.21
      borderlineHighMax: 0.35,  // était 0.5
      highMin: 0.36,            // était 0.51
      criticalHighMin: 0.7,     // était 1.0
    }
  }

  // Cardiovasculaire familial ou hypertension → apoB et lpa plus sensibles
  if (hasCondition('family_cardiovascular', 'hypertension', 'atherosclerosis')) {
    adjustedRefs['apoB'] = {
      ...BIOMARKER_REFS['apoB'],
      optimalMax: 70,           // était 80
      borderlineHighMin: 71,    // était 81
      borderlineHighMax: 90,    // était 100
      highMin: 91,              // était 101
      criticalHighMin: 110,     // était 130
    }
    adjustedRefs['lpa'] = {
      ...BIOMARKER_REFS['lpa'],
      optimalMax: 20,           // était 30
      borderlineHighMin: 21,    // était 31
      borderlineHighMax: 35,    // était 50
      highMin: 36,              // était 51
      criticalHighMin: 55,      // était 75
    }
  }

  // Diabète ou résistance insuline → glucose et HbA1c plus sensibles
  if (hasCondition('type2_diabetes', 'insulin_resistance', 'metabolic_syndrome')) {
    adjustedRefs['fastingGlucose'] = {
      ...BIOMARKER_REFS['fastingGlucose'],
      optimalMax: 80,           // était 85
      borderlineHighMin: 81,    // était 86
      highMin: 95,              // était 100
      criticalHighMin: 110,     // était 126
    }
    adjustedRefs['hba1c'] = {
      ...BIOMARKER_REFS['hba1c'],
      optimalMax: 5.1,          // était 5.3
      borderlineHighMin: 5.2,   // était 5.4
      highMin: 5.5,             // était 5.7
      criticalHighMin: 6.0,     // était 6.5
    }
  }

  // Inflammation chronique ou autoimmune → hsCRP et IL-6 plus sensibles
  if (hasCondition('chronic_inflammation', 'autoimmune', 'rheumatoid_arthritis', 'lupus', 'crohn')) {
    adjustedRefs['hsCRP'] = {
      ...BIOMARKER_REFS['hsCRP'],
      optimalMax: 0.3,          // était 0.5
      borderlineHighMin: 0.4,   // était 0.6
      borderlineHighMax: 0.8,   // était 1.0
      highMin: 0.9,             // était 1.1
      criticalHighMin: 2.0,     // était 3.0
    }
    adjustedRefs['il6'] = {
      ...BIOMARKER_REFS['il6'],
      optimalMax: 1.2,          // était 1.8
      borderlineHighMin: 1.3,   // était 1.9
      criticalHighMin: 5.0,     // était 7.0
    }
  }

  // Fonction helper — utilise le ref ajusté si disponible, sinon le ref global
  const getRef = (key: string): BiomarkerRef =>
    adjustedRefs[key] ?? BIOMARKER_REFS[key]

  // ── Itérer sur chaque marqueur défini ─────────────────────────────────────
  for (const [key] of Object.entries(BIOMARKER_REFS)) {
    const ref = getRef(key)

    // Vérifier accès au marqueur selon le niveau
    if (!allowedMarkers.has(key)) continue

    // Récupérer la valeur brute
    const rawVal = raw[key]
    if (rawVal === undefined || rawVal === null || rawVal === '') continue
    const value = typeof rawVal === 'string' ? parseFloat(rawVal) : rawVal
    if (isNaN(value)) continue
    if (value <= 0) continue  // ignore 0 et négatifs
    if (value > 100000) continue  // ignore valeurs aberrantes

    panelsUsed.add(ref.panel)

    // ── Cas spécial : marqueurs épigénétiques (delta vs âge chronologique) ──
    if (['horvath', 'phenoAge', 'grimAge'].includes(key)) {
      const delta = value - chronologicalAge
      const status: BiomarkerStatus =
        delta <= -5 ? 'optimal'
        : delta <= 0 ? 'borderline'
        : delta <= 5 ? 'elevated'
        : 'critical'

      const scoreImpact = computeEpigeneticImpact(delta, ref.scoreImpactDomains)

      // Ajustement âge biologique
      biologicalAgeAdjustment += delta * 0.25 // pondéré car 3 marqueurs

      Object.entries(scoreImpact).forEach(([domain, delta]) => {
        scoreAdjustments[domain] = (scoreAdjustments[domain] ?? 0) + delta
      })

      longevityScoreAdjustment += delta <= 0 ? 2 : delta <= 5 ? -3 : -7

      if (status === 'critical' || status === 'elevated') {
        additionalFlags.push({
          message: `${ref.label} indicates accelerated aging (+${delta.toFixed(1)} years)`,
          severity: status === 'critical' ? 'critical' : 'warning',
        })
        narrativeParts.push(`${ref.label} reveals a biological age ${delta.toFixed(0)} years above chronological age`)
      }

      results.push({
        key, label: ref.label, value, unit: ref.unit,
        status, panel: ref.panel, category: ref.category,
        impact: ref.impact,
        scoreImpact: Object.entries(scoreImpact).map(([domain, delta]) => ({ domain, delta })),
        ...(status !== 'optimal' && {
          flagMessage: `${ref.label}: ${delta > 0 ? '+' : ''}${delta.toFixed(1)} yrs vs chronological`,
          flagSeverity: status === 'critical' ? 'critical' : 'warning',
        }),
      })
      continue
    }

    // ── Calcul du statut standard ─────────────────────────────────────────
    const status = computeStatus(value, ref)
    const scoreImpact = computeScoreImpact(value, status, ref)

    Object.entries(scoreImpact).forEach(([domain, delta]) => {
      scoreAdjustments[domain] = (scoreAdjustments[domain] ?? 0) + delta
    })

    // Impact sur longevityScore global
    const longevityDomains = ref.scoreImpactDomains.filter(d => d.domain === 'longevity')
    if (longevityDomains.length > 0) {
      const statusMultiplier = status === 'optimal' ? 1.5
        : status === 'borderline' ? 0
        : status === 'elevated' ? -2
        : status === 'low' ? -2
        : -5 // critical
      longevityScoreAdjustment += statusMultiplier
    }

    // Flags si anormal
    if (status === 'critical' || status === 'elevated') {
      const flagMsg = generateFlagMessage(key, value, status, ref)
      additionalFlags.push({
        message: flagMsg,
        severity: status === 'critical' ? 'critical' : 'warning',
      })
      narrativeParts.push(generateNarrativePart(key, value, status, ref))
    } else if (status === 'low') {
      const flagMsg = generateFlagMessage(key, value, 'low', ref)
      additionalFlags.push({ message: flagMsg, severity: 'warning' })
      narrativeParts.push(generateNarrativePart(key, value, 'low', ref))
    }

    results.push({
      key, label: ref.label, value, unit: ref.unit,
      status, panel: ref.panel, category: ref.category,
      impact: ref.impact,
      scoreImpact: Object.entries(scoreImpact).map(([domain, delta]) => ({ domain, delta })),
      ...(status !== 'optimal' && {
        flagMessage: generateFlagMessage(key, value, status, ref),
        flagSeverity: status === 'critical' ? 'critical' : 'warning',
      }),
    })
  }

  // Clamp adjustments : max ±20 par domaine, max ±15 sur longevityScore
  Object.keys(scoreAdjustments).forEach(domain => {
    scoreAdjustments[domain] = Math.max(-20, Math.min(20, scoreAdjustments[domain]))
  })
  longevityScoreAdjustment = Math.max(-15, Math.min(10, longevityScoreAdjustment))
  biologicalAgeAdjustment = Math.max(-5, Math.min(10, biologicalAgeAdjustment))

  return {
    results,
    scoreAdjustments,
    additionalFlags,
    longevityScoreAdjustment: Math.round(longevityScoreAdjustment),
    biologicalAgeAdjustment: Math.round(biologicalAgeAdjustment * 10) / 10,
    narrativeContext: narrativeParts.slice(0, 4).join('; '),
    hasBiomarkers: results.length > 0,
    panelsUsed: Array.from(panelsUsed),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS INTERNES
// ─────────────────────────────────────────────────────────────────────────────

function computeStatus(value: number, ref: BiomarkerRef): BiomarkerStatus {

  // Critical LOW
  if (ref.criticalLowMax !== undefined && value <= ref.criticalLowMax) return 'critical'
  // Critical HIGH
  if (ref.criticalHighMin !== undefined && value >= ref.criticalHighMin) return 'critical'
  // Low
  if (ref.lowMax !== undefined && value <= ref.lowMax) return 'low'
  // High
  if (ref.highMin !== undefined && value >= ref.highMin) return 'elevated'
  // Borderline HIGH
  if (ref.borderlineHighMin !== undefined && ref.borderlineHighMax !== undefined
    && value >= ref.borderlineHighMin && value <= ref.borderlineHighMax) return 'borderline'
  // Optimal range
  if (ref.optimalMin !== undefined && ref.optimalMax !== undefined
    && value >= ref.optimalMin && value <= ref.optimalMax) return 'optimal'

  return 'borderline'
}

function computeScoreImpact(
  value: number,
  status: BiomarkerStatus,
  ref: BiomarkerRef,
): Record<string, number> {
  const result: Record<string, number> = {}

  const magnitude = status === 'optimal' ? 3
    : status === 'borderline' ? 0
    : status === 'elevated' ? -4
    : status === 'low' ? -4
    : -8 // critical
    
ref.scoreImpactDomains.forEach(({ domain, direction }) => {
  if (direction === 'inverse') {
    // Valeur haute = mauvais : elevated/critical/low → pénalité, optimal → bonus
    result[domain] = status === 'optimal' ? magnitude : -magnitude
  } else {
    // Valeur haute = bon (HDL, IGF-1, testosterone, vitaminD, télomères...)
    // low/critical = manque → pénalité, optimal/elevated = abondance → bonus
    result[domain] = (status === 'low' || status === 'critical')
      ? -Math.abs(magnitude)
      : Math.abs(magnitude)
  }
})

  return result
}

function computeEpigeneticImpact(
  delta: number,
  domains: { domain: string; direction: 'inverse' | 'direct' }[],
): Record<string, number> {
  const result: Record<string, number> = {}
  const magnitude = delta <= -5 ? 4
    : delta <= 0 ? 1
    : delta <= 5 ? -4
    : -8

  domains.forEach(({ domain }) => {
    result[domain] = magnitude
  })
  return result
}

function generateFlagMessage(
  key: string,
  value: number,
  status: BiomarkerStatus,
  ref: BiomarkerRef,
): string {
  const messages: Record<string, Record<string, string>> = {
    hsCRP:        { critical: 'Critical systemic inflammation detected (hs-CRP)', elevated: 'Elevated inflammatory load (hs-CRP)' },
    ldl:          { critical: 'Critically elevated LDL — immediate cardiovascular risk', elevated: 'Elevated LDL cholesterol' },
    hdl:          { low: 'Low HDL — reduced cardiovascular protection', critical: 'Critically low HDL' },
    fastingGlucose: { critical: 'Fasting glucose meets diabetic threshold', elevated: 'Elevated fasting glucose — insulin resistance risk' },
    hba1c:        { critical: 'HbA1c indicates uncontrolled glycemia', elevated: 'Elevated HbA1c — metabolic dysregulation' },
    vitaminD:     { low: 'Vitamin D deficiency — immune and inflammatory risk', critical: 'Severe Vitamin D deficiency' },
    homocysteine: { critical: 'Critical homocysteine — cardiovascular & neuro risk', elevated: 'Elevated homocysteine' },
    tsh:          { critical: 'Thyroid dysfunction detected (TSH)', elevated: 'Suboptimal TSH — thyroid underperformance' },
    testosterone: { low: 'Low testosterone — energy and recovery impact', critical: 'Critically low testosterone' },
    insulin:      { critical: 'Critical insulin resistance detected', elevated: 'Insulin resistance pattern detected' },
    gdf15:        { critical: 'Elevated GDF-15 — cellular stress marker', elevated: 'Elevated GDF-15' },
    lpa:          { critical: 'Lp(a) critically elevated — genetic cardiovascular risk', elevated: 'Elevated Lp(a)' },
    cacScore:     { critical: 'High coronary calcium — advanced arterial calcification', elevated: 'Coronary calcium detected (CAC > 0)' },
    nfl:          { critical: 'Critical neurofilament light — neurodegeneration signal', elevated: 'Elevated NfL — neuroinflammation detected' },
    gfap:         { critical: 'Critical GFAP — astrocyte damage marker elevated', elevated: 'Elevated GFAP' },
    pTau217:      { critical: 'pTau-217 critical — Alzheimer pathology signal', elevated: 'Elevated pTau-217' },
    amyloidBeta:  { low: 'Low Amyloid Beta 42/40 ratio — neurodegeneration risk', critical: 'Critical Amyloid Beta ratio' },
    il6:          { critical: 'Critical IL-6 — systemic inflammatory cytokine', elevated: 'Elevated IL-6' },
    dunedinPACE:  { critical: 'Aging pace critically accelerated (DunedinPACE)', elevated: 'Aging pace above optimal (DunedinPACE)' },
  }

  const statusKey = status === 'critical' ? 'critical'
    : status === 'elevated' ? 'elevated'
    : 'low'

  return messages[key]?.[statusKey]
  ?? `biomarker_flag_${key}_${statusKey}`
}

function generateNarrativePart(
  key: string,
  value: number,
  status: BiomarkerStatus,
  ref: BiomarkerRef,
): string {
  if (status === 'critical') {
    return `critical ${ref.label} at ${value} ${ref.unit} requiring immediate attention`
  }
  if (status === 'elevated') {
    return `elevated ${ref.label} (${value} ${ref.unit}) indicating systemic burden`
  }
  return `suboptimal ${ref.label} (${value} ${ref.unit}) limiting biological potential`
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT : applique les ajustements biomarqueurs sur le rapport Engine A final
// ─────────────────────────────────────────────────────────────────────────────

export function applyBiomarkerAdjustments(
  enrichedReport: any,
  bioOutput: BiomarkerEngineOutput,
): any {
  if (!bioOutput.hasBiomarkers) return enrichedReport

  const adjustedScores = { ...enrichedReport.scores }
  Object.entries(bioOutput.scoreAdjustments).forEach(([domain, delta]) => {
    if (adjustedScores[domain] !== undefined) {
      adjustedScores[domain] = Math.max(0, Math.min(100, adjustedScores[domain] + delta))
    }
  })

  const adjustedLongevityScore = Math.max(
    0,
    Math.min(100, (enrichedReport.longevityScore ?? 50) + bioOutput.longevityScoreAdjustment),
  )

  const adjustedBiologicalAge = enrichedReport.biologicalAge != null
    ? Math.max(18, Math.round(enrichedReport.biologicalAge + bioOutput.biologicalAgeAdjustment))
    : null

  // Merge flags
  const mergedFlags = [
    ...(enrichedReport.flags ?? []),
    ...bioOutput.additionalFlags,
  ]

  // Ajouter les biomarqueurs au rapport pour la page 2
  return {
    ...enrichedReport,
    scores: adjustedScores,
    longevityScore: Math.round(adjustedLongevityScore),
    biologicalAge: adjustedBiologicalAge,
    flags: mergedFlags,
    biomarkers: bioOutput.results,
    biomarkerContext: bioOutput.narrativeContext,
    biomarkerPanelsUsed: bioOutput.panelsUsed,
    hasBiomarkers: true,
  }
}