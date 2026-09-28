// Asthma Management — University of Missouri Pediatric Service Line CPG
// (September 2026). Transcribed from asthma.pdf. Newly added — ships as DRAFT
// (verified: false) pending physician review. Doses/scores copied verbatim;
// verify against the source PDF.
//
// Source layout: a timed grid (initial / 1 h / 2 h scores) with a mild–moderate
// arm (PDF page 2) and a severe–critical arm (PDF page 3). Both arms are kept
// as separate node chains because the same score band carries different
// instructions depending on which arm the patient entered on.
//
// Transcription notes for the physician audit (also flagged in chat):
//  • Page 2's column header prints "> 8 (Severe/Critical)" while page 3 bands
//    severe as "8 - 11" — so a score of exactly 8 is treated as severe here.
//  • Page 2, 3rd-score mild column prints "Consider admission criteria" with
//    superscript d (the HHFNC footnote). The admission criteria are footnote e;
//    this file references e, treating the printed d as a source marker typo.
//  • Mag sulfate, IVF bolus, and IV methylprednisolone carry no doses anywhere
//    in the PDF, so they appear as text only — no calculator entries.

// Reusable drug definitions (composed into the calculators below).

const DEXAMETHASONE = {
  name: "Dexamethasone",
  route: "PO",
  // Footnote c gives a range with no max cap, so this stays display-only —
  // no per-kg computation that could extrapolate past the PDF.
  displayDose: "0.3–0.6 mg/kg — 1–2 doses (36–72 h course)",
  note: "Generally preferred for pediatric ED asthma exacerbations — better compliance, less vomiting, similar efficacy (footnote c).",
};

const PREDNISOLONE = {
  name: "Prednisolone / prednisone",
  route: "PO",
  displayDose: "1–2 mg/kg/day (3–5 day course)",
  note: "Preferred by MU Pediatric Pulmonology for pulmonology patients, particularly those requiring admission (footnote c).",
};

const DUONEB = {
  name: "DuoNeb (albuterol + ipratropium)",
  route: "Nebulized",
  displayDose: "3 treatments, each 20 min apart",
};

const ALBUTEROL_IPRATROPIUM_MDI = {
  name: "Albuterol + ipratropium MDI",
  route: "Inhaled (MDI)",
  note: "3 treatments, each 20 min apart.",
  rules: [
    {
      when: (c) => typeof c.weightKg === "number" && c.weightKg < 10,
      label: "< 10 kg",
      displayDose: "4 puffs of each",
    },
    {
      // PDF band "10 - 20kg" — inclusive of both bounds.
      when: (c) => typeof c.weightKg === "number" && c.weightKg <= 20,
      label: "10–20 kg",
      displayDose: "6 puffs of each",
    },
    {
      when: (c) => typeof c.weightKg === "number" && c.weightKg > 20,
      label: "> 20 kg",
      displayDose: "8 puffs of each",
    },
  ],
};

const CONTINUOUS_ALBUTEROL = {
  name: "Albuterol — continuous nebulization",
  route: "Nebulized, given over 1 hour",
  note: "May be administered via HHFNC; d/c HHFNC when continuous albuterol finishes, if tolerated (footnote d).",
  rules: [
    {
      when: (c) => typeof c.weightKg === "number" && c.weightKg < 10,
      label: "< 10 kg",
      dose: { flatMg: 10 },
    },
    {
      when: (c) => typeof c.weightKg === "number" && c.weightKg <= 20,
      label: "10–20 kg",
      dose: { flatMg: 15 },
    },
    {
      when: (c) => typeof c.weightKg === "number" && c.weightKg > 20,
      label: "> 20 kg",
      dose: { flatMg: 20 },
    },
  ],
};

const IPRATROPIUM_WITH_CONTINUOUS = {
  name: "Ipratropium bromide",
  route: "Nebulized — added to continuous albuterol",
  dose: { flatMg: 1.5 },
};

