import { useState } from 'react';
import { exportAllPagesToPDF, exportImage, exportToJSON } from '../../lib/pdfExport';
import { useEditorStore } from '../../store/EditorContext';

export default function DownloadPanel() {
  const { pages, getCanvas, activePageId } = useEditorStore();
  // Always read canvas at call time (avoids stale-prop null issue)
  const canvas = getCanvas(activePageId);

  const [pdfQuality, setPdfQuality] = useState(2);
  const [imgFormat, setImgFormat]   = useState('png');
  const [imgQuality, setImgQuality] = useState(2);
  const [pdfBusy, setPdfBusy]       = useState(false);
  const [pdfError, setPdfError]     = useState(null);
  const [lastSaved, setLastSaved]   = useState(null);

  const handleExportPDF = async () => {
    setPdfBusy(true);
    setPdfError(null);
    try {
      await exportAllPagesToPDF(pages, getCanvas, pdfQuality);
    } catch (err) {
      console.error('PDF export failed:', err);
      setPdfError(err?.message ?? 'Export failed — check browser console');
    } finally {
      setPdfBusy(false);
    }
  };

  const handleDownloadImage = () => {
    if (!canvas) return;
    exportImage(canvas, imgFormat, imgQuality);
  };

  const handleSaveJSON = () => {
    if (!canvas) return;
    exportToJSON(canvas);
    setLastSaved(new Date().toLocaleTimeString());
  };

  const handleCopyJSON = () => {
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

  const multiPage = pages.length > 1;

  return (
    <div className="p-3 space-y-4">

      {/* ── PDF Export ────────────────────────────────────────────── */}
      <div className="rounded-lg bg-white border border-gray-200 p-3 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📄</span>
          <div>
            <p className="text-sm font-semibold text-gray-800">Export as PDF</p>
            {multiPage && (
              <p className="text-[10px] text-violet-600">
                All {pages.length} pages will be included
              </p>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1.5">Quality</p>
          <div className="flex gap-2">
            {[1, 2, 3].map((q) => (
              <button
                key={q}
                onClick={() => setPdfQuality(q)}
                className="flex-1 py-1.5 rounded text-xs transition-colors"
                style={pdfQuality === q
                  ? { background: '#7c3aed', color: '#fff' }
                  : { background: '#f3f4f6', color: '#374151' }}
              >
                {q}× {q === 1 ? '(Fast)' : q === 2 ? '(Good)' : '(Best)'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={pdfBusy}
          className="w-full py-2.5 rounded text-sm font-medium text-white transition-colors disabled:opacity-60"
          style={{ background: pdfBusy ? '#6d28d9' : '#7c3aed' }}
        >
          {pdfBusy
            ? `⏳ Exporting ${pages.length} page${pages.length > 1 ? 's' : ''}…`
            : `⬇ Download PDF${multiPage ? ` (${pages.length} pages)` : ''}`}
        </button>

        {pdfError && (
          <div className="mt-2 rounded p-2 text-xs text-red-700 bg-red-50 border border-red-200 break-words">
            ⚠ {pdfError}
          </div>
        )}
      </div>

      {/* ── Image Export ──────────────────────────────────────────── */}
      <div className="rounded-lg bg-white border border-gray-200 p-3 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🖼</span>
          <p className="text-sm font-semibold text-gray-800">Export as Image</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1.5">Format</p>
          <div className="flex gap-2">
            {['png', 'jpeg', 'webp'].map((f) => (
              <button
                key={f}
                onClick={() => setImgFormat(f)}
                className="flex-1 py-1.5 rounded text-xs uppercase transition-colors"
                style={imgFormat === f
                  ? { background: '#7c3aed', color: '#fff' }
                  : { background: '#f3f4f6', color: '#374151' }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1.5">Quality</p>
          <div className="flex gap-2">
            {[1, 2, 3].map((q) => (
              <button
                key={q}
                onClick={() => setImgQuality(q)}
                className="flex-1 py-1.5 rounded text-xs transition-colors"
                style={imgQuality === q
                  ? { background: '#2563eb', color: '#fff' }
                  : { background: '#f3f4f6', color: '#374151' }}
              >
                {q}×
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleDownloadImage}
          disabled={!canvas}
          className="w-full py-2.5 rounded text-sm font-medium text-white transition-colors disabled:opacity-50"
          style={{ background: '#1d4ed8' }}
        >
          ⬇ Download {imgFormat.toUpperCase()} (this page)
        </button>
      </div>

      {/* ── JSON ──────────────────────────────────────────────────── */}
      <div className="rounded-lg bg-white border border-gray-200 p-3 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">&#123;&#125;</span>
          <p className="text-sm font-semibold text-gray-800">Save / Export JSON</p>
        </div>
        <p className="text-xs text-gray-500">
          Saves all objects, positions, fonts, and colors. Reload later to resume editing.
        </p>
        <button
          onClick={handleSaveJSON}
          disabled={!canvas}
          className="w-full py-2.5 rounded text-sm font-medium text-white transition-colors disabled:opacity-50"
          style={{ background: '#16a34a' }}
        >
          ⬇ Download JSON (this page)
        </button>
        <button
          onClick={handleCopyJSON}
          disabled={!canvas}
          className="w-full py-2 rounded text-xs transition-colors disabled:opacity-50"
          style={{ background: '#f3f4f6', color: '#374151' }}
        >
          📋 Copy JSON to Clipboard
        </button>
        {lastSaved && (
          <p className="text-xs text-green-600 text-center">Saved at {lastSaved}</p>
        )}
      </div>

      <div className="rounded-lg bg-white border border-gray-200 p-3">
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="font-medium text-gray-600">Tip:</span> For best print quality use PDF 3×. A4 canvas (794×1123 px) maps exactly to A4 paper at 96 dpi.
        </p>
      </div>
    </div>
  );
}
