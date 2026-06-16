import { useAuth } from '../auth/AuthContext';

// When VITE_DISABLE_AUTH=true the app runs in external-auth / E2E mode —
// there is no local admin session, so the logout button is hidden.
const AUTH_DISABLED = import.meta.env.VITE_DISABLE_AUTH === 'true';

const CANVAS_PRESETS = [
  { label: 'A4',     w: 794,  h: 1123 },
  { label: '1080²',  w: 1080, h: 1080 },
  { label: 'Banner', w: 1200, h: 400  },
  { label: '16:9',   w: 1280, h: 720  },
  { label: '4:5',    w: 1080, h: 1350 },
  { label: 'Story',  w: 1080, h: 1920 },
];

function BrandBadge({ name }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-2.5 shrink-0" style={{ borderRight: '1px solid #e5e7eb', paddingRight: '1rem', marginRight: '0.25rem' }}>
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 2px 8px rgba(124,58,237,0.25)' }}
      >
        {initials}
      </div>
      <span className="text-sm font-semibold text-gray-800 whitespace-nowrap leading-none">
        {name}
      </span>
    </div>
  );
}

export default function Toolbar({ onReset, onCanvasSizeChange, canvasSize, onUndo, onRedo }) {
  const { brandName, user, logout } = useAuth();

  return (
    <div
      className="h-[52px] flex items-center px-4 gap-3 shrink-0"
      style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      <BrandBadge name={brandName} />

      {/* Size presets */}
      <div className="flex gap-0.5">
        {CANVAS_PRESETS.map((p) => {
          const isActive = canvasSize.width === p.w && canvasSize.height === p.h;
          return (
            <button
              key={p.label}
              className="text-[11px] px-2.5 py-1 rounded-md font-medium transition-all duration-150"
              style={
                isActive
                  ? { background: '#ede9fe', color: '#7c3aed', border: '1px solid #c4b5fd' }
                  : { background: 'transparent', color: '#6b7280', border: '1px solid transparent' }
              }
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#374151'; } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; } }}
              onClick={() => onCanvasSizeChange(p.w, p.h)}
              title={`${p.w}×${p.h}`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <span
        className="text-[11px] font-mono px-3"
        style={{ color: '#9ca3af', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' }}
      >
        {canvasSize.width} × {canvasSize.height}
      </span>

      {/* Undo / Redo */}
      <div className="flex gap-0.5">
        <button
          className="text-[11px] px-2.5 py-1 rounded-md font-medium text-gray-500 transition-all duration-150"
          onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#374151'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}
          onClick={onUndo}
          title="Undo (Ctrl+Z / ⌘Z)"
        >
          ↩ Undo
        </button>
        <button
          className="text-[11px] px-2.5 py-1 rounded-md font-medium text-gray-500 transition-all duration-150"
          onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#374151'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}
          onClick={onRedo}
          title="Redo (Ctrl+Y / ⌘⇧Z)"
        >
          ↪ Redo
        </button>
      </div>

      <div className="flex-1" />

      {/* User badge + logout — hidden in external-auth / VITE_DISABLE_AUTH mode */}
      {!AUTH_DISABLED && user && (
        <div className="flex items-center gap-2 pl-3" style={{ borderLeft: '1px solid #e5e7eb' }}>
          <span className="text-[11px] text-gray-500 max-w-[120px] truncate" title={user.email}>
            {user.email}
          </span>
          <button
            className="text-[11px] px-2.5 py-1.5 rounded-md font-medium border transition-all duration-150 text-gray-500 border-gray-200 whitespace-nowrap"
            onMouseEnter={(e) => { e.currentTarget.style.background = '#fff1f2'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fca5a5'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
            onClick={logout}
            title="Sign out"
          >
            Sign out
          </button>
        </div>
      )}

      <button
        className="text-[11px] px-3 py-1.5 rounded-md font-medium border transition-all duration-150 text-gray-500 border-gray-200"
        onMouseEnter={(e) => { e.currentTarget.style.background = '#fff1f2'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fca5a5'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
        onClick={onReset}
      >
        ✕ New
      </button>
    </div>
  );
}
