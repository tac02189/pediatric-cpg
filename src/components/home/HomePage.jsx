import { useMemo, useState } from "react";
import { GUIDELINES, guidelinesByCategory, searchGuidelines } from "../../data/index.js";
import { Icon } from "../../lib/icons.jsx";
import SearchBar from "./SearchBar.jsx";
import CategorySection from "./CategorySection.jsx";
import GuidelineCard, { GuidelineList } from "./GuidelineCard.jsx";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  const results = useMemo(() => (trimmed ? searchGuidelines(trimmed) : null), [trimmed]);
  const groups = useMemo(() => guidelinesByCategory(), []);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-5">
      <h1 className="mb-3 text-2xl font-bold leading-tight text-slate-900">
        Clinical guidelines
      </h1>

      <div className="mb-6">
        <SearchBar value={query} onChange={setQuery} resultCount={results?.length ?? 0} />
      </div>

      {results === null ? (
        <>
          {GUIDELINES.length === 0 ? (
            <EmptyLibrary />
          ) : (
            groups.map(({ category, guidelines }) => (
              <CategorySection key={category.id} category={category} guidelines={guidelines} />
            ))
          )}
        </>
      ) : results.length === 0 ? (
        <NoResults query={trimmed} />
      ) : (
        <GuidelineList>
          {results.map((g) => (
            <GuidelineCard key={g.id} guideline={g} showCategory />
          ))}
        </GuidelineList>
      )}
    </div>
  );
}

function NoResults({ query }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
      <Icon name="Search" size={28} className="mx-auto text-slate-300" />
      <p className="mt-3 text-sm font-semibold text-slate-700">
        No guideline matches “{query}”
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Try a symptom (stridor, RLQ pain), a diagnosis, or browse by category.
      </p>
    </div>
  );
}

function EmptyLibrary() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
      <Icon name="FileText" size={28} className="mx-auto text-slate-300" />
      <p className="mt-3 text-sm font-semibold text-slate-700">No guidelines loaded yet</p>
      <p className="mt-1 text-xs text-slate-500">
        Guideline data files live in <code>src/data/guidelines/</code>.
      </p>
    </div>
  );
}
