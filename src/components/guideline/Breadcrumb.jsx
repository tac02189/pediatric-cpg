import { useWorkflow } from "./workflowContext.js";
import { Icon } from "../../lib/icons.jsx";

// The path actually taken, as tappable chips. Tapping a past step rewinds to it.
export default function Breadcrumb() {
  const { guideline, state, dispatch } = useWorkflow();
  const { history, currentNodeId } = state;
  if (history.length === 0) return null;

  const titleOf = (id) => guideline.nodes[id]?.title || id;
  const current = titleOf(currentNodeId);

  return (
    <nav
      aria-label="Steps taken"
      className="sticky top-[57px] z-20 border-b border-slate-200 bg-slate-50/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-1 overflow-x-auto px-3 py-2 text-xs">
        <button
          type="button"
          onClick={() => dispatch({ type: "GOTO_CRUMB", index: 0 })}
          className="focus-ring flex shrink-0 items-center rounded p-1 text-slate-400 hover:text-primary-600"
          aria-label="Back to start"
        >
          <Icon name="Home" size={14} />
        </button>
        {history.map((h, i) => (
          <div key={i} className="flex shrink-0 items-center gap-1">
            <Icon name="ChevronRight" size={13} className="text-slate-300" />
            <button
              type="button"
              onClick={() => dispatch({ type: "GOTO_CRUMB", index: i })}
              className="focus-ring max-w-[120px] truncate rounded px-1 py-0.5 font-medium text-slate-500 hover:text-primary-600"
              title={titleOf(h.nodeId)}
            >
              {titleOf(h.nodeId)}
            </button>
          </div>
        ))}
        <Icon name="ChevronRight" size={13} className="shrink-0 text-slate-300" />
        <span className="max-w-[140px] shrink-0 truncate rounded px-1 py-0.5 font-bold text-slate-800" title={current}>
          {current}
        </span>
      </div>
    </nav>
  );
}
