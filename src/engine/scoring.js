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
  const selections = state.selections || {};
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
