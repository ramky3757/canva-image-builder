import * as fabric from 'fabric';

const FILTERS = [
  { label: 'None',       apply: () => [] },
  { label: 'Grayscale',  apply: () => [new fabric.filters.Grayscale()] },
  { label: 'Sepia',      apply: () => [new fabric.filters.Sepia()] },
  { label: 'Invert',     apply: () => [new fabric.filters.Invert()] },
  { label: 'Blur',       apply: () => [new fabric.filters.Blur({ blur: 0.1 })] },
  { label: 'Sharpen',    apply: () => [new fabric.filters.Convolute({ matrix: [0,-1,0,-1,5,-1,0,-1,0] })] },
  { label: 'Emboss',     apply: () => [new fabric.filters.Convolute({ matrix: [-2,-1,0,-1,1,1,0,1,2] })] },
  { label: 'Brownie',    apply: () => [new fabric.filters.Brownie()] },
  { label: 'Vintage',    apply: () => [new fabric.filters.Vintage()] },
  { label: 'Kodachrome', apply: () => [new fabric.filters.Kodachrome()] },
  { label: 'BlackWhite', apply: () => [new fabric.filters.BlackWhite()] },
  { label: 'Technicolor',apply: () => [new fabric.filters.Technicolor()] },
  { label: 'Polaroid',   apply: () => [new fabric.filters.Polaroid()] },
  { label: 'Pixelate',   apply: () => [new fabric.filters.Pixelate({ blocksize: 8 })] },
];

export default function FiltersPanel({ canvas }) {
  const apply = (filterFn) => {
    const obj = canvas?.getActiveObject();
    if (!obj || obj.type !== 'image') return;
    obj.filters = filterFn();
    obj.applyFilters();
    canvas.renderAll();
  };

  const adjustBrightness = (v) => {
    const obj = canvas?.getActiveObject();
    if (!obj || obj.type !== 'image') return;
    const existing = obj.filters.filter((f) => !(f instanceof fabric.filters.Brightness));
    obj.filters = [...existing, new fabric.filters.Brightness({ brightness: v })];
    obj.applyFilters();
    canvas.renderAll();
  };

  const adjustContrast = (v) => {
    const obj = canvas?.getActiveObject();
    if (!obj || obj.type !== 'image') return;
    const existing = obj.filters.filter((f) => !(f instanceof fabric.filters.Contrast));
    obj.filters = [...existing, new fabric.filters.Contrast({ contrast: v })];
    obj.applyFilters();
    canvas.renderAll();
  };

  const adjustSaturation = (v) => {
    const obj = canvas?.getActiveObject();
    if (!obj || obj.type !== 'image') return;
    const existing = obj.filters.filter((f) => !(f instanceof fabric.filters.Saturation));
    obj.filters = [...existing, new fabric.filters.Saturation({ saturation: v })];
    obj.applyFilters();
    canvas.renderAll();
  };

  return (
    <div className="p-3 space-y-4">
      <p className="text-xs text-gray-500 uppercase tracking-wider">Select an image on canvas first</p>

      <div>
        <p className="text-xs text-gray-500 mb-2">Presets</p>
        <div className="grid grid-cols-2 gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              className="py-2 rounded bg-gray-100 text-gray-600 text-xs hover:bg-violet-600 hover:text-white transition-colors"
              onClick={() => apply(f.apply)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider">Adjustments</p>
        {[
          { label: 'Brightness', min: -1, max: 1, step: 0.05, fn: adjustBrightness },
          { label: 'Contrast',   min: -1, max: 1, step: 0.05, fn: adjustContrast },
          { label: 'Saturation', min: -1, max: 1, step: 0.05, fn: adjustSaturation },
        ].map(({ label, min, max, step, fn }) => (
          <div key={label}>
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <input
              type="range" min={min} max={max} step={step} defaultValue={0}
              className="w-full accent-violet-500"
              onChange={(e) => fn(Number(e.target.value))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
