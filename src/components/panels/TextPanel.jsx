import { useState } from 'react';
import * as fabric from 'fabric';

const PRESETS = [
  { id: 'display',   label: 'Display',    text: 'Display',           font: 'Georgia',       size: 96,  weight: 'bold',   style: 'normal', fill: '#111827', ls: 0 },
  { id: 'heading',   label: 'Heading',    text: 'Heading',           font: 'Arial',         size: 64,  weight: 'bold',   style: 'normal', fill: '#1f2937', ls: 0 },
  { id: 'title',     label: 'Title',      text: 'Title Text',        font: 'Trebuchet MS',  size: 48,  weight: 'bold',   style: 'normal', fill: '#374151', ls: 0 },
  { id: 'subtitle',  label: 'Subtitle',   text: 'Subtitle here',     font: 'Georgia',       size: 36,  weight: 'normal', style: 'italic', fill: '#4b5563', ls: 0 },
  { id: 'body',      label: 'Body',       text: 'Body paragraph',    font: 'Arial',         size: 24,  weight: 'normal', style: 'normal', fill: '#374151', ls: 0 },
  { id: 'caption',   label: 'Caption',    text: 'Caption / note',    font: 'Arial',         size: 15,  weight: 'normal', style: 'italic', fill: '#6b7280', ls: 0 },
  { id: 'impact',    label: 'Impact',     text: 'IMPACT',            font: 'Impact',        size: 72,  weight: 'bold',   style: 'normal', fill: '#7c3aed', ls: 3 },
  { id: 'elegant',   label: 'Elegant',    text: 'Elegant Script',    font: 'Palatino',      size: 52,  weight: 'normal', style: 'italic', fill: '#be185d', ls: 0 },
  { id: 'modern',    label: 'Modern',     text: 'MODERN',            font: 'Verdana',       size: 28,  weight: 'bold',   style: 'normal', fill: '#0891b2', ls: 8 },
  { id: 'quote',     label: 'Quote',      text: '"Your quote"',      font: 'Georgia',       size: 30,  weight: 'normal', style: 'italic', fill: '#6b7280', ls: 0 },
  { id: 'label',     label: 'Label',      text: 'LABEL TEXT',        font: 'Arial',         size: 13,  weight: 'bold',   style: 'normal', fill: '#374151', ls: 5 },
  { id: 'price',     label: 'Price',      text: '$99.99',            font: 'Arial',         size: 64,  weight: 'bold',   style: 'normal', fill: '#16a34a', ls: 0 },
  { id: 'date',      label: 'Date',       text: 'June 2025',         font: 'Georgia',       size: 28,  weight: 'normal', style: 'italic', fill: '#f59e0b', ls: 2 },
  { id: 'tagline',   label: 'Tagline',    text: 'Your tagline here', font: 'Trebuchet MS',  size: 22,  weight: 'normal', style: 'italic', fill: '#7c3aed', ls: 0 },
];

const QUICK_FONTS = ['Arial', 'Georgia', 'Verdana', 'Impact', 'Palatino', 'Trebuchet MS', 'Courier New', 'Times New Roman'];

function PresetCard({ preset, onAdd }) {
  const previewSize = Math.min(preset.size * 0.28, 28);

  return (
    <button
      onClick={() => onAdd(preset)}
      className="w-full text-left rounded-xl border border-gray-100 bg-white hover:border-violet-300 hover:shadow-sm transition-all duration-150 overflow-hidden group cursor-pointer"
      style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
      title={`Add ${preset.label} to canvas`}
    >
      <div className="px-3 pt-3 pb-1.5 flex items-start justify-between gap-2">
        <div
          style={{
            fontFamily: preset.font,
            fontSize: previewSize,
            fontWeight: preset.weight,
            fontStyle: preset.style,
            color: preset.fill,
            letterSpacing: preset.ls,
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 165,
            flexShrink: 1,
          }}
        >
          {preset.text}
        </div>
        <span className="text-[9px] text-gray-300 group-hover:text-violet-400 shrink-0 transition-colors font-semibold uppercase tracking-widest mt-0.5">
          {preset.label}
        </span>
      </div>
      <div className="px-3 pb-2 flex items-center gap-1.5">
        <span className="text-[9px] text-gray-300 font-mono truncate">{preset.font}</span>
        <span className="text-[9px] text-gray-200">·</span>
        <span className="text-[9px] text-gray-300">{preset.size}px</span>
        {preset.weight === 'bold' && <span className="text-[9px] text-gray-200">· B</span>}
        {preset.style === 'italic' && <span className="text-[9px] text-gray-200">· I</span>}
      </div>
    </button>
  );
}

