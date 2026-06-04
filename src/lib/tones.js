// Semantic tone -> Tailwind classes. Class strings are complete literals so the
// Tailwind content scan keeps them (no dynamic concatenation here).

export const TONES = {
  success: {
    card: "bg-emerald-50 border-emerald-200 text-emerald-900",
    chip: "bg-emerald-100 text-emerald-800",
    solid: "bg-emerald-600 hover:bg-emerald-700 text-white",
    accentText: "text-emerald-700",
    icon: "CircleCheck",
  },
  info: {
    card: "bg-sky-50 border-sky-200 text-sky-900",
    chip: "bg-sky-100 text-sky-800",
    solid: "bg-sky-600 hover:bg-sky-700 text-white",
    accentText: "text-sky-700",
    icon: "Info",
  },
  warning: {
    card: "bg-amber-50 border-amber-200 text-amber-900",
    chip: "bg-amber-100 text-amber-800",
    solid: "bg-amber-500 hover:bg-amber-600 text-white",
    accentText: "text-amber-700",
    icon: "TriangleAlert",
  },
  danger: {
    card: "bg-rose-50 border-rose-200 text-rose-900",
    chip: "bg-rose-100 text-rose-800",
    solid: "bg-rose-600 hover:bg-rose-700 text-white",
    accentText: "text-rose-700",
    icon: "OctagonAlert",
  },
  neutral: {
    card: "bg-slate-50 border-slate-200 text-slate-800",
    chip: "bg-slate-100 text-slate-700",
    solid: "bg-primary-600 hover:bg-primary-700 text-white",
    accentText: "text-primary-700",
    icon: "Circle",
  },
};

export function tone(t) {
  return TONES[t] || TONES.neutral;
}

// Map an outcome disposition to a tone when the data didn't specify one.
export function dispositionTone(disposition) {
  if (!disposition) return "neutral";
  if (disposition.startsWith("discharge")) return "success";
  if (disposition.includes("picu") || disposition.includes("or") || disposition === "code")
    return "danger";
  if (disposition.startsWith("admit") || disposition.includes("consult")) return "warning";
  return "neutral";
}
