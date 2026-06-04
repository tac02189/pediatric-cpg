import { useWorkflow } from "../guideline/workflowContext.js";
import { evaluateScore } from "../../engine/scoring.js";
import { branchForScore } from "../../engine/resolveNext.js";
import { tone, dispositionTone } from "../../lib/tones.js";
import { Icon } from "../../lib/icons.jsx";
import CalloutCard from "../shared/CalloutCard.jsx";
import FootnoteList from "../shared/FootnoteList.jsx";
import CriteriaList from "../shared/CriteriaList.jsx";
import LookupTable from "../shared/LookupTable.jsx";
import ScoreCalculator from "../shared/ScoreCalculator.jsx";
import DosingCalculator from "../shared/DosingCalculator.jsx";
import PdfButton from "../shared/PdfButton.jsx";

// --- shared chrome --------------------------------------------------------

function NodeFrame({ node, guideline, children, controls }) {
  const body = node.body == null ? [] : Array.isArray(node.body) ? node.body : [node.body];
  const callouts = (node.calloutIds || []).map((id) => guideline.callouts?.[id]).filter(Boolean);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold leading-snug text-slate-900">{node.title}</h2>
        {body.map((p, i) => (
          <p key={i} className="mt-2 text-[15px] leading-relaxed text-slate-600">
            {p}
          </p>
        ))}
      </div>
      {children}
      {callouts.length > 0 && (
        <div className="space-y-2">
          {callouts.map((c, i) => (
            <CalloutCard key={i} callout={c} />
          ))}
        </div>
      )}
      <FootnoteList footnotes={guideline.footnotes} refs={node.footnoteRefs} />
      {controls}
    </div>
  );
}

function ContinueButton({ to, label = "Continue" }) {
  const { advance } = useWorkflow();
  if (!to) return null;
  return (
    <button
      type="button"
      onClick={() => advance(to, label)}
      className="focus-ring tap-target flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary-600 p-3.5 font-display font-bold text-white shadow-card transition hover:bg-primary-700"
    >
      {label}
      <Icon name="ArrowRight" size={18} />
    </button>
  );
}

function BranchButtons({ branches, recommendedNext, disabled, onPick }) {
  const { advance } = useWorkflow();
  const pick = onPick || ((b) => advance(b.next, b.label));

  return (
    <div className="space-y-2">
      {branches.map((b, i) => {
        const recommended = recommendedNext != null && b.next === recommendedNext;
        const t = b.tone ? tone(b.tone) : null;
        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => pick(b)}
            className={`focus-ring tap-target flex w-full items-center gap-2.5 rounded-xl border-2 p-3.5 text-left font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              recommended
                ? "border-primary-500 bg-primary-50 ring-2 ring-primary-200"
                : t
                ? `${t.card} border-transparent`
                : "border-slate-200 bg-white text-slate-800 hover:border-primary-300 hover:bg-slate-50"
            }`}
          >
            {b.tone && <Icon name={tone(b.tone).icon} size={17} className="shrink-0" />}
            <span className="flex-1">{b.label}</span>
            {recommended && (
              <span className="rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Score
              </span>
            )}
            <Icon name="ChevronRight" size={18} className="shrink-0 opacity-40" />
          </button>
        );
      })}
    </div>
  );
}

// --- node types -----------------------------------------------------------

export function StartNode({ node, guideline }) {
  const hasInc = guideline.inclusion?.length > 0;
  const hasExc = guideline.exclusion?.length > 0;
  return (
    <NodeFrame node={node} guideline={guideline} controls={<ContinueButton to={node.next} label="Start pathway" />}>
      {(hasInc || hasExc) && (
        <div className="grid grid-cols-1 gap-3">
          {hasInc && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700">
                Inclusion criteria
              </h3>
              <CriteriaList items={guideline.inclusion} variant="include" />
            </div>
          )}
          {hasExc && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-rose-700">
                Exclusion criteria
              </h3>
              <CriteriaList items={guideline.exclusion} variant="exclude" />
            </div>
          )}
        </div>
      )}
    </NodeFrame>
  );
}

export function InfoNode({ node, guideline }) {
  return (
    <NodeFrame node={node} guideline={guideline} controls={<ContinueButton to={node.next} />} />
  );
}

