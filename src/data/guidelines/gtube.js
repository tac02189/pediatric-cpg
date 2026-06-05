// G/GJ/J Tube Dislodgement — MU Pediatric Service Line CPG (Feb 2025).
// Transcribed from gtube.pdf. Tube-type triage; the G-tube path includes a
// foley-dilation fallback and gastric dye-study confirmation, with convergence
// on discharge / consult outcomes.

export default {
  id: "gtube",
  title: "G/GJ/J Tube Dislodgement",
  fullTitle: "Gastrostomy / GJ / Jejunostomy Tube Dislodgement",
  category: "abdominal-gi",
  icon: "Milk",
  keywords: ["g tube", "gj tube", "j tube", "gastrostomy", "gastrojejunostomy", "jejunostomy", "feeding tube", "dislodged tube", "foley"],
  shortDescription: "Replacement pathway for a dislodged feeding tube by tube type and tract maturity.",
  sourcePdf: "gtube.pdf",
  version: "2025",
  lastEdited: "February 2025",
  authors: ["MB Bernardin", "R Marwan"],
  verified: true,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF.",

  inclusion: ["Child with a dislodged G/GJ/J tube"],
  exclusion: ["Adults > 18 years", "NG tubes"],

  footnotes: {
    b: "G tubes inadvertently removed within 4–6 weeks of placement should NOT be replaced blindly at bedside — immature tract with risk of placement into the peritoneal cavity instead of the stomach.",
    c: "If a replacement G tube is unavailable, place a same-size foley catheter, inflate the balloon, and discharge home with pediatric surgery clinic follow-up the following day.",
    d: "G tube replacement: pass the catheter tip into the gastrostomy opening and push down toward the stomach, perpendicular to the abdominal wall, with steady firm pressure (may take 30–45 sec to stretch the site). When the gastric lumen is entered, resistance suddenly lessens.",
    e: "G tube tracts begin closing within 24 hours (sometimes within 4–8 hours). Do not delay foley placement if a replacement G tube is not immediately available. Insert the foley gently with lubricant and secure by taping to the abdomen.",
    f: "Gastric dye study is indicated after the first replacement, difficulty replacing, concern for tract trauma, and/or inability to aspirate gastric contents. Order as 'XR abdomen; Stat' with 'Comments: gastric dye study to confirm G tube placement.'",
    g: "Gastric contents/juices should have pH < 4.",
    h: "ED return precautions: recurrent dislodgement, worsening abdominal distension, severe abdominal pain, persistent vomiting.",
  },

  references: [
    "DeLegge MH, et al. Gastrostomy tubes: Complications and their management. UpToDate. 2024.",
    "Shaw KN, et al. Fleisher & Ludwig's Textbook of Pediatric Emergency Medicine, 7th Edition. 2016.",
    "Children's Hospital of Philadelphia ED pathway for care of the child with GJ or G tube displacement. 2024.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "G/GJ/J Tube Dislodgement",
      body: "For the child with a dislodged gastrostomy, gastrojejunostomy, or jejunostomy tube.",
      next: "tubeType",
    },
    tubeType: {
      id: "tubeType",
      type: "branch",
      title: "Determine the type of tube",
      branches: [
        { label: "J tube", next: "consultSurgeryJ" },
        { label: "GJ tube", next: "consultIR" },
        { label: "G tube", next: "under6weeks" },
      ],
    },
    consultSurgeryJ: {
      id: "consultSurgeryJ",
      type: "outcome",
      title: "Consult pediatric surgery",
      body: ["J tube dislodgement"],
      disposition: "consult",
      tone: "warning",
    },
    consultIR: {
      id: "consultIR",
      type: "outcome",
      title: "Consult Interventional Radiology",
      body: ["GJ tube dislodgement"],
      disposition: "consult",
      tone: "warning",
    },

    under6weeks: {
      id: "under6weeks",
      type: "decision",
      title: "G tube — initial placement < 6 weeks ago?",
      branches: [
        { label: "Yes", next: "doNotReplace", tone: "danger" },
        { label: "No", next: "replacementAvailable" },
      ],
    },
    doNotReplace: {
      id: "doNotReplace",
      type: "outcome",
      title: "Do not replace at bedside",
      body: ["Do not attempt to replace the tube blindly", "Consult pediatric surgery for replacement"],
      disposition: "consult",
      tone: "danger",
      footnoteRefs: ["b"],
    },
    replacementAvailable: {
      id: "replacementAvailable",
      type: "decision",
      title: "Replacement G tube immediately available?",
      branches: [
        { label: "Yes", next: "replaceGtube" },
        { label: "No", next: "obtainGtube" },
      ],
    },
    obtainGtube: {
      id: "obtainGtube",
      type: "action",
      title: "Obtain a replacement G tube",
      items: ["Consult pediatric surgery", "G tube to be obtained from pediatric surgery clinic vs OR"],
      footnoteRefs: ["c"],
      next: "replaceGtube",
    },
    replaceGtube: {
      id: "replaceGtube",
      type: "action",
      title: "Replace the G tube",
      items: [
        "Pass the catheter tip into the gastrostomy opening; push toward the stomach, perpendicular to the abdominal wall, with steady firm pressure",
        "Resistance suddenly lessens when the gastric lumen is entered",
      ],
      footnoteRefs: ["d"],
      next: "successfulReplacement",
    },
    successfulReplacement: {
      id: "successfulReplacement",
      type: "decision",
      title: "Successful replacement?",
      branches: [
        { label: "Yes", next: "difficultOrMultiple" },
        { label: "No", next: "foleyDilate", tone: "warning" },
      ],
    },
    foleyDilate: {
      id: "foleyDilate",
      type: "action",
      title: "Foley catheter & stoma dilation",
      items: [
        "Place a same-size foley catheter in the stoma (or smaller if unable to place same size)",
        "Dilate the stoma with progressively larger foley every 20–30 min until able to replace the G tube",
      ],
      footnoteRefs: ["e"],
      next: "foleySuccess",
    },
    foleySuccess: {
      id: "foleySuccess",
      type: "decision",
      title: "Successful replacement after dilation?",
      branches: [
        { label: "Yes", next: "gastricDyeStudy", tone: "success" },
        { label: "No", next: "consultSurgery", tone: "warning" },
      ],
    },
    difficultOrMultiple: {
      id: "difficultOrMultiple",
      type: "decision",
      title: "Difficult replacement and/or multiple attempts made?",
      branches: [
        { label: "Yes", next: "gastricDyeStudy", tone: "warning" },
        { label: "No", next: "ableToAspirate" },
      ],
    },
    ableToAspirate: {
      id: "ableToAspirate",
      type: "decision",
      title: "Able to aspirate gastric juices?",
      footnoteRefs: ["g"],
      branches: [
        { label: "Yes", next: "dischargeHome", tone: "success" },
        { label: "No", next: "gastricDyeStudy", tone: "warning" },
      ],
    },
    gastricDyeStudy: {
      id: "gastricDyeStudy",
      type: "action",
      title: "Confirm placement with gastric dye study",
      items: ["Order: 'XR abdomen; Stat' — Comments: gastric dye study to confirm G tube placement"],
      footnoteRefs: ["f"],
      next: "correctPlacement",
    },
    correctPlacement: {
      id: "correctPlacement",
      type: "decision",
      title: "Correct placement on dye study?",
      branches: [
        { label: "Yes", next: "dischargeHome", tone: "success" },
        { label: "No", next: "consultSurgery", tone: "warning" },
      ],
    },

    dischargeHome: {
      id: "dischargeHome",
      type: "outcome",
      title: "Discharge home",
      body: ["Discuss ED return precautions"],
      disposition: "discharge",
      tone: "success",
      footnoteRefs: ["h"],
    },
    consultSurgery: {
      id: "consultSurgery",
      type: "outcome",
      title: "Consult pediatric surgery",
      disposition: "consult",
      tone: "warning",
    },
  },
};
