import * as fabric from 'fabric';
import { jsPDF } from 'jspdf';

/**
 * Rasterise a live Fabric canvas using its lower-canvas element directly.
 * This avoids the Canvas.toCanvasElement() override that accesses elements.upper,
 * which is deleted after canvas.dispose().
 */
function canvasToDataUrl(canvas, quality) {
  // Access the rendered lower canvas element directly (no selection handles)
  const lowerEl =
    canvas.lowerCanvasEl ??
    canvas.elements?.lower?.el;

  if (!lowerEl) {
    return canvas.toDataURL({ format: 'png', multiplier: quality });
  }

  if (quality === 1) return lowerEl.toDataURL('image/png');

  // Scale up to quality multiplier via an off-screen canvas
  const temp = document.createElement('canvas');
  temp.width  = Math.round(lowerEl.width  * quality);
  temp.height = Math.round(lowerEl.height * quality);
  temp.getContext('2d').drawImage(lowerEl, 0, 0, temp.width, temp.height);
  return temp.toDataURL('image/png');
}

/**
 * Rasterise a page from its stored JSON (for inactive / switched-away pages).
 * Uses StaticCanvas (no upper-canvas, no event listeners) for reliable off-screen rendering.
 */
async function pageJsonToDataUrl(pageJson, width, height, quality) {
  const el = document.createElement('canvas');
  el.width  = width;
  el.height = height;
  // Must be in DOM so StaticCanvas can initialize its context
  el.style.cssText = 'position:fixed;left:-9999px;top:-9999px;visibility:hidden;pointer-events:none';
  document.body.appendChild(el);

  try {
    const fc   = new fabric.StaticCanvas(el, { width, height });
    const json = typeof pageJson === 'string' ? JSON.parse(pageJson) : pageJson;
    await fc.loadFromJSON(json);
    fc.renderAll();

    const lowerEl = fc.lowerCanvasEl ?? fc.elements?.lower?.el ?? el;
    let dataUrl;

    if (quality === 1) {
      dataUrl = lowerEl.toDataURL('image/png');
    } else {
      const temp = document.createElement('canvas');
      temp.width  = Math.round(lowerEl.width  * quality);
      temp.height = Math.round(lowerEl.height * quality);
      temp.getContext('2d').drawImage(lowerEl, 0, 0, temp.width, temp.height);
      dataUrl = temp.toDataURL('image/png');
    }

    fc.dispose();
    return dataUrl;
  } finally {
    // After StaticCanvas.dispose() the lower el is restored to body level
    if (el.parentNode) el.parentNode.removeChild(el);
  }
}

function blankDataUrl(width, height) {
  const el  = document.createElement('canvas');
  el.width  = width;
  el.height = height;
  const ctx = el.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  return el.toDataURL('image/png');
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Export every page to a single multi-page PDF.
 *
 * Key facts:
 *  - For the ACTIVE page  → canvas is live, render via lower-canvas element.
 *  - For INACTIVE pages   → canvas was disposed() (elements.upper deleted); use stored JSON
 *                           via a fresh StaticCanvas instead.
 *
 * @param {Array}    pages      All page objects from the store
 * @param {Function} getCanvas  Store's getCanvas(pageId) — returns live OR disposed canvas or null
 * @param {number}   quality    Resolution multiplier (1–3)
 */
export async function exportAllPagesToPDF(pages, getCanvas, quality = 2) {
  if (!pages.length) throw new Error('No pages to export');

  let pdf = null;

  for (const page of pages) {
    const { id, width, height, json } = page;
    const raw     = getCanvas(id);
    // Disposed canvases have canvas.disposed === true; treat them like "not live"
    const isLive  = raw && !raw.disposed;

    let dataUrl;
    if (isLive) {
      dataUrl = canvasToDataUrl(raw, quality);
    } else if (json) {
      dataUrl = await pageJsonToDataUrl(json, width, height, quality);
    } else {
      dataUrl = blankDataUrl(width, height);
    }

    const orientation = width >= height ? 'landscape' : 'portrait';

    if (!pdf) {
      pdf = new jsPDF({ orientation, unit: 'px', format: [width, height], compress: true });
    } else {
      pdf.addPage([width, height], orientation);
    }

    pdf.addImage(dataUrl, 'PNG', 0, 0, width, height, undefined, 'FAST');
  }

  if (pdf) {
    const filename = `design-${pages.length}-page${pages.length > 1 ? 's' : ''}.pdf`;
    triggerDownload(pdf.output('blob'), filename);
  }
}

/** Single-canvas image export (PNG / JPEG / WebP). */
export function exportImage(canvas, format = 'png', quality = 2) {
  const dataUrl = canvas.toDataURL({ format, multiplier: quality });
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `design.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function exportToJSON(canvas) {
  const json = canvas.toJSON(['id', 'name', 'selectable', 'evented']);
  const design = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    canvas: { width: canvas.getWidth(), height: canvas.getHeight() },
    ...json,
  };
  const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'design.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return design;
}
