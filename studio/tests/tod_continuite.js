// Continuité du ciel/teinte (EV-003) : échantillonne à 30 i/s autour de chaque clé `tod` et signale les sauts de couleur.
// Usage : node studio/tests/tod_continuite.js epX [seuil=6]   (saut = variation moyenne RVB de la bande de ciel entre 2 images)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const OUT=path.join(__dirname,'..','..','out'),n=process.argv[2],thr=+(process.argv[3]||6);
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1000,height:900}});
fs.writeFileSync(`${OUT}/test_${n}.html`,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync(`${OUT}/${n}.html`,'utf8')+'</body></html>');
await p.goto(`file://${OUT}/test_${n}.html`);await p.waitForTimeout(600);await p.evaluate(()=>window.__ep.setMode('land'));
const keys=await p.evaluate(()=>window.ENGINE.SKY.map(k=>[+k[0].toFixed(2),k[1]]));
console.log('clés tod :',keys.map(k=>k[0]+'s '+k[1]).join(' | '));
const times=[...new Set(keys.map(k=>k[0]))].sort((a,b)=>a-b).filter(t=>t>0);
const wins=[];times.forEach(t=>{const w=[Math.max(0,t-.5),t+.5];if(wins.length&&w[0]<=wins[wins.length-1][1])wins[wins.length-1][1]=w[1];else wins.push(w)});
const samp=async t=>{await p.evaluate(t=>{window.__ep.render(t);document.getElementById('overlay').hidden=true},t);
 const png=await (await p.$('.stageBox')).screenshot();return await p.evaluate(async d=>{const im=new Image();im.src='data:image/png;base64,'+d;await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=Math.round(im.height*.12);const x=c.getContext('2d');x.drawImage(im,0,0);const a=x.getImageData(0,0,c.width,c.height).data;let r=0,g=0,bl=0,k=0;for(let i=0;i<a.length;i+=16){r+=a[i];g+=a[i+1];bl+=a[i+2];k++}return[r/k,g/k,bl/k]},png.toString('base64'))};
let bad=0,maxall=0;
for(const [a,c] of wins){let prev=null,pt=0;for(let t=a;t<=c;t+=1/30){const v=await samp(t);if(prev){const d=(Math.abs(v[0]-prev[0])+Math.abs(v[1]-prev[1])+Math.abs(v[2]-prev[2]))/3;maxall=Math.max(maxall,d);if(d>thr){bad++;console.log('SAUT',pt.toFixed(2),'s ->',t.toFixed(2),'s :',d.toFixed(1))}}prev=v;pt=t}}
console.log(`BILAN ${n} : ${bad} saut(s) > ${thr} ; variation max ${maxall.toFixed(1)}`);await b.close()})();
