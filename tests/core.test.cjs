const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const C=require('../dist/core.js');
const read=name=>JSON.parse(fs.readFileSync(path.join(__dirname,'../data',name+'.json'),'utf8'));
const winters=read('winters'),events=read('events'),sources=read('sources'),coverage=read('coverage');
test('Four nights includes arrival and departure, across calendar years',()=>{
 const s=C.span(2018,12,30,4);
 assert.equal(s.start,'2017-12-30');assert.equal(s.end,'2018-01-03');assert.equal(s.days.length,5);
 assert.equal(C.dayIndex(2018,'2018-01-01'),31);
});
test('Impossible dates stay invalid; leap day is not silently moved',()=>{
 assert.match(C.span(2018,2,29,4).error,/沒有/);
 assert.equal(C.span(2020,2,29,2).end,'2020-03-02');
 assert.equal(C.span(1900,2,29,2).error.includes('沒有'),true);
 assert.equal(C.span(2000,2,29,2).end,'2000-03-02');
 assert.ok(C.span(2018,3,30,4).error);assert.ok(C.span(2018,4,1,4).error);
 assert.equal(C.parse('2018-02-30'),null);
});
test('Unknown and disputed are not counted as failures',()=>{
 const s=C.summary(['occurred','not_observed','unknown','disputed'].map(omiwatari_status=>({omiwatari_status})));
 assert.deepEqual([s.occurred,s.known,s.total,s.rate],[1,2,4,.5]);
});
test('Rolling windows contain consecutive years, keep gaps, and require 16 known',()=>{
 const rows=Array.from({length:21},(_,i)=>({winter_year:2000+i,omiwatari_status:i<16?'occurred':'unknown'}));
 const r=C.rolling(rows);assert.equal(r.length,2);assert.equal(r[0].total,20);assert.equal(r[0].visible,true);assert.equal(r[1].known,15);assert.equal(r[1].visible,false);
 const sparse=C.rolling(rows.filter(r=>r.winter_year!==2005));assert.equal(sparse[0].total,20);assert.equal(sparse[0].known,15);
});
test('2018 conflicting appearance claims are excluded; February 5 remains ceremony',()=>{
 const points=C.preciseAppearance(winters,events),claims=events.filter(e=>e.winter_year===2018&&e.event_type==='first_observed');
 assert.equal(points.some(p=>p.year===2018),false);assert.deepEqual(claims.map(e=>e.date_start).sort(),['2018-02-01','2018-02-02']);assert.equal(events.find(e=>e.winter_year===2018&&e.event_type==='ceremony').date_start,'2018-02-05');
 assert.equal(C.relation(claims[0],C.span(2018,2,3,4)),'before');
});
test('Sighting points do not make a continuous visibility interval',()=>{
 const e=events.find(e=>e.winter_year===2018&&e.event_type==='sighting'&&e.date_start==='2018-02-04');
 assert.equal(e.date_end,'2018-02-04');assert.equal(C.relation(e,C.span(2018,2,5,2)),'before');
 assert.deepEqual(winters.find(w=>w.winter_year===2018).visibility_intervals,[]);
 assert.equal(C.relation(events.find(e=>e.event_type==='personal_sighting'),C.span(2025,1,10,4)),'unknown');
});
test('2026 no Omiwatari does not mean no full freeze; event date differs from publication',()=>{
 const w=winters.find(w=>w.winter_year===2026),e=events.find(e=>e.winter_year===2026&&e.event_type==='declaration');
 assert.equal(w.omiwatari_status,'not_observed');assert.equal(w.ice_cover_status,'complete_observed');
 assert.equal(e.date_start,'2026-02-04');assert.equal(sources.find(s=>s.id==='suwa2026').published_date,'2026-02-06');
});
test('Historical December belongs to the preceding year; ceremony excluded from appearance scatter',()=>{
 const p=C.preciseAppearance(winters,events);
 assert.equal(p.find(p=>p.year===1936).date,'1935-12-31');
 assert.equal(p.some(p=>p.year===1923),false);
});
test('All source and event references resolve; reported coverage equals real data',()=>{
 assert.equal(winters.length,150);assert.equal(new Set(winters.map(w=>w.winter_year)).size,150);
 for(const [i,w] of winters.entries()){
  assert.equal(w.winter_year,1877+i);
  for(const id of w.events)assert.equal(events.find(e=>e.id===id)?.winter_year,w.winter_year);
  for(const id of w.source_ids)assert.ok(sources.some(s=>s.id===id));
 }
 for(const e of events){
  for(const id of e.source_ids)assert.ok(sources.some(s=>s.id===id));
  if(e.date_start){assert.ok(C.parse(e.date_start));assert.ok(e.date_start>=`${e.winter_year-1}-12-01`&&e.date_start<=`${e.winter_year}-03-31`);}
 }
 assert.equal(C.summary(winters).known,coverage.known_outcomes);
 assert.equal(C.preciseAppearance(winters,events).length,coverage.precise_appearance_years);
 assert.equal(winters.filter(w=>w.visibility_intervals.length).length,coverage.visible_interval_years);
});
const Charts=require('../dist/charts.js');
test('Reviewed research adopts only three annual results; all 31 candidates remain unknown',()=>{
 const candidates=read('candidates'),decisions=read('research-decisions');
 assert.equal(candidates.length,31);assert.equal(decisions.decisions.length,39);
 assert.equal(new Set(candidates.map(c=>c.winter_year)).size,31);
 for(const c of candidates)assert.equal(winters.find(w=>w.winter_year===c.winter_year).omiwatari_status,'unknown');
 for(const y of [1987,1988,1989])assert.equal(winters.find(w=>w.winter_year===y).omiwatari_status,'not_observed');
 assert.equal(C.summary(winters).known,119);assert.equal(C.preciseAppearance(winters,events).length,27);
});
test('Every winter has exactly one chart model; unknown and no-event have separate lanes',()=>{
 const models=Charts.dates(winters,events);
 assert.equal(models.length,150);assert.equal(new Set(models.map(m=>m.year)).size,150);
 assert.equal(models.find(m=>m.year===1960).lane,'unknown');assert.equal(models.find(m=>m.year===2026).lane,'not_observed');
 assert.equal(models.find(m=>m.year===2012).lane,'undated');assert.equal(models.find(m=>m.year===2013).lane,'undated');
 assert.equal(models.find(m=>m.year===2018).candidates.length,2);assert.equal(models.find(m=>m.year===2004).candidates.length,2);
});
test('Coverage markers include first nineteen unformed windows and sparse windows without rates',()=>{
 const models=Charts.windows(winters);
 assert.equal(models.length,150);assert.equal(models.filter(m=>m.unformed).length,19);
 assert.equal(models.find(m=>m.year===1965).visible,false);assert.equal(models[0].rate,undefined);
});
test('Ambiguous 2013 date text and 2012 confirmation never enter first-date calculations',()=>{
 const ambiguous=events.find(e=>e.winter_year===2013&&e.event_type==='sighting');
 assert.equal(ambiguous.date_start,null);assert.equal(C.relation(ambiguous,C.span(2013,1,22,4)),'unknown');
 assert.equal(C.preciseAppearance(winters,events).some(p=>[2012,2013,2004].includes(p.year)),false);
});
