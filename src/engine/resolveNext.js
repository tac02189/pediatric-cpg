// Pure helpers for walking the node graph. The reducer stays dumb (it just sets
// the current node to a target the UI supplies); these compute the target.

// The matching branch for a resolved score (by routing group first, then band).
export function branchForScore(node, evaluation) {
  if (!node.branches || !evaluation) return null;
  return (
    node.branches.find(
      (b) =>
        (b.group != null && b.group === evaluation.groupId) ||
        (b.bandId != null && b.bandId === evaluation.band?.id) ||
        (b.bandId != null && b.bandId === evaluation.groupId)
    ) || null
  );
}

// Does a node hand off to a single linear successor?
export function linearNext(node) {
  return node && typeof node.next === "string" ? node.next : null;
}

// A node is terminal if it offers no way forward.
export function isTerminal(node) {
  if (!node) return true;
  if (node.type === "outcome" && !node.next) return true;
  const hasBranches = Array.isArray(node.branches) && node.branches.length > 0;
  return !hasBranches && !linearNext(node);
}
