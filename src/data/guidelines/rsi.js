// Pediatric Rapid Sequence Intubation — MU Pediatric Service Line CPG (Oct 2025).
// Transcribed from rsi.pdf. The most complex guideline: linear prep checklists,
// two nested sedation decision trees, an age-indexed equipment lookup table,
// paralytic + infusion reference tables, computed induction/atropine dosing, and
// a failed-intubation loop (reattempt -> back to "successful intubation?").

export default {
  id: "rsi",
  title: "RSI",
  fullTitle: "Rapid Sequence Intubation",
  category: "trauma-critical",
  icon: "Syringe",
  keywords: [
    "rsi",
    "rapid sequence intubation",
    "intubation",
    "airway",
    "ketamine",
    "rocuronium",
    "succinylcholine",
    "sedation",
    "paralytic",
    "ett",
    "post-intubation",
  ],
  shortDescription: "Full RSI pathway: prep, sedation/paralytic choice, intubation, post-intubation sedation.",
  sourcePdf: "rsi.pdf",
  version: "2025",
  lastEdited: "October 2025",
  authors: ["MB Bernardin", "W Ficker", "M Hayes", "K Cutler", "K Goddard", "M Gaul", "D. Lopez-Domowicz"],
  verified: true,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF.",

  inclusion: [
    "Concern for respiratory failure (hypoxemic PaO₂ < 60 or hypercapnic PaCO₂ > 50)",
    "Inability to protect the airway",
  ],
  exclusion: ["Adult patients > 18 years"],

  calculators: {
    rsiKetamine: {
      kind: "dosing",
      id: "rsiKetamine",
      name: "Ketamine (RSI induction)",
      drugs: [{ name: "Ketamine", route: "IV", dose: { mgPerKg: [1, 2], maxMg: 100 } }],
    },
    rsiFentanyl: {
      kind: "dosing",
      id: "rsiFentanyl",
      name: "Fentanyl (RSI induction)",
      drugs: [
        {
          name: "Fentanyl",
          route: "IV",
          dose: { mcgPerKg: [1, 3], maxMcg: 100 },
          note: "Give over 30–60 sec to avoid chest wall rigidity.",
        },
      ],
    },
    midazPropofol: {
      kind: "dosing",
      id: "midazPropofol",
      name: "Midazolam or Propofol (RSI induction)",
      drugs: [
        { name: "Midazolam", route: "IV", dose: { mgPerKg: [0.2, 0.3], maxMg: 10 } },
        {
          name: "Propofol",
          route: "IV",
          dose: { mgPerKg: [1, 2], maxMg: 100 },
          contraindications: ["egg/soy allergy", "ketogenic diet"],
        },
      ],
    },
    atropine: {
      kind: "dosing",
      id: "atropine",
      name: "Atropine (pre-treatment)",
      drugs: [
        {
          name: "Atropine",
          route: "IV",
          dose: { mgPerKg: 0.02, minMg: 0.1, maxMg: 0.5 },
          note: "Pre-treat infants and/or pre-intubation bradycardia. Also if re-dosing succinylcholine.",
        },
      ],
    },
  },

  callouts: {
    difficultAirway: {
      tone: "warning",
      title: "Difficult airway? Consult anesthesia (771-8233)",
      body: "Indicators: history of difficult airway, small chin/receded jaw, inability to fully open mouth, short neck/poor mobility, facial or upper-airway trauma, signs of upper-airway obstruction (hoarseness, stridor, drooling, tripoding), facial syndromes (Pierre Robin, Treacher Collins, Goldenhar).",
    },
    chestWallRigidity: {
      tone: "warning",
      title: "Fentanyl caution",
      body: "Give over 30–60 seconds to avoid chest wall rigidity.",
    },
    infusionUnits: {
      tone: "warning",
      title: "Verify propofol infusion units",
      body: "Propofol units below mirror the source PDF (mg/kg/min). Standard propofol infusions are dosed in mcg/kg/min — confirm with pharmacy and the source document before ordering.",
    },
  },

  footnotes: {
    a: "Respiratory failure may be hypoxemic (PaO₂ < 60 mmHg) or hypercapnic (PaCO₂ > 50 mmHg).",
    c: "Consider 5–10 mL/kg IVF boluses if concern for cardiac dysfunction including myocarditis, congenital heart disease, or other causes of CHF or fluid overload.",
    h: "Relative contraindications to succinylcholine: increased IOP, increased ICP (controversial), known pseudocholinesterase deficiency (e.g. organophosphate poisoning, congenital enzyme deficiency).",
    i: [
      "Sugammadex dosing (rocuronium reversal):",
      "Emergent reversal within 3 min of rocuronium: 4 mg/kg",
      "TOF 0–1: 4 mg/kg",
      "TOF 1–3: 2 mg/kg",
      "TOF 4 and high risk: 2 mg/kg",
    ],
  },

  references: [
    "Patel et al. Age and the onset of desaturation in apneic children. Can J Anaesth. 1994.",
    "Agrawal et al. Rapid sequence intubation (RSI) in children for emergency medicine: Approach. UpToDate. 2025.",
    "Indian Academy of Pediatrics. National Treatment Guidelines. 2025.",
    "Fastle et al. Pediatric rapid sequence intubation: incidence of reflex bradycardia and effects of pretreatment with atropine. Pediatr Emerg Care. 2004.",
    "Nationwide Children's Hospital. Rapid Sequence Intubation & Post Intubation, Sedation and Analgesia: Emergency Department. 2024.",
  ],

  startNodeId: "intro",
  nodes: {
    // ---------- Preparation (page 1) ----------
    intro: {
      id: "intro",
      type: "start",
      title: "Rapid Sequence Intubation",
      body: "For concern for respiratory failure and/or inability to protect the airway. Review the exclusion criteria, then work through preparation.",
      footnoteRefs: ["a"],
      next: "prepAccess",
    },
    prepAccess: {
      id: "prepAccess",
      type: "action",
      title: "Access & monitoring",
      items: [
        "Obtain IV access × 2",
        "Apply cardiac monitors, continuous pulse oximetry, ETCO₂ capnography",
        "Consider blood work including VBG and POC glucose",
      ],
      next: "prepHemodynamics",
    },
    prepHemodynamics: {
      id: "prepHemodynamics",
      type: "action",
      title: "Optimize hemodynamics",
      items: [
        "Give 20 mL/kg NS or LR bolus",
        "Pre-oxygenate with 100% O₂ via NRB or BVM for ≥ 2–3 minutes",
      ],
      footnoteRefs: ["c"],
      next: "prepPositioning",
    },
    prepPositioning: {
      id: "prepPositioning",
      type: "action",
      title: "Optimize positioning",
      items: [
        "Align ear to sternal notch",
        "Extend neck to obtain sniffing position (may need shoulder roll for infants / pad under head for older children)",
        "Maintain in-line C-spine stabilization for trauma patients",
      ],
      next: "equipmentSizing",
    },
    equipmentSizing: {
      id: "equipmentSizing",
      type: "lookup",
      title: "Equipment sizing by age",
      body: "ETT, laryngoscope blade, and LMA sizes based on age.",
      table: {
        columns: ["Age", "Uncuffed ETT", "Cuffed ETT", "Miller", "Mac", "LMA"],
        rows: [
          ["Premature <1 kg, <28 wk", "2.5", "—", "0", "—", "1"],
          ["Premature 1–2 kg, 28–34 wk", "3.0", "—", "0", "—", "1"],
          ["Premature 2–3 kg, 34–36 wk", "3.5", "—", "0", "—", "1"],
          ["Term newborn–3 mo", "—", "3.0", "0–1", "—", "1"],
          ["4–12 months", "—", "3.5", "1", "—", "1–1.5"],
          ["1–2 years", "—", "3.5–4.0", "1–2", "1–2", "1.5–2"],
          ["2–4 years", "—", "4.0–4.5", "2", "2", "2"],
          ["4–6 years", "—", "4.5–5.0", "2", "2", "2–2.5"],
          ["6–8 years", "—", "5.0–5.5", "2", "2", "2.5"],
          ["8–10 years", "—", "5.5–6.0", "—", "2–3", "2.5–3"],
          ["10–12 years", "—", "6.0–6.5", "—", "3", "3"],
          ["Adolescent", "—", "7.0–7.5", "—", "3–4", "3–4"],
        ],
      },
      next: "prepChecklist",
    },
    prepChecklist: {
      id: "prepChecklist",
      type: "checklist",
      title: "Intubation checklist",
      items: [
        { text: "Yankauer attached to continuous wall suction" },
        { text: "CMAC on and in optimal position with appropriately sized laryngoscope" },
        { text: "Appropriately sized ETT + one size smaller, with stylet inserted" },
        { text: "In-line ETCO₂ capnography" },
        { text: "Appropriately sized back-up LMA" },
        { text: "BVM with O₂ turned on" },
      ],
      next: "prepTeam",
    },
    prepTeam: {
      id: "prepTeam",
      type: "action",
      title: "Assemble & verbalize the team",
      items: [
        "Primary and back-up laryngoscopist (positioned to see the CMAC screen)",
        "RN administering medications",
        "RT (call 771-7000)",
        "ED pharmacist if available (call 771-7819)",
      ],
      calloutIds: ["difficultAirway"],
      next: "sedStable",
    },

    // ---------- RSI sedation selection (page 2) ----------
    sedStable: {
      id: "sedStable",
      type: "decision",
      title: "RSI sedation — hemodynamically stable patient?",
      branches: [
        { label: "Yes — hemodynamically stable", next: "sedAsthma" },
        { label: "No — unstable", next: "sedSepsis", tone: "warning" },
      ],
    },
    sedAsthma: {
      id: "sedAsthma",
      type: "decision",
      title: "Status asthmaticus?",
      branches: [
        { label: "Yes", next: "doseKetamine" },
        { label: "No", next: "sedEpilepticus" },
      ],
    },
    sedEpilepticus: {
      id: "sedEpilepticus",
      type: "decision",
      title: "Status epilepticus?",
      branches: [
        { label: "Yes", next: "doseMidazPropofol" },
        { label: "No", next: "doseKetamine" },
      ],
    },
    sedSepsis: {
      id: "sedSepsis",
      type: "decision",
      title: "Sepsis?",
      branches: [
        { label: "Yes", next: "sedCatecholamine" },
        { label: "No", next: "sedCardiogenic" },
      ],
    },
    sedCatecholamine: {
      id: "sedCatecholamine",
      type: "decision",
      title: "Catecholamine-depleted shock?",
      body: "e.g. persistent ↓BP despite vasopressors",
      branches: [
        { label: "Yes", next: "doseFentanyl", tone: "danger" },
        { label: "No", next: "doseKetamine" },
      ],
    },
    sedCardiogenic: {
      id: "sedCardiogenic",
      type: "decision",
      title: "Cardiogenic shock?",
      branches: [
        { label: "Yes", next: "doseFentanyl", tone: "danger" },
        { label: "No", next: "doseKetamine" },
      ],
    },
    doseKetamine: {
      id: "doseKetamine",
      type: "dosing",
      title: "RSI sedation: Ketamine",
      calculatorId: "rsiKetamine",
      next: "paralytics",
    },
    doseMidazPropofol: {
      id: "doseMidazPropofol",
      type: "dosing",
      title: "RSI sedation: Midazolam or Propofol",
      calculatorId: "midazPropofol",
      next: "paralytics",
    },
    doseFentanyl: {
      id: "doseFentanyl",
      type: "dosing",
      title: "RSI sedation: Fentanyl",
      calculatorId: "rsiFentanyl",
      calloutIds: ["chestWallRigidity"],
      next: "paralytics",
    },

    // ---------- Paralytics + intubation (pages 2–3) ----------
    paralytics: {
      id: "paralytics",
      type: "lookup",
      title: "Choose a paralytic",
      body: "Give the sedative, then the paralytic in rapid succession.",
      table: {
        columns: ["Drug", "Dose", "Route", "Onset", "Duration", "Comments"],
        rows: [
          [
            "Succinylcholine",
            "IV: 2 mg/kg infants, 1 mg/kg children · IM: 4 mg/kg (max 150 mg)",
            "IV, IM",
            "IV 30–60 s · IM 60 s",
            "IV 4–10 min · IM 10–30 min",
            "NOT recommended: skeletal muscle disease (e.g. muscular dystrophy), neuromuscular disease (e.g. cerebral palsy) or unknown PMH, extensive crush/burn or other cause for hyperkalemia, personal/family history of malignant hyperthermia",
          ],
          [
            "Rocuronium",
            "1 mg/kg",
            "IV",
            "60 s",
            "25–40 min",
            "Sugammadex if reversal needed (see notes)",
          ],
        ],
      },
      footnoteRefs: ["h", "i"],
      next: "doseAtropine",
    },
    doseAtropine: {
      id: "doseAtropine",
      type: "dosing",
      title: "Pre-treat with atropine (if indicated)",
      body: "For infants and/or pre-intubation bradycardia.",
      calculatorId: "atropine",
      next: "intubationSteps",
    },
    intubationSteps: {
      id: "intubationSteps",
      type: "action",
      title: "Intubation",
      items: [
        "Perform time-out with verbalization of team members and roles",
        "Confirm intubation checklist equipment present",
        "Confirm optimization of hemodynamics and positioning",
        "Give sedative followed by paralytic in rapid succession",
        "Limit laryngoscopy to < 30 seconds/attempt; maintain O₂ sat ≥ 92%",
      ],
      next: "intubationSuccess",
    },
    intubationSuccess: {
      id: "intubationSuccess",
      type: "decision",
      title: "Successful endotracheal intubation?",
      branches: [
        { label: "Yes", next: "confirmETT", tone: "success" },
        { label: "No", next: "reattempt", tone: "warning" },
      ],
    },
    reattempt: {
      id: "reattempt",
      type: "action",
      title: "Re-optimize and repeat intubation attempt",
      items: [
        "Team leader verbalizes change in approach",
        "Re-position patient as needed",
        "Re-oxygenate via BVM",
        "Re-dose sedative/paralytic if patient movement or > 10 min since last dose",
        "Give atropine 0.02 mg/kg (max 0.5 mg) if re-dosing succinylcholine",
      ],
      tone: "warning",
      next: "intubationSuccess",
    },
    confirmETT: {
      id: "confirmETT",
      type: "checklist",
      title: "Confirm ETT placement",
      items: [
        { text: "Visualization of ETT passing through the vocal cords" },
        { text: "ETCO₂ color change with waveform present within 20 seconds" },
        { text: "Bilateral breath sounds auscultated" },
        { text: "Confirm appropriate ETT depth (3 × ETT size)" },
      ],
      next: "postIntubationCare",
    },
    postIntubationCare: {
      id: "postIntubationCare",
      type: "action",
      title: "Post-intubation care",
      items: [
        "Secure ETT with benzoin and tape",
        "Portable CXR to confirm ETT placement",
        "NG/OG tube placement",
        "Placement on ventilator by RT",
      ],
      next: "psStable",
    },

    // ---------- Post-intubation sedation/analgesia (page 4) ----------
    psStable: {
      id: "psStable",
      type: "decision",
      title: "Post-intubation sedation — hemodynamically stable patient?",
      branches: [
        { label: "Yes — stable", next: "psAsthma" },
        { label: "No — unstable", next: "psCardiac", tone: "warning" },
      ],
    },
    psAsthma: {
      id: "psAsthma",
      type: "decision",
      title: "Status asthmaticus?",
      branches: [
        { label: "Yes", next: "psKetamine" },
        { label: "No", next: "psEpilepticus" },
      ],
    },
    psEpilepticus: {
      id: "psEpilepticus",
      type: "decision",
      title: "Status epilepticus?",
      branches: [
        { label: "Yes", next: "psMidazPropofol" },
        { label: "No", next: "psTrauma" },
      ],
    },
    psTrauma: {
      id: "psTrauma",
      type: "decision",
      title: "Trauma and/or requiring analgesia?",
      branches: [
        { label: "Yes", next: "psMidazPropofolFentanyl" },
        { label: "No", next: "psMidazPropofolDex" },
      ],
    },
    psCardiac: {
      id: "psCardiac",
      type: "decision",
      title: "Normal cardiac function?",
      branches: [
        { label: "Yes", next: "psKetamineOrFentanyl" },
        { label: "No", next: "psFentanyl" },
      ],
    },
    psKetamine: {
      id: "psKetamine",
      type: "info",
      title: "Post-intubation: Ketamine",
      body: "Ketamine (PICU preferred). See infusion dosing next.",
      next: "infusionDosing",
    },
    psMidazPropofol: {
      id: "psMidazPropofol",
      type: "info",
      title: "Post-intubation: Midazolam or Propofol",
      body: "See infusion dosing next.",
      next: "infusionDosing",
    },
    psMidazPropofolFentanyl: {
      id: "psMidazPropofolFentanyl",
      type: "info",
      title: "Post-intubation: Midazolam or Propofol + Fentanyl",
      body: "PICU preferred. See infusion dosing next.",
      next: "infusionDosing",
    },
    psMidazPropofolDex: {
      id: "psMidazPropofolDex",
      type: "info",
      title: "Post-intubation: Midazolam, Propofol, or Dexmedetomidine",
      body: "PICU preferred. See infusion dosing next.",
      next: "infusionDosing",
    },
    psKetamineOrFentanyl: {
      id: "psKetamineOrFentanyl",
      type: "info",
      title: "Post-intubation: Ketamine or Fentanyl",
      body: "See infusion dosing next.",
      next: "infusionDosing",
    },
    psFentanyl: {
      id: "psFentanyl",
      type: "info",
      title: "Post-intubation: Fentanyl",
      body: "See infusion dosing next.",
      next: "infusionDosing",
    },
    infusionDosing: {
      id: "infusionDosing",
      type: "lookup",
      title: "Sedative / analgesic infusion dosing",
      body: "Verify infusion units against the source PDF before ordering.",
      calloutIds: ["infusionUnits"],
      table: {
        columns: ["Drug", "Starting dose", "Titrate q30 min", "Max dosing", "Comments"],
        rows: [
          [
            "Dexmedetomidine (Precedex)",
            "Load 0.25–1 mcg/kg over 10 min (0.1–1 mcg/kg/hr)",
            "0.2 mcg/kg/hr",
            "1.5 mcg/kg/hr",
            "↓HR, ↓BP, no analgesia",
          ],
          [
            "Fentanyl",
            "<40 kg: 0.5–3 mcg/kg · ≥40 kg: 20–200 mcg/hr",
            "0.5 mcg/kg/hr",
            "<40 kg: 5 mcg/kg/hr · ≥40 kg: 200 mcg/hr",
            "Chest wall rigidity if pushed quickly",
          ],
          ["Ketamine", "1–2 mg/kg/hr (0.3–3 mg/kg/hr)", "0.5 mg/kg/hr", "4 mg/kg/hr", "↑HR, ↑BP"],
          [
            "Midazolam (Versed)",
            "<40 kg: 0.1 mg/kg/hr · ≥40 kg: 0.5–4 mg",
            "0.05 mg/kg/hr",
            "<40 kg: 0.3 mg/kg/hr · ≥40 kg: 6 mg/hr",
            "↓HR, ↓BP, no analgesia",
          ],
          [
            "Propofol",
            "Load 1–2 mg/kg, max 50 mg (20–100 mg/kg/min)",
            "5–10 mg/kg/min",
            "250 mg/kg/min",
            "↓BP, Propofol Infusion Syndrome, no analgesia. CI: egg/soy allergy, ketogenic diet",
          ],
        ],
      },
      next: "complete",
    },
    complete: {
      id: "complete",
      type: "outcome",
      title: "Intubation complete",
      body: "Confirm ventilator settings and disposition (PICU).",
      disposition: "admit-picu",
      tone: "info",
    },
  },
};
