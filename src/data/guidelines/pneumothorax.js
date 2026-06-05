// Pediatric Spontaneous Pneumothorax — MU Pediatric Service Line CPG (Oct 2025).
// Transcribed from pneumothorax.pdf. Primary vs secondary; the stable and
// unstable primary pathways converge on the "unresolved symptoms?" decision.

export default {
  id: "pneumothorax",
  title: "Spontaneous Pneumothorax",
  fullTitle: "Spontaneous Pneumothorax",
  category: "respiratory",
  icon: "HeartPulse",
  keywords: ["pneumothorax", "spontaneous pneumothorax", "chest pain", "dyspnea", "needle aspiration", "chest tube", "vats", "thoracostomy"],
  shortDescription: "Primary vs secondary spontaneous pneumothorax management and disposition.",
  sourcePdf: "pneumothorax.pdf",
  version: "v2",
  lastEdited: "October 2025",
  authors: ["MaryBeth Bernardin", "Tara Kempker", "Yousef El-Gohary", "Rony Marwan"],
  verified: true,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF.",

  inclusion: ["History/exam consistent with spontaneous pneumothorax"],
  exclusion: [
    "Age < 60 days or > 18 years",
    "Traumatic pneumothorax",
    "Tension physiology (hypoxia, tachypnea, diminished/absent breath sounds, subcutaneous air, tracheal deviation, hypotension)",
    "Recurrent pneumothorax",
  ],

  footnotes: {
    a: "Typical presentation: sudden onset of dyspnea and pleuritic/ipsilateral chest pain; tachypnea, increased work of breathing, ipsilateral decreased breath sounds and chest excursion.",
    c: "Primary spontaneous pneumothorax: no underlying lung disease predisposing to air leak.",
    d: "Secondary spontaneous pneumothorax: complication of underlying lung disease (asthma, cystic fibrosis, necrotizing pneumonia, interstitial lung disease).",
    e: "Discharge criteria: pain controlled, maintaining normal O₂ saturations off supplemental O₂, ambulating without dyspnea.",
  },

  references: [
    "Dotson K, Johnson LH. Pediatric spontaneous pneumothorax. Pediatr Emerg Care. 2012;28(7):715-20.",
    "Janahi IA, et al. Spontaneous pneumothorax in children. UpToDate. 2025.",
    "Robinson PD, et al. Evidence-based management of paediatric primary spontaneous pneumothorax. Paediatr Respir Rev. 2009;10(3):110-7.",
    "Robinson PD, et al. Management of paediatric spontaneous pneumothorax: a multicentre retrospective case series. Arch Dis Child. 2015;100(10):918-23.",
    "Brown SGA, et al. Conservative versus Interventional Treatment for Spontaneous Pneumothorax. NEJM. 2020;382(5):405-415.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "Spontaneous Pneumothorax",
      body: "For the child with history/exam consistent with spontaneous pneumothorax.",
      footnoteRefs: ["a"],
      next: "initialMgmt",
    },
    initialMgmt: {
      id: "initialMgmt",
      type: "action",
      title: "Initial management",
      items: ["Cardiac monitors, continuous pulse ox, 100% FiO₂ via NRB, IV access", "Obtain upright CXR"],
      next: "ptxType",
    },
    ptxType: {
      id: "ptxType",
      type: "branch",
      title: "Type of spontaneous pneumothorax?",
      footnoteRefs: ["c", "d"],
      branches: [
        { label: "Primary", next: "primaryConsult" },
        { label: "Secondary", next: "secondaryMgmt", tone: "warning" },
      ],
    },

    // ---- Primary ----
    primaryConsult: {
      id: "primaryConsult",
      type: "action",
      title: "Consult Pediatric Surgery",
      items: ["Consult Pediatric Surgery"],
      next: "clinicalStability",
    },
    clinicalStability: {
      id: "clinicalStability",
      type: "decision",
      title: "Clinically stable or unstable?",
      branches: [
        { label: "Clinically stable", next: "stableObs", tone: "success" },
        { label: "Clinically unstable (significant dyspnea, pain, and/or hypoxemia)", next: "unstableAspiration", tone: "danger" },
      ],
    },
    stableObs: {
      id: "stableObs",
      type: "action",
      title: "Observe",
      items: ["ED observation for 4–6 hours vs admission to Pediatric Surgery"],
      next: "unresolved",
    },
    unstableAspiration: {
      id: "unstableAspiration",
      type: "action",
      title: "Needle aspiration",
      items: ["Needle aspiration", "Repeat upright CXR", "Admission to Pediatric Surgery"],
      next: "unresolved",
    },
    unresolved: {
      id: "unresolved",
      type: "decision",
      title: "Unresolved and/or increasing symptoms?",
      branches: [
        { label: "No", next: "dischargeHome", tone: "success" },
        { label: "Yes", next: "tubeThoracostomy", tone: "warning" },
      ],
    },
    dischargeHome: {
      id: "dischargeHome",
      type: "outcome",
      title: "Discharge home",
      body: ["Pain controlled", "Maintaining normal O₂ saturations off supplemental O₂", "Ambulating without dyspnea"],
      disposition: "discharge",
      tone: "success",
      footnoteRefs: ["e"],
    },
    tubeThoracostomy: {
      id: "tubeThoracostomy",
      type: "action",
      title: "Tube thoracostomy",
      items: ["Tube thoracostomy", "Admit to Pediatric Surgery"],
      next: "airLeak",
    },
    airLeak: {
      id: "airLeak",
      type: "decision",
      title: "Unresolved, expanding, symptomatic, and/or air leak after 2–3 days?",
      branches: [
        { label: "Yes", next: "surgicalIntervention", tone: "warning" },
        { label: "No", next: "admitSurgery", tone: "success" },
      ],
    },
    surgicalIntervention: {
      id: "surgicalIntervention",
      type: "outcome",
      title: "Surgical intervention",
      body: ["CT chest for operative planning", "VATS ± pleurodesis or pleurectomy per Pediatric Surgery"],
      disposition: "or",
      tone: "warning",
    },
    admitSurgery: {
      id: "admitSurgery",
      type: "outcome",
      title: "Admit to Pediatric Surgery",
      body: ["Continue chest tube management"],
      disposition: "admit-floor",
      tone: "warning",
    },

    // ---- Secondary ----
    secondaryMgmt: {
      id: "secondaryMgmt",
      type: "action",
      title: "Secondary pneumothorax",
      items: ["Consult Pediatric Surgery", "Obtain CT chest"],
      next: "secondaryOutcome",
    },
    secondaryOutcome: {
      id: "secondaryOutcome",
      type: "outcome",
      title: "Tube thoracostomy vs surgery per Pediatric Surgery",
      body: ["VATS ± pleurodesis or pleurectomy", "Admit to Pediatric Surgery"],
      disposition: "admit-floor",
      tone: "warning",
    },
  },
};
