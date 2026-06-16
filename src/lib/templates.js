import * as fabric from 'fabric';

// ── Relative-coordinate helpers ───────────────────────────────────────────────
// All dimensions are expressed as fractions of canvas size so every template
// looks correct on any preset (A4, Banner, 16:9, Square …).

const W  = (c) => c.getWidth();
const H  = (c) => c.getHeight();
const S  = (c) => Math.min(W(c), H(c));

/** Font size: `factor` × shorter-side, never below 12. */
function fs(c, f) { return Math.max(12, Math.round(S(c) * f)); }
function px(c, f) { return Math.round(W(c) * f); }
function py(c, f) { return Math.round(H(c) * f); }

/**
 * Background gradient rect — named '__tpl_bg__' so that:
 *  - canvas.toJSON() serialises it like any normal object (no gradient-on-canvas issues)
 *  - TemplatesPanel can skip it when preserving user photos
 *  - useEditor.setCanvasSize can stretch it to always fill the resized canvas
 *
 * IMPORTANT: gradientUnits must be 'percentage' with coords 0→1.
 * Fabric.js renders gradients in the object's LOCAL coordinate space where
 * (0,0) is the CENTER of the object, not its top-left corner.  Using pixel
 * coords like {x2: W(c)} would place the gradient end-point far outside the
 * rect, making only the top-left corner visible.  Percentage coords (0→1)
 * are automatically mapped to the object's full extents by Fabric.js.
 */
function bgGrad(c, c1, c2) {
  return new fabric.Rect({
    left: 0, top: 0, width: W(c), height: H(c),
    fill: new fabric.Gradient({
      type: 'linear',
      gradientUnits: 'percentage',
      coords: { x1: 0, y1: 0, x2: 1, y2: 1 },
      colorStops: [{ offset: 0, color: c1 }, { offset: 1, color: c2 }],
    }),
    selectable: false, evented: false, strokeWidth: 0, name: '__tpl_bg__',
  });
}

function bgSolid(c, color) {
  return new fabric.Rect({
    left: 0, top: 0, width: W(c), height: H(c), fill: color,
    selectable: false, evented: false, name: '__tpl_bg__',
  });
}

function shadow(color = 'rgba(0,0,0,0.35)', blur = 8) {
  return new fabric.Shadow({ color, blur, offsetX: 2, offsetY: 2 });
}

/**
 * Left-aligned Textbox: text wraps at canvas right margin so nothing overflows.
 * Width runs from xf to 95 % of canvas width.
 */
function tL(c, str, { xf, yf, sizef, font, fill, weight = 'normal', style = 'normal', ...rest }) {
  return new fabric.Textbox(str, {
    left: px(c, xf),
    top:  py(c, yf),
    width: Math.max(60, W(c) - px(c, xf) - px(c, 0.05)),
    fontSize:   fs(c, sizef),
    fontFamily: font,
    fill,
    fontWeight: weight,
    fontStyle:  style,
    editable:   true,
    ...rest,
  });
}

/**
 * Centre-aligned Textbox: spans 90 % of canvas width, text centred inside.
 */
function tC(c, str, { yf, sizef, font, fill, weight = 'normal', style = 'normal', ...rest }) {
  return new fabric.Textbox(str, {
    left: px(c, 0.05),
    top:  py(c, yf),
    width: W(c) * 0.90,
    fontSize:   fs(c, sizef),
    fontFamily: font,
    fill,
    fontWeight: weight,
    fontStyle:  style,
    textAlign:  'center',
    editable:   true,
    ...rest,
  });
}

function clearAll(c) {
  c.clear();
  c.set('backgroundColor', '#ffffff');
}

