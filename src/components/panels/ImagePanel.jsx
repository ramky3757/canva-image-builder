import { useRef, useState } from 'react';
import * as fabric from 'fabric';

export default function ImagePanel({ canvas }) {
  const fileRef = useRef(null);
  const [imgUrl, setImgUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const placeImage = (img) => {
    const maxW = canvas.getWidth() * 0.8;
    const maxH = canvas.getHeight() * 0.8;
    const scale = Math.min(maxW / img.width, maxH / img.height, 1);
    img.set({
      scaleX: scale,
      scaleY: scale,
      left: (canvas.getWidth() - img.width * scale) / 2,
      top: (canvas.getHeight() - img.height * scale) / 2,
    });
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();
  };

  const addFromFile = (file) => {
    if (!file || !canvas) return;
    if (!file.type.startsWith('image/')) { setError('Not an image file'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      fabric.FabricImage.fromURL(e.target.result).then(placeImage);
    };
    reader.readAsDataURL(file);
  };

  const addFromURL = async () => {
    const url = imgUrl.trim();
    if (!url || !canvas) return;
    setLoading(true);
    setError('');
    try {
      const img = await fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
      placeImage(img);
      setImgUrl('');
    } catch {
      setError('Could not load image — check the URL or CORS policy.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 space-y-4">
      {/* File upload */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Upload from Device</p>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-violet-500 transition-colors"
          onClick={() => fileRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); addFromFile(e.dataTransfer.files[0]); }}
          onDragOver={(e) => e.preventDefault()}
        >
          <span className="text-3xl">🖼</span>
          <span className="text-xs text-gray-400">Click or drag image here</span>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => addFromFile(e.target.files[0])}
        />
      </div>

      {/* URL input */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Add from URL</p>
        <input
          value={imgUrl}
          onChange={(e) => { setImgUrl(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && addFromURL()}
          className="w-full bg-gray-100 text-gray-800 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 ring-violet-500 mb-2"
          placeholder="https://example.com/image.jpg"
        />
        {error && <p className="text-[10px] text-red-400 mb-1.5">{error}</p>}
        <button
          className="w-full py-2 rounded bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={addFromURL}
          disabled={loading || !imgUrl.trim()}
        >
          {loading ? 'Loading…' : 'Add Image'}
        </button>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Tip</p>
        <p className="text-xs text-gray-400">
          Select an image on the canvas, then use the Filters panel to apply effects.
        </p>
      </div>
    </div>
  );
}
