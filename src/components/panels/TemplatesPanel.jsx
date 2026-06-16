import { useState } from 'react';
import { TEMPLATES } from '../../lib/templates';
import { useEditorStore } from '../../store/EditorContext';

export default function TemplatesPanel({ canvas }) {
  const { replayingRef, snapshot, activePageId, getCanvas } = useEditorStore();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(TEMPLATES.map((t) => t.category))];

  const visible =
    activeCategory === 'All'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory);

  const applyTemplate = (tpl) => {
    // Always read the canvas from the store at click time — the prop passed
    // from App.jsx may be stale (null) because canvas registration happens
    // inside a useEffect and doesn't trigger a React re-render.
    const canvas = getCanvas(activePageId);
    if (!canvas) return;

    // Collect any user-uploaded images so we can restore them after the
    // template clears the canvas.  Background images (name '__bg__') are
    // intentionally excluded — the template replaces the background.
    const photos = canvas
      .getObjects()
      .filter((o) => o.type === 'image' && o.name !== '__bg__');

    // Suppress per-object history events while we rebuild the canvas
    replayingRef.current = true;

    tpl.apply(canvas);

    // Re-add saved photos on top of the template artwork
    if (photos.length > 0) {
      photos.forEach((img) => {
        canvas.add(img);
        canvas.bringObjectToFront(img);
      });
      canvas.renderAll();
    }

    replayingRef.current = false;

    // Record the entire template application as a single undo step
    const json = JSON.stringify(canvas.toJSON(['id', 'name', 'selectable', 'evented']));
    snapshot(activePageId, json);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Category pills */}
      <div className="px-3 pt-3 pb-2 flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors ${
              activeCategory === cat
                ? 'bg-violet-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="grid grid-cols-2 gap-2">
          {visible.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => applyTemplate(tpl)}
              className="group relative rounded-xl overflow-hidden border border-gray-200 hover:border-violet-500 hover:shadow-md transition-all duration-150 hover:scale-[1.03] text-left"
              title={tpl.name}
            >
              {/* Thumbnail */}
              <div
                className="h-[72px] w-full"
                style={{ background: tpl.thumb }}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors rounded-xl" />

              {/* Apply label on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="bg-white/90 text-violet-700 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow">
                  Apply
                </span>
              </div>

              {/* Template name */}
              <p className="text-[10px] text-gray-600 text-center py-1.5 bg-white border-t border-gray-100 truncate px-1 font-medium">
                {tpl.name}
              </p>
            </button>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="text-center text-xs text-gray-400 pt-8">No templates in this category.</p>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-3 pb-3 pt-1">
        <p className="text-[10px] text-gray-400 text-center leading-relaxed">
          Uploaded photos are kept when applying a template
        </p>
      </div>
    </div>
  );
}
