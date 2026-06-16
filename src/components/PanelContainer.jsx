import TemplatesPanel from './panels/TemplatesPanel';
import DrawPanel from './panels/DrawPanel';
import TextPanel from './panels/TextPanel';
import ShapesPanel from './panels/ShapesPanel';
import ImagePanel from './panels/ImagePanel';
import ColorsPanel from './panels/ColorsPanel';
import BackgroundPanel from './panels/BackgroundPanel';
import FiltersPanel from './panels/FiltersPanel';
import ArrangePanel from './panels/ArrangePanel';
import DownloadPanel from './panels/DownloadPanel';
import { NAV_ITEMS } from '../config/navItems';

const META = Object.fromEntries(NAV_ITEMS.map((n) => [n.id, n]));

export default function PanelContainer({ active, canvas, onCanvasSizeChange }) {
  if (!active) return null;

  const props = { canvas, onCanvasSizeChange };
  const meta = META[active];

  const content = {
    templates: <TemplatesPanel {...props} />,
    draw:      <DrawPanel {...props} />,
    text:      <TextPanel {...props} />,
    shapes:    <ShapesPanel {...props} />,
    image:     <ImagePanel {...props} />,
    colors:    <ColorsPanel {...props} />,
    bg:        <BackgroundPanel {...props} />,
    filters:   <FiltersPanel {...props} />,
    arrange:   <ArrangePanel {...props} />,
    download:  <DownloadPanel {...props} />,
  }[active];

  return (
    <div
      className="w-64 flex flex-col overflow-hidden shrink-0"
      style={{ background: '#f8f9fa', borderRight: '1px solid #e5e7eb' }}
    >
      {/* Panel header */}
      <div
        className="px-4 py-3 shrink-0 flex items-center gap-2.5"
        style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}
      >
        <span className="text-base leading-none">{meta?.icon}</span>
        <h2 className="text-sm font-semibold text-gray-800">
          {meta?.label === 'BG' ? 'Background' : meta?.label}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {content}
      </div>
    </div>
  );
}
