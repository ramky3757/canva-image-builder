import { NAV_ITEMS } from '../config/navItems';

export default function LeftNav({ active, onSelect }) {
  return (
    <div
      className="w-[72px] shrink-0 flex flex-col items-center py-2 gap-0.5"
      style={{ background: '#ffffff', borderRight: '1px solid #e5e7eb' }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            title={item.label}
            onClick={() => onSelect(active === item.id ? null : item.id)}
            className="relative w-[60px] flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all duration-150 text-xs font-medium"
            style={{
              background: isActive ? '#ede9fe' : 'transparent',
              color: isActive ? '#7c3aed' : '#6b7280',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.color = '#374151';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#6b7280';
              }
            }}
          >
            {isActive && (
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                style={{ background: 'linear-gradient(to bottom, #7c3aed, #4f46e5)' }}
              />
            )}
            <span className="text-[17px] leading-none">{item.icon}</span>
            <span className="text-[9px] leading-none tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
