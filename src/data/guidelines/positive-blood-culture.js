// Positive Blood Culture Management — MU Pediatric Service Line CPG (Jan 2026).
// Transcribed from positive-blood-culture.pdf. Risk-stratified call-back tree
// converging on "return to ED" vs outpatient follow-up.

export default {
  id: "positive-blood-culture",
  title: "Positive Blood Culture",
  fullTitle: "Positive Blood Culture Management",
  category: "infectious",
  icon: "TestTubes",
  keywords: ["blood culture", "bacteremia", "positive blood culture", "gram stain", "sepsis", "contaminant", "callback"],
  shortDescription: "Call-back pathway for a positive blood culture in ED patients < 18 years.",
  sourcePdf: "positive-blood-culture.pdf",
  version: "2026",
  lastEdited: "January 2026",
  authors: ["MB Bernardin", "A Padhye"],
  verified: true,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF.",

  inclusion: ["All ED patients < 18 years (including neonates) with a positive blood culture"],
  exclusion: [],

  callouts: {
    pedsID: {
      tone: "info",
      title: "Consult Peds ID",
      body: "Discussion with Pediatric Infectious Diseases is appropriate at any time point.",
    },
    suggestedComm: {
      tone: "info",
      title: "Suggested communication",
      body: '"Your child\'s blood culture was positive for a bacteria that might cause illness. We recommend bringing your child back to the MU emergency department quickly for re-evaluation, additional bloodwork, and likely staying overnight in the hospital if your doctor feels it is needed."',
    },
  },

  footnotes: {
    a: [
      "High-risk patients:",
      "Neutropenia",
      "Immunocompromise (solid organ transplant, myelosuppressive chemotherapy, stem cell transplant within 100 days, primary immunodeficiency, autoimmune/chronic inflammatory disease on immunosuppression, asplenia including sickle cell disease)",
      "Central line",
      "Hardware in place",
      "Repaired or unrepaired congenital heart disease",
    ],
    c: ["High-risk gram stain:", "Any gram-negative species", "Yeast"],
    d: [
      "High-risk organism:",
      "Gram positives: S. aureus, S. lugdunensis, S. pneumoniae, S. pyogenes (GAS), S. agalactiae (GBS), Listeria monocytogenes, Enterococcus spp.",
      "Enteric gram negatives: Enterobacter cloacae complex, E. coli, Klebsiella spp., Serratia marcescens, Proteus spp., Salmonella spp.",
      "Enterobacterales (even without species identification)",
      "Pseudomonas aeruginosa",
      "Other gram-negative rods (Acinetobacter calcoaceticus-baumannii complex, Bacteroides fragilis)",
      "Neisseria meningitidis; Haemophilus influenzae; Candida spp.",
    ],
    e: [
      "Likely contaminants:",
      "Coagulase-negative Staphylococcus",
      "Staphylococcus epidermidis",
      "No genus/species-level identification",
    ],
  },

  references: [
    "Ann & Robert H. Lurie Children's Hospital of Chicago CPG: Blood culture follow-up: Emergency Department. 2025.",
    "Medical College of Wisconsin CPG: Blood Culture Call-Back Guidance for the Emergency Department. 2024.",
    "BIOFIRE Blood Culture Identification 2 (BCID2) Panel.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "Positive Blood Culture Management",
      body: "Applies to all ED patients < 18 years (including neonates). Micro lab contacts the ED attending with the positive culture and gram stain. Verify the correct patient and review the micro report and risk factors.",
      calloutIds: ["pedsID"],
      next: "highRiskPatient",
    },
    highRiskPatient: {
      id: "highRiskPatient",
      type: "decision",
      title: "High-risk patient?",
      footnoteRefs: ["a"],
      branches: [
        { label: "Yes", next: "returnToED", tone: "danger" },
        { label: "No", next: "highRiskGramStain" },
      ],
    },
    highRiskGramStain: {
      id: "highRiskGramStain",
      type: "decision",
      title: "High-risk gram stain?",
      footnoteRefs: ["c"],
      branches: [
        { label: "Yes", next: "returnToED", tone: "danger" },
        { label: "No", next: "awaitPanel" },
      ],
    },
    awaitPanel: {
      id: "awaitPanel",
      type: "info",
      title: "Await Blood Culture Identification Panel result",
      body: "Result available in the chart in approximately 2 hours.",
      next: "highRiskOrganism",
    },
    highRiskOrganism: {
      id: "highRiskOrganism",
      type: "decision",
      title: "High-risk organism?",
      footnoteRefs: ["d", "e"],
      branches: [
        { label: "Yes", next: "returnToED", tone: "danger" },
        { label: "No", next: "assessClinical" },
      ],
    },
    assessClinical: {
      id: "assessClinical",
      type: "action",
      title: "Contact family and assess clinical status",
      items: ["Contact the family and assess the child's clinical status"],
      next: "afebrileImproving",
    },
    afebrileImproving: {
      id: "afebrileImproving",
      type: "decision",
      title: "Afebrile and showing clinical improvement?",
      branches: [
        { label: "Yes", next: "outpatientFollowup", tone: "success" },
        { label: "No", next: "returnToED", tone: "danger" },
      ],
    },

    returnToED: {
      id: "returnToED",
      type: "outcome",
      title: "Request immediate return to ED",
      body: [
        "Contact family and request immediate return to the ED (see suggested communication)",
        "Document contact with family in the chart (EMS – Free Text Note)",
        "ED re-evaluation including repeat blood culture",
      ],
      disposition: "consult",
      tone: "danger",
      calloutIds: ["suggestedComm", "pedsID"],
    },
    outpatientFollowup: {
      id: "outpatientFollowup",
      type: "outcome",
      title: "PCP follow-up vs return to ED as needed",
      body: ["Document contact with family in the chart (EMS – Free Text Note)"],
      disposition: "discharge",
      tone: "success",
    },
  },
};
