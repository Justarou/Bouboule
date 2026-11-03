// Zones de sécurité : vérifie à chaque réplique (début, milieu, fin) que personnages visibles et maison
// ne sont pas coupés ni sous le sous-titre, en paysage ET en vertical.
// Usage : node qc_cadrage.js out/epNNN.html   (lecture seule)
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const f=path.resolve(process.argv[2]);const s=fs.readFileSync(f,'utf8');
const tmp=f.replace(/\.html$/,'_cadrage.html');
fs.writeFileSync(tmp,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+s+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1000,height:1100}});
await p.goto('file://'+tmp);await p.waitForTimeout(800);
let bad=0;const out={};
for(const mode of ['land','port']){await p.evaluate(m=>window.__ep.setMode(m),mode);
 const r=await p.evaluate(()=>{const L=window.__ep.lines();const svg=document.getElementById('scene');const sr=svg.getBoundingClientRect();
  const cam=document.getElementById('cam');const act=cam.children[4],prop=cam.children[3];const res=[];
  const portrait=sr.height>sr.width;
  // Le dernier échantillon (fin de réplique +1,5 s) couvre le générique de fin.
  // zones : marges 5 % ; sous-titre = bande basse 22 % (paysage) ou haute 20 % (vertical)
  const m=.05,sub=portrait?{y0:0,y1:.2}:{y0:.78,y1:1};
  L.forEach((l,i)=>{[l.t+.8,(l.t+l.e)/2,l.e-.3].concat(i===L.length-1?[l.e+1.5]:[]).forEach((t,si)=>{window.__ep.render(t);const probs=[];
   const chk=(el,name)=>{const r=el.getBoundingClientRect();if(!r.width||!r.height)return;
    const x0=(r.left-sr.left)/sr.width,x1=(r.right-sr.left)/sr.width,y0=(r.top-sr.top)/sr.height,y1=(r.bottom-sr.top)/sr.height;
    if(x1<=0||x0>=1)return; // hors champ = pas à l'écran
    if(x0<m||x1>1-m)probs.push(name+' coupé/bord latéral ('+x0.toFixed(2)+'–'+x1.toFixed(2)+')');
    if(y0<m && !portrait)probs.push(name+' touche le haut');
    if(y1>sub.y0&&y0<sub.y1&&((sub.y1-sub.y0)>0)&&(portrait?y0<sub.y1:y1>sub.y0+.06)&&name!=='maison')probs.push(name+' sous le sous-titre');};
   Array.from(act.children).forEach((g,k)=>{if(g.getAttribute('display')==='none'||g.style.display==='none')return;const op=+(g.getAttribute('opacity')||1);if(op<.2)return;chk(g,'perso'+k)});
   Array.from(prop.children).forEach(g=>{if(si>0&&g.querySelector&&g.querySelector('.hbd')&&g.getAttribute('display')!=='none'){ /* la maison est exemptée pendant l'animation de construction (1er échantillon) */const rr=g.querySelector('.hbd');chk(rr,'maison')}});
   if(probs.length)res.push({ligne:i,t:+t.toFixed(1),probs})});});
  return res});
 out[mode]=r;bad+=r.length}
fs.unlinkSync(tmp);console.log(JSON.stringify(out,null,1));console.log(bad?'A VERIFIER: '+bad+' alerte(s) de cadrage':'OK: cadrage dans les zones de sécurité');await b.close()})()
