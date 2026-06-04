// Referential-integrity checks for a guideline data object. Run in dev (a banner
// surfaces problems) and conceptually mirrors what `scripts/check-pdfs.mjs` does
// for the PDFs. Errors are dangerous (dangling pointer, missing cap); warnings
// are hygiene (orphan node, missing footnote).

import { CATEGORIES } from "./categories.js";

const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id));

const NODE_REQUIRED = ["id", "type", "title"];

export function validateGuideline(g) {
  const errors = [];
  const warnings = [];
  const E = (m) => errors.push(m);
  const W = (m) => warnings.push(m);

  // ---- top-level metadata ----
  for (const f of ["id", "title", "category", "sourcePdf", "version", "startNodeId", "nodes"]) {
    if (g[f] == null) E(`missing required field "${f}"`);
  }
  if (g.category && !CATEGORY_IDS.has(g.category)) E(`unknown category "${g.category}"`);

  const nodes = g.nodes || {};
  const nodeIds = new Set(Object.keys(nodes));
  const calcs = g.calculators || {};
  const callouts = g.callouts || {};
  const footnotes = g.footnotes || {};

  if (g.startNodeId && !nodeIds.has(g.startNodeId)) {
    E(`startNodeId "${g.startNodeId}" is not a node`);
  }

  // ---- per-node integrity ----
  const targets = []; // collect for reachability
  for (const [id, node] of Object.entries(nodes)) {
    for (const f of NODE_REQUIRED) {
      if (node[f] == null) E(`node "${id}" missing "${f}"`);
    }
    if (node.id && node.id !== id) E(`node "${id}" has mismatched inner id "${node.id}"`);

    const link = (to, ctx) => {
      if (to == null) return;
      if (!nodeIds.has(to)) E(`node "${id}" ${ctx} points to missing node "${to}"`);
      else targets.push(to);
    };

    if (typeof node.next === "string") link(node.next, "next");
    for (const b of node.branches || []) link(b.next, `branch "${b.label}"`);

    if ((node.type === "score" || node.type === "dosing") && !node.calculatorId) {
      E(`node "${id}" is type ${node.type} but has no calculatorId`);
    }
    if (node.calculatorId && !calcs[node.calculatorId]) {
      E(`node "${id}" references missing calculator "${node.calculatorId}"`);
    }
    for (const cid of node.calloutIds || []) {
      if (!callouts[cid]) W(`node "${id}" references missing callout "${cid}"`);
    }
    for (const fr of node.footnoteRefs || []) {
      if (!footnotes[fr]) W(`node "${id}" references missing footnote "${fr}"`);
    }

    // score nodes should branch by something resolvable
    if (node.type === "score") {
      for (const b of node.branches || []) {
        if (b.group == null && b.bandId == null) {
          W(`score node "${id}" branch "${b.label}" has neither group nor bandId`);
        }
      }
    }
  }

  // ---- calculator sanity ----
  for (const [cid, calc] of Object.entries(calcs)) {
    if (calc.kind === "score" && calc.engine !== "rule") {
      if (!Array.isArray(calc.items) || calc.items.length === 0) {
        E(`score calculator "${cid}" has no items`);
      }
      if (!Array.isArray(calc.bands) || calc.bands.length === 0) {
        E(`score calculator "${cid}" has no interpretation bands`);
      }
    }
    if (calc.kind === "score" && calc.engine === "rule" && typeof calc.compute !== "function") {
      E(`rule score calculator "${cid}" has no compute() function`);
    }
    if (calc.kind === "dosing") {
      for (const d of calc.drugs || []) {
        const weightBased =
          d.dose && (d.dose.mgPerKg != null || d.dose.mcgPerKg != null);
        const hasCap = d.dose && (d.dose.maxMg != null || d.dose.maxMcg != null);
        if (weightBased && !hasCap) {
          W(`drug "${d.name}" in "${cid}" is weight-based but has no max cap`);
        }
      }
    }
  }

  // ---- reachability ----
  if (g.startNodeId && nodeIds.has(g.startNodeId)) {
    const seen = new Set([g.startNodeId]);
    const queue = [g.startNodeId];
    while (queue.length) {
      const cur = nodes[queue.shift()];
      const outs = [];
      if (typeof cur.next === "string") outs.push(cur.next);
      for (const b of cur.branches || []) if (b.next) outs.push(b.next);
      for (const t of outs) if (nodeIds.has(t) && !seen.has(t)) (seen.add(t), queue.push(t));
    }
    for (const id of nodeIds) {
      if (!seen.has(id)) W(`node "${id}" is unreachable from start`);
    }
  }

  return { errors, warnings, ok: errors.length === 0 };
}

export function validateAll(guidelines) {
  const report = {};
  for (const g of guidelines) report[g.id] = validateGuideline(g);
  return report;
}
