// Scoring engines. Two flavors:
//   additive  — sum item point-values, map the total to an interpretation band
//               (Westley, PAS).
//   rule      — a guideline-supplied compute() returns a routing group from
//               boolean/numeric inputs (Refined Low Risk Appendicitis).
//
// Bands are matched first-wins on an inclusive [min, max] range; omit a bound
// to leave it open.

export function additiveTotal(calc, selections = {}) {
  return (calc.items || []).reduce((sum, item) => {
    const v = selections[item.id];
    return sum + (typeof v === "number" ? v : 0);
  }, 0);
}

// Additive answers are stored as the index of the chosen option, not its points:
// several options can carry the same points (PRAS respiratory rate has four age
// bands that each score 0–3), and only the index records which one was chosen.
// This turns those choices into the per-item points the functions here sum.
export function selectionsFromChoices(calc, choices = {}) {
  const selections = {};
  for (const item of calc.items || []) {
    const i = choices[item.id];
    const opt = Number.isInteger(i) ? item.options?.[i] : undefined;
    if (opt && typeof opt.value === "number") selections[item.id] = opt.value;
  }
  return selections;
}

export function allItemsAnswered(calc, selections = {}) {
  return (calc.items || []).every((item) => typeof selections[item.id] === "number");
}

export function bandForTotal(calc, total) {
  const bands = calc.bands || [];
  return (
    bands.find((b) => {
      const okMin = b.min == null || total >= b.min;
      const okMax = b.max == null || total <= b.max;
      return okMin && okMax;
    }) || null
  );
}

// Resolve which routing group a band belongs to (for score nodes that branch by
// group rather than by individual band). Falls back to the band id itself.
export function groupForBand(calc, band) {
  if (!band) return null;
  const groups = calc.routingGroups;
  if (!groups) return band.id;
  for (const [groupId, bandIds] of Object.entries(groups)) {
    if (bandIds.includes(band.id)) return groupId;
  }
  return band.id;
}

/**
 * Unified evaluation used by the score node + standalone calculator.
 * @returns {{engine:string, complete:boolean, total?:number, band?:object,
 *            groupId?:string|null, label?:string, detail?:string}}
 */
export function evaluateScore(calc, state = {}) {
  if (calc.engine === "rule") {
    const result = calc.compute ? calc.compute(state.inputs || {}) : null;
    return {
      engine: "rule",
      complete: !!(result && result.complete !== false),
      groupId: result ? result.groupId : null,
      label: result ? result.label : null,
      detail: result ? result.detail : null,
    };
  }
  // `choices` (option index per item) is what the UI stores; `selections`
  // (points per item) is accepted directly too.
  const selections = state.choices
    ? selectionsFromChoices(calc, state.choices)
    : state.selections || {};
  const total = additiveTotal(calc, selections);
  const band = bandForTotal(calc, total);
  return {
    engine: "additive",
    complete: allItemsAnswered(calc, selections),
    total,
    band,
    groupId: groupForBand(calc, band),
    label: band ? band.label : null,
    detail: band ? band.interpretation : null,
  };
}
