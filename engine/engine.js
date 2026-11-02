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
      segs: [], vis: [], moods: [[-1, 'neutral']], looks: [[-1, 'cam']], anims: [], glow: [], soot: [], x: .5, v: 0, phase: n * 1.7, tint: [] };
  });
  var RBEV = [];
  var EVSFX = [], EVFX = [], EVCAM = [], SKYK = [], SHK = [], BEAMS = [], PROPS = { ball: [], machine: [] }, AMB = [], MUS = [], SETK = [[0, EP.set || 'colline']], RAIN = [];
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
    else if (v === 'tod') SKYK.push([t, a[0], t + (a[1] || 3)]);
    else if (v === 'set') SETK.push([t, a[0], a[1] || .6]);
    else if (v === 'beams') BEAMS.push([t, a[0], a[1] || 1]);
    else if (v === 'shake') SHK.push([t, a[0] || 5]);
    else if (v === 'cam') EVCAM.push({ t: t, tgt: a[0], zoom: a[1], dur: a[2] || 2.5, fy: a[3] });
    else if (v === 'amb') AMB.push({ t: t, key: a[0], vol: a[1] === undefined ? .35 : a[1], dur: a[2] });
    else if (v === 'ball') PROPS.ball.push({ t: t, a: a });
    else if (v === 'machine') PROPS.machine.push({ t: t, a: a });
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
  function actorY(k, t) { return GY + AC[k].row; }
  function bodyTop(k) { return CHARS.LIB[AC[k].kind]; }
  function mouthPos(k, t, dirX) {
    var A = AC[k], c = CHAR_INFO[A.kind], x = wx(xOf(k, t));
    return { x: x + c.mouth.x * A.s, y: actorY(k, t) - A.hover - 0 + c.mouth.y * A.s };
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
    else if (e.fx === 'zzz') { }
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
    if (v === 'show') MACH.show.push([t, 1, a[1], a[2] || 'pop']);
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
    for (i = 0; i < MACH.show.length; i++) { var m = MACH.show[i]; if (m[0] <= t) { s.vis = m[1]; if (m[2] !== undefined) { s.x = m[2]; } s.t0 = m[0]; } }
    return s;
  }
  function machinePos() { var s = machineState(1e9); /* dernière position connue */ var x = 400, i; for (i = 0; i < MACH.show.length; i++) if (MACH.show[i][2] !== undefined) x = wx(MACH.show[i][2]); return { x: x, y: GY }; }

  /* ---------- 7. État d'un personnage à l'instant t ---------- */
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
      else if (nm === 'jump') { var sn = Math.sin(Math.PI * u); o.y += (pn > 1 ? pn : 90) * sn; o.sy *= 1 + .14 * sn; o.sx *= 1 - .08 * sn; o.armL = 150; o.armR = 150; }
      else if (nm === 'spin') { o.rot += 360 * sm(u); o.y += 40 * Math.sin(Math.PI * u); }
      else if (nm === 'shake') { o.dx += 3.2 * Math.sin(t * 60) * (1 - u * .3); o.rot += 3 * Math.sin(t * 47); }
      else if (nm === 'squish') { var e = Math.sin(Math.PI * u * 2) * Math.exp(-u * 2); o.sx *= 1 + .3 * e; o.sy *= 1 - .3 * e; }
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
    var talk = speaking(k, t);
    o.emo = lastOf(A.moods, t);
    var lk = lastOf(A.looks, t), lx = 0, ly = 0;
    if (typeof lk === 'string' && AC[lk]) { var dxl = wx(xOf(lk, t)) - o.x; lx = cl(dxl / 120, -1, 1); ly = -.1; }
    else if (lk === 'up') ly = -1; else if (lk === 'down') ly = 1; else if (lk === 'L') lx = -1; else if (lk === 'R') lx = 1;
    if (o.extra.moving) lx = cl(Math.sign(vel) * .7 + lx * .3, -1, 1);
    if (!lk || lk === 'cam') { lx = 0; ly = 0; }
    o.lx = lx; o.ly = ly; o.open = talk; o.blink = ((t * 1 + A.phase * 3.3) % 3.4) < .12;
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
    function fyFor(z) { return mode === 'land' ? lerp(262, 340, cl((z - 1) / .38)) : (GY - .36 * cfg.VH / z); }
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
      var tgtx = AC[c.tgt] ? wx(xOf(c.tgt, c.t + c.dur / 2)) : (typeof c.tgt === 'number' ? wx(c.tgt) : 400);
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
    for (d = -.35; d <= .36; d += .175) { var tt = Math.max(0, t + d); z += kf(c.z, tt); fx += kf(c.x, tt); fy += kf(c.y, tt); n++; }
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
    var ax = mk('g', {}, actL), sq = mk('g', {}, ax); sq.appendChild(ch.g);
    ACT_DOM[k] = { ax: ax, sq: sq, ch: ch, sh: sh };
  });
  /* accessoires */
  var ballG = mk('g', {}, fxL), ballE = mk('circle', { r: 16, fill: '#ff5f7e', stroke: '#8a2a4a', 'stroke-width': 3 }, ballG);
  put(ballG, '<path d="M-14 -4 Q0 -10 14 -4 M-12 8 Q0 2 12 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>');
  var ballBurn = mk('circle', { r: 14, fill: '#1c1614', opacity: 0 }, ballG);
  var rbG = mk('g', {}, propL), rbP = [];
  ['#ff5a5a', '#ff9a3c', '#ffd93a', '#5fd36b', '#4cb8ff', '#6a6cf0', '#b36be0'].forEach(function (col, i) { rbP.push(mk('path', { d: 'M' + (80 + i * 9) + ' 405 Q360 ' + (-150 + i * 20) + ' ' + (640 - i * 9) + ' 405', fill: 'none', stroke: col, 'stroke-width': 10, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, rbG)); });
  rbG.setAttribute('opacity', 0);
  function rainbowState(t) { var p = 0, o = 0, i; for (i = 0; i < RBEV.length; i++) { var e = RBEV[i]; if (e.t > t) break; if (e.a[0] === 'show') { p = cl((t - e.t) / (e.a[1] || 3)); o = 1; } else if (e.a[0] === 'hide') { o = Math.max(0, 1 - (t - e.t) / (e.a[1] || 1.5)); } } return { p: sm(p), o: o }; }
  var machG = mk('g', {}, propL);
  put(machG, '<ellipse cy="2" rx="30" ry="6" fill="#14213d" opacity=".2"/><rect x="-26" y="-58" width="52" height="56" rx="9" fill="#b7c3d8" stroke="#3b4a66" stroke-width="3.4"/><rect x="-18" y="-50" width="36" height="22" rx="5" fill="#2a3a58"/>' +
    '<circle cx="-8" cy="-39" r="5" fill="#7aff9a"/><circle cx="6" cy="-39" r="5" fill="#ffd23f"/><circle class="mbtn" cx="0" cy="-16" r="8" fill="#ff5f5f" stroke="#7a1f1f" stroke-width="3"/><path d="M-14 -58 L-8 -78 H8 L14 -58Z" fill="#ffb347" stroke="#8a4a12" stroke-width="3" stroke-linejoin="round"/><path d="M-26 -30 q-14 0 -14 14" fill="none" stroke="#3b4a66" stroke-width="4" stroke-linecap="round"/>');
  /* pools de particules */
  var POOL = {};
  function pool(kind, n, mkf) { POOL[kind] = { els: [], n: 0 }; for (var i = 0; i < n; i++) { var e = mkf(); e.setAttribute('opacity', 0); POOL[kind].els.push(e); } }
  put(fxL, '<defs><radialGradient id="flG" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#fff6a8"/><stop offset=".5" stop-color="#ffb02e"/><stop offset="1" stop-color="#ff5a1f"/></radialGradient></defs>');
  pool('flame', 150, function () { return mk('path', { d: 'M0 -1.4 C1 -.6 1 .5 0 1 C-1 .5 -1 -.6 0 -1.4Z', fill: 'url(#flG)' }, fxF); });
  pool('puff', 140, function () { return mk('circle', { r: 5 }, fxF); });
  pool('dot', 140, function () { return mk('circle', { r: 3 }, fxF); });
  pool('spark', 80, function () { return mk('path', { d: SETS.sparkD(1), fill: '#fff6b0' }, fxF); });
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
  var lastUsed = {};
  var curSetOpacity = {};
  function render(t) {
    var cfg = LAYOUT[MODE], i, S = SETS.skyAt(SKYKEYS, t);
    cam.setAttribute('transform', camAt(t));
    /* décor actif */
    var setNow = SETK[0][1], fade = 1, prev = null;
    for (i = 0; i < SETK.length; i++) if (SETK[i][0] <= t) { prev = setNow; setNow = SETK[i][1]; if (i > 0) fade = cl((t - SETK[i][0]) / .5); }
    Object.keys(SETOBJ).forEach(function (n) {
      var so = SETOBJ[n], on = n === setNow;
      so.b.setAttribute('display', on || (prev === n && fade < 1) ? '' : 'none'); so.f.setAttribute('display', on || (prev === n && fade < 1) ? '' : 'none');
      if (on) { so.r.update(t, S, {}); }
    });
    var activeSet = SETOBJ[setNow].r;
    (activeSet.par || []).forEach(function (q) { q[0].setAttribute('transform', 'translate(' + (Math.max(-40, Math.min(40, (1 - q[1]) * (CAMFX - 400)))).toFixed(1) + ' ' + ((1 - q[1]) * (CAMFY - 250) * .5).toFixed(1) + ')'); });
    skyR.update(t, S, { beams: beamsAt(t), birds: activeSet.birds, cloudsOn: activeSet.cloudsOn });
    var nightF = cl((S.night - .2) / .3);
    /* teinte globale */
    tintFront.setAttribute('fill', SETS.rgb(S.tint)); tintFront.setAttribute('opacity', (S.tint[3] * .9).toFixed(3));
    /* personnages */
    LET.forEach(function (k) {
      var A = AC[k], D = ACT_DOM[k], st = astate(k, t), ch = D.ch, gy = actorY(k, t);
      if (!st.vis) { D.ax.setAttribute('display', 'none'); D.sh.setAttribute('opacity', 0); return; }
      D.ax.setAttribute('display', '');
      D.ax.setAttribute('transform', 'translate(' + f1(st.x + st.dx) + ' ' + f1(gy - st.y) + ') scale(' + A.s + ')');
      var cy = ch.cy;
      D.sq.setAttribute('transform', 'translate(0 ' + cy + ') rotate(' + st.rot.toFixed(1) + ') translate(0 ' + (-cy) + ') scale(' + st.sx.toFixed(3) + ' ' + st.sy.toFixed(3) + ')');
      var hh = Math.max(0, st.y - A.hover);
      D.sh.setAttribute('cx', f1(st.x)); D.sh.setAttribute('cy', f1(gy + 2)); D.sh.setAttribute('rx', ((A.kind === 'grincheux' ? 52 : 32) * A.s * (1 - cl(st.y / 300) * .5)).toFixed(1)); D.sh.setAttribute('ry', 7 * A.s); D.sh.setAttribute('opacity', (.22 * (1 - cl(st.y / 320))).toFixed(2));
      CHARS.poseFace(ch.face, { emo: st.emo, open: st.open, lx: st.lx, ly: st.ly, blink: st.blink });
      /* bras */
      if (ch.arms && ch.arms.length) {
        ch.arms[0].setAttribute('transform', 'translate(' + ch.armBase[0][0] + ' ' + ch.armBase[0][1] + ') rotate(' + f1(st.armL) + ')');
        ch.arms[1].setAttribute('transform', 'translate(' + ch.armBase[1][0] + ' ' + ch.armBase[1][1] + ') rotate(' + f1(-st.armR) + ')');
      }
      /* spécificités */
      if (A.kind === 'bouboule') { ch.topEl.setAttribute('transform', 'translate(0 -76) rotate(' + f1(6 * Math.sin(t * 2.2) + st.y * -.08) + ')'); ch.soot.setAttribute('opacity', (st.soot * .8).toFixed(2)); }
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
      machG.setAttribute('display', ''); machG.setAttribute('transform', 'translate(' + f1(mx + (shk ? 2.5 * Math.sin(t * 60) : 0)) + ' ' + GY + ') scale(' + scl.toFixed(3) + ')');
      machG.querySelector('.mbtn').setAttribute('fill', shk && Math.sin(t * 14) > 0 ? '#ffb0b0' : '#ff5f5f');
    } else machG.setAttribute('display', 'none');
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
