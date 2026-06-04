// ---------------------------------------------------------------------------
// Authoring contract for guideline data files.
//
// These JSDoc typedefs document the shape every guideline in src/data/guidelines/
// must follow. They are reference-only (no runtime export); the build-time guard
// in src/data/validateGuideline.js enforces the critical invariants.
//
// Data files are plain .js modules, so calculator `rules`/`compute` may be real
// JS functions — we never eval strings.
// ---------------------------------------------------------------------------

/**
 * @typedef {"start"|"info"|"action"|"decision"|"branch"|"score"|"dosing"|"checklist"|"lookup"|"reference"|"outcome"} NodeType
 * @typedef {"success"|"info"|"warning"|"danger"|"neutral"} Tone
 */

/**
 * @typedef {Object} Branch
 * @property {string} label            Button text shown to the clinician.
 * @property {string|null} next        Target node id (null = dead-end label).
 * @property {Tone} [tone]             Visual emphasis for the branch/target.
 * @property {string} [bandId]         (score nodes) interpretation band this branch matches.
 * @property {string} [group]          (score nodes) routing group this branch matches.
 */

/**
 * @typedef {Object} Node
 * @property {string} id
 * @property {NodeType} type
 * @property {string} title
 * @property {string|string[]} [body]
 * @property {string[]} [items]        (action / checklist) bullet or step list.
 * @property {Branch[]} [branches]     (decision / branch / score)
 * @property {string} [next]           (linear nodes) single successor id.
 * @property {string} [calculatorId]   (score / dosing) calculator key on the guideline.
 * @property {boolean} [autoAdvance]   (score) advance automatically once a band resolves.
 * @property {Object} [table]          (lookup) { columns: string[], rows: string[][] }.
 * @property {Array<{kind:"phone"|"powerplan"|"url",label:string,value:string}>} [actions] (reference)
 * @property {string} [disposition]    (outcome) e.g. "discharge" | "admit-floor" | "admit-picu" | "consult".
 * @property {Tone} [tone]
 * @property {string[]} [calloutIds]   Side-notes (keys into guideline.callouts) pinned to this node.
 * @property {string[]} [footnoteRefs] Footnote markers (keys into guideline.footnotes) cited here.
 */

/**
 * @typedef {Object} ScoreItemOption
 * @property {string} label
 * @property {number} value
 */

/**
 * @typedef {Object} ScoreBand
 * @property {string} id
 * @property {string} label
 * @property {number} [min]            Inclusive lower bound (omit = open).
 * @property {number} [max]            Inclusive upper bound (omit = open).
 * @property {Tone} tone
 * @property {string} [interpretation]
 */

/**
 * @typedef {Object} ScoreCalculator
 * @property {"score"} kind
 * @property {"additive"|"rule"} engine
 * @property {string} id
 * @property {string} name
 * @property {string} [reference]
 * @property {Array<{id:string,label:string,options:ScoreItemOption[]}>} [items]  (additive)
 * @property {ScoreBand[]} [bands]                                                 (additive)
 * @property {Object.<string,string[]>} [routingGroups]  group id -> band ids it covers.
 * @property {Array<{id:string,label:string,type?:"bool"|"number",help?:string}>} [criteria] (rule)
 * @property {(inputs:Object)=>{groupId:string,label:string,detail?:string}} [compute]        (rule)
 */

/**
 * @typedef {Object} DrugDose
 * @property {number|number[]} [mgPerKg]   Single value or [lo, hi] range.
 * @property {number|number[]} [mcgPerKg]
 * @property {number} [flatMg]             Weight-independent fixed dose.
 * @property {number} [maxMg] @property {number} [minMg]
 * @property {number} [maxMcg] @property {number} [minMcg]
 * @property {number} [concentrationMgPerMl]  Enables volume (mL) calculation.
 * @property {string} [frequency]
 */

/**
 * @typedef {Object} Drug
 * @property {string} name
 * @property {string} [route]
 * @property {string} [formulation]
 * @property {string} [note]
 * @property {string[]} [contraindications]
 * @property {DrugDose} [dose]
 * @property {string} [displayDose]   Use instead of `dose` for display-only (no computation).
 * @property {Array<{when:(ctx:Object)=>boolean,label?:string,dose?:DrugDose,displayDose?:string}>} [rules]
 */

/**
 * @typedef {Object} DosingCalculator
 * @property {"dosing"} kind
 * @property {string} id
 * @property {string} [name]
 * @property {Array<"weightKg"|"sex"|"ageMonths">} [inputs]  Extra inputs beyond weight.
 * @property {Drug[]} drugs
 */

/**
 * @typedef {ScoreCalculator|DosingCalculator} Calculator
 */

/**
 * @typedef {Object} Guideline
 * @property {string} id                Stable URL slug; also the source PDF base name.
 * @property {string} title
 * @property {string} [fullTitle]
 * @property {string} category          Category id (see data/categories.js).
 * @property {string[]} keywords        Synonyms powering search.
 * @property {string} shortDescription
 * @property {string} icon              lucide-react icon name.
 * @property {string} sourcePdf         File under public/pdfs/.
 * @property {string} version
 * @property {string} lastEdited
 * @property {string[]} [authors]
 * @property {boolean} verified         Physician spot-check gate; false => DRAFT ribbon.
 * @property {string} [disclaimer]
 * @property {string[]} [inclusion]
 * @property {string[]} [exclusion]
 * @property {Object.<string,Calculator>} [calculators]
 * @property {Object.<string,{tone:Tone,title:string,body:string|string[]}>} [callouts]
 * @property {Object.<string,(string|string[])>} [footnotes]
 * @property {string[]} [references]
 * @property {string} startNodeId
 * @property {Object.<string,Node>} nodes
 */

export {}; // documentation module
