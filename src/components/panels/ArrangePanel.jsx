import { useEditorStore } from '../../store/EditorContext';

export default function ArrangePanel({ canvas }) {
  const { pages, activePageId, dispatch } = useEditorStore();

  const get = () => canvas?.getActiveObject();

  const bringForward  = () => { const o = get(); if (o) { canvas.bringObjectForward(o); canvas.renderAll(); } };
  const sendBackward  = () => { const o = get(); if (o) { canvas.sendObjectBackwards(o); canvas.renderAll(); } };
  const bringToFront  = () => { const o = get(); if (o) { canvas.bringObjectToFront(o); canvas.renderAll(); } };
  const sendToBack    = () => { const o = get(); if (o) { canvas.sendObjectToBack(o); canvas.renderAll(); } };
  const deleteObj     = () => { const o = get(); if (o) { canvas.remove(o); canvas.renderAll(); } };

  const duplicateObj = () => {
    const o = get();
    if (!o) return;
    o.clone().then((clone) => {
      clone.set({ left: o.left + 20, top: o.top + 20 });
      canvas.add(clone);
      canvas.setActiveObject(clone);
      canvas.renderAll();
    });
  };

  const flipH = () => { const o = get(); if (o) { o.set('flipX', !o.flipX); canvas.renderAll(); } };
  const flipV = () => { const o = get(); if (o) { o.set('flipY', !o.flipY); canvas.renderAll(); } };

  const setRotation = (v) => { const o = get(); if (o) { o.set('angle', v); canvas.renderAll(); } };
  const setOpacity  = (v) => { const o = get(); if (o) { o.set('opacity', v / 100); canvas.renderAll(); } };

  const align = (dir) => {
    const o = get();
    if (!o || !canvas) return;
    const w = canvas.getWidth(), h = canvas.getHeight();
    const bw = o.getScaledWidth(), bh = o.getScaledHeight();
    if (dir === 'left')   o.set({ left: 0 });
    if (dir === 'right')  o.set({ left: w - bw });
    if (dir === 'top')    o.set({ top: 0 });
    if (dir === 'bottom') o.set({ top: h - bh });
    if (dir === 'cx')     o.set({ left: (w - bw) / 2 });
    if (dir === 'cy')     o.set({ top: (h - bh) / 2 });
    canvas.renderAll();
  };

  const copyToPage = (targetPageId) => {
    const o = get();
    if (!o || !canvas) return;
    o.clone().then((clone) => {
      const cloneData = clone.toObject(['id', 'name', 'selectable', 'evented']);
      const targetPage = pages.find((p) => p.id === targetPageId);
      // Parse existing JSON or start fresh
      const base = targetPage?.json
        ? JSON.parse(targetPage.json)
        : { version: '6.0.0', objects: [], background: '#1a1a1a' };
      base.objects.push(cloneData);
      dispatch({ type: 'SAVE_PAGE_JSON', pageId: targetPageId, json: JSON.stringify(base) });
    });
  };

  const btn = 'py-1.5 rounded bg-gray-100 text-gray-600 text-xs hover:bg-gray-200 transition-colors';
  const otherPages = pages.filter((p) => p.id !== activePageId);

  return (
    <div className="p-3 space-y-4">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Layer Order</p>
        <div className="grid grid-cols-2 gap-1.5">
          <button className={btn} onClick={bringToFront}>Bring to Front</button>
          <button className={btn} onClick={sendToBack}>Send to Back</button>
          <button className={btn} onClick={bringForward}>Forward ↑</button>
          <button className={btn} onClick={sendBackward}>Backward ↓</button>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Align on Canvas</p>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: '⬅ Left',   dir: 'left' },
            { label: '↔ Center', dir: 'cx' },
            { label: 'Right ➡', dir: 'right' },
            { label: '⬆ Top',    dir: 'top' },
            { label: '↕ Middle', dir: 'cy' },
            { label: 'Bottom ⬇', dir: 'bottom' },
          ].map(({ label, dir }) => (
            <button key={dir} className={btn} onClick={() => align(dir)}>{label}</button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Flip</p>
        <div className="grid grid-cols-2 gap-1.5">
          <button className={btn} onClick={flipH}>Flip Horizontal</button>
          <button className={btn} onClick={flipV}>Flip Vertical</button>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">Rotation</p>
        <input
          type="range" min="-180" max="180" defaultValue="0"
          className="w-full accent-violet-500"
          onChange={(e) => setRotation(Number(e.target.value))}
        />
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">Opacity</p>
        <input
          type="range" min="0" max="100" defaultValue="100"
          className="w-full accent-violet-500"
          onChange={(e) => setOpacity(Number(e.target.value))}
        />
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Actions</p>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            className="py-1.5 rounded bg-blue-50 text-blue-600 text-xs hover:bg-blue-100 border border-blue-200 transition-colors"
            onClick={duplicateObj}
          >
            Duplicate
          </button>
          <button
            className="py-1.5 rounded bg-red-50 text-red-600 text-xs hover:bg-red-100 border border-red-200 transition-colors"
            onClick={deleteObj}
          >
            Delete
          </button>
        </div>
      </div>

      {otherPages.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Copy to Page</p>
          <div className="flex flex-col gap-1">
            {otherPages.map((page) => (
              <button
                key={page.id}
                className="py-1.5 rounded bg-gray-100 text-gray-600 text-xs hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 border border-gray-200 transition-colors text-left px-2"
                onClick={() => copyToPage(page.id)}
                title={`Copy selected element to ${page.name}`}
              >
                → {page.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
