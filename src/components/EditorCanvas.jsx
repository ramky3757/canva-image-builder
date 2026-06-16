import { useEffect, useRef, useLayoutEffect } from 'react';
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
  const canvasElRef = useRef(null);
  const fabricRef = useRef(null);
  const readyRef = useRef(false);

  // Stable refs so canvas event listeners always call the latest callbacks
  // without having those callbacks in the effect dependency array (which
  // would destroy and recreate the canvas on every render cycle).
  const onCanvasReadyRef = useRef(onCanvasReady);
  const onSnapshotRef = useRef(onSnapshot);
  useLayoutEffect(() => {
    onCanvasReadyRef.current = onCanvasReady;
    onSnapshotRef.current = onSnapshot;
  });

  useEffect(() => {
    readyRef.current = false;

    if (fabricRef.current) {
      fabricRef.current.dispose();
      fabricRef.current = null;
    }

    const el = canvasElRef.current;
    if (!el) return;

    const fc = new fabric.Canvas(el, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });
    fabricRef.current = fc;

    async function initialize() {
      if (initialJson) {
        // Promise form waits for all image src data-URLs to finish loading before rendering
        await fc.loadFromJSON(initialJson);
        fc.renderAll();
      } else if (initialImageUrl) {
        const img = await fabric.FabricImage.fromURL(initialImageUrl);
        const scale = Math.min(
          (canvasSize.width * 0.9) / img.width,
          (canvasSize.height * 0.9) / img.height,
          1
        );
        img.set({
          left: (canvasSize.width - img.width * scale) / 2,
          top: (canvasSize.height - img.height * scale) / 2,
          scaleX: scale,
          scaleY: scale,
        });
        fc.add(img);
        fc.renderAll();
      }

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

  // Keyboard: delete selected object
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

  const availableW = typeof window !== 'undefined' ? window.innerWidth - 360 : 800;
  const availableH = typeof window !== 'undefined' ? window.innerHeight - 48 : 600;
  const scale = Math.min(
    (availableW - 64) / canvasSize.width,
    (availableH - 64) / canvasSize.height,
    1
  );

  return (
    <div className="flex-1 flex items-center justify-center overflow-auto p-8"
      style={{ background: 'radial-gradient(circle at 50% 50%, #e8eaf0 0%, #dde0e8 100%)' }}
    >
      <div
        style={{
          width: canvasSize.width * scale,
          height: canvasSize.height * scale,
          position: 'relative',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
          borderRadius: 2,
        }}
      >
        <div
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute' }}
        >
          <canvas ref={canvasElRef} />
        </div>
      </div>
    </div>
  );
}