export function ActionNode({ node, guideline }) {
  return (
    <NodeFrame node={node} guideline={guideline} controls={<ContinueButton to={node.next} />}>
      {node.items?.length > 0 && (
        <ul className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
          {node.items.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-[15px] text-slate-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </NodeFrame>
  );
}

export function DecisionNode({ node, guideline }) {
  return (
    <NodeFrame node={node} guideline={guideline} controls={<BranchButtons branches={node.branches || []} />} />
  );
}

export function BranchNode({ node, guideline }) {
  return (
    <NodeFrame node={node} guideline={guideline} controls={<BranchButtons branches={node.branches || []} />} />
  );
}

export function ScoreNode({ node, guideline }) {
  const { state, setCalcInput, advance, recordScore } = useWorkflow();
  const calc = guideline.calculators[node.calculatorId];
  const inputs = state.calcInputs[node.calculatorId] || {};
  const result =
    calc.engine === "rule"
      ? evaluateScore(calc, { inputs })
      : evaluateScore(calc, { selections: inputs });
  const matching = result.complete ? branchForScore(node, result) : null;

  const onPick = (b) => {
    recordScore(node.calculatorId, {
      label: result.label,
      total: result.total,
      groupId: result.groupId,
    });
    advance(b.next, `${calc.name}: ${b.label}`);
  };

  return (
    <NodeFrame
      node={node}
      guideline={guideline}
      controls={
        <div className="space-y-2">
          {!result.complete && (
            <p className="text-center text-xs font-medium text-slate-400">
              Complete the score to choose a pathway
            </p>
          )}
          <BranchButtons
            branches={node.branches || []}
            recommendedNext={matching?.next}
            disabled={!result.complete}
            onPick={onPick}
          />
        </div>
      }
    >
      <ScoreCalculator
        calc={calc}
        inputs={inputs}
        onInput={(key, value) => setCalcInput(node.calculatorId, key, value)}
      />
    </NodeFrame>
  );
}

export function DosingNode({ node, guideline }) {
  const { state, setPatient } = useWorkflow();
  const calc = guideline.calculators[node.calculatorId];
  const ctx = { weightKg: state.weightKg, sex: state.sex, ageMonths: state.ageMonths };
  return (
    <NodeFrame node={node} guideline={guideline} controls={<ContinueButton to={node.next} />}>
      <DosingCalculator calc={calc} ctx={ctx} onPatientChange={setPatient} />
    </NodeFrame>
  );
}

export function ChecklistNode({ node, guideline }) {
  const { state, toggleCheck } = useWorkflow();
  const checked = state.checklist[node.id] || {};
  return (
    <NodeFrame node={node} guideline={guideline} controls={<ContinueButton to={node.next} />}>
      <CriteriaList
        items={node.items || []}
        variant="check"
        checked={checked}
        onToggle={(idx) => toggleCheck(node.id, idx)}
      />
    </NodeFrame>
  );
}

export function LookupNode({ node, guideline }) {
  return (
    <NodeFrame node={node} guideline={guideline} controls={<ContinueButton to={node.next} />}>
      <LookupTable table={node.table} />
    </NodeFrame>
  );
}

export function ReferenceNode({ node, guideline }) {
  return (
    <NodeFrame node={node} guideline={guideline} controls={<ContinueButton to={node.next} />}>
      <div className="space-y-2">
        {(node.actions || []).map((a, i) => (
          <ReferenceAction key={i} action={a} />
        ))}
      </div>
    </NodeFrame>
  );
}

function ReferenceAction({ action }) {
  if (action.kind === "phone") {
    return (
      <a
        href={`tel:${action.value.replace(/[^0-9+]/g, "")}`}
        className="focus-ring tap-target flex items-center gap-2.5 rounded-xl border border-primary-200 bg-primary-50 p-3 font-semibold text-primary-800"
      >
        <Icon name="Phone" size={18} className="shrink-0" />
        <span className="flex-1">{action.label}</span>
        <span className="tabular-nums">{action.value}</span>
      </a>
    );
  }
  if (action.kind === "url") {
    return (
      <a
        href={action.value}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-ring tap-target flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 font-semibold text-slate-700"
      >
        <Icon name="ExternalLink" size={18} className="shrink-0 text-primary-600" />
        <span className="flex-1">{action.label}</span>
      </a>
    );
  }
  // powerplan / generic order set — display only (ordering happens in the EHR)
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <Icon name="ClipboardList" size={18} className="shrink-0 text-slate-500" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">{action.label}</p>
        {action.value && (
          <p className="truncate text-xs text-slate-500">PowerPlan: “{action.value}”</p>
        )}
      </div>
    </div>
  );
}

export function OutcomeNode({ node, guideline }) {
  const { restart } = useWorkflow();
  const t = tone(node.tone || dispositionTone(node.disposition));
  const body = node.body == null ? [] : Array.isArray(node.body) ? node.body : [node.body];
  const callouts = (node.calloutIds || []).map((id) => guideline.callouts?.[id]).filter(Boolean);

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border-2 p-4 ${t.card}`}>
        <div className="flex items-center gap-2">
          <Icon name={t.icon} size={22} className="shrink-0" />
          <h2 className="font-display text-xl font-extrabold">{node.title}</h2>
        </div>
        {body.map((p, i) => (
          <p key={i} className="mt-2 text-[15px] leading-relaxed">
            {p}
          </p>
        ))}
      </div>

      {callouts.length > 0 && (
        <div className="space-y-2">
          {callouts.map((c, i) => (
            <CalloutCard key={i} callout={c} />
          ))}
        </div>
      )}
      <FootnoteList footnotes={guideline.footnotes} refs={node.footnoteRefs} />

      {node.next && <ContinueButton to={node.next} />}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={restart}
          className="focus-ring tap-target inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Icon name="RotateCcw" size={16} />
          Start over
        </button>
        <PdfButton sourcePdf={guideline.sourcePdf} variant="outline" />
      </div>
    </div>
  );
}
