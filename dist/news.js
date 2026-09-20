/* Headlines only. File mode reads the latest saved snapshot; local server refreshes RSS. */
(() => {
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeURL=value=>{try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u.href:null;}catch{return null;}};
  let snapshot=window.SUWA_NEWS||{items:[]},host=null,busy=false,lastAttempt=0,connection='';
  const online=['http:','https:'].includes(location.protocol);
  const live=['http:','https:'].includes(location.protocol)&&['127.0.0.1','localhost'].includes(location.hostname);
  const stamp=value=>{const d=new Date(value);return value&&!Number.isNaN(d.valueOf())?new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(d):'尚未讀取';};
  function draw(){
    if(!host||document.getElementById('tab-news')?.getAttribute('aria-selected')!=='true')return;
    const items=(Array.isArray(snapshot.items)?snapshot.items:[]).filter(i=>safeURL(i.url)).slice(0,3);
    const old=snapshot.fetched_at&&Date.now()-new Date(snapshot.fetched_at)>129600000;
    const mode=live?'':online?'網站每日排程更新；「讀取最新快照」不會觸發新的 RSS 搜尋。':'離線快照；用資料夾中的「開啟觀測冊」啟動，即可連網更新。';
    const status=snapshot.status==='unavailable'?'最近一次新聞擷取未成功，以下保留上次快照。':snapshot.status==='partial'?'部分來源擷取失敗，以下為可取得的新聞。':!snapshot.fetched_at?'尚未取得新聞快照。':old?'快照已超過 36 小時，可能尚未完成更新。':'依刊登時間排列，僅顯示最近取得的最多三則。';
    const message=busy?'正在讀取新聞…':connection||[mode,status].filter(Boolean).join(' ');
    host.innerHTML=`<span class="section-number">當下 / 湖畔近況</span><h3>湖邊，最近發生的事</h3><p class="fine">諏訪市與諏訪地方的日文新聞。由 Google News RSS 聚合，點標題前往報導；與上方選取的歷史年份無關。</p><div class="news-toolbar"><span class="fine">上次讀取：${esc(stamp(snapshot.fetched_at))}（日本時間）</span><button class="quiet-button" id="refresh-news" ${busy||!online?'disabled':''}>${busy?'讀取中…':live?'更新新聞':'讀取最新快照'}</button></div><p class="news-status fine" role="status">${esc(message)}</p><ol class="news-list">${items.map(i=>`<li><a href="${esc(safeURL(i.url))}" target="_blank" rel="noopener noreferrer">${esc(i.title)} ↗</a><small>${esc(i.publisher)} · ${esc(stamp(i.published_at))}（日本時間）</small></li>`).join('')}</ol>${!items.length?'<p class="empty-note">目前沒有取得可顯示的新聞，稍後可再更新。</p>':''}<p class="news-sources">RSS 來源：${(snapshot.feeds||[]).filter(f=>safeURL(f.url)).map(f=>`<a href="${esc(safeURL(f.url))}" target="_blank" rel="noopener noreferrer">${esc(f.name)} ↗</a>`).join('、')}<br>搜尋範圍：諏訪市 OR 諏訪地方。聚合結果可能遺漏報導；保留原文標題，不另行翻譯或摘要。</p>`;
    document.getElementById('refresh-news').onclick=()=>refresh(true);
  }
  async function refresh(force=false){
    if(!online||busy)return;
    busy=true;lastAttempt=Date.now();connection='';draw();
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
    try{
      const response=await fetch(live?'/api/news'+(force?'?refresh=1':''):new URL('news.json',location.href).href,{cache:'no-store',signal:controller.signal});
      if(!response.ok)throw new Error('unavailable');
      const data=await response.json();
      if(!Array.isArray(data.items)||!['ready','partial','unavailable'].includes(data.status))throw new Error('invalid data');
      snapshot=data;
    }catch{
      connection='無法讀取更新，以下是上次讀取的快照。'+(live?'請確認本機服務與網路連線。':'網站排程可能延遲，請稍後重試。');
    }finally{clearTimeout(timer);busy=false;draw();}
  }
  window.SuwaNews={mount(element){host=element;draw();if(online&&Date.now()-lastAttempt>30000)refresh();}};
  setInterval(()=>{if(!document.hidden&&document.getElementById('tab-news')?.getAttribute('aria-selected')==='true'&&Date.now()-lastAttempt>900000)refresh();},60000);
})();
