// Synchro labiale (mesure sur le moteur) : pendant chaque réplique, la bouche du personnage qui parle doit bouger ;
// celle des autres et celle du narrateur (aucun personnage) doivent rester fermées.
// Usage : node qc_lipsync.js out/epNNN.html   (lecture seule)
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const f=path.resolve(process.argv[2]);const s=fs.readFileSync(f,'utf8');const tmp=f.replace(/\.html$/,'_lip.html');
fs.writeFileSync(tmp,'<!doctype html><html><head><meta charset="utf-8"></head><body>'+s+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1000,height:900}});await p.goto('file://'+tmp);await p.waitForTimeout(800);
const r=await p.evaluate(()=>{const L=window.__ep.lines();const cam=document.getElementById('cam');const act=cam.children[4];
 const chars=Array.from(act.children);const H=()=>chars.map(g=>{const m=g.querySelector('.mo');if(!m)return 0;try{return m.getBBox().height}catch(e){return 0}});
 const out=[];L.forEach((l,i)=>{const n=Math.max(8,Math.floor((l.e-l.t)/.08));const mx=chars.map(()=>[]);
  for(let k=0;k<n;k++){const t=l.t+.2+(l.e-l.t-.3)*k/n;window.__ep.render(t);H().forEach((h,j)=>mx[j].push(h))}
  const act_=mx.map(a=>{const mn=Math.min(...a),mxv=Math.max(...a);return {amp:+(mxv-mn).toFixed(2),ouvert:+(a.filter(v=>v>mn+.6*(mxv-mn)).length/a.length).toFixed(2)}});
  out.push({ligne:i,who:l.who||null,t:+l.t.toFixed(1),bouches:act_})});return out});
fs.unlinkSync(tmp);let ko=0;r.forEach(x=>{const a=x.bouches.map(b=>b.amp);const mx=Math.max(...a);const idx=a.indexOf(mx);x.verdict=(x.who==='N')?(mx<4?'OK (narrateur : aucune bouche)':'A VERIFIER'):(mx>=4?'OK (le plus mobile = '+idx+', autres ≤ '+Math.max(...a.filter((_,j)=>j!==idx)).toFixed(1)+')':'A VERIFIER : bouche peu mobile');if(x.verdict.startsWith('A V'))ko++;if(x.who!=='N'&&a.filter(v=>v>.6*mx).length>1){x.verdict='A VERIFIER : deux bouches bougent';ko++}});console.log(JSON.stringify(r,null,1));console.log(ko?ko+' alerte(s) de synchro':'OK: synchro labiale cohérente (parleur seul mobile)');await b.close()})()
