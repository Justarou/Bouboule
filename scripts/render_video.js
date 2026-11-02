/* Fabrique les MP4 d'un épisode dans le cloud : node render_video.js out/ep002.html land|port sortie.mp4 [fps] [maxSeconds] */
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
(async () => {
  const [html, mode, out, fpsArg, maxArg] = process.argv.slice(2);
  const fps = +(fpsArg || 30), W = mode === 'land' ? 1920 : 1080, H = mode === 'land' ? 1080 : 1920;
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: W, height: H } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  let src = fs.readFileSync(html, 'utf8');
  if (!/^<!doctype/i.test(src)) src = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + src + '</body></html>';
  fs.writeFileSync(html + '.render.html', src);
  await p.goto('file://' + require('path').resolve(html + '.render.html'));
  await p.addStyleTag({ content: `body{padding:0!important;background:#000!important}.wrap>*:not(.stageBox){display:none!important}.wrap{max-width:none!important;display:block!important}#overlay{display:none!important}.stageBox{width:${W}px!important;height:${H}px!important;max-width:none!important;aspect-ratio:auto!important;border-radius:0!important;margin:0!important;box-shadow:none!important}` });
  await p.evaluate(m => window.__ep.setMode(m), mode);
  await p.evaluate(() => document.fonts.ready);
  const ENDT = await p.evaluate(() => window.__ep.ENDT);
  const total = Math.ceil(Math.min(ENDT, maxArg ? +maxArg : 1e9) * fps);
  /* audio */
  const wav = await p.evaluate(() => window.__ep.audioWav());
  const wavPath = out + '.wav'; fs.writeFileSync(wavPath, Buffer.from(wav, 'base64'));
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-i', wavPath, '-t', String(total / fps),
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', '-shortest', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const el = await p.$('.stageBox');
  for (let f = 0; f < total; f++) {
    await p.evaluate(t => window.__ep.render(t), f / fps);
    const buf = await el.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.log(`frame ${f}/${total}`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  fs.unlinkSync(wavPath); await b.close();
  console.log('ok', out, errs.length ? 'erreurs: ' + errs.slice(0, 3) : '');
})();
