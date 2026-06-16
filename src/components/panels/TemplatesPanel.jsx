import { TEMPLATES } from '../../lib/templates';

export default function TemplatesPanel({ canvas, onCanvasSizeChange }) {
  const applyTemplate = (tpl) => {
    if (!canvas) return;

    const doApply = (c) => tpl.apply(c);

    if (canvas.getWidth() === tpl.width && canvas.getHeight() === tpl.height) {
      doApply(canvas);
    } else {
      // Signal resize; callback receives the new canvas instance
      onCanvasSizeChange(tpl.width, tpl.height, doApply);
    }
  };

  const categories = [...new Set(TEMPLATES.map((t) => t.category))];

  return (
    <div className="p-3 space-y-4">
      {categories.map((cat) => (
        <div key={cat}>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{cat}</p>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.filter((t) => t.category === cat).map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => applyTemplate(tpl)}
                className="group relative rounded-lg overflow-hidden border border-gray-300 hover:border-violet-500 transition-all hover:scale-[1.02]"
                title={`${tpl.name} — ${tpl.width}×${tpl.height}`}
              >
                <div className="h-20 w-full" style={{ background: tpl.thumb }} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end">
                  <span className="w-full text-center text-[10px] font-medium text-white bg-black/60 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {tpl.width}×{tpl.height}
                  </span>
                </div>
                <p className="text-[10px] text-gray-600 text-center py-1 bg-white border-t border-gray-200 truncate px-1">
                  {tpl.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
