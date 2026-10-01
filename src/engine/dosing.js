// Weight-based dosing engine — the clinical-safety core.
//
// Principles:
//  • Show the math. Every computed dose carries its formula and any cap applied,
//    so the clinician can see *why* a number came out (and catch a bad weight).
//  • Always apply max caps (and min floors where the PDF gives one).
//  • Never invent precision: values are rounded for display only, to 2 decimals.
//  • Faithful to the source: ranges stay ranges; display-only doses are shown
//    verbatim with no computation.

export const WEIGHT_MIN_KG = 0.5;
export const WEIGHT_MAX_KG = 150;

export function isValidWeight(kg) {
  return typeof kg === "number" && isFinite(kg) && kg >= WEIGHT_MIN_KG && kg <= WEIGHT_MAX_KG;
}

// Weight may be entered in pounds (parents usually report it that way), but every
// calculation runs in kg. 1 lb = 0.45359237 kg exactly (international pound).
export const KG_PER_LB = 0.45359237;

export function lbToKg(lb) {
  return lb * KG_PER_LB;
}

export function kgToLb(kg) {
  return kg / KG_PER_LB;
}

// Pounds dose at their conversion rounded to 0.01 kg, so the kg shown back to the
// clinician ("= 20 kg — used for dosing") is exactly the kg dosed, and a weight
// band can never show one number while dosing by another (44.1 lb is 20.0034 kg:
// unrounded it would read "20 kg" yet fall in a "> 20 kg" band).
function lbToDosingKg(lb) {
  return Math.round(lbToKg(lb) * 100) / 100;
}

// The accepted pound range, as shown to the clinician: the outermost 0.1-lb
// values whose dosing weight is valid.
function lbEdge(limitKg, inward) {
  const raw = kgToLb(limitKg) * 10;
  let lb = (inward > 0 ? Math.floor(raw) : Math.ceil(raw)) / 10;
  while (!isValidWeight(lbToDosingKg(lb))) lb = Math.round((lb + inward) * 10) / 10;
  return lb;
}
export const WEIGHT_MIN_LB = lbEdge(WEIGHT_MIN_KG, 0.1);
export const WEIGHT_MAX_LB = lbEdge(WEIGHT_MAX_KG, -0.1);

// The dosing weight for what was typed. Kilograms are used exactly as typed.
// Pounds use lbToDosingKg, but only inside the pound range shown above; outside
// it the entry is not an accepted weight (NaN — never a valid weight), so the
// range shown and the range accepted are identical even for entries finer than
// 0.1 lb (1.095 lb would otherwise round up to a valid 0.50 kg, below the
// stated 1.1 lb minimum).
export function entryToKg(text, unit) {
  if (text == null || String(text).trim() === "") return null;
  const n = Number(text);
  if (!Number.isFinite(n)) return null;
  if (unit !== "lb") return n;
  return n >= WEIGHT_MIN_LB && n <= WEIGHT_MAX_LB ? lbToDosingKg(n) : NaN;
}

export function fmt(n) {
  if (n == null || !isFinite(n)) return "";
  // Trim to at most 2 decimals without trailing zeros.
  return parseFloat(n.toFixed(2)).toString();
}

// The weight inside a dose formula is printed exactly as used — the very number
// the dose was computed from — never rounded, so the formula always reproduces
// the dose and agrees with any weight band (fmt would print 9.999 kg as "10 kg").
function exactKg(kg) {
  return String(kg);
}

// Resolve the active dose spec for a drug given the patient context, honoring
// conditional `rules` (first match wins).
function resolveSpec(drug, ctx) {
  if (Array.isArray(drug.rules)) {
    // Rules select their dose by patient context, and a weight-tiered rule
    // resolving to a flat dose bypasses computeFromDose's isValidWeight
    // check — so an absent or out-of-range weight must prompt for weight
    // here, never pick a tier and print a confident dose.
    if (!isValidWeight(ctx.weightKg)) return { matched: true, needsWeight: true };
    const rule = drug.rules.find((r) => {
      try {
        return r.when(ctx);
      } catch {
        return false;
      }
    });
    if (!rule) return { matched: false };
    return {
      matched: true,
      label: rule.label,
      dose: rule.dose,
      displayDose: rule.displayDose,
    };
  }
  return { matched: true, dose: drug.dose, displayDose: drug.displayDose };
}

