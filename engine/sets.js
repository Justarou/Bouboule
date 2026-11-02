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
    dusk:  { top: [120, 84, 160], bot: [255, 176, 122], sun: .25, moon: 0, night: .12, gloom: .15, tint: [255, 140, 90, .17] },
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
      '<g class="sun" transform="translate(690 80)"><circle r="110" fill="url(#sunG)"/><g class="rays" stroke="#ffb703" stroke-width="6" stroke-linecap="round"></g>' +
      '<circle r="34" fill="#ffd23f" stroke="#e09a00" stroke-width="3"/><circle cx="-11" cy="-6" r="3.5" fill="#6b3f00"/><circle cx="11" cy="-6" r="3.5" fill="#6b3f00"/>' +
      '<circle cx="-20" cy="6" r="5" fill="#ff8a5c" opacity=".55"/><circle cx="20" cy="6" r="5" fill="#ff8a5c" opacity=".55"/><path d="M-12 7 Q0 19 12 7" fill="none" stroke="#6b3f00" stroke-width="3.5" stroke-linecap="round"/></g>' +
      '<g class="beams"></g><g class="dcl"></g><g class="birds" fill="none" stroke="#2a3558" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></g>');
    var q = function (c) { return layer.querySelector('.' + c); };
    var i, R = { s1: q('s1'), s2: q('s2'), sun: q('sun'), moon: q('moon'), rays: q('rays') };
    for (i = 0; i < 12; i++) { var an = i * 30 * Math.PI / 180; mk('line', { x1: Math.cos(an) * 44, y1: Math.sin(an) * 44, x2: Math.cos(an) * 60, y2: Math.sin(an) * 60 }, R.rays); }
    R.stars = []; for (i = 0; i < 90; i++) R.stars.push(mk('circle', { cx: rnd(i) * 1100 - 150, cy: rnd(i + 100) * 330 - 130, r: .9 + rnd(i + 200) * 1.5 }, q('stars')));
    R.beams = []; for (i = 0; i < 7; i++) { var bx = 40 + i * 110; R.beams.push(mk('polygon', { points: '690,80 ' + (bx - 24) + ',450 ' + (bx + 24) + ',450', fill: '#fff6c8', opacity: 0 }, q('beams'))); }
    var DCL = [{ x: 60, y: 62, s: 1, v: 5 }, { x: 330, y: 36, s: .8, v: 3.5 }, { x: 540, y: 96, s: 1.15, v: 4.5 }, { x: -90, y: 128, s: .7, v: 6 }, { x: 720, y: 30, s: .9, v: 2.5 },
      { x: 200, y: -80, s: 1.1, v: 3 }, { x: 600, y: -150, s: .9, v: 4 }, { x: 420, y: -30, s: .8, v: 5 }];
    R.dcl = DCL.map(function (c) {
      var g = mk('g', {}, q('dcl'));
      [[-34, 6, 20], [-8, -6, 28], [22, -2, 24], [44, 8, 17]].forEach(function (p) { mk('circle', { cx: p[0], cy: p[1], r: p[2] }, g); });
      mk('rect', { x: -54, y: 4, width: 116, height: 20, rx: 10 }, g);
      return { g: g, c: c };
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
        d.g.setAttribute('fill', rgb(dcol)); d.g.setAttribute('opacity', ((.92 - .4 * nightF) * (o.cloudsOn === 0 ? 0 : 1)).toFixed(2));
      });
      var bf = (o.birds || 0) * Math.max(0, Math.min(1, S.sun * 1.3));
      R.birds.forEach(function (b, i) {
        var x = ((t * (34 + i * 7) + i * 210) % 1000) - 100, y = 70 + i * 26 + 10 * Math.sin(t * 1.3 + i), fl = Math.sin(t * 9 + i * 2);
        b.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(1 ' + (.55 + .45 * fl).toFixed(2) + ')'); b.setAttribute('opacity', bf.toFixed(2));
      });
    };
    return R;
  }

  /* ---------- arbres ---------- */
  function tree(x, y, s, c1, c2) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="-3" y="-22" width="6" height="28" rx="2" fill="#8a5a3a"/><circle cy="-36" r="18" fill="' + c1 + '"/><circle cx="-10" cy="-27" r="12" fill="' + c2 + '"/><circle cx="10" cy="-28" r="12" fill="' + c2 + '"/><circle cx="-6" cy="-44" r="8" fill="' + c2 + '" opacity=".7"/></g>';
  }
  function grassTufts(layer, n, y0, spread, cols) {
    var arr = [];
    for (var i = 0; i < n; i++) {
      var g = mk('g', {}, layer);
      mk('path', { d: 'M-6 0 Q-5 -10 -8 -17 Q-2 -10 0 0 Q2 -13 7 -18 Q5 -8 6 0Z', fill: cols[i % cols.length] }, g);
      arr.push({ g: g, x: -40 + i * (880 / n) + rnd(i) * 10, y: y0 + rnd(i + 7) * spread, s: .8 + rnd(i + 3) * .7, i: i });
    }
    return arr;
  }

  /* ---------- SET : colline ---------- */
  function colline(back, front) {
    put(back,
      '<g class="mount"><path d="M-300 308 L-200 250 L-120 290 L-60 308 L40 236 L95 276 L170 203 L250 283 L330 230 L410 292 L500 213 L590 286 L670 223 L760 281 L860 238 L950 280 L1100 250 V1200 H-300Z" fill="#b6ccef"/>' +
      '<path d="M170 203 L150 228 L162 222 L172 233 L182 222 L194 229Z" fill="#fff" opacity=".9"/><path d="M500 213 L479 240 L491 233 L501 244 L511 233 L523 241Z" fill="#fff" opacity=".9"/><path d="M670 223 L652 246 L663 240 L671 250 L681 240 L690 246Z" fill="#fff" opacity=".9"/></g>' +
      '<path d="M-300 340 Q110 290 250 326 T520 314 T1100 302 V1200 H-300Z" fill="#79d6a3"/><path d="M-300 340 Q110 290 250 326 T520 314 T1100 302" fill="none" stroke="#a6f0c6" stroke-width="3" opacity=".8"/>' +
      tree(205, 330, 1, '#3fb577', '#4cc38a') + tree(335, 322, .85, '#47bd80', '#55cc90') + tree(468, 319, .9, '#3fb577', '#4cc38a') + tree(590, 318, .75, '#47bd80', '#55cc90') + tree(660, 311, .7, '#3fb577', '#4cc38a') + tree(-60, 335, 1.1, '#3fb577', '#4cc38a') + tree(900, 320, 1, '#47bd80', '#55cc90') +
      '<g transform="translate(72 326)"><path d="M-15 0 L-10 -52 L10 -52 L15 0Z" fill="#f6ecdc" stroke="#8a6a4a" stroke-width="2.4" stroke-linejoin="round"/><path d="M-12 -52 L0 -68 L12 -52Z" fill="#c8563f" stroke="#8a3a2a" stroke-width="2.2" stroke-linejoin="round"/><rect x="-5" y="-17" width="10" height="17" rx="5" fill="#8a6a4a"/>' +
      '<g transform="translate(0 -54)"><g class="wm"><g><rect x="-2" y="-38" width="4" height="38" fill="#8a6a4a"/><rect x="2" y="-36" width="10" height="24" fill="#fff" stroke="#8a6a4a" stroke-width="1.6"/></g><g transform="rotate(90)"><rect x="-2" y="-38" width="4" height="38" fill="#8a6a4a"/><rect x="2" y="-36" width="10" height="24" fill="#fff" stroke="#8a6a4a" stroke-width="1.6"/></g><g transform="rotate(180)"><rect x="-2" y="-38" width="4" height="38" fill="#8a6a4a"/><rect x="2" y="-36" width="10" height="24" fill="#fff" stroke="#8a6a4a" stroke-width="1.6"/></g><g transform="rotate(270)"><rect x="-2" y="-38" width="4" height="38" fill="#8a6a4a"/><rect x="2" y="-36" width="10" height="24" fill="#fff" stroke="#8a6a4a" stroke-width="1.6"/></g></g><circle r="4.5" fill="#c8563f" stroke="#8a3a2a" stroke-width="1.6"/></g></g>' +
      '<g transform="translate(738 326)"><rect x="-30" y="-34" width="60" height="34" fill="#ffe6b8" stroke="#8a5a3a" stroke-width="2.6"/><rect x="14" y="-62" width="9" height="22" fill="#a8604a" stroke="#7a3f2e" stroke-width="1.8"/><polygon points="-37,-34 0,-64 37,-34" fill="#d65a4a" stroke="#8a3a2a" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<rect class="cwin" x="-23" y="-27" width="16" height="16" rx="2" fill="#a9d0ee" stroke="#8a5a3a" stroke-width="2"/><line x1="-15" y1="-27" x2="-15" y2="-11" stroke="#8a5a3a" stroke-width="1.6"/><line x1="-23" y1="-19" x2="-7" y2="-19" stroke="#8a5a3a" stroke-width="1.6"/><rect x="6" y="-23" width="14" height="23" rx="7" fill="#8a5a3a"/><circle cx="16" cy="-11" r="1.4" fill="#ffd23f"/><g class="smoke" fill="#fff" transform="translate(18 -64)"></g></g>' +
      '<path d="M-300 384 Q250 332 500 378 T1100 360 V1200 H-300Z" fill="#5fd69c"/><path d="M-300 384 Q250 332 500 378 T1100 360" fill="none" stroke="#9ff7c8" stroke-width="4" opacity=".7"/>' +
      '<g transform="translate(58 384)"><rect x="-3" y="-34" width="6" height="42" rx="2" fill="#8a5a3a"/><g transform="rotate(-4 0 -40)"><rect x="-35" y="-60" width="70" height="29" rx="4" fill="#ebbd78" stroke="#8a5a3a" stroke-width="2.6"/>' +
      '<text y="-47" font-size="10" font-family="Baloo 2, Arial Rounded MT Bold, Arial, sans-serif" font-weight="800" text-anchor="middle" fill="#5a3418">Colline</text><text y="-36" font-size="10" font-family="Baloo 2, Arial Rounded MT Bold, Arial, sans-serif" font-weight="800" text-anchor="middle" fill="#5a3418">des Rigolos</text></g></g>' +
      '<rect class="tintB" x="-500" y="-900" width="1800" height="2300" fill="#fff" opacity="0"/>');
    put(front,
      '<rect class="gstrip" x="-300" y="410" width="1600" height="900" fill="#3aa874"/><path d="M-300 410 Q200 402 420 410 T1100 408" fill="none" stroke="#5fd69c" stroke-width="3" opacity=".7"/><g class="tufts"></g><g class="flowers"></g>' +
      '<g transform="translate(196 431)"><rect x="-4" y="-8" width="8" height="12" rx="3" fill="#fff3dc" stroke="#8a6a4a" stroke-width="1.6"/><path d="M-14 -7 Q0 -26 14 -7Z" fill="#e8453c" stroke="#8a2a2a" stroke-width="2"/><circle cx="-5" cy="-13" r="2" fill="#fff"/><circle cx="4" cy="-15" r="2.4" fill="#fff"/></g>' +
      '<g transform="translate(610 436) scale(.8)"><rect x="-4" y="-8" width="8" height="12" rx="3" fill="#fff3dc" stroke="#8a6a4a" stroke-width="1.6"/><path d="M-14 -7 Q0 -26 14 -7Z" fill="#e8453c" stroke="#8a2a2a" stroke-width="2"/><circle cx="-5" cy="-13" r="2" fill="#fff"/><circle cx="4" cy="-15" r="2.4" fill="#fff"/></g>' +
      '<g class="ffs"></g>');
    var qb = function (c) { return back.querySelector('.' + c); }, qf = function (c) { return front.querySelector('.' + c); };
    var i, R = { wm: qb('wm'), cwin: qb('cwin'), gstrip: qf('gstrip'), groundCol: [58, 168, 116], birds: 1, cloudsOn: 1 };
    R.smoke = []; for (i = 0; i < 4; i++) R.smoke.push(mk('circle', { r: 5, opacity: 0 }, qb('smoke')));
    R.tufts = grassTufts(qf('tufts'), 46, 414, 34, ['#2f9a68', '#44b87f', '#2f9a68']);
    R.flowers = [];
    [50, 120, 250, 380, 520, 660, 730, 775, -20, 850].forEach(function (x, i) {
      var g = mk('g', {}, qf('flowers'));
      put(g, '<line x1="0" y1="46" x2="0" y2="0" stroke="#2a8a5c" stroke-width="4" stroke-linecap="round"/><path d="M0 30 q-14 -4 -18 -14 q14 -2 18 14Z" fill="#3aa874"/>');
      var col = ['#ff5f7e', '#ffd23f', '#fff', '#b185db', '#ff924c', '#ff5f7e', '#ffd23f', '#fff', '#b185db', '#ff5f7e'][i];
      for (var k = 0; k < 5; k++) { var a2 = k * 72 * Math.PI / 180; mk('circle', { cx: Math.cos(a2) * 8, cy: Math.sin(a2) * 8, r: 6, fill: col, stroke: '#14213d', 'stroke-width': 1.5 }, g); }
      mk('circle', { r: 4.5, fill: '#ffb703', stroke: '#14213d', 'stroke-width': 1.5 }, g);
      R.flowers.push({ g: g, x: x, y: 432 + (i % 3) * 8 });
    });
    R.ffs = []; for (i = 0; i < 18; i++) { var fg = mk('g', {}, qf('ffs')); mk('circle', { r: 9, fill: '#fff3a0', opacity: .25 }, fg); mk('circle', { r: 2.4, fill: '#fff8c0' }, fg); R.ffs.push(fg); }
    R.update = function (t, S, o) {
      var nightF = Math.max(0, Math.min(1, (S.night - .2) / .3));
      R.wm.setAttribute('transform', 'rotate(' + (t * 38).toFixed(1) + ')');
      var wg = Math.max(0, Math.min(1, S.night * 2.2 + S.gloom * .5));
      R.cwin.setAttribute('fill', rgb(mixc([169, 208, 238], [255, 214, 110], wg)));
      R.smoke.forEach(function (c, i) {
        var ag = ((t * .45 + i * .25) % 1);
        c.setAttribute('cx', (ag * 14 + 3 * Math.sin(t * 2 + i)).toFixed(1)); c.setAttribute('cy', (-ag * 46).toFixed(1)); c.setAttribute('r', (4 + ag * 9).toFixed(1)); c.setAttribute('opacity', ((1 - ag) * .55 * (1 - nightF * .4)).toFixed(2));
      });
      var gt = mixc(R.groundCol, S.tint, S.tint[3]); R.gstrip.setAttribute('fill', rgb(gt));
      R.tufts.forEach(function (f) { f.g.setAttribute('transform', 'translate(' + f.x.toFixed(1) + ' ' + f.y.toFixed(1) + ') rotate(' + (5 * Math.sin(t * 1.8 + f.i)).toFixed(1) + ') scale(' + f.s.toFixed(2) + ')'); });
      R.flowers.forEach(function (f, i) { f.g.setAttribute('transform', 'translate(' + f.x + ' ' + f.y + ') rotate(' + (6 * Math.sin(t * 2 + i)).toFixed(1) + ' 0 46) translate(0 -46)'); });
      var ffo = Math.max(0, Math.min(1, S.night * 2.2));
      R.ffs.forEach(function (g, i) {
        var x = rnd(i + 40) * 800 + 30 * Math.sin(t * .5 + i), y = 300 + rnd(i + 70) * 120 + 14 * Math.sin(t * .8 + i * 1.7), s = Math.sin(t * 3 + i * 2.1);
        g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); g.setAttribute('opacity', (ffo * (.45 + .55 * s * s)).toFixed(2));
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

  return { skyAt: skyAt, PAL: PAL, buildSky: buildSky, build: { colline: colline, foret: foret }, sparkD: sparkD, rnd: rnd, rgb: rgb, mixc: mixc };
})();
