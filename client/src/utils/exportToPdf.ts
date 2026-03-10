/**
 * exportToPdf.ts
 * ─────────────────────────────────────────────────────────────────
 * Converts any HTMLElement into a paginated A4 PDF and triggers
 * a browser download.
 *
 * Approach:
 *   1. Clone the element and constrain it to exact A4 pixel width
 *      so html2canvas captures it at the right viewport size.
 *   2. Render to canvas (html2canvas @ 2× scale for sharpness).
 *   3. Slice the canvas into A4-height pages and add each to jsPDF.
 *   4. Save / download the PDF.
 *
 * Dependencies (loaded from CDN on first call, cached thereafter):
 *   • html2canvas  1.4.1
 *   • jsPDF        2.5.1
 * ─────────────────────────────────────────────────────────────────
 */

// ── Constants ────────────────────────────────────────────────────

/** A4 at 96 DPI — used as the render viewport width */
const A4_PX_WIDTH = 794;

/** jsPDF "pt" dimensions for A4 portrait */
const A4_PT = { width: 595.28, height: 841.89 } as const;

/** Page margin in pt (~12.7 mm) */
const MARGIN_PT = 36;

/** Printable area inside margins */
const CONTENT_PT = {
  width:  A4_PT.width  - MARGIN_PT * 2,
  height: A4_PT.height - MARGIN_PT * 2,
} as const;

// ── CDN script loader ────────────────────────────────────────────

const CDN = {
  html2canvas: "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
  jspdf:       "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
};

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload  = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

async function ensureDependencies(): Promise<void> {
  await loadScript(CDN.html2canvas);
  await loadScript(CDN.jspdf);
}

// ── DOM helpers ──────────────────────────────────────────────────

/**
 * Deep-clones an element and applies A4-width styles so the
 * browser lays it out at exactly 794 px before capture.
 */
function buildPrintClone(source: HTMLElement): HTMLElement {
  const clone = source.cloneNode(true) as HTMLElement;

  // Lock wrapper to A4 pixel width
  Object.assign(clone.style, {
    width:     `${A4_PX_WIDTH}px`,
    maxWidth:  `${A4_PX_WIDTH}px`,
    minWidth:  `${A4_PX_WIDTH}px`,
    padding:   "24px",
    margin:    "0",
    background: "#ffffff",
    boxSizing:  "border-box",
    color:      "#111111",
    overflow:   "visible",
  });

  // Un-clip every descendant so tables / wide content isn't cropped
  clone.querySelectorAll<HTMLElement>("*").forEach((el) => {
    el.style.overflow  = "visible";
    el.style.overflowX = "visible";
    el.style.overflowY = "visible";
    el.style.maxWidth  = "none";
  });

  return clone;
}

/**
 * Mounts a clone off-screen (left of viewport) at the correct
 * width so html2canvas can measure it in a real layout context.
 * Returns a cleanup function that removes the host element.
 */
function mountOffScreen(clone: HTMLElement): () => void {
  const host = document.createElement("div");
  Object.assign(host.style, {
    position:      "fixed",
    top:           "0",
    left:          `-${A4_PX_WIDTH + 400}px`,
    width:         `${A4_PX_WIDTH}px`,
    background:    "white",
    zIndex:        "-9999",
    pointerEvents: "none",
  });
  host.appendChild(clone);
  document.body.appendChild(host);
  return () => document.body.removeChild(host);
}

// ── Canvas → paginated PDF ───────────────────────────────────────

/**
 * Takes a fully-rendered canvas and writes it into a jsPDF document
 * as sliced A4 pages, then triggers download.
 */
function canvasToPdf(canvas: HTMLCanvasElement, filename: string): void {
  const { jsPDF } = (window as any).jspdf;

  // Scale canvas height into pt space (width already matches CONTENT_PT.width)
  const totalHeightPt = (canvas.height / canvas.width) * CONTENT_PT.width;

  const pdf = new jsPDF({
    unit:        "pt",
    format:      "a4",
    orientation: "portrait",
    compress:    true,
  });

  let renderedPt = 0;
  let pageIndex  = 0;

  while (renderedPt < totalHeightPt) {
    if (pageIndex > 0) pdf.addPage();

    const sliceHeightPt = Math.min(CONTENT_PT.height, totalHeightPt - renderedPt);

    // Corresponding pixel rows in the source canvas
    const srcY = (renderedPt       / totalHeightPt) * canvas.height;
    const srcH = (sliceHeightPt    / totalHeightPt) * canvas.height;

    // Draw only this slice into a temporary canvas
    const slice = document.createElement("canvas");
    slice.width  = canvas.width;
    slice.height = Math.ceil(srcH);
    slice.getContext("2d")!.drawImage(
      canvas,
      0, srcY, canvas.width, srcH,   // source rect
      0, 0,    canvas.width, srcH,   // dest rect
    );

    pdf.addImage(
      slice.toDataURL("image/jpeg", 1.0),
      "JPEG",
      MARGIN_PT, MARGIN_PT,
      CONTENT_PT.width, sliceHeightPt,
    );

    renderedPt += sliceHeightPt;
    pageIndex++;
  }

  pdf.save(filename);
}

// ── Public API ───────────────────────────────────────────────────

export interface ExportOptions {
  /** Downloaded file name, e.g. "proposal_program.pdf" */
  filename: string;
  /** Extra ms to wait after mounting clone before capture (default: 150) */
  settleMs?: number;
}

/**
 * Exports the given HTMLElement as a paginated A4 PDF.
 *
 * @example
 * await exportElementToPdf(divRef.current, { filename: "report.pdf" });
 */
export async function exportElementToPdf(
  element: HTMLElement,
  options: ExportOptions,
): Promise<void> {
  const { filename, settleMs = 150 } = options;

  await ensureDependencies();

  const clone   = buildPrintClone(element);
  const cleanup = mountOffScreen(clone);

  try {
    // Let the browser reflow the clone at A4 width before capture
    await new Promise((r) => setTimeout(r, settleMs));

    const canvas = await (window as any).html2canvas(clone, {
      scale:           2,
      useCORS:         true,
      logging:         false,
      width:           A4_PX_WIDTH,
      windowWidth:     A4_PX_WIDTH,
      scrollX:         0,
      scrollY:         0,
      backgroundColor: "#ffffff",
    });

    canvasToPdf(canvas, filename);
  } finally {
    cleanup();
  }
}