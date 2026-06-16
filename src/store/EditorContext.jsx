import { createContext, useContext, useReducer, useRef, useCallback } from 'react';

const EditorContext = createContext(null);

// -- Helpers --

function generateId() {
  return crypto.randomUUID();
}

function createPage(width = 800, height = 600, index = 1) {
  return { id: generateId(), name: `Page ${index}`, width, height, json: null, thumbnail: null };
}

// -- Reducer --

const defaultPage = createPage(800, 600, 1);

const INITIAL_STATE = {
  pages: [defaultPage],
  activePageId: defaultPage.id,
  activePanel: 'templates',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_PANEL':
      return { ...state, activePanel: action.panel };

    case 'SET_PAGE_SIZE':
      return {
        ...state,
        pages: state.pages.map((p) =>
          p.id === state.activePageId
            ? { ...p, width: action.width, height: action.height }
            : p
        ),
      };

    case 'ADD_PAGE': {
      const active = state.pages.find((p) => p.id === state.activePageId);
      const page = createPage(
        action.width ?? active?.width ?? 800,
        action.height ?? active?.height ?? 600,
        state.pages.length + 1
      );
      return { ...state, pages: [...state.pages, page], activePageId: page.id };
    }

    case 'REMOVE_PAGE': {
      if (state.pages.length === 1) return state;
      const pages = state.pages.filter((p) => p.id !== action.pageId);
      const activePageId =
        state.activePageId === action.pageId ? pages[0].id : state.activePageId;
      return { ...state, pages, activePageId };
    }

    case 'DUPLICATE_PAGE': {
      const src = state.pages.find((p) => p.id === action.pageId);
      if (!src) return state;
      const clone = {
        ...src,
        id: generateId(),
        name: `${src.name} (copy)`,
        json: action.json ?? src.json,
      };
      const idx = state.pages.findIndex((p) => p.id === action.pageId);
      const pages = [...state.pages];
      pages.splice(idx + 1, 0, clone);
      return { ...state, pages, activePageId: clone.id };
    }

    case 'SET_ACTIVE_PAGE':
      return { ...state, activePageId: action.pageId };

    case 'SAVE_PAGE_JSON':
      return {
        ...state,
        pages: state.pages.map((p) =>
          p.id === action.pageId ? { ...p, json: action.json } : p
        ),
      };

    case 'UPDATE_PAGE_THUMBNAIL':
      return {
        ...state,
        pages: state.pages.map((p) =>
          p.id === action.pageId ? { ...p, thumbnail: action.thumbnail } : p
        ),
      };

    case 'REORDER_PAGES':
      return { ...state, pages: action.pages };

    default:
      return state;
  }
}

// -- Provider --

export function EditorProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Mutable refs — not in React state, so mutations don't trigger re-renders
  const canvasMap = useRef(new Map());   // pageId -> FabricCanvas
  const historyMap = useRef(new Map());  // pageId -> { past: string[], future: string[] }
  const replayingRef = useRef(false);    // suppress snapshots during undo/redo
  const pendingJsonRef = useRef(null);   // post-resize callback for template loading

  function getHistory(pageId) {
    if (!historyMap.current.has(pageId)) {
      historyMap.current.set(pageId, { past: [], future: [] });
    }
    return historyMap.current.get(pageId);
  }

  // Canvas registry
  const registerCanvas = useCallback((pageId, canvas) => {
    canvasMap.current.set(pageId, canvas);
  }, []);

  const getCanvas = useCallback((pageId) => {
    return canvasMap.current.get(pageId) ?? null;
  }, []);

  // History
  const snapshot = useCallback((pageId, jsonString) => {
    if (replayingRef.current) return;
    const hist = getHistory(pageId);
    hist.past.push(jsonString);
    if (hist.past.length > 50) hist.past.shift();
    hist.future = [];
  }, []);

  const undo = useCallback((pageId) => {
    const canvas = canvasMap.current.get(pageId);
    if (!canvas) return;
    const hist = getHistory(pageId);
    if (!hist.past.length) return;
    const current = JSON.stringify(canvas.toJSON(['id', 'name', 'selectable', 'evented']));
    hist.future.push(current);
    const prev = hist.past.pop();
    replayingRef.current = true;
    canvas.loadFromJSON(JSON.parse(prev)).then(() => {
      canvas.renderAll();
      replayingRef.current = false;
    });
  }, []);

  const redo = useCallback((pageId) => {
    const canvas = canvasMap.current.get(pageId);
    if (!canvas) return;
    const hist = getHistory(pageId);
    if (!hist.future.length) return;
    const current = JSON.stringify(canvas.toJSON(['id', 'name', 'selectable', 'evented']));
    hist.past.push(current);
    const next = hist.future.pop();
    replayingRef.current = true;
    canvas.loadFromJSON(JSON.parse(next)).then(() => {
      canvas.renderAll();
      replayingRef.current = false;
    });
  }, []);

  const activePage = state.pages.find((p) => p.id === state.activePageId) ?? null;

  const value = {
    pages: state.pages,
    activePageId: state.activePageId,
    activePanel: state.activePanel,
    activePage,
    dispatch,
    registerCanvas,
    getCanvas,
    snapshot,
    undo,
    redo,
    replayingRef,
    pendingJsonRef,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditorStore() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditorStore must be used inside EditorProvider');
  return ctx;
}
