/* Pure chart models keep unknown outcomes and unresolved dates out of statistics. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./core.js'));else root.SuwaCharts=factory(root.SuwaCore);})(globalThis,function(C){
  function dates(winters,events){
    const accepted=new Map(C.preciseAppearance(winters,events).map(p=>[p.year,p]));
    return winters.map(w=>{
      const candidates=events.filter(e=>e.winter_year===w.winter_year&&e.event_type==='first_observed'&&e.exclude_from_statistics&&e.date_precision==='day'&&C.parse(e.date_start));
      return {year:w.winter_year,status:w.omiwatari_status,accepted:accepted.get(w.winter_year)||null,
        candidates:w.omiwatari_status==='occurred'?candidates:[],
        lane:w.omiwatari_status==='occurred'?(accepted.has(w.winter_year)||candidates.length?'dated':'undated'):w.omiwatari_status};
    });
  }
  function windows(winters){const map=new Map(C.rolling(winters).map(r=>[r.end,r]));return winters.map(w=>({year:w.winter_year,...(map.get(w.winter_year)||{visible:false,unformed:true})}));}
  return {dates,windows};
});
