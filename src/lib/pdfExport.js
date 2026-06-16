import { jsPDF } from 'jspdf';

export async function exportToPDF(canvas, multiplier = 2) {
  const dataUrl = canvas.toDataURL({ format: 'png', multiplier });
  const width = canvas.getWidth();
  const height = canvas.getHeight();

  const orientation = width > height ? 'landscape' : 'portrait';
  const pdf = new jsPDF({ orientation, unit: 'px', format: [width, height] });

  pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
  pdf.save('design.pdf');
}

export function exportToJSON(canvas) {
  const json = canvas.toJSON(['id', 'name', 'selectable', 'evented']);
  const design = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    canvas: {
      width: canvas.getWidth(),
      height: canvas.getHeight(),
    },
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

export function loadFromJSON(canvas, json) {
  return new Promise((resolve) => {
    canvas.loadFromJSON(json, () => {
      canvas.renderAll();
      resolve();
    });
  });
}
