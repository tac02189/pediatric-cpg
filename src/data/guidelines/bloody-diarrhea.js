// Bloody Diarrhea Management — University of Missouri Children's Service Line
// CPG (November 2026). Transcribed from bloody-diarrhea.pdf (2 pages: the
// flowchart, then footnotes a–g and references). Ships as DRAFT (verified:
// false) pending physician review. Wording is near-verbatim: typography is
// house style ("mL", en dashes in ranges, "×"), and the one typo correction
// is listed below. There are no drug doses: the NS bolus (10–20 mL/kg) and
// D5NS hyperhydration (1.5× maintenance) are text only, as DKA's fluids are,
// because the PDF gives no maximum bolus volume and no maintenance-rate
// formula. Verify against the source PDF.
//
// Source layout: one stacked box (exam, IV, labs, type and screen, NS bolus),
// then three decisions in series. Labs concerning for HUS: Yes → admit, No →
// HUS/STEC risk factors. Risk factors: Yes → admit, No → meeting discharge
// criteria. Discharge criteria: Yes → discharge, No → admit. The "Yes" from
// risk factors and the "No" from discharge criteria join one line into the
// admit box, so all three reach the same admit step. The arrows are not in
// the PDF's text layer: this routing was read from the rendered page and an
// enlarged crop of it (and confirmed by Codex from the same images).
//
// Transcription choices, for the physician audit:
//  • Footnote a is the start box's exclusion criteria, so the start step
//    shows it as its exclusion list and doesn't repeat it as a footnote; it
//    stays in References & notes.
//  • Footnote b is printed on "GI PCR" in the labs line and c on the NS bolus
//    line; both show under the initial-evaluation step.
//  • The "**" opening the post-discharge +STEC instruction has no matching
//    note; read as emphasis (a warning callout on the discharge step).
//
// Physician decisions (Thiago; the first two on 2026-11-08, the last two on
// 2026-11-09). The first three don't depart from the PDF, so they are not
// deviations to carry through a PDF sync: if a later edition changes one,
// follow the new PDF. The fourth corrects a typo in the PDF: keep that
// correction through any PDF sync while the typo remains. If a later review
// flags a decision again, relay it verbatim and note what he confirmed, and
// when.
//  • Footnote d is confirmed as printed. Each finding alone routes to
//    admission, including "> 5% decrease in platelet count since onset of
//    symptoms", ii's "platelets < 150k" (no unit) and iii's "increase in Cr
//    by 50% or 0.2 mg/dL or more from previous baseline". Review had raised
//    two concerns (Gemini; neither verified here): that platelet counts can
//    vary by about 5% between draws, so the 5% may be a typo; and that a
//    0.2 mg/dL creatinine rise is more sensitive than KDIGO stage 1's
//    0.3 mg/dL. Reference 2 (Seattle Children's HUS Risk – Bloody Diarrhea
//    v2.0, November 2024) prints the same "> 5% decrease in platelet count
//    since onset of symptoms" and "platelet < 150k" (checked 2026-11-08).
//  • Both +STEC timings stay as printed. Risk factor vii (presentation
//    within 7 days if GI PCR +STEC) needs a GI PCR result, which may not be
//    back in the ED. The discharge box's instruction for a result that turns
//    +STEC after discharge (direct admission) carries no 7-day limit.
//  • The nephrology note stays a callout on every step. The "^Consult
//    pediatric nephrology to discuss at any point if questions" box has no
//    matching "^" anywhere else on the page and no arrow. It sits just below
//    the admit box, so the "^" could instead point up at that box (a reading
//    Gemini raised); he chose every step.
//  • "Septic shock", correcting the PDF's typo. Footnote a ends "severe
//    sepsis and/or sepsit shock"; the app says "septic shock" in the
//    exclusion list and in footnote a. Keep "septic" even if a later edition
//    still prints "sepsit".
//
// Open questions:
//  • The admit box says "inpatient pediatric service vs PICU" but the PDF
//    gives no criteria for choosing PICU. Thiago is taking this to the CPG's
//    authors (2026-11-08).
//  • No maximum NS bolus volume and no maintenance-rate formula (see above).

