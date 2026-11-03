// Compare deux épisodes construits (out/A.html, out/B.html) image par image sur N instants, paysage et vertical.
// Usage : node studio/tests/compare_frames.js A B [N=12] [--exclude t0-t1,...]  -> nombre de pixels différents par instant
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const [A,B,Narg,...rest]=process.argv.slice(2);const N=+(Narg||12);
const excl=(rest.join(' ').match(/--exclude\s+(\S+)/)||[,''])[1].split(',').filter(Boolean).map(s=>s.split('-').map(Number));
const OUT=path.join(__dirname,'..','..','out');
(async()=>{const b=await chromium.launch();let bad=0,tot=0;
async function load(n){const p=await b.newPage({viewport:{width:1000,height:900}});
 fs.writeFileSync(`${OUT}/test_${n}.html`,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync(`${OUT}/${n}.html`,'utf8')+'</body></html>');
 await p.goto(`file://${OUT}/test_${n}.html`);await p.waitForTimeout(700);return p}
const pa=await load(A),pb=await load(B);
const end=await pa.evaluate(()=>window.__ep.ENDT);
for(const mode of ['land','port']){await pa.evaluate(m=>window.__ep.setMode(m),mode);await pb.evaluate(m=>window.__ep.setMode(m),mode);
 for(let i=0;i<N;i++){const t=+(end*(i+.5)/N).toFixed(2);
  if(excl.some(([a,c])=>t>=a&&t<=c)){console.log(mode,t,'(exclu)');continue}
  const shots=[];for(const p of [pa,pb]){await p.evaluate(t=>window.__ep.render(t),t);await p.evaluate(()=>{document.getElementById('overlay').hidden=true});shots.push(await (await p.$('.stageBox')).screenshot())}
  tot++;const same=Buffer.compare(shots[0],shots[1])===0;if(!same)bad++;console.log(mode,t,same?'IDENTIQUE':'DIFFERENT');}}
console.log(`BILAN ${A} vs ${B} : ${tot-bad}/${tot} identiques`);await b.close();process.exit(bad?1:0)})();
