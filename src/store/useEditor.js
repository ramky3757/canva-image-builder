import { useCallback } from 'react';
import { useEditorStore } from './EditorContext';

export function useEditor() {
  const store = useEditorStore();
  const { dispatch, activePageId, activePanel, getCanvas, pendingJsonRef } = store;

  const setActivePanel = useCallback(
    (panel) =>
      dispatch({ type: 'SET_ACTIVE_PANEL', panel: activePanel === panel ? null : panel }),
    [dispatch, activePanel]
  );

  const setCanvasSize = useCallback(
    (width, height, afterResizeFn) => {
      if (afterResizeFn) {
        // Template loading: afterResizeFn clears and redraws
        pendingJsonRef.current = afterResizeFn;
      } else {
        // Toolbar preset: save JSON to store (so EditorCanvas initialises from it),
        // then pendingJsonRef only needs to scale the already-loaded objects.
        const canvas = getCanvas(activePageId);
        if (canvas) {
          const oldW = canvas.getWidth();
          const oldH = canvas.getHeight();
          const json = JSON.stringify(canvas.toJSON(['id', 'name', 'selectable', 'evented']));
          // Persist so initialJson prop is set when EditorCanvas re-mounts
          dispatch({ type: 'SAVE_PAGE_JSON', pageId: activePageId, json });
          // After the new canvas initialises and objects are restored, scale them
          pendingJsonRef.current = (newCanvas) => {
            const newW = newCanvas.getWidth();
            const newH = newCanvas.getHeight();
            const ratioX = newW / oldW;
            const ratioY = newH / oldH;
            const uniformScale = Math.min(ratioX, ratioY);
            newCanvas.getObjects().forEach((obj) => {
              if (obj.name === '__tpl_bg__') {
                // Background rect must always fill the full canvas after resize
                obj.set({
                  left: 0, top: 0,
                  scaleX: newW / (obj.width || 1),
                  scaleY: newH / (obj.height || 1),
                });
              } else {
                obj.set({
                  left: obj.left * ratioX,
                  top: obj.top * ratioY,
                  scaleX: (obj.scaleX || 1) * uniformScale,
                  scaleY: (obj.scaleY || 1) * uniformScale,
                });
              }
              obj.setCoords();
            });
            newCanvas.renderAll();
          };
        }
      }
      dispatch({ type: 'SET_PAGE_SIZE', width, height });
    },
    [dispatch, pendingJsonRef, getCanvas, activePageId]
  );

  const addPage = useCallback(
    (width, height) => dispatch({ type: 'ADD_PAGE', width, height }),
    [dispatch]
  );

  const removePage = useCallback(
    (pageId) => dispatch({ type: 'REMOVE_PAGE', pageId }),
    [dispatch]
  );

  const duplicatePage = useCallback(
    (pageId) => {
      const canvas = getCanvas(pageId);
      let json = null;
      if (canvas) {
        json = JSON.stringify(canvas.toJSON(['id', 'name', 'selectable', 'evented']));
        const thumbnail = canvas.toDataURL({ format: 'jpeg', multiplier: 0.12, quality: 0.8 });
        // Save source page before duplicating so state is consistent
        dispatch({ type: 'SAVE_PAGE_JSON', pageId, json });
        dispatch({ type: 'UPDATE_PAGE_THUMBNAIL', pageId, thumbnail });
      }
      dispatch({ type: 'DUPLICATE_PAGE', pageId, json });
    },
    [dispatch, getCanvas]
  );

  const setActivePage = useCallback(
    (pageId) => {
      if (pageId === activePageId) return;
      // Persist current canvas state and generate thumbnail before leaving
      const canvas = getCanvas(activePageId);
      if (canvas) {
        const json = JSON.stringify(canvas.toJSON(['id', 'name', 'selectable', 'evented']));
        const thumbnail = canvas.toDataURL({ format: 'jpeg', multiplier: 0.12, quality: 0.8 });
        dispatch({ type: 'SAVE_PAGE_JSON', pageId: activePageId, json });
        dispatch({ type: 'UPDATE_PAGE_THUMBNAIL', pageId: activePageId, thumbnail });
      }
      dispatch({ type: 'SET_ACTIVE_PAGE', pageId });
    },
    [dispatch, getCanvas, activePageId]
  );

  const undoActive = useCallback(() => store.undo(activePageId), [store, activePageId]);
  const redoActive = useCallback(() => store.redo(activePageId), [store, activePageId]);

  return {
    ...store,
    setActivePanel,
    setCanvasSize,
    addPage,
    removePage,
    duplicatePage,
    setActivePage,
    undoActive,
    redoActive,
  };
}
