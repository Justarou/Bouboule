// Contrôle caméra sur un épisode construit : sauts de caméra et durée minimale des plans.
// Usage : node qc_camera.js out/epNNN.html   (ne modifie rien)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const f=path.resolve(process.argv[2]);const b=await chromium.launch();const p=await b.newPage({viewport:{width:800,height:450}});
await p.goto('file://'+f);await p.waitForTimeout(800);
const r=await p.evaluate(()=>{const jumps=[],cuts=[];let prev=null,last=0;const end=(window.ENGINE&&ENGINE.ENDT)||120;
for(let t=0;t<end;t+=.1){window.__ep.render(t);const m=document.getElementById('cam').getAttribute('transform').match(/scale\(([\d.]+)\) translate\(([-\d.]+) ([-\d.]+)/);if(!m)continue;const v=[+m[1],+m[2],+m[3]];
if(prev){const d=Math.abs(v[0]-prev[0])*300+Math.abs(v[1]-prev[1])+Math.abs(v[2]-prev[2]);if(d>60){jumps.push({t:+t.toFixed(1),d:Math.round(d)});if(last>0&&t-last<2.5)cuts.push({t:+t.toFixed(1),plan_s:+(t-last).toFixed(1)});last=t}}prev=v}
return {end,jumps,short:cuts}});
console.log(JSON.stringify(r,null,1));console.log(r.jumps.length?'A VERIFIER: coupures/sauts brusques (voir t) — acceptes seulement si voulus':'OK: caméra fluide');await b.close()})()
