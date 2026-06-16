import { useState } from 'react';

const PALETTE = [
  // Row 1: neutrals
  '#ffffff','#f3f4f6','#d1d5db','#9ca3af','#6b7280','#4b5563','#374151','#1f2937','#111827','#000000',
  // Row 2: reds/oranges
  '#fef2f2','#fecaca','#f87171','#ef4444','#dc2626','#b91c1c','#991b1b','#7f1d1d',
  '#fff7ed','#fed7aa','#fb923c','#f97316','#ea580c','#c2410c',
  // Row 3: yellows/greens
  '#fefce8','#fef08a','#facc15','#eab308','#ca8a04','#a16207',
  '#f0fdf4','#bbf7d0','#4ade80','#22c55e','#16a34a','#15803d','#166534',
  // Row 4: blues/purples
  '#eff6ff','#bfdbfe','#60a5fa','#3b82f6','#2563eb','#1d4ed8','#1e40af',
  '#f5f3ff','#ddd6fe','#a78bfa','#8b5cf6','#7c3aed','#6d28d9','#4c1d95',
  // Row 5: pinks/teals
  '#fdf2f8','#fbcfe8','#f472b6','#ec4899','#db2777','#be185d',
  '#f0fdfa','#99f6e4','#2dd4bf','#14b8a6','#0d9488','#0f766e',
];

export default function ColorsPanel({ canvas }) {
  const [fillColor, setFillColor] = useState('#8b5cf6');
  const [strokeColor, setStrokeColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(100);

  const applyFill = (c) => {
    setFillColor(c);
    const obj = canvas?.getActiveObject();
    if (obj) { obj.set('fill', c); canvas.renderAll(); }
  };

  const applyStroke = (c) => {
    setStrokeColor(c);
    const obj = canvas?.getActiveObject();
    if (obj) { obj.set('stroke', c); canvas.renderAll(); }
  };

  const applyOpacity = (v) => {
    setOpacity(v);
    const obj = canvas?.getActiveObject();
    if (obj) { obj.set('opacity', v / 100); canvas.renderAll(); }
  };

  return (
    <div className="p-3 space-y-4">
      <p className="text-xs text-gray-500 uppercase tracking-wider">Select an object first</p>

      <div>
        <p className="text-xs text-gray-500 mb-2">Fill Color</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {PALETTE.map((c) => (
            <button
              key={c}
              className={`w-6 h-6 rounded-sm border transition-all ${fillColor === c ? 'border-violet-400 scale-125 z-10 relative' : 'border-gray-300 hover:border-gray-400'}`}
              style={{ background: c }}
              onClick={() => applyFill(c)}
            />
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="color" value={fillColor}
            className="h-8 w-14 rounded cursor-pointer bg-gray-100 border border-gray-300"
            onChange={(e) => applyFill(e.target.value)}
          />
          <span className="text-xs text-gray-400 font-mono">{fillColor.toUpperCase()}</span>
          <button
            className="ml-auto text-xs text-gray-500 hover:text-gray-600"
            onClick={() => applyFill('transparent')}
          >No fill</button>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-2">Stroke / Border Color</p>
        <div className="flex gap-2 items-center">
          <input
            type="color" value={strokeColor}
            className="h-8 w-14 rounded cursor-pointer bg-gray-100 border border-gray-300"
            onChange={(e) => applyStroke(e.target.value)}
          />
          <span className="text-xs text-gray-400 font-mono">{strokeColor.toUpperCase()}</span>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">Opacity — {opacity}%</p>
        <input
          type="range" min="0" max="100" value={opacity}
          className="w-full accent-violet-500"
          onChange={(e) => applyOpacity(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
