import * as fabric from 'fabric';

// Each template is a factory function: (canvas) => void
// It clears the canvas and builds fresh objects programmatically

function makeGradient(canvas, x1, y1, x2, y2, color1, color2) {
  return new fabric.Gradient({
    type: 'linear',
    coords: { x1, y1, x2, y2 },
    colorStops: [{ offset: 0, color: color1 }, { offset: 1, color: color2 }],
  });
}

function applyBgGradient(canvas, color1, color2) {
  const g = makeGradient(canvas, 0, 0, canvas.getWidth(), canvas.getHeight(), color1, color2);
  canvas.set('backgroundColor', g);
}

function clearCanvas(canvas) {
  canvas.clear();
  canvas.set('backgroundColor', '#1a1a1a');
}

const TEMPLATES = [
  {
    id: 'beach',
    name: 'Beach Getaway',
    thumb: 'linear-gradient(135deg,#f97316,#fbbf24)',
    category: 'Vacation',
    width: 1080, height: 1080,
    apply(canvas) {
      clearCanvas(canvas);
      applyBgGradient(canvas, '#f97316', '#fbbf24');

      const title = new fabric.IText('🏖 BEACH VIBES', {
        left: 80, top: 380, fontSize: 88, fontFamily: 'Georgia',
        fill: '#ffffff', fontWeight: 'bold',
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.35)', blur: 10, offsetX: 3, offsetY: 3 }),
      });
      const sub = new fabric.IText('Summer 2025', {
        left: 120, top: 500, fontSize: 52, fontFamily: 'Georgia', fill: '#fff3e0',
      });
      canvas.add(title, sub);
      canvas.renderAll();
    },
  },
  {
    id: 'mountains',
    name: 'Mountain Trip',
    thumb: 'linear-gradient(135deg,#1e3a5f,#0ea5e9)',
    category: 'Vacation',
    width: 1080, height: 1080,
    apply(canvas) {
      clearCanvas(canvas);
      applyBgGradient(canvas, '#1e3a5f', '#0ea5e9');

      const tri = new fabric.Triangle({
        left: 190, top: 350, width: 700, height: 550,
        fill: 'rgba(255,255,255,0.08)', selectable: false, evented: false,
      });
      const title = new fabric.IText('⛰ EXPLORE', {
        left: 180, top: 220, fontSize: 110, fontFamily: 'Impact', fill: '#ffffff',
      });
      const sub = new fabric.IText('The Mountains Call', {
        left: 140, top: 700, fontSize: 48, fontFamily: 'Georgia', fill: '#bae6fd',
      });
      canvas.add(tri, title, sub);
      canvas.renderAll();
    },
  },
  {
    id: 'city',
    name: 'City Break',
    thumb: 'linear-gradient(135deg,#0f0f23,#6b21a8)',
    category: 'Vacation',
    width: 1200, height: 628,
    apply(canvas) {
      clearCanvas(canvas);
      applyBgGradient(canvas, '#0f0f23', '#6b21a8');

      const title = new fabric.IText('🌆 CITY ESCAPE', {
        left: 80, top: 160, fontSize: 90, fontFamily: 'Arial', fill: '#e879f9', fontWeight: 'bold',
      });
      const sub = new fabric.IText('Urban Adventure Awaits', {
        left: 80, top: 280, fontSize: 42, fontFamily: 'Verdana', fill: '#d8b4fe',
      });
      const line = new fabric.Rect({
        left: 80, top: 360, width: 240, height: 5, fill: '#a855f7',
        selectable: false, evented: false,
      });
      canvas.add(title, sub, line);
      canvas.renderAll();
    },
  },
  {
    id: 'jungle',
    name: 'Jungle Safari',
    thumb: 'linear-gradient(135deg,#14532d,#84cc16)',
    category: 'Vacation',
    width: 1080, height: 1080,
    apply(canvas) {
      clearCanvas(canvas);
      applyBgGradient(canvas, '#14532d', '#166534');

      const circle = new fabric.Circle({
        left: 620, top: -160, radius: 380,
        fill: 'rgba(21,128,61,0.25)', selectable: false, evented: false,
      });
      const title = new fabric.IText('🌿 SAFARI', {
        left: 90, top: 320, fontSize: 120, fontFamily: 'Impact', fill: '#bbf7d0', fontWeight: 'bold',
      });
      const sub = new fabric.IText('Into the Wild', {
        left: 140, top: 470, fontSize: 58, fontFamily: 'Georgia', fill: '#86efac',
      });
      canvas.add(circle, title, sub);
      canvas.renderAll();
    },
  },
  {
    id: 'paris',
    name: 'Paris Romance',
    thumb: 'linear-gradient(135deg,#831843,#fb7185)',
    category: 'Vacation',
    width: 1080, height: 1080,
    apply(canvas) {
      clearCanvas(canvas);
      applyBgGradient(canvas, '#831843', '#fb7185');

      const title = new fabric.IText('🗼 PARIS', {
        left: 140, top: 310, fontSize: 130, fontFamily: 'Georgia', fill: '#fff1f2', fontWeight: 'bold',
      });
      const sub = new fabric.IText('La Ville Lumière', {
        left: 140, top: 470, fontSize: 56, fontFamily: 'Georgia', fill: '#fecdd3', fontStyle: 'italic',
      });
      canvas.add(title, sub);
      canvas.renderAll();
    },
  },
  {
    id: 'tropical',
    name: 'Tropical Escape',
    thumb: 'linear-gradient(135deg,#0e7490,#a3e635)',
    category: 'Vacation',
    width: 1080, height: 1080,
    apply(canvas) {
      clearCanvas(canvas);
      applyBgGradient(canvas, '#0e7490', '#a3e635');

      const title = new fabric.IText('🌴 TROPICAL', {
        left: 80, top: 350, fontSize: 100, fontFamily: 'Impact', fill: '#ffffff', fontWeight: 'bold',
      });
      const sub = new fabric.IText('Escape to Paradise', {
        left: 100, top: 480, fontSize: 52, fontFamily: 'Verdana', fill: '#cffafe',
      });
      canvas.add(title, sub);
      canvas.renderAll();
    },
  },
  {
    id: 'blank_white',
    name: 'Blank White',
    thumb: '#ffffff',
    category: 'Basic',
    width: 800, height: 600,
    apply(canvas) {
      clearCanvas(canvas);
      canvas.set('backgroundColor', '#ffffff');
      canvas.renderAll();
    },
  },
  {
    id: 'blank_dark',
    name: 'Blank Dark',
    thumb: '#1a1a2e',
    category: 'Basic',
    width: 800, height: 600,
    apply(canvas) {
      clearCanvas(canvas);
      canvas.set('backgroundColor', '#1a1a2e');
      canvas.renderAll();
    },
  },
  {
    id: 'a4_print',
    name: 'A4 Print Ready',
    thumb: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)',
    category: 'Print',
    width: 794, height: 1123,
    apply(canvas) {
      clearCanvas(canvas);
      canvas.set('backgroundColor', '#f8fafc');

      const title = new fabric.IText('Your Title Here', {
        left: 80, top: 80, fontSize: 48, fontFamily: 'Georgia', fill: '#1e293b', fontWeight: 'bold',
      });
      const line = new fabric.Rect({
        left: 80, top: 148, width: 634, height: 3, fill: '#6366f1',
        selectable: false, evented: false,
      });
      const body = new fabric.IText('Add your content here...', {
        left: 80, top: 175, fontSize: 24, fontFamily: 'Arial', fill: '#475569',
      });
      canvas.add(title, line, body);
      canvas.renderAll();
    },
  },
  {
    id: 'social_post',
    name: 'Social Post',
    thumb: 'linear-gradient(135deg,#312e81,#7c3aed)',
    category: 'Print',
    width: 1080, height: 1080,
    apply(canvas) {
      clearCanvas(canvas);
      applyBgGradient(canvas, '#312e81', '#7c3aed');

      const circle = new fabric.Circle({
        left: 340, top: 280, radius: 200,
        fill: 'rgba(255,255,255,0.06)', selectable: false, evented: false,
      });
      const title = new fabric.IText('Your Message', {
        left: 80, top: 430, fontSize: 86, fontFamily: 'Georgia', fill: '#e9d5ff', fontWeight: 'bold',
      });
      const sub = new fabric.IText('Share your story', {
        left: 100, top: 550, fontSize: 44, fontFamily: 'Verdana', fill: '#c4b5fd',
      });
      canvas.add(circle, title, sub);
      canvas.renderAll();
    },
  },
];

export { TEMPLATES };
