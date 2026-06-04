// Ingested Foreign Body Management — MU Pediatric Service Line CPG (Feb 2025).
// Transcribed from ingested-fb.pdf. Four object-type sub-algorithms (coin/blunt,
// sharp, button battery, magnet) that share several outcome nodes.

export default {
  id: "ingested-fb",
  title: "Ingested Foreign Body",
  fullTitle: "Ingested Foreign Body",
  category: "abdominal-gi",
  icon: "Utensils",
  keywords: ["ingested foreign body", "foreign body", "coin", "button battery", "magnet", "swallowed", "esophageal foreign body", "fb"],
  shortDescription: "Imaging and management by object type (coin, sharp, button battery, magnet) and location.",
  sourcePdf: "ingested-fb.pdf",
  version: "2025",
  lastEdited: "February 2025",
  authors: ["M. Bernardin", "K. Cutler", "W. Ficker", "M. Hayes", "A. Marwan", "I. El-Halabi"],
  verified: false,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF.",

  inclusion: ["History/exam concerning for an ingested foreign body"],
  exclusion: [],

  footnotes: {
    a: "Patients may be asymptomatic. Common symptoms: respiratory distress, dysphagia, chest pain, drooling.",
    b: "X-rays are the initial imaging of choice (can show indirect evidence of radiolucent FBs, e.g. air-fluid levels, free air). Consult Pediatric Surgery if concern for symptomatic radiolucent FBs not well visualized on X-ray.",
    c: "This recommendation includes esophageal food boluses.",
    d: "Consider Pediatric Surgery for large, sharp FBs (especially length ≥ 3 cm and/or width ≥ 2 cm) and/or concern for lack of follow-up access.",
    e: "Examine X-rays carefully for button batteries — 'double halo sign' on AP views and 'step-off sign' on lateral views.",
    f: "Outside-hospital transfers with active upper GI bleeding and/or hemodynamic instability due to ingested FBs should be accepted by the Pediatric Surgery attending on call.",
  },

  references: [
    "Powers K, et al. Pediatric Esophageal Foreign Bodies and Caustic Ingestions. Otolaryngol Clin N Am. 2024.",
    "Kramer R, et al. Management of Ingested Foreign Bodies in Children. J Pediatr Gastroenterol Nutr. 2015.",
    "Children's Hospital of Philadelphia ED Clinical Pathway for Foreign Body Ingestion. 2024.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "Ingested Foreign Body",
      body: "For the child with history/exam concerning for an ingested foreign body.",
      footnoteRefs: ["a"],
      next: "imaging",
    },
    imaging: {
      id: "imaging",
      type: "action",
      title: "Imaging",
      items: ["Obtain AP/lateral CXR and AP abdomen X-ray"],
      footnoteRefs: ["b"],
      next: "objectType",
    },
    objectType: {
      id: "objectType",
      type: "branch",
      title: "What type of object?",
      branches: [
        { label: "Coin / blunt object", next: "coinLoc" },
        { label: "Sharp object", next: "sharpLoc", tone: "warning" },
        { label: "Button battery", next: "bbBleeding", tone: "danger" },
        { label: "Magnet(s)", next: "magnetMultiple", tone: "warning" },
      ],
    },

    // ---------- Coin / blunt ----------
    coinLoc: {
      id: "coinLoc",
      type: "branch",
      title: "Location of the coin/blunt object?",
      branches: [
        { label: "Esophageal", next: "esophEndoscopy" },
        { label: "Gastric", next: "coinGastricSx" },
        { label: "Intestinal", next: "coinIntestinalSx" },
      ],
    },
    coinGastricSx: {
      id: "coinGastricSx",
      type: "decision",
      title: "Symptomatic?",
      branches: [
        { label: "Symptomatic", next: "consultGI", tone: "warning" },
        { label: "Asymptomatic", next: "dischargeAsNeeded", tone: "success" },
      ],
    },
    coinIntestinalSx: {
      id: "coinIntestinalSx",
      type: "decision",
      title: "Symptomatic?",
      branches: [
        { label: "Symptomatic", next: "consultSurgery", tone: "warning" },
        { label: "Asymptomatic", next: "dischargeAsNeeded", tone: "success" },
      ],
    },

    // ---------- Sharp ----------
    sharpLoc: {
      id: "sharpLoc",
      type: "branch",
      title: "Location of the sharp object?",
      branches: [
        { label: "Esophageal", next: "esophEndoscopy" },
        { label: "Gastric", next: "consultGI" },
        { label: "Intestinal", next: "sharpIntestinalSx" },
      ],
    },
    sharpIntestinalSx: {
      id: "sharpIntestinalSx",
      type: "decision",
      title: "Symptomatic?",
      footnoteRefs: ["d"],
      branches: [
        { label: "Symptomatic", next: "consultSurgery", tone: "warning" },
        { label: "Asymptomatic", next: "dischargeRepeatXray", tone: "success" },
      ],
    },

    // ---------- Button battery ----------
    bbBleeding: {
      id: "bbBleeding",
      type: "decision",
      title: "Active upper GI bleeding and/or hemodynamic instability?",
      footnoteRefs: ["e", "f"],
      branches: [
        { label: "Yes", next: "bbUnstable", tone: "danger" },
        { label: "No", next: "bbLoc" },
      ],
    },
    bbUnstable: {
      id: "bbUnstable",
      type: "outcome",
      title: "Resuscitate & consult surgery",
      body: [
        "NPO",
        "Obtain IV access, CBC, PT/PTT, Type & Cross",
        "20 mL/kg NS bolus",
        "Consult Pediatric Surgery (will coordinate OR management with Vascular surgery)",
      ],
      disposition: "or",
      tone: "danger",
    },
    bbLoc: {
      id: "bbLoc",
      type: "branch",
      title: "Location of the button battery?",
      branches: [
        { label: "Esophageal", next: "bbEsoph", tone: "danger" },
        { label: "Gastric", next: "bbGastric", tone: "warning" },
        { label: "Intestinal", next: "bbIntestinalSx" },
      ],
    },
    bbEsoph: {
      id: "bbEsoph",
      type: "outcome",
      title: "NPO — consult Pediatric Surgery for endoscopic removal",
      body: ["Administer 50–150 mL of honey or 0.25% acetic acid PO"],
      disposition: "procedure",
      tone: "danger",
    },
    bbGastric: {
      id: "bbGastric",
      type: "outcome",
      title: "NPO — consult Pediatric GI",
      body: ["Removal recommended within 24 hours"],
      disposition: "consult",
      tone: "warning",
    },
    bbIntestinalSx: {
      id: "bbIntestinalSx",
      type: "decision",
      title: "Symptomatic?",
      branches: [
        { label: "Symptomatic", next: "consultSurgery", tone: "warning" },
        { label: "Asymptomatic", next: "dischargeRepeatXray", tone: "success" },
      ],
    },

    // ---------- Magnet(s) ----------
    magnetMultiple: {
      id: "magnetMultiple",
      type: "decision",
      title: "Multiple magnets reported and/or visualized on X-ray?",
      branches: [
        { label: "No — single magnet", next: "magnetSingleLoc" },
        { label: "Yes — multiple magnets", next: "magnetMultiLoc", tone: "danger" },
      ],
    },
    magnetSingleLoc: {
      id: "magnetSingleLoc",
      type: "branch",
      title: "Location of the magnet?",
      branches: [
        { label: "Esophageal", next: "esophEndoscopy" },
        { label: "Gastric or intestinal", next: "magnetSingleSx" },
      ],
    },
    magnetSingleSx: {
      id: "magnetSingleSx",
      type: "decision",
      title: "Symptomatic?",
      branches: [
        { label: "Symptomatic", next: "consultGI", tone: "warning" },
        { label: "Asymptomatic", next: "dischargeRepeatXray", tone: "success" },
      ],
    },
    magnetMultiLoc: {
      id: "magnetMultiLoc",
      type: "branch",
      title: "Location of the magnets? (consult regardless of symptoms)",
      branches: [
        { label: "Esophageal", next: "magnetMultiEsoph", tone: "danger" },
        { label: "Gastric", next: "magnetMultiGastric", tone: "warning" },
        { label: "Intestinal", next: "magnetMultiIntestinal", tone: "warning" },
      ],
    },
    magnetMultiEsoph: {
      id: "magnetMultiEsoph",
      type: "outcome",
      title: "NPO — consult Pediatric Surgery (regardless of symptoms)",
      disposition: "procedure",
      tone: "danger",
    },
    magnetMultiGastric: {
      id: "magnetMultiGastric",
      type: "outcome",
      title: "NPO — consult Pediatric GI (regardless of symptoms)",
      disposition: "consult",
      tone: "warning",
    },
    magnetMultiIntestinal: {
      id: "magnetMultiIntestinal",
      type: "outcome",
      title: "NPO — consult Pediatric Surgery (regardless of symptoms)",
      disposition: "consult",
      tone: "warning",
    },

    // ---------- Shared outcomes ----------
    esophEndoscopy: {
      id: "esophEndoscopy",
      type: "outcome",
      title: "NPO — consult Pediatric Surgery for endoscopic removal",
      disposition: "procedure",
      tone: "warning",
      footnoteRefs: ["c"],
    },
    consultGI: {
      id: "consultGI",
      type: "outcome",
      title: "NPO — consult Pediatric GI",
      disposition: "consult",
      tone: "warning",
    },
    consultSurgery: {
      id: "consultSurgery",
      type: "outcome",
      title: "NPO — consult Pediatric Surgery",
      disposition: "consult",
      tone: "warning",
    },
    dischargeAsNeeded: {
      id: "dischargeAsNeeded",
      type: "outcome",
      title: "Discharge home",
      body: ["PMD follow-up as needed", "ED return precautions for vomiting, abdominal pain, distension, fever, rectal bleeding"],
      disposition: "discharge",
      tone: "success",
    },
    dischargeRepeatXray: {
      id: "dischargeRepeatXray",
      type: "outcome",
      title: "Discharge home",
      body: ["PMD follow-up in 2–3 days for repeat X-rays", "ED return precautions for vomiting, abdominal pain, distension, fever, rectal bleeding"],
      disposition: "discharge",
      tone: "success",
    },
  },
};
