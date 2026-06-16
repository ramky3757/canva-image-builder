import { useState, useEffect } from 'react';
import * as fabric from 'fabric';

const BRUSH_COLORS = [
  '#ffffff','#000000','#ef4444','#f97316','#eab308',
  '#22c55e','#3b82f6','#8b5cf6','#ec4899','#14b8a6',
];

export default function DrawPanel({ canvas }) {
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [width, setWidth] = useState(8);
  const [mode, setMode] = useState('pencil'); // pencil | eraser

  useEffect(() => {
    if (!canvas) return;
    if (drawing) {
      canvas.isDrawingMode = true;
      if (mode === 'eraser') {
        const brush = new fabric.PencilBrush(canvas);
        brush.color = canvas.backgroundColor || '#1a1a1a';
        brush.width = width * 3;
        canvas.freeDrawingBrush = brush;
      } else {
        const brush = new fabric.PencilBrush(canvas);
        brush.color = color;
        brush.width = width;
        canvas.freeDrawingBrush = brush;
      }
    } else {
      canvas.isDrawingMode = false;
    }
  }, [drawing, color, width, mode, canvas]);

  // cleanup on unmount
  useEffect(() => () => { if (canvas) canvas.isDrawingMode = false; }, [canvas]);

  const clearDrawings = () => {
    if (!canvas) return;
    const paths = canvas.getObjects('path');
    paths.forEach((p) => canvas.remove(p));
    canvas.renderAll();
  };

  return (
    <div className="p-3 space-y-4">
      <div className="flex gap-2">
        <button
          className={`flex-1 py-2 rounded text-sm transition-colors ${drawing ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          onClick={() => setDrawing(!drawing)}
        >
          {drawing ? '⏹ Stop Drawing' : '✏️ Start Drawing'}
        </button>
      </div>

      <div className="flex gap-2">
        {['pencil','eraser'].map((m) => (
          <button
            key={m}
            className={`flex-1 py-1.5 rounded text-xs transition-colors capitalize ${mode === m ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setMode(m)}
          >
            {m === 'pencil' ? '✏️' : '◻'} {m}
          </button>
        ))}
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Brush Size — {width}px</p>
        <input
          type="range" min="1" max="80" value={width}
          className="w-full accent-violet-500"
          onChange={(e) => setWidth(Number(e.target.value))}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Fine</span><span>Thick</span>
        </div>
      </div>

      {mode === 'pencil' && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Color</p>
          <div className="grid grid-cols-5 gap-1 mb-2">
            {BRUSH_COLORS.map((c) => (
              <button
                key={c}
                className={`w-8 h-8 rounded border-2 transition-colors ${color === c ? 'border-violet-400' : 'border-transparent hover:border-gray-400'}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <input
            type="color" value={color}
            className="w-full h-8 rounded cursor-pointer bg-gray-100 border border-gray-300"
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
      )}

      <button
        className="w-full py-2 rounded bg-red-50 text-red-600 text-xs hover:bg-red-100 border border-red-200 transition-colors"
        onClick={clearDrawings}
      >
        Clear All Drawings
      </button>

      {drawing && (
        <div className="rounded bg-violet-50 border border-violet-200 p-2 text-xs text-violet-700">
          Drawing mode active — click Stop when done to select/move objects again.
        </div>
      )}
    </div>
  );
}
