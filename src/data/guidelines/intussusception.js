// Pediatric Ileocolic Intussusception — MU Pediatric Service Line CPG (Nov 2025).
// Transcribed from intussusception.pdf. Peritonitis and US pathways converge on
// the reduction workflow; computed pre-op antibiotic dosing.

export default {
  id: "intussusception",
  title: "Intussusception",
  fullTitle: "Ileocolic Intussusception",
  category: "abdominal-gi",
  icon: "Baby",
  keywords: ["intussusception", "ileocolic", "abdominal pain", "currant jelly", "enema", "sausage mass", "reduction"],
  shortDescription: "Peritonitis triage, ultrasound, and enema-reduction pathway for ileocolic intussusception.",
  sourcePdf: "intussusception.pdf",
  version: "2025",
  lastEdited: "November 2025",
  authors: ["MB Bernardin", "M Hayes", "K Cutler", "R Marwan"],
  verified: true,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF.",

  inclusion: ["History/exam concerning for ileocolic intussusception"],
  exclusion: ["Adults > 18 years", "Small bowel intussusception", "Recent abdominal/bowel surgery"],

  calculators: {
    preopAbx: {
      kind: "dosing",
      id: "preopAbx",
      name: "Pre-op antibiotics",
      drugs: [
        { name: "Ceftriaxone", route: "IV", dose: { mgPerKg: 50, maxMg: 2000 } },
        { name: "Metronidazole", route: "IV", dose: { mgPerKg: 30, maxMg: 1000 } },
      ],
    },
  },

  footnotes: {
    a: [
      "Features suggesting ileocolic intussusception:",
      "Most frequent at age 3 months–3 years (older children usually have a pathologic lead point)",
      "Sudden onset of intermittent, severe, crampy, progressive abdominal pain",
      "Inconsolable crying and drawing legs up toward the abdomen",
      "Vomiting (initially nonbilious, may become bilious)",
      "A 'sausage-shaped mass' may be palpable in the right abdomen",
      "Bloody stool in < 25%; 'currant jelly' stool is typically a late finding",
    ],
    c: "Signs of peritonitis: abdominal tenderness with guarding, rebound tenderness, and/or rigidity.",
    d: "Small bowel intussusception is usually a benign incidental finding (may be associated with bowel inflammation, e.g. gastroenteritis, HSP). Operative reduction usually not required; most reduce spontaneously.",
    e: "IV antibiotic dosing: ceftriaxone 50 mg/kg (max 2 g), metronidazole 30 mg/kg (max 1 g).",
    f: "ED discharge criteria: adequate hydration and PO intake, adequate pain control, caregiver agreeable/comfortable with discharge, reliable transportation back to the ED, acceptable travel distance from home to ED.",
    g: "ED return precautions: recurrence of abdominal pain, persistent emesis, altered mental status, blood per rectum.",
  },

  references: [
    "Salazar J, et al. Intussusception in children. UpToDate. 2024.",
    "Children's Hospital of Philadelphia ED Clinical Pathway for Suspected Ileocolic Intussusception.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "Ileocolic Intussusception",
      body: "For the child with history/exam concerning for intussusception.",
      footnoteRefs: ["a"],
      next: "peritonitis",
    },
    peritonitis: {
      id: "peritonitis",
      type: "decision",
      title: "Signs of peritonitis?",
      footnoteRefs: ["c"],
      branches: [
        { label: "Yes", next: "peritonitisWorkup", tone: "danger" },
        { label: "No", next: "obtainUS" },
      ],
    },
    peritonitisWorkup: {
      id: "peritonitisWorkup",
      type: "action",
      title: "Peritonitis work-up",
      items: [
        "Consult pediatric surgery",
        "NPO, NG tube",
        "IV access, labs",
        "Give 20 mL/kg NS bolus",
        "Bedside 2-view XR abdomen to evaluate for free air",
      ],
      next: "freeAir",
    },
    freeAir: {
      id: "freeAir",
      type: "decision",
      title: "Free air on XR abdomen?",
      branches: [
        { label: "Yes", next: "preopAntibiotics", tone: "danger" },
        { label: "No", next: "obtainUS" },
      ],
    },
    preopAntibiotics: {
      id: "preopAntibiotics",
      type: "dosing",
      title: "Give pre-op antibiotics",
      calculatorId: "preopAbx",
      footnoteRefs: ["e"],
      next: "orAdmit",
    },
    orAdmit: {
      id: "orAdmit",
      type: "outcome",
      title: "To the OR — admit to pediatric surgery",
      disposition: "or",
      tone: "danger",
    },

    obtainUS: {
      id: "obtainUS",
      type: "action",
      title: "Obtain US abdomen",
      items: ["Obtain ultrasound of the abdomen"],
      next: "usPositive",
    },
    usPositive: {
      id: "usPositive",
      type: "decision",
      title: "US positive for ileocolic intussusception?",
      branches: [
        { label: "Yes", next: "enemaWorkup" },
        { label: "No", next: "altDx" },
      ],
    },
    altDx: {
      id: "altDx",
      type: "outcome",
      title: "Consider alternative diagnoses",
      body: ["Consider alternative diagnoses and work up", "Consider repeat US if symptoms recur"],
      disposition: "workup",
      tone: "info",
      footnoteRefs: ["d"],
    },
    enemaWorkup: {
      id: "enemaWorkup",
      type: "action",
      title: "Reduction work-up",
      items: ["Consult pediatric surgery", "Consult radiology", "NPO", "IV access", "Air/contrast enema"],
      next: "successfulReduction",
    },
    successfulReduction: {
      id: "successfulReduction",
      type: "decision",
      title: "Successful reduction?",
      branches: [
        { label: "Yes", next: "observe", tone: "success" },
        { label: "No", next: "repeatEnema", tone: "warning" },
      ],
    },
    observe: {
      id: "observe",
      type: "action",
      title: "ED observation",
      items: ["ED observation for 4–6 hours", "PO challenge"],
      next: "dischargeCriteria",
    },
    dischargeCriteria: {
      id: "dischargeCriteria",
      type: "decision",
      title: "PO challenge passed, no pain recurrence, and meeting discharge criteria?",
      footnoteRefs: ["f"],
      branches: [
        { label: "Yes", next: "dischargeHome", tone: "success" },
        { label: "No", next: "admitSurgery", tone: "warning" },
      ],
    },
    repeatEnema: {
      id: "repeatEnema",
      type: "action",
      title: "Repeat enema vs operative reduction",
      items: ["Repeat enema vs operative reduction per pediatric surgery"],
      next: "admitSurgery",
    },

    dischargeHome: {
      id: "dischargeHome",
      type: "outcome",
      title: "Discharge home",
      body: ["Discuss ED return precautions"],
      disposition: "discharge",
      tone: "success",
      footnoteRefs: ["g"],
    },
    admitSurgery: {
      id: "admitSurgery",
      type: "outcome",
      title: "Admit to pediatric surgery",
      disposition: "admit-floor",
      tone: "warning",
    },
  },
};
