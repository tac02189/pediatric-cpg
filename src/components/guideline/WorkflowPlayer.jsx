import { useEffect, useRef } from "react";
import { useWorkflow } from "./workflowContext.js";
import NodeRenderer from "./NodeRenderer.jsx";
import Breadcrumb from "./Breadcrumb.jsx";
import BackBar from "./BackBar.jsx";
import ReferencesAccordion from "./ReferencesAccordion.jsx";

// Renders the current step of the workflow. The state machine itself lives in
// GuidelineSession, which provides it (plus action helpers) via context.
// Generic — never references a specific guideline.
export default function WorkflowPlayer() {
  const { guideline, state } = useWorkflow();

  // Moving forward to a new step (or restarting) jumps back to the top, so each
  // step starts at its beginning instead of wherever the previous step's button
  // was. Going back preserves scroll position.
  const prevSteps = useRef(state.history.length);
  useEffect(() => {
    const steps = state.history.length;
    const movedForward = steps > prevSteps.current;
    const restarted = steps === 0 && prevSteps.current > 0;
    prevSteps.current = steps;
    if (movedForward || restarted) window.scrollTo(0, 0);
  }, [state.currentNodeId, state.history.length]);

  const node = guideline.nodes[state.currentNodeId];

  return (
    <>
      <Breadcrumb />
      <div
        className="mx-auto max-w-3xl px-4 pt-4"
        style={{ paddingBottom: "calc(var(--app-backbar-h, 5.5rem) + 0.75rem)" }}
      >
        <NodeRenderer node={node} guideline={guideline} />
        <ReferencesAccordion guideline={guideline} />
      </div>
      <BackBar />
    </>
  );
}
