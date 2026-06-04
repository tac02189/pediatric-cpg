// Pediatric Community-Acquired Pneumonia — MU Pediatric Service Line CPG (Feb 2025).
// Transcribed from pneumonia.pdf. A severity cascade into five dispositions;
// antibiotic dosing deferred to the EHR PowerPlan.

export default {
  id: "pneumonia",
  title: "Pneumonia (CAP)",
  fullTitle: "Community-Acquired Pneumonia",
  category: "respiratory",
  icon: "Stethoscope",
  keywords: ["pneumonia", "cap", "community acquired pneumonia", "amoxicillin", "ceftriaxone", "effusion", "empyema", "lung"],
  shortDescription: "Severity-based admission and antibiotic pathway for pediatric CAP.",
  sourcePdf: "pneumonia.pdf",
  version: "2025",
  lastEdited: "February 2025",
  authors: ["MB Bernardin", "A Padhye", "R Marwan", "W Ficker", "L Smith", "K Koehn", "J Kesterson"],
  verified: false,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF.",

  inclusion: ["History/exam and/or chest X-ray consistent with CAP"],
  exclusion: [
    "Age < 60 days",
    "Chronic pulmonary diagnoses (BPD/chronic lung disease, cystic fibrosis, asthma, history of aspiration)",
    "Immunodeficiency",
    "Tracheostomy with or without mechanical ventilation",
    "Hospital-acquired pneumonia",
  ],

  callouts: {
    powerPlan: {
      tone: "info",
      title: "Antibiotic selection & dosing",
      body: "Use PowerPlan “ED PED Pneumonia Community Acquired” for antibiotic selection and dosing.",
    },
  },

  footnotes: {
    a: "Routine CXRs are not necessary to confirm suspected CAP. AP and lateral CXRs should be obtained for diagnostic uncertainty, or for concern for CAP with hypoxemia, significant respiratory distress, or failed initial antibiotic therapy.",
    c: "Complicated pneumonia: moderate to large parapneumonic effusion, empyema, abscess, necrosis.",
    d: "Give clindamycin if cephalosporin allergy. Clindamycin can be added to ceftriaxone for complicated pneumonia if concern for MRSA (obtain MRSA nasal swab).",
    e: "Atypical pneumonia risk factors/features: age > 5 yr, insidious onset, constitutional symptoms (headache, rash, conjunctivitis, photophobia, sore throat), failure to improve on typical CAP coverage, increased local prevalence.",
    f: "Consider IV access and basic blood work for inability to tolerate adequate PO fluids, concern for dehydration, or escalating HFNC. Blood cultures for moderate-to-severe CAP requiring hospitalization, particularly complicated pneumonia. Routine labs/inflammatory markers not recommended for uncomplicated CAP.",
    g: "Give ceftriaxone instead of ampicillin if not fully immunized for age against HiB and Pneumococcus, or if true penicillin allergy.",
    h: "ED return precautions: lack of improvement after 48 h of antibiotics, worsening respiratory distress, progressive systemic symptoms (altered mental status, dehydration), inability to tolerate oral antibiotics.",
  },

  references: [
    "Bradley et al. The management of community-acquired pneumonia in infants and children older than 3 months of age: PIDS/IDSA clinical practice guidelines. Clin Infect Dis. 2011;53(7):617-630.",
    "Community-acquired pneumonia in children: Outpatient treatment. UpToDate. 2024.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "Community-Acquired Pneumonia",
      body: "For the child with history/exam and/or CXR consistent with CAP. Review exclusion criteria, then begin.",
      footnoteRefs: ["a"],
      next: "criticallyIll",
    },
    criticallyIll: {
      id: "criticallyIll",
      type: "decision",
      title: "Critically ill, or requiring > 15 L/kg (or 15 L) HFNC and/or 50% FiO₂?",
      branches: [
        { label: "Yes", next: "picu", tone: "danger" },
        { label: "No", next: "complicated" },
      ],
    },
    complicated: {
      id: "complicated",
      type: "decision",
      title: "Concern for complicated pneumonia?",
      footnoteRefs: ["c"],
      branches: [
        { label: "Yes", next: "floorComplicated", tone: "warning" },
        { label: "No", next: "needO2" },
      ],
    },
    needO2: {
      id: "needO2",
      type: "decision",
      title: "Requiring supplemental O₂ and/or respiratory support?",
      branches: [
        { label: "Yes", next: "floorO2", tone: "warning" },
        { label: "No", next: "toleratePO" },
      ],
    },
    toleratePO: {
      id: "toleratePO",
      type: "decision",
      title: "Able to tolerate PO fluids/antibiotics?",
      branches: [
        { label: "Yes", next: "discharge", tone: "success" },
        { label: "No", next: "floorPOintolerant", tone: "warning" },
      ],
    },

    picu: {
      id: "picu",
      type: "outcome",
      title: "Admit to PICU",
      body: [
        "IV access; blood culture, CBC, CMP, VBG, MRSA nasal swab",
        "Continuous O₂ monitoring",
        "Obtain chest CT with IV contrast & consult pediatric surgery for moderate/large effusions",
        "IV ceftriaxone ± azithromycin based on risk factors",
        "Consider adding vancomycin if critically ill and/or hemodynamically unstable",
      ],
      disposition: "admit-picu",
      tone: "danger",
      calloutIds: ["powerPlan"],
      footnoteRefs: ["d", "e"],
    },
    floorComplicated: {
      id: "floorComplicated",
      type: "outcome",
      title: "Admit to floor — complicated pneumonia",
      body: [
        "IV access; blood culture, CBC, CMP, MRSA nasal swab",
        "Continuous O₂ monitoring",
        "Obtain chest CT with IV contrast & consult pediatric surgery for moderate/large effusions",
        "IV ceftriaxone ± azithromycin based on risk factors",
      ],
      disposition: "admit-floor",
      tone: "warning",
      calloutIds: ["powerPlan"],
      footnoteRefs: ["d", "e", "f"],
    },
    floorO2: {
      id: "floorO2",
      type: "outcome",
      title: "Admit to floor",
      body: [
        "IV access, labs",
        "Continuous O₂ monitoring",
        "IV ampicillin ± azithromycin based on risk factors",
      ],
      disposition: "admit-floor",
      tone: "warning",
      calloutIds: ["powerPlan"],
      footnoteRefs: ["e", "f", "g"],
    },
    floorPOintolerant: {
      id: "floorPOintolerant",
      type: "outcome",
      title: "Admit to floor",
      body: [
        "Consider IV access, labs",
        "Continuous O₂ monitoring",
        "IV ampicillin or PO amoxicillin ± azithromycin based on risk factors",
      ],
      disposition: "admit-floor",
      tone: "warning",
      calloutIds: ["powerPlan"],
      footnoteRefs: ["e", "f", "g"],
    },
    discharge: {
      id: "discharge",
      type: "outcome",
      title: "Discharge home",
      body: ["PO amoxicillin ± azithromycin based on risk factors", "Discuss ED return precautions"],
      disposition: "discharge",
      tone: "success",
      calloutIds: ["powerPlan"],
      footnoteRefs: ["e", "h"],
    },
  },
};
