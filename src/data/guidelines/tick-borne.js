// Pediatric Tick-borne Infection Management — MU Pediatric Service Line CPG (May 2026).
// Transcribed from tick-borne.pdf. Linear work-up with optional Lyme/Tularemia
// considerations, a computed doxycycline dose, and admission branching.

export default {
  id: "tick-borne",
  title: "Tick-borne Infection",
  fullTitle: "Tick-borne Infection Management",
  category: "infectious",
  icon: "Bug",
  keywords: ["tick", "tick-borne", "tickborne", "ehrlichia", "rocky mountain spotted fever", "rmsf", "lyme", "tularemia", "doxycycline", "fever"],
  shortDescription: "Work-up and doxycycline treatment for suspected tick-borne illness.",
  sourcePdf: "tick-borne.pdf",
  version: "2026",
  lastEdited: "May 2026",
  authors: ["P Hunter", "A Padhye", "MB Bernardin"],
  verified: true,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF.",

  inclusion: ["Febrile illness with outdoor exposure or tick bite"],
  exclusion: [],

  calculators: {
    doxycycline: {
      kind: "dosing",
      id: "doxycycline",
      name: "Doxycycline",
      drugs: [
        {
          name: "Doxycycline",
          route: "PO",
          dose: { mgPerKg: 2.2, maxMg: 100, frequency: "BID" },
          note: "Safe in all age groups; start promptly when suspicion is high. Counsel re: photosensitivity, GI upset, pill esophagitis — take with food, avoid dairy around dosing.",
        },
      ],
    },
  },

  callouts: {
    idConsult: {
      tone: "info",
      title: "Pediatric ID on-call",
      body: "Contact Pediatric Infectious Diseases on-call with any questions or concerns.",
    },
  },

  footnotes: {
    a: "Missouri-endemic tick-borne infections: Ehrlichiosis, Rocky Mountain Spotted Fever (RMSF), Tularemia, and Southern tick-associated rash illness (STARI).",
    b: "Common symptoms: fever, chills, malaise, fatigue, headache, myalgias, arthralgias, GI symptoms, lymphadenopathy, bullseye or maculopapular rash, edema, neurologic changes.",
    c: "Only 50–60% of patients recall a tick bite. Recent outdoor exposure with a compatible presentation should raise suspicion.",
    d: "Common lab abnormalities: leukopenia, thrombocytopenia, hyponatremia, elevated transaminases.",
    e: "In well-appearing outpatient/ED patients, tick-borne infections can often be diagnosed clinically and treated without labs. Do not delay treatment while awaiting serologies.",
    f: "If not well-appearing, obtain diagnostic testing before doxycycline when possible — Ehrlichia PCR may become negative after 1–2 doses.",
    g: "Early RMSF serology may be negative; if suspicion is high, treat and consider repeat serology in 1–2 weeks.",
    h: "Lyme is endemic to: Minnesota, Wisconsin, Northern Iowa/Illinois, Western Michigan, and the Northeastern US. STARI (lone star tick, Missouri) can cause a bullseye-like rash mistaken for Lyme.",
    i: "Most common tularemia presentations are glandular and ulceroglandular. If suspicion is high or serology positive, consult pediatric ID.",
    j: "Doxycycline is safe in all ages and should be started promptly when suspicion is high.",
    k: "Oral doxycycline has high bioavailability and is preferred even in critically ill patients unless contraindicated.",
    l: "Admit patients meeting pediatric SIRS/sepsis criteria, requiring respiratory/nutritional/hydration/pressor support, unable to perform ADLs, or at risk of acute decompensation.",
  },

  references: [
    "Tickborne Diseases of the United States. CDC, Sixth Edition. 2022.",
    "Red Book: 2024–2027 Report of the Committee on Infectious Diseases. AAP. 2024. Pages 361-365, 727-730, 929-932.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "Tick-borne Infection Management",
      body: "For the child with febrile illness and outdoor exposure or tick bite.",
      footnoteRefs: ["a", "b", "c"],
      next: "workup",
    },
    workup: {
      id: "workup",
      type: "action",
      title: "Initial labs",
      items: ["Obtain CBC and CMP", "If concern for sepsis, also obtain blood culture"],
      footnoteRefs: ["d"],
      next: "orderTickSP",
    },
    orderTickSP: {
      id: "orderTickSP",
      type: "action",
      title: "Order tick-borne work-up",
      items: [
        "Use the PED Tickborne Infectious Disease SP",
        "Ehrlichia by PCR",
        "Rocky Mountain Spotted Fever Group IgG, IgM antibodies",
      ],
      footnoteRefs: ["e", "f", "g"],
      calloutIds: ["idConsult"],
      next: "lymeTravel",
    },
    lymeTravel: {
      id: "lymeTravel",
      type: "decision",
      title: "Travel to a Lyme-endemic area?",
      footnoteRefs: ["h"],
      branches: [
        { label: "Yes", next: "orderLyme" },
        { label: "No", next: "tularemiaConcern" },
      ],
    },
    orderLyme: {
      id: "orderLyme",
      type: "info",
      title: "Consider ordering Lyme antibodies (total)",
      next: "tularemiaConcern",
    },
    tularemiaConcern: {
      id: "tularemiaConcern",
      type: "decision",
      title: "Concern for tularemia?",
      footnoteRefs: ["i"],
      branches: [
        { label: "Yes", next: "orderFrancisella" },
        { label: "No", next: "startDoxy" },
      ],
    },
    orderFrancisella: {
      id: "orderFrancisella",
      type: "info",
      title: "Order Francisella tularensis antibody",
      body: "IgM and IgG, ELISA, serum.",
      next: "startDoxy",
    },
    startDoxy: {
      id: "startDoxy",
      type: "dosing",
      title: "Start oral doxycycline",
      body: "Dose BID. Do not delay treatment while awaiting serologies.",
      calculatorId: "doxycycline",
      footnoteRefs: ["j", "k"],
      next: "admissionCriteria",
    },
    admissionCriteria: {
      id: "admissionCriteria",
      type: "decision",
      title: "Meeting admission criteria?",
      footnoteRefs: ["l"],
      branches: [
        { label: "No", next: "dischargePath" },
        { label: "Yes", next: "admitPath", tone: "warning" },
      ],
    },

    dischargePath: {
      id: "dischargePath",
      type: "action",
      title: "Discharge home",
      items: ["7 days of doxycycline", "PCP follow-up"],
      next: "dischargeID",
    },
    dischargeID: {
      id: "dischargeID",
      type: "decision",
      title: "Unclear infectious etiology, concern for tularemia, or needing outpatient ID follow-up?",
      branches: [
        { label: "Yes", next: "ambulatoryReferral" },
        { label: "No", next: "dischargeDone", tone: "success" },
      ],
    },
    ambulatoryReferral: {
      id: "ambulatoryReferral",
      type: "outcome",
      title: "Discharge — ambulatory referral to Pediatric ID",
      disposition: "discharge",
      tone: "success",
    },
    dischargeDone: {
      id: "dischargeDone",
      type: "outcome",
      title: "Discharge home",
      disposition: "discharge",
      tone: "success",
    },

    admitPath: {
      id: "admitPath",
      type: "action",
      title: "Admit to Pediatrics vs PICU",
      items: ["Admit per unit protocols"],
      next: "admitID",
    },
    admitID: {
      id: "admitID",
      type: "decision",
      title: "Critically ill, unclear etiology, concern for tularemia, or needing ID follow-up?",
      branches: [
        { label: "Yes", next: "consultID", tone: "warning" },
        { label: "No", next: "admitDone", tone: "warning" },
      ],
    },
    consultID: {
      id: "consultID",
      type: "outcome",
      title: "Admit + consult Pediatric Infectious Diseases",
      disposition: "consult",
      tone: "warning",
    },
    admitDone: {
      id: "admitDone",
      type: "outcome",
      title: "Admit to Pediatrics vs PICU",
      disposition: "admit-floor",
      tone: "warning",
    },
  },
};
