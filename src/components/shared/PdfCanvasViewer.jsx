import { useEffect, useRef, useState } from "react";
// ?worker lets Vite bundle the pdf.js worker correctly; handing it to pdf.js as
// a worker port is the robust setup. pdf.js v4 renders standard PDFs with just the
// worker (no wasm/cmap assets needed for embedded-font PDFs).
import PdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?worker";
import { Icon } from "../../lib/icons.jsx";

// Load pdf.js once, with one PDFWorker for the app's lifetime, passed to every
// getDocument() call. Don't set GlobalWorkerOptions.workerPort instead: pdf.js
// then destroys that shared worker with each document, and the replacement it
// builds restarts its message ids, so a reply still owed to a closed viewer can be
// delivered to the next one. A worker the caller supplies is never destroyed.
let pdfjsPromise = null;
function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist")
      .then((pdfjs) => ({ pdfjs, worker: new pdfjs.PDFWorker({ port: new PdfWorker() }) }))
      .catch((err) => {
        // Never cache a failure: one flaky load would otherwise break the viewer
        // until the app is reloaded. The next open tries again.
        pdfjsPromise = null;
        throw err;
      });
  }
  return pdfjsPromise;
}

// Teardowns of recently closed viewers. Each load waits for them first, so the
// worker isn't still releasing one document while it loads the next (on a phone,
// memory is the constraint), but never for more than TEARDOWN_WAIT_MS after any
// close: a teardown that never finishes must cost the next viewer a short wait,
// not its inline view. Never rejects.
const TEARDOWN_WAIT_MS = 3000;
let teardown = Promise.resolve();

// A later page still not drawn after this long gets the prominent way out to the
// full PDF. Drawing carries on, and the page still appears if it gets there.
const PAGE_STALL_MS = 10000;

