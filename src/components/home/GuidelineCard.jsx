import { Link } from "react-router-dom";
import { Icon } from "../../lib/icons.jsx";
import { getCategory, accentClasses } from "../../data/categories.js";

export default function GuidelineCard({ guideline, showCategory = false }) {
  const cat = getCategory(guideline.category);
  const accent = cat?.accent || "sky";
  const a = accentClasses(accent);

  return (
    <Link
      to={`/guideline/${guideline.id}`}
      className={`group relative flex items-center gap-3.5 rounded-xl2 border bg-white p-3.5 shadow-card transition hover:shadow-card-hover ${a.border} ${a.borderHover} focus-ring`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${a.bgChip} ${a.text}`}
      >
        <Icon name={guideline.icon} size={22} strokeWidth={2.1} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-display text-[15px] font-bold text-slate-900">
            {guideline.title}
          </span>
          {!guideline.verified && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
              Draft
            </span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-[13px] text-slate-500">
          {guideline.shortDescription}
        </span>
        {showCategory && cat && (
          <span className={`mt-1 inline-block text-[11px] font-semibold ${a.text}`}>
            {cat.label}
          </span>
        )}
      </span>

      <Icon
        name="ChevronRight"
        size={18}
        className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
      />
    </Link>
  );
}
