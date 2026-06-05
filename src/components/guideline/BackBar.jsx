import { useEffect, useRef } from "react";
import { useWorkflow } from "./workflowContext.js";
import { Icon } from "../../lib/icons.jsx";

// Slim fixed bar for secondary navigation (Back / Start over). Publishes its
// real height as --app-backbar-h so the workflow content can reserve exactly
// enough bottom space to clear it — including the iOS home-indicator safe area,
// which makes the bar taller on iPhone.
export default function BackBar() {
  const { state, dispatch, restart } = useWorkflow();
  const canBack = state.history.length > 0;
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setVar = () =>
      document.documentElement.style.setProperty("--app-backbar-h", `${el.offsetHeight}px`);
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    window.addEventListener("resize", setVar);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="sticky-bottom-bar fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 pt-2.5 backdrop-blur"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4">
        <button
          type="button"
          onClick={() => dispatch({ type: "BACK" })}
          disabled={!canBack}
          className="focus-ring tap-target inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-30"
        >
          <Icon name="ArrowLeft" size={17} />
          Back
        </button>

        <span className="text-xs font-medium tabular-nums text-slate-400">
          Step {state.history.length + 1}
        </span>

        <button
          type="button"
          onClick={restart}
          disabled={!canBack}
          className="focus-ring tap-target inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 disabled:opacity-30"
        >
          <Icon name="RotateCcw" size={16} />
          Restart
        </button>
      </div>
    </div>
  );
}
