/* ===== Interface : lecture, formats, export MP4, fiches de publication ===== */
(function () {
  var E = window.ENGINE, $ = function (id) { return document.getElementById(id); };
  var ctx = null, G = null, t0 = 0, raf = 0, playing = false, busy = false;
  var on = { voice: true, music: true, sfx: true, amb: true };
  function say(msg, kind) { var s = $('status'); s.textContent = msg || ''; s.setAttribute('data-kind', kind || ''); }

  function setPlayUI(p) {
    $('overlay').hidden = p;
    $('playLabel').textContent = p ? 'Lecture' : (E.__ended ? 'Rejouer' : 'Lancer l’épisode');
  }
  function stop() {
    playing = false; cancelAnimationFrame(raf);
    if (ctx) { try { ctx.close(); } catch (e) {} ctx = null; }
  }
  function frame() {
    if (!playing) return;
    var t = ctx.currentTime - t0;
    if (t >= E.ENDT) { E.render(E.ENDT); E.__ended = 1; stop(); setPlayUI(false); return; }
    E.render(Math.max(0, t));
    raf = requestAnimationFrame(frame);
  }
  async function start() {
    if (busy) return;
    stop(); E.__ended = 0;
    say('Chargement des sons…');
    try { await AUDIO.decodeAll(); } catch (e) { say('Les sons n’ont pas pu être chargés.', 'err'); return; }
    var AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    if (ctx.state === 'suspended') { try { await ctx.resume(); } catch (e) {} }
    t0 = ctx.currentTime + .25;
    G = AUDIO.schedule(ctx, ctx.destination, t0, { voice: on.voice ? 1 : 0, music: on.music ? 1 : 0, sfx: on.sfx ? 1 : 0, amb: on.amb ? 1 : 0 });
    G.amb.gain.value = on.sfx ? .3 : 0;
    playing = true; setPlayUI(true); say('');
    raf = requestAnimationFrame(frame);
  }
  $('play').addEventListener('click', start);
  [['tVoice', 'voice'], ['tMusic', 'music'], ['tSfx', 'sfx']].forEach(function (p) {
    $(p[0]).addEventListener('click', function () {
      on[p[1]] = !on[p[1]]; this.setAttribute('aria-pressed', String(on[p[1]]));
      if (G) { var base = { voice: 1, music: .26, sfx: .62 }; G[p[1]].gain.value = on[p[1]] ? base[p[1]] : 0; if (p[1] === 'sfx') G.amb.gain.value = on.sfx ? .3 : 0; }
    });
  });
  document.querySelectorAll('[data-mode-btn]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (busy) return;
      var m = b.getAttribute('data-mode-btn'); E.setMode(m);
      document.querySelectorAll('[data-mode-btn]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      if (!playing) E.render(E.__ended ? E.ENDT : (E.__still || 0));
    });
  });

  /* ---------- export MP4 ---------- */
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  async function exportMP4(mode) {
    if (busy) return;
    if (!window.VideoEncoder || !window.AudioEncoder || !window.Mp4Muxer) { say('Ce navigateur ne sait pas créer de MP4. Ouvre la page dans Chrome ou Edge sur ordinateur.', 'err'); return; }
    var dl = await (window.claude && window.claude.use ? window.claude.use('downloads') : null);
    busy = true; stop(); setPlayUI(false);
    var btns = document.querySelectorAll('.dlbtn'); btns.forEach(function (b) { b.disabled = true; });
    var W = mode === 'land' ? 1920 : 1080, H = mode === 'land' ? 1080 : 1920, fps = 30, prev = E.getMode();
    var bar = $('bar'), barWrap = $('barWrap'); barWrap.hidden = false;
    function prog(p, label) { bar.style.width = (p * 100).toFixed(1) + '%'; say(label + ' ' + Math.round(p * 100) + ' %'); }
    try {
      E.setMode(mode);
      document.querySelectorAll('[data-mode-btn]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-mode-btn') === mode)); });
      try { await document.fonts.load('800 24px "Baloo 2"'); } catch (e) {}
      await AUDIO.decodeAll();
      prog(0, 'Mixage du son');
      var off = new OfflineAudioContext(2, Math.ceil(48000 * (E.ENDT + .2)), 48000);
      AUDIO.schedule(off, off.destination, 0, {});
      var abuf = await off.startRendering();

      var vcodec = null, cands = ['avc1.640028', 'avc1.4d0028', 'avc1.42002a', 'avc1.42001f'];
      for (var i = 0; i < cands.length && !vcodec; i++) {
        try { var sup = await VideoEncoder.isConfigSupported({ codec: cands[i], width: W, height: H, bitrate: 6e6, framerate: fps }); if (sup.supported) vcodec = cands[i]; } catch (e) {}
      }
      if (!vcodec) throw new Error('Pas d’encodeur vidéo H.264 disponible ici.');
      var acodec = null, acands = [['mp4a.40.2', 'aac'], ['opus', 'opus']];
      for (var ai = 0; ai < acands.length && !acodec; ai++) {
        try { var asup = await AudioEncoder.isConfigSupported({ codec: acands[ai][0], numberOfChannels: 2, sampleRate: 48000, bitrate: 160000 }); if (asup.supported) acodec = acands[ai]; } catch (e) {}
      }
      if (!acodec) throw new Error('Pas d’encodeur audio disponible ici.');

      var muxer = new Mp4Muxer.Muxer({ target: new Mp4Muxer.ArrayBufferTarget(), video: { codec: 'avc', width: W, height: H }, audio: { codec: acodec[1], numberOfChannels: 2, sampleRate: 48000 }, fastStart: 'in-memory', firstTimestampBehavior: 'offset' });
      var err = null;
      var venc = new VideoEncoder({ output: function (c, m) { muxer.addVideoChunk(c, m); }, error: function (e) { err = e; } });
      venc.configure({ codec: vcodec, width: W, height: H, bitrate: 6e6, framerate: fps });
      var aenc = new AudioEncoder({ output: function (c, m) { muxer.addAudioChunk(c, m); }, error: function (e) { err = e; } });
      aenc.configure({ codec: acodec[0], numberOfChannels: 2, sampleRate: 48000, bitrate: 160000 });

      /* audio */
      var ch0 = abuf.getChannelData(0), ch1 = abuf.getChannelData(1), CH = 4096, nTot = Math.ceil(E.ENDT * 48000);
      for (var s = 0; s < nTot; s += CH) {
        var n = Math.min(CH, nTot - s), data = new Float32Array(n * 2);
        data.set(ch0.subarray(s, s + n), 0); data.set(ch1.subarray(s, s + n), n);
        var ad = new AudioData({ format: 'f32-planar', sampleRate: 48000, numberOfFrames: n, numberOfChannels: 2, timestamp: Math.round(s / 48000 * 1e6), data: data });
        aenc.encode(ad); ad.close();
        if (err) throw err;
      }
      await aenc.flush();

      /* vidéo */
      var cv = document.createElement('canvas'); cv.width = W; cv.height = H; var c2 = cv.getContext('2d');
      var svg = E.svg, nF = Math.ceil(E.ENDT * fps), cfg = E.LAYOUT[mode], k = W / cfg.VW;
      E.ovL.setAttribute('display', 'none');
      for (var f = 0; f < nF; f++) {
        var t = f / fps; E.render(t); E.ovL.setAttribute('display', 'none');
        var xml = new XMLSerializer().serializeToString(svg).replace('<svg ', '<svg width="' + W + '" height="' + H + '" ');
        var url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
        var img = new Image(); img.src = url; await img.decode(); c2.drawImage(img, 0, 0, W, H); URL.revokeObjectURL(url); img.removeAttribute('src'); img = null; xml = null;
        E.drawOverlayCanvas(c2, E.overlayModel(t, mode), k);
        var vf = new VideoFrame(cv, { timestamp: Math.round(f * 1e6 / fps), duration: Math.round(1e6 / fps) });
        venc.encode(vf, { keyFrame: f % (fps * 2) === 0 }); vf.close();
        if (err) throw err;
        while (venc.encodeQueueSize > 8) await sleep(4);
        if (f % 8 === 0) { prog(f / nF, 'Création de la vidéo'); await sleep(0); }
        if (f % 24 === 23) { await venc.flush(); await sleep(30); if (window.gc) window.gc(); }
      }
      await venc.flush(); muxer.finalize();
      E.ovL.removeAttribute('display');
      var blob = new Blob([muxer.target.buffer], { type: 'video/mp4' });
      prog(1, 'Vidéo prête');
      var name = (EP.fileBase || 'episode') + (mode === 'land' ? '_paysage_16x9.mp4' : '_vertical_9x16.mp4');
      if (!dl) { say('Vidéo créée, mais l’enregistrement n’est pas disponible dans cette vue. Ouvre l’épisode depuis ton espace Claude.', 'err'); }
      else {
        try { await dl.save({ filename: name, data: blob }); say('Vidéo enregistrée : ' + name, 'ok'); }
        catch (e) { say(e && e.code === 'declined' ? 'Enregistrement refusé. Tu peux relancer le bouton.' : 'L’enregistrement a échoué (' + ((e && e.code) || 'erreur') + ').', 'err'); }
      }
    } catch (e) {
      say('Échec de l’export : ' + (e && e.message ? e.message : e), 'err');
    } finally {
      E.ovL.removeAttribute('display'); E.setMode(prev); barWrap.hidden = true; btns.forEach(function (b) { b.disabled = false; }); busy = false; E.render(0);
    }
  }
  $('dlLand').addEventListener('click', function () { exportMP4('land'); });
  $('dlPort').addEventListener('click', function () { exportMP4('port'); });

  /* ---------- fiches de publication ---------- */
  var M = EP.meta || {};
  var TABS = [
    { id: 'yt', label: 'YouTube', sub: 'Vidéo paysage', t: M.youtubeTitle, d: M.youtubeDesc, h: M.youtubeTags },
    { id: 'sh', label: 'YouTube Shorts', sub: 'Vidéo verticale', t: M.shortsTitle, d: M.shortsDesc, h: M.shortsTags },
    { id: 'tt', label: 'TikTok', sub: 'Vidéo verticale', t: M.tiktokTitle, d: M.tiktokDesc, h: M.tiktokTags }
  ];
  var cur = 'yt';
  function copy(text, btn) {
    var done = function () { var o = btn.textContent; btn.textContent = 'Copié'; setTimeout(function () { btn.textContent = o; }, 1200); };
    try { navigator.clipboard.writeText(text).then(done, function () { fallback(); }); } catch (e) { fallback(); }
    function fallback() { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { } ta.remove(); }
  }
  function drawTabs() {
    var tabs = $('pubTabs'); tabs.innerHTML = '';
    TABS.forEach(function (T) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'tab'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(T.id === cur));
      b.innerHTML = '<b></b><small></small>'; b.firstChild.textContent = T.label; b.lastChild.textContent = T.sub;
      b.addEventListener('click', function () { cur = T.id; drawTabs(); }); tabs.appendChild(b);
    });
    var T = TABS.filter(function (x) { return x.id === cur; })[0], box = $('pubBody'); box.innerHTML = '';
    [['Titre', T.t || ''], ['Description', T.d || ''], ['Mots-clés', T.h || '']].forEach(function (r, i) {
      var wrap = document.createElement('div'); wrap.className = 'field';
      var head = document.createElement('div'); head.className = 'fhead';
      var lab = document.createElement('span'); lab.textContent = r[0]; var cb = document.createElement('button'); cb.type = 'button'; cb.className = 'copy'; cb.textContent = 'Copier';
      cb.addEventListener('click', function () { copy(r[1], cb); }); head.appendChild(lab); head.appendChild(cb);
      var pre = document.createElement('pre'); pre.textContent = r[1]; pre.className = i === 1 ? 'long' : '';
      wrap.appendChild(head); wrap.appendChild(pre); box.appendChild(wrap);
    });
  }
  drawTabs();

  /* image de repos : on montre un moment parlant plutôt que le carton titre */
  E.__still = E.LEAD + .6;
  E.setMode('land'); E.render(E.__still);
  setPlayUI(false);
  window.__ep = { lines: function () { return E.LINES; }, render: E.render, setMode: E.setMode, ENDT: E.ENDT, exportMP4: exportMP4, audioWav: async function () {
    await AUDIO.decodeAll(); var off = new OfflineAudioContext(2, Math.ceil(48000 * (E.ENDT + .2)), 48000); AUDIO.schedule(off, off.destination, 0, {}); var b = await off.startRendering();
    var n = b.length, ch0 = b.getChannelData(0), ch1 = b.getChannelData(1), buf = new ArrayBuffer(44 + n * 4), v = new DataView(buf);
    function ws(o, s) { for (var i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); }
    ws(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); ws(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true); v.setUint32(24, 48000, true); v.setUint32(28, 48000 * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); ws(36, 'data'); v.setUint32(40, n * 4, true);
    for (var i = 0; i < n; i++) { v.setInt16(44 + i * 4, Math.max(-1, Math.min(1, ch0[i])) * 32767, true); v.setInt16(46 + i * 4, Math.max(-1, Math.min(1, ch1[i])) * 32767, true); }
    var u = new Uint8Array(buf), s = '', CH = 0x8000; for (var j = 0; j < u.length; j += CH) s += String.fromCharCode.apply(null, u.subarray(j, j + CH)); return btoa(s);
  } };
})();
