import { useEffect, useId, useRef, useState } from "react";
import { useWorkflow } from "./workflowContext.js";
import { hasPatientDetails, describePatient } from "../../engine/workflowReducer.js";
import { Icon } from "../../lib/icons.jsx";
import { focusStepHeadingSoon } from "./stepFocus.js";

// Slim fixed bar for secondary navigation (Back / Start over). Publishes its
// real height as --app-backbar-h so the workflow content can reserve exactly
// enough bottom space to clear it — including the iOS home-indicator safe area,
// which makes the bar taller on iPhone, and the taller restart choice below.
export default function BackBar() {
  const { state, dispatch, restart, newPatient } = useWorkflow();
  const canBack = state.history.length > 0;
  const hasPatient = hasPatientDetails(state);
  // Restarting is offered whenever there is something to reset — including at
  // step 1 after a same-patient restart, so "New patient" is always reachable.
  const canRestart = canBack || hasPatient;
  const [choosing, setChoosing] = useState(false);
  const ref = useRef(null);
  const restartRef = useRef(null);
  const firstChoiceRef = useRef(null);
  const refocusRestart = useRef(false);
  const labelId = useId();

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

  useEffect(() => {
    if (choosing) {
      firstChoiceRef.current?.focus();
    } else if (refocusRestart.current) {
      refocusRestart.current = false;
      restartRef.current?.focus();
    }
  }, [choosing]);

  // With patient details on file, ask — never carry a patient into the next run
  // without the user seeing it. With none, there is nothing to carry over.
  const onRestart = () => {
    if (hasPatient) {
      setChoosing(true);
    } else {
      restart();
      // Restart disables itself at step 1; don't leave focus on a disabled button.
      focusStepHeadingSoon();
    }
  };
  const cancel = () => {
    refocusRestart.current = true;
    setChoosing(false);
  };
  // The chosen button disappears with the choice row; land focus on the new
  // starting step's heading rather than letting it fall back to <body>.
  const choose = (action) => {
    setChoosing(false);
    action();
    focusStepHeadingSoon();
  };

  return (
    <div
      ref={ref}
      className="sticky-bottom-bar fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 pt-2.5 backdrop-blur"
    >
      {choosing ? (
        <div
          role="group"
          aria-labelledby={labelId}
          onKeyDown={(e) => {
            if (e.key === "Escape") cancel();
          }}
          className="mx-auto max-w-3xl px-4"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <p id={labelId} className="text-sm font-semibold text-slate-800">
              Start over for…
            </p>
            <button
              type="button"
              onClick={cancel}
              aria-label="Cancel"
              className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <Icon name="X" size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              ref={firstChoiceRef}
              type="button"
              onClick={() => choose(newPatient)}
              className="focus-ring tap-target flex flex-col items-center justify-center rounded-lg bg-primary-700 px-2 py-2 text-center text-sm font-semibold text-white hover:bg-primary-800"
            >
              <span className="inline-flex items-center gap-1.5">
                <Icon name="UserPlus" size={16} />
                New patient
              </span>
              <span className="text-[11px] font-medium leading-tight text-white/80">
                Clears weight and details
              </span>
            </button>
            <button
              type="button"
              onClick={() => choose(restart)}
              className="focus-ring tap-target flex flex-col items-center justify-center rounded-lg border border-slate-300 bg-white px-2 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <span className="inline-flex items-center gap-1.5">
                <Icon name="RotateCcw" size={15} />
                Same patient
              </span>
              <span className="text-[11px] font-medium leading-tight text-slate-500">
                Keeps {describePatient(state)}
              </span>
            </button>
          </div>
        </div>
      ) : (
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
            ref={restartRef}
            type="button"
            onClick={onRestart}
            disabled={!canRestart}
            className="focus-ring tap-target inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 disabled:opacity-30"
          >
            <Icon name="RotateCcw" size={16} />
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
