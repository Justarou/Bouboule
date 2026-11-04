/* ===== Bibliothèque de personnages (SVG) =====
   Origine locale : pieds au sol en (0,0), le corps monte vers les y négatifs.
   Chaque fabrique renvoie { g, pose(st), cy, hover, w, mouth:{x,y} }.          */
var CHARS = (function () {
  var NS = 'http://www.w3.org/2000/svg';
  function mk(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function put(parent, html) { parent.insertAdjacentHTML('beforeend', html); }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function cl(x, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, x)); }

  /* bouche : courbe fermée selon l'humeur (s: -1 triste .. 1 content) et l'ouverture (o) */
  function mouthD(w, y0, s, o, r) {
    return 'M' + (-w) + ' ' + y0 + ' Q0 ' + (y0 + r * s + r * 3.6 * o).toFixed(1) + ' ' + w + ' ' + y0 +
      ' Q0 ' + (y0 + r / 2 * s).toFixed(1) + ' ' + (-w) + ' ' + y0 + 'Z';
  }

  /* émotions : mood (-1..1), rot (+ fâché / - triste), lift (sourcils), wide (yeux), open (bouche), cheek, squint */
  var EMO = {
    neutral:  { mood: .15, rot: 0,   lift: 0,  wide: 1,    open: 0,   cheek: 1,   squint: 0 },
    happy:    { mood: .95, rot: -4,  lift: -2, wide: 1,    open: 0,   cheek: 1.2, squint: 0 },
    laugh:    { mood: 1,   rot: -8,  lift: -3, wide: 1,    open: .55, cheek: 1.5, squint: .6 },
    sad:      { mood: -.85, rot: -26, lift: 1, wide: 1,    open: 0,   cheek: .6,  squint: 0 },
    angry:    { mood: -.55, rot: 26,  lift: 3, wide: .95,  open: 0,   cheek: .4,  squint: .15 },
    scared:   { mood: -.35, rot: -18, lift: -7, wide: 1.18, open: .5,  cheek: .5,  squint: 0 },
    surprised:{ mood: 0,   rot: 0,   lift: -8, wide: 1.2,  open: .8,  cheek: 1,   squint: 0 },
    shy:      { mood: .4,  rot: -14, lift: -1, wide: 1,    open: 0,   cheek: 1.8, squint: 0 },
    worried:  { mood: -.3, rot: -14, lift: -3, wide: 1.05, open: 0,   cheek: .8,  squint: 0 },
    proud:    { mood: .8,  rot: 6,   lift: -2, wide: 1,    open: 0,   cheek: 1.3, squint: .25 },
    curious:  { mood: .3, rot: 5,   lift: -5, wide: 1.1,  open: .12, cheek: 1,   squint: 0 },
    tired:    { mood: -.2, rot: -12, lift: 3,  wide: .8,  open: 0,   cheek: .7,  squint: .55 },
    amazed:   { mood: .9, rot: -4,  lift: -9, wide: 1.26, open: .35, cheek: 1.4, squint: 0 },
    embarrassed:{ mood: .25, rot: -16, lift: -1, wide: 1, open: 0,   cheek: 2.3, squint: 0 },
    dizzy:    { mood: -.1, rot: 0,   lift: -2, wide: 1.1,  open: .2,  cheek: 1,   squint: 0 },
    asleep:   { mood: .35, rot: -10, lift: 3,  wide: .7,  open: 0,   cheek: 1.1, squint: 1 }   /* EV-005 : yeux fermés, il dort */
  };

  /* ----- visage générique ----- */
  function buildFace(g, f) {
    var line = f.line || '#3a1a10', eyes = '';
    function eye(cls, sx) {
      var s = '<g class="' + cls + '" transform="translate(' + sx * f.ex + ' ' + f.ey + ')">';
      if (f.dark) {
        s += '<ellipse class="eW" rx="' + f.er + '" ry="' + f.ery + '" fill="' + f.dark + '"/>' +
          '<circle class="hi" cx="' + (f.er * .32) + '" cy="' + (-f.ery * .32) + '" r="' + (f.er * .34) + '" fill="' + (f.glow || '#fff') + '"/>';
      } else {
        s += '<ellipse class="eW" rx="' + f.er + '" ry="' + f.ery + '" fill="#fff" stroke="' + line + '" stroke-width="2.4"/>' +
          '<circle class="pu" cx="0" cy="0" r="' + f.pr + '" fill="' + (f.pupil || '#2a1410') + '"/>' +
          '<circle class="hi" cx="2" cy="-3" r="' + (f.pr * .36) + '" fill="#fff"/>';
      }
      return s + '</g>';
    }
    var h = '';
    h += '<ellipse class="chL" cx="' + (-f.cx) + '" cy="' + f.cy + '" rx="' + f.chr + '" ry="' + (f.chr * .8) + '" fill="' + (f.cheek || '#ff5f7e') + '" opacity=".6"/>';
    h += '<ellipse class="chR" cx="' + f.cx + '" cy="' + f.cy + '" rx="' + f.chr + '" ry="' + (f.chr * .8) + '" fill="' + (f.cheek || '#ff5f7e') + '" opacity=".6"/>';
    h += eye('eL', -1) + eye('eR', 1);
    h += '<path class="bL" d="M' + (-f.brw) + ' 0 Q0 -4.5 ' + f.brw + ' 0" fill="none" stroke="' + (f.browC || line) + '" stroke-width="' + (f.browW || 3.4) + '" stroke-linecap="round" transform="translate(' + (-f.ex) + ' ' + f.br + ')"/>';
    h += '<path class="bR" d="M' + (-f.brw) + ' 0 Q0 -4.5 ' + f.brw + ' 0" fill="none" stroke="' + (f.browC || line) + '" stroke-width="' + (f.browW || 3.4) + '" stroke-linecap="round" transform="translate(' + f.ex + ' ' + f.br + ')"/>';
    h += '<clipPath id="' + f.id + 'mc"><path class="mclip" d=""/></clipPath>';
    h += '<path class="mo" d="" fill="' + (f.mouthC || '#5a1420') + '" stroke="' + (f.mouthS || '#3a0c14') + '" stroke-width="1.8" stroke-linejoin="round"/>';
    h += '<ellipse class="tg" cx="0" cy="' + (f.my + 4) + '" rx="' + (f.mw * .55) + '" ry="3.6" fill="#ff7a90" clip-path="url(#' + f.id + 'mc)"/>';
    put(g, h);
    var q = function (c) { return g.querySelector('.' + c); };
    var R = { eL: q('eL'), eR: q('eR'), bL: q('bL'), bR: q('bR'), mo: q('mo'), mclip: q('mclip'), tg: q('tg'), chL: q('chL'), chR: q('chR'), f: f };
    R.pu = [R.eL.querySelector('.pu'), R.eR.querySelector('.pu')];
    R.hi = [R.eL.querySelector('.hi'), R.eR.querySelector('.hi')];
    R.eW = [R.eL.querySelector('.eW'), R.eR.querySelector('.eW')];
    return R;
  }

  /* applique l'état du visage : st = {emo, open, lx, ly, blink, t} */
  function poseFace(R, st) {
    var f = R.f, E = EMO[st.emo] || EMO.neutral;
    if (st.emoPrev && st.emoK !== undefined && st.emoK < 1 && EMO[st.emoPrev] && st.emoPrev !== st.emo) { var E0 = EMO[st.emoPrev], k = st.emoK, B = {}; for (var kk in E) B[kk] = E0[kk] + (E[kk] - E0[kk]) * k; E = B; }
    var o = Math.max(E.open, st.open || 0);
    var wide = E.wide, sq = E.squint, bl = st.blinkAmt !== undefined ? st.blinkAmt : (st.blink ? 1 : 0);
    var ey = Math.max(.07, (1 - sq * .5) * (1 - .93 * bl)); if (sq >= 1) ey = .07;   /* EV-005 : yeux vraiment fermés (endormi) */
    var tf = function (sx) { return 'translate(' + (sx * f.ex) + ' ' + f.ey + ') scale(' + wide.toFixed(2) + ' ' + (wide * ey).toFixed(2) + ')'; };
    R.eL.setAttribute('transform', tf(-1));
    R.eR.setAttribute('transform', tf(1));
    var lx = (st.lx || 0), ly = (st.ly || 0), rng = f.er * .42;
    for (var i = 0; i < 2; i++) {
      if (R.pu[i]) {
        R.pu[i].setAttribute('cx', (lx * rng).toFixed(1));
        R.pu[i].setAttribute('cy', (ly * f.ery * .4 + (E.wide > 1.1 ? 0 : 0)).toFixed(1));
        R.pu[i].setAttribute('r', (f.pr * (E.wide > 1.1 ? .72 : 1)).toFixed(1));
        R.hi[i].setAttribute('cx', (lx * rng + f.pr * .35).toFixed(1));
        R.hi[i].setAttribute('cy', (ly * f.ery * .4 - f.pr * .5).toFixed(1));
      } else {
        R.hi[i].setAttribute('transform', 'translate(' + (lx * f.er * .35).toFixed(1) + ' ' + (ly * f.ery * .3).toFixed(1) + ')');
      }
    }
    var rot = E.rot, lift = E.lift;
    R.bL.setAttribute('transform', 'translate(' + (-f.ex) + ' ' + (f.br + lift) + ') rotate(' + rot + ')');
    R.bR.setAttribute('transform', 'translate(' + f.ex + ' ' + (f.br + lift) + ') rotate(' + (-rot) + ')');
    var d = mouthD(f.mw * (E.open > .4 ? .8 : 1) * (st.mw || 1), f.my, E.mood, o, f.mr || 6);
    R.mo.setAttribute('d', d); R.mclip.setAttribute('d', d);
    R.tg.setAttribute('opacity', (o > .12 || E.mood > .5) ? 1 : 0);
    R.tg.setAttribute('cy', (f.my + 3.5 + o * 6.5).toFixed(1));
    var ch = (.45 * E.cheek).toFixed(2);
    R.chL.setAttribute('opacity', ch); R.chR.setAttribute('opacity', ch);
  }

  /* ================= BOUBOULE ================= */
  function bouboule() {
    var g = mk('g', {});
    put(g, '<defs><radialGradient id="bbG" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="#ffbf8a"/><stop offset=".45" stop-color="#ff7a3d"/><stop offset="1" stop-color="#df5018"/></radialGradient></defs>' +
      '<g class="armL" transform="translate(-37 -36)"><ellipse cx="0" cy="13" rx="9" ry="15" fill="#ff7a3d" stroke="#8a2f12" stroke-width="3.2"/></g>' +
      '<g class="armR" transform="translate(37 -36)"><ellipse cx="0" cy="13" rx="9" ry="15" fill="#ff7a3d" stroke="#8a2f12" stroke-width="3.2"/></g>' +
      '<ellipse cx="-16" cy="-4" rx="13" ry="7.5" fill="#7a2a1a"/><ellipse cx="16" cy="-4" rx="13" ry="7.5" fill="#7a2a1a"/>' +
      '<g class="top" transform="translate(0 -76)"><path d="M0 2 q-5 -14 4 -23" fill="none" stroke="#2f6a2a" stroke-width="3.6" stroke-linecap="round"/><path d="M4 -21 q15 -9 21 4 q-13 9 -21 -4Z" fill="#6fd16a" stroke="#2f6a2a" stroke-width="2.2" stroke-linejoin="round"/></g>' +
      '<ellipse class="body" cx="0" cy="-40" rx="41" ry="38" fill="url(#bbG)" stroke="#8a2f12" stroke-width="3.6"/>' +
      '<ellipse class="soot" cx="0" cy="-40" rx="39" ry="36" fill="#2a2420" opacity="0"/>' +
      '<ellipse cx="-15" cy="-62" rx="14" ry="7" fill="#fff" opacity=".42" transform="rotate(-22 -15 -62)"/><ellipse cx="-27" cy="-50" rx="3.5" ry="2.4" fill="#fff" opacity=".4"/>');
    var F = buildFace(g, { id: 'fb', ex: 14, ey: -48, er: 10.5, ery: 12.5, pr: 5.6, br: -65, brw: 10, line: '#8a2f12', browW: 3.6, my: -29, mw: 10, mr: 6, cx: 28, cy: -29, chr: 6.5 });
    return { g: g, face: F, cy: -40, hover: 0, w: 90, h: 92, mouth: { x: 0, y: -29 }, topEl: g.querySelector('.top'),
      arms: [g.querySelector('.armL'), g.querySelector('.armR')], armBase: [[-37, -36], [37, -36]], armRest: 16,
      soot: g.querySelector('.soot'), col: '#ff8a3d' };
  }

  /* ================= PITOU (étoile) ================= */
  function starPath(R, r) { var s = ''; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r : R; s += (i ? 'L' : 'M') + (Math.cos(a) * rad).toFixed(1) + ' ' + (Math.sin(a) * rad).toFixed(1); } return s + 'Z'; }
  function pitou() {
    var g = mk('g', {});
    put(g, '<defs><radialGradient id="ptG" cx=".4" cy=".35" r=".8"><stop class="s0" offset="0" stop-color="#fff6b0"/><stop class="s1" offset="1" stop-color="#ffc21f"/></radialGradient>' +
      '<radialGradient id="ptGl"><stop offset="0" stop-color="#fff6b0" stop-opacity="1"/><stop offset="1" stop-color="#ffd23f" stop-opacity="0"/></radialGradient></defs>' +
      '<circle class="glow" cx="0" cy="-40" r="80" fill="url(#ptGl)" opacity="0"/>' +
      '<ellipse cx="-13" cy="-2" rx="9" ry="5" fill="#d98a1a" stroke="#7a4a0a" stroke-width="2.4"/><ellipse cx="13" cy="-2" rx="9" ry="5" fill="#d98a1a" stroke="#7a4a0a" stroke-width="2.4"/>' +
      '<g class="armL" transform="translate(-38 -40)"><ellipse cx="-4" cy="8" rx="7" ry="11" fill="#ffc21f" stroke="#c98a10" stroke-width="3" transform="rotate(8)"/></g>' +
      '<g class="armR" transform="translate(38 -40)"><ellipse cx="4" cy="8" rx="7" ry="11" fill="#ffc21f" stroke="#c98a10" stroke-width="3" transform="rotate(-8)"/></g>' +
      '<g class="starg" transform="translate(0 -42)"><path class="shape" d="' + starPath(40, 19) + '" fill="url(#ptG)" stroke="#c98a10" stroke-width="6" stroke-linejoin="round"/>' +
      '<ellipse cx="-9" cy="-20" rx="9" ry="4.5" fill="#fff" opacity=".4" transform="rotate(-28 -9 -20)"/></g>');
    var inner = mk('g', { transform: 'translate(0 -42)' }, g);
    var F = buildFace(inner, { id: 'fp', ex: 10, ey: -1, er: 5.6, ery: 7.2, pr: 3.8, br: -12, brw: 6, line: '#7a4a0a', browW: 2.6, my: 10, mw: 6.5, mr: 4, cx: 19, cy: 8, chr: 4.4, pupil: '#2a1410' });
    put(g, '<g class="flare" opacity="0" transform="translate(0 -42)"><ellipse rx="46" ry="2.4" fill="#fff"/><ellipse rx="2.4" ry="46" fill="#fff"/></g>');
    return { g: g, face: F, cy: -42, hover: 0, w: 90, h: 92, mouth: { x: 0, y: -32 }, glow: g.querySelector('.glow'),
      arms: [g.querySelector('.armL'), g.querySelector('.armR')], armBase: [[-38, -40], [38, -40]], armRest: 8, flare: g.querySelector('.flare'),
      stops: [g.querySelector('.s0'), g.querySelector('.s1')], shape: g.querySelector('.shape'), col: '#ffd23f' };
  }

  /* ================= GRINCHEUX (nuage) ================= */
  function grincheux() {
    var g = mk('g', {});
    var CC = [[-70, 12, 40], [-24, -18, 54], [38, -10, 48], [80, 14, 36], [-100, 32, 24], [104, 34, 26]], o = '', f = '', hi = '';
    CC.forEach(function (c, i) {
      o += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + (c[2] + 3.6) + '"/>';
      f += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '"/>';
      if (i < 4) hi += '<circle cx="' + (c[0] - c[2] * .26) + '" cy="' + (c[1] - c[2] * .3) + '" r="' + (c[2] * .55) + '"/>';
    });
    put(g, '<g transform="translate(0 -95) scale(.78)">' +
      '<g class="cOut" fill="#2b3558"><rect x="-111.5" y="6.5" width="233" height="53" rx="26.5"/>' + o + '</g>' +
      '<g class="cFill" fill="#f2f6fd"><rect x="-108" y="10" width="226" height="46" rx="23"/>' + f + '</g>' +
      '<ellipse cx="5" cy="43" rx="98" ry="12" fill="#1b2a55" opacity=".16"/>' +
      '<g class="cHi" fill="#fff" opacity=".5">' + hi + '</g>' +
      '<g class="cface" transform="translate(5 8)"></g></g>');
    var face = g.querySelector('.cface');
    var F = buildFace(face, { id: 'fg', ex: 26, ey: 0, er: 8, ery: 9.5, dark: '#26324f', br: -17, brw: 15, line: '#26324f', browW: 5.5, my: 30, mw: 15, mr: 9, mouthC: '#26324f', mouthS: '#26324f', cx: 48, cy: 16, chr: 10, cheek: '#ff8fa3' });
    var host = g.querySelector('g');
    host.style.transformOrigin = '0 0';
    return { g: g, face: F, cy: -75, hover: 0, w: 170, h: 100, mouth: { x: 0, y: -62 }, scaleHost: host,
      fill: g.querySelector('.cFill'), out: g.querySelector('.cOut'), hi: g.querySelector('.cHi'), arms: [], col: '#9aa7c8', noFeet: true };
  }

  /* ================= ROBI (robot) ================= */
  function robi() {
    var g = mk('g', {});
    put(g, '<defs><linearGradient id="rbG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6fe0ee"/><stop offset=".55" stop-color="#34aac8"/><stop offset="1" stop-color="#25809f"/></linearGradient></defs>' +
      '<g class="arms"></g>' +
      '<g class="armL" transform="translate(-35 -50)"><rect x="-4" y="0" width="8" height="26" rx="4" fill="#9fb8c6" stroke="#1b4a63" stroke-width="3"/><circle cx="0" cy="28" r="8" fill="#ffb347" stroke="#8a4a12" stroke-width="3"/></g>' +
      '<g class="armR" transform="translate(35 -50)"><rect x="-4" y="0" width="8" height="26" rx="4" fill="#9fb8c6" stroke="#1b4a63" stroke-width="3"/><circle cx="0" cy="28" r="8" fill="#ffb347" stroke="#8a4a12" stroke-width="3"/></g>' +
      '<g class="wheels"><rect x="-38" y="-17" width="76" height="17" rx="8.5" fill="#46566b" stroke="#1b2a3a" stroke-width="3.2"/><circle cx="-22" cy="-8.5" r="8" fill="#2a3848" stroke="#1b2a3a" stroke-width="2.4"/><circle cx="22" cy="-8.5" r="8" fill="#2a3848" stroke="#1b2a3a" stroke-width="2.4"/>' +
      '<g class="whl"><path d="M-22 -14 v11 M-27.5 -8.5 h11" stroke="#9fb0c4" stroke-width="2.4"/></g><g class="whr"><path d="M22 -14 v11 M16.5 -8.5 h11" stroke="#9fb0c4" stroke-width="2.4"/></g></g>' +
      '<g class="ant"><line x1="0" y1="-88" x2="0" y2="-106" stroke="#1b4a63" stroke-width="3.6" stroke-linecap="round"/><circle class="lamp" cx="0" cy="-110" r="6.5" fill="#ff5f5f" stroke="#7a1f1f" stroke-width="2.6"/></g>' +
      '<rect x="-36" y="-88" width="72" height="72" rx="17" fill="url(#rbG)" stroke="#1b4a63" stroke-width="3.8"/>' +
      '<circle cx="-40" cy="-60" r="5.5" fill="#9fb8c6" stroke="#1b4a63" stroke-width="2.6"/><circle cx="40" cy="-60" r="5.5" fill="#9fb8c6" stroke="#1b4a63" stroke-width="2.6"/>' +
      '<rect x="-28" y="-80" width="56" height="38" rx="11" fill="#11283a" stroke="#1b4a63" stroke-width="2.6"/>' +
      '<ellipse cx="-14" cy="-84" rx="9" ry="3.4" fill="#fff" opacity=".35"/>' +
      '<rect x="-17" y="-38" width="34" height="18" rx="5" fill="#1d6482" stroke="#1b4a63" stroke-width="2.2"/><circle cx="-8" cy="-29" r="3.6" fill="#ff7a7a"/><circle cx="2" cy="-29" r="3.6" fill="#ffd23f"/><circle cx="12" cy="-29" r="3.6" fill="#7aff9a"/>');
    var inner = mk('g', { transform: 'translate(0 -4)' }, g);
    var F = buildFace(inner, { id: 'fr', ex: 12, ey: -62, er: 6.6, ery: 8, dark: '#7ff3ff', glow: '#eaffff', br: -76, brw: 7, line: '#7ff3ff', browW: 3, my: -49, mw: 8, mr: 5, mouthC: '#7ff3ff', mouthS: '#7ff3ff', cx: 20, cy: -52, chr: 0.01, cheek: '#fff' });
    return { g: g, face: F, cy: -50, hover: 0, w: 90, h: 112, mouth: { x: 0, y: -52 }, lamp: g.querySelector('.lamp'), ant: g.querySelector('.ant'),
      arms: [g.querySelector('.armL'), g.querySelector('.armR')], armBase: [[-35, -50], [35, -50]], armRest: 14, wheels: [g.querySelector('.whl'), g.querySelector('.whr')], col: '#6fe0ee', robot: true };
  }

  /* ================= FLAMME (petit dragon) ================= */
  function flamme() {
    var g = mk('g', {});
    put(g, '<defs><radialGradient id="fmG" cx=".4" cy=".3" r=".85"><stop offset="0" stop-color="#a6ec8a"/><stop offset=".5" stop-color="#56bf5a"/><stop offset="1" stop-color="#33913f"/></radialGradient></defs>' +
      '<g class="wingL" transform="translate(-30 -58)"><path d="M0 0 Q-34 -18 -40 -42 Q-18 -38 -8 -26 Q-14 -10 0 6Z" fill="#ffb347" stroke="#9a5a12" stroke-width="3" stroke-linejoin="round"/></g>' +
      '<g class="wingR" transform="translate(30 -58)"><path d="M0 0 Q34 -18 40 -42 Q18 -38 8 -26 Q14 -10 0 6Z" fill="#ffb347" stroke="#9a5a12" stroke-width="3" stroke-linejoin="round"/></g>' +
      '<g class="tail"><path d="M30 -14 Q62 -8 66 -34 Q70 -44 60 -48 Q64 -30 40 -26Z" fill="#46b552" stroke="#1f5a2c" stroke-width="3.4" stroke-linejoin="round"/><path d="M60 -48 L72 -54 L68 -40Z" fill="#ffb347" stroke="#9a5a12" stroke-width="2.4" stroke-linejoin="round"/></g>' +
      '<g class="armL" transform="translate(-36 -34)"><ellipse cx="-3" cy="9" rx="7.5" ry="11" fill="#56bf5a" stroke="#1f5a2c" stroke-width="3" transform="rotate(10)"/></g>' +
      '<g class="armR" transform="translate(36 -34)"><ellipse cx="3" cy="9" rx="7.5" ry="11" fill="#56bf5a" stroke="#1f5a2c" stroke-width="3" transform="rotate(-10)"/></g>' +
      '<ellipse cx="-17" cy="-4" rx="14" ry="8" fill="#3fa84a" stroke="#1f5a2c" stroke-width="3"/><ellipse cx="17" cy="-4" rx="14" ry="8" fill="#3fa84a" stroke="#1f5a2c" stroke-width="3"/>' +
      '<path d="M-26 -72 L-18 -92 L-10 -74Z M-8 -78 L0 -100 L8 -78Z M10 -74 L18 -92 L26 -72Z" fill="#ffb347" stroke="#9a5a12" stroke-width="2.8" stroke-linejoin="round"/>' +
      '<path d="M-24 -66 L-34 -90 L-12 -72Z" fill="#fff2c0" stroke="#9a5a12" stroke-width="2.8" stroke-linejoin="round" opacity="0"/>' +
      '<ellipse class="body" cx="0" cy="-38" rx="42" ry="38" fill="url(#fmG)" stroke="#1f5a2c" stroke-width="3.8"/>' +
      '<ellipse cx="0" cy="-26" rx="26" ry="24" fill="#fff0b8" opacity=".95"/>' +
      '<path d="M-14 -16 H14 M-16 -24 H16 M-15 -32 H15" stroke="#e8cf86" stroke-width="2.4" stroke-linecap="round"/>' +
      '<ellipse cx="-14" cy="-60" rx="14" ry="7" fill="#fff" opacity=".4" transform="rotate(-22 -14 -60)"/>' +
      '<g class="horns"><path d="M-22 -72 Q-30 -86 -20 -92 Q-16 -80 -14 -74Z" fill="#fff2c0" stroke="#9a5a12" stroke-width="2.6" stroke-linejoin="round"/><path d="M22 -72 Q30 -86 20 -92 Q16 -80 14 -74Z" fill="#fff2c0" stroke="#9a5a12" stroke-width="2.6" stroke-linejoin="round"/></g>' +
      '<ellipse cx="0" cy="-33" rx="19" ry="12" fill="#8fe07a" stroke="#2f7a3a" stroke-width="2"/><circle cx="-6" cy="-36" r="1.8" fill="#1f5a2c"/><circle cx="6" cy="-36" r="1.8" fill="#1f5a2c"/>');
    var F = buildFace(g, { id: 'ff', ex: 16, ey: -50, er: 9.5, ery: 11.5, pr: 5.2, br: -66, brw: 9, line: '#1f5a2c', browW: 3.4, my: -25, mw: 8, mr: 5, cx: 30, cy: -34, chr: 6, cheek: '#ff8a7a' });
    return { g: g, face: F, cy: -38, hover: 0, w: 100, h: 100, mouth: { x: 0, y: -26 }, tail: g.querySelector('.tail'), wings: [g.querySelector('.wingL'), g.querySelector('.wingR')],
      arms: [g.querySelector('.armL'), g.querySelector('.armR')], armBase: [[-36, -34], [36, -34]], armRest: 14, col: '#56bf5a' };
  }

  /* relief v2 : ombre de forme (AO) + lumière de contour intérieure, clonées depuis la forme principale */
  function volume(g, sel, kind, col) {
    var el = g.querySelector(sel); if (!el) return;
    var par = el.parentNode, isG = el.tagName === 'g';
    var defs = '<defs><linearGradient id="ao_' + kind + '" x1="0" y1="0" x2="0" y2="1"><stop offset=".4" stop-color="' + col + '" stop-opacity="0"/><stop offset="1" stop-color="' + col + '" stop-opacity=".34"/></linearGradient>' +
      '<linearGradient id="rim_' + kind + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".32" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".4"/></linearGradient>' +
      '<clipPath id="rc_' + kind + '"></clipPath></defs>';
    par.insertAdjacentHTML('beforeend', defs);
    var clip = par.querySelector('#rc_' + kind);
    var ao = el.cloneNode(true), rim = el.cloneNode(true), cc = el.cloneNode(true);
    [ao, rim, cc].forEach(function (n) { n.removeAttribute('class'); n.removeAttribute('id'); });
    function setFill(n, f, s, sw) { n.setAttribute('fill', f); n.setAttribute('stroke', s); if (sw) n.setAttribute('stroke-width', sw); n.setAttribute('opacity', 1); n.setAttribute('pointer-events', 'none'); }
    if (isG) {
      [ao, rim].forEach(function (n) { n.setAttribute('opacity', 1); });
      ao.setAttribute('fill', 'url(#ao_' + kind + ')'); ao.querySelectorAll('*').forEach(function (e) { e.removeAttribute('fill'); e.setAttribute('pointer-events', 'none'); });
      el.parentNode.insertBefore(ao, el.nextSibling);
      return;
    }
    setFill(ao, 'url(#ao_' + kind + ')', 'none');
    setFill(rim, 'none', 'url(#rim_' + kind + ')', 5.5);
    clip.appendChild(cc); rim.setAttribute('clip-path', 'url(#rc_' + kind + ')');
    var after = el.nextSibling; par.insertBefore(ao, after); par.insertBefore(rim, ao.nextSibling);
  }
  function wrap(fn, sel, kind, col) { return function () { var r = fn(); if (CHARS.V2) volume(r.g, sel, kind, col); return r; }; }
  var LIB = {
    bouboule: { make: wrap(bouboule, '.body', 'bb', '#7a2a10'), name: 'Bouboule', color: '#ff8a3d' },
    pitou: { make: wrap(pitou, '.shape', 'pt', '#a86a0a'), name: 'Pitou', color: '#ffd23f', hover: 0 },
    grincheux: { make: wrap(grincheux, '.cFill', 'gr', '#2b3a6e'), name: 'Grincheux', color: '#9aa7c8', hover: 0 },
    robi: { make: wrap(robi, 'rect[fill="url(#rbG)"]', 'rb', '#0f3a52'), name: 'Robi', color: '#4fd0e4' },
    flamme: { make: wrap(flamme, '.body', 'fm', '#1f5a2c'), name: 'Flamme', color: '#56bf5a' }
  };

  return { LIB: LIB, poseFace: poseFace, EMO: EMO, mouthD: mouthD, mk: mk, put: put };
})();
