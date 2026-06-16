/**
 * EditorLayout — lazy-loaded editor shell.
 *
 * This module is the code-split boundary: every import here (and anything it
 * transitively imports, including Fabric.js and the template library) lands in
 * a separate async chunk.  The login page and upload zone load instantly;
 * this chunk is only fetched after the user starts a design session.
 */
import { useCallback, useEffect } from 'react';
import Toolbar from './Toolbar';
import LeftNav from './LeftNav';
import PanelContainer from './PanelContainer';
import EditorCanvas from './EditorCanvas';
import PageStrip from './PageStrip';
import { useEditor } from '../store/useEditor';

export default function EditorLayout({ initialImageUrl, onReset }) {
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

  const canvas = getCanvas(activePageId);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#f0f2f5' }}>
      <Toolbar
        canvasSize={{ width: activePage?.width ?? 800, height: activePage?.height ?? 600 }}
        onReset={onReset}
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
