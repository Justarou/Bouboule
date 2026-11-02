/* ===== Audio : voix, bruitages (banque), ambiances, musique synthétisée ===== */
var AUDIO = (function () {
  var E = window.ENGINE, BUF = { voice: [], sfx: {} }, decoded = false;
  function b64ab(b) { var s = atob(b), n = s.length, u = new Uint8Array(n); for (var i = 0; i < n; i++) u[i] = s.charCodeAt(i); return u.buffer; }
  function decode(ctx, b64) { return new Promise(function (res, rej) { var p = ctx.decodeAudioData(b64ab(b64), res, rej); if (p && p.then) p.then(res, rej); }); }

  function decodeAll() {
    if (decoded) return Promise.resolve();
    var ctx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100), jobs = [];
    (window.VOICE_B64 || []).forEach(function (b, i) { if (b) jobs.push(decode(ctx, b).then(function (buf) { BUF.voice[i] = buf; }).catch(function () { BUF.voice[i] = null; })); });
    Object.keys(window.SFX_B64 || {}).forEach(function (k) {
      var key = k.replace(/_\d+$/, '');
      jobs.push(decode(ctx, window.SFX_B64[k]).then(function (buf) { (BUF.sfx[key] = BUF.sfx[key] || [])[parseInt(k.split('_').pop(), 10) - 1] = buf; }).catch(function () {}));
    });
    return Promise.all(jobs).then(function () { decoded = true; Object.keys(BUF.sfx).forEach(function (k) { BUF.sfx[k] = BUF.sfx[k].filter(Boolean); }); });
  }

  /* ---------- synthèse ---------- */
  var NB = null;
  function noiseBuf(ctx) { if (NB && NB.sampleRate === ctx.sampleRate) return NB; var n = ctx.sampleRate, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0); for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; return (NB = b); }
  function tone(ctx, dest, type, f, t, dur, vol, att) {
    var o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + (att || .006)); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + .03);
  }
  function shaker(ctx, dest, t, vol) {
    var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noiseBuf(ctx); f.type = 'highpass'; f.frequency.value = 6000;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + .07); s.connect(f); f.connect(g); g.connect(dest); s.start(t, Math.random() * .5); s.stop(t + .09);
  }
  function marimba(ctx, dest, f, t, dur, vol) { tone(ctx, dest, 'triangle', f, t, dur, vol); tone(ctx, dest, 'sine', f * 4, t, dur * .25, vol * .22); }
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  var STYLES = {
    joyeux:  { bpm: 108, root: 60, scale: [0, 2, 4, 7, 9], chords: [[0, 4, 7], [9, 0, 4], [5, 9, 0], [7, 11, 2]], roots: [0, -3, -7, -5], shake: .05, vol: 1, wave: 'triangle' },
    doux:    { bpm: 84,  root: 62, scale: [0, 2, 4, 7, 9], chords: [[0, 4, 7], [7, 11, 2], [9, 0, 4], [5, 9, 0]], roots: [0, -5, -3, -7], shake: .0, vol: .85, wave: 'sine' },
    mystere: { bpm: 90,  root: 57, scale: [0, 3, 5, 7, 10], chords: [[0, 3, 7], [8, 0, 3], [5, 8, 0], [7, 10, 2]], roots: [0, -4, -7, -5], shake: .02, vol: .8, wave: 'triangle' },
    fete:    { bpm: 122, root: 62, scale: [0, 2, 4, 7, 9], chords: [[0, 4, 7], [5, 9, 0], [7, 11, 2], [0, 4, 7]], roots: [0, -7, -5, 0], shake: .07, vol: 1.05, wave: 'triangle' }
  };
  function rr(i) { var x = Math.sin(i * 91.7 + 13.3) * 43758.5453; return x - Math.floor(x); }

  function musicSection(ctx, dest, t0, t1, style, vol) {
    var S = STYLES[style] || STYLES.joyeux, beat = 60 / S.bpm, bar = 0, t = t0;
    while (t < t1 - .05) {
      var ci = bar % 4, ch = S.chords[ci], base = S.root, seed = bar * 7 + (style.length * 3);
      /* basse */
      tone(ctx, dest, 'sine', hz(base + S.roots[ci] - 12), t, beat * .9, .2 * vol * S.vol);
      tone(ctx, dest, 'sine', hz(base + S.roots[ci] - 12 + (ci % 2 ? 7 : 12)), t + beat * 2, beat * .8, .13 * vol * S.vol);
      /* accord en pizzicato */
      for (var b = 0; b < 4; b++) { if (b % 2 === 1) ch.forEach(function (n, k) { marimba(ctx, dest, hz(base + n), t + b * beat + k * .012, .22, .055 * vol * S.vol); }); }
      /* mélodie : 8 croches, notes de la gamme pentatonique */
      for (var e = 0; e < 8; e++) {
        if (rr(seed + e * 3) < .28) continue;
        var deg = Math.floor(rr(seed + e * 5 + 1) * 10), oct = deg >= 5 ? 12 : 0, n = S.scale[deg % 5] + oct + 12;
        if (e === 0 || e === 4) n = ch[Math.floor(rr(seed + e) * 3)] + 12;
        marimba(ctx, dest, hz(base + n), t + e * beat / 2, .32, .11 * vol * S.vol);
      }
      if (S.shake) for (var s = 0; s < 8; s++) shaker(ctx, dest, t + s * beat / 2 + (s % 2 ? .02 : 0), S.shake * vol * (s % 2 ? .7 : 1));
      t += 4 * beat; bar++;
    }
  }
  function jingleStart(ctx, dest, t, vol) { [0, 4, 7, 12, 16].forEach(function (n, i) { marimba(ctx, dest, hz(72 + n), t + i * .11, .5, .16 * vol); }); tone(ctx, dest, 'sine', hz(48), t, .9, .2 * vol); }
  function jingleEnd(ctx, dest, t, vol) { [12, 9, 7, 4, 0].forEach(function (n, i) { marimba(ctx, dest, hz(72 + n), t + i * .12, .5, .15 * vol); }); [0, 4, 7, 12].forEach(function (n) { marimba(ctx, dest, hz(60 + n), t + .75, 1.6, .1 * vol); }); tone(ctx, dest, 'sine', hz(48), t + .75, 1.6, .2 * vol); }

  /* ---------- planification complète ---------- */
  function schedule(ctx, dest, t0, opt) {
    opt = opt || {};
    var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.knee.value = 12; comp.ratio.value = 4; comp.attack.value = .004; comp.release.value = .2;
    var master = ctx.createGain(); master.gain.value = .95; comp.connect(master); master.connect(dest);
    var G = {}, names = { voice: 1.0, sfx: .62, music: .26, amb: .3 };
    Object.keys(names).forEach(function (k) { var g = ctx.createGain(); g.gain.value = (opt[k] === 0 ? 0 : names[k]); g.connect(comp); G[k] = g; });
    var mDuck = ctx.createGain(); mDuck.connect(G.music); mDuck.gain.value = 1;
    /* voix */
    E.LINES.forEach(function (ln, i) {
      var b = BUF.voice[i]; if (!b) return;
      var s = ctx.createBufferSource(); s.buffer = b; s.connect(G.voice); s.start(t0 + ln.t);
      mDuck.gain.setTargetAtTime(.34, t0 + ln.t - .12, .07); mDuck.gain.setTargetAtTime(1, t0 + ln.e + .1, .35);
    });
    /* bruitages */
    var cnt = {};
    E.SFX.forEach(function (ev) {
      var arr = BUF.sfx[ev.key]; if (!arr || !arr.length) return;
      var v = ev.variant !== undefined ? ev.variant % arr.length : ((cnt[ev.key] = (cnt[ev.key] === undefined ? -1 : cnt[ev.key]) + 1) % arr.length);
      var s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = arr[v]; g.gain.value = ev.vol; s.connect(g); g.connect(G.sfx); s.start(t0 + Math.max(0, ev.t));
    });
    /* ambiances */
    E.AMB.forEach(function (a, i) {
      var arr = BUF.sfx[a.key]; if (!arr || !arr.length) return;
      var next = E.AMB[i + 1], end = a.dur ? a.t + a.dur : (next ? next.t + 1 : E.ENDT - 1);
      var s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = arr[0]; s.loop = true; g.gain.setValueAtTime(0, t0 + a.t); g.gain.linearRampToValueAtTime(a.vol, t0 + a.t + 1.2); g.gain.setValueAtTime(a.vol, t0 + end - 1.2); g.gain.linearRampToValueAtTime(0, t0 + end);
      s.connect(g); g.connect(G.amb); s.start(t0 + a.t); s.stop(t0 + end + .1);
    });
    /* musique */
    var secs = [{ t: E.LEAD, style: (window.EP.music || 'joyeux'), vol: 1 }];
    E.MUS.forEach(function (m) { secs.push({ t: m.t, style: m.style, vol: m.vol === undefined ? 1 : m.vol }); });
    secs.sort(function (a, b) { return a.t - b.t; });
    var mEnd = E.ENDT - E.OUTRO + 1.2;
    secs.forEach(function (s, i) { var e = i + 1 < secs.length ? secs[i + 1].t : mEnd; if (e > s.t) musicSection(ctx, mDuck, t0 + s.t, t0 + e, s.style, s.vol); });
    jingleStart(ctx, G.music, t0 + .25, 1.2);
    jingleEnd(ctx, G.music, t0 + E.ENDT - E.OUTRO + .5, 1.2);
    return G;
  }
  return { decodeAll: decodeAll, schedule: schedule, BUF: BUF };
})();
