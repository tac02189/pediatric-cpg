import { Icon } from "../../lib/icons.jsx";

// Renders a list of criteria in one of three modes:
//   include  — static green checks (inclusion criteria)
//   exclude  — static red marks (exclusion criteria)
//   check    — interactive toggles (checklist nodes; tracking only, not gating)
export default function CriteriaList({ items = [], variant = "include", checked = {}, onToggle }) {
  const norm = items.map((it) => (typeof it === "string" ? { text: it } : it));

  if (variant === "check") {
    return (
      <ul className="space-y-2">
        {norm.map((it, i) => {
          const on = !!checked[i];
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => onToggle?.(i)}
                className={`focus-ring tap-target flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                  on
                    ? "border-primary-300 bg-primary-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                    on ? "border-primary-600 bg-primary-600 text-white" : "border-slate-300 bg-white"
                  }`}
                >
                  {on && <Icon name="CheckCheck" size={13} strokeWidth={3} />}
                </span>
                <span className={`text-sm ${on ? "text-slate-900" : "text-slate-700"}`}>
                  {it.text}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  const isInclude = variant === "include";
  return (
    <ul className="space-y-1.5">
      {norm.map((it, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
          <Icon
            name={isInclude ? "CircleCheck" : "OctagonAlert"}
            size={16}
            className={`mt-0.5 shrink-0 ${isInclude ? "text-emerald-600" : "text-rose-500"}`}
          />
          <span>{it.text}</span>
        </li>
      ))}
    </ul>
  );
}
