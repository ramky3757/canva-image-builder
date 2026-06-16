/**
 * App — thin shell that decides what to show.
 *
 * Static imports here (UploadZone, EditorProvider, AuthContext) load with the
 * initial bundle and have NO Fabric.js dependency.
 *
 * EditorLayout (and everything it imports, including fabric) is a separate
 * async chunk fetched only after the user starts a design session.
 */
import { useState, lazy, Suspense } from 'react';
import UploadZone from './components/UploadZone';
import { useEditorStore } from './store/EditorContext';

// Code-split boundary — Fabric.js is only in this chunk
const EditorLayout = lazy(() => import('./components/EditorLayout'));

function EditorLoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen" style={{ background: '#f0f2f5' }}>
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl animate-pulse"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
        />
        <p className="text-sm text-gray-400">Loading editor…</p>
      </div>
    </div>
  );
}

export default function App() {
  const [started, setStarted]             = useState(false);
  const [initialImageUrl, setInitialImageUrl] = useState(null);
  const { dispatch }                      = useEditorStore();

  const handleUpload = (dataUrl, preset) => {
    if (preset) dispatch({ type: 'SET_PAGE_SIZE', width: preset.width, height: preset.height });
    setInitialImageUrl(dataUrl ?? null);
    setStarted(true);
  };

  const handleReset = () => {
    setStarted(false);
    setInitialImageUrl(null);
  };

  if (!started) return <UploadZone onUpload={handleUpload} />;

  return (
    <Suspense fallback={<EditorLoadingScreen />}>
      <EditorLayout initialImageUrl={initialImageUrl} onReset={handleReset} />
    </Suspense>
  );
}