const Q2_ALBUTEROL = {
  name: "Albuterol neb, q2h",
  route: "Nebulized",
  rules: [
    {
      // PDF prints "<20kg: 2.5mg" / ">20kg: 5mg", leaving exactly 20 kg
      // unassigned. Assigned here to the LOWER band — the conservative
      // reading, consistent with the CPG's own inclusive "10 - 20kg" bands
      // for continuous albuterol and MDI puffs. Raised by both 2026-09-28
      // peer reviews; pending an explicit physician decision.
      when: (c) => typeof c.weightKg === "number" && c.weightKg <= 20,
      label: "≤ 20 kg",
      dose: { flatMg: 2.5 },
    },
    {
      when: (c) => typeof c.weightKg === "number" && c.weightKg > 20,
      label: "> 20 kg",
      dose: { flatMg: 5 },
    },
  ],
};

const IM_EPINEPHRINE = {
  name: "Epinephrine (IM)",
  route: "IM",
  formulation: "1:1000 solution (1 mg/mL)",
  dose: { mgPerKg: 0.01, maxMg: 0.5, concentrationMgPerMl: 1, frequency: "every 20 min, up to 3 doses" },
  note: "Adjunct therapy for severe status asthmaticus (footnote f).",
};

export default {
  id: "asthma",
  title: "Asthma",
  fullTitle: "Asthma Management Guideline",
  category: "respiratory",
  icon: "Haze",
  keywords: [
    "asthma",
    "status asthmaticus",
    "wheeze",
    "wheezing",
    "bronchospasm",
    "reactive airway",
    "albuterol",
    "duoneb",
    "ipratropium",
    "magnesium",
    "dexamethasone",
    "PRAS",
    "respiratory assessment score",
  ],
  shortDescription: "PRAS-driven timed pathway (0–1–2 h) for acute asthma — bronchodilators, steroids, escalation, disposition.",
  sourcePdf: "asthma.pdf",
  version: "2026",
  lastEdited: "September 2026",
  authors: [
    "MB Bernardin",
    "L Herbig",
    "J Kesterson",
    "C Dyer",
    "M Hayes",
    "K Cutler",
    "D Lopez-Domowicz",
    "R Kapoor",
    "R Nevel",
    "J Acton",
    "Z Ner",
  ],
  verified: false,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF.",

  inclusion: [
    "Children < 18 years with established or suspected asthma presenting with a respiratory complaint",
  ],
  exclusion: [
    "Adults > 18 years of age",
    "Tracheostomy dependent",
    "Chronic underlying lung disease (i.e. cystic fibrosis, bronchiectasis)",
    "Cardiac disease",
    "Confirmed or suspected airway abnormality (i.e. airway foreign body, vocal cord dysfunction)",
  ],

  calculators: {
    pras: {
      kind: "score",
      engine: "additive",
      id: "pras",
      name: "Pediatric Respiratory Assessment Score",
      reference: "MU Emergency Department – Pediatric Asthma – Nurse Initiated Protocol, 2026.",
      items: [
        {
          id: "breathSounds",
          label: "Breath sounds",
          options: [
            { label: "Good aeration", value: 0 },
            { label: "Coarse crackles or rhonchi, end-expiratory wheeze", value: 1 },
            { label: "Expiratory wheezes", value: 2 },
            { label: "Inspiratory and expiratory wheezes, diminished breath sounds", value: 3 },
          ],
        },
        {
          id: "respiratoryPattern",
          label: "Respiratory pattern",
          options: [
            { label: "Normal respirations, normal feeding", value: 0 },
            { label: "1 of these: conversational dyspnea, poor feeding, agitation", value: 1 },
            { label: "2 of these: conversational dyspnea, poor feeding, agitation", value: 2 },
            { label: "Dyspnea at rest, grunting, stops feeding, drowsy or confused", value: 3 },
          ],
        },
        {
          // The PDF banding is by age; pick the row matching the patient's age.
          id: "respiratoryRate",
          label: "Respiratory rate (based on age)",
          options: [
            { label: "< 2 mo: up to 50 bpm", value: 0 },
            { label: "< 2 mo: 51–60", value: 1 },
            { label: "< 2 mo: 61–70", value: 2 },
            { label: "< 2 mo: > 70", value: 3 },
            { label: "2–12 mo: up to 40 bpm", value: 0 },
            { label: "2–12 mo: 41–50", value: 1 },
            { label: "2–12 mo: 51–60", value: 2 },
            { label: "2–12 mo: > 60", value: 3 },
            { label: "1–5 yr: up to 30 bpm", value: 0 },
            { label: "1–5 yr: 31–35", value: 1 },
            { label: "1–5 yr: 36–40", value: 2 },
            { label: "1–5 yr: > 40", value: 3 },
            { label: "> 5 yr: up to 20 bpm", value: 0 },
            { label: "> 5 yr: 21–25", value: 1 },
            { label: "> 5 yr: 26–30", value: 2 },
            { label: "> 5 yr: > 30", value: 3 },
          ],
        },
        {
          id: "retractions",
          label: "Retractions",
          options: [
            // "(includes nasal flaring for infants)" belongs to the 2-point
            // cell: measured in the PDF, all three of its text fragments
            // center at x≈421 — the "2" column — not the 1-point column
            // (x≈332). Caught by the 2026-09-28 Codex review.
            { label: "None, normal breathing pattern", value: 0 },
            { label: "1 location", value: 1 },
            { label: "2 locations (includes nasal flaring for infants)", value: 2 },
            { label: "> 2 locations, or accessory muscle use or nasal flaring or head bobbing", value: 3 },
          ],
        },
        {
          id: "oxygen",
          label: "Oxygen / SpO₂",
          options: [
            { label: "≥ 98% on room air", value: 0 },
            { label: "95–97% on room air", value: 1 },
            { label: "90–94% on room air", value: 2 },
            { label: "< 90% or requiring oxygen", value: 3 },
          ],
        },
      ],
      bands: [
        { id: "mild", label: "Mild", max: 3, tone: "success" },
        { id: "moderate", label: "Moderate", min: 4, max: 7, tone: "warning" },
        // Page 2 prints the top column as "> 8 (Severe/Critical)", but page 3
        // bands severe as 8–11 — a score of exactly 8 is severe.
        { id: "severe", label: "Severe", min: 8, max: 11, tone: "danger" },
        { id: "critical", label: "Critical", min: 12, tone: "danger" },
      ],
      // No combined mild+moderate group: groupForBand resolves a band to the
      // FIRST group containing it, so a group like mildModerate:["mild",
      // "moderate"] is unreachable behind the singleton groups. The page-3
      // "< 8 (Mild/Moderate)" column is expressed as two branches with the
      // same target instead (both peer reviews, 2026-09-28).
      routingGroups: {
        mild: ["mild"],
        moderate: ["moderate"],
        severe: ["severe"],
        critical: ["critical"],
      },
    },

    oralSteroid: {
      kind: "dosing",
      id: "oralSteroid",
      name: "Oral corticosteroid",
      drugs: [DEXAMETHASONE, PREDNISOLONE],
    },
    moderateInitialMeds: {
      kind: "dosing",
      id: "moderateInitialMeds",
      name: "DuoNebs / MDI + oral steroid",
      drugs: [DUONEB, ALBUTEROL_IPRATROPIUM_MDI, DEXAMETHASONE, PREDNISOLONE],
    },
    severeInitialMeds: {
      kind: "dosing",
      id: "severeInitialMeds",
      name: "Continuous albuterol + ipratropium + steroid",
      drugs: [CONTINUOUS_ALBUTEROL, IPRATROPIUM_WITH_CONTINUOUS, PREDNISOLONE],
    },
    criticalInitialMeds: {
      kind: "dosing",
      id: "criticalInitialMeds",
      name: "Continuous albuterol + ipratropium + IM epinephrine",
      drugs: [CONTINUOUS_ALBUTEROL, IPRATROPIUM_WITH_CONTINUOUS, IM_EPINEPHRINE],
    },
    contAlbuterol: {
      kind: "dosing",
      id: "contAlbuterol",
      name: "Continuous albuterol",
      drugs: [CONTINUOUS_ALBUTEROL],
    },
    q2Albuterol: {
      kind: "dosing",
      id: "q2Albuterol",
      name: "q2h albuterol neb",
      drugs: [Q2_ALBUTEROL],
    },
  },

  callouts: {
    admissionCriteria: {
      tone: "info",
      title: "Admission criteria",
      body: [
        "Children requiring albuterol more frequently than every 4 hours, requiring supplemental O₂, HHFNC, or IV hydration should be admitted.",
        "Pediatric floor: tolerating albuterol q2 hours or less frequent, up to 2 L/kg (max 20 L) HHFNC, up to 50% FiO₂.",
        "PICU: requiring continuous albuterol, > 2 L/kg or > 20 L HHFNC, > 50% FiO₂.",
      ],
    },
  },

  footnotes: {
    a: "Suspect asthma in children with a history of repeated wheezing in the setting of viral illnesses, prior improvement in symptoms with bronchodilator, history of atopy, family history of asthma.",
    b: "Exclusion criteria: adults > 18 years of age, tracheostomy dependent, chronic underlying lung disease (i.e. cystic fibrosis, bronchiectasis), cardiac disease, confirmed or suspected airway abnormality (i.e. airway foreign body, vocal cord dysfunction).",
    c: "Oral dexamethasone is generally preferred over prednisolone for pediatric ED asthma exacerbations due to better compliance, reduced vomiting, and similar efficacy. A 1–2 dose, 36–72 hour course of dexamethasone (0.3–0.6 mg/kg) is noninferior to a 3–5 day course of prednisolone (1–2 mg/kg/day), with lower rates of medication-related vomiting and fewer relapses. Prednisolone/prednisone or IV methylpred is preferred by MU Pediatric Pulmonology for pulmonology patients, particularly those requiring admission.",
    d: "Heated high flow nasal cannula (HHFNC) may be considered for administration of continuous albuterol, but should be discontinued at the time that treatment with continuous albuterol is finished, if tolerated by the patient. See separate HHFNC policy.",
    e: [
      "Admission criteria: children requiring albuterol more frequently than every 4 hours, requiring supplemental O₂, HHFNC, or IV hydration should be admitted:",
      "Pediatric floor admission: tolerating albuterol q2 hours or less frequent, up to 2 L/kg (max 20 L) HHFNC, up to 50% FiO₂.",
      "PICU admission: requiring continuous albuterol, > 2 L/kg or > 20 L HHFNC, > 50% FiO₂.",
    ],
    f: "IM epinephrine [0.01 mg/kg (0.01 mL/kg of 1:1000 solution [1 mg/mL]) every 20 minutes for up to three doses, max dose 0.5 mg] can be considered as an adjunct therapy for severe status asthmaticus.",
    g: [
      "Follow-up instructions: recommend and/or schedule follow up with PCP within 1–3 days.",
      "If referring to Pediatric Pulmonology with an Ambulatory Referral order: place the referral to Pediatric Pulmonary (it goes to Lisa Hunter, Pulmonary Patient Navigator); if the patient needs to be seen in the next 1–2 weeks due to severity of their asthma, also send a PowerChart message to Pediatric Pulmonary on call; add brief reasoning for the referral in the comment section for appropriate triage.",
      "If placing a Follow Up Child Health order: send a PowerChart message to Lisa Hunter for scheduling; if the patient needs to be seen within 1–2 weeks, also CC the message to Pediatric Pulmonary on call.",
    ],
    h: "ED return precautions: increasing respiratory distress or hypoxemia despite scheduled bronchodilator [+/- PRN combined inhaled corticosteroid/long-acting beta agonist inhaler], inability to tolerate q4 hour bronchodilator, inability to maintain oral hydration.",
  },

  references: [
    "MU Emergency Department – Pediatric Asthma – Nurse Initiated Protocol, 2026. https://muhealth.policytech.com/dotNet/documents/?docid=72780&app=pt&source=browse",
    "MU Women's and Children's Hospital – Pediatric Bronchodilator Administration Protocol, 2025. https://muhealth.policytech.com/dotNet/documents/?docid=38167&app=pt&source=browse",
    "Sayre et al. Is dexamethasone an effective alternative to oral prednisone in the treatment of pediatric asthma exacerbations? Hosp Pediatr. 2014 May;4(3):172-80.",
    "MU Emergency Department – Pediatric Heated High-Flow Nasal Cannula and Vapotherm Initiation – Protocol, 2026.",
    "Baggott et al. Epinephrine (adrenaline) compared to selective beta-2-agonist in adults or children with acute asthma: a systematic review and meta-analysis. Thorax. 2022 Jun;77(6):563-572.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "Asthma Management",
      body: "For children < 18 years with established or suspected asthma presenting with a respiratory complaint. Review the criteria below, then begin.",
      footnoteRefs: ["a", "b"],
      next: "initialSteps",
    },
    initialSteps: {
      id: "initialSteps",
      type: "action",
      title: "Initial steps",
      items: [
        "Place patient in patient gown on continuous cardiac monitoring and SpO₂",
        "Administer supplemental O₂ for O₂ saturations < 92%",
        "Obtain Pediatric Respiratory Assessment Score — RT or MD to chart the score in the patient's chart",
      ],
      next: "score0",
    },
    score0: {
      id: "score0",
      type: "score",
      title: "Initial score — 0 hour",
      calculatorId: "pras",
      branches: [
        { group: "mild", label: "Mild (0–3)", next: "mild0", tone: "success" },
        { group: "moderate", label: "Moderate (4–7)", next: "mod0", tone: "warning" },
        { group: "severe", label: "Severe (8–11)", next: "sev0", tone: "danger" },
        { group: "critical", label: "Critical (12–15)", next: "crit0", tone: "danger" },
      ],
    },

    // ---- Mild arm (PDF page 2, initial score 0–3) ----
    mild0: {
      id: "mild0",
      type: "dosing",
      title: "Mild (0–3) — initial treatment",
      body: ["Give bronchodilator as needed.", "Consider oral steroid."],
      calculatorId: "oralSteroid",
      footnoteRefs: ["c"],
      next: "dischargeHome",
    },

    // ---- Moderate arm (PDF page 2, initial score 4–7) ----
    mod0: {
      id: "mod0",
      type: "dosing",
      title: "Moderate (4–7) — initial treatment",
      body: [
        "Give DuoNebs — or — albuterol + ipratropium MDI: 3 treatments, each 20 min apart.",
        "Give oral steroid.",
      ],
      calculatorId: "moderateInitialMeds",
      footnoteRefs: ["c"],
      next: "score1",
    },
    score1: {
      id: "score1",
      type: "score",
      title: "2nd score — 1 hour",
      calculatorId: "pras",
      branches: [
        { group: "mild", label: "Mild (0–3)", next: "observe1", tone: "success" },
        { group: "moderate", label: "Moderate (4–7)", next: "mod1", tone: "warning" },
        { group: "severe", label: "Severe (8–11)", next: "sev1", tone: "danger" },
        { group: "critical", label: "Critical (12–15)", next: "crit1", tone: "danger" },
      ],
    },
    observe1: {
      id: "observe1",
      type: "action",
      title: "Observe",
      body: "Observe and obtain 3rd score at 2 hours.",
      next: "score2",
    },
    mod1: {
      id: "mod1",
      type: "decision",
      title: "Moderate (4–7) at 1 hour — response to treatment?",
      branches: [
        {
          label: "Showing improvement, with low/moderate score (4–5) — observe, 3rd score at 2 hours",
          next: "observe1",
          tone: "success",
        },
        {
          label: "Minimal/no improvement, with high/moderate score (6–7) — continuous albuterol",
          next: "mod1cont",
          tone: "warning",
        },
      ],
    },
    mod1cont: {
      id: "mod1cont",
      type: "dosing",
      title: "Start continuous albuterol",
      body: ["Given over 1 hour.", "If giving continuous albuterol, consider mag sulfate + IVF bolus."],
      calculatorId: "contAlbuterol",
      footnoteRefs: ["d"],
      next: "score2",
    },
    score2: {
      id: "score2",
      type: "score",
      title: "3rd score — 2 hours",
      calculatorId: "pras",
      branches: [
        { group: "mild", label: "Mild (0–3)", next: "mild2", tone: "success" },
        { group: "moderate", label: "Moderate (4–7)", next: "mod2", tone: "warning" },
        { group: "severe", label: "Severe (8–11)", next: "sev2fork", tone: "danger" },
        { group: "critical", label: "Critical (12–15)", next: "crit2", tone: "danger" },
      ],
    },
    mild2: {
      id: "mild2",
      type: "decision",
      title: "Mild (0–3) at 2 hours — disposition",
      // The PDF prints superscript d after "admission criteria"; the admission
      // criteria are footnote e (apparent source marker typo — flagged).
      body: "Consider admission criteria vs discharge home.",
      calloutIds: ["admissionCriteria"],
      footnoteRefs: ["e"],
      branches: [
        { label: "Meets admission criteria", next: "admitChoice", tone: "warning" },
        { label: "Discharge home with follow-up instructions & ED return precautions", next: "dischargeHome", tone: "success" },
      ],
    },
    mod2: {
      id: "mod2",
      type: "decision",
      title: "Moderate (4–7) at 2 hours — response to treatment?",
      branches: [
        { label: "Showing improvement", next: "mod2improve", tone: "success" },
        { label: "No improvement / worsening", next: "mod2cont", tone: "warning" },
      ],
    },
    mod2improve: {
      id: "mod2improve",
      type: "dosing",
      title: "Wean to q2h albuterol",
      body: [
        "D/c continuous albuterol and obtain hourly scores if showing improvement.",
        "Give q2 albuterol neb if tolerating q2 treatments.",
      ],
      calculatorId: "q2Albuterol",
      footnoteRefs: ["d"],
      next: "admitChoice",
    },
    mod2cont: {
      id: "mod2cont",
      type: "dosing",
      title: "Continuous albuterol",
      body: ["Mag sulfate / IVF bolus if not already given."],
      calculatorId: "contAlbuterol",
      footnoteRefs: ["d"],
      next: "admitChoice",
    },

    // ---- Severe/critical arm (PDF page 3) ----
    sev0: {
      id: "sev0",
      type: "dosing",
      title: "Severe (8–11) — initial treatment",
      body: [
        "Continuous albuterol + 1.5 mg ipratropium bromide, given over 1 hour.",
        "Consider mag sulfate + IVF bolus.",
        "Give oral prednisone/prednisolone or IV methylpred.",
      ],
      calculatorId: "severeInitialMeds",
      footnoteRefs: ["c", "d"],
      next: "p3score1",
    },
    crit0: {
      id: "crit0",
      type: "dosing",
      title: "Critical (12–15) — initial treatment",
      body: [
        "Continuous albuterol + 1.5 mg ipratropium bromide, given over 1 hour.",
        "Give mag sulfate + IVF bolus.",
        "Give IV methylpred.",
        "Consider IM epinephrine.",
      ],
      calculatorId: "criticalInitialMeds",
      footnoteRefs: ["d", "f"],
      next: "p3score1",
    },
    p3score1: {
      id: "p3score1",
      type: "score",
      title: "2nd score — 1 hour",
      calculatorId: "pras",
      branches: [
        { group: "mild", label: "Mild (0–3)", next: "p3mild1", tone: "success" },
        { group: "moderate", label: "Moderate (4–7)", next: "p3mild1", tone: "success" },
        { group: "severe", label: "Severe (8–11)", next: "sev1", tone: "danger" },
        { group: "critical", label: "Critical (12–15)", next: "crit1", tone: "danger" },
      ],
    },
    p3mild1: {
      id: "p3mild1",
      type: "decision",
      title: "< 8 at 1 hour — response to treatment?",
      branches: [
        {
          label: "High/moderate score (6–7) — continuous albuterol",
          next: "p3mild1cont",
          tone: "warning",
        },
        {
          label: "Showing improvement, with low/moderate score (4–5) — d/c continuous albuterol, 3rd score at 2 hours",
          next: "p3mild1dc",
          tone: "success",
        },
      ],
    },
    p3mild1cont: {
      id: "p3mild1cont",
      type: "dosing",
      title: "Continuous albuterol",
      calculatorId: "contAlbuterol",
      footnoteRefs: ["d"],
      next: "p3score2",
    },
    p3mild1dc: {
      id: "p3mild1dc",
      type: "action",
      title: "D/c continuous albuterol",
      body: "Obtain 3rd score at 2 hours.",
      footnoteRefs: ["d"],
      next: "p3score2",
    },
    sev1: {
      id: "sev1",
      type: "dosing",
      title: "Severe (8–11) at 1 hour",
      body: ["Give mag sulfate + IVF bolus if not already given.", "Obtain portable CXR."],
      calculatorId: "contAlbuterol",
      footnoteRefs: ["d"],
      next: "p3score2",
    },
    crit1: {
      id: "crit1",
      type: "dosing",
      title: "Critical (12–15) at 1 hour",
      body: ["Obtain portable CXR.", "Consider PPV."],
      calculatorId: "contAlbuterol",
      footnoteRefs: ["d"],
      tone: "danger",
      next: "admitPICU",
    },
    p3score2: {
      id: "p3score2",
      type: "score",
      title: "3rd score — 2 hours",
      calculatorId: "pras",
      branches: [
        { group: "mild", label: "Mild (0–3)", next: "p3mild2", tone: "success" },
        { group: "moderate", label: "Moderate (4–7)", next: "p3mild2", tone: "success" },
        { group: "severe", label: "Severe (8–11)", next: "sev2fork", tone: "danger" },
        { group: "critical", label: "Critical (12–15)", next: "crit2", tone: "danger" },
      ],
    },
    p3mild2: {
      id: "p3mild2",
      type: "decision",
      title: "< 8 at 2 hours — response to treatment?",
      branches: [
        { label: "Showing improvement", next: "p3mild2improve", tone: "success" },
        {
          label: "Minimal/no improvement and high/moderate score",
          next: "p3mild2cont",
          tone: "warning",
        },
      ],
    },
    p3mild2improve: {
      id: "p3mild2improve",
      type: "dosing",
      title: "Wean to q2h albuterol",
      body: [
        "D/c continuous albuterol and obtain hourly scores if showing improvement.",
        "Give q2 albuterol neb if tolerating q2 treatments.",
      ],
      calculatorId: "q2Albuterol",
      footnoteRefs: ["d"],
      next: "admitChoice",
    },
    p3mild2cont: {
      id: "p3mild2cont",
      type: "dosing",
      title: "Continuous albuterol",
      calculatorId: "contAlbuterol",
      footnoteRefs: ["d"],
      next: "admitChoice",
    },
    sev2fork: {
      id: "sev2fork",
      type: "decision",
      title: "Severe (8–11) at 2 hours",
      branches: [
        { label: "Continuous albuterol", next: "sev2cont", tone: "danger" },
        {
          label: "Give 1st q2 albuterol neb, if tolerating q2 treatments",
          next: "sev2q2",
          tone: "warning",
        },
      ],
    },
    sev2cont: {
      id: "sev2cont",
      type: "dosing",
      title: "Continuous albuterol",
      calculatorId: "contAlbuterol",
      footnoteRefs: ["d"],
      next: "admitChoice",
    },
    sev2q2: {
      id: "sev2q2",
      type: "dosing",
      title: "Give 1st q2 albuterol neb",
      calculatorId: "q2Albuterol",
      next: "admitChoice",
    },
    crit2: {
      id: "crit2",
      type: "dosing",
      title: "Critical (12–15) at 2 hours",
      body: ["Obtain portable CXR if not already done.", "Consider BiPAP."],
      calculatorId: "contAlbuterol",
      footnoteRefs: ["d"],
      tone: "danger",
      next: "admitPICU",
    },

    // ---- Convergent disposition ----
    admitChoice: {
      id: "admitChoice",
      type: "branch",
      title: "Admit — Peds floor vs PICU",
      calloutIds: ["admissionCriteria"],
      footnoteRefs: ["e"],
      branches: [
        {
          label: "Floor: tolerating albuterol q2h or less frequent, up to 2 L/kg (max 20 L) HHFNC, up to 50% FiO₂",
          next: "admitFloor",
          tone: "warning",
        },
        {
          label: "PICU: requiring continuous albuterol, > 2 L/kg or > 20 L HHFNC, > 50% FiO₂",
          next: "admitPICU",
          tone: "danger",
        },
      ],
    },
    admitFloor: {
      id: "admitFloor",
      type: "outcome",
      title: "Admit to Peds floor",
      disposition: "admit-floor",
      tone: "warning",
    },
    admitPICU: {
      id: "admitPICU",
      type: "outcome",
      title: "Admit to PICU",
      disposition: "admit-picu",
      tone: "danger",
    },
    dischargeHome: {
      id: "dischargeHome",
      type: "outcome",
      title: "Discharge home",
      body: "D/c home with follow-up instructions & ED return precautions.",
      disposition: "discharge",
      tone: "success",
      footnoteRefs: ["g", "h"],
    },
  },
};
