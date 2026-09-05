import GuidelineCard, { GuidelineList } from "./GuidelineCard.jsx";

// Compact section header (small accent marker + label + count) over one
// bordered group of guideline rows. The category accent survives only as the
// marker dot — the rows themselves stay neutral.
export default function CategorySection({ category, guidelines }) {
  return (
    <section className="mb-6">
      <div className="mb-2 px-1">
        <div className="flex items-baseline gap-2">
          <span
            aria-hidden="true"
            className={`h-2 w-2 self-center rounded-full bg-${category.accent}-500`}
          />
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-slate-700">
            {category.label}
          </h2>
          <span className="text-xs tabular-nums text-slate-400">{guidelines.length}</span>
        </div>
        {category.blurb && (
          <p className="mt-0.5 pl-4 text-xs text-slate-500">{category.blurb}</p>
        )}
      </div>
      <GuidelineList>
        {guidelines.map((g) => (
          <GuidelineCard key={g.id} guideline={g} />
        ))}
      </GuidelineList>
    </section>
  );
}
