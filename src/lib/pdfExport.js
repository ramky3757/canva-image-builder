import * as fabric from 'fabric';
import { jsPDF } from 'jspdf';

/**
 * Rasterise a single active Fabric canvas to a PNG data URL.
 */
function canvasToDataUrl(canvas, quality) {
  return canvas.toDataURL({ format: 'png', multiplier: quality });
}

/**
 * Rasterise a page from its stored JSON (for inactive / not-mounted pages).
 * Returns a PNG data URL.
 */
async function pageJsonToDataUrl(pageJson, width, height, quality) {
  const el = document.createElement('canvas');
  const fc = new fabric.Canvas(el, { width, height });
  const json = typeof pageJson === 'string' ? JSON.parse(pageJson) : pageJson;
  await fc.loadFromJSON(json);
  fc.renderAll();
  const dataUrl = fc.toDataURL({ format: 'png', multiplier: quality });
  fc.dispose();
  return dataUrl;
}

/**
 * Export every page to a single multi-page PDF.
 *
 * @param {Array}    pages      All page objects from the store
 * @param {Function} getCanvas  Store's getCanvas(pageId) — returns live canvas or null
 * @param {number}   quality    Resolution multiplier (1 = 1×, 2 = 2×, etc.)
 */
export async function exportAllPagesToPDF(pages, getCanvas, quality = 2) {
  if (!pages.length) return;

  let pdf = null;

  for (const page of pages) {
    const { id, width, height, json } = page;
    const liveCanvas = getCanvas(id);

    let dataUrl;
    if (liveCanvas) {
      dataUrl = canvasToDataUrl(liveCanvas, quality);
    } else if (json) {
      dataUrl = await pageJsonToDataUrl(json, width, height, quality);
    } else {
      // Empty page — blank white
      const el = document.createElement('canvas');
      el.width = width * quality;
      el.height = height * quality;
      const ctx = el.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, el.width, el.height);
      dataUrl = el.toDataURL('image/png');
    }

    const orientation = width >= height ? 'landscape' : 'portrait';

    if (!pdf) {
      pdf = new jsPDF({ orientation, unit: 'px', format: [width, height] });
    } else {
      pdf.addPage([width, height], orientation);
    }

    pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
  }

  if (pdf) {
    const pageWord = pages.length === 1 ? 'page' : 'pages';
    pdf.save(`design-${pages.length}-${pageWord}.pdf`);
  }
}

/** Single-canvas image export (PNG / JPEG / WebP). */
export function exportImage(canvas, format = 'png', quality = 2) {
  const dataUrl = canvas.toDataURL({ format, multiplier: quality });
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `design.${format}`;
  a.click();
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
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'design.json';
  a.click();
  URL.revokeObjectURL(url);
  return design;
}
