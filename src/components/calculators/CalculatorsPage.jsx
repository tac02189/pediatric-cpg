import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { GUIDELINES } from "../../data/index.js";
import { getCategory, accentClasses } from "../../data/categories.js";
import { Icon } from "../../lib/icons.jsx";
import StandaloneCalculator, { calculatorName } from "../shared/StandaloneCalculator.jsx";

export default function CalculatorsPage() {
  const [q, setQ] = useState("");

  const groups = useMemo(
    () =>
      GUIDELINES.map((g) => ({
        g,
        calcs: Object.entries(g.calculators || {}).map(([id, calc]) => ({ id, calc })),
      })).filter((x) => x.calcs.length > 0),
    []
  );

  const norm = (s) => (s || "").toLowerCase();
  const query = norm(q.trim());
  const filtered = query
    ? groups
        .map((grp) => ({
          ...grp,
          calcs: grp.calcs.filter(({ calc }) =>
            norm(`${calculatorName(calc, "")} ${grp.g.title}`).includes(query)
          ),
        }))
        .filter((grp) => grp.calcs.length > 0)
    : groups;

  const total = groups.reduce((n, grp) => n + grp.calcs.length, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-5">
      <div className="mb-1 flex items-center gap-2">
        <Icon name="Calculator" size={24} className="text-primary-600" />
        <h1 className="font-display text-2xl font-extrabold text-slate-900">Calculators</h1>
      </div>
      <p className="mb-5 text-sm text-slate-500">
        {total} scoring &amp; dosing tools across all guidelines. Tap one to use it directly.
      </p>

      <div className="relative mb-6">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          <Icon name="Search" size={18} />
        </span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Find a score or drug, e.g. Westley, ketamine…"
          className="focus-ring w-full rounded-xl2 border border-slate-200 bg-white py-3 pl-11 pr-4 text-[15px] shadow-card placeholder:text-slate-400"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
          No calculators match “{q}”.
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map(({ g, calcs }) => {
            const cat = getCategory(g.category);
            const a = accentClasses(cat?.accent || "sky");
            return (
              <section key={g.id}>
                <div className="mb-2 flex items-center gap-2 px-1">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${a.bgChip} ${a.text}`}>
                    <Icon name={g.icon} size={15} strokeWidth={2.2} />
                  </span>
                  <Link
                    to={`/guideline/${g.id}`}
                    className="focus-ring font-display text-sm font-bold text-slate-800 hover:text-primary-700"
                  >
                    {g.title}
                  </Link>
                </div>
                <div className="space-y-2">
                  {calcs.map(({ id, calc }) => (
                    <details key={id} className="group rounded-xl2 border border-slate-200 bg-white shadow-card">
                      <summary className="focus-ring flex cursor-pointer list-none items-center gap-2 p-3.5 text-sm font-semibold text-slate-800">
                        <Icon
                          name={calc.kind === "dosing" ? "Pill" : "ListChecks"}
                          size={17}
                          className="text-primary-600"
                        />
                        {calculatorName(calc, id)}
                        <Icon
                          name="ChevronDown"
                          size={16}
                          className="ml-auto text-slate-400 transition group-open:rotate-180"
                        />
                      </summary>
                      <div className="border-t border-slate-100 p-3.5">
                        <StandaloneCalculator calc={calc} />
                        {calc.reference && (
                          <p className="mt-3 text-xs text-slate-400">{calc.reference}</p>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
