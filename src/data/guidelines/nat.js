// Non-Accidental Trauma (NAT) Evaluation & Management — MU Pediatric Service Line
// CPG (April 2026). Transcribed from nat.pdf. High-stakes child-protection
// guideline: age-stratified work-up (parallel arms linearized into a guided
// sequence) converging on a shared disposition pathway with exact hotline numbers
// and the emergency-custody process. Mandated-reporter obligations stand.

export default {
  id: "nat",
  title: "Non-Accidental Trauma",
  fullTitle: "Non-Accidental Trauma (NAT) Evaluation & Management",
  category: "child-protection",
  icon: "ShieldAlert",
  keywords: ["nat", "non-accidental trauma", "child abuse", "physical abuse", "skeletal survey", "abusive head trauma", "ten-faces"],
  shortDescription: "Age-based work-up and disposition for suspected physical child abuse (ages 0–5).",
  sourcePdf: "nat.pdf",
  version: "2026",
  lastEdited: "April 2026",
  authors: ["MB Bernardin", "W Ficker", "M Hayes", "K Hiedbrink", "D Lopez-Domowicz", "H Monroe", "K Koehn", "J Kesterson"],
  verified: true,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF. Does not replace mandated-reporter obligations or institutional policy.",

  inclusion: [
    "Children age 0–5 years with concern for NAT based on history or physical exam",
    "May also apply to siblings of abused children",
  ],
  exclusion: [],

  callouts: {
    mandatedReporting: {
      tone: "warning",
      title: "Mandated reporting",
      body: "This pathway supports — but does not replace — your mandated-reporter obligations and institutional policy. When in doubt, report and consult child-abuse specialists.",
    },
    referralCenters: {
      tone: "info",
      title: "Child-abuse specialist consults",
      body: [
        "KC Children's Mercy (MU regional referral center for NAT): 1-800-GO-MERCY",
        "St. Louis Children's Hospital: 1-800-678-HELP",
      ],
    },
    powerplan: {
      tone: "info",
      title: "PowerPlan",
      body: "Use PowerPlan: ED Physician Peds Non-Accidental Trauma Evaluation.",
    },
    custodyNote: {
      tone: "warning",
      title: "Emergency custody",
      body: "If a family threatens or attempts to abscond with the child, see the indications and process for an MD taking emergency custody (see notes).",
    },
  },

  footnotes: {
    b: [
      "Historical elements concerning for NAT:",
      "Inconsistent or no clear history of injury",
      "Suspicious unwitnessed injury or injury from lack of supervision",
      "Delay in seeking medical care",
      "Prior ED visits for injury",
      "Illegal drug exposure or abuse in the home",
    ],
    c: [
      "Physical exam elements concerning for NAT:",
      "Bruising — TEN-FACES (torso, ears, neck, frenulum, angle of jaw, cheek, eyelids, subconjunctiva); infants < 4–6 months; patterned bruising (loop marks, handprints, bite marks)",
      "Scars suggesting being struck with an object",
      "Patterned burns (cigarette/lighter) or intentional-immersion burns (stocking/glove)",
      "Unexplained torn frenulum or other oral injury",
      "Any inadequately explained genital injury",
    ],
    d: [
      "NAT trauma labs:",
      "CBC, CMP, lipase, bagged UA, PT/PTT if bruising",
      "If bruising/petechiae or ICH with concern for bleeding disorder: von Willebrand profile, platelet function screen, fibrinogen, factor VII assay, factor IX assay",
      "If multiple fractures with concern for metabolic bone disease: 25-OH vitamin D2/D3, phosphorus, intact PTH",
      "If concern for toxic ingestion: urine drug screen (confirm positives), blood drug levels (acetaminophen, ethanol, salicylate) as needed",
    ],
    e: "Evidence of head trauma and/or ↑ICP: facial bruising, scalp hematoma, altered mental status, vomiting, Cushing's triad (hypertension, bradycardia, hypopnea/apnea). Consider C-spine imaging.",
    f: "A dilated ophthalmologic exam is NOT indicated when there are no neuroimaging findings or other evidence of head trauma. If abusive head trauma is present, ophtho consult can be deferred to the inpatient team.",
    g: "Admitting service is pediatrics unless a consulting specialty requests to be primary with pediatric co-management.",
    h: [
      "Imaging findings concerning for NAT:",
      "Rib fractures; multiple fractures; any fracture in a non-ambulatory infant/child",
      "Metaphyseal (corner, bucket-handle) fractures",
      "Skull fractures (especially multiple/complicated — crossing suture lines, burst, depressed)",
      "Intracranial hemorrhage (especially subdural/subarachnoid), cerebral edema, and/or diffuse axonal injury",
      "Intraabdominal trauma, particularly liver, pancreas, and/or bowel",
    ],
    i: [
      "Indications/process for an MD taking emergency custody of a child:",
      "An MD may take emergency temporary custody when there is reasonable cause to believe a child is in imminent danger of serious physical harm or threat to life from abuse/neglect, before a juvenile court order or juvenile officer can act.",
      "Custody may be taken without consent of the parents/guardians.",
      "Immediately notify the juvenile office of the court in the county where the child is located and notify CD; make a reasonable attempt to advise the parents/guardians.",
      "File a written statement with the juvenile officer as soon as practicable, no later than 12 hours, setting forth the child's identity and the facts giving reasonable cause.",
    ],
  },

  references: [
    "ED Clinical Pathway for Evaluation/Treatment of Children with Concern for Physical Abuse, Children's Hospital of Philadelphia. 2025.",
    "MU Acute Care Surgery Non-Accidental Trauma Practice Management Guideline. 2025.",
    "St. Louis Children's Hospital Guideline for the evaluation of suspected NAT. 2023.",
    "Children's Mercy Kansas City Child Physical Abuse Guideline. 2025.",
    "PECARN Pediatric Head Injury/Trauma Algorithm. 2009.",
    "Physical child abuse: Diagnostic evaluation and management. UpToDate. 2025.",
    "MO Online System for Child Abuse & Neglect Reporting (OSCR). 2026.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "Non-Accidental Trauma Evaluation",
      body: "For the child (0–5 years) with history and/or physical exam concerning for NAT.",
      calloutIds: ["mandatedReporting", "referralCenters"],
      footnoteRefs: ["b", "c"],
      next: "addressLifeThreats",
    },
    addressLifeThreats: {
      id: "addressLifeThreats",
      type: "action",
      title: "Stabilize",
      items: ["Address immediate life-threatening injuries and pain"],
      next: "photograph",
    },
    photograph: {
      id: "photograph",
      type: "action",
      title: "Document injuries",
      items: [
        "Photograph all injuries with the Capture App",
        "Tag and pull all photos into the patient note physical exam",
      ],
      next: "ageGroup",
    },
    ageGroup: {
      id: "ageGroup",
      type: "branch",
      title: "Patient age?",
      calloutIds: ["powerplan"],
      branches: [
        { label: "< 1 year", next: "skeletalU1" },
        { label: "1–2 years", next: "skeletal12" },
        { label: "2–5 years", next: "distracting25" },
      ],
    },

    // ---------- < 1 year ----------
    skeletalU1: {
      id: "skeletalU1",
      type: "action",
      title: "Skeletal survey",
      items: ["Obtain skeletal survey", "Consult ortho as needed"],
      next: "labsU1",
    },
    labsU1: {
      id: "labsU1",
      type: "action",
      title: "NAT labs",
      items: ["Obtain NAT labs", "Consult ACS as needed"],
      footnoteRefs: ["d"],
      next: "abdThresholdU1",
    },
    abdThresholdU1: {
      id: "abdThresholdU1",
      type: "decision",
      title: "AST/ALT > 80, lipase > 100, and/or hematuria?",
      branches: [
        { label: "Yes", next: "ctAbdomenU1", tone: "warning" },
        { label: "No", next: "unstableU1" },
      ],
    },
    ctAbdomenU1: {
      id: "ctAbdomenU1",
      type: "action",
      title: "CT abdomen",
      items: ["Obtain CT abdomen with contrast"],
      next: "unstableU1",
    },
    unstableU1: {
      id: "unstableU1",
      type: "decision",
      title: "Clinically unstable?",
      branches: [
        { label: "Yes", next: "headCTU1", tone: "danger" },
        { label: "No", next: "headTraumaU1" },
      ],
    },
    headTraumaU1: {
      id: "headTraumaU1",
      type: "decision",
      title: "Evidence of head trauma and/or ↑ intracranial pressure?",
      footnoteRefs: ["e"],
      branches: [
        { label: "Yes", next: "headCTU1", tone: "warning" },
        { label: "No", next: "brainMRIU1" },
      ],
    },
    headCTU1: {
      id: "headCTU1",
      type: "action",
      title: "Head CT",
      items: ["Obtain head CT without contrast", "Consult NSGY as needed"],
      footnoteRefs: ["f"],
      next: "dispoStart",
    },
    brainMRIU1: {
      id: "brainMRIU1",
      type: "action",
      title: "Brain MRI",
      items: ["Obtain brain MRI", "Consult NSGY as needed"],
      footnoteRefs: ["f"],
      next: "dispoStart",
    },

    // ---------- 1–2 years ----------
    skeletal12: {
      id: "skeletal12",
      type: "action",
      title: "Skeletal survey",
      items: ["Obtain skeletal survey", "Consult ortho as needed"],
      next: "labs12",
    },
    labs12: {
      id: "labs12",
      type: "action",
      title: "NAT labs",
      items: ["Obtain NAT labs", "Consult ACS as needed"],
      footnoteRefs: ["d"],
      next: "abdThreshold12",
    },
    abdThreshold12: {
      id: "abdThreshold12",
      type: "decision",
      title: "AST/ALT > 80, lipase > 100, and/or hematuria?",
      branches: [
        { label: "Yes", next: "ctAbdomen12", tone: "warning" },
        { label: "No", next: "headPecarn12" },
      ],
    },
    ctAbdomen12: {
      id: "ctAbdomen12",
      type: "action",
      title: "CT abdomen",
      items: ["Obtain CT abdomen with contrast"],
      next: "headPecarn12",
    },
    headPecarn12: {
      id: "headPecarn12",
      type: "decision",
      title: "Head CT recommended per PECARN Head Injury Algorithm?",
      branches: [
        { label: "Yes", next: "headCT12", tone: "warning" },
        { label: "No", next: "dispoStart" },
      ],
    },
    headCT12: {
      id: "headCT12",
      type: "action",
      title: "Head CT",
      items: ["Obtain head CT without contrast", "Consult NSGY as needed"],
      footnoteRefs: ["f"],
      next: "dispoStart",
    },

    // ---------- 2–5 years ----------
    distracting25: {
      id: "distracting25",
      type: "decision",
      title: "Distracting injury, impaired communication, or AMS?",
      branches: [
        { label: "Yes", next: "skeletal25" },
        { label: "No", next: "abdConcern25" },
      ],
    },
    skeletal25: {
      id: "skeletal25",
      type: "action",
      title: "Skeletal survey",
      items: ["Obtain skeletal survey", "Consult ortho as needed"],
      next: "abdConcern25",
    },
    abdConcern25: {
      id: "abdConcern25",
      type: "decision",
      title: "Clinical concern for intraabdominal injury?",
      branches: [
        { label: "Yes", next: "labs25" },
        { label: "No", next: "headPecarn25" },
      ],
    },
    labs25: {
      id: "labs25",
      type: "action",
      title: "NAT labs",
      items: ["Obtain NAT labs", "Consult ACS as needed"],
      footnoteRefs: ["d"],
      next: "abdThreshold25",
    },
    abdThreshold25: {
      id: "abdThreshold25",
      type: "decision",
      title: "AST/ALT > 80, lipase > 100, and/or hematuria?",
      branches: [
        { label: "Yes", next: "ctAbdomen25", tone: "warning" },
        { label: "No", next: "headPecarn25" },
      ],
    },
    ctAbdomen25: {
      id: "ctAbdomen25",
      type: "action",
      title: "CT abdomen",
      items: ["Obtain CT abdomen with contrast"],
      next: "headPecarn25",
    },
    headPecarn25: {
      id: "headPecarn25",
      type: "decision",
      title: "Head CT recommended per PECARN Head Injury Algorithm?",
      branches: [
        { label: "Yes", next: "headCT25", tone: "warning" },
        { label: "No", next: "dispoStart" },
      ],
    },
    headCT25: {
      id: "headCT25",
      type: "action",
      title: "Head CT",
      items: ["Obtain head CT without contrast", "Consult NSGY as needed"],
      footnoteRefs: ["f"],
      next: "dispoStart",
    },

    // ---------- Disposition (shared) ----------
    dispoStart: {
      id: "dispoStart",
      type: "decision",
      title: "Able to complete all work-up in the ED?",
      branches: [
        { label: "No", next: "hotlineAdmit", tone: "warning" },
        { label: "Yes", next: "inpatientNeeded" },
      ],
    },
    inpatientNeeded: {
      id: "inpatientNeeded",
      type: "decision",
      title: "Injuries requiring inpatient management?",
      branches: [
        { label: "Yes", next: "hotlineAdmit", tone: "warning" },
        { label: "No", next: "imagingConcern" },
      ],
    },
    imagingConcern: {
      id: "imagingConcern",
      type: "decision",
      title: "Findings concerning for NAT on imaging?",
      footnoteRefs: ["h"],
      branches: [
        { label: "Yes", next: "callHotline", tone: "warning" },
        { label: "No", next: "ongoingConcern" },
      ],
    },
    ongoingConcern: {
      id: "ongoingConcern",
      type: "decision",
      title: "Ongoing concern for NAT?",
      branches: [
        { label: "Yes", next: "callHotline", tone: "warning" },
        { label: "No", next: "dischargeHome", tone: "success" },
      ],
    },
    callHotline: {
      id: "callHotline",
      type: "reference",
      title: "Call the MO Child Abuse & Neglect Hotline",
      body: "Also complete the online hotline report (OSCR) as needed.",
      actions: [
        { kind: "phone", label: "MO Child Abuse & Neglect Hotline", value: "1-800-392-3738" },
      ],
      calloutIds: ["custodyNote"],
      footnoteRefs: ["i"],
      next: "dfsApprove",
    },
    dfsApprove: {
      id: "dfsApprove",
      type: "decision",
      title: "DFS approves a safe discharge plan?",
      branches: [
        { label: "Yes", next: "dischargeDFS", tone: "success" },
        { label: "No", next: "hotlineAdmit", tone: "warning" },
      ],
    },

    hotlineAdmit: {
      id: "hotlineAdmit",
      type: "outcome",
      title: "Complete online hotline & admit",
      body: ["Complete the online hotline report (OSCR)", "Admit"],
      disposition: "admit-floor",
      tone: "warning",
      calloutIds: ["custodyNote"],
      footnoteRefs: ["g", "i"],
    },
    dischargeDFS: {
      id: "dischargeDFS",
      type: "outcome",
      title: "Discharge to DFS-approved caregiver",
      body: [
        "Discharge to a DFS-approved caregiver with a safety plan",
        "Use PowerPlan to order a 2-week follow-up skeletal survey as indicated",
        "Primary and/or specialist MD follow-up as needed",
      ],
      disposition: "discharge",
      tone: "success",
      calloutIds: ["custodyNote"],
    },
    dischargeHome: {
      id: "dischargeHome",
      type: "outcome",
      title: "Discharge home",
      body: ["No imaging findings or ongoing concern for NAT", "Complete the online hotline report as needed"],
      disposition: "discharge",
      tone: "success",
    },
  },
};
