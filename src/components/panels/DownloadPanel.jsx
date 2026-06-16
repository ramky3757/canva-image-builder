import { exportToPDF, exportToJSON } from '../../lib/pdfExport';
import { useState } from 'react';

export default function DownloadPanel({ canvas }) {
  const [pdfQuality, setPdfQuality] = useState(2);
  const [format, setFormat] = useState('png');
  const [lastSaved, setLastSaved] = useState(null);

  const downloadImage = () => {
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({ format, multiplier: pdfQuality });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `design.${format}`;
    a.click();
  };

  const handleSaveJSON = () => {
    if (!canvas) return;
    const design = exportToJSON(canvas);
    setLastSaved(new Date().toLocaleTimeString());
    return design;
  };

  const handleExportPDF = async () => {
    if (!canvas) return;
    await exportToPDF(canvas, pdfQuality);
  };

  const copyJSONToClipboard = () => {
    if (!canvas) return;
    const json = canvas.toJSON(['id', 'name', 'selectable', 'evented']);
    const design = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      canvas: { width: canvas.getWidth(), height: canvas.getHeight() },
      ...json,
    };
    navigator.clipboard.writeText(JSON.stringify(design, null, 2));
  };

  return (
    <div className="p-3 space-y-5">
      {/* PDF Export */}
      <div className="rounded-lg bg-white border border-gray-200 p-3 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📄</span>
          <p className="text-sm font-semibold text-gray-800">Export as PDF</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Quality (resolution multiplier)</p>
          <div className="flex gap-2">
            {[1, 2, 3].map((q) => (
              <button
                key={q}
                className={`flex-1 py-1.5 rounded text-xs transition-colors ${pdfQuality === q ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setPdfQuality(q)}
              >
                {q}× {q === 1 ? '(Fast)' : q === 2 ? '(Good)' : '(Best)'}
              </button>
            ))}
          </div>
        </div>
        <button
          className="w-full py-2.5 rounded bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
          onClick={handleExportPDF}
        >
          ⬇ Download PDF
        </button>
      </div>

      {/* Image Export */}
      <div className="rounded-lg bg-white border border-gray-200 p-3 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🖼</span>
          <p className="text-sm font-semibold text-gray-800">Export as Image</p>
        </div>
        <div className="flex gap-2">
          {['png', 'jpeg', 'webp'].map((f) => (
            <button
              key={f}
              className={`flex-1 py-1.5 rounded text-xs uppercase transition-colors ${format === f ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setFormat(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          className="w-full py-2.5 rounded bg-blue-700 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          onClick={downloadImage}
        >
          ⬇ Download {format.toUpperCase()}
        </button>
      </div>

      {/* JSON */}
      <div className="rounded-lg bg-white border border-gray-200 p-3 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{ '{}'}</span>
          <p className="text-sm font-semibold text-gray-800">Save / Export JSON</p>
        </div>
        <p className="text-xs text-gray-500">
          JSON captures all objects, positions, sizes, fonts and colors — reload it later to resume editing.
        </p>
        <button
          className="w-full py-2.5 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-500 transition-colors"
          onClick={handleSaveJSON}
        >
          ⬇ Download JSON
        </button>
        <button
          className="w-full py-2 rounded bg-gray-100 text-gray-600 text-xs hover:bg-gray-200 transition-colors"
          onClick={copyJSONToClipboard}
        >
          📋 Copy JSON to Clipboard
        </button>
        {lastSaved && (
          <p className="text-xs text-green-600 text-center">Last saved at {lastSaved}</p>
        )}
      </div>

      {/* Print hint */}
      <div className="rounded-lg bg-white border border-gray-200 p-3">
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="text-gray-600 font-medium">Tip:</span> For best print quality, use PDF with 3× quality. A4 canvas (794×1123px) maps perfectly to A4 paper at 96dpi.
        </p>
      </div>
    </div>
  );
}
