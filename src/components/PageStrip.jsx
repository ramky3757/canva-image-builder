import { useState, useRef } from 'react';
import { useEditor } from '../store/useEditor';

const THUMB_GRADIENTS = [
  ['#ddd6fe', '#c4b5fd'],
  ['#bfdbfe', '#93c5fd'],
  ['#bbf7d0', '#86efac'],
  ['#fde68a', '#fcd34d'],
  ['#fecaca', '#fca5a5'],
  ['#c7d2fe', '#a5b4fc'],
  ['#99f6e4', '#5eead4'],
  ['#e9d5ff', '#d8b4fe'],
];

export default function PageStrip() {
  const { pages, activePageId, setActivePage, addPage, removePage, duplicatePage } = useEditor();
  const [toast, setToast]           = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef(null);

  const handleSwitch = (pageId) => {
    if (pageId === activePageId) return;
    const from = pages.find((p) => p.id === activePageId);
    setActivePage(pageId);
    if (from) {
      // Show brief auto-save confirmation
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToast(`${from.name} saved`);
      setToastVisible(true);
      toastTimerRef.current = setTimeout(() => setToastVisible(false), 2200);
    }
  };

  return (
    <div
      className="h-[7.5rem] flex items-center gap-3 px-4 shrink-0 overflow-x-auto"
      style={{ background: '#ffffff', borderTop: '1px solid #e5e7eb', boxShadow: '0 -1px 4px rgba(0,0,0,0.04)' }}
    >
      {pages.map((page, i) => {
        const isActive = page.id === activePageId;
        const [c1, c2] = THUMB_GRADIENTS[i % THUMB_GRADIENTS.length];

        return (
          <div
            key={page.id}
            className="relative group cursor-pointer shrink-0"
            onClick={() => handleSwitch(page.id)}
            title={page.name}
          >
            {/* Thumbnail */}
            <div
              className="w-[4.5rem] h-14 rounded-lg overflow-hidden transition-all duration-150"
              style={{
                background: `linear-gradient(135deg, ${c1}, ${c2})`,
                border: isActive
                  ? '2px solid #7c3aed'
                  : '2px solid #e5e7eb',
                boxShadow: isActive ? '0 0 0 2px rgba(124,58,237,0.15), 0 2px 8px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {page.thumbnail && (
                <img
                  src={page.thumbnail}
                  className="w-full h-full object-cover"
                  alt={page.name}
                  draggable={false}
                />
              )}
            </div>

            {/* Page number badge */}
            <div
              className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full text-[8px] flex items-center justify-center font-bold shadow-sm"
              style={{
                background: isActive ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : '#f3f4f6',
                color: isActive ? '#fff' : '#6b7280',
                border: isActive ? 'none' : '1px solid #e5e7eb',
              }}
            >
              {i + 1}
            </div>

            {/* Hover actions */}
            <div className="absolute top-0.5 right-0.5 hidden group-hover:flex gap-0.5">
              <button
                className="w-4 h-4 rounded text-white text-[9px] flex items-center justify-center"
                style={{ background: 'rgba(59,130,246,0.85)' }}
                title="Duplicate"
                onClick={(e) => { e.stopPropagation(); duplicatePage(page.id); }}
              >
                ⧉
              </button>
              {pages.length > 1 && (
                <button
                  className="w-4 h-4 rounded text-white text-[9px] flex items-center justify-center"
                  style={{ background: 'rgba(239,68,68,0.85)' }}
                  title="Delete"
                  onClick={(e) => { e.stopPropagation(); removePage(page.id); }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Label */}
            <p
              className="text-[9px] text-center mt-1 truncate w-[4.5rem]"
              style={{ color: isActive ? '#7c3aed' : '#9ca3af' }}
            >
              {page.name}
            </p>
          </div>
        );
      })}

      {/* Add page */}
      <button
        className="shrink-0 w-[4.5rem] h-14 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all duration-150 text-gray-400"
        style={{ border: '2px dashed #d1d5db', background: 'transparent' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#a78bfa';
          e.currentTarget.style.color = '#7c3aed';
          e.currentTarget.style.background = '#faf5ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#d1d5db';
          e.currentTarget.style.color = '#9ca3af';
          e.currentTarget.style.background = 'transparent';
        }}
        onClick={() => addPage()}
        title="Add new page"
      >
        <span className="text-xl leading-none">+</span>
        <span className="text-[9px]">Add page</span>
      </button>

      {/* Page count */}
      <div className="ml-auto shrink-0 text-[10px] pr-1 select-none text-gray-400">
        {pages.length} {pages.length === 1 ? 'page' : 'pages'}
      </div>

      {/* Auto-save toast */}
      {toastVisible && (
        <div
          className="fixed bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-white shadow-lg pointer-events-none z-50"
          style={{ background: '#16a34a' }}
        >
          <span>✓</span>
          <span>{toast} — switching page</span>
        </div>
      )}
    </div>
  );
}
