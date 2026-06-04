import {
  StartNode,
  InfoNode,
  ActionNode,
  DecisionNode,
  BranchNode,
  ScoreNode,
  DosingNode,
  ChecklistNode,
  LookupNode,
  ReferenceNode,
  OutcomeNode,
} from "../nodes/NodeComponents.jsx";

// The single switch that makes the whole app data-driven: node.type -> component.
const MAP = {
  start: StartNode,
  info: InfoNode,
  action: ActionNode,
  decision: DecisionNode,
  branch: BranchNode,
  score: ScoreNode,
  dosing: DosingNode,
  checklist: ChecklistNode,
  lookup: LookupNode,
  reference: ReferenceNode,
  outcome: OutcomeNode,
};

export default function NodeRenderer({ node, guideline }) {
  if (!node) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        This step could not be found. Try starting over.
      </div>
    );
  }
  const Cmp = MAP[node.type] || InfoNode;
  return <Cmp node={node} guideline={guideline} />;
}
