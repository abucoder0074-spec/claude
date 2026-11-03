// Optional real-browser QA; uses installed Chrome, no downloaded dependencies.
import {spawn} from 'node:child_process';
import {mkdir,writeFile,mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const browser=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--remote-debugging-port=9337',`--user-data-dir=${await mkdtemp(join(tmpdir(),'myabout-qa-'))}`,'about:blank'],{stdio:'ignore',windowsHide:true});
let ws;const errors=[];let seq=0;const pending=new Map();
try{
 let pages;for(let i=0;i<50;i++){try{pages=await(await fetch('http://127.0.0.1:9337/json')).json();if(pages.some(p=>p.type==='page'))break;}catch{}await pause(200);}
 ws=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
 ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);};
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
 const js=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 await send('Runtime.enable');await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:4173'});
 for(let i=0;i<50;i++){if(await js('!!document.querySelector(".hero")'))break;await pause(100);}
 if(!await js('!!document.querySelector(".hero")'))console.log('DIAGNOSTIC',await js('({url:location.href,body:document.body.innerText.slice(0,1200)})'),errors);
 assert.equal(await js('document.querySelectorAll(".project").length'),3);
 await js('document.querySelector("#language").value="en";document.querySelector("#language").dispatchEvent(new Event("change"))');
 assert.equal(await js('document.documentElement.lang'),'en');
 await js('document.querySelector("#theme").click()');const theme=await js('document.documentElement.dataset.theme');
 await send('Page.reload');await pause(500);assert.equal(await js('document.documentElement.lang'),'en');assert.equal(await js('document.documentElement.dataset.theme'),theme);
 await js('location.hash="projects"');await pause(150);await js('document.querySelector("[data-filter=AI]").click()');assert.equal(await js('document.querySelectorAll(".project:not([hidden])").length'),1);
 await js('document.querySelector("[data-project]").click()');assert.equal(await js('document.querySelector("dialog").open'),true);await js('document.querySelector("#close-dialog").click()');
 for(const lang of ['uz','ru','en']){
  await js(`document.querySelector('#language').value='${lang}';document.querySelector('#language').dispatchEvent(new Event('change'))`);
  for(const route of ['home','about','projects','journal','contact']){await js(`location.hash='${route}'`);await pause(80);assert.ok(await js('!!document.querySelector("h1")'));assert.equal(await js('document.documentElement.lang'),lang);}
 }
 await js('document.querySelector("#name").value="<script>alert(1)</script>";document.querySelector("#email").value="demo@example.com";document.querySelector("#message").value="Testing the practical contact mechanism.";document.querySelector("#contact-form").requestSubmit()');
 assert.equal(await js('!!document.querySelector("#download")'),true);assert.equal(await js('document.querySelectorAll("#form-result script").length'),0);
 await js('location.hash="home"');await pause(150);await js('document.documentElement.dataset.theme="dark"');
 const output=process.argv[2]||'.';await mkdir(output,{recursive:true});
 await writeFile(join(output,'myabout-desktop.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'));
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 for(const route of ['home','about','projects','journal','contact']){await js(`location.hash='${route}'`);await pause(100);assert.ok(await js('document.documentElement.scrollWidth<=innerWidth'),`Mobile overflow: ${route}`);}
 await js('location.hash="home"');await pause(150);await js('document.querySelector("#menu").click()');assert.equal(await js('document.querySelector("#menu").getAttribute("aria-expanded")'),'true');await js('document.querySelector("#menu").click()');
 await writeFile(join(output,'myabout-mobile.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'));
 await js('document.documentElement.dataset.theme="light"');await writeFile(join(output,'myabout-light.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'));
 assert.deepEqual(errors,[]);console.log('PASS: 3 languages × 5 routes, theme persistence, filtering, dialog, contact validation, mobile layouts/menu; no runtime errors.');
}finally{ws?.close();browser.kill();}
