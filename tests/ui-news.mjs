import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=process.env.QA_OUTPUT||path.join(root,'work/qa');fs.mkdirSync(output,{recursive:true});
const base=process.env.BASE_URL||'http://127.0.0.1:8767/';
const browser=await chromium.launch({headless:true,channel:'chrome'});
const errors=[];
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));
await page.goto(base);
assert.equal(await page.locator('.site-header nav a').count(),4);
assert.equal(await page.locator('#date-legend svg').count(),6);
for(const id of ['archive','stories','notes-section','stay']){
 await page.locator(`[data-section="${id}"]`).click();
 await page.waitForFunction(id=>{
  const r=document.getElementById(id).getBoundingClientRect(),h=document.querySelector('.site-header').getBoundingClientRect();return r.top>=h.bottom&&r.top<innerHeight-50;
 },id);
 assert.equal(await page.locator('.site-header').evaluate(h=>Math.abs(h.getBoundingClientRect().top)<1),true);
 if(['archive','stories'].includes(id))assert.equal(await page.locator('#'+id).evaluate(d=>d.open),true);
}
assert.equal(await page.locator('#year-notes').evaluate(d=>d.open),true);
await page.locator('#date-legend').scrollIntoViewIfNeeded();await page.locator('.chart-block').last().screenshot({path:output+'/symbol-legend-desktop.png'});
await page.locator('#stories-link').click();
assert.equal(await page.getByRole('tab').count(),4);
const response=page.waitForResponse(r=>r.url().includes('/api/news')&&r.status()===200);
await page.getByRole('tab',{name:'湖畔近況'}).click();const data=await (await response).json();
await page.waitForFunction(()=>!document.querySelector('#refresh-news').disabled);
assert.equal(data.status,'ready');assert.equal(data.items.length,3);assert.equal(await page.locator('.news-list li').count(),3);
assert.deepEqual(await page.locator('.news-list a').allTextContents(),data.items.map(i=>i.title+' ↗'));
assert.deepEqual(data.items.map(i=>i.published_at),[...data.items.map(i=>i.published_at)].sort().reverse());
await page.waitForFunction(()=>document.querySelector('#stories-link').getAttribute('aria-current')==='location');
await page.screenshot({path:output+'/news-desktop.png'});
const refresh=page.waitForResponse(r=>r.url().includes('/api/news?refresh=1'));await page.locator('#refresh-news').click();await refresh;await page.waitForFunction(()=>!document.querySelector('#refresh-news').disabled);
// An update failure is explicitly labelled and cannot erase a readable snapshot.
await page.route('**/api/news**',r=>r.fulfill({status:503,body:'offline'}));await page.locator('#refresh-news').click();
await page.waitForFunction(()=>document.querySelector('.news-status').textContent.includes('上次讀取的快照'));
assert.equal(await page.locator('.news-list li').count(),3);await page.unroute('**/api/news**');
const mobile=await browser.newPage({viewport:{width:360,height:800},isMobile:true,hasTouch:true,reducedMotion:'reduce'});mobile.setDefaultTimeout(15000);mobile.on('pageerror',e=>errors.push(e.message));await mobile.goto(base);
for(const id of ['archive','stories','notes-section','stay']){
 await mobile.locator(`[data-section="${id}"]`).tap();
 await mobile.waitForFunction(id=>document.getElementById(id).getBoundingClientRect().top>=document.querySelector('.site-header').getBoundingClientRect().bottom,id);
 assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
}
await mobile.locator('#archive-link').tap();await mobile.locator('#date-legend').scrollIntoViewIfNeeded();await mobile.screenshot({path:output+'/legend-mobile.png'});
await mobile.locator('#stories-link').tap();await mobile.getByRole('tab',{name:'湖畔近況'}).tap();await mobile.waitForFunction(()=>!document.querySelector('#refresh-news').disabled);await mobile.screenshot({path:output+'/news-mobile.png'});
assert.equal(await mobile.locator('.news-list li').count(),3);assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
const offline=await browser.newPage();const outbound=[];offline.on('request',r=>{if(/^https?:/.test(r.url()))outbound.push(r.url());});await offline.goto('file://'+root+'/dist/index.html');await offline.locator('#stories-link').click();await offline.getByRole('tab',{name:'湖畔近況'}).click();
assert.match(await offline.locator('.news-status').textContent(),/離線快照/);assert.equal(await offline.locator('#refresh-news').isDisabled(),true);assert.equal(outbound.length,0);
await offline.getByRole('tab',{name:'湖畔近況'}).focus();await offline.keyboard.press('Home');assert.equal(await offline.getByRole('tab').first().getAttribute('aria-selected'),'true');await offline.keyboard.press('End');assert.equal(await offline.getByRole('tab',{name:'湖畔近況'}).getAttribute('aria-selected'),'true');
assert.deepEqual(errors,[]);
const report={status:'PASS',checks:['six actual SVG legend icons','four sticky chapter links on desktop and mobile','automatic disclosure opening','chapter headings not obscured','fourth story tab keyboard navigation','live RSS API latest three sorted headlines','manual refresh','failed refresh visibly retains snapshot','offline news snapshot no outbound requests','mobile no page overflow'],errors};fs.writeFileSync(output+'/ui-news-report.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));await browser.close();
