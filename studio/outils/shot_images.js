const {chromium}=require('playwright');
(async()=>{const [name,mode,...ts]=process.argv.slice(2);
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1000,height:900}});
const errs=[];p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
const fs=require('fs');const s=fs.readFileSync('/home/claude/bouboule/out/'+name+'.html','utf8');
fs.writeFileSync('/home/claude/bouboule/out/test_'+name+'.html','<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+s+'</body></html>');
await p.goto('file:///home/claude/bouboule/out/test_'+name+'.html');await p.waitForTimeout(800);
await p.evaluate(m=>window.__ep.setMode(m),mode);
for(const t of ts){const r=await p.evaluate(t=>{try{window.__ep.render(+t);return 'ok'}catch(e){return e.stack}},t);if(r!=='ok')errs.push(t+': '+r);
await p.evaluate(()=>{document.getElementById('overlay').hidden=true});
const el=await p.$('.stageBox');await el.screenshot({path:`/home/claude/sfxwork/shots/${name}_${mode}_${t}.png`});}
console.log(errs.slice(0,8).join('\n')||'no errors');await b.close()})()