function computeFromDose(dose, ctx) {
  const weight = ctx.weightKg;
  const unit = dose.mcgPerKg != null || dose.maxMcg != null || dose.flatMcg != null ? "mcg" : "mg";
  const perKg = unit === "mcg" ? dose.mcgPerKg : dose.mgPerKg;
  const flat = unit === "mcg" ? dose.flatMcg : dose.flatMg;
  const maxV = unit === "mcg" ? dose.maxMcg : dose.maxMg;
  const minV = unit === "mcg" ? dose.minMcg : dose.minMg;

  // Flat (weight-independent) dose.
  if (perKg == null && flat != null) {
    return {
      unit,
      text: `${fmt(flat)} ${unit}`,
      formula: `Fixed ${fmt(flat)} ${unit}`,
      capped: false,
    };
  }

  if (perKg == null) {
    // Nothing computable and no flat dose — let caller show displayDose instead.
    return null;
  }

  if (!isValidWeight(weight)) return { needsWeight: true };

  const ends = Array.isArray(perKg) ? perKg : [perKg];
  let capped = false;
  let floored = false;
  const capRefs = [];

  const applied = ends.map((rate) => {
    let v = weight * rate;
    if (maxV != null && v > maxV) {
      v = maxV;
      capped = true;
    }
    if (minV != null && v < minV) {
      v = minV;
      floored = true;
    }
    return v;
  });

  const rateText = Array.isArray(perKg)
    ? `${fmt(perKg[0])}–${fmt(perKg[1])} ${unit}/kg`
    : `${fmt(perKg)} ${unit}/kg`;

  const valueText =
    applied.length === 2
      ? `${fmt(applied[0])}–${fmt(applied[1])} ${unit}`
      : `${fmt(applied[0])} ${unit}`;

  if (maxV != null) capRefs.push(`max ${fmt(maxV)} ${unit}`);
  if (minV != null) capRefs.push(`min ${fmt(minV)} ${unit}`);

  let volume = null;
  if (dose.concentrationMgPerMl && unit === "mg") {
    const vols = applied.map((v) => v / dose.concentrationMgPerMl);
    volume =
      vols.length === 2
        ? `${fmt(vols[0])}–${fmt(vols[1])} mL`
        : `${fmt(vols[0])} mL`;
    volume += ` (at ${fmt(dose.concentrationMgPerMl)} mg/mL)`;
  }

  return {
    unit,
    text: valueText,
    formula: `${rateText} × ${exactKg(weight)} kg${capRefs.length ? ` (${capRefs.join(", ")})` : ""}`,
    capped,
    floored,
    volume,
    frequency: dose.frequency,
  };
}

/**
 * Compute a single drug for the given patient context.
 * @returns a render-ready result describing the dose, math, and any flags.
 */
export function computeDrug(drug, ctx = {}) {
  const base = {
    name: drug.name,
    route: drug.route,
    formulation: drug.formulation,
    note: drug.note,
    contraindications: drug.contraindications,
  };

  const spec = resolveSpec(drug, ctx);
  if (spec.needsWeight) {
    return { ...base, needsWeight: true };
  }
  if (!spec.matched) {
    return { ...base, unmatched: true };
  }

  if (spec.displayDose) {
    return { ...base, displayOnly: true, ruleLabel: spec.label, text: spec.displayDose };
  }

  if (!spec.dose) {
    return { ...base, displayOnly: true, ruleLabel: spec.label, text: "See guideline" };
  }

  const computed = computeFromDose(spec.dose, ctx);
  if (!computed) {
    return { ...base, displayOnly: true, ruleLabel: spec.label, text: "See guideline" };
  }
  if (computed.needsWeight) {
    return { ...base, needsWeight: true, ruleLabel: spec.label };
  }

  return { ...base, ruleLabel: spec.label, computed };
}

export function computeCalculator(calc, ctx = {}) {
  return (calc.drugs || []).map((d) => computeDrug(d, ctx));
}

// Which extra inputs a dosing calculator needs collected (beyond nothing).
export function requiredInputs(calc) {
  const set = new Set(["weightKg"]);
  for (const i of calc.inputs || []) set.add(i);
  // If any drug is purely flat/display, weight may be optional, but collecting
  // it is harmless and keeps the UI consistent.
  return [...set];
}
