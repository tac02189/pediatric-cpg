// Pediatric Burn Management — MU Pediatric Service Line CPG (Feb 2025).
// Transcribed from burn.pdf. Triage by TBSA, primary survey, secondary exam with
// an interactive Modified Parkland fluid calculator, then the non-transferred
// wound-care / admission pathway.

export default {
  id: "burn",
  title: "Burn",
  fullTitle: "Burn Management",
  category: "trauma-critical",
  icon: "Flame",
  keywords: ["burn", "thermal injury", "tbsa", "parkland", "escharotomy", "inhalation injury", "scald", "fluid resuscitation"],
  shortDescription: "Triage, primary survey, Parkland fluids, and wound care for pediatric burns.",
  sourcePdf: "burn.pdf",
  version: "2025",
  lastEdited: "February 2025",
  authors: ["J Duhamell", "MB Bernardin", "W Ficker", "M Hayes", "K Cutler", "C Sampson", "K Koehn", "J Kesterson", "J Coughenour"],
  verified: false,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF.",

  inclusion: ["Patient < 18 years with a burn injury"],
  exclusion: [],

  calculators: {
    parkland: {
      kind: "score",
      engine: "rule",
      id: "parkland",
      name: "Modified Parkland fluid",
      reference: "Modified Parkland: 4 mL LR × kg × %TBSA over 24 h.",
      criteria: [
        { id: "weightKg", label: "Weight (kg)", type: "number" },
        { id: "tbsa", label: "% TBSA burned", type: "number" },
      ],
      compute: (i) => {
        const w = i.weightKg;
        const t = i.tbsa;
        const ok = typeof w === "number" && typeof t === "number" && w > 0 && t > 0;
        if (!ok) return { complete: false, groupId: "incomplete", label: "Enter weight and % TBSA" };
        const total = Math.round(4 * w * t);
        const half = Math.round(total / 2);
        const rate8 = Math.round(half / 8);
        return {
          complete: true,
          groupId: "done",
          label: `${total} mL LR over 24 h`,
          detail: `½ (${half} mL) in the first 8 hours ≈ ${rate8} mL/hr; give the remainder per the source schedule. Titrate to urine output (0.5–1 mL/kg/hr if < 30 kg; 1–2 mL/kg/hr if > 30 kg). Verify the infusion split against the source PDF.`,
        };
      },
    },
  },

  callouts: {
    denverCriteria: {
      tone: "warning",
      title: "Denver criteria for intubation (any)",
      body: [
        "Deep dermal/full-thickness facial burns",
        "Stridor",
        "Burn TBSA > 40%",
        "Respiratory distress",
        "Decreased level of consciousness with loss of protective reflexes",
        "Significant risk of airway edema (consider ENT for fiberoptic laryngoscopy if unsure)",
      ],
    },
    burnLabs: {
      tone: "info",
      title: "Burn labs",
      body: "CBC, CMP, VBG/co-oximetry (carboxyhemoglobin), cyanide level, CK, UA (myoglobinuria), PT, PTT, lactate.",
    },
    transferCriteria: {
      tone: "info",
      title: "Burn transfer criteria",
      body: [
        "Partial thickness > 10% TBSA in children < 10 yr",
        "Partial thickness > 20% TBSA in children > 10 yr",
        "Deep partial burn to face, hands, feet, genitals, perineum, or major joints",
        "Electrical burns and lightning strikes; chemical burns; inhalation injury",
        "High-risk individuals with pre-existing conditions",
        "Burns with traumatic injury when the burn is the leading risk of mortality",
      ],
    },
    natConcerns: {
      tone: "warning",
      title: "NAT concerns",
      body: [
        "Suspicious markings; delayed presentation; patterned burns",
        "Immersion burns: clearly demarcated, circumferential, symmetric burns of hands/wrists and/or feet/ankles/lower legs (stocking-glove), and/or buttocks/perineum with sparing of knees, popliteal fossa, and thighs",
      ],
    },
    parklandNote: {
      tone: "info",
      title: "Modified Parkland fluid",
      body: "4 mL LR × kg × %TBSA over 24 h (½ in the first 8 h). Use the Parkland calculator (Calculators tab) and titrate to urine output.",
    },
  },

  footnotes: {
    b: "Hyperbaric indications: loss of consciousness at the scene, persistent neurologic symptoms (e.g. seizure), evidence of cardiac injury (e.g. cardiac arrest), or significant carboxyhemoglobin elevation (> 25–40%).",
    d: "Consider colloids if nonresponsive to crystalloids.",
    e: "Cyanide poisoning must be treated before the quantitative level returns. Consider hydroxocobalamin (Cyanokit) 70 mg/kg IV for: fire in a contained area needing CPR and/or intubation, or altered mental status, abnormal vitals, evidence of hypoxic injury, and severe metabolic acidosis (elevated lactate).",
    f: "Cool running water over burns for ≥ 20 minutes within 3 hours of injury reduces full-thickness depth, admissions, and operative needs. Consider in hemodynamically stable patients with close temperature monitoring.",
    g: "Estimate Total Body Surface Area (TBSA) and burn depth using a Lund-Browder chart (see source PDF).",
    i: "Modified Parkland: 4 mL LR × kg × %TBSA = total mL over 24 hours; give ½ in the first eight hours. Titrate to urine output (0.5–1 mL/kg/hr if < 30 kg; 1–2 mL/kg/hr if > 30 kg). Maintenance fluids with dextrose if < 20 kg.",
    j: "Tetanus: TIG if < 3 doses of DTaP or unsure of status. Booster if no tetanus vaccine in the last 5 years (DTaP if < 7 yr, Tdap if > 7 yr).",
    l: "Deroof blisters with sterile technique: small cut and drain fluid, cut away epidermis near the base, stay away from the base/floor.",
    n: "Admission location is case-by-case. ACS generally admits to the ACS service for pain control and/or wound care. For extensive burns or admission primarily for abuse concerns, consider transfer to the Children's Mercy pediatric burn unit (Kansas City).",
  },

  references: [
    "Budulak et al. Defining the criteria for intubation of the patient with thermal burns. Burns. 2018.",
    "Greenhalgh et al. Burn Resuscitation Practices in North America (ABRUPT). Ann Surg. 2023.",
    "Griffin et al. Cool Running Water First Aid Decreases Skin Grafting Requirements in Pediatric Burns. Ann Emerg Med. 2020.",
    "Bettencourt et al. Updating the Burn Center Referral Criteria: 2018 Delphi Consensus. J Burn Care Res. 2020.",
    "Harshman, Roy, Cartotto. Emergency Care of the Burn Patient Before the Burn Center. J Burn Care Res. 2019.",
    "Jamshidi and Sato. Initial assessment and management of thermal burn injuries in children. Pediatr Rev. 2013.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "Burn Management",
      body: "Patient < 18 years with a burn injury.",
      next: "triageLocation",
    },
    triageLocation: {
      id: "triageLocation",
      type: "branch",
      title: "Determine evaluation location (estimated TBSA)",
      branches: [
        { label: "Class 1: > 35% TBSA or inhalational injury → R Bay", next: "primarySurvey", tone: "danger" },
        { label: "Class 2: 15–35% TBSA → R Bay", next: "primarySurvey", tone: "warning" },
        { label: "< 15% TBSA → Peds ED", next: "primarySurvey" },
      ],
    },
    primarySurvey: {
      id: "primarySurvey",
      type: "action",
      title: "Primary trauma survey (ABCDE)",
      items: [
        "Airway & Breathing — if respiratory distress, hypoxia, or burns to face/mouth/nares: intubate per Denver criteria, 100% FiO₂ if CO concern, albuterol for smoke-inhalation bronchospasm, escharotomy for circumferential thoracic burns per ACS",
        "Circulation — if > 10% TBSA, hypotensive, or bleeding: IV ×2 through unaffected skin (IO if needed), send burn labs, give 20 mL/kg LR bolus",
        "Disability — if mental status change or absent gag: POC glucose, consider head CT and C-spine precautions, consider hyperbaric and Cyanokit",
        "Exposure — if severe burns or life-threatening injury: remove clothing/jewelry/debris, cover burns with dry dressings/sheets, maintain temperature > 35 °C, consider running water cooling",
      ],
      calloutIds: ["denverCriteria", "burnLabs"],
      footnoteRefs: ["b", "d", "e", "f"],
      next: "secondaryExam",
    },
    secondaryExam: {
      id: "secondaryExam",
      type: "action",
      title: "Secondary exam",
      items: [
        "Calculate TBSA and determine burn depth",
        "Initiate transfer to a Burn Center if criteria met",
        "Initiate multimodal pain control including opioids as needed",
        "Calculate IVF with Modified Parkland if > 15% BSA burn",
      ],
      calloutIds: ["transferCriteria", "parklandNote"],
      footnoteRefs: ["g", "i"],
      next: "transferDecision",
    },
    transferDecision: {
      id: "transferDecision",
      type: "decision",
      title: "Transferring to a Burn Center?",
      branches: [
        { label: "Yes — meets transfer criteria", next: "transferOut", tone: "warning" },
        { label: "No", next: "nonTransfer" },
      ],
    },
    transferOut: {
      id: "transferOut",
      type: "outcome",
      title: "Transfer to Burn Center",
      body: ["Initiate transfer per burn transfer criteria"],
      disposition: "transfer",
      tone: "warning",
    },

    nonTransfer: {
      id: "nonTransfer",
      type: "action",
      title: "Non-transferred burn pathway",
      items: ["Update tetanus immunization as needed", "Consider non-accidental trauma (NAT)"],
      calloutIds: ["natConcerns"],
      footnoteRefs: ["j"],
      next: "woundCareTBSA",
    },
    woundCareTBSA: {
      id: "woundCareTBSA",
      type: "decision",
      title: "Wound care — total TBSA?",
      branches: [
        { label: "< 10% TBSA — ER management", next: "erManagement" },
        { label: "> 10% TBSA — OR debridement", next: "orDebridement", tone: "warning" },
      ],
    },
    erManagement: {
      id: "erManagement",
      type: "action",
      title: "ER management",
      items: [
        "Pain control: IN and IV opioids",
        "Debridement: sedation as needed; aspirate or deroof blisters > 1 cm²",
        "Gentle cleaning and debridement of devitalized skin with saline + sterile gauze, soap and/or iodine",
      ],
      footnoteRefs: ["l"],
      next: "burnDressing",
    },
    burnDressing: {
      id: "burnDressing",
      type: "branch",
      title: "Burn dressing — wound type?",
      branches: [
        { label: "< 5 cm² non-exudative → Duoderm (change q3–7 days)", next: "dischargeBurn" },
        { label: "Face and perineum → Bacitracin/Polymyxin B (daily changes)", next: "dischargeBurn" },
        { label: "All others → Mepilex (change q7 days)", next: "dischargeBurn" },
      ],
    },
    orDebridement: {
      id: "orDebridement",
      type: "action",
      title: "Debridement and dressing in OR",
      items: ["Non-excisional debridement and dressing in the OR"],
      next: "admissionCriteria",
    },
    admissionCriteria: {
      id: "admissionCriteria",
      type: "decision",
      title: "Meeting admission criteria?",
      body: "> 5–10% TBSA partial thickness; 2–5% TBSA full thickness; NAT concerns or other significant social factors.",
      branches: [
        { label: "Yes", next: "admitBurn", tone: "warning" },
        { label: "No", next: "dischargeBurn", tone: "success" },
      ],
    },

    dischargeBurn: {
      id: "dischargeBurn",
      type: "outcome",
      title: "Discharge home",
      body: [
        "Pain controlled with oral medications",
        "Access to ACS wound clinic for follow-up",
        "Supplies for dressing changes until the follow-up appointment",
      ],
      disposition: "discharge",
      tone: "success",
    },
    admitBurn: {
      id: "admitBurn",
      type: "outcome",
      title: "Admit",
      body: ["Admission to the ACS service (case-by-case); burn care/dressing changes managed by ACS"],
      disposition: "admit-floor",
      tone: "warning",
      footnoteRefs: ["n"],
    },
  },
};
