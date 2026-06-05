// Pediatric UTI Management — MU Pediatric Service Line CPG (April 2026).
// Transcribed from uti.pdf. A 2×2 decision matrix (admission × recurrence risk)
// into four dispositions. Antibiotic dosing is deferred to the EHR PowerPlan,
// so there are no computed doses here.

export default {
  id: "uti",
  title: "UTI",
  fullTitle: "Urinary Tract Infection",
  category: "infectious",
  icon: "Droplets",
  keywords: ["uti", "urinary tract infection", "pyelonephritis", "cystitis", "dysuria", "cephalexin", "ceftriaxone"],
  shortDescription: "Admission vs discharge and antibiotic pathway for pediatric UTI/pyelonephritis.",
  sourcePdf: "uti.pdf",
  version: "2026",
  lastEdited: "April 2026",
  authors: ["MB Bernardin", "A Padhye", "J Kesterson"],
  verified: true,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF.",

  inclusion: ["Clinical concern for UTI / pyelonephritis"],
  exclusion: [
    "Age < 60 days or > 18 years",
    "Concern for sepsis or meningitis",
    "Immunocompromise",
    "Pregnancy",
    "Sexual abuse",
  ],

  callouts: {
    powerPlan: {
      tone: "info",
      title: "Antibiotic selection & dosing",
      body: "Use PowerPlan “ED PED Urinary Tract Infection” for antibiotic selection and dosing.",
    },
  },

  footnotes: {
    b: "Admission criteria: requiring IV fluids due to nausea/vomiting or inability to maintain hydration and/or tolerate oral antibiotic; failed outpatient management (persistent symptoms despite > 48 h on appropriately chosen/dosed antibiotic); UTI in the setting of kidney stone or other cause of urinary obstruction.",
    c: "Risk factors for recurrent UTI/pyelonephritis: vesicoureteral reflux (VUR), neurogenic bladder, recent instrumentation, indwelling catheters or stents, kidney stone or other cause of urinary obstruction.",
    d: "If past history of UTIs, empiric therapy should be based on previous microbiology and susceptibility.",
    e: "Cefdinir has lower urinary excretion in children than adults and is not recommended for pediatric UTIs.",
    f: "ED return precautions: lack of improvement after 48 h of antibiotics, progressive systemic symptoms (e.g. altered mental status, dehydration), inability to tolerate oral antibiotics or maintain hydration.",
    g: "Indications for outpatient renal US: children < 2 yr with first febrile UTI; any age with recurrent febrile UTIs; any age with UTI and family history of kidney/urologic disease, poor growth, or hypertension; children who do not respond as expected to appropriate antibiotic therapy.",
  },

  references: [
    "Urinary tract infections in infants older than one month and children younger than two years: Acute management, imaging, and prognosis. UpToDate. 2025.",
    "Urinary Tract Infection/Pyelonephritis: Management. Children's Mercy Kansas City Evidence Based Practice Guidelines. 2024.",
    "Mitzner T, et al. Cefdinir versus cephalexin for the treatment of uncomplicated urinary tract infections. Open Forum Infect Dis. 2025;12(10).",
    "MU Cumulative Antimicrobial Susceptibility Report 2025, Children's Hospital.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "Pediatric UTI Management",
      body: "For clinical concern of UTI/pyelonephritis. Review exclusion criteria, then begin.",
      next: "admissionCriteria",
    },
    admissionCriteria: {
      id: "admissionCriteria",
      type: "decision",
      title: "Meeting admission criteria?",
      footnoteRefs: ["b"],
      branches: [
        { label: "Yes — admit", next: "riskAdmit", tone: "warning" },
        { label: "No", next: "riskDischarge" },
      ],
    },
    riskAdmit: {
      id: "riskAdmit",
      type: "decision",
      title: "Risk factors for recurrent UTI?",
      footnoteRefs: ["c"],
      branches: [
        { label: "Yes", next: "admitRecurrent" },
        { label: "No", next: "admitStandard" },
      ],
    },
    riskDischarge: {
      id: "riskDischarge",
      type: "decision",
      title: "Risk factors for recurrent UTI?",
      footnoteRefs: ["c"],
      branches: [
        { label: "Yes", next: "dischargeRecurrent" },
        { label: "No", next: "dischargeStandard" },
      ],
    },

    admitRecurrent: {
      id: "admitRecurrent",
      type: "outcome",
      title: "Admit",
      body: [
        "IV access; blood culture, CBC, CMP",
        "IV ceftriaxone, or other IV antibiotic based on previous susceptibilities",
        "If cephalosporin allergy: IV ciprofloxacin",
      ],
      disposition: "admit-floor",
      tone: "warning",
      calloutIds: ["powerPlan"],
      footnoteRefs: ["d"],
    },
    admitStandard: {
      id: "admitStandard",
      type: "outcome",
      title: "Admit",
      body: [
        "IV access; blood culture, CBC, CMP",
        "IV cefazolin",
        "If cephalosporin allergy: IV ciprofloxacin",
      ],
      disposition: "admit-floor",
      tone: "warning",
      calloutIds: ["powerPlan"],
      footnoteRefs: ["d"],
    },
    dischargeRecurrent: {
      id: "dischargeRecurrent",
      type: "outcome",
      title: "Discharge home",
      body: [
        "PO cephalexin, or other oral antibiotic based on previous susceptibilities",
        "Duration: 3–5 days for cystitis, 7 days for pyelonephritis",
        "If amoxicillin or cephalosporin allergy: PO TMP/SMX",
        "Discuss ED return precautions",
        "Discuss PCP follow-up and indications for outpatient renal US",
      ],
      disposition: "discharge",
      tone: "success",
      calloutIds: ["powerPlan"],
      footnoteRefs: ["d", "e", "f", "g"],
    },
    dischargeStandard: {
      id: "dischargeStandard",
      type: "outcome",
      title: "Discharge home",
      body: [
        "PO cephalexin",
        "Duration: 3–5 days for cystitis, 7 days for pyelonephritis",
        "If amoxicillin or cephalosporin allergy: PO TMP/SMX",
        "Discuss ED return precautions",
        "Discuss PCP follow-up and indications for outpatient renal US",
      ],
      disposition: "discharge",
      tone: "success",
      calloutIds: ["powerPlan"],
      footnoteRefs: ["e", "f", "g"],
    },
  },
};
