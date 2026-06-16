import * as fabric from 'fabric';

// ── Relative-coordinate helpers ───────────────────────────────────────────────
// All positions/sizes expressed as fractions of canvas dimensions so every
// template looks correct regardless of canvas preset (A4, Banner, 16:9 etc.)

const W  = (c) => c.getWidth();
const H  = (c) => c.getHeight();
const S  = (c) => Math.min(W(c), H(c));  // shorter side drives font scale

function fs(c, f)   { return Math.max(12, Math.round(S(c) * f)); }
function px(c, f)   { return Math.round(W(c) * f); }
function py(c, f)   { return Math.round(H(c) * f); }

function bgGrad(c, c1, c2) {
  c.set('backgroundColor', new fabric.Gradient({
    type: 'linear',
    coords: { x1: 0, y1: 0, x2: W(c), y2: H(c) },
    colorStops: [{ offset: 0, color: c1 }, { offset: 1, color: c2 }],
  }));
}

function shadow(color = 'rgba(0,0,0,0.4)', blur = 8) {
  return new fabric.Shadow({ color, blur, offsetX: 2, offsetY: 2 });
}

function tLeft(c, str, { xf, yf, sizef, font, fill, weight = 'normal', style = 'normal', ...rest }) {
  return new fabric.IText(str, {
    left: px(c, xf), top: py(c, yf),
    fontSize: fs(c, sizef), fontFamily: font,
    fill, fontWeight: weight, fontStyle: style, editable: true, ...rest,
  });
}

