// Liste les changements de décor d'un épisode construit : node studio/tests/set_timeline.js zt4  (fenêtres où deux décors sont visibles)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const OUT=path.join(__dirname,'..','..','out'),n=process.argv[2];
const b=await chromium.launch();const p=await b.newPage();
fs.writeFileSync(`${OUT}/test_${n}.html`,'<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync(`${OUT}/${n}.html`,'utf8')+'</body></html>');
await p.goto(`file://${OUT}/test_${n}.html`);await p.waitForTimeout(600);
const r=await p.evaluate(()=>{const cam=document.getElementById('cam');const back=cam.children[1];const out=[];const end=window.__ep.ENDT;let prev='';
 for(let t=0;t<end;t+=.1){window.__ep.render(t);const v=[...back.children].map((g,i)=>g.getAttribute('display')===''?i+':'+(g.getAttribute('opacity')||'1'):null).filter(Boolean).join(' ');
  const k=v.replace(/:[0-9.]+/g,'');if(k!==prev){out.push([+t.toFixed(1),v]);prev=k}}return out});
r.forEach(x=>console.log(x[0],x[1]));await b.close()})();
