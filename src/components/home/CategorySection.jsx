import { Icon } from "../../lib/icons.jsx";
import { accentClasses } from "../../data/categories.js";
import GuidelineCard from "./GuidelineCard.jsx";

export default function CategorySection({ category, guidelines }) {
  const a = accentClasses(category.accent);

  return (
    <section className="mb-7">
      <div className="mb-3 flex items-center gap-2.5 px-1">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${a.bgChip} ${a.text}`}>
          <Icon name={category.icon} size={18} strokeWidth={2.2} />
        </span>
        <div>
          <h2 className="font-display text-base font-bold text-slate-900">{category.label}</h2>
          <p className="text-xs text-slate-500">{category.blurb}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2.5">
        {guidelines.map((g) => (
          <GuidelineCard key={g.id} guideline={g} />
        ))}
      </div>
    </section>
  );
}