export default {
  id: "bloody-diarrhea",
  title: "Bloody Diarrhea",
  fullTitle: "Bloody Diarrhea Management",
  category: "abdominal-gi",
  icon: "Droplets",
  keywords: [
    "bloody diarrhea",
    "bloody stool",
    "blood in stool",
    "hematochezia",
    "hus",
    "hemolytic uremic syndrome",
    "stec",
    "shiga toxin",
    "e. coli",
    "o157",
    "gi pcr",
    "hyperhydration",
  ],
  shortDescription: "HUS lab screen and STEC risk factors decide admission vs discharge for the child with bloody diarrhea.",
  sourcePdf: "bloody-diarrhea.pdf",
  version: "2026",
  lastEdited: "November 2026",
  authors: [
    "MB Bernardin",
    "G Malakasioti",
    "A Padhye",
    "D Lopez-Domowicz",
    "J Kesterson",
    "K Koehn",
    "L Hesemann",
    "P Oren",
  ],
  verified: false,
  disclaimer: "Transcribed from the official MU CPG. Always verify against the source PDF.",

  inclusion: ["Children < 18 years presenting with bloody diarrhea"],
  exclusion: [
    "Infants < 4 months of age",
    "Prior episode of HUS or atypical HUS",
    "Known or suspected malignancy",
    "Known inflammatory bowel disease",
    "Known renal disease",
    "Presentations including acute neurologic symptoms",
    "Concern for intussusception",
    "Hemodynamic instability or concern for hemorrhagic shock",
    "Severe sepsis and/or septic shock",
  ],

  callouts: {
    nephrologyConsult: {
      tone: "info",
      title: "Pediatric nephrology",
      body: "Consult pediatric nephrology to discuss at any point if questions.",
    },
    stecAfterDischarge: {
      tone: "warning",
      title: "If GI PCR becomes +STEC after discharge",
      body: "Contact family for direct admission to pediatric floor, or return to ED if inpatient bed is unavailable.",
    },
  },

  footnotes: {
    a: "Exclusion criteria: infants < 4 months of age, prior episode of HUS or atypical HUS, known or suspected malignancy, known inflammatory bowel disease, known renal disease, presentations including acute neurologic symptoms, concern for intussusception, hemodynamic instability or concern for hemorrhagic shock, severe sepsis and/or septic shock.",
    b: "If hematochezia is in question, obtain fecal hemoccult test.",
    c: "Consider giving a smaller weight-based IVF bolus or deferring IVF if concern for anemia requiring transfusion.",
    d: [
      "Any of the following lab findings concerning for HUS:",
      "Hemolytic anemia (Hgb < 10 g/dL and/or 3+ schistocytes)",
      "Thrombocytopenia (platelets < 150k)",
      "Acute kidney injury (elevated BUN/Cr for age, or increase in Cr by 50% or 0.2 mg/dL or more from previous baseline)",
      "> 5% decrease in platelet count since onset of symptoms",
      "Rising BUN/Cr since onset of symptoms",
      "Hematuria or proteinuria",
      "Elevated LDH",
      "Hypoalbuminemia < 3.5 g/dL",
    ],
    e: [
      "Any of the following HUS/STEC risk factors:",
      "History of contact with farm animals, consumption of unpasteurized dairy, contact with confirmed STEC case, antibiotic or antimotility agent use during illness, frequent NSAID use during illness",
      "Severe/frequent bloody diarrhea and/or diarrhea initially nonbloody and became bloody after 1–3 days",
      "Severe abdominal pain",
      "Inability to tolerate adequate oral fluids",
      "Evidence of dehydration including decreased urine output",
      "Family/social concerns regarding ability to recognize signs of deterioration and comply with strict outpatient follow-up, or inability to arrange PCP/UC/ED follow-up within 24 hrs for clinical assessment and repeat labs",
      "Presentation within 7 days from onset of symptoms if GI PCR results +STEC (either O157 or non-O157)",
    ],
    f: [
      "Discharge criteria:",
      "Clinically hydrated with normal vital signs",
      "Pain adequately controlled",
      "Tolerating adequate oral fluids",
      "Family is comfortable with discharge home",
      "Family understands, agrees to, and has adequate transportation to comply with discharge follow up instructions",
    ],
    g: [
      "Utilize Peds ED Bloody Diarrhea discharge instructions, which include ED Return Precautions:",
      "New bleeding, bruising or petechial rash",
      "Severe abdominal pain",
      "Unusual/severe headache",
      "Atypical irritability",
      "Inability to tolerate adequate oral fluids",
      "No urine output for 12 hours",
      "Edema",
    ],
  },

  references: [
    "Greater Glasgow and Clyde Paediatric Guideline: Management and investigation of bloody diarrhea and haemolytic uremic syndrome, 2019. https://www.clinicalguidelines.scot.nhs.uk/ggc-paediatric-guidelines/ggc-paediatric-guidelines/kidney-diseases/management-and-investigation-of-bloody-diarrhoea-and-haemolytic-uraemic-syndrome/",
    "Seattle Children’s Hospital Clinical Practice Guideline: HUS Risk – Bloody Diarrhea v2.0, 2024. https://www.seattlechildrens.org/globalassets/documents/healthcare-professionals/clinical-standard-work/hus-risk-bloody-diarrhea-org-pathway.pdf",
    "McKee RS et al. Clinical and Laboratory Predictors of Shiga Toxin-Producing Escherichia coli Infection in Children With Bloody Diarrhea. J Pediatric Infect Dis Soc. 2018 Aug 17;7(3):e116-e122.",
  ],

  startNodeId: "intro",
  nodes: {
    intro: {
      id: "intro",
      type: "start",
      title: "Bloody Diarrhea Management",
      body: "For children < 18 years presenting with bloody diarrhea. Review the exclusion criteria below, then begin.",
      calloutIds: ["nephrologyConsult"],
      next: "initialEvaluation",
    },

    initialEvaluation: {
      id: "initialEvaluation",
      type: "action",
      title: "Initial evaluation and NS bolus",
      items: [
        "Complete thorough physical exam including skin exam for pallor, petechiae or bruising and visual rectal exam to evaluate for anatomic sources of bleeding",
        "Place peripheral IV",
        "Obtain CBC with diff, CMP, LDH, urinalysis with microscopy, GI PCR",
        "Obtain Type and Screen if concern for anemia requiring blood transfusion",
        "Give 10–20 mL/kg NS bolus",
      ],
      calloutIds: ["nephrologyConsult"],
      footnoteRefs: ["b", "c"],
      next: "husLabs",
    },

    husLabs: {
      id: "husLabs",
      type: "decision",
      title: "Labs concerning for hemolytic uremic syndrome (HUS)?",
      calloutIds: ["nephrologyConsult"],
      footnoteRefs: ["d"],
      branches: [
        { label: "Yes", next: "admit", tone: "danger" },
        { label: "No", next: "riskFactors" },
      ],
    },

    riskFactors: {
      id: "riskFactors",
      type: "decision",
      title: "HUS/Shiga toxin-producing E. coli (STEC) risk factors?",
      calloutIds: ["nephrologyConsult"],
      footnoteRefs: ["e"],
      branches: [
        { label: "Yes", next: "admit", tone: "warning" },
        { label: "No", next: "dischargeCriteria" },
      ],
    },

    dischargeCriteria: {
      id: "dischargeCriteria",
      type: "decision",
      title: "Meeting discharge criteria?",
      calloutIds: ["nephrologyConsult"],
      footnoteRefs: ["f"],
      branches: [
        { label: "Yes", next: "discharge", tone: "success" },
        { label: "No", next: "admit", tone: "warning" },
      ],
    },

    admit: {
      id: "admit",
      type: "outcome",
      title: "Admit to inpatient pediatric service vs PICU",
      body: [
        "Reevaluate perfusion and repeat 10–20 mL/kg NS bolus if needed",
        "Initiate hyperhydration with D5NS at 1.5× maintenance rate",
      ],
      // Floor or PICU, so not "admit-floor". Only the tone is displayed.
      disposition: "admit",
      tone: "warning",
      calloutIds: ["nephrologyConsult"],
    },

    discharge: {
      id: "discharge",
      type: "outcome",
      title: "Discharge",
      body: [
        "Encourage oral fluid intake",
        "Instruct family to follow up with PCP or Urgent Care/ED within 24 hours for reevaluation and repeat labs (CBC with diff, BUN/Cr)",
        "Discuss ED return precautions",
      ],
      disposition: "discharge",
      tone: "success",
      calloutIds: ["stecAfterDischarge", "nephrologyConsult"],
      footnoteRefs: ["g"],
    },
  },
};
