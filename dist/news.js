/* Headlines only. File mode reads the latest saved snapshot; local server refreshes RSS. */
(() => {
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeURL=value=>{try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u.href:null;}catch{return null;}};
  let snapshot=window.SUWA_NEWS||{items:[]},host=null,busy=false,lastAttempt=0,connection='';
  const live=['http:','https:'].includes(location.protocol)&&['127.0.0.1','localhost'].includes(location.hostname);
  const stamp=value=>{const d=new Date(value);return value&&!Number.isNaN(d.valueOf())?new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(d):'尚未讀取';};
  function draw(){
    if(!host||document.getElementById('tab-news')?.getAttribute('aria-selected')!=='true')return;
    const items=(Array.isArray(snapshot.items)?snapshot.items:[]).filter(i=>safeURL(i.url)).slice(0,3);
    const old=snapshot.fetched_at&&Date.now()-new Date(snapshot.fetched_at)>86400000;
    const message=busy?'正在讀取最新新聞…':connection||(!live?'離線快照；用資料夾中的「開啟觀測冊」啟動，即可連網更新。':snapshot.status==='unavailable'?'這次連線未成功，以下保留上次讀取的三則；不是最新查詢結果。':snapshot.status==='partial'?'部分來源暫時無法連線，以下為本次取得的新聞。':old?'以下是上次讀取的快照，可按「更新新聞」重試。':'依刊登時間排列，只保留目前取得的最新三則。');
    host.innerHTML=`<span class="section-number">當下 / 湖畔近況</span><h3>湖邊，最近發生的事</h3><p class="fine">諏訪市與諏訪地方的日文新聞。由 Google News RSS 聚合，點標題前往報導；與上方選取的歷史年份無關。</p><div class="news-toolbar"><span class="fine">上次讀取：${esc(stamp(snapshot.fetched_at))}（日本時間）</span><button class="quiet-button" id="refresh-news" ${busy||!live?'disabled':''}>${busy?'讀取中…':'更新新聞'}</button></div><p class="news-status fine" role="status">${esc(message)}</p><ol class="news-list">${items.map(i=>`<li><a href="${esc(safeURL(i.url))}" target="_blank" rel="noopener noreferrer">${esc(i.title)} ↗</a><small>${esc(i.publisher)} · ${esc(stamp(i.published_at))}（日本時間）</small></li>`).join('')}</ol>${!items.length?'<p class="empty-note">目前沒有取得可顯示的新聞，稍後可再更新。</p>':''}<p class="news-sources">RSS 來源：${(snapshot.feeds||[]).filter(f=>safeURL(f.url)).map(f=>`<a href="${esc(safeURL(f.url))}" target="_blank" rel="noopener noreferrer">${esc(f.name)} ↗</a>`).join('、')}<br>搜尋範圍：諏訪市 OR 諏訪地方。聚合結果可能遺漏報導；保留原文標題，不另行翻譯或摘要。</p>`;
    document.getElementById('refresh-news').onclick=()=>refresh(true);
  }
  async function refresh(force=false){
    if(!live||busy)return;
    busy=true;lastAttempt=Date.now();connection='';draw();
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
    try{
      const response=await fetch('/api/news'+(force?'?refresh=1':''),{cache:'no-store',signal:controller.signal});
      if(!response.ok)throw new Error('unavailable');
      const data=await response.json();
      if(!Array.isArray(data.items)||!['ready','partial','unavailable'].includes(data.status))throw new Error('invalid data');
      snapshot=data;
    }catch{
      connection='即時更新暫時無法使用，以下是上次讀取的快照。請用「開啟觀測冊」啟動，並確認網路連線。';
    }finally{clearTimeout(timer);busy=false;draw();}
  }
  window.SuwaNews={mount(element){host=element;draw();if(live&&Date.now()-lastAttempt>30000)refresh();}};
  setInterval(()=>{if(!document.hidden&&document.getElementById('tab-news')?.getAttribute('aria-selected')==='true'&&Date.now()-lastAttempt>900000)refresh();},60000);
})();