function tCenter(c, str, { yf, sizef, font, fill, weight = 'normal', style = 'normal', ...rest }) {
  return new fabric.IText(str, {
    left: px(c, 0.5), top: py(c, yf),
    fontSize: fs(c, sizef), fontFamily: font,
    fill, fontWeight: weight, fontStyle: style,
    originX: 'center', textAlign: 'center', editable: true, ...rest,
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
      clearAll(c); bgGrad(c, '#f97316', '#fbbf24');
      c.add(
        tLeft(c, '🏖 BEACH VIBES', { xf:0.07, yf:0.3,  sizef:0.09,  font:'Georgia', fill:'#fff',    weight:'bold', shadow:shadow() }),
        tLeft(c, 'Summer 2025',    { xf:0.1,  yf:0.46, sizef:0.055, font:'Georgia', fill:'#fff3e0' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'mountains', name: 'Mountain Trip',
    thumb: 'linear-gradient(135deg,#1e3a5f,#0ea5e9)',
    category: 'Vacation',
    apply(c) {
      clearAll(c); bgGrad(c, '#1e3a5f', '#0ea5e9');
      c.add(
        new fabric.Triangle({ left:px(c,0.17), top:py(c,0.28), width:W(c)*0.65, height:H(c)*0.52, fill:'rgba(255,255,255,0.07)', selectable:false, evented:false }),
        tLeft(c, '⛰ EXPLORE',        { xf:0.07, yf:0.17, sizef:0.1,  font:'Impact',  fill:'#fff' }),
        tLeft(c, 'The Mountains Call',{ xf:0.07, yf:0.63, sizef:0.05, font:'Georgia', fill:'#bae6fd' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'city', name: 'City Escape',
    thumb: 'linear-gradient(135deg,#0f0f23,#6b21a8)',
    category: 'Vacation',
    apply(c) {
      clearAll(c); bgGrad(c, '#0f0f23', '#6b21a8');
      c.add(
        tLeft(c, '🌆 CITY ESCAPE',       { xf:0.06, yf:0.27, sizef:0.09, font:'Arial',   fill:'#e879f9', weight:'bold' }),
        tLeft(c, 'Urban Adventure Awaits',{ xf:0.06, yf:0.43, sizef:0.047,font:'Verdana', fill:'#d8b4fe' }),
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
      clearAll(c); bgGrad(c, '#14532d', '#166534');
      c.add(
        tLeft(c, '🌿 SAFARI',   { xf:0.07, yf:0.28, sizef:0.11, font:'Impact',  fill:'#bbf7d0', weight:'bold' }),
        tLeft(c, 'Into the Wild',{ xf:0.1,  yf:0.45, sizef:0.058,font:'Georgia', fill:'#86efac' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'paris', name: 'Paris Romance',
    thumb: 'linear-gradient(135deg,#831843,#fb7185)',
    category: 'Vacation',
    apply(c) {
      clearAll(c); bgGrad(c, '#831843', '#fb7185');
      c.add(
        tLeft(c, '🗼 PARIS',       { xf:0.1, yf:0.3,  sizef:0.12,  font:'Georgia', fill:'#fff1f2', weight:'bold' }),
        tLeft(c, 'La Ville Lumière',{ xf:0.1, yf:0.47, sizef:0.055, font:'Georgia', fill:'#fecdd3', style:'italic' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'tropical', name: 'Tropical Escape',
    thumb: 'linear-gradient(135deg,#0e7490,#a3e635)',
    category: 'Vacation',
    apply(c) {
      clearAll(c); bgGrad(c, '#0e7490', '#a3e635');
      c.add(
        tLeft(c, '🌴 TROPICAL',     { xf:0.06, yf:0.3,  sizef:0.1,  font:'Impact',  fill:'#fff', weight:'bold' }),
        tLeft(c, 'Escape to Paradise',{ xf:0.07, yf:0.47, sizef:0.052,font:'Verdana', fill:'#cffafe' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'road_trip', name: 'Road Trip',
    thumb: 'linear-gradient(135deg,#1e293b,#f59e0b)',
    category: 'Vacation',
    apply(c) {
      clearAll(c); bgGrad(c, '#0f172a', '#1c1917');
      const road = new fabric.Rect({ left:px(c,0.45), top:0, width:W(c)*0.1, height:H(c), fill:'rgba(245,158,11,0.12)', selectable:false, evented:false });
      c.add(
        road,
        tLeft(c, '🚗 ROAD TRIP', { xf:0.07, yf:0.28, sizef:0.1,   font:'Impact',  fill:'#f59e0b', weight:'bold' }),
        tLeft(c, 'The Journey is the Destination', { xf:0.07, yf:0.45, sizef:0.038, font:'Georgia', fill:'#fde68a', style:'italic' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'ski', name: 'Ski & Snow',
    thumb: 'linear-gradient(135deg,#0ea5e9,#e0f2fe)',
    category: 'Vacation',
    apply(c) {
      clearAll(c); bgGrad(c, '#0369a1', '#e0f2fe');
      c.add(
        tLeft(c, '⛷ SKI SEASON', { xf:0.07, yf:0.28, sizef:0.1,   font:'Impact',  fill:'#fff', weight:'bold', shadow:shadow('#0369a1',10) }),
        tLeft(c, 'Hit the slopes! 🏔',{ xf:0.09, yf:0.46, sizef:0.052, font:'Georgia', fill:'#bae6fd', style:'italic' }),
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
      clearAll(c); bgGrad(c, '#1e3a5f', '#1d4ed8');
      c.add(
        tLeft(c,  '#1 DAD',          { xf:0.07, yf:0.26, sizef:0.17, font:'Impact',  fill:'#fbbf24', weight:'bold', shadow:shadow('#1e3a5f',14) }),
        tLeft(c,  "Happy Father's Day",{ xf:0.08, yf:0.5,  sizef:0.057,font:'Georgia', fill:'#bae6fd', style:'italic' }),
        tLeft(c,  '❤',               { xf:0.08, yf:0.64, sizef:0.07, font:'Arial',   fill:'#ef4444' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'fathers_hero', name: 'Super Dad',
    thumb: 'linear-gradient(135deg,#0f172a,#dc2626)',
    category: "Father's Day",
    apply(c) {
      clearAll(c); bgGrad(c, '#0f172a', '#450a0a');
      c.add(
        new fabric.Rect({ left:0, top:py(c,0.56), width:W(c), height:H(c)*0.1, fill:'#dc2626', selectable:false, evented:false }),
        tLeft(c, 'SUPER',      { xf:0.06, yf:0.22, sizef:0.15, font:'Impact', fill:'#fff',    weight:'bold' }),
        tLeft(c, 'DAD',        { xf:0.06, yf:0.38, sizef:0.2,  font:'Impact', fill:'#fbbf24', weight:'bold' }),
        tLeft(c, 'You are my hero', { xf:0.07, yf:0.68, sizef:0.04, font:'Georgia', fill:'#fecaca', style:'italic' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'fathers_elegant', name: "Father's Love",
    thumb: 'linear-gradient(135deg,#1c1917,#78350f)',
    category: "Father's Day",
    apply(c) {
      clearAll(c); bgGrad(c, '#1c1917', '#44403c');
      const lineProps = { fill:'#d97706', selectable:false, evented:false };
      c.add(
        new fabric.Rect({ left:px(c,0.1), top:py(c,0.27), width:W(c)*0.8, height:1, ...lineProps }),
        new fabric.Rect({ left:px(c,0.1), top:py(c,0.73), width:W(c)*0.8, height:1, ...lineProps }),
        tLeft(c, 'Happy',    { xf:0.1, yf:0.3,  sizef:0.065, font:'Georgia', fill:'#fef3c7', style:'italic' }),
        tLeft(c, "Father's", { xf:0.1, yf:0.42, sizef:0.115, font:'Georgia', fill:'#fbbf24', weight:'bold' }),
        tLeft(c, 'Day',      { xf:0.1, yf:0.57, sizef:0.115, font:'Georgia', fill:'#fbbf24', weight:'bold' }),
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
      clearAll(c); bgGrad(c, '#1c0a00', '#78350f');
      // Corner glow circles
      const glowColor = 'rgba(251,191,36,0.12)';
      const glowProps = { fill:glowColor, stroke:'rgba(251,191,36,0.25)', strokeWidth:1, selectable:false, evented:false };
      for (const [xf,yf] of [[0.08,0.1],[0.9,0.1],[0.06,0.82],[0.92,0.8]]) {
        c.add(new fabric.Circle({ left:px(c,xf)-S(c)*0.07, top:py(c,yf), radius:S(c)*0.07, ...glowProps }));
      }
      c.add(
        tCenter(c, '✨ DIWALI ✨',                    { yf:0.26, sizef:0.1,  font:'Georgia', fill:'#fbbf24', weight:'bold' }),
        tCenter(c, 'Festival of Lights',              { yf:0.43, sizef:0.058,font:'Georgia', fill:'#fde68a', style:'italic' }),
        tCenter(c, 'Wishing you joy, peace & prosperity', { yf:0.57, sizef:0.033,font:'Arial',   fill:'#fef3c7' }),
        tCenter(c, '🪔',                              { yf:0.7,  sizef:0.09, font:'Arial',   fill:'#f97316' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'diwali_vibrant', name: 'Shubh Deepawali',
    thumb: 'linear-gradient(135deg,#4a044e,#f97316)',
    category: 'Diwali',
    apply(c) {
      clearAll(c); bgGrad(c, '#3b0764', '#7c2d12');
      c.add(
        new fabric.Circle({ left:px(c,0.5)-S(c)*0.35, top:py(c,0.2), radius:S(c)*0.35, fill:'rgba(251,191,36,0.07)', selectable:false, evented:false }),
        tLeft(c, '🪔 दीवाली',         { xf:0.07, yf:0.28, sizef:0.105,font:'Georgia', fill:'#fbbf24', weight:'bold' }),
        tLeft(c, 'Shubh Deepawali',    { xf:0.07, yf:0.46, sizef:0.065,font:'Georgia', fill:'#fed7aa', style:'italic' }),
        tLeft(c, '✨ मंगलमय दीपावली ✨', { xf:0.07, yf:0.61, sizef:0.037,font:'Arial',   fill:'#fde68a' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'diwali_rangoli', name: 'Rangoli Glow',
    thumb: 'linear-gradient(135deg,#831843,#d97706)',
    category: 'Diwali',
    apply(c) {
      clearAll(c); bgGrad(c, '#1c0a00', '#3b0764');
      // Rangoli-inspired concentric circles
      const baseRadius = S(c) * 0.38;
      for (let i = 3; i >= 1; i--) {
        c.add(new fabric.Circle({
          left: px(c,0.5) - baseRadius*i/3, top: py(c,0.5) - baseRadius*i/3,
          radius: baseRadius*i/3,
          fill: 'transparent',
          stroke: `rgba(${i===3?'251,191,36':i===2?'244,63,94':'167,139,250'},0.18)`,
          strokeWidth: Math.max(1, S(c)*0.004),
          selectable:false, evented:false,
        }));
      }
      c.add(
        tCenter(c, 'Happy Diwali',  { yf:0.32, sizef:0.095,font:'Georgia', fill:'#fbbf24', weight:'bold', shadow:shadow('#3b0764',12) }),
        tCenter(c, '🪔 🪔 🪔',      { yf:0.5,  sizef:0.075,font:'Arial',   fill:'#f97316' }),
        tCenter(c, 'May light overcome darkness', { yf:0.65, sizef:0.035,font:'Georgia', fill:'#fde68a', style:'italic' }),
      );
      c.renderAll();
    },
  },

  // ── MARRIAGE ANNIVERSARY ──────────────────────────────────────────────────

  {
    id: 'anniversary_gold', name: 'Anniversary Gold',
    thumb: 'linear-gradient(135deg,#78350f,#fbbf24)',
    category: 'Anniversary',
    apply(c) {
      clearAll(c); bgGrad(c, '#1c1917', '#292524');
      const rProps = { fill:'transparent', stroke:'rgba(251,191,36,0.2)', strokeWidth:Math.max(1,S(c)*0.005), selectable:false, evented:false };
      c.add(
        new fabric.Circle({ left:px(c,0.3)-S(c)*0.22, top:py(c,0.3)-S(c)*0.22, radius:S(c)*0.22, ...rProps }),
        new fabric.Circle({ left:px(c,0.7)-S(c)*0.22, top:py(c,0.3)-S(c)*0.22, radius:S(c)*0.22, ...rProps }),
        tCenter(c, 'Happy Anniversary',  { yf:0.3,  sizef:0.072, font:'Georgia', fill:'#fbbf24', weight:'bold', style:'italic' }),
        tCenter(c, '💍  💍',             { yf:0.47, sizef:0.075, font:'Arial',   fill:'#fbbf24' }),
        tCenter(c, 'Forever & Always',   { yf:0.63, sizef:0.052, font:'Georgia', fill:'#fde68a', style:'italic' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'anniversary_rose', name: 'Forever & Always',
    thumb: 'linear-gradient(135deg,#4c0519,#9f1239)',
    category: 'Anniversary',
    apply(c) {
      clearAll(c); bgGrad(c, '#4c0519', '#881337');
      c.add(
        new fabric.Circle({ left:px(c,0.5)-S(c)*0.3, top:py(c,0.4)-S(c)*0.3, radius:S(c)*0.3, fill:'rgba(244,63,94,0.1)', selectable:false, evented:false }),
        tCenter(c, '❤',           { yf:0.1,  sizef:0.1,  font:'Arial',   fill:'#fb7185' }),
        tCenter(c, 'Happy',       { yf:0.28, sizef:0.065,font:'Georgia', fill:'#fecdd3', style:'italic' }),
        tCenter(c, 'Anniversary', { yf:0.4,  sizef:0.1,  font:'Georgia', fill:'#fff',    weight:'bold' }),
        tCenter(c, 'With love, always', { yf:0.58, sizef:0.045, font:'Georgia', fill:'#fda4af', style:'italic' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'anniversary_silver', name: 'Silver Jubilee',
    thumb: 'linear-gradient(135deg,#334155,#94a3b8)',
    category: 'Anniversary',
    apply(c) {
      clearAll(c); bgGrad(c, '#0f172a', '#1e293b');
      c.add(
        new fabric.Rect({ left:0, top:py(c,0.5), width:W(c), height:H(c)*0.01, fill:'rgba(148,163,184,0.3)', selectable:false, evented:false }),
        tCenter(c, '25',                    { yf:0.1,  sizef:0.22, font:'Georgia', fill:'#cbd5e1', weight:'bold' }),
        tCenter(c, 'Years Together',         { yf:0.44, sizef:0.065,font:'Georgia', fill:'#94a3b8', style:'italic' }),
        tCenter(c, 'Happy Silver Anniversary',{ yf:0.6,  sizef:0.04, font:'Arial',   fill:'#64748b' }),
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
      clearAll(c); bgGrad(c, '#4c1d95', '#831843');
      c.add(
        tLeft(c, '🎉 HAPPY',    { xf:0.07, yf:0.22, sizef:0.095,font:'Impact', fill:'#f9a8d4', weight:'bold' }),
        tLeft(c, 'BIRTHDAY!',  { xf:0.07, yf:0.38, sizef:0.115,font:'Impact', fill:'#fbbf24', weight:'bold' }),
        tLeft(c, 'Make a wish ✨', { xf:0.1,  yf:0.57, sizef:0.05, font:'Georgia', fill:'#e9d5ff', style:'italic' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'birthday_elegant', name: 'Birthday Wishes',
    thumb: 'linear-gradient(135deg,#1e1b4b,#ec4899)',
    category: 'Birthday',
    apply(c) {
      clearAll(c); bgGrad(c, '#1e1b4b', '#4a044e');
      c.add(
        tCenter(c, '🎂',              { yf:0.08, sizef:0.12, font:'Arial',   fill:'#fff' }),
        tCenter(c, 'Happy Birthday',  { yf:0.3,  sizef:0.082,font:'Georgia', fill:'#f9a8d4', weight:'bold', style:'italic' }),
        tCenter(c, 'Add your name here', { yf:0.48, sizef:0.05, font:'Georgia', fill:'#e9d5ff' }),
        tCenter(c, 'Wishing you a wonderful day! 🎈', { yf:0.63, sizef:0.035, font:'Arial', fill:'#c4b5fd' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'birthday_kids', name: 'Kids Birthday',
    thumb: 'linear-gradient(135deg,#f97316,#eab308)',
    category: 'Birthday',
    apply(c) {
      clearAll(c); bgGrad(c, '#ea580c', '#ca8a04');
      c.add(
        tCenter(c, '🎈 🎉 🎈',   { yf:0.1,  sizef:0.085,font:'Arial',   fill:'#fff' }),
        tCenter(c, 'IT\'S YOUR', { yf:0.28, sizef:0.075,font:'Impact',  fill:'#fff',    weight:'bold' }),
        tCenter(c, 'BIRTHDAY!',  { yf:0.42, sizef:0.12, font:'Impact',  fill:'#fef08a', weight:'bold', shadow:shadow('#7c2d12',10) }),
        tCenter(c, '🎂 Let\'s celebrate! 🎂', { yf:0.62, sizef:0.043, font:'Georgia', fill:'#fff7ed', style:'italic' }),
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
      clearAll(c); bgGrad(c, '#14532d', '#1a0a0a');
      c.add(
        tCenter(c, '⭐', { yf:0.04, sizef:0.09, font:'Arial', fill:'#fbbf24' }),
        tCenter(c, '🎄', { yf:0.12, sizef:0.15, font:'Arial', fill:'#fff' }),
        tCenter(c, 'Merry Christmas',  { yf:0.49, sizef:0.08,  font:'Georgia', fill:'#fbbf24', weight:'bold', style:'italic' }),
        tCenter(c, '& Happy New Year', { yf:0.63, sizef:0.048, font:'Georgia', fill:'#bbf7d0', style:'italic' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'christmas_winter', name: 'Winter Wonderland',
    thumb: 'linear-gradient(135deg,#0ea5e9,#1e3a5f)',
    category: 'Christmas',
    apply(c) {
      clearAll(c); bgGrad(c, '#0c4a6e', '#1e3a5f');
      c.add(
        tCenter(c, '❄ ❄ ❄',            { yf:0.1,  sizef:0.065,font:'Arial',   fill:'#bae6fd' }),
        tCenter(c, 'Winter',            { yf:0.26, sizef:0.1,  font:'Georgia', fill:'#e0f2fe', weight:'bold' }),
        tCenter(c, 'Wonderland',        { yf:0.41, sizef:0.1,  font:'Georgia', fill:'#fff',    weight:'bold' }),
        tCenter(c, 'Wishing you a magical season 🎁', { yf:0.6, sizef:0.04, font:'Georgia', fill:'#bae6fd', style:'italic' }),
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
      clearAll(c); bgGrad(c, '#0f172a', '#1c0a00');
      // Large ghost year watermark
      const ghost = tCenter(c, '2026', { yf:0.1, sizef:0.2, font:'Georgia', fill:'rgba(251,191,36,0.1)', weight:'bold' });
      c.add(
        ghost,
        tCenter(c, '✨ HAPPY',    { yf:0.34, sizef:0.095,font:'Impact', fill:'#fbbf24', weight:'bold' }),
        tCenter(c, 'NEW YEAR',    { yf:0.49, sizef:0.1,  font:'Impact', fill:'#fff',    weight:'bold' }),
        tCenter(c, '🎆 New beginnings await 🎆', { yf:0.66, sizef:0.04, font:'Georgia', fill:'#fde68a', style:'italic' }),
      );
      c.renderAll();
    },
  },
  {
    id: 'newyear_fireworks', name: 'Countdown',
    thumb: 'linear-gradient(135deg,#312e81,#7c3aed)',
    category: 'New Year',
    apply(c) {
      clearAll(c); bgGrad(c, '#0f0f2e', '#1e1b4b');
      c.add(
        tCenter(c, '🎆 🎇 🎆',    { yf:0.1,  sizef:0.08, font:'Arial',   fill:'#fff' }),
        tCenter(c, 'Cheers to',    { yf:0.28, sizef:0.065,font:'Georgia', fill:'#c4b5fd', style:'italic' }),
        tCenter(c, 'NEW YEAR!',    { yf:0.4,  sizef:0.115,font:'Impact',  fill:'#a78bfa', weight:'bold' }),
        tCenter(c, 'New hopes · New dreams · New chapter', { yf:0.6, sizef:0.033, font:'Arial', fill:'#8b5cf6' }),
      );
      c.renderAll();
    },
  },

  // ── BASIC ─────────────────────────────────────────────────────────────────

  {
    id: 'blank_white', name: 'Blank White',
    thumb: '#ffffff',
    category: 'Basic',
    apply(c) {
      c.clear(); c.set('backgroundColor', '#ffffff'); c.renderAll();
    },
  },
  {
    id: 'blank_dark', name: 'Blank Dark',
    thumb: '#1a1a2e',
    category: 'Basic',
    apply(c) {
      c.clear(); c.set('backgroundColor', '#1a1a2e'); c.renderAll();
    },
  },
  {
    id: 'a4_print', name: 'A4 Print Ready',
    thumb: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)',
    category: 'Basic',
    apply(c) {
      clearAll(c);
      c.add(
        tLeft(c, 'Your Title Here',      { xf:0.06, yf:0.07, sizef:0.055,font:'Georgia', fill:'#1e293b', weight:'bold' }),
        new fabric.Rect({ left:px(c,0.06), top:py(c,0.16), width:W(c)*0.88, height:Math.max(2,H(c)*0.003), fill:'#6366f1', selectable:false, evented:false }),
        tLeft(c, 'Add your content here...', { xf:0.06, yf:0.2, sizef:0.028, font:'Arial', fill:'#475569' }),
      );
      c.renderAll();
    },
  },
];
