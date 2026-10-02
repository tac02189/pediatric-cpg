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

// Each close queues its document's teardown here and each load waits for the
// queue first, so one document's teardown (which, in the worker, also clears
// caches shared by every document) never overlaps the next one's load. Never
// rejects: one failed teardown must not block every later viewer.
let teardown = Promise.resolve();

// Renders a PDF to <canvas> pages. Unlike an <iframe>, this works on every
// platform — including iOS Safari and standalone PWAs, which refuse to render
// PDFs inside iframes. Falls back to "open directly" if anything goes wrong.
export default function PdfCanvasViewer({ href }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    let rendered = false;
    // The loading task, not the document: destroying the task also stops a
    // document that is still loading, before there is a document to destroy.
    let task = null;
    const container = containerRef.current;

    // Never strand the user on a spinner — if rendering hasn't started in time,
    // show the open-directly fallback.
    const timeout = setTimeout(() => {
      if (!cancelled && !rendered) setStatus("error");
    }, 10000);

    (async () => {
      try {
        setStatus("loading");
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
          const page = await pdfDoc.getPage(n);
          const scale = cw / page.getViewport({ scale: 1 }).width;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width * dpr);
          canvas.height = Math.floor(viewport.height * dpr);
          canvas.className = "mb-2 block w-full rounded bg-white shadow";
          container.appendChild(canvas);

          await page.render({
            canvasContext: canvas.getContext("2d"),
            viewport,
            transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
          }).promise;

          if (n === 1 && !cancelled) {
            rendered = true;
            setStatus("ready");
          }
        }
        if (!cancelled) {
          rendered = true;
          setStatus("ready");
        }
      } catch (e) {
        // A closed viewer's own teardown cancels its render: expected, and not a
        // failure worth reporting.
        if (cancelled) return;
        console.error("PDF render failed", e);
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      // Chain, never replace, so a teardown still in flight stays in the queue.
      // The load above creates no task once cancelled is set, so `task` is final.
      teardown = teardown.then(() => task?.destroy()).catch(() => {});
    };
  }, [href]);

  return (
    <div className="relative h-full w-full overflow-y-auto overscroll-contain bg-slate-200">
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
          Loading PDF…
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <Icon name="TriangleAlert" size={28} className="text-amber-500" />
          <p className="text-sm text-slate-600">Couldn’t show the inline view.</p>
          <a
            href={href}
            className="focus-ring rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Open the PDF
          </a>
        </div>
      )}
      <div ref={containerRef} className="mx-auto max-w-3xl px-2 py-3" />
    </div>
  );
}
