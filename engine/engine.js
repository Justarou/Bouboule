/* ===== Moteur d'épisodes : script -> chronologie -> image ===== */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var $ = function (id) { return document.getElementById(id); };
  var mk = CHARS.mk, put = CHARS.put;
  function lerp(a, b, k) { return a + (b - a) * k; }
  function cl(x, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, x)); }
  function sm(x) { x = cl(x); return x * x * (3 - 2 * x); }
  function f1(x) { return x.toFixed(1); }
  var rnd = SETS.rnd;
  function kf(K, t) {
    if (!K.length) return 0;
    if (t <= K[0][0]) return K[0][1];
    for (var i = 1; i < K.length; i++) if (t < K[i][0]) { var a = K[i - 1], b = K[i]; return lerp(a[1], b[1], sm((t - a[0]) / Math.max(.001, b[0] - a[0]))); }
    return K[K.length - 1][1];
  }

  var EP = window.EP;                       /* données de l'épisode (injectées) */
  var GY = 395;                             /* sol du monde */
  var STYLE = { bouboule: 'hop', pitou: 'float', grincheux: 'float', robi: 'drive', flamme: 'waddle' };
  var CAST_OPT = { bouboule: { s: 1, row: 0 }, pitou: { s: .95, row: 4, hover: 10 }, grincheux: { s: .95, row: -6, hover: 55 }, robi: { s: 1, row: 8 }, flamme: { s: .92, row: -4 } };

  var V2 = (EP.engine || 1) >= 2; CHARS.V2 = V2;
  var DEPTH_DY = 70, DEPTH_SC = .55, STN_P = [], FIRE_P = null;
  var V4 = (EP.engine || 1) >= 4; /* EV-004 : profondeur (depth), cailloux en profondeur, locuteur au premier plan */
  var V3 = (EP.engine || 1) >= 3; /* EV-002 : transitions de décor symétriques + accessoires liés à leur décor */
  var RND = SETS.rnd, SM = function (x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
  /* ---------- 1. Chronologie des répliques ---------- */
  var LEAD = EP.lead !== undefined ? EP.lead : 3.0, OUTRO = EP.outro !== undefined ? EP.outro : 5.0;
  var L = EP.lines, cur = LEAD, i, w;
  for (i = 0; i < L.length; i++) {
    var ln = L[i];
    ln.i = i;
    var gap = ln.gap !== undefined ? ln.gap : (i === 0 ? 0 : (L[i - 1].who === 'N' ? .35 : .4));
    ln.t = cur + gap; ln.e = ln.t + ln.dur; cur = ln.e;
  }
  var ENDT = cur + OUTRO;
  var CASTK = EP.cast;                      /* {B:'bouboule',...} */
  var LET = Object.keys(CASTK);

  /* ---------- 2. Lecture des actions ---------- */
  var ACT = []; /* {t,verb,args} */
  L.forEach(function (ln) {
    (ln.do || []).forEach(function (a) {
      var off = a[0], t;
      if (typeof off === 'string') t = (off[0] === 'e' ? ln.e : ln.t) + parseFloat(off.slice(1) || 0); else t = ln.t + off;
      ACT.push({ t: t, verb: a[1], a: a.slice(2) });
    });
  });
  (EP.at || []).forEach(function (a) { ACT.push({ t: a[0], verb: a[1], a: a.slice(2) }); });   /* actions à l'instant absolu */
  ACT.sort(function (x, y) { return x.t - y.t; });

  /* ---------- 3. Acteurs : trajectoires ---------- */
  var AC = {};
  LET.forEach(function (k, n) {
    var kind = CASTK[k], o = CAST_OPT[kind] || {};
    AC[k] = { k: k, kind: kind, s: o.s || 1, row: o.row || 0, hover: o.hover || 0, style: STYLE[kind] || 'hop',
      segs: [], lifts: [], depths: [], waters: [], wets: [], vis: [], moods: [[-1, 'neutral']], looks: [[-1, 'cam']], anims: [], glow: [], soot: [], x: .5, v: 0, phase: n * 1.7, tint: [] };
  });
  var RBEV = [];
  var EVSFX = [], EVFX = [], EVCAM = [], SKYK = [], SHK = [], BEAMS = [], PROPS = { ball: [], machine: [], house: [], stones: [], fire: [] }, AMB = [], MUS = [], SETK = [[0, EP.set || 'colline']], RAIN = [];
  SKYK.push([0, EP.tod || 'day']);

  function sideX(sd) { return sd === 'L' ? -.2 : (sd === 'R' ? 1.2 : .5); }
  function xOf(k, t) {
    var a = AC[k], x = a.x0 === undefined ? .5 : a.x0, i;
    for (i = 0; i < a.segs.length; i++) {
      var s = a.segs[i];
      if (t < s.t0) return x;
      if (t >= s.t1) { x = s.x1; continue; }
      return lerp(s.x0, s.x1, s.ease ? sm((t - s.t0) / (s.t1 - s.t0)) : (t - s.t0) / (s.t1 - s.t0));
    }
    return x;
  }
  function visOf(k, t) { var a = AC[k], v = 0; for (var i = 0; i < a.vis.length; i++) { if (a.vis[i][0] <= t) v = a.vis[i][1]; else break; } return v; }
  function lastOf(arr, t) { var v = arr[0][1]; for (var i = 0; i < arr.length; i++) { if (arr[i][0] <= t) v = arr[i][1]; else break; } return v; }

  var cursorX = {};
  ACT.forEach(function (c) {
    var v = c.verb, a = c.a, A = AC[a[0]], t = c.t;
    if (v === 'place') { A.x0 = a[1]; A.vis.push([t, 1]); cursorX[a[0]] = a[1]; }
    else if (v === 'enter') {
      var from = a[1], to = a[2], dur = a[3] || 1.6, how = a[4] || 'walk';
      if (from === 'pop') { A.segs.push({ t0: t, t1: t, x0: to, x1: to }); A.vis.push([t, 1]); A.anims.push({ t0: t, dur: .5, name: 'pop' }); EVSFX.push({ t: t, key: 'pop', vol: .8 }); }
      else if (from === 'drop') { A.segs.push({ t0: t, t1: t, x0: to, x1: to }); A.vis.push([t, 1]); A.anims.push({ t0: t, dur: dur, name: 'drop' }); EVSFX.push({ t: t + dur - .08, key: 'tombe', vol: .8 }); }
      else { var x0 = sideX(from); A.segs.push({ t0: t, t1: t + dur, x0: x0, x1: to, style: how, ease: 1 }); A.vis.push([t, 1]); }
      cursorX[a[0]] = to; if (A.x0 === undefined) A.x0 = to;
    }
    else if (v === 'exit') {
      var sd = a[1], d2 = a[2] || 1.6, from2 = cursorX[a[0]] !== undefined ? cursorX[a[0]] : .5;
      A.segs.push({ t0: t, t1: t + d2, x0: from2, x1: sideX(sd), style: a[3] || 'walk', ease: 1 }); A.vis.push([t + d2, 0]); cursorX[a[0]] = sideX(sd);
    }
    else if (v === 'move') {
      var to2 = a[1], d3 = a[2] || 1.2, from3 = cursorX[a[0]] !== undefined ? cursorX[a[0]] : .5;
      A.segs.push({ t0: t, t1: t + d3, x0: from3, x1: to2, style: a[3] || null, ease: 1 }); cursorX[a[0]] = to2;
    }
    else if (v === 'mood') A.moods.push([t, a[1]]);
    else if (v === 'look') A.looks.push([t, a[1]]);
    else if (v === 'anim') {
      var nm = a[1], dd = a[2] || 1, p = a[3];
      A.anims.push({ t0: t, dur: dd, name: nm, p: p });
      var au = { hop: 'boing', jump: 'boing', spin: 'tourne', shake: 'tremble', squish: 'couine', fall: 'tombe', faint: 'tombe', flop: 'tombe' }[nm];
      if (nm === 'hop') { var n = p || 2; for (var q = 0; q < n; q++) EVSFX.push({ t: t + (q + .08) * dd / n, key: 'pop', vol: .45 }); }
      else if (au && !a[4]) EVSFX.push({ t: t, key: au, vol: nm === 'shake' ? .35 : .7 });
    }
    else if (v === 'sfx') EVSFX.push({ t: t, key: a[0], vol: a[1] === undefined ? .8 : a[1], variant: a[2] });
    else if (v === 'hic') { A.anims.push({ t0: t, dur: .55, name: 'hic' }); EVSFX.push({ t: t, key: 'pop', vol: .9, variant: 1 }); EVFX.push({ t: t + .06, fx: 'flame', who: a[0], dur: a[1] || .5, dir: a[2] || 'up' }); }
    else if (v === 'fx') EVFX.push({ t: t, fx: a[1], who: a[0], dur: a[2], extra: a[3], extra2: a[4] });
    else if (v === 'glow') A.glow.push([t, a[1], t + (a[2] || .6)]);
    else if (v === 'soot') A.soot.push([t, a[1], t + (a[2] || .4)]);
    else if (v === 'tod') SKYK.push([t, a[0], t + (V3 ? (a[1] === undefined ? 3 : a[1]) : (a[1] || 3))]); /* EV-003 : en engine 3, durée 0 = changement instantané (plus de remplacement par 3 s) */
    else if (v === 'set') SETK.push([t, a[0], a[1] || .6]);
    else if (v === 'beams') BEAMS.push([t, a[0], a[1] || 1]);
    else if (v === 'shake') SHK.push([t, a[0] || 5]);
    else if (v === 'cam') EVCAM.push({ t: t, tgt: a[0], zoom: a[1], dur: a[2] || 2.5, fy: a[3] });
    else if (v === 'shot') { var SHZ = { wide: 1, group: 1.05, medium: 1.18, close: 1.38, extreme: 1.75, reaction: 1.45 }; EVCAM.push({ t: t, tgt: a[1] || 'group', zoom: SHZ[a[0]] || 1.2, rel: true, dur: a[2] || 2.5 }); }
    else if (v === 'amb') AMB.push({ t: t, key: a[0], vol: a[1] === undefined ? .35 : a[1], dur: a[2] });
    else if (v === 'ball') PROPS.ball.push({ t: t, a: a });
    else if (v === 'machine') PROPS.machine.push({ t: t, a: a });
    else if (v === 'house') PROPS.house.push({ t: t, a: a });
    else if (v === 'fire') {   /* EV-005 : petit feu (show x taille lift / grow taille dur / out dur [trace] / hide) */
      PROPS.fire.push({ t: t, a: a });
      if (a[0] === 'show') { FIRE_P = { x: a[1], lift: a[3] || 0 }; if (a[4] !== 'quiet') EVSFX.push({ t: t, key: (a[3] || 0) > 0 ? 'bois_craque' : 'scintille', vol: .5 }); }
      if (a[0] === 'out' && FIRE_P) { var fx0 = FIRE_P.x, fl0 = FIRE_P.lift, fd0 = a[1] || 1.2; EVFX.push({ t: t, fx: 'fireout', who: null, x: fx0, y: fl0, dur: fd0 }); if (a[2] !== 'quiet' && a[3] !== 'quiet') EVSFX.push({ t: t, key: 'eclabousse_eau', vol: .55 }); }
    }
    else if (v === 'stones') {
      PROPS.stones.push({ t: t, a: a });
      if (a[0] === 'show') STN_P = (a[1] || []).slice(); else if (a[0] === 'add') STN_P = STN_P.concat(a[1] || []); else if (a[0] === 'hide') STN_P = [];
      if (a[0] === 'take') (a[1] || []).forEach(function (q, m) { var si = STN_P[q]; if (si) { EVFX.push({ t: t + m * (a[2] || 0), fx: 'ringat', who: null, x: si[0], y: GY - 10 - DEPTH_DY * (si[1] || 0) }); EVSFX.push({ t: t + m * (a[2] || 0) + .6, key: 'pop', vol: .5, variant: 1 }); } });
      if (a[0] === 'add' && a[2] === 'drop') (a[1] || []).forEach(function (si, j) { EVFX.push({ t: t + j * .12 + .5, fx: 'ringat', who: null, x: si[0], y: GY - 10 - DEPTH_DY * (si[1] || 0) }); });
    }   /* EV-001 : cailloux de la rivière */
    else if (v === 'depth') A.depths.push({ t0: t, t1: t + (a[2] === undefined ? .6 : a[2]), v: a[1] });   /* EV-004 : éloigne l'acteur (0 = rive, 1 = loin) : monte et rapetisse */
    else if (v === 'water') A.waters.push({ t0: t, t1: t + (a[2] === undefined ? .4 : a[2]), v: a[1] });   /* EV-004 : immersion (0 = hors de l'eau, 1 = tout le corps) */
    else if (v === 'wet') A.wets.push({ t0: t, t1: t + (a[2] === undefined ? .6 : a[2]), v: a[1] });   /* EV-004 : mouillé (0 à 1) */
    else if (v === 'lift') A.lifts.push({ t0: t, t1: t + (a[2] === undefined ? .3 : a[2]), v: a[1] });   /* EV-001 : monte l'acteur de a[1] px (ex. sur un caillou) */
    else if (v === 'rainbow') RBEV.push({ t: t, a: a });
    else if (v === 'vanish') A.vis.push([t, 0]);
    else if (v === 'music') MUS.push({ t: t, style: a[0], vol: a[1] });
  });
  LET.forEach(function (k) { var A = AC[k]; if (A.x0 === undefined) A.x0 = (A.segs[0] ? A.segs[0].x0 : .5); if (!A.vis.length) A.vis.push([0, 1]); A.vis.sort(function (x, y) { return x[0] - y[0]; }); });

  /* ---------- 4. Mise en page par format ---------- */
  var MODE = 'land';
  var VW = 800, VH = 450;
  var LAYOUT = { land: { VW: 800, VH: 450, stageW: 700, zoomWide: 1, zoomClose: 1.16 }, port: { VW: 450, VH: 800, stageW: 560, zoomWide: 1.22, zoomClose: 1.6 } };
  function wx(f) { return 400 + (f - .5) * LAYOUT[MODE].stageW; }

  /* ---------- 5. Bruitages auto & particules (calcul des événements) ---------- */
  var PE = []; /* événements de particules : {t0,life,kind,fn} */
  function liftOf(k, t) {
    var L = AC[k].lifts, v = 0, i;
    for (i = 0; i < L.length; i++) { var l = L[i]; if (t < l.t0) break; if (t >= l.t1) { v = l.v; continue; } return v + (l.v - v) * SM((t - l.t0) / Math.max(.001, l.t1 - l.t0)); }
    return v;
  }
  function depthOf(k, t) {
    var L = AC[k].depths, v = 0, i;
    for (i = 0; i < L.length; i++) { var l = L[i]; if (t < l.t0) break; if (t >= l.t1) { v = l.v; continue; } return v + (l.v - v) * SM((t - l.t0) / Math.max(.001, l.t1 - l.t0)); }
    return v;
  }
  function trackOf(L, t) {
    var v = 0, i;
    for (i = 0; i < L.length; i++) { var l = L[i]; if (t < l.t0) break; if (t >= l.t1) { v = l.v; continue; } return v + (l.v - v) * SM((t - l.t0) / Math.max(.001, l.t1 - l.t0)); }
    return v;
  }
  function scaleOf(k, t) { return AC[k].depths.length ? AC[k].s * (1 - DEPTH_SC * depthOf(k, t)) : AC[k].s; }
  function actorY(k, t) { var dd = AC[k].depths.length ? depthOf(k, t) : 0; return GY + AC[k].row - (AC[k].lifts.length ? liftOf(k, t) * (1 - DEPTH_SC * dd) : 0) - DEPTH_DY * dd; }
  function bodyTop(k) { return CHARS.LIB[AC[k].kind]; }
  function mouthPos(k, t, dirX) {
    var A = AC[k], c = CHAR_INFO[A.kind], x = wx(xOf(k, t));
    return { x: x + c.mouth.x * scaleOf(k, t), y: actorY(k, t) - A.hover * (scaleOf(k, t) / A.s) - 0 + c.mouth.y * scaleOf(k, t) };
  }
  var CHAR_INFO = {};
  Object.keys(CHARS.LIB).forEach(function (kn) { var tmp = CHARS.LIB[kn].make(); CHAR_INFO[kn] = { mouth: tmp.mouth, cy: tmp.cy, h: tmp.h, w: tmp.w }; });

  function P(t0, life, kind, fn) { PE.push({ t0: t0, life: life, kind: kind, fn: fn }); }
  var FWC = ['#ffd23f', '#ff5f7e', '#6ec6ff', '#8ee07a', '#c48bff'];
  EVFX.forEach(function (e) {
    var t = e.t, k = e.who, i, j;
    /* les positions sont calculées au moment du rendu (selon le format) : les fonctions reçoivent le format */
    if (e.fx === 'flame') {
      var n = Math.round((e.dur || .5) * 46), dir = e.dir || 'up';
      for (i = 0; i < n; i++) (function (i) {
        var t0 = t + i * (e.dur || .5) / n, life = .55 + rnd(i + 3) * .25, sp = 70 + rnd(i) * 80, spr = (rnd(i + 9) - .5) * .7;
        P(t0, life, 'flame', function (u, tt) {
          var m = mouthPos(k, t0), a = (dir === 'up' ? -Math.PI / 2 : (dir === 'L' ? Math.PI : (dir === 'R' ? 0 : -Math.PI / 2))) + spr;
          var d = sp * u * life;
          return { x: m.x + Math.cos(a) * d, y: m.y + Math.sin(a) * d - 14 * u, r: 5 + 12 * Math.sin(Math.PI * Math.min(1, u * 1.1)) * (1 - .4 * u), a: 1 - u * u, rot: a * 180 / Math.PI + 90, k: u };
        });
      })(i);
      P(t, .35, 'ring', function (u) { var m = mouthPos(k, t); return { x: m.x, y: m.y, r: 8 + u * 40, a: (1 - u) * .8, col: '#ffb347' }; });
    }
    else if (e.fx === 'smoke') {
      var n2 = Math.round((e.dur || 2) * 7), tx = e.extra;   /* extra = 'ball' pour suivre la balle */
      for (i = 0; i < n2; i++) (function (i) {
        var t0 = t + i * (e.dur || 2) / n2, dxs = (rnd(i + 5) - .5) * 20;
        P(t0, 1.6, 'puff', function (u) {
          var bx, by;
          if (tx === 'ball') { var bp = ballPos(t0); bx = bp.x; by = bp.y - 10; } else { var m = mouthPos(k, t0); bx = m.x; by = m.y - 40; }
          return { x: bx + dxs + 14 * u, y: by - 60 * u, r: 6 + 20 * u, a: (1 - u) * .55, col: '#8a8f99' };
        });
      })(i);
    }
    else if (e.fx === 'steam') {
      var n3 = Math.round((e.dur || 1.6) * 10);
      for (i = 0; i < n3; i++) (function (i) {
        var t0 = t + i * (e.dur || 1.6) / n3, dxs = (rnd(i + 11) - .5) * 40;
        P(t0, 1.1, 'puff', function (u) { var x = wx(xOf(k, t0)), y = actorY(k, t0) - 40; return { x: x + dxs + 8 * Math.sin(u * 6 + i), y: y - 70 * u, r: 8 + 16 * u, a: (1 - u) * .6, col: '#f4f6fa' }; });
      })(i);
    }
    else if (e.fx === 'sparkle') {
      var n4 = Math.round((e.dur || 1.5) * 12);
      for (i = 0; i < n4; i++) (function (i) {
        var t0 = t + i * (e.dur || 1.5) / n4, an = rnd(i) * 6.28, rad = 30 + rnd(i + 4) * 36;
        P(t0, .9, 'spark', function (u) { var x = wx(xOf(k, t0)), y = actorY(k, t0) - AC[k].hover - 45 * AC[k].s; return { x: x + Math.cos(an) * rad, y: y + Math.sin(an) * rad * .8 - 14 * u, r: 1 + 7 * Math.sin(Math.PI * u), a: 1, rot: u * 180 }; });
      })(i);
    }
    else if (e.fx === 'hearts') {
      var n5 = Math.round((e.dur || 1.5) * 5);
      for (i = 0; i < n5; i++) (function (i) {
        var t0 = t + i * (e.dur || 1.5) / n5, dxs = (rnd(i + 2) - .5) * 50;
        P(t0, 1.5, 'heart', function (u) { var x = wx(xOf(k, t0)), y = actorY(k, t0) - AC[k].hover - 100 * AC[k].s; return { x: x + dxs + 8 * Math.sin(u * 7), y: y - 70 * u, r: 7 + 7 * Math.sin(Math.PI * Math.min(1, u * 1.2)), a: 1 - u * u, rot: 0 }; });
      })(i);
    }
    else if (e.fx === 'confetti') {
      var n6 = Math.round((e.dur || 3) * 22), cols = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#b185db', '#ff924c'];
      for (i = 0; i < n6; i++) (function (i) {
        var t0 = t + rnd(i) * (e.dur || 3), px = rnd(i + 30), vy = 120 + rnd(i + 50) * 90;
        P(t0, 2.4, 'conf', function (u, tt) { var cx = wx(.5) + (px - .5) * 760 + 18 * Math.sin(u * 8 + i); return { x: cx, y: -80 + u * 2.4 * vy + 60 * u, r: 1, a: 1, rot: u * 700 + i * 40, col: cols[i % 6] }; });
      })(i);
    }
    else if (e.fx === 'fireworks') {
      var bursts = e.dur || 3;
      for (j = 0; j < bursts; j++) (function (j) {
        var bt = t + j * .9, cx = 400 + (rnd(j + 5) - .5) * 520, cy = 90 + rnd(j + 9) * 70, col = FWC[j % 5];
        for (i = 0; i < 20; i++) (function (i) {
          var an = i / 20 * 6.283, v = (i % 2 ? 98 : 64);
          P(bt, 1.7, 'dot', function (u) { var d = v * u * 1.7 * (1 - .25 * u * 1.7); return { x: cx + Math.cos(an) * d, y: cy + Math.sin(an) * d + 38 * (u * 1.7) * (u * 1.7), r: 6 * (1 - u * .8), a: 1 - u, col: col }; });
        })(i);
        EVSFX.push({ t: bt, key: 'feu_artifice', vol: .55, variant: j });
      })(j);
    }
    else if (e.fx === 'rain') {
      var d4 = e.dur || 4, rate = 26, n7 = Math.round(d4 * rate);
      for (i = 0; i < n7; i++) (function (i) {
        var t0 = t + i / rate, off = (rnd(i + 70) - .5) * 150, fall = .75 + rnd(i + 8) * .2;
        P(t0, fall, 'drop', function (u) {
          var x = wx(xOf(k, t0)) + off, y0 = actorY(k, t0) - 95 * AC[k].s + 6;
          return { x: x, y: lerp(y0, GY + 6, u * u * .4 + u * .6), r: 1, a: .9 * Math.min(1, u * 8) * (u > .97 ? 0 : 1), rot: 8 };
        });
        P(t0 + fall, .3, 'splashe', function (u) { var x = wx(xOf(k, t0 + fall)) + off; return { x: x, y: GY + 9 + (i % 3) * 3, r: 3 + u * 9, a: (1 - u) * .8 }; });
      })(i);
      RAIN.push([t, t + d4]);
    }
    else if (e.fx === 'lightning') { EVSFX.push({ t: t, key: 'impact_c', vol: .6 }); SHK.push([t, 4]); P(t, .7, 'bolt', function (u) { var x = wx(xOf(k, t)) + 20, y = actorY(k, t) - 60; return { x: x, y: y, r: GY - y, a: Math.abs(Math.sin(u * 19)) * Math.exp(-u * 4.5), flash: Math.abs(Math.sin(u * 19)) * Math.exp(-u * 4.5) * .5 }; }); }
    else if (e.fx === 'ring') {
      var col2 = e.extra || '#ffffff';
      P(t, .8, 'ring', function (u) { var x = wx(xOf(k, t)), y = actorY(k, t) - 30; return { x: x, y: y, r: 10 + u * (e.dur || 120), a: 1 - u, col: col2 }; });
    }
    else if (e.fx === 'stars') {
      var n8 = Math.round((e.dur || 2) * 3);
      for (i = 0; i < 3; i++) (function (i) { P(t, e.dur || 2, 'spark', function (u, tt) { var x = wx(xOf(k, t)), y = actorY(k, t) - AC[k].hover - 100 * AC[k].s; var an = (tt - t) * 5 + i * 2.09; return { x: x + Math.cos(an) * 26, y: y + Math.sin(an) * 7, r: 6, a: u > .9 ? (1 - u) * 10 : 1, rot: an * 60 }; }); })(i);
    }
    else if (e.fx === 'foam') {
      var n9 = 34, mx = e.extra !== undefined ? e.extra : null;
      for (i = 0; i < n9; i++) (function (i) {
        var an = -Math.PI / 2 + (rnd(i) - .5) * 2.4, v = 90 + rnd(i + 7) * 130, r0 = 7 + rnd(i + 3) * 8;
        P(t, 1.5, 'puff', function (u) { var m = machinePos(); return { x: m.x + Math.cos(an) * v * u, y: m.y - 30 + Math.sin(an) * v * u + 180 * u * u, r: r0 * (1 - .3 * u), a: 1 - u * u, col: i % 3 ? '#ffffff' : '#b9e6ff' }; });
      })(i);
    }
    else if (e.fx === 'sweat') {
      P(t, .9, 'drop', function (u) { var x = wx(xOf(k, t)) + 30 * AC[k].s, y = actorY(k, t) - AC[k].hover - 80 * AC[k].s; return { x: x + 4 * u, y: y + 30 * u, r: 1, a: 1 - u, rot: 0 }; });
    }
    else if (e.fx === 'ripple') {   /* EV-001 : 3 ondulations concentriques à l'eau, au pied de l'acteur (extra = y de l'eau) */
      var wy2 = e.extra !== undefined ? e.extra : (AC[k] && AC[k].depths.length ? GY - 12 - DEPTH_DY * depthOf(k, t) : GY - 12);
      for (j = 0; j < 3; j++) (function (j) { P(t + j * .28, 1.2, 'splashe', function (u) { return { x: wx(xOf(k, t)), y: wy2, r: 8 + u * 38, a: (1 - u) * .75 }; }); })(j);
      EVSFX.push({ t: t, key: 'blop', vol: .35, variant: 1 });
    }
    else if (e.fx === 'drip') {   /* EV-004 : gouttes qui tombent d'un personnage mouillé */
      var ddur = e.dur || 2.5;
      for (i = 0; i < Math.round(ddur * 5); i++) (function (i) {
        var t0 = t + i * .2 + rnd(i + 40) * .12, dx = (rnd(i + 11) - .5) * 56;
        P(t0, .75, 'drop', function (u) { return { x: wx(xOf(k, t0)) + dx * AC[k].s, y: actorY(k, t0) - (34 - 30 * u * u) * AC[k].s - 6 + 46 * u * u * AC[k].s, r: 1, a: (1 - u) * .9, rot: 0 }; });
      })(i);
    }
    else if (e.fx === 'fireout') {   /* EV-005 : fumée grise d'un feu qui s'éteint */
      for (var q = 0; q < 9; q++) (function (q) { var t1 = t + q * e.dur / 9; P(t1, 1.5, 'puff', function (u) { return { x: wx(e.x) + (q % 3 - 1) * 8 + 16 * u, y: GY - e.y - 30 - 70 * u, r: 7 + 18 * u, a: (1 - u) * .6, col: '#d9dde3' }; }); })(q);
    }
    else if (e.fx === 'ringat') {   /* EV-004 : ondulations à un endroit de l'eau (cailloux qui tombent) */
      for (j = 0; j < 3; j++) (function (j) { P(t + j * .14, .9, 'splashe', function (u) { return { x: wx(e.x), y: e.y, r: 6 + u * 30, a: (1 - u) * .85 }; }); })(j);
      EVSFX.push({ t: t, key: 'blop', vol: .5, variant: 1 });
    }
    else if (e.fx === 'splashbig') {   /* EV-001 : gerbe d'eau (gouttes + 2 anneaux) */
      var wy3 = e.extra !== undefined ? e.extra : (AC[k] && AC[k].depths.length ? GY - 12 - DEPTH_DY * depthOf(k, t) : GY - 12), nd = 16;
      for (i = 0; i < nd; i++) (function (i) {
        var an = -Math.PI / 2 + (rnd(i + 3) - .5) * 1.9, v = 110 + rnd(i + 9) * 120;
        P(t, .95, 'drop', function (u) { var x = wx(xOf(k, t)) + Math.cos(an) * v * u * .9, y = wy3 + Math.sin(an) * v * u + 360 * u * u; return { x: x, y: y, r: 1, a: (1 - u * u) * .95, rot: (an * 57.3 + 90) * .3 }; });
      })(i);
      for (j = 0; j < 2; j++) (function (j) { P(t + j * .12, .9, 'splashe', function (u) { return { x: wx(xOf(k, t)), y: wy3 + 2, r: 10 + u * 56, a: (1 - u) * .9 }; }); })(j);
      EVSFX.push({ t: t, key: 'eclabousse_eau', vol: .8, variant: 1 });
    }
    else if (e.fx === 'vapeur') {   /* EV-001 : vapeur grise quand Flamme touche l'eau (réutilise puff) */
      var wy4 = e.extra !== undefined ? e.extra : GY - 22, dur5 = e.dur || 1.6;
      for (i = 0; i < 12; i++) (function (i) {
        var t0 = t + rnd(i + 20) * dur5 * .5, dx = (rnd(i + 5) - .5) * 46;
        P(t0, 1.4, 'puff', function (u) { return { x: wx(xOf(k, t0)) + dx + 10 * Math.sin(u * 5 + i), y: wy4 - u * 70, r: 6 + u * 14, a: .75 * (1 - u), col: i % 2 ? '#eef2f7' : '#cfd6df' }; });
      })(i);
    }
    else if (e.fx === 'zzz') {   /* EV-005 : petits « z » qui montent d'un personnage endormi */
      var nz = Math.max(2, Math.round((e.dur || 3) / 1.1));
      for (i = 0; i < nz; i++) (function (i) { var t0 = t + i * 1.1; P(t0, 1.9, 'zz', function (u) { var m = mouthPos(k, t0); return { x: m.x + 14 + 22 * u + 6 * Math.sin(u * 6 + i), y: m.y - 14 - 62 * u, r: 7 + 7 * u, a: Math.min(1, u * 5) * (1 - u) * .9 }; }); })(i);
    }
  });

  /* ---------- 6. Accessoires : balle + machine ---------- */
  var BALL = [], MACH = { segs: [], boom: [], show: [[-1, 0]] };
  PROPS.ball.forEach(function (c) {
    var a = c.a, t = c.t, v = a[0];
    if (v === 'show') BALL.push({ t0: t, t1: t, x0: a[1], x1: a[1], h: 0, vis: 1, burnt: 0 });
    else if (v === 'toss') { BALL.push({ t0: t, t1: t + a[3], from: a[1], to: a[2], h: a[4] || 70, vis: 1, tossed: 1 }); EVSFX.push({ t: t, key: 'pop', vol: .5 }); EVSFX.push({ t: t + a[3], key: 'boing', vol: .5, variant: 1 }); }
    else if (v === 'burn') { BALL.push({ t0: t, t1: t, isBurn: 1 }); }
    else if (v === 'hide') BALL.push({ t0: t, t1: t, hide: 1 });
  });
  function ballPos(t) {
    var st = { x: wx(.5), y: GY - 14, vis: 0, burn: 0 }, i;
    for (i = 0; i < BALL.length; i++) {
      var b = BALL[i]; if (b.t0 > t) break;
      if (b.hide) { st.vis = 0; continue; }
      if (b.isBurn) { st.burn = 1; st.burnT = b.t0; continue; }
      st.vis = 1;
      if (b.tossed) {
        var u = cl((t - b.t0) / (b.t1 - b.t0)), xa = wx(xOf(b.from, b.t0)), xb = wx(xOf(b.to, b.t1)), ya = GY - 36, yb = GY - 36;
        if (t < b.t1) { st.x = lerp(xa, xb, u); st.y = lerp(ya, yb, u) - b.h * 4 * u * (1 - u); st.rot = u * 540; }
        else { var after = t - b.t1; st.x = xb; st.y = GY - 14 - Math.abs(Math.sin(after * 7)) * 22 * Math.exp(-after * 3); st.rot = 540 + after * 100 * Math.exp(-after * 2); }
      } else { st.x = wx(b.x0); st.y = GY - 14; st.rot = 0; }
    }
    return st;
  }
  PROPS.machine.forEach(function (c) {
    var a = c.a, t = c.t, v = a[0];
    if (v === 'show') MACH.show.push([t, 1, a[1], a[2] || 'pop', a[3] || 0]);
    else if (v === 'hide') MACH.show.push([t, 0]);
    else if (v === 'shake') MACH.boom.push({ t: t, dur: a[1] || 1.2, kind: 'shake' });
    else if (v === 'boom') { MACH.boom.push({ t: t, dur: .6, kind: 'boom' }); EVFX.push({ t: t, fx: 'foam', who: null }); EVSFX.push({ t: t, key: 'petite_explosion', vol: .9 }); SHK.push([t, 5]); }
  });
  /* les particules de mousse ont été ajoutées après coup : on les ajoute ici */
  EVFX.filter(function (e) { return e.fx === 'foam' && !e.done; }).forEach(function (e) {
    e.done = 1; var t = e.t;
    for (var i = 0; i < 38; i++) (function (i) {
      var an = -Math.PI / 2 + (rnd(i) - .5) * 2.6, v = 90 + rnd(i + 7) * 140, r0 = 7 + rnd(i + 3) * 9;
      P(t, 1.7, 'puff', function (u) { var m = machinePos(); return { x: m.x + Math.cos(an) * v * u, y: m.y - 34 + Math.sin(an) * v * u + 200 * u * u, r: r0 * (1 - .3 * u), a: 1 - u * u, col: i % 3 ? '#ffffff' : '#b9e6ff' }; });
    })(i);
  });
  function machineState(t) {
    var s = { vis: 0, x: .5, pop: 0 }, i, last = null;
    for (i = 0; i < MACH.show.length; i++) { var m = MACH.show[i]; if (m[0] <= t) { s.vis = m[1]; if (m[2] !== undefined) { s.x = m[2]; } s.d = m[4] || 0; s.t0 = m[0]; } }
    return s;
  }
  function machinePos() { var s = machineState(1e9); /* dernière position connue */ var x = 400, i; for (i = 0; i < MACH.show.length; i++) if (MACH.show[i][2] !== undefined) x = wx(MACH.show[i][2]); return { x: x, y: GY }; }

  /* ---------- 7. État d'un personnage à l'instant t ---------- */
  /* synchro labiale v2 : formes de bouche issues de l'enveloppe audio (vis/amp à 50 Hz) */
  var VP = [{ o: 0, w: 1 }, { o: .14, w: .84 }, { o: .6, w: 1.08 }, { o: 1.2, w: 1 }, { o: .85, w: .64 }, { o: .42, w: 1.3 }];
  function mouthAt(k, t) {
    for (var i = 0; i < L.length; i++) {
      var l = L[i]; if (l.who !== k || t < l.t - .05 || t > l.e + .05 || !l.vis) continue;
      var f = (t - l.t) * 50, c = Math.round(f), o = 0, w = 0, ws = 0, am = 0, d;
      for (d = -2; d <= 2; d++) { var j = c + d, wt = 3 - Math.abs(d), ch = j >= 0 && j < l.vis.length ? +l.vis[j] : 0, a = j >= 0 && j < l.amp.length ? +l.amp[j] : 0; var pr = VP[ch]; o += wt * pr.o * (ch >= 2 ? .5 + .5 * a / 9 : 1); w += wt * pr.w; ws += wt; am += wt * a / 9; }
      return { open: o / ws, w: w / ws, act: am / ws };
    }
    return { open: 0, w: 1, act: 0 };
  }
  function anyoneSpeaking(t) { for (var i = 0; i < L.length; i++) if (t >= L[i].t && t < L[i].e) return L[i].who; return null; }
  /* clignements irréguliers (déterministes) */
  var BLINKS = {};
  function blinkAmt(k, t) {
    var A = AC[k]; if (!BLINKS[k]) { var arr = [], tt = .8 + RND(A.phase * 7) * 2, n = 0; while (tt < 400) { arr.push(tt); if (RND(n * 3.7 + A.phase) < .26) arr.push(tt + .3); tt += 2.2 + RND(n * 1.9 + A.phase * 5) * 3.6; n++; } BLINKS[k] = arr; }
    var b = BLINKS[k], v = 0; for (var i = 0; i < b.length; i++) { var d = t - b[i]; if (d < 0) break; if (d < .17) v = Math.max(v, d < .06 ? d / .06 : (d < .09 ? 1 : 1 - (d - .09) / .08)); }
    return v;
  }
  function gaze(k, t) {
    var A = AC[k], u = t / 1.35 + A.phase, n = Math.floor(u), q = SM((u - n) / .22);
    var ax = (RND(n * 5.3 + A.phase) - .5) * .5, ay = (RND(n * 2.9 + A.phase * 3) - .5) * .3, bx = (RND((n - 1) * 5.3 + A.phase) - .5) * .5, by = (RND((n - 1) * 2.9 + A.phase * 3) - .5) * .3;
    return { x: bx + (ax - bx) * q, y: by + (ay - by) * q };
  }
  function moodBlend(A, t) {
    var m = A.moods, ix = 0, i; for (i = 0; i < m.length; i++) { if (m[i][0] <= t) ix = i; else break; }
    return { cur: m[ix][1], prev: ix > 0 ? m[ix - 1][1] : m[ix][1], k: SM((t - m[ix][0]) / .45) };
  }
  function speaking(k, t) { for (var i = 0; i < L.length; i++) if (L[i].who === k && t >= L[i].t && t < L[i].e) return Math.abs(Math.sin(t * 13)) * (.55 + .45 * Math.abs(Math.sin(t * 3.7))); return 0; }
  function curLine(t) { var r = -1; for (var i = 0; i < L.length; i++) if (t >= L[i].t - .05) r = i; return r; }
  function hopf(t, s, per, h) { var p = (((t - s) / per) % 1 + 1) % 1, sn = Math.sin(Math.PI * p), sx = 1 - .06 * sn, sy = 1 + .1 * sn; if (p < .12) { var kk = 1 - p / .12; sy = 1 - .22 * kk; sx = 1 + .2 * kk; } return { y: h * sn, sx: sx, sy: sy, p: p }; }

  function astate(k, t) {
    var A = AC[k], o = { x: wx(xOf(k, t)), y: 0, sx: 1, sy: 1, rot: 0, vis: visOf(k, t), armL: null, armR: null, dx: 0, extra: {} }, i;
    var x0 = xOf(k, t), x1 = xOf(k, t + .08), vel = (x1 - x0) / .08;
    var moving = Math.abs(vel) > .03;
    var phase = t * 2 + A.phase;
    /* idle */
    if (A.style === 'float') { o.y = A.hover + 4 * Math.sin(t * 2.2 + A.phase) + (A.kind === 'grincheux' ? 3 : 0); o.sy = 1 + .015 * Math.sin(t * 2.2); }
    else if (V2) { var br = Math.sin(t * 1.9 + A.phase); o.sy = 1 + .024 * br; o.sx = 1 - .015 * br; }
    else { var br = Math.sin(t * 2.6 + A.phase); o.sy = 1 + .02 * br; o.sx = 1 - .012 * br; }
    /* marche */
    if (moving) {
      var seg = null; for (i = 0; i < A.segs.length; i++) if (t >= A.segs[i].t0 && t < A.segs[i].t1) seg = A.segs[i];
      var sty = (seg && seg.style) || A.style, f = t * (sty === 'hop' ? 2.4 : 3.4) + A.phase;
      if (sty === 'hop') { var h = hopf(t, A.phase, .42, 26); o.y += h.y; o.sx *= h.sx; o.sy *= h.sy; o.rot += 6 * Math.sign(vel); }
      else if (sty === 'waddle' || sty === 'walk') { o.y += Math.abs(Math.sin(f * Math.PI * 1.2)) * 7; o.rot += Math.sin(f * Math.PI * 1.2) * 6 + 4 * Math.sign(vel); }
      else if (sty === 'drive') { o.rot += 5 * Math.sign(vel); o.y += Math.abs(Math.sin(f * 4)) * 1.5; }
      else if (sty === 'float' || sty === 'fly') { o.rot += 8 * Math.sign(vel); o.y += 6 * Math.sin(f); }
      else if (sty === 'roll') { o.rot += (t * 500) % 360; }
      o.extra.moving = 1; o.extra.vel = vel;
    }
    /* anims */
    for (i = 0; i < A.anims.length; i++) {
      var an = A.anims[i], u = (t - an.t0) / an.dur;
      if (u < 0 || u > 1.0001) { if (an.name === 'faint' && u > 1) { o.rot += 88; o.y -= 0; } continue; }
      var nm = an.name, pn = an.p || 1;
      if (nm === 'hop') { var hh = hopf(t, an.t0, an.dur / pn, 34); o.y += hh.y; o.sx *= hh.sx; o.sy *= hh.sy; o.armL = 120; o.armR = 120; }
      else if (nm === 'jump' && V2) { var uu = cl((u - .12) / .78), sj = Math.sin(Math.PI * uu); o.y += (pn > 1 ? pn : 90) * sj; if (u < .12) { var k1 = Math.sin(u / .12 * Math.PI / 2); o.sy *= 1 - .22 * k1; o.sx *= 1 + .15 * k1; } else if (u > .9) { var k2 = Math.sin((u - .9) / .1 * Math.PI); o.sy *= 1 - .2 * k2; o.sx *= 1 + .14 * k2; } else { o.sy *= 1 + .12 * sj; o.sx *= 1 - .07 * sj; } o.armL = 150; o.armR = 150; }
      else if (nm === 'jump') { var sn = Math.sin(Math.PI * u); o.y += (pn > 1 ? pn : 90) * sn; o.sy *= 1 + .14 * sn; o.sx *= 1 - .08 * sn; o.armL = 150; o.armR = 150; }
      else if (nm === 'spin') { o.rot += 360 * sm(u); o.y += 40 * Math.sin(Math.PI * u); }
      else if (nm === 'shake') { o.dx += 3.2 * Math.sin(t * 60) * (1 - u * .3); o.rot += 3 * Math.sin(t * 47); }
      else if (nm === 'squish') { var e = Math.sin(Math.PI * u * 2) * Math.exp(-u * 2); o.sx *= 1 + .3 * e; o.sy *= 1 - .3 * e; }
      else if (nm === 'tug') { o.armL = -102 + 6 * Math.sin(t * 9 + 1.6); o.armR = 100 + 6 * Math.sin(t * 9); o.armLX = 72; o.armLY = 14; o.lookOv = 'RD'; o.armS = 1.9; o.rot += 12 + 3 * Math.sin(t * 9); o.dx += 5 * Math.sin(t * 9); o.sx *= 1 + .03 * Math.sin(t * 9); }   /* EV-004 : tire de toutes ses forces */
      else if (nm === 'wave') { o.armL = 40; o.armR = 100 + 60 * Math.sin(t * 12); }
      else if (nm === 'cheer') { o.armL = 150 + 15 * Math.sin(t * 10); o.armR = 150 + 15 * Math.sin(t * 10 + 2); o.y += Math.abs(Math.sin(t * 7)) * 14; }
      else if (nm === 'dance') { o.rot += 9 * Math.sin(t * 8); o.y += Math.abs(Math.sin(t * 8)) * 18; o.armL = 80 + 70 * Math.sin(t * 8); o.armR = 80 + 70 * Math.sin(t * 8 + Math.PI); }
      else if (nm === 'nod') { o.y -= 4 * Math.abs(Math.sin(u * Math.PI * 2 * pn)); o.sy *= 1 - .05 * Math.abs(Math.sin(u * Math.PI * 2 * pn)); }
      else if (nm === 'fall') { o.rot += 90 * sm(u); o.y -= 12 * sm(u); o.sy *= 1 - .2 * sm(u); }
      else if (nm === 'faint') { o.rot += 88 * sm(u * 2); }
      else if (nm === 'flop') { var fl = Math.sin(Math.PI * Math.min(1, u * 2)); o.sx *= 1 + .5 * fl; o.sy *= 1 - .5 * fl; }
      else if (nm === 'hic') { var hu = Math.sin(Math.PI * Math.min(1, u * 1.4)); o.sy *= 1 + .22 * hu * (u < .4 ? 1 : -.5); o.sx *= 1 - .12 * hu; o.y += 16 * hu; o.rot -= 6 * hu; }
      else if (nm === 'pop') { var pp = sm(u); o.sx *= pp * (1 + .25 * Math.sin(Math.PI * u)); o.sy *= pp * (1 + .25 * Math.sin(Math.PI * u)); }
      else if (nm === 'drop') { var dt = 1 - u; o.y += 360 * dt * dt; o.rot += 360 * dt; if (u > .9) { o.sy *= .7 + (1 - u) * 3; o.sx *= 1.2 - (1 - u); } }
      else if (nm === 'ascend') { var ea = sm(u); o.y += 340 * ea; o.rot += 300 * ea; o.sx *= 1 - .5 * ea; o.sy *= 1 - .5 * ea; }
      else if (nm === 'bounce') { var hb = hopf(t, an.t0, .5, 30 * pn); o.y += hb.y; o.sx *= hb.sx; o.sy *= hb.sy; }
      else if (nm === 'tremble') { o.dx += 1.6 * Math.sin(t * 70); }
      else if (nm === 'lean') { o.rot += 14 * Math.sin(Math.PI * u); }
      else if (nm === 'puff') { o.sx *= 1 + .25 * Math.sin(Math.PI * u); o.sy *= 1 + .25 * Math.sin(Math.PI * u); }
    }
    if (o.vis < 1) o.vis = o.vis;
    /* visage */
    var talk, mA = null;
    if (V2) { mA = mouthAt(k, t); talk = Math.min(1, mA.act * 1.15); } else talk = speaking(k, t);
    o.emo = lastOf(A.moods, t);
    if (V2) { var mb = moodBlend(A, t); o.emoPrev = mb.prev; o.emoK = mb.k; }
    var lk = lastOf(A.looks, t), lx = 0, ly = 0;
    if (typeof lk === 'string' && AC[lk]) { var dxl = wx(xOf(lk, t)) - o.x; lx = cl(dxl / 120, -1, 1); ly = -.1; }
    else if (lk === 'up') ly = -1; else if (lk === 'RD') { lx = 1; ly = 1; } else if (lk === 'down') ly = 1; else if (lk === 'L') lx = -1; else if (lk === 'R') lx = 1;
    if (o.lookOv === 'RD') { lx = 1; ly = 1; }
    if (o.extra.moving) lx = cl(Math.sign(vel) * .7 + lx * .3, -1, 1);
    if (!lk || lk === 'cam') { lx = 0; ly = 0; }
    if (V2) { var gz = gaze(k, t); lx = cl(lx + gz.x * (lx || ly ? .35 : 1), -1, 1); ly = cl(ly + gz.y * (lx || ly ? .35 : 1), -1, 1); }
    o.lx = lx; o.ly = ly; o.open = V2 ? mA.open : talk; o.blink = ((t * 1 + A.phase * 3.3) % 3.4) < .12;
    if (V2) {
      o.mw = mA.w; o.blinkAmt = blinkAmt(k, t);
      var sp = anyoneSpeaking(t), idleNow = !o.extra.moving && !A.anims.some(function (an) { return t >= an.t0 && t <= an.t0 + an.dur; });
      /* micro-mouvements pendant les dialogues */
      if (talk > .02) { o.y += 2.4 * mA.open; o.rot += 1.8 * Math.sin(t * 2.3 + A.phase * 2) * talk + 1.2 * Math.sin(t * 5.1 + A.phase) * mA.open; o.sy *= 1 + .02 * mA.open; }
      else if (sp && sp !== k && idleNow) { var nu = ((t * .34 + A.phase * .37) % 1); if (nu < .09) o.y -= 3.2 * Math.sin(Math.PI * nu / .09); o.rot += 1.1 * Math.sin(t * 1.3 + A.phase); }
      /* signature gestuelle */
      if (idleNow) {
        if (A.kind === 'bouboule') { var bu = ((t * .38 + A.phase) % 1); if (bu < .16) { var bs = Math.sin(Math.PI * bu / .16); o.y += 5 * bs; o.sy *= 1 + .03 * bs; } }
        else if (A.kind === 'pitou') { o.rot += 3.2 * Math.sin(t * 1.1 + A.phase); o.y += 2 * Math.sin(t * 1.7 + A.phase); }
        else if (A.kind === 'robi') { o.rot += 2.2 * Math.round(Math.sin(t * .8 + A.phase) * 2) / 2; }
        else if (A.kind === 'flamme') { o.rot += 1.6 * Math.sin(t * 2.2 + A.phase); o.sx *= 1 + .012 * Math.sin(t * 4.4); }
        else if (A.kind === 'grincheux') { o.rot += 2 * Math.sin(t * .9 + A.phase); }
      }
    }
    if (o.emo === 'laugh') o.open = Math.max(o.open, .5 + .3 * Math.sin(t * 20));
    /* bras */
    var rest = CHAR_INFO[A.kind].armRest;
    if (o.armL === null) { var g = talk * (30 * Math.abs(Math.sin(t * 5.1)) + 8); o.armL = 16 + (A.kind === 'robi' ? 4 : 0) + g + 2 * Math.sin(t * 3); }
    if (o.armR === null) { var g2 = talk * (30 * Math.abs(Math.sin(t * 4.3 + 1)) + 8); o.armR = 16 + g2 + 2 * Math.sin(t * 3 + 1); }
    /* émotion → bras */
    if (o.emo === 'angry') { o.armL = Math.max(o.armL, 10); o.armR = Math.max(o.armR, 10); }
    if (o.emo === 'scared') { o.armL = 70; o.armR = 70; o.dx += 1.2 * Math.sin(t * 55); }
    if (o.emo === 'sad' && talk < .1) { o.armL = 8; o.armR = 8; o.sy *= .97; }
    /* lueur, suie */
    var gl = 0; for (i = 0; i < A.glow.length; i++) { var g3 = A.glow[i]; gl = t >= g3[2] ? g3[1] : (t >= g3[0] ? lerp(gl, g3[1], (t - g3[0]) / (g3[2] - g3[0])) : gl); }
    var so = 0; for (i = 0; i < A.soot.length; i++) { var s3 = A.soot[i]; so = t >= s3[2] ? s3[1] : (t >= s3[0] ? lerp(so, s3[1], (t - s3[0]) / (s3[2] - s3[0])) : so); }
    o.glow = gl; o.soot = so;
    return o;
  }

  /* ---------- 8. Ciel / décor (clés) ---------- */
  var SKYKEYS = [[0, SKYK[0][1]]];
  SKYK.slice(1).sort(function (a, b) { return a[0] - b[0]; }).forEach(function (s) { SKYKEYS.push([s[0], SKYKEYS[SKYKEYS.length - 1][1]]); SKYKEYS.push([s[2], s[1]]); });
  function beamsAt(t) { var v = 0, i; for (i = 0; i < BEAMS.length; i++) if (BEAMS[i][0] <= t) v = BEAMS[i][1]; return v; }

  /* ---------- 9. Caméra ---------- */
  var CAMS = {};
  function buildCam(mode) {
    var cfg = LAYOUT[mode], K = [], kz = [], kx = [], ky = [], i;
    MODE = mode;
    function fyFor(z) { return mode === 'land' ? lerp(290, 366, cl((z - 1) / .38)) : (GY - .36 * cfg.VH / z); }
    function add(t, z, fx, fy) { if (kz.length && t <= kz[kz.length - 1][0]) t = kz[kz.length - 1][0] + .05; kz.push([t, z]); kx.push([t, fx]); ky.push([t, fy === undefined ? fyFor(z) : fy]); }
    function visMean(t, excl) { var s = 0, n = 0; LET.forEach(function (k) { if (visOf(k, t) && k !== excl) { s += wx(xOf(k, t)); n++; } }); return n ? s / n : 400; }
    var closeZ = cfg.zoomClose, wideZ = cfg.zoomWide;
    add(0, wideZ, 400); add(LEAD - .4, wideZ, 400);
    L.forEach(function (ln) {
      var tm = ln.t + .2;
      if (ln.who === 'N' || !AC[ln.who]) { var z = wideZ * (mode === 'port' ? 1.12 : 1.04); add(tm, z, visMean(tm)); add(ln.e - .1, z, visMean(ln.e - .3)); }
      else {
        var sx = wx(xOf(ln.who, ln.t + .2)), ox = visMean(ln.t + .2, ln.who), wgt = mode === 'port' ? .78 : .7, fx = sx * wgt + ox * (1 - wgt);
        var z2 = closeZ; add(tm, z2, fx); add(ln.e - .1, z2, wx(xOf(ln.who, ln.e - .1)) * wgt + visMean(ln.e - .1, ln.who) * (1 - wgt));
      }
    });
    add(ENDT - OUTRO + .6, wideZ, 400); add(ENDT, wideZ, 400);
    EVCAM.sort(function (a, b) { return a.t - b.t; });
    EVCAM.forEach(function (c, j) { var nx = EVCAM[j + 1]; if (nx && c.t + c.dur > nx.t - .3) c.dur = Math.max(.3, nx.t - .3 - c.t); });
    /* les clés auto situées dans une fenêtre de cam explicite sont retirées (sinon la caméra zigzague) */
    var keep = kz.map(function (k) { var ok = true; EVCAM.forEach(function (c) { if (k[0] > c.t - .15 && k[0] < c.t + c.dur + .15) ok = false; }); return ok; });
    kz = kz.filter(function (_, j) { return keep[j]; }); kx = kx.filter(function (_, j) { return keep[j]; }); ky = ky.filter(function (_, j) { return keep[j]; });
    EVCAM.forEach(function (c) {
      var tg = Array.isArray(c.tgt) ? c.tgt[mode === 'port' ? 1 : 0] : c.tgt;
      var tgtx = AC[tg] ? wx(xOf(tg, c.t + c.dur / 2)) : (typeof tg === 'number' ? wx(tg) : (typeof tg === 'string' && tg.charAt(0) === 'x' ? +tg.slice(1) : (tg === 'group' ? visMean(c.t + c.dur / 2) : 400)));
      if (c.rel) { var zz = cfg.zoomWide * c.zoom; kz.push([c.t, zz]); kx.push([c.t, tgtx]); ky.push([c.t, fyFor(zz)]); kz.push([c.t + c.dur, zz]); kx.push([c.t + c.dur, tgtx]); ky.push([c.t + c.dur, fyFor(zz)]); return; }
      /* on insère puis on re-trie */
      kz.push([c.t, c.zoom * (mode === 'port' ? .9 : 1)]); kx.push([c.t, tgtx]); ky.push([c.t, c.fy !== undefined ? c.fy : fyFor(c.zoom)]);
      kz.push([c.t + c.dur, c.zoom * (mode === 'port' ? .9 : 1)]); kx.push([c.t + c.dur, tgtx]); ky.push([c.t + c.dur, c.fy !== undefined ? c.fy : fyFor(c.zoom)]);
    });
    [kz, kx, ky].forEach(function (a) { a.sort(function (p, q) { return p[0] - q[0]; }); });
    /* retire doublons de temps */
    [kz, kx, ky].forEach(function (a) { for (var j = 1; j < a.length; j++) if (a[j][0] <= a[j - 1][0]) a[j][0] = a[j - 1][0] + .02; });
    CAMS[mode] = { z: kz, x: kx, y: ky };
  }
  var CAMFX = 400, CAMFY = 250;
  function camAt(t) {
    var c = CAMS[MODE], cfg = LAYOUT[MODE], z = 0, fx = 0, fy = 0, n = 0, d;
    for (d = -.75; d <= .76; d += .25) { var tt = Math.max(0, t + d); z += kf(c.z, tt); fx += kf(c.x, tt); fy += kf(c.y, tt); n++; }
    z /= n; fx /= n; fy /= n;
    var sx = 0, sy = 0;
    SHK.forEach(function (s) { var a = t - s[0]; if (a > 0 && a < 1.2) { var e = s[1] * Math.exp(-a * 5.5); sx += e * Math.sin(a * 47); sy += e * .7 * Math.cos(a * 39); } });
    var halfW = cfg.VW / 2 / z; fx = cl(fx, -60 + halfW, 860 - halfW);
    CAMFX = fx; CAMFY = fy;
    return 'translate(' + f1(cfg.VW / 2 + sx) + ' ' + f1(cfg.VH / 2 + sy) + ') scale(' + z.toFixed(4) + ') translate(' + f1(-fx) + ' ' + f1(-fy) + ')';
  }

  /* ---------- 10. Construction du DOM ---------- */
  var svg = $('scene'), cam = $('cam');
  var skyL = mk('g', { class: 'sky' }, cam), backL = mk('g', {}, cam), shadowL = mk('g', {}, cam), propL = mk('g', {}, cam), actL = mk('g', {}, cam), fxL = mk('g', {}, cam), frontL = mk('g', {}, cam), fxF = mk('g', {}, cam);
  var skyR = SETS.buildSky(skyL);
  var setNames = {}; setNames[EP.set || 'colline'] = 1; SETK.forEach(function (s) { setNames[s[1]] = 1; });
  var SETOBJ = {};
  Object.keys(setNames).forEach(function (n) {
    var b = mk('g', {}, backL), f = mk('g', {}, frontL);
    SETOBJ[n] = { b: b, f: f, r: SETS.build[n](b, f) };
  });
  var tintFront = mk('rect', { x: -500, y: -900, width: 1800, height: 2300, fill: '#fff', opacity: 0, 'pointer-events': 'none' }, fxF);


  /* personnages */
  var ACT_DOM = {}, shadows = {};
  LET.forEach(function (k) {
    var A = AC[k], ch = CHARS.LIB[A.kind].make();
    var sh = mk('ellipse', { rx: 34, ry: 7, fill: '#14213d', opacity: .22 }, shadowL);
    var ow = A.waters.length ? mk('g', {}, actL) : null, wr = null, wclr = null, wr1 = null, wr2 = null;
    var ax = mk('g', {}, ow || actL), sq = mk('g', {}, ax); sq.appendChild(ch.g);
    if (ow) {   /* EV-004 : niveau d'eau (le bas du corps est masqué sous la surface) */
      var wcl = mk('clipPath', { id: 'wcl_' + k }, actL); wclr = mk('rect', { x: -3000, y: -3000, width: 6000, height: 3000 }, wcl);
      wr = mk('g', {}, actL); wr1 = mk('ellipse', { fill: '#4cb4cf', 'fill-opacity': .55, stroke: 'none' }, wr); wr2 = mk('ellipse', { fill: 'none', stroke: '#fff', 'stroke-width': 2.4, opacity: .8 }, wr);
    }
    ACT_DOM[k] = { ax: ax, sq: sq, ch: ch, sh: sh, ow: ow, wr: wr, wclr: wclr, wr1: wr1, wr2: wr2 };
  });
  /* accessoires */
  var ballG = mk('g', {}, fxL), ballE = mk('circle', { r: 16, fill: '#ff5f7e', stroke: '#8a2a4a', 'stroke-width': 3 }, ballG);
  put(ballG, '<path d="M-14 -4 Q0 -10 14 -4 M-12 8 Q0 2 12 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>');
  var ballBurn = mk('circle', { r: 14, fill: '#1c1614', opacity: 0 }, ballG);
  var rbG = mk('g', {}, propL), rbP = [];
  ['#ff5a5a', '#ff9a3c', '#ffd93a', '#5fd36b', '#4cb8ff', '#6a6cf0', '#b36be0'].forEach(function (col, i) { rbP.push(mk('path', { d: 'M' + (80 + i * 9) + ' 405 Q360 ' + (-150 + i * 20) + ' ' + (640 - i * 9) + ' 405', fill: 'none', stroke: col, 'stroke-width': 10, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, rbG)); });
  rbG.setAttribute('opacity', 0);
  function rainbowState(t) { var p = 0, o = 0, i; for (i = 0; i < RBEV.length; i++) { var e = RBEV[i]; if (e.t > t) break; if (e.a[0] === 'show') { p = cl((t - e.t) / (e.a[1] || 3)); o = 1; } else if (e.a[0] === 'hide') { o = Math.max(0, 1 - (t - e.t) / (e.a[1] || 1.5)); } } return { p: sm(p), o: o }; }

  /* maison (ép. 3) : build -> tordue, collapse -> décombres, stake -> piquet */
  var houseG = mk('g', {}, propL);
  put(houseG,
    '<ellipse cy="3" rx="64" ry="8" fill="#14213d" opacity=".18"/>' +
    '<g class="hrub"><rect x="-52" y="-12" width="44" height="12" rx="3" fill="#e6c08a" stroke="#7b4f33" stroke-width="2.6" transform="rotate(-9 -30 -6)"/><rect x="-6" y="-9" width="50" height="10" rx="3" fill="#f2d2a0" stroke="#7b4f33" stroke-width="2.6" transform="rotate(7 18 -4)"/><path d="M-20 -18 L8 -40 L36 -16Z" fill="#d8654f" stroke="#7b3a2a" stroke-width="2.6" stroke-linejoin="round" transform="rotate(-18 8 -26)"/><rect x="26" y="-8" width="30" height="8" rx="3" fill="#c4915a" stroke="#7b4f33" stroke-width="2.4" transform="rotate(14 40 -4)"/></g>' +
    '<g class="hbd"><g class="hwl"><rect x="-46" y="-62" width="92" height="62" rx="3" fill="#f2d2a0" stroke="#7b4f33" stroke-width="3.2"/><rect x="-46" y="-62" width="30" height="62" fill="#e6bf86" opacity=".6"/><rect x="-36" y="-48" width="22" height="22" rx="2" fill="#a9d0ee" stroke="#7b4f33" stroke-width="3" transform="rotate(8 -25 -37)"/><rect x="8" y="-40" width="20" height="40" rx="9" fill="#7b4f33" transform="rotate(-4 18 -20)"/><circle cx="23" cy="-18" r="2" fill="#ffd23f"/></g>' +
    '<g class="hrf"><path d="M-58 -62 L0 -108 L58 -62Z" fill="#e0614e" stroke="#7b3a2a" stroke-width="3.4" stroke-linejoin="round"/><path d="M0 -108 L58 -62 L10 -62Z" fill="#bb4638"/></g></g>' +
    '<g class="hst"><rect x="-4" y="-48" width="8" height="46" rx="2" fill="#c4915a" stroke="#7b4f33" stroke-width="2.6"/><path d="M-4 -2 L0 8 L4 -2Z" fill="#7b4f33"/><path d="M4 -46 L26 -40 L4 -32Z" fill="#ff5f7e" stroke="#8a2a4a" stroke-width="2"/></g>');
  houseG.setAttribute('display', 'none');
  function houseState(t) {
    var st = { mode: 'none', t0: 0, x: 400 }, i, e;
    for (i = 0; i < PROPS.house.length; i++) {
      e = PROPS.house[i]; if (e.t > t) break; var v = e.a[0];
      if (V3) { var hset = SETK[0][1], k3; for (k3 = 0; k3 < SETK.length; k3++) if (SETK[k3][0] <= e.t) hset = SETK[k3][1]; }
      if (v === 'build') st = { set: hset, mode: 'build', t0: e.t, x: wx(e.a[1] === undefined ? .5 : e.a[1]), dur: e.a[2] || 3, s: e.a[3] || 1 };
      else if (v === 'walls') st = { set: hset, mode: 'walls', t0: e.t, x: e.a[1] === undefined ? (st.x || wx(.5)) : wx(e.a[1]), dur: e.a[2] || 3, s: e.a[3] || st.s || 1 };   /* EV-005 : murs sans toit */
      else if (v === 'collapse' && st.mode !== 'none') st = { set: hset, mode: 'collapse', t0: e.t, x: st.x, dur: .9, s: st.s };
      else if (v === 'clear') st = { mode: 'none', t0: e.t, x: st.x };
      else if (v === 'stake') st = { set: hset, mode: 'stake', t0: e.t, x: wx(e.a[1] === undefined ? .5 : e.a[1]), dur: .5, s: e.a[2] || 1 };
    }
    return st;
  }
  /* cailloux (EV-001) : gués dans l'eau (show/hide) et tas de pierres plates sur la berge (pile/unpile) */
  var STN = [], stnMax = 0, stnPile = null;
  var stnLen = 0; PROPS.stones.forEach(function (c) { if (c.a[0] === 'show') stnLen = (c.a[1] || []).length; else if (c.a[0] === 'add') stnLen += (c.a[1] || []).length; else if (c.a[0] === 'hide') stnLen = 0; stnMax = Math.max(stnMax, stnLen); });
  var stonesG = mk('g', {}, propL), stnEl = [];
  for (i = 0; i < stnMax; i++) {
    var sg = mk('g', {}, stonesG);
    put(sg, '<ellipse cy="6" rx="38" ry="9" fill="#14213d" opacity=".16"/><ellipse class="sf" cy="2" rx="36" ry="11" fill="none" stroke="#fff" stroke-width="2.4" opacity=".6"/>' +
      '<path d="M-31 0 Q-30 -12 -14 -14 L16 -14 Q31 -12 32 0 Q30 9 0 10 Q-30 9 -31 0Z" fill="#aaa397" stroke="#6f685d" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<ellipse cx="-2" cy="-9" rx="25" ry="5.6" fill="#cfc9be"/><ellipse cx="-9" cy="-10" rx="10" ry="2.2" fill="#e6e1d6" opacity=".8"/>');
    sg.setAttribute('display', 'none'); stnEl.push({ g: sg, sf: sg.querySelector('.sf') });
  }
  var pileG = mk('g', {}, propL);
  put(pileG, '<ellipse cy="3" rx="46" ry="7" fill="#14213d" opacity=".2"/>' +
    '<path d="M-38 0 Q-38 -9 -24 -10 L22 -10 Q38 -9 38 0Z" fill="#aaa397" stroke="#6f685d" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="-2" cy="-8" rx="26" ry="3.4" fill="#cfc9be"/>' +
    '<path d="M-30 -10 Q-30 -19 -16 -20 L20 -20 Q31 -19 31 -10Z" fill="#b8b1a5" stroke="#6f685d" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="0" cy="-18" rx="20" ry="2.8" fill="#d8d2c7"/>' +
    '<path d="M-22 -20 Q-22 -28 -10 -29 L12 -29 Q23 -28 23 -20Z" fill="#a39c90" stroke="#6f685d" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="0" cy="-27" rx="14" ry="2.4" fill="#c9c3b8"/>');
  pileG.setAttribute('display', 'none');
  var fireG = mk('g', {}, propL);   /* EV-005 : petit feu */
  put(fireG, '<g class="fch"><ellipse cy="-26" rx="15" ry="27" fill="#2e211b" opacity=".62"/><ellipse cy="-30" rx="8" ry="18" fill="#1b130f" opacity=".5"/></g>' +
    '<g class="fgl"><ellipse cy="-20" rx="78" ry="58" fill="#ffb347" opacity=".10"/><ellipse cy="-20" rx="50" ry="38" fill="#ffb347" opacity=".13"/><ellipse cy="-18" rx="30" ry="24" fill="#ffd77a" opacity=".18"/></g>' +
    '<g class="ffl"><path d="M0 0 C-26 -4 -24 -30 -6 -50 C-6 -34 4 -30 8 -44 C27 -26 26 -4 0 0Z" fill="#ff6d2a" stroke="#c4441a" stroke-width="2"/><path d="M0 -2 C-17 -4 -15 -22 -3 -36 C-3 -26 4 -23 6 -31 C18 -19 17 -4 0 -2Z" fill="#ffae2e"/><path d="M0 -3 C-8 -4 -7 -14 -1 -22 C0 -16 3 -14 4 -18 C9 -11 8 -4 0 -3Z" fill="#fff3a0"/></g>');
  fireG.setAttribute('display', 'none');
  function fireState(t) {
    var st = null, i, e, v;
    for (i = 0; i < PROPS.fire.length; i++) {
      e = PROPS.fire[i]; if (e.t > t) break; v = e.a[0];
      if (v === 'show') st = { x: e.a[1], size: e.a[2] || 1, s0: e.a[2] || 1, s1: e.a[2] || 1, g0: e.t, gd: 1, lift: e.a[3] || 0, t0: e.t, outT: null, od: 1, mark: false };
      else if (v === 'grow' && st) { var cur = st.s0 + (st.s1 - st.s0) * cl((e.t - st.g0) / st.gd); st.s0 = cur; st.s1 = e.a[1]; st.g0 = e.t; st.gd = e.a[2] || 1; }
      else if (v === 'out' && st) { st.outT = e.t; st.od = e.a[1] || 1.2; st.mark = e.a[2] !== false && st.lift > 0 ? true : !!e.a[2]; }
      else if (v === 'hide') st = null;
    }
    if (st) st.size = st.s0 + (st.s1 - st.s0) * sm(cl((t - st.g0) / st.gd));
    return st;
  }
  function addDrop(ss, n) { var a = ss.add || [], j, d = false; for (j = 0; j < a.length; j++) if (n >= a[j][0]) d = !!a[j][2]; return d; }
  function addDelay(ss, n) { var a = ss.add || [], j, d = 0; for (j = 0; j < a.length; j++) if (n >= a[j][0]) d = a[j][1] - ss.t0 - a[j][0] * .12; return d; }
  function stonesState(t) {
    var st = { list: [], t0: 0, pile: null, pt0: 0, add: [], gn: {} }, i, e, k2;
    for (i = 0; i < PROPS.stones.length; i++) {
      e = PROPS.stones[i]; if (e.t > t) break; var v = e.a[0];
      if (v === 'show') st = { list: e.a[1] || [], t0: e.t, pile: st.pile, pt0: st.pt0, add: [], gn: {} };
      else if (v === 'add') { var n0 = st.list.length; st = { list: st.list.concat(e.a[1] || []), t0: st.t0, pile: st.pile, pt0: st.pt0, add: (st.add || []).concat([[n0, e.t, e.a[2] === 'drop']]), gn: st.gn }; }   /* EV-004 : ajoute des cailloux sans refaire apparaître les anciens */
      else if (v === 'take') { var g2 = {}; for (k2 in st.gn) g2[k2] = st.gn[k2]; (e.a[1] || []).forEach(function (q, m) { g2[q] = e.t + m * (e.a[2] || 0); }); st = { list: st.list, t0: st.t0, pile: st.pile, pt0: st.pt0, add: st.add, gn: g2 }; }   /* EV-004 : les cailloux sont pris dans l'eau et vont sur la pile */
      else if (v === 'hide') st = { list: [], t0: e.t, pile: st.pile, pt0: st.pt0, add: [], gn: {} };
      else if (v === 'pile') st = { list: st.list, t0: st.t0, pile: e.a[1] === undefined ? .8 : e.a[1], pt0: e.t, add: st.add, gn: st.gn };
      else if (v === 'unpile') st = { list: st.list, t0: st.t0, pile: null, pt0: e.t, add: st.add, gn: st.gn };
    }
    return st;
  }
  var machG = mk('g', {}, propL);
  put(machG, '<ellipse class="mring" cy="3" rx="42" ry="8" fill="#8fd9ee" fill-opacity=".35" stroke="#fff" stroke-width="2.4" opacity="0"/><ellipse cy="2" rx="30" ry="6" fill="#14213d" opacity=".2"/><rect x="-26" y="-58" width="52" height="56" rx="9" fill="#b7c3d8" stroke="#3b4a66" stroke-width="3.4"/><rect x="-18" y="-50" width="36" height="22" rx="5" fill="#2a3a58"/>' +
    '<circle cx="-8" cy="-39" r="5" fill="#7aff9a"/><circle cx="6" cy="-39" r="5" fill="#ffd23f"/><circle class="mbtn" cx="0" cy="-16" r="8" fill="#ff5f5f" stroke="#7a1f1f" stroke-width="3"/><path d="M-14 -58 L-8 -78 H8 L14 -58Z" fill="#ffb347" stroke="#8a4a12" stroke-width="3" stroke-linejoin="round"/><path d="M-26 -30 q-14 0 -14 14" fill="none" stroke="#3b4a66" stroke-width="4" stroke-linecap="round"/>');
  /* pools de particules */
  var POOL = {};
  function pool(kind, n, mkf) { POOL[kind] = { els: [], n: 0 }; for (var i = 0; i < n; i++) { var e = mkf(); e.setAttribute('opacity', 0); POOL[kind].els.push(e); } }
  put(fxL, '<defs><radialGradient id="flG" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#fff6a8"/><stop offset=".5" stop-color="#ffb02e"/><stop offset="1" stop-color="#ff5a1f"/></radialGradient></defs>');
  pool('flame', 150, function () { return mk('path', { d: 'M0 -1.4 C1 -.6 1 .5 0 1 C-1 .5 -1 -.6 0 -1.4Z', fill: 'url(#flG)' }, fxF); });
  pool('puff', 140, function () { return mk('circle', { r: 5 }, fxF); });
  pool('dot', 140, function () { return mk('circle', { r: 3 }, fxF); });
  pool('spark', 80, function () { return mk('path', { d: SETS.sparkD(1), fill: '#fff6b0' }, fxF); });
  pool('zz', 20, function () { return mk('path', { d: 'M-1 -1 L1 -1 L-1 1 L1 1', fill: 'none', stroke: '#e9f1ff', 'stroke-width': .38, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, fxF); });
  pool('heart', 24, function () { return mk('path', { d: 'M0 .9 C-1.8 -.4 -1 -1.7 0 -.9 C1 -1.7 1.8 -.4 0 .9Z', fill: '#ff5f7e', stroke: '#b02a4a', 'stroke-width': .15 }, fxF); });
  pool('conf', 80, function () { return mk('rect', { x: -4, y: -6, width: 8, height: 12 }, fxF); });
  pool('drop', 90, function () { return mk('path', { d: 'M0 -9 Q5.5 2 0 7 Q-5.5 2 0 -9Z', fill: '#4a97ff' }, fxF); });
  pool('splashe', 60, function () { return mk('ellipse', { fill: 'none', stroke: '#bfe0ff', 'stroke-width': 1.8 }, fxF); });
  pool('ring', 20, function () { return mk('circle', { fill: 'none', 'stroke-width': 5 }, fxF); });
  pool('bolt', 3, function () { var g = mk('g', {}, fxF); put(g, '<polyline points="0,0 -18,70 6,78 -22,160 10,170 -12,250 14,330" fill="none" stroke="#ffe85a" stroke-width="11" stroke-linejoin="round" stroke-linecap="round" opacity=".55"/><polyline points="0,0 -18,70 6,78 -22,160 10,170 -12,250 14,330" fill="none" stroke="#fff" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>'); return g; });
  var flashR = mk('rect', { x: 0, y: 0, width: 800, height: 450, fill: '#fff', opacity: 0, 'pointer-events': 'none' }, svg);
  var vig = mk('rect', { x: 0, y: 0, width: 800, height: 450, fill: 'url(#vigG)', 'pointer-events': 'none' }, svg);
  put(svg, '<defs><radialGradient id="vigG" cx=".5" cy=".5" r=".78"><stop offset=".6" stop-color="#0a0f28" stop-opacity="0"/><stop offset="1" stop-color="#0a0f28" stop-opacity=".45"/></radialGradient></defs>');
  var vigG = mk('g', { 'pointer-events': 'none' }, svg); put(vigG, '<defs><radialGradient id="vigG" cx=".5" cy=".48" r=".78"><stop offset=".5" stop-color="#0b1030" stop-opacity="0"/><stop offset="1" stop-color="#0b1030" stop-opacity=".36"/></radialGradient></defs>');
  var vigR = mk('rect', { x: 0, y: 0, width: 800, height: 450, fill: 'url(#vigG)' }, vigG);
  var ovL = mk('g', { id: 'ov' }, svg);
  PE.sort(function (a, b) { return a.t0 - b.t0; });

  /* ---------- 11. Overlays (titre, fin, sous-titres) ---------- */
  var mctx = document.createElement('canvas').getContext('2d');
  var FONT = '"Baloo 2","Arial Rounded MT Bold","Trebuchet MS",Arial,sans-serif';
  function wrap(words, maxW, size) {
    mctx.font = '800 ' + size + 'px ' + FONT;
    var lines = [], cur2 = [], w2 = 0, sp = mctx.measureText(' ').width;
    words.forEach(function (wd, i) {
      var ww = mctx.measureText(wd.t).width;
      if (cur2.length && w2 + sp + ww > maxW) { lines.push({ w: w2, r: cur2 }); cur2 = []; w2 = 0; }
      w2 += (cur2.length ? sp : 0) + ww; cur2.push({ t: wd.t, i: wd.i, w: ww });
    });
    if (cur2.length) lines.push({ w: w2, r: cur2 });
    return { lines: lines, sp: sp };
  }
  var capCache = {};
  function overlayModel(t, mode) {
    var cfg = LAYOUT[mode], items = [], VW = cfg.VW, VH = cfg.VH, W = VW;
    var P2 = mode === 'port';
    /* carton titre */
    if (t < LEAD + .2) {
      var ta = cl((t - .15) / .55), tc = t < LEAD - .6 ? 1 : 1 - cl((t - (LEAD - .6)) / .8), pop = ta < 1 ? 1 + .35 * Math.exp(-ta * 3) * Math.sin(ta * 9) : 1;
      var op = tc * cl(ta * 3);
      if (op > .01) {
        var bs = P2 ? 66 : 96, ss = P2 ? 28 : 30, cx = VW / 2, cy = P2 ? VH * .34 : 150 + 3 * Math.sin(t * 2);
        items.push({ type: 'rect', x: 0, y: 0, w: VW, h: VH, fill: 'rgba(10,15,40,' + (op * .28).toFixed(2) + ')' });
        items.push({ type: 'text', text: EP.series || 'BOUBOULE', x: cx, y: cy, size: bs * pop, fill: '#ff7a3d', stroke: '#14213d', sw: bs * .14, op: op });
        items.push({ type: 'text', text: EP.subtitle || EP.title, x: cx, y: cy + (P2 ? 56 : 48), size: ss * (EP.subtitle && EP.subtitle.length > 24 ? .92 : 1), fill: '#fff', stroke: '#14213d', sw: 7, op: op, maxW: VW * .9 });
        if (EP.episodeNo) items.push({ type: 'text', text: 'Épisode ' + EP.episodeNo, x: cx, y: cy - bs * 1.02, size: 22, fill: '#ffd23f', stroke: '#14213d', sw: 6, op: op });
      }
    }
    /* carton fin */
    var ec = cl((t - (ENDT - OUTRO) - .5) / .9);
    if (ec > .01) {
      var cx2 = VW / 2, cyE = P2 ? VH * .36 : 175, sc = .85 + .15 * ec;
      items.push({ type: 'rect', x: 0, y: 0, w: VW, h: VH, fill: 'rgba(10,15,40,' + (ec * .35).toFixed(2) + ')' });
      items.push({ type: 'text', text: 'FIN', x: cx2, y: cyE, size: (P2 ? 100 : 120) * sc, fill: '#ffd23f', stroke: '#14213d', sw: 14, op: ec });
      items.push({ type: 'text', text: EP.endLine || 'à bientôt, petits rigolos !', x: cx2, y: cyE + (P2 ? 48 : 52), size: P2 ? 26 : 30, fill: '#fff', stroke: '#14213d', sw: 7, op: ec, maxW: VW * .9 });
      if (EP.nextTeaser) items.push({ type: 'text', text: EP.nextTeaser, x: cx2, y: cyE + (P2 ? 90 : 96), size: P2 ? 20 : 22, fill: '#8ee0ff', stroke: '#14213d', sw: 5, op: ec, maxW: VW * .9 });
    }
    /* sous-titres */
    var ci = curLine(t);
    if (ci >= 0 && EP.captions !== false) {
      var ln = L[ci];
      if (ln.text && t >= ln.t + .05 && t < ln.e + .5) {
        var key = ci + mode, size = P2 ? 27 : 25, maxW = P2 ? 390 : 690;
        var words = capCache[key];
        if (!words) { words = ln.text.split(' ').map(function (s, i) { return { t: s, i: i }; }); capCache[key] = { words: words, lay: wrap(words, maxW, size) }; words = capCache[key]; }
        var lay = words.lay, n = words.words.length, done = cl(Math.floor((t - ln.t) / ln.dur * n) + 1, 0, n);
        var lh = size * 1.18, total = lay.lines.length * lh, y0 = P2 ? VH * .125 : VH - 22 - total + lh * .8;
        var op2 = cl((t - ln.t) / .12) * cl((ln.e + .5 - t) / .2);
        var nm = ln.who === 'N' ? 'Le conteur' : (AC[ln.who] ? CHARS.LIB[AC[ln.who].kind].name : '');
        var colr = ln.who === 'N' ? '#ffd9a0' : (AC[ln.who] ? CHARS.LIB[AC[ln.who].kind].color : '#fff');
        var pw = 0; lay.lines.forEach(function (l) { pw = Math.max(pw, l.w); });
        items.push({ type: 'rect', x: (VW - pw) / 2 - 16, y: y0 - lh * .85 - (nm ? 21 : 0), w: pw + 32, h: total + 18 + (nm ? 21 : 0), rx: 14, fill: 'rgba(14,20,48,' + (.62 * op2).toFixed(2) + ')' });
        if (nm) items.push({ type: 'text', text: nm, x: VW / 2, y: y0 - lh * .85 - 21 + 15, size: 15, fill: colr, stroke: '#0e1430', sw: 4, op: op2 });
        lay.lines.forEach(function (l, li) {
          var x = (VW - l.w) / 2, y = y0 + li * lh;
          l.r.forEach(function (wd) {
            items.push({ type: 'text', text: wd.t, x: x + wd.w / 2, y: y, size: size, fill: wd.i < done ? '#ffe066' : '#ffffff', stroke: '#0e1430', sw: 5, op: op2 });
            x += wd.w + lay.sp;
          });
        });
      }
    }
    return items;
  }

  var ovPool = [];
  function drawOverlayDOM(items) {
    var i, n = 0;
    for (i = 0; i < items.length; i++) {
      var it = items[i], e = ovPool[n];
      if (!e) { e = ovPool[n] = {}; e.r = mk('rect', {}, ovL); e.t = mk('text', { 'text-anchor': 'middle', 'font-family': FONT, 'font-weight': 800, 'stroke-linejoin': 'round', 'paint-order': 'stroke' }, ovL); }
      if (it.type === 'rect') { e.r.setAttribute('display', ''); e.t.setAttribute('display', 'none'); e.r.setAttribute('x', it.x); e.r.setAttribute('y', it.y); e.r.setAttribute('width', it.w); e.r.setAttribute('height', it.h); e.r.setAttribute('rx', it.rx || 0); e.r.setAttribute('fill', it.fill); }
      else {
        e.r.setAttribute('display', 'none'); e.t.setAttribute('display', '');
        e.t.setAttribute('x', it.x.toFixed(1)); e.t.setAttribute('y', it.y.toFixed(1)); e.t.setAttribute('font-size', it.size.toFixed(1)); e.t.setAttribute('fill', it.fill); e.t.setAttribute('stroke', it.stroke); e.t.setAttribute('stroke-width', it.sw);
        e.t.setAttribute('opacity', it.op === undefined ? 1 : it.op.toFixed(2)); e.t.textContent = it.text;
        if (it.maxW) { e.t.removeAttribute('textLength'); var bb = mctx; mctx.font = '800 ' + it.size + 'px ' + FONT; var tw = mctx.measureText(it.text).width; if (tw > it.maxW) { e.t.setAttribute('textLength', it.maxW); e.t.setAttribute('lengthAdjust', 'spacingAndGlyphs'); } else e.t.removeAttribute('textLength'); } else e.t.removeAttribute('textLength');
      }
      n++;
    }
    for (; n < ovPool.length; n++) { ovPool[n].r.setAttribute('display', 'none'); ovPool[n].t.setAttribute('display', 'none'); }
  }
  function drawOverlayCanvas(ctx, items, k) {
    ctx.save(); ctx.scale(k, k);
    items.forEach(function (it) {
      if (it.type === 'rect') {
        ctx.fillStyle = it.fill; ctx.beginPath();
        if (it.rx && ctx.roundRect) ctx.roundRect(it.x, it.y, it.w, it.h, it.rx); else ctx.rect(it.x, it.y, it.w, it.h); ctx.fill();
      } else {
        ctx.globalAlpha = it.op === undefined ? 1 : it.op; ctx.font = '800 ' + it.size + 'px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        ctx.lineJoin = 'round'; ctx.lineWidth = it.sw; ctx.strokeStyle = it.stroke; ctx.fillStyle = it.fill;
        var tx = it.x, sx = 1;
        if (it.maxW) { var tw = ctx.measureText(it.text).width; if (tw > it.maxW) sx = it.maxW / tw; }
        ctx.save(); ctx.translate(tx, it.y); ctx.scale(sx, 1); ctx.strokeText(it.text, 0, 0); ctx.fillText(it.text, 0, 0); ctx.restore(); ctx.globalAlpha = 1;
      }
    });
    ctx.restore();
  }

  /* ---------- 12. Rendu d'une image ---------- */
  var lastUsed = {}, z4Key = '';
  var curSetOpacity = {};
  function render(t) {
    var cfg = LAYOUT[MODE], i, S = SETS.skyAt(SKYKEYS, t);
    cam.setAttribute('transform', camAt(t));
    /* décor actif */
    var setNow = SETK[0][1], fade = 1, prev = null;
    for (i = 0; i < SETK.length; i++) if (SETK[i][0] <= t) { prev = setNow; setNow = SETK[i][1]; if (i > 0) fade = cl((t - SETK[i][0]) / (V2 ? Math.max(.3, SETK[i][2]) : .5)); }
    var setNames3 = V3 ? Object.keys(SETOBJ) : null, ramp3 = fade * fade * (3 - 2 * fade);
    Object.keys(SETOBJ).forEach(function (n) {
      var so = SETOBJ[n], on = n === setNow;
      so.b.setAttribute('display', on || (prev === n && fade < 1) ? '' : 'none'); so.f.setAttribute('display', on || (prev === n && fade < 1) ? '' : 'none');
      if (V3 && prev !== null && prev !== setNow && fade < 1) {
        /* EV-002 : fondu enchaîné correct quel que soit l'ordre des calques (celui du dessus fond, celui du dessous s'efface plus tard / apparaît plus tôt) */
        var upIn = setNames3.indexOf(setNow) > setNames3.indexOf(prev), op3;
        if (on) op3 = upIn ? ramp3 : cl(ramp3 * 2);
        else op3 = upIn ? 1 - cl((ramp3 - .5) / .5) : 1 - ramp3;
        so.b.setAttribute('opacity', op3.toFixed(3)); so.f.setAttribute('opacity', op3.toFixed(3));
      } else if (V2) { var op = on ? 1 : (1 - fade * fade * (3 - 2 * fade)).toFixed(3); so.b.setAttribute('opacity', op); so.f.setAttribute('opacity', op); }
      if (on) { so.r.update(t, S, {}); }
    });
    var activeSet = SETOBJ[setNow].r;
    if (!V2) (activeSet.par || []).forEach(function (q) { q[0].setAttribute('transform', 'translate(' + (Math.max(-40, Math.min(40, (1 - q[1]) * (CAMFX - 400)))).toFixed(1) + ' ' + ((1 - q[1]) * (CAMFY - 250) * .5).toFixed(1) + ')'); });
    skyR.update(t, S, { beams: beamsAt(t), birds: activeSet.birds, cloudsOn: activeSet.cloudsOn });
    var nightF = cl((S.night - .2) / .3);
    /* teinte globale */
    tintFront.setAttribute('fill', SETS.rgb(S.tint)); tintFront.setAttribute('opacity', (S.tint[3] * .9).toFixed(3));
    /* EV-004 : ordre d'affichage = les plus loin derrière, le locuteur toujours devant */
    if (V4) {
      var spk = null; for (i = 0; i < L.length; i++) if (t >= L[i].t && t <= L[i].e + .15) { spk = L[i].who; break; }
      var ord = LET.slice().sort(function (a, b) { return (b === spk ? -1 : 0) - (a === spk ? -1 : 0) || depthOf(b, t) - depthOf(a, t) || LET.indexOf(a) - LET.indexOf(b); });
      var ok = ord.join();
      if (ok !== z4Key) { z4Key = ok; ord.forEach(function (k) { var Dz = ACT_DOM[k]; actL.appendChild(Dz.ow || Dz.ax); if (Dz.wr) actL.appendChild(Dz.wr); }); }
    }
    /* personnages */
    LET.forEach(function (k) {
      var A = AC[k], D = ACT_DOM[k], st = astate(k, t), ch = D.ch, gy = actorY(k, t), asc = scaleOf(k, t);
      if (!st.vis) { D.ax.setAttribute('display', 'none'); D.sh.setAttribute('opacity', 0); if (D.wr) D.wr.setAttribute('display', 'none'); return; }
      D.ax.setAttribute('display', '');
      var wv = A.waters.length ? trackOf(A.waters, t) : 0, bob = wv > .02 ? 2.6 * Math.sin(t * 3.3 + A.phase) * asc : 0;
      D.ax.setAttribute('transform', 'translate(' + f1(st.x + st.dx) + ' ' + f1(gy - st.y + bob) + ') scale(' + asc + ')');
      var cy = ch.cy;
      D.sq.setAttribute('transform', 'translate(0 ' + cy + ') rotate(' + st.rot.toFixed(1) + ') translate(0 ' + (-cy) + ') scale(' + st.sx.toFixed(3) + ' ' + st.sy.toFixed(3) + ')');
      var hh = Math.max(0, st.y - A.hover);
      D.sh.setAttribute('cx', f1(st.x)); D.sh.setAttribute('cy', f1(gy + 2)); D.sh.setAttribute('rx', ((A.kind === 'grincheux' ? 52 : 32) * asc * (1 - cl(st.y / 300) * .5)).toFixed(1)); D.sh.setAttribute('ry', 7 * asc); D.sh.setAttribute('opacity', (.22 * (1 - cl(st.y / 320))).toFixed(2));
      CHARS.poseFace(ch.face, { emo: st.emo, emoPrev: st.emoPrev, emoK: st.emoK, open: st.open, mw: st.mw, lx: st.lx, ly: st.ly, blink: st.blink, blinkAmt: st.blinkAmt });
      /* bras */
      if (ch.arms && ch.arms.length) {
        var aL = st.armL, aR = st.armR;
        if (wv > .3) { aL = 100 + 42 * Math.sin(t * 6.5); aR = 100 + 42 * Math.sin(t * 6.5 + Math.PI); }   /* EV-004 : brasse dans l'eau */
        if (st.armLX && !ch._a0f) { ch._a0f = [ch.arms[0].parentNode, ch.arms[0].nextSibling]; ch.arms[0].parentNode.appendChild(ch.arms[0]); }
        else if (!st.armLX && ch._a0f) { ch._a0f[0].insertBefore(ch.arms[0], ch._a0f[1]); ch._a0f = null; }
        ch.arms[0].setAttribute('transform', 'translate(' + (ch.armBase[0][0] + (st.armLX || 0)) + ' ' + (ch.armBase[0][1] + (st.armLY || 0)) + ') rotate(' + f1(aL) + ')' + (st.armS ? ' scale(1 ' + st.armS + ')' : ''));
        ch.arms[1].setAttribute('transform', 'translate(' + ch.armBase[1][0] + ' ' + ch.armBase[1][1] + ') rotate(' + f1(-aR) + ')' + (st.armS ? ' scale(1 ' + st.armS + ')' : ''));
      }
      if (D.ow) {
        if (wv > .02) {
          var yw = gy - st.y + bob - wv * ch.h * asc, xw = st.x + st.dx, pl = 1 + .07 * Math.sin(t * 4 + A.phase);
          D.wclr.setAttribute('height', f1(yw + 3000)); D.ow.setAttribute('clip-path', 'url(#wcl_' + k + ')');
          D.wr.setAttribute('display', ''); D.sh.setAttribute('opacity', 0);
          D.wr1.setAttribute('cx', f1(xw)); D.wr1.setAttribute('cy', f1(yw + 1)); D.wr1.setAttribute('rx', f1(ch.w * .58 * asc * pl)); D.wr1.setAttribute('ry', f1(8.5 * asc));
          D.wr2.setAttribute('cx', f1(xw)); D.wr2.setAttribute('cy', f1(yw + 1)); D.wr2.setAttribute('rx', f1(ch.w * .64 * asc * pl)); D.wr2.setAttribute('ry', f1(9.5 * asc));
        } else { D.ow.removeAttribute('clip-path'); D.wr.setAttribute('display', 'none'); }
      }
      /* spécificités */
      if (A.kind === 'bouboule') { ch.topEl.setAttribute('transform', 'translate(0 -76) rotate(' + f1(6 * Math.sin(t * 2.2) + st.y * -.08) + ')'); ch.soot.setAttribute('opacity', (st.soot * .8).toFixed(2));
        if (A.wets.length) { var wtv = trackOf(A.wets, t); if (wtv > .01) { ch.soot.setAttribute('fill', '#8fdcf0'); ch.soot.setAttribute('opacity', (.30 * wtv).toFixed(2)); } else ch.soot.setAttribute('fill', '#2a2420'); } }
      if (A.kind === 'pitou') {
        var gl = cl(.55 + st.glow * .45 + (st.emo === 'sad' ? -.35 : 0));
        var litF = cl((st.glow !== 0 ? st.glow : (st.emo === 'sad' || st.emo === 'worried' ? 0 : .8)));
        ch.stops[0].setAttribute('stop-color', SETS.rgb(SETS.mixc([205, 198, 170], [255, 246, 176], litF))); ch.stops[1].setAttribute('stop-color', SETS.rgb(SETS.mixc([150, 140, 110], [255, 194, 31], litF)));
        ch.shape.setAttribute('stroke', SETS.rgb(SETS.mixc([110, 96, 64], [201, 138, 16], litF)));
        ch.glow.setAttribute('opacity', (.95 * cl((litF - .3) / .7) * (.8 + .2 * Math.sin(t * 6))).toFixed(2));
        ch.flare.setAttribute('opacity', (st.glow > .95 ? (.5 + .5 * Math.sin(t * 4)) * .8 : 0).toFixed(2)); ch.flare.setAttribute('transform', 'translate(0 -42) rotate(' + f1(t * 20) + ')');
      }
      if (A.kind === 'grincheux') {
        var m = st.emo === 'angry' || st.emo === 'sad' ? 1 : 0, warm = cl(st.glow);
        var colr = SETS.mixc(SETS.mixc([242, 246, 253], [116, 126, 152], m), [255, 205, 160], warm);
        colr = SETS.mixc(colr, [44, 54, 96], .2 * nightF * (1 - warm));
        ch.fill.setAttribute('fill', SETS.rgb(colr)); ch.out.setAttribute('fill', SETS.rgb(SETS.mixc(colr, [22, 30, 62], .72)));
        ch.hi.setAttribute('fill', SETS.rgb(SETS.mixc(colr, [255, 255, 255], .65)));
        ch.scaleHost.setAttribute('transform', 'translate(0 -95) scale(' + (.78 * (1 + .02 * Math.sin(t * 2.2))).toFixed(3) + ')');
      }
      if (A.kind === 'robi') {
        ch.lamp.setAttribute('fill', Math.sin(t * 5) > 0 ? '#ff5f5f' : '#7a1f1f');
        var wr = (A.segs.length ? (xOf(k, t) * 1400) : 0) % 360;
        ch.wheels[0].setAttribute('transform', 'rotate(' + f1(wr) + ' -22 -8.5)'); ch.wheels[1].setAttribute('transform', 'rotate(' + f1(wr) + ' 22 -8.5)');
        ch.ant.setAttribute('transform', 'rotate(' + f1(4 * Math.sin(t * 3)) + ' 0 -88)');
      }
      if (A.kind === 'flamme') {
        ch.tail.setAttribute('transform', 'rotate(' + f1(10 * Math.sin(t * 3.4)) + ' 30 -14)');
        var fl = 5 + 7 * Math.abs(Math.sin(t * 4)) + (st.emo === 'happy' || st.emo === 'laugh' ? 14 * Math.abs(Math.sin(t * 9)) : 0);
        ch.wings[0].setAttribute('transform', 'translate(-30 -58) rotate(' + f1(-fl) + ')'); ch.wings[1].setAttribute('transform', 'translate(30 -58) rotate(' + f1(fl) + ')');
      }
    });
    var rs = rainbowState(t); rbG.setAttribute('opacity', (rs.o * .95).toFixed(2)); rbP.forEach(function (p, i) { p.setAttribute('stroke-dashoffset', (1 - rs.p).toFixed(3)); });
    /* machine */
    var ms = machineState(t);
    if (ms.vis) {
      var mx = wx(ms.x), pu = cl((t - ms.t0) / .4), shk = 0, boomed = 0, i2;
      for (i2 = 0; i2 < MACH.boom.length; i2++) { var b = MACH.boom[i2]; if (b.kind === 'shake' && t >= b.t && t < b.t + b.dur) shk = 1; if (b.kind === 'boom' && t >= b.t) boomed = t - b.t; }
      var scl = (pu < 1 ? sm(pu) * (1 + .15 * Math.sin(pu * 3)) : 1);
      if (boomed > 0 && boomed < .25) scl *= 1 + .5 * (boomed / .25); else if (boomed >= .25) scl = 0;
      machG.setAttribute('display', ''); var mdp = ms.d || 0; machG.setAttribute('transform', 'translate(' + f1(mx + (shk ? 2.5 * Math.sin(t * 60) : 0)) + ' ' + f1(GY - DEPTH_DY * mdp) + ') scale(' + (scl * (1 - DEPTH_SC * mdp)).toFixed(3) + ')'); machG.querySelector('.mring').setAttribute('opacity', mdp > 0 ? (.8 + .2 * Math.sin(t * 4)).toFixed(2) : 0);
      machG.querySelector('.mbtn').setAttribute('fill', shk && Math.sin(t * 14) > 0 ? '#ffb0b0' : '#ff5f5f');
    } else machG.setAttribute('display', 'none');

    /* cailloux (EV-001) */
    if (stnMax || PROPS.stones.length) {
      var ss = stonesState(t);
      stnEl.forEach(function (o, n) {
        if (n >= ss.list.length) { o.g.setAttribute('display', 'none'); return; }
        var si = ss.list[n], sd = (si instanceof Array) ? (si[1] || 0) : 0, sx = wx(si instanceof Array ? si[0] : si), dpf = addDrop(ss, n), pu = cl((t - ss.t0 - n * .12 - addDelay(ss, n)) / (dpf ? .5 : .35)), dep = 0, dpo = dpf ? -150 * (1 - pu) * (1 - pu) : 0;
        if (pu <= 0) { o.g.setAttribute('display', 'none'); return; }
        var gt = ss.gn ? ss.gn[n] : undefined;
        if (gt !== undefined && t >= gt) {   /* EV-004 : caillou pris : il vole en arc jusqu'à la pile */
          var kk = (t - gt) / .6;
          if (kk >= 1 || ss.pile === null) { o.g.setAttribute('display', 'none'); return; }
          var tx = wx(ss.pile), ty = GY - 8, sx0 = sx, sy0 = GY - 14 - DEPTH_DY * sd, sc0 = (1 - DEPTH_SC * sd), ek = kk * kk * (3 - 2 * kk);
          o.g.setAttribute('display', ''); o.g.setAttribute('transform', 'translate(' + f1(sx0 + (tx - sx0) * ek) + ' ' + f1(sy0 + (ty - sy0) * ek - 80 * Math.sin(Math.PI * kk)) + ') scale(' + (sc0 + (.4 - sc0) * ek).toFixed(3) + ')');
          return;
        }
        LET.forEach(function (k2) { var ll = liftOf(k2, t); if (ll > 8 && visOf(k2, t) && Math.abs(wx(xOf(k2, t)) - sx) < 26) dep = Math.max(dep, 3 * cl(ll / 22)); });
        var sc = (dpf ? 1 : sm(pu) * (1 + .12 * Math.sin(pu * Math.PI))) * (1 - DEPTH_SC * sd);
        o.g.setAttribute('display', ''); o.g.setAttribute('transform', 'translate(' + f1(sx) + ' ' + f1(GY - 14 - DEPTH_DY * sd + dep + dpo + 1.2 * Math.sin(t * 1.4 + n * 2)) + ') scale(' + sc.toFixed(3) + ')');
        o.sf.setAttribute('opacity', (.35 + .3 * Math.sin(t * 2.2 + n)).toFixed(2)); o.sf.setAttribute('rx', (36 + 2 * Math.sin(t * 2 + n)).toFixed(1));
      });
      if (ss.pile === null) pileG.setAttribute('display', 'none');
      else { var pp = cl((t - ss.pt0) / .3); pileG.setAttribute('display', ''); pileG.setAttribute('transform', 'translate(' + f1(wx(ss.pile)) + ' ' + GY + ') scale(' + sm(pp).toFixed(3) + ')'); }
    }
    /* maison */
    var hs = houseState(t);
    if (hs.mode === 'none') houseG.setAttribute('display', 'none');
    else {
      houseG.setAttribute('display', '');
      if (V3) {
        /* EV-002 : la maison / le piquet appartient au décor où il a été posé ; il disparaît (fondu) quand le décor change */
        var hop = 0;
        if (hs.set === setNow) hop = (prev !== null && prev !== setNow && fade < 1) ? ramp3 : 1;
        else if (hs.set === prev && fade < 1) hop = 1 - ramp3;
        houseG.setAttribute('opacity', hop.toFixed(3));
        if (hop <= 0) houseG.setAttribute('display', 'none');
      }
      var hb = houseG.querySelector('.hbd'), hw = houseG.querySelector('.hwl'), hr = houseG.querySelector('.hrf'), hrub = houseG.querySelector('.hrub'), hst = houseG.querySelector('.hst');
      var hu = cl((t - hs.t0) / (hs.dur || 1)), wy = 1, ry = 0, rr = 0, rot = 0, rub = 0, bo = 1, so = 0, sy0 = 0;
      if (hs.mode === 'build' || hs.mode === 'walls') { wy = Math.max(.001, sm(cl(hu / .7))); var ru = sm(cl((hu - .6) / .4)); ry = -(1 - ru) * 90; rr = (1 - ru) * -25 - 7 * ru; rot = (hs.mode === 'walls' ? .8 : 5) * sm(hu) + 1.4 * Math.sin(t * 9) * (1 - hu) * (hu > 0 ? 1 : 0); bo = 1; }
      else if (hs.mode === 'collapse') { wy = 1 - .84 * sm(hu); ry = 0 + 110 * hu * hu; rr = -7 - 40 * hu; rot = 5 + 22 * hu * hu; rub = sm(cl((hu - .5) / .5)); bo = hu < .95 ? 1 : 0; wy = Math.max(.001, wy); }
      else if (hs.mode === 'stake') { bo = 0; so = 1; sy0 = -140 * Math.pow(1 - sm(cl(hu)), 2); }
      hr.setAttribute('display', hs.mode === 'walls' ? 'none' : '');
      hb.setAttribute('display', bo ? '' : 'none'); hrub.setAttribute('display', rub > 0 ? '' : 'none'); hrub.setAttribute('opacity', rub.toFixed(2)); hst.setAttribute('display', so ? '' : 'none');
      hst.setAttribute('transform', 'translate(0 ' + f1(sy0) + ')');
      hb.setAttribute('transform', 'rotate(' + rot.toFixed(2) + ' 0 0)');
      hw.setAttribute('transform', 'scale(1 ' + wy.toFixed(3) + ')');
      hr.setAttribute('transform', 'translate(0 ' + f1(ry - (1 - wy) * 62) + ') rotate(' + rr.toFixed(2) + ' 0 -62)');
      houseG.setAttribute('transform', 'translate(' + f1(hs.x) + ' ' + GY + ') scale(' + (hs.s || 1) + ')');
    }
    /* feu (EV-005) */
    var fs = fireState(t);
    if (!fs) fireG.setAttribute('display', 'none');
    else {
      var fk = fs.outT === null ? sm(cl((t - fs.t0) / .4)) : Math.max(0, 1 - (t - fs.outT) / fs.od), fch = fireG.querySelector('.fch'), ffl = fireG.querySelector('.ffl'), fgl = fireG.querySelector('.fgl');
      var fsz = fs.size * fk * (1 + .07 * Math.sin(t * 17)), fsy = fs.size * fk * (1 + .12 * Math.sin(t * 13 + 1));
      fireG.setAttribute('display', (fk > .01 || (fs.outT !== null && fs.mark)) ? '' : 'none');
      fch.setAttribute('display', (fs.outT !== null && fs.mark) ? '' : 'none');
      fch.setAttribute('transform', 'scale(' + f1(fs.size) + ')');
      ffl.setAttribute('display', fk > .01 ? '' : 'none');
      ffl.setAttribute('transform', 'scale(' + f1(fsz) + ' ' + f1(fsy) + ') skewX(' + f1(4 * Math.sin(t * 9)) + ')');
      fgl.setAttribute('display', fk > .01 ? '' : 'none');
      fgl.setAttribute('opacity', (fk * (.85 + .15 * Math.sin(t * 11))).toFixed(2));
      fgl.setAttribute('transform', 'scale(' + f1(fs.size) + ')');
      fireG.setAttribute('transform', 'translate(' + f1(wx(fs.x)) + ' ' + f1(GY - fs.lift) + ')');
    }
    /* balle */
    var bp = ballPos(t);
    if (bp.vis) {
      ballG.setAttribute('display', ''); ballG.setAttribute('transform', 'translate(' + f1(bp.x) + ' ' + f1(bp.y + 8) + ') rotate(' + f1(bp.rot || 0) + ')');
      ballBurn.setAttribute('opacity', bp.burn ? cl((t - bp.burnT) / .3).toFixed(2) : 0);
    } else ballG.setAttribute('display', 'none');

    /* particules */
    var kind, flash = 0;
    for (kind in lastUsed) { lastUsed[kind].forEach(function (e) { e.setAttribute('opacity', 0); }); }
    lastUsed = {};
    for (kind in POOL) POOL[kind].n = 0;
    for (i = 0; i < PE.length; i++) {
      var ev = PE[i]; if (ev.t0 > t) break; var u = (t - ev.t0) / ev.life; if (u > 1) continue;
      var pl = POOL[ev.kind]; if (!pl || pl.n >= pl.els.length) continue;
      var e2 = pl.els[pl.n++], p = ev.fn(u, t); (lastUsed[ev.kind] = lastUsed[ev.kind] || []).push(e2);
      var kd = ev.kind;
      if (kd === 'flame') e2.setAttribute('transform', 'translate(' + f1(p.x) + ' ' + f1(p.y) + ') rotate(' + f1(p.rot) + ') scale(' + f1(p.r * 1.7) + ')');
      else if (kd === 'puff') { e2.setAttribute('cx', f1(p.x)); e2.setAttribute('cy', f1(p.y)); e2.setAttribute('r', f1(p.r)); e2.setAttribute('fill', p.col); }
      else if (kd === 'dot') { e2.setAttribute('cx', f1(p.x)); e2.setAttribute('cy', f1(p.y)); e2.setAttribute('r', f1(Math.max(.1, p.r))); e2.setAttribute('fill', p.col); }
      else if (kd === 'spark') e2.setAttribute('transform', 'translate(' + f1(p.x) + ' ' + f1(p.y) + ') rotate(' + f1(p.rot || 0) + ') scale(' + f1(p.r) + ')');
      else if (kd === 'zz') e2.setAttribute('transform', 'translate(' + f1(p.x) + ' ' + f1(p.y) + ') scale(' + f1(p.r) + ')');
      else if (kd === 'heart') e2.setAttribute('transform', 'translate(' + f1(p.x) + ' ' + f1(p.y) + ') scale(' + f1(p.r) + ')');
      else if (kd === 'conf') { e2.setAttribute('transform', 'translate(' + f1(p.x) + ' ' + f1(p.y) + ') rotate(' + f1(p.rot) + ')'); e2.setAttribute('fill', p.col); }
      else if (kd === 'drop') e2.setAttribute('transform', 'translate(' + f1(p.x) + ' ' + f1(p.y) + ') rotate(' + f1(p.rot || 0) + ')');
      else if (kd === 'splashe') { e2.setAttribute('cx', f1(p.x)); e2.setAttribute('cy', f1(p.y)); e2.setAttribute('rx', f1(p.r)); e2.setAttribute('ry', f1(p.r * .28)); }
      else if (kd === 'ring') { e2.setAttribute('cx', f1(p.x)); e2.setAttribute('cy', f1(p.y)); e2.setAttribute('r', f1(p.r)); e2.setAttribute('stroke', p.col); }
      else if (kd === 'bolt') { e2.setAttribute('transform', 'translate(' + f1(p.x) + ' ' + f1(p.y) + ') scale(1 ' + (p.r / 330).toFixed(3) + ')'); flash = Math.max(flash, p.flash || 0); }
      e2.setAttribute('opacity', cl(p.a).toFixed(2));
    }
    flashR.setAttribute('opacity', flash.toFixed(3));
    flashR.setAttribute('width', cfg.VW); flashR.setAttribute('height', cfg.VH);
    drawOverlayDOM(overlayModel(t, MODE));
    return S;
  }

  function setMode(m) {
    MODE = m;
    if (!CAMS[m]) buildCam(m);
    var cfg = LAYOUT[m];
    svg.setAttribute('viewBox', '0 0 ' + cfg.VW + ' ' + cfg.VH);
    vigR.setAttribute('width', cfg.VW); vigR.setAttribute('height', cfg.VH);
    vig.setAttribute('width', cfg.VW); vig.setAttribute('height', cfg.VH);
    svg.parentNode.setAttribute('data-mode', m);
    capCache = {};
  }
  buildCam('land'); buildCam('port'); setMode('land');

  /* sons : événements consolidés pour le module audio */
  EVSFX.sort(function (a, b) { return a.t - b.t; });
  window.ENGINE = { render: render, setMode: setMode, getMode: function () { return MODE; }, ENDT: ENDT, LEAD: LEAD, OUTRO: OUTRO, LINES: L, SFX: EVSFX, AMB: AMB, MUS: MUS, SKY: SKYKEYS, overlayModel: overlayModel, drawOverlayCanvas: drawOverlayCanvas, LAYOUT: LAYOUT, svg: svg, ovL: ovL, FONT: FONT, ACT: AC };
})();
