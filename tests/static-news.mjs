import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=process.env.QA_OUTPUT||path.join(root,'work/qa');fs.mkdirSync(output,{recursive:true});
const snapshot=JSON.parse(fs.readFileSync(path.join(root,'dist/news.json'),'utf8'));
const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
 const page=await browser.newPage({viewport:{width:360,height:800},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
 let mode='ready';
 await page.route('https://suwa.test/**',async route=>{
  const pathname=new URL(route.request().url()).pathname;
  assert.ok(pathname.startsWith('/suwa-winter-notebook/'),'Requests must retain the repository subpath');
  let rel=pathname.slice('/suwa-winter-notebook/'.length)||'index.html';
  if(rel==='news.json'){
   if(mode==='error')return route.fulfill({status:503,body:'unavailable'});
   const data=structuredClone(snapshot);
   if(mode==='stale')data.fetched_at='2020-01-01T00:00:00Z';
   if(mode==='failed')data.status='unavailable';
   if(mode==='empty')data.items=[];
   return route.fulfill({contentType:'application/json',body:JSON.stringify(data)});
  }
  const file=path.join(root,'dist',rel);
  if(!fs.existsSync(file))return route.fulfill({status:404,body:'missing'});
  const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png'}[path.extname(file)];
  return route.fulfill({contentType:type,body:fs.readFileSync(file)});
 });
 await page.goto('https://suwa.test/suwa-winter-notebook/');
 await page.locator('#stories-link').click();await page.getByRole('tab',{name:'湖畔近況'}).click();
 await page.waitForFunction(()=>!document.querySelector('#refresh-news').disabled);
 assert.match(await page.locator('.news-status').innerText(),/網站每日排程更新/);
 assert.equal(await page.locator('.news-list li').count(),snapshot.items.length);
 assert.equal(await page.locator('#refresh-news').innerText(),'讀取最新快照');
 for(const [state,word] of [['error','上次讀取的快照'],['stale','36 小時'],['failed','未成功'],['empty','網站每日排程更新']]){
  mode=state;await page.locator('#refresh-news').click();
  await page.waitForFunction(()=>!document.querySelector('#refresh-news').disabled);
  assert.ok((await page.locator('.news-status').innerText()).includes(word));
  assert.equal(await page.locator('.news-list li').count(),state==='empty'?0:snapshot.items.length);
 }
 assert.ok(requests.some(u=>u.endsWith('/suwa-winter-notebook/news.json')));
 assert.ok(!requests.some(u=>u.includes('/api/news')));
 assert.match(await page.locator('#edition').innerText(),/0.4.0-beta.1/);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.deepEqual(errors,[]);
 mode='ready';await page.locator('#refresh-news').click();await page.waitForFunction(()=>!document.querySelector('#refresh-news').disabled);
 await page.screenshot({path:path.join(output,'static-news-mobile.png')});
 const result={status:'PASS',checks:['repository subpath','static same-origin JSON','no local API call on public host','manual snapshot refresh','failure retains items','36-hour stale notice','failed-job notice','valid empty result clears items','beta version','mobile width'],errors};
 fs.writeFileSync(path.join(output,'static-news-report.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
} finally {await browser.close();}
