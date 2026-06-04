// Croup Management — University of Missouri Pediatric Service Line CPG (V9, July 2025).
// Transcribed verbatim from croup.pdf. This file is the reference template every
// other guideline follows. Doses/scores are copied exactly; verify against source.

// Reusable drug definitions (composed into the calculators below).
const DEXAMETHASONE = {
  name: "Dexamethasone",
  route: "PO (IV formulation given PO preferred)",
  dose: { mgPerKg: 0.6, maxMg: 10 },
  note: "0.15 mg/kg is equally effective and may be considered in mild croup. IV formulation given PO = higher concentration, less volume.",
};

const RACEMIC_EPI = {
  name: "Racemic epinephrine 2.25%",
  route: "Nebulized (high-flow)",
  displayDose: "0.5 mL in 2.5 mL normal saline",
  note: "Maximum frequency q20min.",
};

export default {
  id: "croup",
  title: "Croup",
  fullTitle: "Croup Management",
  category: "respiratory",
  icon: "Wind",
  keywords: [
    "croup",
    "stridor",
    "barky cough",
    "barking cough",
    "westley",
    "racemic epinephrine",
    "dexamethasone",
    "laryngotracheobronchitis",
  ],
  shortDescription: "Westley-score–driven pathway for the well child 6 mo–6 yr with croup.",
  sourcePdf: "croup.pdf",
  version: "V9",
  lastEdited: "July 2025",
  authors: [
    "P Nathan",
    "M Maskeri",
    "S Shah",
    "K Koehn",
    "M Nguyen",
    "M Williams",
    "C Butcher",
    "M Hayes",
    "K Cutler",
    "MB Bernardin",
  ],
  verified: false,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF.",

  inclusion: ["6 months – 6 years old", "Otherwise well appearing", "Clinical diagnosis of croup"],
  exclusion: [
    "Known upper airway deformity or recent intubation/instrumentation of the upper airway",
    "Toxic appearing",
    "Immunocompromised / unvaccinated",
    "Asymmetric lung exam",
    "Congenital heart disease, neuromuscular disease, or chronic lung disease",
  ],

  calculators: {
    westley: {
      kind: "score",
      engine: "additive",
      id: "westley",
      name: "Westley Croup Score",
      reference: "Westley CR, et al. Am J Dis Child. 1978. PMID: 347921.",
      items: [
        {
          id: "stridor",
          label: "Stridor",
          options: [
            { label: "None", value: 0 },
            { label: "Audible with stethoscope (at rest)", value: 1 },
            { label: "Audible without stethoscope (at rest)", value: 2 },
          ],
        },
        {
          id: "retractions",
          label: "Retractions",
          options: [
            { label: "None", value: 0 },
            { label: "Mild", value: 1 },
            { label: "Moderate", value: 2 },
            { label: "Severe", value: 3 },
          ],
        },
        {
          id: "airEntry",
          label: "Air entry",
          options: [
            { label: "Normal", value: 0 },
            { label: "Decreased", value: 1 },
            { label: "Severely decreased", value: 2 },
          ],
        },
        {
          id: "cyanosis",
          label: "Cyanosis",
          options: [
            { label: "None", value: 0 },
            { label: "With agitation", value: 4 },
            { label: "At rest", value: 5 },
          ],
        },
        {
          id: "loc",
          label: "Level of consciousness",
          options: [
            { label: "Normal", value: 0 },
            { label: "Altered", value: 5 },
          ],
        },
      ],
      bands: [
        { id: "mild", label: "Mild croup", max: 2, tone: "success" },
        { id: "moderate", label: "Moderate croup", min: 3, max: 5, tone: "warning" },
        { id: "severe", label: "Severe croup", min: 6, max: 11, tone: "danger" },
        { id: "impendingFailure", label: "Impending respiratory failure", min: 12, tone: "danger" },
      ],
      routingGroups: {
        mild: ["mild"],
        moderateSevere: ["moderate", "severe", "impendingFailure"],
      },
    },

    dexamethasone: { kind: "dosing", id: "dexamethasone", name: "Dexamethasone", drugs: [DEXAMETHASONE] },
    racemicEpi: {
      kind: "dosing",
      id: "racemicEpi",
      name: "Racemic epinephrine",
      drugs: [RACEMIC_EPI],
    },
    dexAndRacemic: {
      kind: "dosing",
      id: "dexAndRacemic",
      name: "Dexamethasone + racemic epinephrine",
      drugs: [DEXAMETHASONE, RACEMIC_EPI],
    },
  },

  callouts: {
    bacterialTracheitis: {
      tone: "warning",
      title: "Consider bacterial tracheitis",
      body: "For children who are toxic appearing or have a poor response to racemic epinephrine.",
    },
    dischargeCriteria: {
      tone: "info",
      title: "Discharge criteria",
      body: [
        "Comfortable respirations on room air",
        "Adequate PO intake",
        "Caregiver agreeable / comfortable with discharge",
        "Reliable transportation back to the ED if needed",
        "Acceptable travel distance from home to the ED",
      ],
    },
  },

  references: [
    "Westley CR, Cotton EK, Brooks JG. Nebulized racemic epinephrine by IPPB for the treatment of croup. Am J Dis Child. 1978;132(5):484-7. PMID: 347921.",
    "Yang W-C, et al. Westley score and clinical factors in predicting the outcome of croup in the pediatric emergency department. Pediatr Pulmonol. 2017;52(10):1329-1334.",
    "Chub-Uppakarn S, Sangsupawanich P. A randomized comparison of dexamethasone 0.15 mg/kg vs 0.6 mg/kg for moderate to severe croup. Int J Pediatr Otorhinolaryngol. 2007;71(3):473-7. PMID: 17208307.",
    "Geelhoed GC, Macdonald WB. Oral dexamethasone in the treatment of croup: 0.15 vs 0.3 vs 0.6 mg/kg. Pediatr Pulmonol. 1995;20(6):362-8. PMID: 8649915.",
    "Kelley PB, Simon JE. Racemic epinephrine use in croup and disposition. Am J Emerg Med. 1992;10(3):181-3. PMID: 1375027.",
    "Ledwith CA, Shea LM, Mauro RD. Safety and efficacy of nebulized racemic epinephrine with oral dexamethasone in outpatient croup. Ann Emerg Med. 1995;25(3):331-7. PMID: 7864472.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "Croup Management",
      body: "For the well-appearing child 6 months–6 years with clinical croup. Review the criteria below, then begin the pathway.",
      next: "initialWestley",
    },

    initialWestley: {
      id: "initialWestley",
      type: "score",
      title: "Calculate the initial Westley Croup Score",
      calculatorId: "westley",
      branches: [
        { group: "mild", label: "Mild (≤ 2)", next: "giveDexMild" },
        { group: "moderateSevere", label: "Moderate / Severe (≥ 3)", next: "giveDexRE", tone: "warning" },
      ],
    },

    // ---- Mild pathway ----
    giveDexMild: {
      id: "giveDexMild",
      type: "dosing",
      title: "Give dexamethasone",
      body: "One-time dose.",
      calculatorId: "dexamethasone",
      next: "gotREwithEMS",
    },
    gotREwithEMS: {
      id: "gotREwithEMS",
      type: "decision",
      title: "Did the patient receive racemic epinephrine with EMS?",
      branches: [
        { label: "Yes — received racemic epi", next: "monitorMild" },
        { label: "No", next: "dischargeHome" },
      ],
    },
    monitorMild: {
      id: "monitorMild",
      type: "decision",
      title: "Monitor for 2 hours from the last racemic epinephrine",
      body: "After 2 hours of observation:",
      branches: [
        { label: "No stridor at rest", next: "dischargeHome", tone: "success" },
        { label: "Develops stridor at rest", next: "give2ndRE", tone: "warning" },
      ],
    },

    // ---- Moderate / Severe pathway ----
    giveDexRE: {
      id: "giveDexRE",
      type: "dosing",
      title: "Give dexamethasone and 1st racemic epinephrine",
      body: "Give dexamethasone now. Give racemic epinephrine if stridor at rest.",
      calculatorId: "dexAndRacemic",
      next: "rescore30",
    },
    rescore30: {
      id: "rescore30",
      type: "score",
      title: "Rescore (Westley) 30 minutes after racemic epinephrine",
      calculatorId: "westley",
      branches: [
        { group: "mild", label: "Now mild", next: "monitorModToMild" },
        { group: "moderateSevere", label: "Still moderate / severe", next: "give2ndREifStridor", tone: "warning" },
      ],
    },
    monitorModToMild: {
      id: "monitorModToMild",
      type: "decision",
      title: "Monitor for 2 hours from the last racemic epinephrine",
      body: "After 2 hours of observation:",
      branches: [
        { label: "No stridor at rest", next: "dischargeHome", tone: "success" },
        { label: "Develops stridor at rest", next: "give2ndRE", tone: "warning" },
      ],
    },
    give2ndRE: {
      id: "give2ndRE",
      type: "dosing",
      title: "Give 2nd racemic epinephrine",
      body: "Administer a 2nd dose of racemic epinephrine (if stridor at rest).",
      calculatorId: "racemicEpi",
      calloutIds: ["bacterialTracheitis"],
      next: "monitorConverge",
    },
    give2ndREifStridor: {
      id: "give2ndREifStridor",
      type: "dosing",
      title: "Give 2nd racemic epinephrine if stridor at rest",
      calculatorId: "racemicEpi",
      calloutIds: ["bacterialTracheitis"],
      next: "monitorConverge",
    },

    // ---- Convergent disposition ----
    monitorConverge: {
      id: "monitorConverge",
      type: "branch",
      title: "Monitor for 2 hours from the last racemic epinephrine",
      body: "Based on the response over the 2-hour observation:",
      branches: [
        { label: "No racemic needed and meeting discharge criteria", next: "dischargeHome", tone: "success" },
        { label: "Needs 3rd racemic dose within < 2 hours", next: "admitPICU", tone: "danger" },
        {
          label: "3rd racemic needed at 2 hours, or not meeting discharge criteria",
          next: "admitFloor",
          tone: "warning",
        },
      ],
    },

    dischargeHome: {
      id: "dischargeHome",
      type: "outcome",
      title: "Discharge home",
      disposition: "discharge",
      tone: "success",
      calloutIds: ["dischargeCriteria"],
    },
    admitFloor: {
      id: "admitFloor",
      type: "outcome",
      title: "Admit to floor",
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
  },
};
