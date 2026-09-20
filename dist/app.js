/* UI only; source data and calendar/statistical rules live in separate files. */
(() => {
  'use strict';
  const D=window.SUWA_DATA, C=window.SuwaCore, $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byYear=new Map(D.winters.map(w=>[w.winter_year,w]));
  const byEvent=new Map(D.events.map(e=>[e.id,e]));
  const bySource=new Map(D.sources.map(s=>[s.id,s]));
  const labels={occurred:'有御神渡的紀錄',not_observed:'未觀察到御神渡',unknown:'尚無可核實紀錄',disputed:'紀錄仍有歧異'};
  const kinds={first_observed:'出現日期',sighting:'單次目擊',recognition:'官方認定',ceremony:'神事',declaration:'年度宣告',season_report:'年度記載',ice_cover:'結冰記載',personal_sighting:'私人目擊',observation_confirmation:'觀察確認'};
  const ice={unknown:'湖面冰況尚無足夠記載',complete_observed:'有全面結冰紀錄',near_complete_observed:'研究者描述為接近全面結冰',partial_observed:'有部分湖面結冰目擊'};
  const stories=[...D.stories,{id:'news',tab:'湖畔近況'}];
  const state={year:2018,month:2,day:3,nights:4,story:0};
  let calendarStart='',drag=null,suppressClick=false;
  const eventsFor=w=>w.events.map(id=>byEvent.get(id));
  const shortDate=d=>d?`${Number(d.slice(5,7))}/${Number(d.slice(8,10))}`:'日期未載';
  function dateText(e){return e.date_precision==='month'?`${e.date_start.slice(0,4)} 年 ${Number(e.date_start.slice(5,7))} 月（未指定日）`:e.date_precision==='day'?e.date_start:e.date_precision==='range'?`${e.date_start} 至 ${e.date_end}`:'本冬季，日期未載';}
  function sourceCards(ids){return [...new Set(ids)].map(id=>{const s=bySource.get(id);if(!s)return '';return `<div class="source-card">${s.url?`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a>`:esc(s.title)}<span class="source-meta">${esc(s.organization)} · 刊登：${esc(s.published_date||'未標示')}${s.pages?` · 頁碼：${esc(s.pages)}`:''}<br>查閱：${esc(s.accessed_date)}</span><p>${esc(s.notes)}</p></div>`;}).join('');}
  function eventCard(e){return `<div class="event-card"><div class="event-date">${e.date_precision==='day'?shortDate(e.date_start):e.date_precision==='month'?Number(e.date_start.slice(5,7))+' 月':'—'}<small>${esc(kinds[e.event_type]||'紀錄')}</small></div><div><p class="event-title">${esc(e.title)}</p><button data-event="${esc(e.id)}" aria-label="${esc(e.title)}，查看日期、註記與來源">查看記載與來源 ↗</button></div></div>`;}
  function setYear(value){state.year=Math.max(1877,Math.min(2026,Number(value)));renderYear();}
  function renderYear(){
    const w=byYear.get(state.year),ev=eventsFor(w);
    renderScene(w);
    $('year-title').textContent=state.year;
    $('winter-status').textContent=labels[w.omiwatari_status]+(w.quality_flags.includes('first_date_disputed')?' · 日期有歧異':'');
    $('year-slider').value=state.year;$('year-select').value=state.year;
    $('prev-year').disabled=state.year===1877;$('next-year').disabled=state.year===2026;
    $('year-summary').textContent=w.summary;
    const dated=ev.filter(e=>e.date_precision==='day');
    const preview=dated.length?dated.filter(e=>!(e.event_type==='first_observed'&&e.date_start==='2018-02-01')).slice(0,3):ev.slice(0,2);
    $('event-preview').innerHTML=preview.length?preview.map(eventCard).join(''):'<p class="empty-note">這頁先留白。尚未找到足以判定年度結果的逐年記載，並不表示當年沒有御神渡。</p>';
    const climate=D.climate.records.filter(r=>r.winter_year===state.year);
    $('notes-content').innerHTML=`<p><strong>冰況：</strong>${esc(ice[w.ice_cover_status]||w.ice_cover_status)}。結冰與御神渡分開記錄。</p><h3>記錄的範圍</h3><p>${esc(w.observation_scope)}</p><h3>還不知道的事</h3><ul>${w.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>${w.quality_flags.includes('secondary_annual_summary')?'<p class="empty-note">年度結果來自地方觀光回顧，逐年神社原帳仍待補核。</p>':''}${candidateNote(w)}${ev.length?`<h3>這一季的全部記載</h3>${ev.map(eventCard).join('')}`:''}<h3>氣象小註</h3>${climate.length?`<p>日本氣象廳諏訪站（47620）實測，單位 °C。</p><ul>${climate.map(r=>`<li>${r.period}：月均溫 ${r.mean_temperature}°C；月內最低 ${r.absolute_min_temperature}°C。</li>`).join('')}</ul><p class="fine">月內最低是單次極值，不是每日最低的平均。本版只有這兩個月，不能據此比較各年或預測湖冰。</p>${sourceCards(climate.flatMap(r=>r.source_ids))}`:'<p>本版尚未匯入此冬季的氣象紀錄。</p>'}<h3>${w.omiwatari_status==='unknown'?'已查找的研究入口（尚不足以判定本年）':'當時的記載與出處'}</h3>${sourceCards([...w.source_ids,...ev.flatMap(e=>e.source_ids)])}`;
    document.querySelectorAll('.year-cell').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.year)===state.year));
    $('companion-message').hidden=true;
    renderStay();
  }
  function candidateNote(w){
    const c=(D.candidates||[]).find(c=>c.winter_year===w.winter_year);
    return c?`<div class="candidate-note"><h3>找到一條待核線索</h3><p>${c.proposed_outcome==='occurred'?'二手清單列有這一年。':'二手出現清單未列出這一年；缺席不能證明未出現。'}上游原文尚未取得，年度仍維持未知，不納入比例統計。</p><p class="fine">有線索，與已有可採用的年度結果，是不同的事。</p>${sourceCards(c.source_ids)}</div>`:'';
  }
  let sceneTimer;
  function renderScene(w){
    const key=['occurred','not_observed'].includes(w.omiwatari_status)?w.omiwatari_status:'unknown';
    const art=$('hero-art'),scene=document.querySelector('.landscape');
    scene.dataset.state=key;
    art.src=`assets/hero-${key.replace('_','-')}.png`;
    art.alt=({occurred:'兩位神明創作角色在岸邊望向示意冰脊',not_observed:'兩位角色在岸邊裹衣喝茶，湖面沒有示意冰脊',unknown:'兩位角色一起翻閱帳本，等待更多冬季紀錄'})[key]+'；非當年冰況復原';
    $('scene-note').textContent=({occurred:'沿著記錄，想像那一年的冬天。',not_observed:'沒有御神渡，湖面仍然值得看。',unknown:w.omiwatari_status==='disputed'?'這年的是否出現仍有歧異。':'這年的可核實紀錄尚未找到。'})[key];
    $('show-legend').hidden=key!=='occurred';
    scene.classList.remove('page-turn');void scene.offsetWidth;scene.classList.add('page-turn');
    clearTimeout(sceneTimer);sceneTimer=setTimeout(()=>scene.classList.remove('page-turn'),500);
  }
  function showLegend(){
    $('dialog-content').innerHTML='<span class="section-number">傳說演出／路徑示意</span><h3>冰上的路，傳說中的相會</h3><img class="legend-vignette" src="assets/vignette-legend.png" alt="傳說場景：男神沿示意冰脊招呼，女神在另一端揮手"><p>這是傳說中的相會，不是當年的冰況或可行走路線。請從岸邊觀賞，勿踏上湖冰。</p>';
    $('event-dialog').showModal();
  }
  $('show-legend').onclick=showLegend;
  function setArrival(iso){const d=C.parse(iso);if(!d)return;state.month=d.getUTCMonth()+1;state.day=d.getUTCDate();$('month').value=state.month;$('day').value=state.day;renderStay();}
  function moveArrival(delta){const s=C.span(state.year,state.month,state.day,state.nights);if(s.error)return;const next=C.add(s.start,delta);if(next<`${state.year-1}-12-01`||C.add(next,state.nights)>`${state.year}-03-31`)return;setArrival(next);}
  function renderStay(){
    const s=C.span(state.year,state.month,state.day,state.nights),w=byYear.get(state.year),ev=eventsFor(w);
    $('date-error').hidden=!s.error;$('date-error').textContent=s.error||'';$('calendar-area').hidden=!!s.error;
    if(s.error)return;
    const seasonStart=`${state.year-1}-12-01`,seasonEnd=`${state.year}-03-31`,seasonDays=C.dayIndex(state.year,seasonEnd);
    $('stay-range').textContent=`${s.start} → ${s.end} · ${s.nights} 晚 / ${s.days.length} 日`;
    $('prev-day').disabled=s.start===seasonStart;$('next-day').disabled=s.end===seasonEnd;
    $('arrival-slider').min=0;$('arrival-slider').max=seasonDays-state.nights;$('arrival-slider').value=C.dayIndex(state.year,s.start);
    $('arrival-slider').setAttribute('aria-valuetext',`${s.start} 抵達，${s.end} 離開`);
    const anchor=Math.max(0,Math.min(C.dayIndex(state.year,s.start)-2,seasonDays-10));
    calendarStart=C.add(seasonStart,anchor);
    $('calendar').innerHTML=Array.from({length:11},(_,i)=>{
      const date=C.add(calendarStart,i),inStay=s.days.includes(date),points=ev.filter(e=>e.date_precision==='day'&&e.date_start===date),unavailable=C.add(date,state.nights)>seasonEnd;
      return `<button class="calendar-day${inStay?' selected':''}${date===s.start?' start':''}${date===s.end?' end':''}${points.length?' has-event':''}" data-date="${date}" aria-label="${date}${inStay?'，停留期間':''}${points.length?'，'+points.map(e=>e.title).join('、'):''}" aria-pressed="${inStay}" ${unavailable?'disabled':''}><span class="month-tag">${i===0||date.slice(8)==='01'?Number(date.slice(5,7))+' 月':'&nbsp;'}</span>${Number(date.slice(8))}</button>`;
    }).join('');
    const first=ev.find(e=>e.event_type==='first_observed'&&e.date_precision==='day'&&!e.exclude_from_statistics);
    const claims=ev.filter(e=>e.event_type==='first_observed'&&e.exclude_from_statistics),relations=claims.map(e=>C.relation(e,s));
    const claimDates=[...new Set(claims.map(e=>shortDate(e.date_start)))].sort().join('、');
    const disputedIntro=claims.length?relations.every(r=>r==='before')?`兩種出現日期記載都在抵達前（${claimDates}）。`:relations.every(r=>r==='after')?`兩種出現日期記載都在離開後（${claimDates}）。`:`出現日期有 ${claimDates} 等候選記載；與停留的關係仍須保留差異。`:null;
    const intro=disputedIntro|| (first?({before:`抵達前已有出現紀錄（${shortDate(first.date_start)}）。`,during:`停留期間有出現紀錄（${shortDate(first.date_start)}）。`,after:`離開後才有出現紀錄（${shortDate(first.date_start)}）。`})[C.relation(first,s)]:w.omiwatari_status==='unknown'?'這個冬季的結果尚待核實。':w.omiwatari_status==='not_observed'?'來源將這個冬季記為未觀察到御神渡。':'這個冬季有御神渡紀錄，首次出現的確切日期尚不清楚。');
    const matches=ev.filter(e=>e.date_precision==='day'&&C.relation(e,s)==='during'&&e.event_type!=='first_observed');
    $('stay-result').innerHTML=`<strong>${esc(intro)}</strong>${matches.length?`<ul>${matches.map(e=>`<li>${shortDate(e.date_start)} · ${esc(e.title)} <button class="text-button" data-event="${esc(e.id)}">記載 ↗</button></li>`).join('')}</ul>`:'<p>這段停留內，沒有其他已收錄的確切日期事件。</p>'}<p class="fine">目前沒有可靠的連續可見期間；單日目擊只代表那一天，無法據此確定整段住宿都看得到。</p>`;
  }
  function showEvent(id){const e=byEvent.get(id);if(!e)return;$('dialog-content').innerHTML=`<span class="section-number">${e.winter_year} / ${esc(kinds[e.event_type])}</span><h3>${esc(e.title)}</h3><p><strong>${esc(dateText(e))}</strong></p><p>${esc(e.notes)}</p><p class="fine">記載範圍：${esc(e.observation_scope)}</p>${e.original_date_text?`<p class="fine">原文日期／標記：${esc(e.original_date_text)}</p>`:''}${sourceCards(e.source_ids)}`;$('event-dialog').showModal();}
  function renderStats(){
    const rows=D.winters.filter(w=>$('stats-period').value!=='recent'||w.winter_year>=1997),s=C.summary(rows);
    const models=window.SuwaCharts.dates(rows,D.events), windows=window.SuwaCharts.windows(rows);
    $('stats-summary').textContent=`出現 ${s.occurred} / 可判定 ${s.known} · 全部 ${s.total} 個冬季 · 覆蓋 ${(s.known/s.total*100).toFixed(1)}%`;
    const W=1200,left=175,right=30,min=rows[0].winter_year,max=rows.at(-1).winter_year;
    const x=y=>left+(y-min)/(max-min)*(W-left-right),ry=v=>20+(1-v)*190;
    const axis=bottom=>[min,Math.round((min+max)/2),max].map(y=>`<text x="${x(y)}" y="${bottom}" text-anchor="middle">${y}</text>`).join('');
    const link=(year,content,label,cls='')=>`<a class="${cls}" href="#winter-heading" data-year="${year}" aria-label="${esc(label)}"><title>${esc(label)}</title>${content}</a>`;
    let grid=[0,.25,.5,.75,1].map(v=>`<line x1="${left}" x2="${W-right}" y1="${ry(v)}" y2="${ry(v)}" stroke="#d1dfe8"/><text x="150" y="${ry(v)+5}" text-anchor="end">${v*100}%</text>`).join('');
    let paths=[],segment=[];
    windows.forEach(r=>{if(r.visible)segment.push(`${x(r.year)},${ry(r.rate)}`);else if(segment.length){paths.push(segment);segment=[];}});if(segment.length)paths.push(segment);
    const barWidth=Math.min(22,(W-left-right)/rows.length*.8);
    const strip=windows.map(r=>{
      const label=r.unformed?`${r.year}：本範圍尚未滿20年`:`${r.start}–${r.end}：出現${r.occurred}／可判定${r.known}；${r.visible?'顯示比例':'少於16年，不畫比例'}`;
      return link(r.year,`<rect x="${x(r.year)-barWidth/2}" y="251" width="${barWidth}" height="24" fill="${r.unformed?'url(#unformed-hatch)':r.visible?'#426d8a':'#d3e2ec'}" stroke="#8da9bc"/>${!r.unformed?`<rect x="${x(r.year)-barWidth/2}" y="${275-24*r.known/20}" width="${barWidth}" height="${24*r.known/20}" fill="${r.visible?'#426d8a':'#809caf'}"/>`:''}`,label,'coverage-mark');
    }).join('');
    $('rolling-chart').innerHTML=`<svg viewBox="0 0 ${W} 315" role="group" aria-label="二十年出現比例與逐年視窗覆蓋，點選標記翻閱年份"><defs><pattern id="unformed-hatch" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6L6 0" stroke="#a6bfce"/></pattern></defs>${grid}${paths.map(p=>`<polyline points="${p.join(' ')}" fill="none" stroke="#426d8a" stroke-width="2.5"/>`).join('')}${windows.filter(r=>r.visible).map(r=>link(r.year,`<circle cx="${x(r.year)}" cy="${ry(r.rate)}" r="3" fill="#426d8a"/>`,`${r.start}–${r.end}：${r.occurred}/${r.known}，${(r.rate*100).toFixed(1)}%`)).join('')}<text x="150" y="267" text-anchor="end">視窗資料覆蓋</text>${strip}${axis(300)}</svg><p class="chart-note">小螢幕可左右滑動圖表。每格對應一個結束年。深藍：至少16年可判定；灰藍：不足16年，填色高度表示覆蓋；斜紋：本範圍尚未滿20年。缺資料不當作0%。</p>`;
    $('rolling-table').innerHTML=windows.map(r=>r.unformed?`<tr><td>截至 ${r.year}</td><td>—</td><td>未滿20年</td><td>尚未形成視窗</td></tr>`:`<tr><td>${r.start}–${r.end}</td><td>${r.occurred} / ${r.known}</td><td>20（${r.known/20*100}% 覆蓋）</td><td>${r.visible?(r.rate*100).toFixed(1)+'%':'少於16年，不畫比例'}</td></tr>`).join('');
    const precise=models.filter(m=>m.accepted).length,candidateYears=models.filter(m=>!m.accepted&&m.candidates.length).length;
    $('scatter-caption').textContent=`${rows.length} 個冬季都有標記：精確日期 ${precise} 年，候選日期 ${candidateYears} 年，其餘依資料狀態排在下方。候選與神事不納入精確首次日期統計。`;
    const sy=day=>22+day/121*205,lanes={undated:284,not_observed:316,unknown:348,disputed:380};
    grid=[[0,'12/1'],[31,'1/1'],[62,'2/1'],[90,'3/1 前後'],[120,'3 月底']].map(([d,label])=>`<line x1="${left}" x2="${W-right}" y1="${sy(d)}" y2="${sy(d)}" stroke="#d1dfe8"/><text x="150" y="${sy(d)+5}" text-anchor="end">${label}</text>`).join('');
    grid+=Object.entries(lanes).map(([k,y])=>`<line x1="${left}" x2="${W-right}" y1="${y}" y2="${y}" stroke="#d1dfe8"/><text x="150" y="${y+4}" text-anchor="end">${({undated:'有出現・日期未定',not_observed:'未觀察到',unknown:'紀錄待核',disputed:'年度有無歧異'})[k]}</text>`).join('');
    const marks=models.map(m=>{
      let content,label;
      if(m.accepted){content=`<circle cx="${x(m.year)}" cy="${sy(m.accepted.day)}" r="4" fill="#426d8a"/>`;label=`${m.year}：歷史出現日期 ${m.accepted.date}`;}
      else if(m.candidates.length){label=`${m.year}：候選日期 ${m.candidates.map(e=>e.date_start).join('、')}；尚未定案`;content=m.candidates.map((e,i)=>`<circle cx="${x(m.year)+(i-(m.candidates.length-1)/2)*7}" cy="${sy(C.dayIndex(m.year,e.date_start))}" r="4" fill="#f5f9fc" stroke="#986226" stroke-width="2"><title>${esc(e.date_start)} 候選</title></circle>`).join('');}
      else{const y=lanes[m.lane];label=`${m.year}：${m.lane==='undated'?'有出現，首次日期未定':labels[m.status]}`;content=m.lane==='undated'?`<path d="M${x(m.year)-3} ${y}h6" stroke="#426d8a" stroke-width="4"/>`:m.lane==='disputed'?`<path d="M${x(m.year)} ${y-5}l5 5-5 5-5-5z" fill="#c9985c"/>`:`<circle cx="${x(m.year)}" cy="${y}" r="3.5" fill="${m.lane==='unknown'?'none':'#c4dceb'}" stroke="#617e94" ${m.lane==='unknown'?'stroke-dasharray="2 2"':''}/>`;}
      const hitY=m.accepted?sy(m.accepted.day):m.candidates.length?sy(C.dayIndex(m.year,m.candidates[0].date_start)):lanes[m.lane];
      content=`<rect x="${x(m.year)-barWidth/2}" y="${hitY-12}" width="${barWidth}" height="24" fill="transparent" pointer-events="all"/>`+content;
      return link(m.year,content,label,'year-date-mark');
    }).join('');
    $('date-chart').innerHTML=`<svg viewBox="0 0 ${W} 423" role="group" aria-label="每個冬季的日期或資料狀態，點選標記查看筆記">${grid}<text x="175" y="254" style="font-size:11px">以下為狀態列，沒有日期意義</text>${marks}${axis(408)}</svg>`;
    const icons=[['<circle cx="12" cy="12" r="5" fill="#426d8a"/>','精確出現日期'],['<circle cx="12" cy="12" r="5" fill="#f5f9fc" stroke="#986226" stroke-width="2"/>','候選日期（待核）'],['<path d="M6 12h12" stroke="#426d8a" stroke-width="4"/>','有出現・日期未定'],['<circle cx="12" cy="12" r="5" fill="#c4dceb" stroke="#617e94" stroke-width="1.5"/>','未觀察到'],['<circle cx="12" cy="12" r="5" fill="none" stroke="#617e94" stroke-width="1.5" stroke-dasharray="2 2"/>','紀錄待核'],['<path d="M12 5l7 7-7 7-7-7z" fill="#c9985c"/>','年度有無歧異']];
    $('date-legend').innerHTML=icons.map(([shape,label])=>`<li><svg viewBox="0 0 24 24" aria-hidden="true">${shape}</svg><span>${label}</span></li>`).join('');
  }
  function renderStory(index){state.story=index;const s=stories[index];document.querySelectorAll('[role=tab]').forEach((b,i)=>{b.setAttribute('aria-selected',i===index);b.tabIndex=i===index?0:-1;});$('story-content').setAttribute('aria-labelledby',`tab-${s.id}`);if(s.id==='news'){window.SuwaNews.mount($('story-content'));return;} $('story-content').innerHTML=`<span class="section-number">${esc(s.kind)}</span><h3>${esc(s.title)}</h3>${s.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}${s.shrines?`<div class="shrine-list">${s.shrines.map(([place,gods])=>`<div><strong>${esc(place)}</strong><span>${esc(gods)}</span></div>`).join('')}</div>`:''}${sourceCards(s.source_ids)}`;}
  function exportCSV(){const headers=['winter_year','omiwatari_status','ice_cover_status','first_appearance_date','event_ids','source_ids','source_urls','quality_flags','research_status','notes'];const rows=D.winters.map(w=>[w.winter_year,w.omiwatari_status,w.ice_cover_status,eventsFor(w).find(e=>e.event_type==='first_observed'&&e.date_precision==='day'&&!e.exclude_from_statistics)?.date_start||'',w.events.join(';'),w.source_ids.join(';'),w.source_ids.map(id=>bySource.get(id)?.url||'').filter(Boolean).join(';'),w.quality_flags.join(';'),w.research_status,w.notes.join('；')]);const csv='\uFEFF'+[headers,...rows].map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download='suwa-winters-1877-2026.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  // One source of state for forms, dragging, arrows and range inputs.
  $('year-select').innerHTML=D.winters.map(w=>`<option value="${w.winter_year}">${w.winter_year}</option>`).join('');
  $('day').innerHTML=Array.from({length:31},(_,i)=>`<option value="${i+1}">${i+1} 日</option>`).join('');$('day').value=state.day;
  $('year-slider').addEventListener('input',e=>setYear(e.target.value));$('year-select').addEventListener('change',e=>setYear(e.target.value));
  $('prev-year').onclick=()=>setYear(state.year-1);$('next-year').onclick=()=>setYear(state.year+1);
  $('random-year').onclick=()=>{const known=D.winters.filter(w=>['occurred','not_observed'].includes(w.omiwatari_status)&&w.winter_year!==state.year);setYear(known[Math.floor(Math.random()*known.length)].winter_year);};
  ['month','day','nights'].forEach(id=>$(id).addEventListener('change',e=>{state[id]=Number(e.target.value);renderStay();}));
  $('prev-day').onclick=()=>moveArrival(-1);$('next-day').onclick=()=>moveArrival(1);
  $('arrival-slider').addEventListener('input',e=>setArrival(C.add(`${state.year-1}-12-01`,Number(e.target.value))));
  const calendar=$('calendar');
  calendar.addEventListener('pointerdown',e=>{const cell=e.target.closest('.calendar-day.selected');if(!cell||e.button!==0)return;drag={id:e.pointerId,x:e.clientX,width:calendar.getBoundingClientRect().width/11,start:C.winterDate(state.year,state.month,state.day),delta:0};calendar.setPointerCapture(e.pointerId);});
  calendar.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;drag.delta=Math.round((e.clientX-drag.x)/drag.width);calendar.classList.toggle('dragging',Math.abs(e.clientX-drag.x)>4);calendar.style.setProperty('--drag-px',`${Math.max(-120,Math.min(120,e.clientX-drag.x))}px`);});
  function endDrag(e,cancelled){if(!drag||e.pointerId!==drag.id)return;const d=drag;drag=null;calendar.classList.remove('dragging');calendar.releasePointerCapture(e.pointerId);if(!cancelled&&Math.abs(e.clientX-d.x)>4){suppressClick=true;const min=`${state.year-1}-12-01`,max=C.add(`${state.year}-03-31`,-state.nights);const next=C.add(d.start,d.delta);setArrival(next<min?min:next>max?max:next);setTimeout(()=>{suppressClick=false;},0);}}
  calendar.addEventListener('pointerup',e=>endDrag(e,false));calendar.addEventListener('pointercancel',e=>endDrag(e,true));
  calendar.addEventListener('click',e=>{if(suppressClick)return;const cell=e.target.closest('[data-date]');if(cell&&!cell.disabled){const date=cell.dataset.date;setArrival(date);if(e.detail===0)calendar.querySelector(`[data-date="${date}"]`)?.focus();}});
  document.addEventListener('click',e=>{const link=e.target.closest('[data-event]');if(link)showEvent(link.dataset.event);const year=e.target.closest('[data-year]');if(year){setYear(year.dataset.year);$('winter-heading').scrollIntoView({block:'start'});}});
  $('close-dialog').onclick=()=>$('event-dialog').close();$('event-dialog').addEventListener('click',e=>{if(e.target===$('event-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
  $('stats-period').onchange=renderStats;$('export-csv').onclick=exportCSV;
  const header=document.querySelector('.site-header'),navLinks=[...document.querySelectorAll('[data-section]')];
  const sizeHeader=()=>document.documentElement.style.setProperty('--header-height',`${header.getBoundingClientRect().height}px`);
  new ResizeObserver(sizeHeader).observe(header);sizeHeader();
  function markSection(id){navLinks.forEach(a=>a.dataset.section===id?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'));}
  navLinks.forEach(a=>a.onclick=e=>{
    e.preventDefault();const id=a.dataset.section,target=$(id);
    if(target.tagName==='DETAILS')target.open=true;
    if(id==='notes-section')$('year-notes').open=true;
    markSection(id);history.replaceState(null,'','#'+id);
    requestAnimationFrame(()=>{target.tabIndex=-1;target.focus({preventScroll:true});target.scrollIntoView({block:'start'});});
  });
  let navFrame;
  addEventListener('scroll',()=>{if(navFrame)return;navFrame=requestAnimationFrame(()=>{
    navFrame=null;const top=header.getBoundingClientRect().bottom;
    const visible=navLinks.map(a=>({a,r:$(a.dataset.section).getBoundingClientRect()})).map(v=>({...v,area:Math.max(0,Math.min(v.r.bottom,innerHeight)-Math.max(v.r.top,top))})).filter(v=>v.area>0).sort((a,b)=>b.area-a.area);
    const selected=visible.find(v=>v.a.hasAttribute('aria-current'));
    const best=selected&&((selected.r.top>=top&&selected.r.bottom<=innerHeight)||Math.abs(selected.r.top-visible[0].r.top)<2)?selected:visible[0];
    markSection(best?.a.dataset.section||'');
  });},{passive:true});
  if(['archive','stories'].includes(location.hash.slice(1)))$(location.hash.slice(1)).open=true;
  $('year-grid').innerHTML=D.winters.map(w=>`<button class="year-cell ${w.omiwatari_status}${w.quality_flags.includes('first_date_disputed')?' has-date-dispute':''}" data-year="${w.winter_year}" aria-label="${w.winter_year} 年，${labels[w.omiwatari_status]}${w.quality_flags.includes('first_date_disputed')?'，日期有歧異':''}" title="${w.winter_year} ${labels[w.omiwatari_status]}${w.quality_flags.includes('first_date_disputed')?'／日期有歧異':''}" aria-pressed="false">${w.winter_year}</button>`).join('');
  $('annual-dispute-legend').hidden=!D.winters.some(w=>w.omiwatari_status==='disputed');
  $('coverage-intro').textContent=`150 個冬季中，${D.coverage.known_outcomes} 年已找到年度結果，${D.coverage.unknown_years.length} 年仍待補核。歷史彙編、現代觀測與地方回顧的精確程度不同，逐年筆記會說明。`;
  $('coverage-details').innerHTML=`<p>整理日期：${D.coverage.as_of}。精確出現日 ${D.coverage.precise_appearance_years} 年；可靠連續可見期間 ${D.coverage.visible_interval_years} 年。</p><ul>${D.coverage.gaps.map(g=>`<li>${esc(g)}</li>`).join('')}</ul><p>${esc(D.coverage.method)}</p><h3>查找過的研究入口</h3>${sourceCards(D.coverage.search_log.map(s=>s.source_id))}`;
  document.querySelector('.story-tabs').innerHTML=stories.map((s,i)=>`<button role="tab" id="tab-${s.id}" aria-controls="story-content" data-story="${i}">${esc(s.tab)}</button>`).join('');
  document.querySelector('.story-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-story]');if(b)renderStory(Number(b.dataset.story));});
  document.querySelector('.story-tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();const i=e.key==='Home'?0:e.key==='End'?stories.length-1:(state.story+(['ArrowLeft','ArrowUp'].includes(e.key)?-1:1)+stories.length)%stories.length;renderStory(i);$(`tab-${stories[i].id}`).focus();});
  const tips={male:['同一個冬季的十二月，要翻到前一個西元年。','神事日與冰脊出現的日子，可能相隔幾天。','帳本留白時，我們就讓它留白。'],female:['先在岸邊坐一會兒，湖面有許多種冬天。','沒有御神渡，也可能遇見結冰的湖。','兩個有照片的日子，中間仍有我們不知道的事。']};
  ['male','female'].forEach(id=>{let n=0;$(id).onclick=()=>{$('companion-message').textContent=tips[id][n++%tips[id].length];$('companion-message').hidden=false;};});
  $('edition').textContent=`本機觀測冊 · 資料整理 ${D.coverage.as_of} · 不預測下一個冬季`;
  renderStory(0);renderStats();renderYear();
})();