// Renders a PDF to <canvas> pages. Unlike an <iframe>, this works on every
// platform — including iOS Safari and standalone PWAs, which refuse to render
// PDFs inside iframes. Falls back to "open directly" if anything goes wrong.
export default function PdfCanvasViewer({ href }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  // Once page 1 is up: the later page being drawn, and whether it is slow or has
  // failed. Null only when every page is drawn, so a partly drawn PDF never passes
  // for a complete one.
  const [tail, setTail] = useState(null); // { page, total, slow, failed }

  useEffect(() => {
    let cancelled = false;
    let rendered = false;
    // The loading task, not the document: destroying the task also stops a
    // document that is still loading, before there is a document to destroy.
    let task = null;
    let pageTimer = null; // PAGE_STALL_MS for the later page being drawn
    let drawing = null; // the canvas of the page being drawn
    const container = containerRef.current;
    // Never show an earlier document's pages under this one's spinner.
    container?.replaceChildren();

    // Never strand the user on a spinner — if rendering hasn't started in time,
    // show the open-directly fallback.
    const timeout = setTimeout(() => {
      if (!cancelled && !rendered) setStatus("error");
    }, 10000);

    (async () => {
      try {
        setStatus("loading");
        setTail(null);
        const { pdfjs, worker } = await loadPdfjs();
        await teardown;
        if (cancelled || !container) return;
        task = pdfjs.getDocument({ url: href, worker });
        const pdfDoc = await task.promise;
        if (cancelled) return;
        container.replaceChildren();

        const cw = Math.max(container.clientWidth, 240);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        for (let n = 1; n <= pdfDoc.numPages; n++) {
          if (cancelled) return;
          if (n > 1) {
            setTail({ page: n, total: pdfDoc.numPages, slow: false, failed: false });
            clearTimeout(pageTimer);
            pageTimer = setTimeout(() => {
              if (!cancelled) setTail((t) => (t?.page === n && !t.failed ? { ...t, slow: true } : t));
            }, PAGE_STALL_MS);
          }
          const page = await pdfDoc.getPage(n);
          if (cancelled) return;
          const scale = cw / page.getViewport({ scale: 1 }).width;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width * dpr);
          canvas.height = Math.floor(viewport.height * dpr);
          canvas.className = "mb-2 block w-full rounded bg-white shadow";
          container.appendChild(canvas);
          drawing = canvas;
          // iOS Safari gives no context once its canvas memory runs out. Handed a
          // null context, pdf.js throws part way into render() and leaves the page
          // half set up, so that destroying the document later throws too. Fail
          // the page here instead.
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("No 2d context for this page's canvas");

          // A resolved render means pdf.js finished, not that the page is whole:
          // pdf.js skips content it can't parse, and an operator-list error after
          // drawing has started still resolves this promise (pdf.js 4.10 marks the
          // list complete, and the rejection it then sends can no longer land).
          await page.render({
            canvasContext: ctx,
            viewport,
            transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
          }).promise;
          drawing = null;

          if (n === 1 && !cancelled) {
            rendered = true;
            setStatus("ready");
          }
        }
        clearTimeout(pageTimer);
        if (!cancelled) {
          rendered = true;
          setStatus("ready");
          setTail(null);
        }
      } catch (e) {
        clearTimeout(pageTimer);
        // A closed viewer's own teardown cancels its render: expected, and not a
        // failure worth reporting.
        if (cancelled) return;
        console.error("PDF render failed", e);
        // With page 1 up, keep the pages that drew, drop the one that failed part
        // way, and flag the rest below them; before that, fall back to opening the
        // PDF directly.
        if (rendered) {
          drawing?.remove();
          setTail((t) => t && { ...t, failed: true });
        } else setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      clearTimeout(pageTimer);
      // The load above creates no task once cancelled is set, so `task` is final.
      if (!task) return;
      // Start the teardown now and add it to what later loads wait for, capped at
      // TEARDOWN_WAIT_MS and never replacing a teardown still in flight. The barrier
      // keeps no result of its own; the cap bounds the wait, not pdf.js's cleanup (a
      // destroy that never settles keeps its document's resources).
      const cap = new Promise((resolve) => setTimeout(resolve, TEARDOWN_WAIT_MS));
      const done = task.destroy().catch(() => {});
      teardown = Promise.all([teardown, Promise.race([done, cap])]).then(() => {});
    };
  }, [href]);

  // The overlays sit outside the scrolling pages, so the fallback covers the whole
  // viewer: a partly drawn page can't be scrolled into view beneath it.
  return (
    <div className="relative h-full w-full">
      <div className="h-full w-full overflow-y-auto overscroll-contain bg-slate-200">
        <div ref={containerRef} className="mx-auto max-w-3xl px-2 py-3" />
        {/* Always mounted, so screen readers announce each change to it. */}
        <div role="status" className="mx-auto max-w-3xl px-4 text-center text-sm">
          {tail &&
            (tail.failed || tail.slow ? (
              <p className="flex items-center justify-center gap-2 text-slate-600">
                <Icon
                  name="TriangleAlert"
                  size={18}
                  className="shrink-0 text-amber-500"
                  aria-hidden="true"
                />
                {tail.slow && !tail.failed
                  ? `Page ${tail.page} of ${tail.total} is taking a while to show here.`
                  : tail.page === tail.total
                  ? `Couldn’t show page ${tail.page} of ${tail.total} here.`
                  : `Couldn’t show pages ${tail.page}–${tail.total} of ${tail.total} here.`}
              </p>
            ) : (
              <p className="text-slate-500">
                Loading page {tail.page} of {tail.total}…
              </p>
            ))}
        </div>
        {/* Whenever the PDF is incomplete there is a way to the whole document right
            here: quiet while a page is drawing, prominent once it is slow or failed. */}
        {tail && (
          <div className="flex justify-center px-4 pb-6 pt-3">
            <a
              href={href}
              className={
                tail.failed || tail.slow
                  ? "focus-ring tap-target inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
                  : "focus-ring tap-target inline-flex items-center rounded px-2 text-sm font-semibold text-primary-700 underline"
              }
            >
              Open the PDF
            </a>
          </div>
        )}
      </div>
      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-slate-500">
          Loading PDF…
        </div>
      )}
      {status === "error" && (
        <div
          role="alert"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-200 p-6 text-center"
        >
          <Icon name="TriangleAlert" size={28} className="text-amber-500" aria-hidden="true" />
          <p className="text-sm text-slate-600">Couldn’t show the inline view.</p>
          <a
            href={href}
            className="focus-ring tap-target inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Open the PDF
          </a>
        </div>
      )}
    </div>
  );
}
