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

function PdfOverlay({ href, title, onClose }) {
  const pushedRef = useRef(false);
  const backRef = useRef(null);
  const closingRef = useRef(false);
  const fallbackTimer = useRef(null);

  // Close through history so the pushed entry is consumed (no orphan back-press).
  // Only once: a double-tap would otherwise pop a second entry — the app's own
  // page — before the first popstate arrives, and leave the guideline. If the
  // browser ignores or throttles the traversal and no popstate ever arrives,
  // dismiss locally instead of leaving the app latched behind the overlay.
  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    try {
      window.history.back();
    } catch {
      /* the fallback below still closes the viewer */
    }
    fallbackTimer.current = setTimeout(() => onCloseRef.current(), 1500);
  };
  // Read through a ref so a parent re-render (a new onClose identity) doesn't
  // re-run the effect below and yank focus back to the Back button.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Modal for keyboard and screen-reader users too: the viewer is portaled to
    // <body>, outside #root, so making #root inert takes the whole app behind it
    // out of the tab order and the accessibility tree. Focus starts on Back.
    const appRoot = document.getElementById("root");
    appRoot?.setAttribute("inert", "");
    backRef.current?.focus({ preventScroll: true });

    // Push a history entry so the device Back button / swipe-back closes the
    // viewer instead of leaving the page. (Guarded against StrictMode double-run.)
    if (!pushedRef.current) {
      window.history.pushState({ pdfViewer: true }, "");
      pushedRef.current = true;
    }
    const onPop = () => onCloseRef.current();
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
