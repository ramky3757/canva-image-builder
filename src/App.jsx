import { useState, useCallback, useEffect } from 'react';
import UploadZone from './components/UploadZone';
import EditorCanvas from './components/EditorCanvas';
import LeftNav from './components/LeftNav';
import PanelContainer from './components/PanelContainer';
import Toolbar from './components/Toolbar';
import PageStrip from './components/PageStrip';
import { useEditor } from './store/useEditor';

export default function App() {
  const [started, setStarted] = useState(false);
  const [initialImageUrl, setInitialImageUrl] = useState(null);

  const {
    activePage,
    activePageId,
    activePanel,
    setActivePanel,
    setCanvasSize,
    undoActive,
    redoActive,
    snapshot,
    getCanvas,
    registerCanvas,
    pendingJsonRef,
    replayingRef,
  } = useEditor();

  const handleUpload = (dataUrl, preset) => {
    if (preset) setCanvasSize(preset.width, preset.height);
    setInitialImageUrl(dataUrl || null);
    setStarted(true);
  };

  const handleReset = () => {
    setStarted(false);
    setInitialImageUrl(null);
  };

  const handleCanvasReady = useCallback(
    (pageId, fabricCanvas) => {
      registerCanvas(pageId, fabricCanvas);
      if (pendingJsonRef.current) {
        pendingJsonRef.current(fabricCanvas);
        pendingJsonRef.current = null;
      }
    },
    [registerCanvas, pendingJsonRef]
  );

  // onSnapshot is called by EditorCanvas after each object:added/removed/modified.
  // We check replayingRef to avoid creating spurious history entries during undo/redo.
  const handleSnapshot = useCallback(
    (json) => {
      if (replayingRef.current) return;
      snapshot(activePageId, json);
    },
    [snapshot, activePageId, replayingRef]
  );

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undoActive(); }
      if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); redoActive(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undoActive, redoActive]);

  if (!started) return <UploadZone onUpload={handleUpload} />;

  const canvas = getCanvas(activePageId);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#f0f2f5' }}>
      <Toolbar
        canvasSize={{ width: activePage?.width ?? 800, height: activePage?.height ?? 600 }}
        onReset={handleReset}
        onCanvasSizeChange={setCanvasSize}
        onUndo={undoActive}
        onRedo={redoActive}
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav active={activePanel} onSelect={setActivePanel} />
        <PanelContainer
          active={activePanel}
          canvas={canvas}
          onCanvasSizeChange={setCanvasSize}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          {activePage && (
            <EditorCanvas
              key={activePage.id}
              pageId={activePage.id}
              initialImageUrl={initialImageUrl}
              canvasSize={{ width: activePage.width, height: activePage.height }}
              initialJson={activePage.json}
              onCanvasReady={handleCanvasReady}
              onSnapshot={handleSnapshot}
            />
          )}
          <PageStrip />
        </div>
      </div>
    </div>
  );
}
