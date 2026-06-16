import { useCallback, useEffect, useRef, useLayoutEffect, useState } from 'react';
import * as fabric from 'fabric';

const HISTORY_EVENTS = ['object:added', 'object:removed', 'object:modified'];

export default function EditorCanvas({
  pageId,
  initialImageUrl,
  canvasSize,
  initialJson,
  onCanvasReady,
  onSnapshot,
}) {
  const canvasElRef  = useRef(null);
  const fabricRef    = useRef(null);
  const readyRef     = useRef(false);
  const fileInputRef = useRef(null);

  const [isEmpty, setIsEmpty] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);

  const onCanvasReadyRef = useRef(onCanvasReady);
  const onSnapshotRef    = useRef(onSnapshot);
  useLayoutEffect(() => {
    onCanvasReadyRef.current = onCanvasReady;
    onSnapshotRef.current    = onSnapshot;
  });

  // ── canvas lifecycle ────────────────────────────────────────────────────────
  useEffect(() => {
    readyRef.current = false;

    if (fabricRef.current) {
      fabricRef.current.dispose();
      fabricRef.current = null;
    }

    const el = canvasElRef.current;
    if (!el) return;

    const fc = new fabric.Canvas(el, {
      width:  canvasSize.width,
      height: canvasSize.height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });
    fabricRef.current = fc;

    // Track empty state from canvas events (set up before initialize so
    // object:added events from loadFromJSON are captured immediately)
    const checkEmpty = () => setIsEmpty(fc.getObjects().length === 0);
    fc.on('object:added',   checkEmpty);
    fc.on('object:removed', checkEmpty);

    async function initialize() {
      if (initialJson) {
        await fc.loadFromJSON(initialJson);
        fc.renderAll();
      } else if (initialImageUrl) {
        const img = await fabric.FabricImage.fromURL(initialImageUrl);
        const scale = Math.min(
          (canvasSize.width  * 0.9) / img.width,
          (canvasSize.height * 0.9) / img.height,
          1
        );
        img.set({
          left: (canvasSize.width  - img.width  * scale) / 2,
          top:  (canvasSize.height - img.height * scale) / 2,
          scaleX: scale,
          scaleY: scale,
        });
        fc.add(img);
        fc.renderAll();
      }

      // Sync empty state after initialization completes
      setIsEmpty(fc.getObjects().length === 0);

      readyRef.current = true;
      onCanvasReadyRef.current(pageId, fc);

      HISTORY_EVENTS.forEach((event) => {
        fc.on(event, () => {
          if (!readyRef.current) return;
          const json = JSON.stringify(fc.toJSON(['id', 'name', 'selectable', 'evented']));
          onSnapshotRef.current?.(json);
        });
      });
    }

    initialize();

    return () => {
      readyRef.current = false;
      fc.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId, initialImageUrl, canvasSize.width, canvasSize.height, initialJson]);

  // ── keyboard delete ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        !['INPUT', 'TEXTAREA'].includes(e.target.tagName) &&
        fabricRef.current
      ) {
        const obj = fabricRef.current.getActiveObject();
        if (obj && !obj.isEditing) {
          fabricRef.current.remove(obj);
          fabricRef.current.renderAll();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── overlay image upload ────────────────────────────────────────────────────
  const addImageFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const fc = fabricRef.current;
      if (!fc) return;
      const img = await fabric.FabricImage.fromURL(e.target.result);
      const scale = Math.min(
        (fc.getWidth()  * 0.9) / img.width,
        (fc.getHeight() * 0.9) / img.height,
        1
      );
      img.set({
        left: (fc.getWidth()  - img.width  * scale) / 2,
        top:  (fc.getHeight() - img.height * scale) / 2,
        scaleX: scale,
        scaleY: scale,
      });
      fc.add(img);
      fc.renderAll();
    };
    reader.readAsDataURL(file);
  }, []);

  // ── scale to fit screen ─────────────────────────────────────────────────────
  const availableW = typeof window !== 'undefined' ? window.innerWidth  - 360 : 800;
  const availableH = typeof window !== 'undefined' ? window.innerHeight -  48 : 600;
  const scale = Math.min(
    (availableW - 64) / canvasSize.width,
    (availableH - 64) / canvasSize.height,
    1
  );

  return (
    <div
      className="flex-1 flex items-center justify-center overflow-auto p-8"
      style={{ background: 'radial-gradient(circle at 50% 50%, #e8eaf0 0%, #dde0e8 100%)' }}
      /* Whole-canvas drag-drop (fires even outside the center prompt) */
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) addImageFile(file);
      }}
    >
      <div
        style={{
          width:    canvasSize.width  * scale,
          height:   canvasSize.height * scale,
          position: 'relative',
          boxShadow: isDragOver
            ? '0 0 0 3px #7c3aed, 0 4px 24px rgba(124,58,237,0.3)'
            : '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
          borderRadius: 2,
          transition: 'box-shadow 0.15s',
        }}
      >
        {/* Scaled fabric canvas */}
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute' }}>
          <canvas ref={canvasElRef} />
        </div>

        {/* Empty-page upload overlay — shown until the first object is added.
            pointer-events:none on the wrapper lets users still click the canvas bg;
            only the label card is interactive. */}
        {isEmpty && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ pointerEvents: 'none' }}
          >
            <label
              className="pointer-events-auto cursor-pointer flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-8 py-6 transition-all select-none"
              style={{
                background:   isDragOver ? 'rgba(237,233,254,0.97)' : 'rgba(255,255,255,0.92)',
                borderColor:  isDragOver ? '#7c3aed' : '#c4b5fd',
              }}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file) addImageFile(file);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) addImageFile(f); }}
              />
              <span className="text-4xl">🖼️</span>
              <div className="text-center">
                <p className="text-sm font-semibold text-violet-700">Add a photo</p>
                <p className="text-xs text-gray-400 mt-0.5">Click or drag &amp; drop</p>
              </div>
              <p className="text-[10px] text-gray-400">
                Or pick a template from the left panel
              </p>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
