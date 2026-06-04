import { useParams, Navigate } from "react-router-dom";
import { getGuideline } from "../../data/index.js";
import GuidelineHeader from "./GuidelineHeader.jsx";
import DisclaimerBanner from "./DisclaimerBanner.jsx";
import WorkflowPlayer from "./WorkflowPlayer.jsx";

export default function GuidelinePage() {
  const { id } = useParams();
  const guideline = getGuideline(id);
  if (!guideline) return <Navigate to="/" replace />;

  return (
    <div>
      <GuidelineHeader guideline={guideline} />
      <DisclaimerBanner guideline={guideline} />
      {/* key resets the workflow state machine when switching guidelines */}
      <WorkflowPlayer key={guideline.id} guideline={guideline} />
    </div>
  );
}
