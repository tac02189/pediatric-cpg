// Pediatric Acute Appendicitis — MU Pediatric Service Line CPG (Feb 2025).
// Transcribed from appendicitis.pdf. Exercises a 3-way US branch, an additive
// score (PAS) and a rule-based score (Refined Low Risk), with shared outcomes.

export default {
  id: "appendicitis",
  title: "Appendicitis",
  fullTitle: "Pediatric Acute Appendicitis",
  category: "abdominal-gi",
  icon: "Soup",
  keywords: [
    "appendicitis",
    "appendix",
    "RLQ pain",
    "right lower quadrant",
    "PAS",
    "pediatric appendicitis score",
    "abdominal pain",
  ],
  shortDescription: "Ultrasound + PAS pathway for the child with possible appendicitis.",
  sourcePdf: "appendicitis.pdf",
  version: "2025",
  lastEdited: "February 2025",
  authors: ["MB Bernardin", "R Marwan"],
  verified: false,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF.",

  inclusion: ["Child with history and exam concerning for acute appendicitis"],
  exclusion: [
    "Adults > 18 years",
    "Recent abdominal/bowel surgery",
    "Known diagnosis of IBD",
    "Suspected severe sepsis",
  ],

  calculators: {
    pas: {
      kind: "score",
      engine: "additive",
      id: "pas",
      name: "Pediatric Appendicitis Score (PAS)",
      reference: "Kharbanda AB, et al. Pediatrics. 2018;141(4):e20172699.",
      items: [
        { id: "nausea", label: "Nausea / vomiting", options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }] },
        { id: "anorexia", label: "Anorexia", options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }] },
        { id: "migration", label: "Migration of pain to RLQ", options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }] },
        { id: "fever", label: "Fever", options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }] },
        { id: "coughHop", label: "Cough / percussion / hopping tenderness", options: [{ label: "No", value: 0 }, { label: "Yes", value: 2 }] },
        { id: "rlqTender", label: "RLQ tenderness", options: [{ label: "No", value: 0 }, { label: "Yes", value: 2 }] },
        { id: "leukocytosis", label: "Leukocytosis (WBC > 10,000)", options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }] },
        { id: "neutrophilia", label: "Neutrophilia (ANC > 7,500)", options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }] },
      ],
      bands: [
        { id: "lowRisk", label: "Low risk (< 4)", max: 3, tone: "success" },
        { id: "intermediate", label: "Intermediate (4–6)", min: 4, max: 6, tone: "warning" },
        { id: "highRisk", label: "High risk (≥ 7)", min: 7, tone: "danger" },
      ],
      routingGroups: {
        under4: ["lowRisk"],
        atLeast4: ["intermediate", "highRisk"],
      },
    },

    refinedLowRisk: {
      kind: "score",
      engine: "rule",
      id: "refinedLowRisk",
      name: "Refined Low Risk Appendicitis Score",
      reference: "Kharbanda AB, et al. Arch Pediatr Adolesc Med. 2012;166(8):738-44.",
      criteria: [
        { id: "noMaxTenderness", label: "Absence of maximal tenderness in RLQ", type: "bool" },
        {
          id: "rlqNoPainMovement",
          label: "RLQ tenderness without pain on walking, jumping, or coughing",
          type: "bool",
        },
        { id: "anc", label: "ANC (cells/mm³)", type: "number", help: "Absolute neutrophil count" },
      ],
      compute: (inputs) => {
        const ancEntered = typeof inputs.anc === "number";
        const clinical = inputs.noMaxTenderness === true || inputs.rlqNoPainMovement === true;
        const lowRisk = clinical && ancEntered && inputs.anc < 6750;
        return {
          complete: ancEntered,
          groupId: lowRisk ? "lowRiskYes" : "lowRiskNo",
          label: lowRisk ? "Low risk — YES (NPV 95%)" : "Low risk — NO",
          detail:
            "Low risk = (no maximal RLQ tenderness OR RLQ tenderness without pain on walking/jumping/coughing) AND ANC < 6750/mm³.",
        };
      },
    },
  },

  callouts: {
    abxPowerPlan: {
      tone: "info",
      title: "Antibiotic dosing",
      body: "Use PowerPlan “PED SURG Appendicitis PreOp” for ceftriaxone and metronidazole dosing.",
    },
    noAdvancedImaging: {
      tone: "info",
      title: "Imaging",
      body: "Do NOT obtain advanced imaging for appendicitis unless recommended by pediatric surgery.",
    },
  },

  footnotes: {
    b: "CBC with differential should be obtained. CMP if vomiting and/or concern for dehydration. CRP can be obtained for additional evidence of inflammation. Lipase if epigastric pain/tenderness.",
  },

  references: [
    "Kharbanda AB, et al. Development and validation of a novel Pediatric Appendicitis Risk Calculator (pARC). Pediatrics. 2018;141(4):e20172699.",
    "Kharbanda AB, et al. Validation and refinement of a prediction rule to identify children at low risk for acute appendicitis. Arch Pediatr Adolesc Med. 2012;166(8):738-44.",
    "Children's Hospital of Philadelphia Emergency Department Clinical Pathway for Evaluation/Treatment of Children with Suspected Appendicitis, 2024.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "Pediatric Acute Appendicitis",
      body: "For the child with history/exam concerning for acute appendicitis. Review exclusion criteria, then begin.",
      next: "workup",
    },
    workup: {
      id: "workup",
      type: "action",
      title: "Initial evaluation",
      items: [
        "Obtain US abdomen RLQ",
        "Consider transabdominal US pelvis if female",
        "IV access, labs, UA, urine HCG if female",
        "Apply the Pediatric Appendicitis Score (PAS)",
      ],
      footnoteRefs: ["b"],
      next: "usResult",
    },
    usResult: {
      id: "usResult",
      type: "branch",
      title: "Ultrasound result?",
      branches: [
        { label: "Normal appendix on US", next: "altDx", tone: "success" },
        { label: "Equivocal US", next: "pas", tone: "warning" },
        { label: "Acute appendicitis on US", next: "consultSurgeryAbx", tone: "danger" },
      ],
    },
    pas: {
      id: "pas",
      type: "score",
      title: "Apply the Pediatric Appendicitis Score (PAS)",
      calculatorId: "pas",
      branches: [
        { group: "under4", label: "PAS < 4", next: "refined" },
        { group: "atLeast4", label: "PAS ≥ 4", next: "consultSurgeryImaging", tone: "warning" },
      ],
    },
    refined: {
      id: "refined",
      type: "score",
      title: "Apply the Refined Low Risk Appendicitis Score",
      body: "For PAS < 4, apply the refined low-risk criteria.",
      calculatorId: "refinedLowRisk",
      branches: [
        { group: "lowRiskYes", label: "Low risk — Yes", next: "altDx", tone: "success" },
        { group: "lowRiskNo", label: "Low risk — No", next: "consultSurgeryImaging", tone: "warning" },
      ],
    },

    altDx: {
      id: "altDx",
      type: "outcome",
      title: "Consider alternative diagnoses",
      body: "Work up alternative diagnoses.",
      disposition: "workup",
      tone: "info",
      calloutIds: ["noAdvancedImaging"],
    },
    consultSurgeryImaging: {
      id: "consultSurgeryImaging",
      type: "outcome",
      title: "Consult pediatric surgery",
      body: "Advanced imaging per pediatric surgery.",
      disposition: "consult",
      tone: "warning",
    },
    consultSurgeryAbx: {
      id: "consultSurgeryAbx",
      type: "outcome",
      title: "Consult pediatric surgery",
      body: "Give ceftriaxone and metronidazole (preoperative antibiotics).",
      disposition: "consult",
      tone: "danger",
      calloutIds: ["abxPowerPlan"],
    },
  },
};
