// Pediatric Skin/Soft Tissue Infection — MU Pediatric Service Line CPG (Feb 2025).
// Transcribed from ssti.pdf. Purulent vs non-purulent split; two admission-criteria
// nodes plus an I&D pathway. Antibiotic dosing deferred to the EHR PowerPlan.

export default {
  id: "ssti",
  title: "SSTI",
  fullTitle: "Skin / Soft Tissue Infection",
  category: "infectious",
  icon: "Bandage",
  keywords: ["ssti", "skin and soft tissue infection", "cellulitis", "abscess", "mrsa", "i&d", "incision and drainage", "cephalexin", "clindamycin"],
  shortDescription: "Purulent vs non-purulent SSTI pathway with I&D and admission criteria.",
  sourcePdf: "ssti.pdf",
  version: "2025",
  lastEdited: "February 2025",
  authors: ["MB Bernardin", "A Padhye", "R Marwan", "W Ficker", "K Koehn", "J Kesterson"],
  verified: true,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF.",

  inclusion: ["History/exam concerning for skin/soft tissue infection"],
  exclusion: [
    "Infants < 60 days old",
    "Animal/human bite wounds",
    "Immunodeficiency",
    "Infection associated with an indwelling device",
    "History of recent surgery; hospital-acquired infection",
    "Suspected necrotizing fasciitis",
    "Suspected toxin-mediated reaction (SSSS, toxic shock syndrome)",
    "Suspected severe sepsis",
  ],

  callouts: {
    powerPlan: {
      tone: "info",
      title: "Antibiotic dosing",
      body: "Use PowerPlan “ED PED Skin/Soft Tissue Infection” for antibiotic dosing.",
    },
    consultByLocation: {
      tone: "info",
      title: "Subspecialty consult by abscess location",
      body: [
        "Face: on-call face service (ENT or plastic surgery)",
        "Neck: ENT",
        "Breast: pediatric surgery if prepubescent, general surgery if postpubescent",
        "Vulva/clitoris: pediatric surgery if prepubescent, OB/Gyn if postpubescent",
        "Perianal: pediatric surgery",
        "Hand: on-call hand service (orthopedics or plastic surgery)",
        "Consider pediatric surgery for large abscesses (> 4–5 cm) that may need a vessel loop, or if admission required",
      ],
    },
  },

  footnotes: {
    b: "Purulent SSTI includes abscesses, furuncles, carbuncles, or other SSTI with pus present.",
    c: "Hospitalization criteria (any): systemic symptoms (SIRS), rapid progression of erythema, progression after 48 h of appropriate oral antibiotics, underlying conditions associated with poor response/complications (malignancy, primary immune deficiency, diabetes), inability to tolerate oral antibiotics.",
    d: "ED return precautions: lack of improvement after 48 h of antibiotics, progressive systemic symptoms (altered mental status, dehydration), inability to tolerate oral antibiotics.",
    e: "Blood cultures recommended if systemic symptoms, malignancy on chemotherapy, neutropenia, immunodeficiency, immersion injuries, or animal bites.",
    f: "I&D is the mainstay for purulent SSTI; adjunctive antibiotics are typically given (improve outcomes, may prevent recurrence and spread).",
    g: "Abscesses already spontaneously draining may not require further I&D.",
    h: "Consider pediatric surgery for large abscesses (> 4–5 cm) or if admission required; otherwise consult the on-call service for the abscess location.",
  },

  references: [
    "Marcelin JR, et al. Skin and Soft Tissue Infections: Treatment Guidance. University of Nebraska Medical Center. 2018.",
    "Kaplan S, et al. Skin and soft tissue infections in children > 28 days: Evaluation and management. UpToDate. 2024.",
    "Stevens et al. IDSA Practice Guidelines for the Diagnosis and Management of Skin and Soft Tissue Infections: 2014 Update. Clin Infect Dis. 2014;60(9):1448.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "Skin/Soft Tissue Infection",
      body: "For the child with history/exam concerning for SSTI. Review exclusion criteria, then begin.",
      next: "purulent",
    },
    purulent: {
      id: "purulent",
      type: "decision",
      title: "Concern for purulent SSTI?",
      footnoteRefs: ["b"],
      branches: [
        { label: "No — non-purulent / cellulitis", next: "admitCriteriaCellulitis" },
        { label: "Yes — purulent", next: "obtainUS" },
      ],
    },
    obtainUS: {
      id: "obtainUS",
      type: "action",
      title: "Obtain ultrasound",
      items: ["Obtain US to assess for phlegmon and/or abscess"],
      next: "phlegmon",
    },
    phlegmon: {
      id: "phlegmon",
      type: "decision",
      title: "Presence of phlegmon and/or abscess on US?",
      branches: [
        { label: "No", next: "admitCriteriaCellulitis" },
        { label: "Yes", next: "drainable" },
      ],
    },
    drainable: {
      id: "drainable",
      type: "decision",
      title: "Presence of a drainable fluid collection?",
      branches: [
        { label: "No", next: "admitCriteriaPhlegmon" },
        { label: "Yes", next: "incisionDrainage", tone: "warning" },
      ],
    },

    admitCriteriaCellulitis: {
      id: "admitCriteriaCellulitis",
      type: "decision",
      title: "Meeting admission criteria?",
      footnoteRefs: ["c"],
      branches: [
        { label: "No", next: "dischargeCellulitis", tone: "success" },
        { label: "Yes", next: "admitCellulitis", tone: "warning" },
      ],
    },
    admitCriteriaPhlegmon: {
      id: "admitCriteriaPhlegmon",
      type: "decision",
      title: "Meeting admission criteria?",
      footnoteRefs: ["c"],
      branches: [
        { label: "No", next: "dischargePhlegmon", tone: "success" },
        { label: "Yes", next: "admitPhlegmon", tone: "warning" },
      ],
    },

    dischargeCellulitis: {
      id: "dischargeCellulitis",
      type: "outcome",
      title: "Discharge home",
      body: ["PO cephalexin, or PO clindamycin if MRSA risk factors", "Discuss ED return precautions"],
      disposition: "discharge",
      tone: "success",
      calloutIds: ["powerPlan"],
      footnoteRefs: ["d"],
    },
    admitCellulitis: {
      id: "admitCellulitis",
      type: "outcome",
      title: "Admit to peds floor",
      body: ["IV access and labs", "IV cefazolin, or IV clindamycin if MRSA risk factors"],
      disposition: "admit-floor",
      tone: "warning",
      calloutIds: ["powerPlan"],
      footnoteRefs: ["e"],
    },
    dischargePhlegmon: {
      id: "dischargePhlegmon",
      type: "outcome",
      title: "Discharge home",
      body: ["PO clindamycin", "Discuss ED return precautions"],
      disposition: "discharge",
      tone: "success",
      calloutIds: ["powerPlan"],
      footnoteRefs: ["d", "f"],
    },
    admitPhlegmon: {
      id: "admitPhlegmon",
      type: "outcome",
      title: "Admit to peds floor",
      body: [
        "Admit to peds floor (or subspecialty service if advised by consultants)",
        "IV access and labs",
        "IV clindamycin",
      ],
      disposition: "admit-floor",
      tone: "warning",
      calloutIds: ["powerPlan"],
      footnoteRefs: ["e", "f"],
    },
    incisionDrainage: {
      id: "incisionDrainage",
      type: "outcome",
      title: "Incision & drainage",
      body: [
        "Consult subspecialty services for abscesses requiring I&D based on location and complexity",
        "Perform I&D with analgesia and sedation as needed",
        "Obtain wound culture",
      ],
      disposition: "procedure",
      tone: "warning",
      calloutIds: ["consultByLocation", "powerPlan"],
      footnoteRefs: ["g", "h"],
    },
  },
};
