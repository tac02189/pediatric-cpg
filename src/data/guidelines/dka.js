// Diabetic Ketoacidosis (DKA) Management — University of Missouri Pediatric
// Service Line CPG (July 2026). Transcribed from dka.pdf. Newly added — ships as
// DRAFT (verified: false) pending physician review. Dosing/criteria copied
// verbatim; verify against the source PDF.

export default {
  id: "dka",
  title: "DKA",
  fullTitle: "Diabetic Ketoacidosis (DKA) Management",
  category: "endocrine-metabolic",
  icon: "Droplet",
  keywords: [
    "dka",
    "diabetic ketoacidosis",
    "diabetes",
    "hyperglycemia",
    "insulin",
    "ketones",
    "ketoacidosis",
    "cerebral edema",
    "hhs",
    "hyperosmolar",
    "two bag",
    "potassium",
  ],
  shortDescription: "Phased management of pediatric DKA — fluids, insulin 2-bag system, K⁺, and cerebral-edema care.",
  sourcePdf: "dka.pdf",
  version: "2026",
  lastEdited: "July 2026",
  authors: [
    "MB Bernardin",
    "S Kattikat",
    "S Bakjaji",
    "D Lopez-Domowicz",
    "N Macatangay",
    "K Goddard",
    "K Cutler",
    "P Oren",
  ],
  verified: false,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF.",

  inclusion: ["Patient < 18 years presenting with signs/symptoms concerning for DKA"],
  exclusion: [],

  callouts: {
    presentation: {
      tone: "info",
      title: "Presentations concerning for DKA",
      body: "With or without known diabetes: hyperglycemia, polyuria, polydipsia, nausea/vomiting, abdominal pain, deep and fast (Kussmaul) respirations, fruity/acetone breath odor, fatigue, confusion, or altered mental status.",
    },
    dkaCriteriaList: {
      tone: "info",
      title: "Criteria for DKA",
      body: [
        "Hyperglycemia ≥ 200 mg/dL",
        "Venous pH < 7.25 and/or bicarb < 15 mmol/L",
        "β-hydroxybutyrate ≥ 3 or moderate/large ketones",
      ],
    },
    bicarbNote: {
      tone: "warning",
      title: "Borderline acidosis",
      body: "If bicarb < 15 but pH ≥ 7.25, consult pediatric endocrinology.",
    },
    riskStratification: {
      tone: "info",
      title: "Cerebral edema risk stratification (known diabetics)",
      body: [
        "High risk: pH < 7.0 (≥ 3 yr) or pH < 7.1 (< 3 yr), glucose > 1000 mg/dL, corrected sodium > 155 mEq/L, or new neurologic deficit → disposition typically PICU.",
        "Medium risk: does not meet low- or high-risk criteria; progressive ketonuria; inability to tolerate PO → disposition typically inpatient pediatric floor with peds endo consult.",
        "Low risk: pH > 7.2, bicarb > 15, improving ketones, tolerating oral PO → disposition typically floor vs structured outpatient management per peds endo.",
      ],
    },
    hhsLabs: {
      tone: "info",
      title: "Labs typical of HHS",
      body: "Glucose > 600 mg/dL, venous pH > 7.35, bicarb ≥ 15 mEq/L, minimal or absent ketones, serum osmolality > 320 mOsm/kg.",
    },
    insulinNote: {
      tone: "warning",
      title: "Insulin infusion",
      body: "Start the insulin drip after the initial fluid bolus is complete. Administer via a dedicated pump (e.g. Alaris) — never push or bolus IV.",
    },
    maintenanceNote: {
      tone: "info",
      title: "Fluid ceiling",
      body: "Do not exceed 4 L/m²/day (including the initial fluid bolus).",
    },
    cerebralEdemaCriteria: {
      tone: "danger",
      title: "Cerebral edema — diagnosis & treatment indications",
      body: [
        "Minor criteria: headache (esp. worsening/recurring during treatment); vomiting (esp. developing/recurring during treatment); irritability, lethargy, or not easily aroused from sleep (esp. after initiation); elevated BP (e.g. diastolic > 90 mmHg).",
        "Major criteria: abnormal/deteriorating mental status after initiation, agitation, or fluctuating consciousness; incontinence inappropriate for age; inappropriate slowing of heart rate (e.g. decline > 20 bpm not from improved volume or sleep).",
        "Diagnostic criteria: abnormal motor or verbal response to pain; decorticate/decerebrate posture; abnormal pupillary response or other CN palsy; abnormal neurogenic respiratory pattern (grunting, Cheyne-Stokes, apnea).",
        "Treat if: 1 diagnostic criterion, OR 2 major, OR 1 major + 2 minor, OR 1 major + 1 minor (if child < 5 years).",
      ],
    },
    picuCriteria: {
      tone: "warning",
      title: "PICU admission criteria",
      body: [
        "Initial pH < 7.25 or bicarb < 15, and/or requiring an insulin drip",
        "Concern for cerebral edema",
        "Cardiorespiratory instability",
        "Age < 2 years",
        "Severe electrolyte disturbances (e.g. K < 2 or > 7)",
      ],
    },
    mannitolNote: {
      tone: "warning",
      title: "Mannitol",
      body: "Closely monitor intake and output (consider a foley if unable to urinate/measure output). Contraindicated if hypotensive.",
    },
    hypertonicNote: {
      tone: "warning",
      title: "Hypertonic saline",
      body: "Do NOT use hypertonic saline if hypernatremic — may develop hyperchloremic acidosis.",
    },
    powerPlan: {
      tone: "info",
      title: "PowerPlan",
      body: "Use PowerPlan: “ED Peds DKA Insulin”.",
    },
  },

  references: [
    "MU Emergency Department – Pediatric DKA – Nurse Initiated Protocol, 2026.",
    "MU Emergency Department – Pediatric Diabetic DKA – Protocol, 2024.",
    "Diabetic ketoacidosis in children: Cerebral injury (cerebral edema). UpToDate, 2025.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "Diabetic Ketoacidosis (DKA) Management",
      body: "For the patient < 18 years presenting with signs/symptoms concerning for DKA.",
      calloutIds: ["presentation"],
      next: "initialAssessment",
    },

    initialAssessment: {
      id: "initialAssessment",
      type: "action",
      title: "Initial assessment",
      items: [
        "Obtain immediate POC glucose",
        "Continuous cardiac and pulse-oximetry monitoring",
        "Place PIV ×2",
        "Labs: CBC, RFP, VBG, UA, β-hydroxybutyrate, HgA1C (unless obtained in the last 30 days), urine pregnancy test as indicated",
      ],
      next: "initialBolus",
    },

    initialBolus: {
      id: "initialBolus",
      type: "action",
      title: "Initial fluid bolus (Phase I)",
      items: [
        "LR (preferred) or NS 10–20 mL/kg (max 1 L) over 1 hour",
        "Give the initial bolus rapidly only if in decompensated shock",
        "Only one bolus recommended if hemodynamically stable",
        "Reassess perfusion after each bolus; avoid cumulative bolus > 40 mL/kg unless persistent shock",
        "Consider vasopressors after the 3rd bolus if hemodynamically unstable",
      ],
      next: "pocOver600",
    },

    pocOver600: {
      id: "pocOver600",
      type: "decision",
      title: "POC glucose > 600 mg/dL?",
      branches: [
        { label: "No", next: "dkaCriteria" },
        { label: "Yes", next: "hhsCheck" },
      ],
    },

    hhsCheck: {
      id: "hhsCheck",
      type: "decision",
      title: "Serum osmolality ≥ 320 mOsm/kg AND bicarb ≥ 15 mmol/L?",
      body: "Obtain serum osmolality.",
      branches: [
        { label: "Yes — HHS", next: "hhs", tone: "danger" },
        { label: "No", next: "dkaCriteria" },
      ],
    },

    hhs: {
      id: "hhs",
      type: "outcome",
      title: "Contact PICU — Hyperglycemic Hyperosmolar Syndrome (HHS)",
      body: "Contact PICU for admission and HHS management.",
      disposition: "admit-picu",
      tone: "danger",
      calloutIds: ["hhsLabs"],
    },

    dkaCriteria: {
      id: "dkaCriteria",
      type: "decision",
      title: "Does the patient meet criteria for DKA?",
      calloutIds: ["dkaCriteriaList", "bicarbNote"],
      branches: [
        { label: "Yes — meets DKA criteria", next: "newOnset" },
        { label: "No", next: "altDx" },
      ],
    },

    altDx: {
      id: "altDx",
      type: "outcome",
      title: "Consider alternative diagnoses",
      body: "Consult Peds Endocrinology as needed.",
      disposition: "consult",
      tone: "neutral",
      calloutIds: ["riskStratification"],
    },

    newOnset: {
      id: "newOnset",
      type: "decision",
      title: "New-onset diabetes?",
      branches: [
        { label: "Yes", next: "newOnsetLabs" },
        { label: "No", next: "hypokalemia" },
      ],
    },

    newOnsetLabs: {
      id: "newOnsetLabs",
      type: "action",
      title: "Obtain new-onset diabetes labs",
      items: [
        "HgbA1c, insulin antibodies, GAD antibodies, IA-2 antibodies, zinc transporter 8 antibodies, C-peptide, celiac panel, TSH",
      ],
      next: "hypokalemia",
    },

    hypokalemia: {
      id: "hypokalemia",
      type: "decision",
      title: "Hypokalemia?",
      branches: [
        { label: "Yes", next: "potassiumRepletion", tone: "warning" },
        { label: "No", next: "insulinPhase2" },
      ],
    },

    potassiumRepletion: {
      id: "potassiumRepletion",
      type: "lookup",
      title: "Potassium repletion (before insulin infusion)",
      body: "Replete potassium before starting the insulin drip, per initial K⁺:",
      table: {
        columns: ["Initial K⁺ (mEq/L)", "Insulin", "Fluids (Bag A)", "Additional repletion", "Repeat K⁺"],
        rows: [
          [
            "≤ 3",
            "Do not start until repeat K⁺ > 3",
            "NS + KCl 20 mEq/L",
            "PO (preferred): 1 mEq/kg (max 40 mEq) oral liquid/powder — OR IV (if not tolerating PO): 1 mEq/kg (max 40 mEq) over 4 h; rate 0.25 mEq/kg/hr (max 10 mEq/hr)",
            "1–2 h after end of K⁺ administration",
          ],
          [
            "3.1–3.3",
            "May start only if additional IV K⁺ repletion given (PO) or being infused (IV)",
            "NS + KCl 20 mEq/L",
            "PO (preferred): 0.5 mEq/kg (max 20 mEq) oral liquid/powder — OR IV: 0.5 mEq/kg (max 20 mEq) over 2 h; rate 0.25 mEq/kg/hr (max 10 mEq/hr)",
            "1–2 h after end of K⁺ administration",
          ],
          ["> 3.3", "Start immediately", "LR (preferred) or NS", "None", "Standard lab frequency"],
        ],
      },
      next: "insulinPhase2",
    },

    insulinPhase2: {
      id: "insulinPhase2",
      type: "action",
      title: "Insulin infusion + “2-bag system” (Phase II)",
      items: [
        "Start insulin infusion at 0.1 u/kg/hour",
        "Order Bag A (NS preferred) and Bag B (D10 ½NS preferred)",
        "Administer IVF at 1.5× maintenance rate (see 2-bag table); do not exceed 4 L/m²/day including the initial bolus",
        "Nurse-initiated IVF titration based on q1h POC glucose",
      ],
      calloutIds: ["powerPlan", "insulinNote", "maintenanceNote"],
      next: "twoBagTable",
    },

    twoBagTable: {
      id: "twoBagTable",
      type: "lookup",
      title: "2-bag system — dextrose titration",
      body: "Titrate Bag A / Bag B to keep glucose in range:",
      table: {
        columns: ["Plasma glucose (mg/dL)", "Bag A (NS)", "Bag B (D10 ½NS)", "Final dextrose"],
        rows: [
          ["> 300", "Total fluid rate", "0", "0%"],
          ["200–300", "½ total fluid rate", "½ total fluid rate", "5%"],
          ["< 200", "0", "Total fluid rate", "10%"],
        ],
      },
      next: "monitoring",
    },

    monitoring: {
      id: "monitoring",
      type: "action",
      title: "Monitoring",
      items: [
        "Vital signs + neuro checks q1h",
        "POC glucose q1h (serum glucose if POC glucose > 600)",
        "Serum glucose, VBG, Na, K, Cl, HCO₃ (i-STAT) q2h",
        "BMP, serum iCa, phosphorus, urine dipstick q4h",
      ],
      next: "cerebralEdema",
    },

    cerebralEdema: {
      id: "cerebralEdema",
      type: "decision",
      title: "Meeting indications for treatment of cerebral edema?",
      calloutIds: ["cerebralEdemaCriteria"],
      branches: [
        { label: "Yes", next: "cerebralEdemaTx", tone: "danger" },
        { label: "No", next: "picuCriteriaCheck" },
      ],
    },

    cerebralEdemaTx: {
      id: "cerebralEdemaTx",
      type: "action",
      title: "Treat cerebral edema",
      items: [
        "Elevate the head of the bed",
        "Give Mannitol 1 g/kg IV over 20 min, OR 3% NaCl 5 mL/kg (max 250 mL) IV over 20 min",
        "Do NOT delay therapy for CT imaging",
      ],
      calloutIds: ["mannitolNote", "hypertonicNote"],
      next: "admitPICU",
    },

    picuCriteriaCheck: {
      id: "picuCriteriaCheck",
      type: "decision",
      title: "Meeting PICU admission criteria?",
      calloutIds: ["picuCriteria"],
      branches: [
        { label: "Yes", next: "admitPICU", tone: "warning" },
        { label: "No", next: "admitFloor" },
      ],
    },

    admitPICU: {
      id: "admitPICU",
      type: "outcome",
      title: "Admit to PICU",
      disposition: "admit-picu",
      tone: "danger",
    },

    admitFloor: {
      id: "admitFloor",
      type: "outcome",
      title: "Admit to pediatric floor",
      disposition: "admit-floor",
      tone: "warning",
    },
  },
};