// ── Template catalogue ────────────────────────────────────────────────────────
export const TEMPLATES = [

  // ── VACATION ──────────────────────────────────────────────────────────────

  {
    id: 'beach', name: 'Beach Getaway',
    thumb: 'linear-gradient(135deg,#f97316,#fbbf24)',
    category: 'Vacation',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#f97316', '#fbbf24'),
        tL(c, '🏖 BEACH VIBES', { xf:0.07, yf:0.30, sizef:0.09,  font:'Georgia', fill:'#fff',    weight:'bold', shadow:shadow() }),
        tL(c, 'Summer 2025',    { xf:0.10, yf:0.47, sizef:0.055, font:'Georgia', fill:'#fff3e0' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'mountains', name: 'Mountain Trip',
    thumb: 'linear-gradient(135deg,#1e3a5f,#0ea5e9)',
    category: 'Vacation',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#1e3a5f', '#0ea5e9'),
        new fabric.Triangle({ left:px(c,0.17), top:py(c,0.28), width:W(c)*0.65, height:H(c)*0.52, fill:'rgba(255,255,255,0.07)', selectable:false, evented:false }),
        tL(c, '⛰ EXPLORE',         { xf:0.07, yf:0.17, sizef:0.10, font:'Impact',  fill:'#fff' }),
        tL(c, 'The Mountains Call', { xf:0.07, yf:0.63, sizef:0.05, font:'Georgia', fill:'#bae6fd' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'city', name: 'City Escape',
    thumb: 'linear-gradient(135deg,#0f0f23,#6b21a8)',
    category: 'Vacation',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#0f0f23', '#6b21a8'),
        tL(c, '🌆 CITY ESCAPE',        { xf:0.06, yf:0.27, sizef:0.09,  font:'Arial',   fill:'#e879f9', weight:'bold' }),
        tL(c, 'Urban Adventure Awaits', { xf:0.06, yf:0.43, sizef:0.047, font:'Verdana', fill:'#d8b4fe' }),
        new fabric.Rect({ left:px(c,0.06), top:py(c,0.56), width:W(c)*0.22, height:Math.max(3,H(c)*0.006), fill:'#a855f7', selectable:false, evented:false }),
      );
      c.renderAll();
    },
  },
  {
    id: 'jungle', name: 'Jungle Safari',
    thumb: 'linear-gradient(135deg,#14532d,#84cc16)',
    category: 'Vacation',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#14532d', '#166534'),
        tL(c, '🌿 SAFARI',    { xf:0.07, yf:0.28, sizef:0.11,  font:'Impact',  fill:'#bbf7d0', weight:'bold' }),
        tL(c, 'Into the Wild', { xf:0.10, yf:0.45, sizef:0.058, font:'Georgia', fill:'#86efac' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'paris', name: 'Paris Romance',
    thumb: 'linear-gradient(135deg,#831843,#fb7185)',
    category: 'Vacation',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#831843', '#fb7185'),
        tL(c, '🗼 PARIS',        { xf:0.10, yf:0.30, sizef:0.12,  font:'Georgia', fill:'#fff1f2', weight:'bold' }),
        tL(c, 'La Ville Lumière', { xf:0.10, yf:0.47, sizef:0.055, font:'Georgia', fill:'#fecdd3', style:'italic' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'tropical', name: 'Tropical Escape',
    thumb: 'linear-gradient(135deg,#0e7490,#a3e635)',
    category: 'Vacation',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#0e7490', '#a3e635'),
        tL(c, '🌴 TROPICAL',       { xf:0.06, yf:0.30, sizef:0.10,  font:'Impact',  fill:'#fff', weight:'bold' }),
        tL(c, 'Escape to Paradise', { xf:0.07, yf:0.47, sizef:0.052, font:'Verdana', fill:'#cffafe' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'road_trip', name: 'Road Trip',
    thumb: 'linear-gradient(135deg,#1e293b,#f59e0b)',
    category: 'Vacation',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#0f172a', '#1c1917'),
        new fabric.Rect({ left:px(c,0.45), top:0, width:W(c)*0.10, height:H(c), fill:'rgba(245,158,11,0.12)', selectable:false, evented:false }),
        tL(c, '🚗 ROAD TRIP',                   { xf:0.07, yf:0.28, sizef:0.10,  font:'Impact',  fill:'#f59e0b', weight:'bold' }),
        tL(c, 'The Journey is the Destination', { xf:0.07, yf:0.45, sizef:0.038, font:'Georgia', fill:'#fde68a', style:'italic' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'ski', name: 'Ski & Snow',
    thumb: 'linear-gradient(135deg,#0ea5e9,#e0f2fe)',
    category: 'Vacation',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#0369a1', '#e0f2fe'),
        tL(c, '⛷ SKI SEASON',     { xf:0.07, yf:0.28, sizef:0.10,  font:'Impact',  fill:'#fff', weight:'bold', shadow:shadow('#0369a1',10) }),
        tL(c, 'Hit the slopes! 🏔', { xf:0.09, yf:0.46, sizef:0.052, font:'Georgia', fill:'#bae6fd', style:'italic' }),
      );
      c.renderAll();
    },
  },

  // ── FATHER'S DAY ──────────────────────────────────────────────────────────

  {
    id: 'fathers_bold', name: '#1 Dad',
    thumb: 'linear-gradient(135deg,#1e3a5f,#2563eb)',
    category: "Father's Day",
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#1e3a5f', '#1d4ed8'),
        tL(c, '#1 DAD',             { xf:0.07, yf:0.26, sizef:0.17,  font:'Impact',  fill:'#fbbf24', weight:'bold', shadow:shadow('#1e3a5f',14) }),
        tL(c, "Happy Father's Day", { xf:0.08, yf:0.50, sizef:0.057, font:'Georgia', fill:'#bae6fd', style:'italic' }),
        tL(c, '❤',                 { xf:0.08, yf:0.64, sizef:0.07,  font:'Arial',   fill:'#ef4444' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'fathers_hero', name: 'Super Dad',
    thumb: 'linear-gradient(135deg,#0f172a,#dc2626)',
    category: "Father's Day",
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#0f172a', '#450a0a'),
        new fabric.Rect({ left:0, top:py(c,0.56), width:W(c), height:H(c)*0.10, fill:'#dc2626', selectable:false, evented:false }),
        tL(c, 'SUPER',          { xf:0.06, yf:0.22, sizef:0.15, font:'Impact', fill:'#fff',    weight:'bold' }),
        tL(c, 'DAD',            { xf:0.06, yf:0.38, sizef:0.20, font:'Impact', fill:'#fbbf24', weight:'bold' }),
        tL(c, 'You are my hero', { xf:0.07, yf:0.68, sizef:0.04, font:'Georgia', fill:'#fecaca', style:'italic' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'fathers_elegant', name: "Father's Love",
    thumb: 'linear-gradient(135deg,#1c1917,#78350f)',
    category: "Father's Day",
    apply(c) {
      clearAll(c);
      const lp = { fill:'#d97706', selectable:false, evented:false };
      c.add(
        bgGrad(c, '#1c1917', '#44403c'),
        new fabric.Rect({ left:px(c,0.10), top:py(c,0.27), width:W(c)*0.80, height:1, ...lp }),
        new fabric.Rect({ left:px(c,0.10), top:py(c,0.73), width:W(c)*0.80, height:1, ...lp }),
        tL(c, 'Happy',    { xf:0.10, yf:0.30, sizef:0.065, font:'Georgia', fill:'#fef3c7', style:'italic' }),
        tL(c, "Father's", { xf:0.10, yf:0.42, sizef:0.115, font:'Georgia', fill:'#fbbf24', weight:'bold' }),
        tL(c, 'Day',      { xf:0.10, yf:0.57, sizef:0.115, font:'Georgia', fill:'#fbbf24', weight:'bold' }),
      );
      c.renderAll();
    },
  },

  // ── DIWALI ────────────────────────────────────────────────────────────────

  {
    id: 'diwali_grand', name: 'Diwali Celebration',
    thumb: 'linear-gradient(135deg,#78350f,#d97706)',
    category: 'Diwali',
    apply(c) {
      clearAll(c);
      const gp = { fill:'rgba(251,191,36,0.12)', stroke:'rgba(251,191,36,0.25)', strokeWidth:1, selectable:false, evented:false };
      const r  = S(c) * 0.07;
      c.add(
        bgGrad(c, '#1c0a00', '#78350f'),
        new fabric.Circle({ left:px(c,0.08)-r, top:py(c,0.10), radius:r, ...gp }),
        new fabric.Circle({ left:px(c,0.90)-r, top:py(c,0.10), radius:r, ...gp }),
        new fabric.Circle({ left:px(c,0.06)-r, top:py(c,0.82), radius:r, ...gp }),
        new fabric.Circle({ left:px(c,0.92)-r, top:py(c,0.80), radius:r, ...gp }),
        tC(c, '✨ DIWALI ✨',                        { yf:0.26, sizef:0.10,  font:'Georgia', fill:'#fbbf24', weight:'bold' }),
        tC(c, 'Festival of Lights',                  { yf:0.43, sizef:0.058, font:'Georgia', fill:'#fde68a', style:'italic' }),
        tC(c, 'Wishing you joy, peace & prosperity', { yf:0.57, sizef:0.033, font:'Arial',   fill:'#fef3c7' }),
        tC(c, '🪔',                                  { yf:0.70, sizef:0.09,  font:'Arial',   fill:'#f97316' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'diwali_vibrant', name: 'Shubh Deepawali',
    thumb: 'linear-gradient(135deg,#4a044e,#f97316)',
    category: 'Diwali',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#3b0764', '#7c2d12'),
        new fabric.Circle({ left:px(c,0.5)-S(c)*0.35, top:py(c,0.2), radius:S(c)*0.35, fill:'rgba(251,191,36,0.07)', selectable:false, evented:false }),
        tL(c, '🪔 दीवाली',          { xf:0.07, yf:0.28, sizef:0.105, font:'Georgia', fill:'#fbbf24', weight:'bold' }),
        tL(c, 'Shubh Deepawali',     { xf:0.07, yf:0.46, sizef:0.065, font:'Georgia', fill:'#fed7aa', style:'italic' }),
        tL(c, '✨ मंगलमय दीपावली ✨', { xf:0.07, yf:0.61, sizef:0.037, font:'Arial',   fill:'#fde68a' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'diwali_rangoli', name: 'Rangoli Glow',
    thumb: 'linear-gradient(135deg,#831843,#d97706)',
    category: 'Diwali',
    apply(c) {
      clearAll(c);
      const base = S(c) * 0.38;
      const strokes = ['rgba(251,191,36,0.18)', 'rgba(244,63,94,0.18)', 'rgba(167,139,250,0.18)'];
      c.add(bgGrad(c, '#1c0a00', '#3b0764'));
      for (let i = 3; i >= 1; i--) {
        const r = base * i / 3;
        c.add(new fabric.Circle({
          left: px(c,0.5)-r, top: py(c,0.5)-r, radius: r,
          fill: 'transparent', stroke: strokes[i-1], strokeWidth: Math.max(1, S(c)*0.004),
          selectable:false, evented:false,
        }));
      }
      c.add(
        tC(c, 'Happy Diwali',                  { yf:0.32, sizef:0.095, font:'Georgia', fill:'#fbbf24', weight:'bold', shadow:shadow('#3b0764',12) }),
        tC(c, '🪔 🪔 🪔',                       { yf:0.50, sizef:0.075, font:'Arial',   fill:'#f97316' }),
        tC(c, 'May light overcome darkness',    { yf:0.65, sizef:0.035, font:'Georgia', fill:'#fde68a', style:'italic' }),
      );
      c.renderAll();
    },
  },

  // ── ANNIVERSARY ───────────────────────────────────────────────────────────

  {
    id: 'anniversary_gold', name: 'Anniversary Gold',
    thumb: 'linear-gradient(135deg,#78350f,#fbbf24)',
    category: 'Anniversary',
    apply(c) {
      clearAll(c);
      const rp = { fill:'transparent', stroke:'rgba(251,191,36,0.22)', strokeWidth:Math.max(1,S(c)*0.005), selectable:false, evented:false };
      const r  = S(c) * 0.22;
      c.add(
        bgGrad(c, '#1c1917', '#292524'),
        new fabric.Circle({ left:px(c,0.30)-r, top:py(c,0.30)-r, radius:r, ...rp }),
        new fabric.Circle({ left:px(c,0.70)-r, top:py(c,0.30)-r, radius:r, ...rp }),
        tC(c, 'Happy Anniversary', { yf:0.30, sizef:0.072, font:'Georgia', fill:'#fbbf24', weight:'bold', style:'italic' }),
        tC(c, '💍  💍',            { yf:0.47, sizef:0.075, font:'Arial',   fill:'#fbbf24' }),
        tC(c, 'Forever & Always',  { yf:0.63, sizef:0.052, font:'Georgia', fill:'#fde68a', style:'italic' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'anniversary_rose', name: 'Forever & Always',
    thumb: 'linear-gradient(135deg,#4c0519,#9f1239)',
    category: 'Anniversary',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#4c0519', '#881337'),
        new fabric.Circle({ left:px(c,0.5)-S(c)*0.3, top:py(c,0.4)-S(c)*0.3, radius:S(c)*0.3, fill:'rgba(244,63,94,0.1)', selectable:false, evented:false }),
        tC(c, '❤',                 { yf:0.10, sizef:0.10,  font:'Arial',   fill:'#fb7185' }),
        tC(c, 'Happy',             { yf:0.28, sizef:0.065, font:'Georgia', fill:'#fecdd3', style:'italic' }),
        tC(c, 'Anniversary',       { yf:0.40, sizef:0.10,  font:'Georgia', fill:'#fff',    weight:'bold' }),
        tC(c, 'With love, always', { yf:0.58, sizef:0.045, font:'Georgia', fill:'#fda4af', style:'italic' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'anniversary_silver', name: 'Silver Jubilee',
    thumb: 'linear-gradient(135deg,#334155,#94a3b8)',
    category: 'Anniversary',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#0f172a', '#1e293b'),
        new fabric.Rect({ left:0, top:py(c,0.50), width:W(c), height:H(c)*0.01, fill:'rgba(148,163,184,0.3)', selectable:false, evented:false }),
        tC(c, '25',                       { yf:0.10, sizef:0.22,  font:'Georgia', fill:'#cbd5e1', weight:'bold' }),
        tC(c, 'Years Together',           { yf:0.44, sizef:0.065, font:'Georgia', fill:'#94a3b8', style:'italic' }),
        tC(c, 'Happy Silver Anniversary', { yf:0.60, sizef:0.04,  font:'Arial',   fill:'#64748b' }),
      );
      c.renderAll();
    },
  },

  // ── BIRTHDAY ──────────────────────────────────────────────────────────────

  {
    id: 'birthday_pop', name: 'Happy Birthday',
    thumb: 'linear-gradient(135deg,#7c3aed,#ec4899)',
    category: 'Birthday',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#4c1d95', '#831843'),
        tL(c, '🎉 HAPPY',      { xf:0.07, yf:0.22, sizef:0.095, font:'Impact', fill:'#f9a8d4', weight:'bold' }),
        tL(c, 'BIRTHDAY!',     { xf:0.07, yf:0.38, sizef:0.115, font:'Impact', fill:'#fbbf24', weight:'bold' }),
        tL(c, 'Make a wish ✨', { xf:0.10, yf:0.57, sizef:0.05,  font:'Georgia',fill:'#e9d5ff', style:'italic' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'birthday_elegant', name: 'Birthday Wishes',
    thumb: 'linear-gradient(135deg,#1e1b4b,#ec4899)',
    category: 'Birthday',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#1e1b4b', '#4a044e'),
        tC(c, '🎂',                              { yf:0.08, sizef:0.12,  font:'Arial',   fill:'#fff' }),
        tC(c, 'Happy Birthday',                  { yf:0.30, sizef:0.082, font:'Georgia', fill:'#f9a8d4', weight:'bold', style:'italic' }),
        tC(c, 'Add your name here',              { yf:0.48, sizef:0.05,  font:'Georgia', fill:'#e9d5ff' }),
        tC(c, 'Wishing you a wonderful day! 🎈', { yf:0.63, sizef:0.035, font:'Arial',   fill:'#c4b5fd' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'birthday_kids', name: 'Kids Birthday',
    thumb: 'linear-gradient(135deg,#f97316,#eab308)',
    category: 'Birthday',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#ea580c', '#ca8a04'),
        tC(c, '🎈 🎉 🎈',                  { yf:0.10, sizef:0.085, font:'Arial',   fill:'#fff' }),
        tC(c, "IT'S YOUR",                 { yf:0.28, sizef:0.075, font:'Impact',  fill:'#fff',    weight:'bold' }),
        tC(c, 'BIRTHDAY!',                 { yf:0.42, sizef:0.12,  font:'Impact',  fill:'#fef08a', weight:'bold', shadow:shadow('#7c2d12',10) }),
        tC(c, "🎂 Let's celebrate! 🎂",    { yf:0.62, sizef:0.043, font:'Georgia', fill:'#fff7ed', style:'italic' }),
      );
      c.renderAll();
    },
  },

  // ── CHRISTMAS ─────────────────────────────────────────────────────────────

  {
    id: 'christmas_warm', name: 'Merry Christmas',
    thumb: 'linear-gradient(135deg,#14532d,#991b1b)',
    category: 'Christmas',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#14532d', '#1a0a0a'),
        tC(c, '⭐',               { yf:0.04, sizef:0.09,  font:'Arial',   fill:'#fbbf24' }),
        tC(c, '🎄',               { yf:0.12, sizef:0.15,  font:'Arial',   fill:'#fff' }),
        tC(c, 'Merry Christmas',  { yf:0.49, sizef:0.08,  font:'Georgia', fill:'#fbbf24', weight:'bold', style:'italic' }),
        tC(c, '& Happy New Year', { yf:0.63, sizef:0.048, font:'Georgia', fill:'#bbf7d0', style:'italic' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'christmas_winter', name: 'Winter Wonderland',
    thumb: 'linear-gradient(135deg,#0ea5e9,#1e3a5f)',
    category: 'Christmas',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#0c4a6e', '#1e3a5f'),
        tC(c, '❄ ❄ ❄',                           { yf:0.10, sizef:0.065, font:'Arial',   fill:'#bae6fd' }),
        tC(c, 'Winter',                           { yf:0.26, sizef:0.10,  font:'Georgia', fill:'#e0f2fe', weight:'bold' }),
        tC(c, 'Wonderland',                       { yf:0.41, sizef:0.10,  font:'Georgia', fill:'#fff',    weight:'bold' }),
        tC(c, 'Wishing you a magical season 🎁', { yf:0.60, sizef:0.04,  font:'Georgia', fill:'#bae6fd', style:'italic' }),
      );
      c.renderAll();
    },
  },

  // ── NEW YEAR ──────────────────────────────────────────────────────────────

  {
    id: 'newyear_gold', name: 'Happy New Year',
    thumb: 'linear-gradient(135deg,#0f172a,#d97706)',
    category: 'New Year',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#0f172a', '#1c0a00'),
        tC(c, '2026',                         { yf:0.10, sizef:0.20,  font:'Georgia', fill:'rgba(251,191,36,0.1)', weight:'bold' }),
        tC(c, '✨ HAPPY',                     { yf:0.34, sizef:0.095, font:'Impact',  fill:'#fbbf24', weight:'bold' }),
        tC(c, 'NEW YEAR',                     { yf:0.49, sizef:0.10,  font:'Impact',  fill:'#fff',    weight:'bold' }),
        tC(c, '🎆 New beginnings await 🎆',   { yf:0.66, sizef:0.04,  font:'Georgia', fill:'#fde68a', style:'italic' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'newyear_fireworks', name: 'Countdown',
    thumb: 'linear-gradient(135deg,#312e81,#7c3aed)',
    category: 'New Year',
    apply(c) {
      clearAll(c);
      c.add(
        bgGrad(c, '#0f0f2e', '#1e1b4b'),
        tC(c, '🎆 🎇 🎆',                              { yf:0.10, sizef:0.08,  font:'Arial',   fill:'#fff' }),
        tC(c, 'Cheers to',                             { yf:0.28, sizef:0.065, font:'Georgia', fill:'#c4b5fd', style:'italic' }),
        tC(c, 'NEW YEAR!',                             { yf:0.40, sizef:0.115, font:'Impact',  fill:'#a78bfa', weight:'bold' }),
        tC(c, 'New hopes · New dreams · New chapter',  { yf:0.60, sizef:0.033, font:'Arial',   fill:'#8b5cf6' }),
      );
      c.renderAll();
    },
  },

  // ── BASIC ─────────────────────────────────────────────────────────────────

  {
    id: 'blank_white', name: 'Blank White',
    thumb: '#ffffff',
    category: 'Basic',
    apply(c) { c.clear(); c.set('backgroundColor', '#ffffff'); c.renderAll(); },
  },
  {
    id: 'blank_dark', name: 'Blank Dark',
    thumb: '#1a1a2e',
    category: 'Basic',
    apply(c) {
      clearAll(c);
      c.add(bgSolid(c, '#1a1a2e'));
      c.renderAll();
    },
  },
  {
    id: 'a4_print', name: 'A4 Print Ready',
    thumb: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)',
    category: 'Basic',
    apply(c) {
      clearAll(c);
      c.add(
        bgSolid(c, '#f8fafc'),
        tL(c, 'Your Title Here',        { xf:0.06, yf:0.07, sizef:0.055, font:'Georgia', fill:'#1e293b', weight:'bold' }),
        new fabric.Rect({ left:px(c,0.06), top:py(c,0.16), width:W(c)*0.88, height:Math.max(2,H(c)*0.003), fill:'#6366f1', selectable:false, evented:false }),
        tL(c, 'Add your content here…', { xf:0.06, yf:0.20, sizef:0.028, font:'Arial',   fill:'#475569' }),
      );
      c.renderAll();
    },
  },
];
