import { useState } from 'react';
import * as fabric from 'fabric';
import { TEMPLATES } from '../../lib/templates';
import { useEditorStore } from '../../store/EditorContext';

export default function TemplatesPanel({ canvas: _canvas }) {
  const { replayingRef, snapshot, activePageId, getCanvas, pages, dispatch } = useEditorStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [applyScope, setApplyScope] = useState('this'); // 'this' | 'all'

  const categories = ['All', ...new Set(TEMPLATES.map((t) => t.category))];
  const visible = activeCategory === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory);

  /** Apply template to the currently active canvas. */
  function applyToCanvas(tpl, canvas) {
    // Preserve user-uploaded photos (not template background rects or bg images)
    const photos = canvas.getObjects().filter(
      (o) => o.type === 'image' && o.name !== '__bg__'
    );

    replayingRef.current = true;
    tpl.apply(canvas);
    if (photos.length > 0) {
      photos.forEach((img) => { canvas.add(img); canvas.bringObjectToFront(img); });
      canvas.renderAll();
    }
    replayingRef.current = false;

    const json = JSON.stringify(canvas.toJSON(['id', 'name', 'selectable', 'evented']));
    snapshot(activePageId, json);
    return json;
  }

  /** Apply template to an inactive page by running it on a temporary off-screen canvas. */
  function applyToPage(tpl, page) {
    const el = document.createElement('canvas');
    const fc = new fabric.Canvas(el, { width: page.width, height: page.height });
    tpl.apply(fc);
    const json = JSON.stringify(fc.toJSON(['id', 'name', 'selectable', 'evented']));
    dispatch({ type: 'SAVE_PAGE_JSON', pageId: page.id, json });
    fc.dispose();
  }

  const handleApply = (tpl) => {
    const canvas = getCanvas(activePageId);
    if (!canvas) return;

    applyToCanvas(tpl, canvas);

    if (applyScope === 'all') {
      pages.forEach((page) => {
        if (page.id !== activePageId) applyToPage(tpl, page);
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scope toggle */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex rounded-lg overflow-hidden border border-gray-200 text-[11px] font-medium">
          {[['this', 'This page'], ['all', 'All pages']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setApplyScope(val)}
              className="flex-1 py-1.5 transition-colors"
              style={{
                background: applyScope === val ? '#7c3aed' : '#fff',
                color: applyScope === val ? '#fff' : '#6b7280',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {applyScope === 'all' && (
          <p className="text-[10px] text-violet-600 mt-1.5 text-center">
            Template will be applied to all {pages.length} pages
          </p>
        )}
      </div>

      {/* Category pills */}
      <div className="px-3 pb-2 flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors"
            style={activeCategory === cat
              ? { background: '#7c3aed', color: '#fff' }
              : { background: '#f3f4f6', color: '#4b5563' }}
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
              onClick={() => handleApply(tpl)}
              className="group relative rounded-xl overflow-hidden border border-gray-200 hover:border-violet-500 hover:shadow-md transition-all duration-150 hover:scale-[1.03] text-left"
              title={tpl.name}
            >
              <div className="h-[72px] w-full" style={{ background: tpl.thumb }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors rounded-xl" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="bg-white/90 text-violet-700 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow">
                  {applyScope === 'all' ? 'Apply to all' : 'Apply'}
                </span>
              </div>
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

      <div className="px-3 pb-3 pt-1">
        <p className="text-[10px] text-gray-400 text-center leading-relaxed">
          Uploaded photos are kept when applying a template
        </p>
      </div>
    </div>
  );
}
