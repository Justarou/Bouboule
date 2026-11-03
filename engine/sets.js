/* ===== Décors : ciel commun + « sets » (colline, forêt) ===== */
var SETS = (function () {
  var NS = 'http://www.w3.org/2000/svg';
  function mk(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  function put(parent, html) { parent.insertAdjacentHTML('beforeend', html); }
  var rnd = function (i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  function lerp(a, b, k) { return a + (b - a) * k; }
  function rgb(a) { return 'rgb(' + Math.round(a[0]) + ',' + Math.round(a[1]) + ',' + Math.round(a[2]) + ')'; }
  function mixc(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }
  function sparkD(R) { return 'M0 ' + (-R) + ' L' + (R * .2) + ' ' + (-R * .2) + ' L' + R + ' 0 L' + (R * .2) + ' ' + (R * .2) + ' L0 ' + R + ' L' + (-R * .2) + ' ' + (R * .2) + ' L' + (-R) + ' 0 L' + (-R * .2) + ' ' + (-R * .2) + 'Z'; }

  var PAL = {
    day:   { top: [95, 188, 255], bot: [205, 238, 255], sun: 1, moon: 0, night: 0, gloom: 0, tint: [255, 255, 255, 0] },
    dusk:  { top: [96, 120, 190], bot: [255, 190, 140], sun: .25, moon: 0, night: .1, gloom: .1, tint: [255, 170, 110, .1] },
    gloom: { top: [104, 118, 148], bot: [190, 200, 219], sun: 0, moon: 0, night: .1, gloom: 1, tint: [80, 95, 130, .28] },
    night: { top: [14, 26, 64], bot: [59, 79, 140], sun: 0, moon: 1, night: .5, gloom: .3, tint: [10, 20, 70, .5] },
    dawn:  { top: [140, 150, 215], bot: [255, 205, 170], sun: .5, moon: 0, night: .05, gloom: 0, tint: [255, 190, 150, .12] }
  };
  function skyAt(K, t) {
    var i = 1;
    while (i < K.length && t >= K[i][0]) i++;
    if (i >= K.length) return PAL[K[K.length - 1][1]];
    var a = K[i - 1], b = K[i], u = Math.max(0, Math.min(1, (t - a[0]) / Math.max(.001, b[0] - a[0])));
    u = u * u * (3 - 2 * u);
    var pa = PAL[a[1]], pb = PAL[b[1]], j, r = { top: [], bot: [], tint: [] };
    for (j = 0; j < 3; j++) { r.top[j] = lerp(pa.top[j], pb.top[j], u); r.bot[j] = lerp(pa.bot[j], pb.bot[j], u); }
    for (j = 0; j < 4; j++) r.tint[j] = lerp(pa.tint[j], pb.tint[j], u);
    r.sun = lerp(pa.sun, pb.sun, u); r.moon = lerp(pa.moon, pb.moon, u); r.night = lerp(pa.night, pb.night, u); r.gloom = lerp(pa.gloom, pb.gloom, u);
    return r;
  }

  /* ---------- ciel commun ---------- */
  function buildSky(layer) {
    put(layer,
      '<defs><linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop class="s1" offset="0" stop-color="#5fbcff"/><stop class="s2" offset="1" stop-color="#cdeeff"/></linearGradient>' +
      '<radialGradient id="sunG"><stop offset="0" stop-color="#fff2a8" stop-opacity=".95"/><stop offset="1" stop-color="#ffd23f" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="moonG"><stop offset="0" stop-color="#eef2ff" stop-opacity=".6"/><stop offset="1" stop-color="#9fb4ff" stop-opacity="0"/></radialGradient></defs>' +
      '<rect x="-500" y="-900" width="1800" height="2300" fill="url(#skyG)"/>' +
      '<g class="stars" fill="#fff"></g>' +
      '<g class="moon" opacity="0" transform="translate(690 85)"><circle r="80" fill="url(#moonG)"/><circle r="32" fill="#fdf3c0"/><circle cx="-10" cy="-8" r="6" fill="#ecdc9a"/><circle cx="11" cy="6" r="8" fill="#ecdc9a"/><circle cx="-6" cy="14" r="4" fill="#ecdc9a"/></g>' +
      '<g class="sun" transform="translate(690 80)"><circle r="190" fill="url(#sunG)" opacity=".55"/><circle r="110" fill="url(#sunG)"/><g class="rays" stroke="#fff6c0" stroke-width="9" stroke-linecap="round" opacity=".28"></g>' +
      '<circle r="36" fill="#fff4b8"/><circle r="30" fill="#ffe27a"/><circle cx="-7" cy="-7" r="14" fill="#fff9d6" opacity=".7"/></g>' +
      '<g class="beams"></g><g class="dcl"></g><g class="birds" fill="none" stroke="#2a3558" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></g>');
    var q = function (c) { return layer.querySelector('.' + c); };
    var i, R = { s1: q('s1'), s2: q('s2'), sun: q('sun'), moon: q('moon'), rays: q('rays') };
    for (i = 0; i < 12; i++) { var an = i * 30 * Math.PI / 180; mk('line', { x1: Math.cos(an) * 52, y1: Math.sin(an) * 52, x2: Math.cos(an) * 92, y2: Math.sin(an) * 92 }, R.rays); }
    R.stars = []; for (i = 0; i < 90; i++) R.stars.push(mk('circle', { cx: rnd(i) * 1100 - 150, cy: rnd(i + 100) * 330 - 130, r: .9 + rnd(i + 200) * 1.5 }, q('stars')));
    R.beams = []; for (i = 0; i < 7; i++) { var bx = 40 + i * 110; R.beams.push(mk('polygon', { points: '690,80 ' + (bx - 24) + ',450 ' + (bx + 24) + ',450', fill: '#fff6c8', opacity: 0 }, q('beams'))); }
    var DCL = [{ x: 60, y: 62, s: 1, v: 5 }, { x: 330, y: 36, s: .8, v: 3.5 }, { x: 540, y: 96, s: 1.15, v: 4.5 }, { x: -90, y: 128, s: .7, v: 6 }, { x: 720, y: 30, s: .9, v: 2.5 },
      { x: 200, y: -80, s: 1.1, v: 3 }, { x: 600, y: -150, s: .9, v: 4 }, { x: 420, y: -30, s: .8, v: 5 }];
    R.dcl = DCL.map(function (c) {
      var g = mk('g', {}, q('dcl'));
      var sh = mk('g', {}, g), lit = mk('g', { transform: 'translate(-3 -6) scale(.93)' }, g);
      [sh, lit].forEach(function (gg) {
        [[-34, 6, 20], [-8, -6, 28], [22, -2, 24], [44, 8, 17]].forEach(function (p) { mk('circle', { cx: p[0], cy: p[1], r: p[2] }, gg); });
        mk('rect', { x: -54, y: 4, width: 116, height: 20, rx: 10 }, gg);
      });
      return { g: g, sh: sh, lit: lit, c: c };
    });
    R.birds = []; for (i = 0; i < 4; i++) R.birds.push(mk('path', { d: 'M-9 0 Q-4.5 -7 0 0 Q4.5 -7 9 0' }, q('birds')));
    R.update = function (t, S, o) {
      var nightF = Math.max(0, Math.min(1, (S.night - .2) / .3));
      R.s1.setAttribute('stop-color', rgb(S.top)); R.s2.setAttribute('stop-color', rgb(S.bot));
      R.sun.setAttribute('opacity', S.sun.toFixed(3)); R.rays.setAttribute('transform', 'rotate(' + (t * 15).toFixed(1) + ')');
      R.moon.setAttribute('opacity', S.moon.toFixed(3));
      R.stars.forEach(function (c, i) { c.setAttribute('opacity', (nightF * (.5 + .5 * Math.sin(t * 3 + i * 1.7))).toFixed(2)); });
      var bm = o.beams || 0;
      R.beams.forEach(function (b, i) { b.setAttribute('opacity', (.17 * bm * (.65 + .35 * Math.sin(t * 1.4 + i * 1.3))).toFixed(3)); });
      var dcol = mixc(mixc([255, 255, 255], [150, 160, 182], S.gloom), [70, 82, 136], nightF);
      R.dcl.forEach(function (d, i) {
        var x = ((d.c.x + t * d.c.v + 160) % 1120) - 160;
        d.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + (d.c.y + 3 * Math.sin(t * .6 + i)).toFixed(1) + ') scale(' + d.c.s + ')');
        d.lit.setAttribute('fill', rgb(dcol)); d.sh.setAttribute('fill', rgb(mixc(dcol, [138, 160, 214], .5 * (1 - S.gloom * .6)))); d.g.setAttribute('opacity', ((.92 - .4 * nightF) * (o.cloudsOn === 0 ? 0 : 1)).toFixed(2));
      });
      var bf = (o.birds || 0) * Math.max(0, Math.min(1, S.sun * 1.3));
      R.birds.forEach(function (b, i) {
        var x = ((t * (34 + i * 7) + i * 210) % 1000) - 100, y = 70 + i * 26 + 10 * Math.sin(t * 1.3 + i), fl = Math.sin(t * 9 + i * 2);
        b.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(1 ' + (.55 + .45 * fl).toFixed(2) + ')'); b.setAttribute('opacity', bf.toFixed(2));
      });
    };
    return R;
  }

  /* ---------- arbres (3 tons, style dessin animé moderne) ---------- */
  function tree3(x, y, s, p) {
    var d = p[0], m = p[1], l = p[2];
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<ellipse cx="6" cy="3" rx="30" ry="6" fill="#14532d" opacity=".22"/>' +
      '<path d="M-4 4 L-3 -26 L4 -26 L5 4Z" fill="#7b4f33"/><path d="M1 4 L1.5 -26 L4 -26 L5 4Z" fill="#5e3a24"/>' +
      '<circle cx="-14" cy="-34" r="17" fill="' + d + '"/><circle cx="14" cy="-34" r="17" fill="' + d + '"/><circle cx="0" cy="-48" r="21" fill="' + d + '"/>' +
      '<circle cx="-10" cy="-38" r="14" fill="' + m + '"/><circle cx="10" cy="-40" r="13" fill="' + m + '"/><circle cx="0" cy="-52" r="16" fill="' + m + '"/>' +
      '<circle cx="-5" cy="-48" r="9" fill="' + l + '"/><circle cx="8" cy="-52" r="7" fill="' + l + '"/><circle cx="-12" cy="-40" r="5" fill="' + l + '" opacity=".8"/></g>';
  }
  var TREEP = [['#2f9e6b', '#46bd82', '#8be3a6'], ['#3aa877', '#58c98c', '#a6efb8'], ['#4cb883', '#6fd69c', '#bff6c8']];
  function grassTufts(layer, n, y0, spread, cols) {
    var arr = [];
    for (var i = 0; i < n; i++) {
      var g = mk('g', {}, layer);
      mk('path', { d: 'M-7 0 Q-6 -12 -9 -21 Q-2 -12 0 0 Q1 -17 6 -25 Q6 -10 8 0 Q4 -9 2 -14 Q1 -6 0 0Z', fill: cols[i % cols.length] }, g);
      arr.push({ g: g, x: -40 + i * (880 / n) + rnd(i) * 10, y: y0 + rnd(i + 7) * spread, s: .8 + rnd(i + 3) * .8, i: i });
    }
    return arr;
  }

  /* ---------- SET : colline ---------- */
  function colline(back, front) {
    var P = [], i;
    var gf = mk('g', {}, back), gm = mk('g', {}, back), gn = mk('g', {}, back), gh = mk('g', {}, back);
    P.push([gf, .22], [gm, .55], [gn, .86]);
    put(gf,
      '<defs><linearGradient id="cm1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fa6e0"/><stop offset="1" stop-color="#d3e3fa"/></linearGradient>' +
      '<linearGradient id="cm2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c98d6"/><stop offset="1" stop-color="#bcd2f1"/></linearGradient>' +
      '<linearGradient id="chA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a5e9b4"/><stop offset=".5" stop-color="#6fcf94"/><stop offset="1" stop-color="#4fb67f"/></linearGradient>' +
      '<linearGradient id="chB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ce39c"/><stop offset=".55" stop-color="#4fc283"/><stop offset="1" stop-color="#2f9f6c"/></linearGradient>' +
      '<linearGradient id="chH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9eefd" stop-opacity="0"/><stop offset="1" stop-color="#e8f6ff" stop-opacity=".9"/></linearGradient>' +
      '<linearGradient id="cgF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#58c58b"/><stop offset=".5" stop-color="#46b681"/><stop offset="1" stop-color="#37a06f"/></linearGradient></defs>' +
      '<path d="M-300 292 L-210 226 L-130 270 L-60 292 L40 214 L100 262 L180 180 L262 266 L340 208 L420 272 L508 190 L600 268 L682 200 L772 262 L866 212 L950 262 L1100 226 V1200 H-300Z" fill="url(#cm1)"/>' +
      '<path d="M180 180 L158 208 L172 202 L182 214 L193 202 L205 209Z M508 190 L486 220 L499 213 L509 225 L520 213 L532 221Z M682 200 L664 224 L675 218 L683 229 L692 218 L702 224Z" fill="#fff" opacity=".85"/>' +
      '<path d="M180 180 L262 266 L222 266 L190 210Z M508 190 L600 268 L560 268 L520 212Z M40 214 L100 262 L72 262 L50 228Z" fill="#6f87c8" opacity=".25"/>' +
      '<path d="M-300 318 L-190 262 L-90 300 L10 252 L120 306 L240 258 L350 308 L470 246 L580 304 L700 256 L830 306 L960 262 L1100 300 V1200 H-300Z" fill="url(#cm2)" opacity=".95"/>' +
      '<rect x="-300" y="240" width="1400" height="120" fill="url(#chH)"/>');
    var far = ''; for (i = 0; i < 12; i++) far += tree3(-240 + i * 125 + rnd(i) * 40, 322 + rnd(i + 4) * 6, .42 + rnd(i + 2) * .12, TREEP[0]);
    put(gm,
      '<path d="M-300 346 Q110 296 250 330 T520 318 T1100 306 V1200 H-300Z" fill="url(#chA)"/>' +
      '<path d="M-300 346 Q110 296 250 330 T520 318 T1100 306" fill="none" stroke="#e8ffd9" stroke-width="3.5" opacity=".75"/>' + far +
      '<ellipse cx="160" cy="352" rx="110" ry="9" fill="#2f9f6c" opacity=".16"/><ellipse cx="540" cy="338" rx="130" ry="8" fill="#2f9f6c" opacity=".16"/><ellipse cx="860" cy="332" rx="120" ry="8" fill="#2f9f6c" opacity=".16"/>');
    var windmill = '<g transform="translate(78 330)"><path d="M-15 0 L-10 -52 L10 -52 L15 0Z" fill="#f4e9d6"/><path d="M4 0 L7 -52 L10 -52 L15 0Z" fill="#d9c7a8"/><path d="M-12 -52 L0 -68 L12 -52Z" fill="#c8563f"/><path d="M0 -68 L12 -52 L5 -52Z" fill="#9c3f2e"/><rect x="-5" y="-17" width="10" height="17" rx="5" fill="#7b4f33"/>' +
      '<g transform="translate(0 -54)"><g class="wm">';
    for (i = 0; i < 4; i++) windmill += '<g transform="rotate(' + (i * 90) + ')"><rect x="-1.8" y="-40" width="3.6" height="40" fill="#7b4f33"/><rect x="1.8" y="-38" width="11" height="25" fill="#fffaf0" stroke="#c9b698" stroke-width="1.2"/></g>';
    windmill += '</g><circle r="4.5" fill="#c8563f"/></g></g>';
    var house = '<g transform="translate(748 332)"><ellipse cx="6" cy="3" rx="46" ry="7" fill="#14532d" opacity=".2"/><rect x="-30" y="-34" width="60" height="34" fill="#ffe9bf"/><rect x="8" y="-34" width="22" height="34" fill="#f2cf98"/><rect x="14" y="-62" width="9" height="22" fill="#a8604a"/><rect x="19" y="-62" width="4" height="22" fill="#8c4a38"/>' +
      '<polygon points="-37,-34 0,-64 37,-34" fill="#e0614e"/><polygon points="0,-64 37,-34 8,-34" fill="#bb4638"/>' +
      '<rect class="cwin" x="-23" y="-27" width="16" height="16" rx="2" fill="#a9d0ee" stroke="#7b4f33" stroke-width="2"/><line x1="-15" y1="-27" x2="-15" y2="-11" stroke="#7b4f33" stroke-width="1.6"/><line x1="-23" y1="-19" x2="-7" y2="-19" stroke="#7b4f33" stroke-width="1.6"/><rect x="6" y="-23" width="14" height="23" rx="7" fill="#7b4f33"/><circle cx="16" cy="-11" r="1.4" fill="#ffd23f"/><g class="smoke" fill="#fff" transform="translate(18 -64)"></g></g>';
    var nearT = tree3(215, 342, 1.05, TREEP[1]) + tree3(345, 334, .9, TREEP[2]) + tree3(470, 331, .95, TREEP[1]) + tree3(595, 330, .8, TREEP[2]) + tree3(655, 323, .7, TREEP[1]) + tree3(-55, 346, 1.15, TREEP[1]) + tree3(905, 332, 1.05, TREEP[2]);
    put(gn,
      '<path d="M-300 388 Q250 336 500 382 T1100 364 V1200 H-300Z" fill="url(#chB)"/>' +
      '<path d="M-300 388 Q250 336 500 382 T1100 364" fill="none" stroke="#d6ffd0" stroke-width="4.5" opacity=".7"/>' +
      '<path d="M310 436 Q360 396 450 392 Q540 388 600 400 Q520 402 470 410 Q400 420 370 440Z" fill="#e9d59a" opacity=".55"/>' +
      windmill + house + nearT +
      '<ellipse cx="140" cy="398" rx="70" ry="7" fill="#1f7a52" opacity=".18"/><ellipse cx="690" cy="392" rx="90" ry="7" fill="#1f7a52" opacity=".18"/>' +
      '<g transform="translate(58 384)"><rect x="-3" y="-34" width="6" height="42" rx="2" fill="#7b4f33"/><g transform="rotate(-4 0 -40)"><rect x="-35" y="-60" width="70" height="29" rx="4" fill="#efc582" stroke="#7b4f33" stroke-width="2.4"/><rect x="-35" y="-38" width="70" height="7" fill="#d9a85f" opacity=".5"/>' +
      '<text y="-47" font-size="10" font-family="Baloo 2, Arial Rounded MT Bold, Arial, sans-serif" font-weight="800" text-anchor="middle" fill="#5a3418">Colline</text><text y="-36" font-size="10" font-family="Baloo 2, Arial Rounded MT Bold, Arial, sans-serif" font-weight="800" text-anchor="middle" fill="#5a3418">des Rigolos</text></g></g>' +
      '<rect class="tintB" x="-500" y="-900" width="1800" height="2300" fill="#fff" opacity="0"/>');
    put(front,
      '<rect class="gstrip" x="-300" y="410" width="1600" height="900" fill="url(#cgF)"/><path d="M-300 410 Q200 402 420 410 T1100 408" fill="none" stroke="#8fe5ad" stroke-width="3.5" opacity=".75"/><g class="tufts"></g><g class="flowers"></g>' +
      '<g transform="translate(196 433)"><rect x="-4" y="-8" width="8" height="12" rx="3" fill="#fff3dc"/><path d="M-14 -7 Q0 -26 14 -7Z" fill="#e8453c"/><path d="M0 -7 Q8 -20 14 -7Z" fill="#c43430"/><circle cx="-5" cy="-13" r="2" fill="#fff"/><circle cx="4" cy="-15" r="2.4" fill="#fff"/></g>' +
      '<g class="ffs"></g><g class="motes" fill="#fffbe0"></g>');
    var qb = function (c) { return back.querySelector('.' + c); }, qf = function (c) { return front.querySelector('.' + c); };
    var R = { wm: qb('wm'), cwin: qb('cwin'), gstrip: qf('gstrip'), groundCol: [55, 166, 116], birds: 1, cloudsOn: 1, par: P };
    R.smoke = []; for (i = 0; i < 4; i++) R.smoke.push(mk('circle', { r: 5, opacity: 0 }, qb('smoke')));
    R.tufts = grassTufts(qf('tufts'), 70, 414, 40, ['#3fae7c', '#4fc08a', '#6fd6a0', '#45b583']);
    R.flowers = [];
    [50, 120, 250, 380, 520, 660, 730, 775, -20, 850, 300, 590].forEach(function (x, i) {
      var g = mk('g', {}, qf('flowers'));
      put(g, '<line x1="0" y1="46" x2="0" y2="0" stroke="#2a8a5c" stroke-width="3.6" stroke-linecap="round"/><path d="M0 30 q-14 -4 -18 -14 q14 -2 18 14Z" fill="#3aa874"/>');
      var col = ['#ff5f7e', '#ffd23f', '#ffffff', '#b185db', '#ff924c', '#ff5f7e', '#ffd23f', '#fff', '#b185db', '#ff5f7e', '#ffd23f', '#ff924c'][i];
      for (var k = 0; k < 5; k++) { var a2 = k * 72 * Math.PI / 180; mk('circle', { cx: Math.cos(a2) * 7.5, cy: Math.sin(a2) * 7.5, r: 5.6, fill: col }, g); mk('circle', { cx: Math.cos(a2) * 7.5 - 1.5, cy: Math.sin(a2) * 7.5 - 1.5, r: 2.4, fill: '#fff', opacity: .45 }, g); }
      mk('circle', { r: 4.2, fill: '#ffb703' }, g); mk('circle', { cx: -1, cy: -1, r: 1.6, fill: '#ffe08a' }, g);
      R.flowers.push({ g: g, x: x, y: 432 + (i % 3) * 8 });
    });
    R.ffs = []; for (i = 0; i < 18; i++) { var fg = mk('g', {}, qf('ffs')); mk('circle', { r: 9, fill: '#fff3a0', opacity: .25 }, fg); mk('circle', { r: 2.4, fill: '#fff8c0' }, fg); R.ffs.push(fg); }
    R.motes = []; for (i = 0; i < 22; i++) R.motes.push(mk('circle', { r: 1.2 + rnd(i + 90) * 1.8 }, qf('motes')));
    R.update = function (t, S, o) {
      var nightF = Math.max(0, Math.min(1, (S.night - .2) / .3));
      R.wm.setAttribute('transform', 'rotate(' + (t * 38).toFixed(1) + ')');
      var wg = Math.max(0, Math.min(1, S.night * 2.2 + S.gloom * .5));
      R.cwin.setAttribute('fill', rgb(mixc([169, 208, 238], [255, 214, 110], wg)));
      R.smoke.forEach(function (c, i) {
        var ag = ((t * .45 + i * .25) % 1);
        c.setAttribute('cx', (ag * 14 + 3 * Math.sin(t * 2 + i)).toFixed(1)); c.setAttribute('cy', (-ag * 46).toFixed(1)); c.setAttribute('r', (4 + ag * 9).toFixed(1)); c.setAttribute('opacity', ((1 - ag) * .55 * (1 - nightF * .4)).toFixed(2));
      });
      var gt = mixc(R.groundCol, S.tint, S.tint[3]); R.gstrip.setAttribute('fill', 'url(#cgF)'); R.gstrip.setAttribute('opacity', 1);
      R.tufts.forEach(function (f) { f.g.setAttribute('transform', 'translate(' + f.x.toFixed(1) + ' ' + f.y.toFixed(1) + ') rotate(' + (5 * Math.sin(t * 1.8 + f.i)).toFixed(1) + ') scale(' + f.s.toFixed(2) + ')'); });
      R.flowers.forEach(function (f, i) { f.g.setAttribute('transform', 'translate(' + f.x + ' ' + f.y + ') rotate(' + (6 * Math.sin(t * 2 + i)).toFixed(1) + ' 0 46) translate(0 -46)'); });
      var ffo = Math.max(0, Math.min(1, S.night * 2.2));
      R.ffs.forEach(function (g, i) {
        var x = rnd(i + 40) * 800 + 30 * Math.sin(t * .5 + i), y = 300 + rnd(i + 70) * 120 + 14 * Math.sin(t * .8 + i * 1.7), s = Math.sin(t * 3 + i * 2.1);
        g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); g.setAttribute('opacity', (ffo * (.45 + .55 * s * s)).toFixed(2));
      });
      var dayF = Math.max(0, 1 - S.night * 1.8 - S.gloom * .7);
      R.motes.forEach(function (c, i) {
        var x = ((rnd(i + 11) * 900 - 40 + t * (6 + 5 * rnd(i + 30))) % 900), y = 440 - ((rnd(i + 51) * 250 + t * (9 + 6 * rnd(i + 70))) % 250) + 12 * Math.sin(t + i);
        c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); c.setAttribute('opacity', (dayF * (.25 + .35 * Math.sin(t * 1.6 + i * 2) * Math.sin(t * 1.6 + i * 2))).toFixed(2));
      });
    };
    return R;
  }

  /* ---------- SET : forêt enchantée ---------- */
  function pine(x, y, s, c1, c2) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="-6" y="-30" width="12" height="40" fill="#7a4e2e"/><path d="M0 -150 L-34 -78 H-16 L-46 -30 H-22 L-56 12 H56 L22 -30 H46 L16 -78 H34Z" fill="' + c1 + '"/><path d="M0 -150 L-18 -100 L0 -108 L16 -98Z" fill="' + c2 + '" opacity=".6"/></g>';
  }
  function foret(back, front) {
    var far = '', mid = '', near = '', i;
    for (i = 0; i < 12; i++) far += pine(-120 + i * 100 + rnd(i) * 30, 300, .9 + rnd(i + 3) * .3, '#4f9a86', '#79c7b1');
    for (i = 0; i < 10; i++) mid += pine(-80 + i * 105 + rnd(i + 20) * 40, 350, 1.25 + rnd(i + 9) * .4, '#2f8460', '#58b88a');
    for (i = 0; i < 6; i++) near += pine(-100 + i * 190 + rnd(i + 40) * 50, 420, 2 + rnd(i + 5) * .5, '#1f6a4c', '#3f9a6e');
    put(back,
      '<rect x="-500" y="120" width="1800" height="800" fill="#6aa8a0" opacity=".35"/>' + far +
      '<path d="M-300 320 Q150 290 400 322 T1100 306 V1200 H-300Z" fill="#4c9a76"/>' + mid +
      '<path d="M-300 372 Q300 340 600 370 T1100 356 V1200 H-300Z" fill="#3f8c68"/>' + near +
      '<g class="lightrays"></g><g class="mush"></g><g class="river"></g>' +
      '<rect class="tintB" x="-500" y="-900" width="1800" height="2300" fill="#fff" opacity="0"/>');
    put(front,
      '<rect class="gstrip" x="-300" y="410" width="1600" height="900" fill="#3b8f5e"/><path d="M-300 410 Q200 402 420 410 T1100 408" fill="none" stroke="#5fc08a" stroke-width="3" opacity=".7"/><g class="tufts"></g>' +
      '<g class="ffs"></g>');
    var qb = function (c) { return back.querySelector('.' + c); }, qf = function (c) { return front.querySelector('.' + c); };
    var R = { gstrip: qf('gstrip'), groundCol: [47, 131, 90], birds: 0, cloudsOn: 0 };
    R.rays = []; for (i = 0; i < 6; i++) R.rays.push(mk('polygon', { points: (60 + i * 140) + ',-100 ' + (100 + i * 140) + ',-100 ' + (20 + i * 140) + ',470 ' + (-30 + i * 140) + ',470', fill: '#fff8c8', opacity: 0 }, qb('lightrays')));
    var mush = [[120, 400, 1.2], [330, 412, .9], [560, 405, 1.4], [720, 416, 1]];
    mush.forEach(function (m) { put(qb('mush'), '<g transform="translate(' + m[0] + ' ' + m[1] + ') scale(' + m[2] + ')"><rect x="-6" y="-16" width="12" height="20" rx="5" fill="#fff3dc" stroke="#8a6a4a" stroke-width="2"/><path d="M-26 -14 Q0 -52 26 -14Z" fill="#ff5f7e" stroke="#8a2a4a" stroke-width="2.4"/><circle cx="-9" cy="-26" r="3.4" fill="#fff"/><circle cx="8" cy="-30" r="4" fill="#fff"/><circle cx="14" cy="-20" r="2.6" fill="#fff"/></g>'); });
    R.tufts = grassTufts(qf('tufts'), 50, 414, 34, ['#2a7a50', '#3f9a6a', '#2a7a50']);
    R.ffs = []; for (i = 0; i < 26; i++) { var fg = mk('g', {}, qf('ffs')); mk('circle', { r: 10, fill: '#fff3a0', opacity: .3 }, fg); mk('circle', { r: 2.6, fill: '#fff8c0' }, fg); R.ffs.push(fg); }
    R.update = function (t, S, o) {
      var gt = mixc(R.groundCol, S.tint, S.tint[3]); R.gstrip.setAttribute('fill', rgb(gt));
      var day = Math.max(0, 1 - S.night * 1.6 - S.gloom * .6);
      R.rays.forEach(function (p, i) { p.setAttribute('opacity', (.14 * day * (.6 + .4 * Math.sin(t * .9 + i * 1.7))).toFixed(3)); });
      R.tufts.forEach(function (f) { f.g.setAttribute('transform', 'translate(' + f.x.toFixed(1) + ' ' + f.y.toFixed(1) + ') rotate(' + (5 * Math.sin(t * 1.8 + f.i)).toFixed(1) + ') scale(' + f.s.toFixed(2) + ')'); });
      var ffo = .35 + .65 * Math.max(0, Math.min(1, S.night * 2));
      R.ffs.forEach(function (g, i) {
        var x = rnd(i + 40) * 800 + 30 * Math.sin(t * .5 + i), y = 160 + rnd(i + 70) * 260 + 14 * Math.sin(t * .8 + i * 1.7), s = Math.sin(t * 3 + i * 2.1);
        g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); g.setAttribute('opacity', (ffo * (.4 + .6 * s * s)).toFixed(2));
      });
    };
    return R;
  }


  /* ---------- SET : atelier de Robi (intérieur) ---------- */
  function gear(x, y, r, teeth, col, id) {
    var d = '', i, a, n = teeth * 2;
    for (i = 0; i < n; i++) { a = i / n * Math.PI * 2; var rr = i % 2 ? r * .82 : r; d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ' ' + (Math.sin(a) * rr).toFixed(1); a = (i + .5) / n * Math.PI * 2; d += 'L' + (Math.cos(a) * rr).toFixed(1) + ' ' + (Math.sin(a) * rr).toFixed(1); }
    return '<g class="' + id + '" transform="translate(' + x + ' ' + y + ')"><path d="' + d + 'Z" fill="' + col + '" stroke="#3b4a66" stroke-width="2.4" stroke-linejoin="round"/><circle r="' + (r * .32) + '" fill="#e6edf8" stroke="#3b4a66" stroke-width="2.2"/></g>';
  }
  function atelier(back, front) {
    var gw = mk('g', {}, back), gs = mk('g', {}, back), gn = mk('g', {}, back), i;
    var P = [[gw, .3], [gs, .6], [gn, .88]];
    put(gw,
      '<defs><linearGradient id="awl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8aa7d9"/><stop offset="1" stop-color="#bcd0ee"/></linearGradient>' +
      '<linearGradient id="afl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9ae78"/><stop offset=".5" stop-color="#c4915a"/><stop offset="1" stop-color="#a87444"/></linearGradient>' +
      '<linearGradient id="aws" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fc4ff"/><stop offset="1" stop-color="#d6efff"/></linearGradient>' +
      '<radialGradient id="alamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2b0" stop-opacity=".9"/><stop offset="1" stop-color="#ffd870" stop-opacity="0"/></radialGradient></defs>' +
      '<rect x="-500" y="-300" width="1800" height="900" fill="url(#awl)"/>' +
      '<g opacity=".16" stroke="#fff" stroke-width="3">' + (function () { var s = ''; for (var k = -10; k < 28; k++) s += '<line x1="' + (k * 50) + '" y1="-300" x2="' + (k * 50) + '" y2="360"/>'; return s; })() + '</g>' +
      '<rect x="-500" y="330" width="1800" height="22" fill="#8a6d4d"/><rect x="-500" y="330" width="1800" height="5" fill="#b69067"/>');
    put(gs,
      /* grande fenêtre */
      '<g transform="translate(560 70)"><rect x="-10" y="-10" width="240" height="190" rx="12" fill="#6d4a31"/><rect class="awin" x="0" y="0" width="220" height="170" rx="6" fill="url(#aws)"/>' +
      '<g class="awc"></g><path d="M0 120 Q60 98 120 116 T220 104 V170 H0Z" fill="#6fcf94" opacity=".9"/><path d="M0 142 Q70 124 130 140 T220 130 V170 H0Z" fill="#4fb67f"/>' +
      '<rect x="107" y="0" width="6" height="170" fill="#6d4a31"/><rect x="0" y="82" width="220" height="6" fill="#6d4a31"/><rect x="-16" y="178" width="252" height="12" rx="5" fill="#8a6040"/><rect class="awsh" x="0" y="0" width="220" height="170" rx="6" fill="#0a1236" opacity="0"/></g>' +
      /* tableau des plans */
      '<g transform="translate(110 56)"><rect x="-6" y="-6" width="176" height="124" rx="7" fill="#7d5a3c"/><rect width="164" height="112" rx="4" fill="#2f4a6e"/>' +
      '<g stroke="#9ed0ff" stroke-width="2" fill="none" opacity=".85"><rect x="22" y="50" width="62" height="42"/><path d="M16 50 L53 20 L90 50"/><rect x="48" y="68" width="14" height="24"/><rect x="30" y="60" width="12" height="12"/><path d="M110 24 H148 M110 40 H148 M110 56 H134" /><circle cx="130" cy="86" r="12"/></g>' +
      '<text x="82" y="14" font-size="10" font-weight="800" text-anchor="middle" fill="#cfe8ff" font-family="Baloo 2, Arial Rounded MT Bold, Arial, sans-serif">PLANS</text></g>' +
      /* engrenages muraux */
      gear(40, 120, 26, 10, '#ffcf6a', 'ag1') + gear(88, 150, 17, 8, '#ff9a6a', 'ag2') + gear(430, 60, 22, 9, '#8fd1ff', 'ag3'));
    put(gn,
      /* étagère + objets */
      '<g transform="translate(330 150)"><rect x="-6" y="0" width="150" height="10" rx="3" fill="#8a6040"/><rect x="-6" y="10" width="150" height="4" fill="#6d4a31"/>' +
      '<rect x="6" y="-30" width="22" height="30" rx="4" fill="#ff7b6b" stroke="#8a2a2a" stroke-width="2.4"/><rect x="32" y="-22" width="18" height="22" rx="4" fill="#7ad39a" stroke="#2a6a45" stroke-width="2.4"/>' +
      '<rect x="56" y="-36" width="26" height="36" rx="4" fill="#ffd23f" stroke="#8a6a12" stroke-width="2.4"/><circle cx="108" cy="-14" r="14" fill="#b7c3d8" stroke="#3b4a66" stroke-width="2.4"/><circle cx="108" cy="-14" r="5" fill="#2a3a58"/></g>' +
      '<g transform="translate(330 240)"><rect x="-6" y="0" width="150" height="10" rx="3" fill="#8a6040"/><rect x="-6" y="10" width="150" height="4" fill="#6d4a31"/>' +
      '<path d="M10 0 V-28 H34 V0Z" fill="#b7c3d8" stroke="#3b4a66" stroke-width="2.4"/><path d="M50 0 L62 -34 L74 0Z" fill="#ffb347" stroke="#8a4a12" stroke-width="2.4"/><rect x="88" y="-20" width="38" height="20" rx="4" fill="#a98cd8" stroke="#4f3a8a" stroke-width="2.4"/></g>' +
      /* lampe suspendue */
      '<g transform="translate(300 -20)"><line x1="0" y1="0" x2="0" y2="70" stroke="#3b4a66" stroke-width="3"/><path d="M-24 100 Q0 62 24 100Z" fill="#ffb347" stroke="#8a4a12" stroke-width="3" stroke-linejoin="round"/><circle class="alp" cx="0" cy="104" r="54" fill="url(#alamp)" opacity=".8"/></g>' +
      /* établi */
      '<g transform="translate(0 0)"><rect x="620" y="300" width="230" height="16" rx="5" fill="#9a6e45"/><rect x="620" y="316" width="230" height="5" fill="#6d4a31"/><rect x="628" y="321" width="12" height="66" fill="#7d5a3c"/><rect x="830" y="321" width="12" height="66" fill="#7d5a3c"/>' +
      '<rect x="650" y="276" width="60" height="24" rx="5" fill="#b7c3d8" stroke="#3b4a66" stroke-width="2.6"/><circle cx="664" cy="288" r="4" fill="#7aff9a"/><circle cx="678" cy="288" r="4" fill="#ffd23f"/><rect x="730" y="288" width="44" height="12" rx="3" fill="#ff7b6b" stroke="#8a2a2a" stroke-width="2.4"/><path d="M790 300 l12 -26 l12 26Z" fill="#7ad39a" stroke="#2a6a45" stroke-width="2.4"/></g>' +
      '<rect class="atint" x="-500" y="-900" width="1800" height="2300" fill="#fff" opacity="0"/>');
    put(front,
      '<rect class="gstrip" x="-300" y="408" width="1600" height="900" fill="url(#afl)"/>' +
      '<g stroke="#8a5a30" stroke-width="2.4" opacity=".55">' + (function () { var s = ''; for (var k = 0; k < 9; k++) s += '<line x1="-300" y1="' + (420 + k * 18) + '" x2="1100" y2="' + (420 + k * 18) + '"/>'; for (k = -6; k < 20; k++) s += '<line x1="' + (k * 90) + '" y1="' + (420 + (k % 3) * 18) + '" x2="' + (k * 90) + '" y2="' + (438 + (k % 3) * 18) + '"/>'; return s; })() + '</g>' +
      '<path d="M-300 408 H1100" stroke="#f0cf9c" stroke-width="4" opacity=".7"/>' +
      '<g transform="translate(90 436)"><ellipse cy="14" rx="30" ry="6" fill="#14213d" opacity=".18"/><path d="M-26 12 V-8 Q-26 -14 -20 -14 H20 Q26 -14 26 -8 V12Z" fill="#b7c3d8" stroke="#3b4a66" stroke-width="3"/><rect x="-26" y="-24" width="52" height="10" rx="3" fill="#8a6040"/><path d="M-18 -24 L-12 -40 L-6 -24M2 -24 L8 -44 L14 -24" fill="none" stroke="#3b4a66" stroke-width="3"/></g>' +
      '<g transform="translate(720 446)"><ellipse cy="12" rx="40" ry="6" fill="#14213d" opacity=".16"/><path d="M-34 10 C-34 -10 -24 -22 -4 -22 C16 -22 34 -12 34 10Z" fill="#c9d4e6" stroke="#3b4a66" stroke-width="3"/><circle cx="-10" cy="-4" r="5" fill="#ff7b6b"/><circle cx="10" cy="-4" r="5" fill="#7ad39a"/></g>' +
      '<g class="asp" fill="#ffe9a0"></g>');
    var qb = function (c) { return back.querySelector('.' + c); }, qf = function (c) { return front.querySelector('.' + c); };
    var R = { gstrip: qf('gstrip'), groundCol: [196, 145, 90], birds: 0, cloudsOn: 0, par: P, awin: qb('awin'), awsh: qb('awsh'), alp: qb('alp'), atint: qb('atint') };
    R.g1 = qb('ag1'); R.g2 = qb('ag2'); R.g3 = qb('ag3');
    R.clouds = []; for (i = 0; i < 3; i++) R.clouds.push(mk('ellipse', { cy: 30 + i * 20, rx: 26 + i * 6, ry: 9, fill: '#fff', opacity: .85 }, qb('awc')));
    R.sp = []; for (i = 0; i < 16; i++) R.sp.push(mk('circle', { r: 1 + rnd(i + 5) * 1.6 }, qf('asp')));
    R.update = function (t, S, o) {
      var night = Math.max(0, Math.min(1, S.night * 1.8)), gl = Math.max(0, Math.min(1, S.gloom));
      R.g1.setAttribute('transform', 'translate(40 120) rotate(' + (t * 22).toFixed(1) + ')'); R.g2.setAttribute('transform', 'translate(88 150) rotate(' + (-t * 33).toFixed(1) + ')'); R.g3.setAttribute('transform', 'translate(430 60) rotate(' + (t * 18).toFixed(1) + ')');
      R.awin.setAttribute('fill', night > .3 ? 'url(#aws)' : 'url(#aws)'); R.awsh.setAttribute('opacity', (night * .72 + gl * .25).toFixed(2));
      R.clouds.forEach(function (c, i) { c.setAttribute('cx', (((t * (6 + i * 3) + i * 90) % 280) - 30).toFixed(1)); });
      R.alp.setAttribute('opacity', (.55 + .25 * night + .05 * Math.sin(t * 5)).toFixed(2));
      R.sp.forEach(function (c, i) { var x = ((rnd(i + 11) * 900 + t * (4 + 4 * rnd(i + 30))) % 900), y = 440 - ((rnd(i + 51) * 260 + t * (8 + 6 * rnd(i + 70))) % 260); c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); c.setAttribute('opacity', (.2 + .25 * Math.sin(t * 1.7 + i) * Math.sin(t * 1.7 + i)).toFixed(2)); });
      R.atint.setAttribute('fill', rgb(S.tint)); R.atint.setAttribute('opacity', (S.tint[3] * .6).toFixed(3));
      R.gstrip.setAttribute('opacity', 1);
    };
    return R;
  }

  return { skyAt: skyAt, PAL: PAL, buildSky: buildSky, build: { colline: colline, foret: foret, atelier: atelier }, sparkD: sparkD, rnd: rnd, rgb: rgb, mixc: mixc };
})();
