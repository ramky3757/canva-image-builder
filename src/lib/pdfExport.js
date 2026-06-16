import * as fabric from 'fabric';
import { jsPDF } from 'jspdf';

function canvasToDataUrl(canvas, quality) {
  return canvas.toDataURL({ format: 'png', multiplier: quality });
}

async function pageJsonToDataUrl(pageJson, width, height, quality) {
  const el = document.createElement('canvas');
  el.width = width;
  el.height = height;
  // Append to DOM so Fabric has a proper rendering context
  el.style.cssText = 'position:fixed;left:-9999px;top:-9999px;visibility:hidden';
  document.body.appendChild(el);

  try {
    const fc = new fabric.Canvas(el, { width, height, renderOnAddRemove: false });
    const json = typeof pageJson === 'string' ? JSON.parse(pageJson) : pageJson;
    await fc.loadFromJSON(json);
    fc.renderAll();
    const dataUrl = fc.toDataURL({ format: 'png', multiplier: quality });
    fc.dispose();
    return dataUrl;
  } finally {
    document.body.removeChild(el);
  }
}

function blankDataUrl(width, height) {
  const el = document.createElement('canvas');
  el.width = width;
  el.height = height;
  const ctx = el.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  return el.toDataURL('image/png');
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export async function exportAllPagesToPDF(pages, getCanvas, quality = 2) {
  if (!pages.length) throw new Error('No pages to export');

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
    const blob = pdf.output('blob');
    triggerDownload(blob, filename);
  }
}

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
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'design.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return design;
}
