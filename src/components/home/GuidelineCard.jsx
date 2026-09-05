import { Link } from "react-router-dom";
import { Icon } from "../../lib/icons.jsx";
import { getCategory, accentClasses } from "../../data/categories.js";

// One guideline as a full-width row. Rows are meant to sit inside a
// <GuidelineList> group (hairline dividers, one border around the group) —
// decoration lives on the group, not on each row.
export default function GuidelineCard({ guideline, showCategory = false }) {
  const cat = getCategory(guideline.category);
  const a = accentClasses(cat?.accent || "sky");

  return (
    <Link
      to={`/guideline/${guideline.id}`}
      className="focus-ring-inset group flex min-h-[68px] items-center gap-3 bg-white px-3.5 py-3 transition hover:bg-slate-50"
    >
      <Icon
        name={guideline.icon}
        size={19}
        strokeWidth={2}
        className="shrink-0 text-slate-400"
      />

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-[15px] font-bold leading-snug text-slate-900">
            {guideline.title}
          </span>
          {!guideline.verified && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
              Draft
            </span>
          )}
        </span>
        <span className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-slate-500">
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
        size={17}
        className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
      />
    </Link>
  );
}

// The bordered group the rows sit in.
export function GuidelineList({ children }) {
  return (
    <div className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white">
      {children}
    </div>
  );
}
