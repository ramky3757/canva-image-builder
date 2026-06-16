import { useState } from 'react';
import * as fabric from 'fabric';

const SOLID_COLORS = [
  '#ffffff','#f8fafc','#f1f5f9','#e2e8f0',
  '#000000','#0f172a','#1e293b','#334155',
  '#ef4444','#dc2626','#b91c1c','#991b1b',
  '#f97316','#ea580c','#c2410c','#9a3412',
  '#eab308','#ca8a04','#a16207','#854d0e',
  '#22c55e','#16a34a','#15803d','#166534',
  '#3b82f6','#2563eb','#1d4ed8','#1e40af',
  '#8b5cf6','#7c3aed','#6d28d9','#5b21b6',
  '#ec4899','#db2777','#be185d','#9d174d',
  '#14b8a6','#0d9488','#0f766e','#115e59',
];

const GRADIENTS = [
  { name: 'Sunset',   colors: ['#f97316','#ec4899'] },
  { name: 'Ocean',    colors: ['#3b82f6','#14b8a6'] },
  { name: 'Purple',   colors: ['#7c3aed','#ec4899'] },
  { name: 'Forest',   colors: ['#15803d','#3b82f6'] },
  { name: 'Fire',     colors: ['#dc2626','#f97316'] },
  { name: 'Night',    colors: ['#0f172a','#312e81'] },
  { name: 'Rose',     colors: ['#be185d','#fb923c'] },
  { name: 'Arctic',   colors: ['#0ea5e9','#a5f3fc'] },
  { name: 'Midnight', colors: ['#1e1b4b','#312e81'] },
  { name: 'Lemon',    colors: ['#ca8a04','#84cc16'] },
];

export default function BackgroundPanel({ canvas }) {
  const [bgColor, setBgColor] = useState('#1a1a1a');
  const [bgUrl, setBgUrl] = useState('');

  const setSolid = (c) => {
    if (!canvas) return;
    setBgColor(c);
    canvas.set('backgroundColor', c);
    canvas.renderAll();
  };

  const setGradient = (colors) => {
    if (!canvas) return;
    const g = new fabric.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: canvas.getWidth(), y2: canvas.getHeight() },
      colorStops: [{ offset: 0, color: colors[0] }, { offset: 1, color: colors[1] }],
    });
    canvas.set('backgroundColor', g);
    canvas.renderAll();
  };

  const setImageBg = () => {
    const url = bgUrl.trim();
    if (!url || !canvas) return;
    fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' }).then((img) => {
      img.scaleToWidth(canvas.getWidth());
      img.scaleToHeight(canvas.getHeight());
      img.set({ left: 0, top: 0, selectable: false, evented: false, name: '__bg__' });
      const existing = canvas.getObjects().find((o) => o.name === '__bg__');
      if (existing) canvas.remove(existing);
      canvas.insertAt(0, img);
      canvas.renderAll();
    });
  };

  return (
    <div className="p-3 space-y-4">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Solid Color</p>
        <div className="grid grid-cols-4 gap-1 mb-2">
          {SOLID_COLORS.map((c) => (
            <button
              key={c}
              className={`h-8 rounded border-2 transition-all ${bgColor === c ? 'border-violet-400 scale-105' : 'border-gray-300 hover:border-gray-400'}`}
              style={{ background: c }}
              onClick={() => setSolid(c)}
            />
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="color" value={bgColor}
            className="h-8 w-14 rounded cursor-pointer bg-gray-100 border border-gray-300"
            onChange={(e) => setSolid(e.target.value)}
          />
          <span className="text-xs text-gray-400 font-mono">{bgColor}</span>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Gradients</p>
        <div className="grid grid-cols-2 gap-2">
          {GRADIENTS.map((g) => (
            <button
              key={g.name}
              className="h-14 rounded-lg text-xs font-semibold text-white shadow hover:scale-105 transition-transform border border-white/10"
              style={{ background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})` }}
              onClick={() => setGradient(g.colors)}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Image URL as Background</p>
        <input
          value={bgUrl}
          onChange={(e) => setBgUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setImageBg()}
          className="w-full bg-gray-100 text-gray-800 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 ring-violet-500 mb-2"
          placeholder="https://..."
        />
        <button
          className="w-full py-2 rounded bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors"
          onClick={setImageBg}
        >
          Set as Background
        </button>
      </div>
    </div>
  );
}
