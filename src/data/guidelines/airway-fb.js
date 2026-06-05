// Pediatric Airway Foreign Body Management — MU Pediatric Service Line CPG (Jan 2025).
// Transcribed from airway-fb.pdf. Complete-obstruction emergency vs the imaging
// pathway, with the "concerning history" branch converging on bronchoscopy.

export default {
  id: "airway-fb",
  title: "Airway Foreign Body",
  fullTitle: "Airway Foreign Body",
  category: "respiratory",
  icon: "Wind",
  keywords: ["airway foreign body", "aspiration", "choking", "foreign body aspiration", "heimlich", "bronchoscopy", "stridor", "fb"],
  shortDescription: "Complete-obstruction management and the imaging/bronchoscopy pathway for aspirated FB.",
  sourcePdf: "airway-fb.pdf",
  version: "2025",
  lastEdited: "January 2025",
  authors: ["MB Bernardin", "S Early", "E Gov-Ari", "R Nevel", "Z Ner"],
  verified: true,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF.",

  inclusion: ["History/exam concerning for an airway foreign body"],
  exclusion: ["Adults > 18 years", "Known abnormal airway", "Tracheostomy"],

  footnotes: {
    a: "Most common symptoms after FB aspiration: persistent coughing (most frequent), difficulty breathing, wheezing. A witnessed choking event is highly suggestive (sensitivity up to 93%). The classic triad (cough, focal wheeze, decreased breath sounds) is present in only 14%.",
    c: "Signs of complete upper airway (larynx/trachea) obstruction: sudden choking ± vomiting, severe respiratory distress, inability to speak/cough, cyanosis, altered mental status progressing rapidly to unconsciousness and cardiopulmonary arrest.",
    d: "Back blows/chest thrusts and the Heimlich maneuver should NOT be performed in partial upper airway obstruction (child who can speak/cough) — risk of converting partial to complete obstruction.",
    e: "Cricothyrotomy for airway FB above the vocal cords if unable to remove with Magill forceps; performed by ENT if possible. Needle cricothyrotomy for children < 12 yr; surgical cricothyrotomy for children > 12 yr.",
    f: "CXRs are frequently normal (~30%) with aspirated FBs. A normal CXR does NOT rule out an aspirated FB (atelectasis/consolidation/air trapping often not appreciable; many FBs are radiolucent).",
    g: "ED return precautions: development of persistent cough or respiratory distress.",
    h: "CXR findings suggestive of aspirated FB: visible radio-opaque FB, segmental/lobar consolidation or collapse/atelectasis, hyperinflation distal to obstruction (air trapping), mediastinal shift.",
  },

  references: [
    "Shaw KN, et al. Fleisher & Ludwig's Textbook of Pediatric Emergency Medicine, 7th Edition. 2016.",
    "Loftis L, et al. Emergency evaluation of acute upper airway obstruction in children. UpToDate. 2024.",
    "Ruiz FR, et al. Airway foreign bodies in children. UpToDate. 2024.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "Airway Foreign Body",
      body: "For the child with history/exam concerning for an airway foreign body.",
      footnoteRefs: ["a"],
      next: "completeObstruction",
    },
    completeObstruction: {
      id: "completeObstruction",
      type: "decision",
      title: "Concern for complete airway obstruction?",
      footnoteRefs: ["c"],
      branches: [
        { label: "Yes", next: "completeObstructionMgmt", tone: "danger" },
        { label: "No", next: "respDistress" },
      ],
    },
    completeObstructionMgmt: {
      id: "completeObstructionMgmt",
      type: "action",
      title: "Complete obstruction — emergent management",
      items: [
        "Emergent consult to difficult airway/anesthesia & ENT",
        "Infants: alternating 5 back blows and 5 chest thrusts",
        "Children: Heimlich maneuver (5 abdominal thrusts)",
        "After each cycle, check airway patency and remove visible FBs (do NOT perform blind finger sweeps)",
        "Start CPR beginning with compressions if unresponsiveness ensues",
        "Direct laryngoscopy with Magill forceps if unable to dislodge or unresponsiveness ensues",
        "Intubation with advancement of FB to R mainstem bronchus if FB is below the vocal cords",
        "Cricothyrotomy if unable to remove FB above the vocal cords",
      ],
      footnoteRefs: ["d", "e"],
      next: "orOutcome",
    },
    orOutcome: {
      id: "orOutcome",
      type: "outcome",
      title: "Consult pediatric pulmonology & proceed to OR",
      body: ["For FB removal and definitive airway as needed"],
      disposition: "or",
      tone: "danger",
    },

    respDistress: {
      id: "respDistress",
      type: "decision",
      title: "Respiratory distress?",
      branches: [
        { label: "Yes", next: "respDistressMgmt", tone: "warning" },
        { label: "No", next: "obtainCXR" },
      ],
    },
    respDistressMgmt: {
      id: "respDistressMgmt",
      type: "action",
      title: "Respiratory distress management",
      items: ["NPO", "Consult ENT for possible bronchoscopy"],
      next: "obtainCXR",
    },
    obtainCXR: {
      id: "obtainCXR",
      type: "action",
      title: "Obtain CXR",
      items: [
        "Inspiratory and expiratory CXR",
        "OR AP and bilateral lateral decubitus CXR in young children who cannot perform inspiratory/expiratory views",
      ],
      next: "cxrResult",
    },
    cxrResult: {
      id: "cxrResult",
      type: "branch",
      title: "CXR result?",
      footnoteRefs: ["f", "h"],
      branches: [
        { label: "Normal CXR", next: "normalCXR" },
        { label: "Abnormal CXR", next: "bronchoscopy", tone: "warning" },
      ],
    },
    normalCXR: {
      id: "normalCXR",
      type: "branch",
      title: "Clinical picture?",
      branches: [
        { label: "Asymptomatic AND normal exam", next: "dischargeFollowup", tone: "success" },
        {
          label: "Concerning history for witnessed aspiration AND persistent symptoms or abnormal exam",
          next: "bronchoscopy",
          tone: "warning",
        },
      ],
    },

    dischargeFollowup: {
      id: "dischargeFollowup",
      type: "outcome",
      title: "Discharge home",
      body: [
        "Primary MD follow-up in 2–3 days",
        "Consider repeat CXR if symptoms develop",
        "ED return precautions",
      ],
      disposition: "discharge",
      tone: "success",
      footnoteRefs: ["g"],
    },
    bronchoscopy: {
      id: "bronchoscopy",
      type: "outcome",
      title: "NPO — consult ENT for possible bronchoscopy",
      body: ["If going to OR for bronchoscopy, consult pediatric pulmonology"],
      disposition: "consult",
      tone: "warning",
    },
  },
};
