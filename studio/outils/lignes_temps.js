const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file:///home/claude/bouboule/out/test_ep004.html');await p.waitForTimeout(800);
const r=await p.evaluate(()=>window.__ep.lines?window.__ep.lines().map((l,i)=>i+':'+l.t.toFixed(1)+'-'+l.e.toFixed(1)):Object.keys(window.__ep));console.log(JSON.stringify(r));await b.close()})()
