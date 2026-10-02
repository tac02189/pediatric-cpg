import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../../lib/icons.jsx";
import PdfCanvasViewer from "./PdfCanvasViewer.jsx";

// Short content hash of every source PDF, computed at build time in
// vite.config.js. Falls back to no version if the define is ever missing.
// eslint-disable-next-line no-undef
const PDF_VERSIONS = typeof __PDF_VERSIONS__ === "object" ? __PDF_VERSIONS__ : {};

// The ?v= query is the PDF's content hash, so the URL changes exactly when the
// file's bytes do — a replaced PDF can never be served from a cache under its old
// URL, even when it is re-issued within the same month. (The service worker
// precaches every PDF by its own content revision and ignores ?v= when matching;
// see vite.config.js.)
function pdfUrl(sourcePdf) {
  const v = PDF_VERSIONS[sourcePdf];
  return `${import.meta.env.BASE_URL}pdfs/${sourcePdf}${v ? `?v=${v}` : ""}`;
}

// Opens the official source PDF in a full-screen in-app overlay. This keeps the
// clinician inside the app (preserving their place in the workflow underneath)
// and works in installed/standalone PWA mode, where a target=_blank link to a
// same-origin file silently fails (there is no browser tab to open into).
export default function PdfButton({
  sourcePdf,
  title,
  variant = "ghost",
  label = "Official PDF",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const wasOpen = useRef(false);
  const href = pdfUrl(sourcePdf);

  // Hand keyboard focus back to the button that opened the viewer once it closes.
  useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus({ preventScroll: true });
    wasOpen.current = open;
  }, [open]);

  const styles =
    variant === "solid"
      ? "bg-primary-600 text-white hover:bg-primary-700"
      : variant === "outline"
      ? "border border-primary-300 bg-white text-primary-700 hover:bg-primary-50"
      : "text-primary-700 hover:bg-primary-50";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={`focus-ring tap-target inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${styles} ${className}`}
      >
        <Icon name="FileText" size={16} />
        {label}
      </button>
      {open && (
        <PdfOverlay href={href} title={title || "Official guideline PDF"} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

// The viewer's history entry. Opening the viewer adds one entry so the device
// Back button / swipe-back closes the viewer instead of leaving the guideline,
// and closing it asks the browser to go back over that entry. Each entry carries
// a unique token.
//
// Policy for asking the browser to go back — conservative, because popstate
// events carry no identity, so a requested traversal can never be matched to
// the one that arrives. The state is module-level because a request outlives the
// viewer that made it: the viewer unmounts on the first popstate, which may be
// the user's own Back rather than the traversal it requested.
//  • Only from an entry this viewer owns (created, or reused, on open).
//  • Not within SETTLE_MS of the previous request, whatever popstates arrive.
//  • Never again this session if no popstate at all arrived within SETTLE_MS of
//    a request. Closes are then local, and the entry left behind is reused by
//    the next open rather than stacked on.
// Residual, accepted: a traversal the browser DELAYS (rather than drops) for
// more than SETTLE_MS, while the user's own Back lands first and a viewer is
// then reopened and closed, could still produce two traversals. Ruling that out
// completely would mean at most one requested Back per session — leaving a dead
// Back press behind every later close.
const SETTLE_MS = 1500;
let backUnreliable = false;
// The outstanding request, until its SETTLE_MS window closes: when it was made
// (performance.now() — monotonic, so clock changes can't stretch or skip the
// window) and whether any popstate has arrived since.
let pending = null;
let watchingPops = false;

// Close the outstanding request's window once it has run out. Evaluated at each
// decision point rather than by a timer, so a busy or throttled main thread
// can't let a request through, or a late popstate count, before it settles.
function settle(now) {
  if (pending && now - pending.at >= SETTLE_MS) {
    if (!pending.arrived) backUnreliable = true;
    pending = null;
  }
}

function watchPops() {
  if (watchingPops) return;
  watchingPops = true;
  window.addEventListener("popstate", () => {
    settle(performance.now()); // one arriving after the window doesn't count
    if (pending) pending.arrived = true;
  });
}

// Ask the browser to go back, if the policy allows. Returns whether it asked.
function requestBack() {
  const now = performance.now();
  settle(now);
  if (backUnreliable || pending) return false;
  try {
    window.history.back();
  } catch {
    backUnreliable = true;
    return false;
  }
  pending = { at: now, arrived: false };
  return true;
}

function enterViewerEntry() {
  watchPops();
  const token = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const state = window.history.state;
  if (state && state.pdfViewer) {
    // Still on an earlier viewer's entry (its close never completed, or React
    // StrictMode re-ran the effect): reuse it instead of stacking another, so
    // abandoned entries can never pile up.
    window.history.replaceState({ ...state, pdfViewer: token }, "");
  } else {
    // Keep the router's own state (key/index) on the new entry; add our token.
    window.history.pushState({ ...(state || {}), pdfViewer: token }, "");
  }
  return token;
}

function PdfOverlay({ href, title, onClose }) {
  const backRef = useRef(null);
  const closingRef = useRef(false);
  const fallbackTimer = useRef(null);
  // This viewer's history token, or null if no entry could be created.
  const entryRef = useRef(null);
  // Read through a ref so a parent re-render (a new onClose identity) doesn't
  // re-run the effect below and yank focus back to the Back button.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Close through history so the viewer's entry is consumed (no orphan
  // back-press) — once only: a double-tap would otherwise pop a second entry, the
  // app's own page, and leave the guideline. See the policy above for when the
  // close stays local instead.
  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    const ownsEntry =
      entryRef.current !== null && window.history.state?.pdfViewer === entryRef.current;
    if (!ownsEntry || !requestBack()) {
      onCloseRef.current();
      return;
    }
    // Normally popstate arrives within milliseconds and closes the viewer. If it
    // doesn't, close locally; the policy above decides whether later closes may
    // still ask.
    fallbackTimer.current = setTimeout(() => onCloseRef.current(), SETTLE_MS);
  };

  useEffect(() => {
    // The history entry first, and exception-safe: if the browser refuses
    // pushState/replaceState, the viewer still opens and closes locally, and the
    // cleanup below is always returned (the app is never left inert).
    let token = null;
    try {
      token = enterViewerEntry();
    } catch {
      token = null;
    }
    entryRef.current = token;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Modal for keyboard and screen-reader users too: the viewer is portaled to
    // <body>, outside #root, so making #root inert takes the whole app behind it
    // out of the tab order and the accessibility tree. Focus starts on Back.
    const appRoot = document.getElementById("root");
    appRoot?.setAttribute("inert", "");
    backRef.current?.focus({ preventScroll: true });

    // Close once this viewer's entry is gone — Back, the device back gesture, or
    // close() above. A traversal that lands on this same entry changes nothing.
    const onPop = () => {
      if (token === null || window.history.state?.pdfViewer !== token) onCloseRef.current();
    };
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(fallbackTimer.current);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
      appRoot?.removeAttribute("inert");
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-slate-900"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="flex items-center gap-1 border-b border-white/10 bg-brand-black px-2 py-2"
        style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
      >
        <button
          ref={backRef}
          type="button"
          onClick={close}
          className="focus-ring tap-target inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-white hover:bg-white/10"
        >
          <Icon name="ArrowLeft" size={18} />
          Back
        </button>
        <span className="min-w-0 flex-1 truncate px-1 text-center text-sm font-semibold text-white">
          {title}
        </span>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open in a new tab"
          title="Open in a new tab"
          className="focus-ring tap-target inline-flex items-center rounded-lg p-2 text-white/80 hover:bg-white/10"
        >
          <Icon name="ExternalLink" size={18} />
        </a>
        <a
          href={href}
          download
          aria-label="Download PDF"
          title="Download PDF"
          className="focus-ring tap-target inline-flex items-center rounded-lg p-2 text-white/80 hover:bg-white/10"
        >
          <Icon name="Download" size={18} />
        </a>
      </div>

      <div className="min-h-0 flex-1">
        <PdfCanvasViewer href={href} />
      </div>
    </div>,
    document.body
  );
}
