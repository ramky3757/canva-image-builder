import { useRef } from 'react';
import { useAuth } from '../auth/AuthContext';

const CANVAS_OPTIONS = [
  { label: 'A4 Portrait', sub: '794 × 1123', w: 794,  h: 1123, icon: '📄' },
  { label: 'Square',      sub: '1080 × 1080', w: 1080, h: 1080, icon: '⬛' },
  { label: 'Banner',      sub: '1200 × 400',  w: 1200, h: 400,  icon: '🪟' },
  { label: '16:9 HD',     sub: '1280 × 720',  w: 1280, h: 720,  icon: '🖥' },
];

export default function UploadZone({ onUpload }) {
  const inputRef = useRef(null);
  const { brandName } = useAuth();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => onUpload(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden"
      style={{ background: '#f0f2f5' }}
    >
      {/* Subtle decorative bg circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full blur-3xl opacity-40"
          style={{ top: '-5%', right: '-5%', width: 480, height: 480, background: 'linear-gradient(135deg, #ddd6fe, #c4b5fd)' }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-30"
          style={{ bottom: '-8%', left: '-5%', width: 400, height: 400, background: 'linear-gradient(135deg, #bfdbfe, #93c5fd)' }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-xl w-full">

        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
            >
              {brandName.split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {brandName}
            </h1>
          </div>
          <p className="text-sm text-gray-500">Design Studio · Create something beautiful</p>
        </div>

        {/* Drop zone */}
        <div
          className="w-full rounded-2xl cursor-pointer transition-all duration-200 bg-white"
          style={{
            border: '2px dashed #d1d5db',
            padding: '2.5rem 2rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#a78bfa';
            e.currentTarget.style.background = '#faf5ff';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
          }}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: '#ede9fe' }}
            >
              🖼
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg text-gray-800">Upload an image</p>
              <p className="text-sm mt-1 text-gray-500">Drag & drop or click to browse</p>
              <p className="text-xs mt-1.5 text-gray-400">PNG, JPG, SVG, WebP</p>
            </div>
          </div>
        </div>

        {/* Blank canvas options */}
        <div className="w-full space-y-3">
          <p className="text-center text-xs uppercase tracking-widest text-gray-400">
            or start with a blank canvas
          </p>
          <div className="grid grid-cols-4 gap-2.5">
            {CANVAS_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                className="flex flex-col items-center gap-2 rounded-xl p-3.5 transition-all duration-150 bg-white"
                style={{ border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#a78bfa';
                  e.currentTarget.style.background = '#faf5ff';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(124,58,237,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                }}
                onClick={() => onUpload(null, { width: opt.w, height: opt.h })}
              >
                <span className="text-2xl leading-none">{opt.icon}</span>
                <span className="text-xs font-medium text-gray-700">{opt.label}</span>
                <span className="text-[10px] text-gray-400">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}