export default function TextPanel({ canvas }) {
  const [customText, setCustomText] = useState('');
  const [font, setFont] = useState('Arial');
  const [size, setSize] = useState(48);
  const [color, setColor] = useState('#1f2937');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const addPreset = (preset) => {
    if (!canvas) return;
    const t = new fabric.IText(preset.text, {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      fontSize: preset.size,
      fontFamily: preset.font,
      fill: preset.fill,
      fontWeight: preset.weight,
      fontStyle: preset.style,
      charSpacing: preset.ls * 10,
      originX: 'center',
      originY: 'center',
      editable: true,
    });
    canvas.add(t);
    canvas.setActiveObject(t);
    canvas.renderAll();
  };

  const addCustom = () => {
    if (!canvas) return;
    const t = new fabric.IText(customText || 'Your text', {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      fontSize: size,
      fontFamily: font,
      fill: color,
      fontWeight: bold ? 'bold' : 'normal',
      fontStyle: italic ? 'italic' : 'normal',
      originX: 'center',
      originY: 'center',
      editable: true,
    });
    canvas.add(t);
    canvas.setActiveObject(t);
    canvas.renderAll();
  };

  const visiblePresets = expanded ? PRESETS : PRESETS.slice(0, 8);

  return (
    <div className="p-3 space-y-3">
      <div>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Click a style to add</p>
        <div className="space-y-1.5">
          {visiblePresets.map((preset) => (
            <PresetCard key={preset.id} preset={preset} onAdd={addPreset} />
          ))}
        </div>
        <button
          className="w-full mt-1.5 py-1.5 text-[10px] text-gray-400 hover:text-violet-600 transition-colors uppercase tracking-wider"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '↑ Show less' : `↓ ${PRESETS.length - 8} more styles`}
        </button>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Custom Text</p>
        <div className="space-y-2">
          <input
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            placeholder="Type your text…"
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 ring-violet-300 focus:border-violet-300"
          />
          <div className="flex gap-1.5">
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-2 py-2 outline-none"
            >
              {QUICK_FONTS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <input
              type="number"
              value={size}
              min={8}
              max={300}
              onChange={(e) => setSize(Math.max(8, Number(e.target.value)))}
              className="w-16 bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-2 py-2 outline-none text-center"
            />
          </div>
          <div className="flex gap-1.5 items-center">
            <button
              onClick={() => setBold(!bold)}
              className={`w-9 h-9 rounded-lg text-sm font-bold border transition-colors ${bold ? 'bg-violet-600 text-white border-violet-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-violet-300'}`}
            >B</button>
            <button
              onClick={() => setItalic(!italic)}
              className={`w-9 h-9 rounded-lg text-sm italic border transition-colors ${italic ? 'bg-violet-600 text-white border-violet-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-violet-300'}`}
            >I</button>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 h-9 rounded-lg cursor-pointer border border-gray-200"
              title="Text color"
            />
            <div className="w-9 h-9 rounded-lg border border-gray-200 shrink-0" style={{ background: color }} />
          </div>
          <button
            onClick={addCustom}
            className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 active:bg-violet-700 transition-colors"
          >
            + Add to Canvas
          </button>
        </div>
      </div>
    </div>
  );
}
