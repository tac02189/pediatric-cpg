// Pediatric Sexual Abuse/Assault Management — MU Pediatric Service Line CPG
// (Jan 2025). Transcribed from sexual-abuse.pdf. High-stakes child-protection
// guideline. Exercises weight-AND-sex conditional dosing (metronidazole) plus
// computed ceftriaxone/doxycycline. Mandated-reporter obligations stand.

export default {
  id: "sexual-abuse",
  title: "Sexual Abuse/Assault",
  fullTitle: "Sexual Abuse/Assault Management",
  category: "child-protection",
  icon: "ShieldAlert",
  keywords: ["sexual abuse", "sexual assault", "safe", "p-sane", "psane", "sti prophylaxis", "forensic exam", "rainbow house"],
  shortDescription: "Forensic-exam triage and STI testing/prophylaxis for the child < 14 with abuse concern.",
  sourcePdf: "sexual-abuse.pdf",
  version: "2025",
  lastEdited: "January 2025",
  authors: ["M. Bernardin", "K. Cutler", "W. Ficker", "M. Hayes", "G. Koburov", "H. Monroe", "A. Padhye", "J. Butterfield"],
  verified: false,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF. Does not replace mandated-reporter obligations or institutional policy.",

  inclusion: ["Patient < 14 years with concern for sexual abuse/assault"],
  exclusion: [],

  calculators: {
    stiProphylaxis: {
      kind: "dosing",
      id: "stiProphylaxis",
      name: "STI prophylaxis",
      inputs: ["weightKg", "sex"],
      drugs: [
        { name: "Ceftriaxone", route: "IV or IM", dose: { mgPerKg: 50, maxMg: 500 } },
        { name: "Doxycycline", route: "PO", dose: { mgPerKg: 2.2, maxMg: 100, frequency: "BID × 7 days" } },
        {
          name: "Metronidazole",
          route: "PO",
          note: "Recommended for postpubertal females.",
          rules: [
            {
              when: (c) => typeof c.weightKg === "number" && c.weightKg < 45,
              label: "< 45 kg",
              dose: { mgPerKg: 45, maxMg: 2000, frequency: "/day, divided q8h × 7 days" },
            },
            {
              when: (c) => typeof c.weightKg === "number" && c.weightKg >= 45 && c.sex === "female",
              label: "≥ 45 kg, female",
              displayDose: "500 mg q12h × 7 days",
            },
            {
              when: (c) => typeof c.weightKg === "number" && c.weightKg >= 45 && c.sex === "male",
              label: "≥ 45 kg, male",
              displayDose: "2000 mg as a single dose",
            },
          ],
        },
      ],
    },
  },

  callouts: {
    mandatedReporting: {
      tone: "warning",
      title: "Forensic care & mandated reporting",
      body: "Once a forensic exam is indicated, only the P-SANE or ED attending should ask about the assault — minimize re-telling of the event. This pathway does not replace mandated-reporter obligations or institutional policy. Hotline and Rainbow House referral are typically indicated for all children < 18 years.",
    },
    stiTestingIndications: {
      tone: "info",
      title: "STI testing indications",
      body: [
        "Postpubertal patients, OR prepubertal patients with any of:",
        "History of penetration, or child unable to provide details",
        "Acute genital, anal, and/or oropharyngeal injury",
        "Assault by a stranger or perpetrator known to be high risk for STIs",
        "Genital symptoms (discharge, pain) or lesions (vesicles, warts) concerning for STIs",
        "Patient or family request",
      ],
    },
    stiProphylaxisIndications: {
      tone: "info",
      title: "STI prophylaxis indications",
      body: [
        "Postpubertal patients, OR prepubertal patients with any of:",
        "Symptoms suggesting STI",
        "Oral, genital, and/or anal injury",
        "Assault by a stranger or perpetrator known to be high risk for STIs",
        "Concern for sex trafficking",
        "Substantial HIV risk exposure",
      ],
    },
    hivConsult: {
      tone: "warning",
      title: "HIV",
      body: "Consult Peds ID for prophylactic treatment recommendations if substantial HIV risk exposure.",
    },
    vaccination: {
      tone: "info",
      title: "Vaccination",
      body: "Vaccinate against Hepatitis B and HPV if not fully immunized.",
    },
  },

  footnotes: {
    a: "Patients ≥ 14 years can be managed by the adult SANE. Hotline and referral to Rainbow House are typically indicated for all children < 18 years.",
    b: "Once the visit is determined to be for a forensic exam, it is critical that no further questions about the abuse/assault be asked by anyone other than the P-SANE or ED attending — minimize re-telling. The forensic interview is performed at the Child Advocacy Center.",
    c: "A physician medical screening exam is required at the presenting facility to identify injuries needing intervention and to determine whether an emergent exam or referral to Rainbow House is appropriate.",
    d: "Transfer of genetic material is suspected with contact with a perpetrator's mouth, genitals, or blood. SAFE may be performed if a child cannot provide details but forensic evidence is still suspected.",
    e: "Perpetrators considered high risk for STIs: injection drug users, males who have sex with males, persons with multiple sex partners, and/or a history of STIs.",
    f: "Substantial HIV risk exposure: exposure of vagina, rectum, eye, mouth/mucous membrane, and/or nonintact skin/percutaneous contact with blood, secretions, breast milk, or fluids visibly contaminated with blood, when the source is HIV positive and/or high risk.",
    g: "Vaccinate against Hepatitis B and HPV if not fully immunized.",
    h: [
      "Metronidazole prophylaxis (recommended for postpubertal females):",
      "< 45 kg: 45 mg/kg/day divided q8h × 7 days (max 2000 mg/day)",
      "≥ 45 kg females: 500 mg q12h × 7 days",
      "≥ 45 kg males: 2000 mg as a single dose",
    ],
  },

  references: [
    "ED Adult and Pediatric Sexual Assault Nurse Examination (SANE/PSANE) Policy. 2023.",
    "ED Pediatric Sexual Assault Nurse Examination (PSANE) Protocol.",
    "St. Louis Children's Hospital Sexual Assault Guideline. 2021.",
    "CDC, Sexually Transmitted Infections Treatment Guidelines. 2021.",
    "CDC, Updated Guidelines for Antiretroviral Postexposure Prophylaxis After Nonoccupational Exposure to HIV. 2016.",
    "Red Book. 2024.",
    "Children's Hospital of Philadelphia ED Clinical Pathway for Children with Sexual Abuse Concerns. 2024.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "Sexual Abuse/Assault Management",
      body: "For the patient < 14 years with concern for sexual abuse/assault.",
      calloutIds: ["mandatedReporting"],
      footnoteRefs: ["a"],
      next: "residentScope",
    },
    residentScope: {
      id: "residentScope",
      type: "action",
      title: "Resident scope (trauma-informed care training)",
      items: [
        "Sign up for potential P-SANE patients after discussion with the PEM attending",
        "Take the HPI from the caregiver in private (NOT in the presence of the patient)",
        "Ask the patient how their body feels / if they have pain — do NOT ask leading or specific questions about what happened",
        "Do a basic physical exam EXCLUDING the GU exam",
        "Tell the family that next steps will be discussed with the attending physician",
      ],
      footnoteRefs: ["b"],
      next: "medScreening",
    },
    medScreening: {
      id: "medScreening",
      type: "action",
      title: "Perform medical screening exam",
      items: ["Perform a physician medical screening exam"],
      footnoteRefs: ["c"],
      next: "forensicCriteria",
    },
    forensicCriteria: {
      id: "forensicCriteria",
      type: "decision",
      title: "Presence of any of the following?",
      body: [
        "Witness to / disclosure of assault that may have transferred genetic material within the last 72 hours",
        "Or debris/body fluids visible on the patient's body/clothing",
        "Or an acute genital/anal injury concerning for sexual abuse/assault",
      ],
      footnoteRefs: ["d"],
      branches: [
        { label: "No", next: "hotlineReferral" },
        { label: "Yes", next: "consultPSANE", tone: "warning" },
      ],
    },

    hotlineReferral: {
      id: "hotlineReferral",
      type: "action",
      title: "Hotline & referral",
      items: ["Place Hotline to DFS", "Referral to the Child Advocacy Center at Rainbow House"],
      next: "stiTestingIndicated",
    },
    consultPSANE: {
      id: "consultPSANE",
      type: "action",
      title: "Consult P-SANE for SAFE",
      items: [
        "Consult P-SANE for the Sexual Assault Forensic Exam (SAFE)",
        "P-SANE will assist with placing the hotline and referring to the Child Advocacy Center at Rainbow House",
      ],
      next: "childRefusesSAFE",
    },
    childRefusesSAFE: {
      id: "childRefusesSAFE",
      type: "decision",
      title: "Child refuses SAFE?",
      branches: [
        { label: "Yes — no SAFE", next: "noSAFE" },
        { label: "No — P-SANE performs SAFE", next: "performSAFE" },
      ],
    },
    noSAFE: {
      id: "noSAFE",
      type: "info",
      title: "No SAFE performed",
      next: "stiTestingIndicated",
    },
    performSAFE: {
      id: "performSAFE",
      type: "info",
      title: "P-SANE performs SAFE",
      next: "stiTestingIndicated",
    },

    stiTestingIndicated: {
      id: "stiTestingIndicated",
      type: "decision",
      title: "Indications for STI testing met?",
      footnoteRefs: ["e"],
      calloutIds: ["stiTestingIndications"],
      branches: [
        { label: "Yes", next: "obtainStiTests" },
        { label: "No", next: "stiTestingNotIndicated" },
      ],
    },
    stiTestingNotIndicated: {
      id: "stiTestingNotIndicated",
      type: "info",
      title: "STI testing not indicated",
      next: "stiProphylaxisIndicated",
    },
    obtainStiTests: {
      id: "obtainStiTests",
      type: "action",
      title: "Obtain STI tests",
      items: [
        "Non-clean / 'dirty catch' urine for GC/chlamydia NAAT and trichomonas NAAT",
        "If injury or report of penetration: GC/chlamydia mucous-membrane NAAT swabs (pharyngeal, rectal, vaginal) and trichomonas vaginal NAAT swab",
        "Blood: HIV 1,2 Ag/Ab, syphilis IgG/IgM Ab, Hepatitis C Ab",
        "If not Hep B immunized: Hep B surface Ag, Hep B surface Ab, Hep B core Ab IgM",
      ],
      next: "stiProphylaxisIndicated",
    },
    stiProphylaxisIndicated: {
      id: "stiProphylaxisIndicated",
      type: "decision",
      title: "Indications for STI prophylaxis met?",
      footnoteRefs: ["f"],
      calloutIds: ["stiProphylaxisIndications"],
      branches: [
        { label: "Yes", next: "stiProphylaxis", tone: "warning" },
        { label: "No", next: "stiTreatmentNotIndicated", tone: "success" },
      ],
    },
    stiTreatmentNotIndicated: {
      id: "stiTreatmentNotIndicated",
      type: "outcome",
      title: "STI treatment not indicated",
      body: ["Coordinate disposition and follow-up with P-SANE and the Child Advocacy Center (Rainbow House)"],
      disposition: "discharge",
      tone: "info",
    },
    stiProphylaxis: {
      id: "stiProphylaxis",
      type: "dosing",
      title: "STI prophylaxis",
      body: "Metronidazole is recommended for postpubertal females (weight/sex-based dosing below).",
      calculatorId: "stiProphylaxis",
      calloutIds: ["hivConsult", "vaccination"],
      footnoteRefs: ["g", "h"],
      next: "prophylaxisDone",
    },
    prophylaxisDone: {
      id: "prophylaxisDone",
      type: "outcome",
      title: "Prophylaxis given",
      body: ["Coordinate disposition and follow-up with P-SANE and the Child Advocacy Center (Rainbow House)"],
      disposition: "consult",
      tone: "success",
    },
  },
};
