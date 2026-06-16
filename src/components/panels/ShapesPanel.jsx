import { useState } from 'react';
import * as fabric from 'fabric';

const COLORS = [
  '#ffffff','#000000','#ef4444','#f97316','#eab308',
  '#22c55e','#3b82f6','#8b5cf6','#ec4899','#14b8a6',
];

const SHAPES = [
  { type: 'rect',     icon: '▬', label: 'Rectangle' },
  { type: 'circle',   icon: '●', label: 'Circle' },
  { type: 'triangle', icon: '▲', label: 'Triangle' },
  { type: 'line',     icon: '─', label: 'Line' },
  { type: 'star',     icon: '★', label: 'Star' },
  { type: 'arrow',    icon: '→', label: 'Arrow' },
];

function makeStar(canvas, fill) {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 80 : 36;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    points.push({ x: 100 + r * Math.cos(angle), y: 100 + r * Math.sin(angle) });
  }
  const star = new fabric.Polygon(points, { left: 150, top: 150, fill, selectable: true });
  canvas.add(star);
  canvas.setActiveObject(star);
  canvas.renderAll();
}

export default function ShapesPanel({ canvas }) {
  const [fill, setFill] = useState('#8b5cf6');
  const [stroke, setStroke] = useState('transparent');
  const [strokeW, setStrokeW] = useState(2);

  const addShape = (type) => {
    if (!canvas) return;
    const opts = { left: 150, top: 150, fill, stroke, strokeWidth: strokeW };

    if (type === 'star') { makeStar(canvas, fill); return; }
    if (type === 'arrow') {
      const arrow = new fabric.Path('M 0 20 L 80 20 L 80 10 L 100 30 L 80 50 L 80 40 L 0 40 Z', {
        left: 150, top: 150, fill, ...opts,
      });
      canvas.add(arrow); canvas.setActiveObject(arrow); canvas.renderAll(); return;
    }

    let shape;
    if (type === 'rect')     shape = new fabric.Rect({ ...opts, width: 160, height: 100 });
    if (type === 'circle')   shape = new fabric.Circle({ ...opts, radius: 70 });
    if (type === 'triangle') shape = new fabric.Triangle({ ...opts, width: 130, height: 110 });
    if (type === 'line')     shape = new fabric.Line([0, 0, 200, 0], { left: 150, top: 150, stroke: fill, strokeWidth: strokeW + 2 });

    if (shape) { canvas.add(shape); canvas.setActiveObject(shape); canvas.renderAll(); }
  };

  return (
    <div className="p-3 space-y-4">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Shapes</p>
        <div className="grid grid-cols-3 gap-2">
          {SHAPES.map((s) => (
            <button
              key={s.type}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-100 hover:bg-purple-800 text-gray-600 hover:text-white text-xs transition-colors"
              onClick={() => addShape(s.type)}
            >
              <span className="text-2xl">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Fill Color</p>
        <div className="grid grid-cols-5 gap-1 mb-2">
          {COLORS.map((c) => (
            <button
              key={c}
              className={`w-8 h-8 rounded border-2 transition-all ${fill === c ? 'border-violet-400 scale-[1.1]' : 'border-transparent hover:border-gray-400'}`}
              style={{ background: c }}
              onClick={() => {
                setFill(c);
                const obj = canvas?.getActiveObject();
                if (obj) { obj.set('fill', c); canvas.renderAll(); }
              }}
            />
          ))}
        </div>
        <input
          type="color" value={fill}
          className="w-full h-8 rounded cursor-pointer bg-gray-100 border border-gray-300"
          onChange={(e) => {
            setFill(e.target.value);
            const obj = canvas?.getActiveObject();
            if (obj) { obj.set('fill', e.target.value); canvas.renderAll(); }
          }}
        />
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Stroke — {strokeW}px</p>
        <div className="flex gap-2 items-center mb-1">
          <input
            type="range" min="0" max="20" value={strokeW}
            className="flex-1 accent-violet-500"
            onChange={(e) => {
              setStrokeW(Number(e.target.value));
              const obj = canvas?.getActiveObject();
              if (obj) { obj.set('strokeWidth', Number(e.target.value)); canvas.renderAll(); }
            }}
          />
          <span className="text-xs text-gray-400 w-6">{strokeW}</span>
        </div>
        <input
          type="color" value={stroke === 'transparent' ? '#000000' : stroke}
          className="w-full h-8 rounded cursor-pointer bg-gray-100 border border-gray-300"
          onChange={(e) => {
            setStroke(e.target.value);
            const obj = canvas?.getActiveObject();
            if (obj) { obj.set('stroke', e.target.value); canvas.renderAll(); }
          }}
        />
      </div>
    </div>
  );
}
