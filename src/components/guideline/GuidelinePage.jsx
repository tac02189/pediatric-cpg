import { useWorkflow } from "./workflowContext.js";
import GuidelineHeader from "./GuidelineHeader.jsx";
import DisclaimerBanner from "./DisclaimerBanner.jsx";
import WorkflowPlayer from "./WorkflowPlayer.jsx";

// The pathway view. Its state lives in GuidelineSession (the parent route), so it
// survives a trip to this guideline's Calculators page and back.
export default function GuidelinePage() {
  const { guideline } = useWorkflow();

  return (
    <div>
      <GuidelineHeader guideline={guideline} />
      <DisclaimerBanner guideline={guideline} />
      <WorkflowPlayer />
    </div>
  );
}
