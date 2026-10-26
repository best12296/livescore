export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, OPTIONS","Access-Control-Allow-Headers":"*"};
    if(request.method==="OPTIONS") return new Response(null,{headers:cors});
    const API_KEY = "98a19520b228fd8dcff8459b07f0d569";
    async function api(path){
      let r=await fetch("https://v3.football.api-sports.io/"+path,{headers:{"x-apisports-key":API_KEY}});
      return await r.json();
    }
    const cache=caches.default;
    // auto detect season: 2026/27 = 2026
    function getSeason(){ let d=new Date(); return d.getMonth()>=6?d.getFullYear():d.getFullYear()-1; }

    if(url.pathname==="/api/matches"){
      const dateParam=url.searchParams.get("date")||"live";
      const ck=new Request("https://cache.local/M2-"+dateParam);
      if(url.searchParams.get("refresh")!=="1"){
        let c=await cache.match(ck); if(c) return new Response(await c.text(),{headers:{...cors,"Content-Type":"application/json"}});
      }
      let j;
      if(dateParam==="live"||dateParam==="today"){
        j=await api("fixtures?live=all");
        if(!j.response.length){ j=await api("fixtures?date="+new Date().toISOString().slice(0,10)); }
      }else{ j=await api("fixtures?date="+dateParam); }
      const data=(j.response||[]).map(f=>({
        fixtureId:f.fixture?.id, country:(f.league?.country||"WORLD").toUpperCase(),
        league:f.league?.name||"", leagueId:f.league?.id, season:getSeason(),
        hasStandings:true, teamHomeId:f.teams?.home?.id, teamAwayId:f.teams?.away?.id,
        timestamp:f.fixture?.timestamp, status:f.fixture?.status?.short||"NS",
        elapsed:f.fixture?.status?.elapsed||"", home:f.teams?.home?.name||"",
        away:f.teams?.away?.name||"", score:(f.goals?.home??0)+"-"+(f.goals?.away??0),
        ht:(f.score?.halftime?.home??"-")+"-"+(f.score?.halftime?.away??"-"),
        ft:(f.score?.fulltime?.home??f.goals?.home??0)+"-"+(f.score?.fulltime?.away??f.goals?.away??0),
      }));
      const txt=JSON.stringify({count:data.length,data});
      ctx.waitUntil(cache.put(ck,new Response(txt,{headers:{"Content-Type":"application/json","Cache-Control":"max-age=600"}})));
      return new Response(txt,{headers:{...cors,"Content-Type":"application/json"}});
    }
    if(url.pathname==="/api/events"){
      const id=url.searchParams.get("fixture"); const ck=new Request("https://cache.local/E2-"+id);
      let c=await cache.match(ck); if(c) return new Response(await c.text(),{headers:{...cors,"Content-Type":"application/json"}});
      let j=await api("fixtures/events?fixture="+id); let txt=JSON.stringify(j);
      ctx.waitUntil(cache.put(ck,new Response(txt,{headers:{"Content-Type":"application/json","Cache-Control":"max-age=600"}})));
      return new Response(txt,{headers:{...cors,"Content-Type":"application/json"}});
    }
    if(url.pathname==="/api/lineups"){
      const id=url.searchParams.get("fixture"); const ck=new Request("https://cache.local/L2-"+id);
      let c=await cache.match(ck); if(c) return new Response(await c.text(),{headers:{...cors,"Content-Type":"application/json"}});
      let j=await api("fixtures/lineups?fixture="+id); let txt=JSON.stringify(j);
      ctx.waitUntil(cache.put(ck,new Response(txt,{headers:{"Content-Type":"application/json","Cache-Control":"max-age=1800"}})));
      return new Response(txt,{headers:{...cors,"Content-Type":"application/json"}});
    }
    if(url.pathname==="/api/h2h"){
      const h2h=url.searchParams.get("h2h"); const ck=new Request("https://cache.local/H2-"+h2h);
      let c=await cache.match(ck); if(c) return new Response(await c.text(),{headers:{...cors,"Content-Type":"application/json"}});
      let j=await api("fixtures/headtohead?h2h="+h2h+"&last=5"); let txt=JSON.stringify(j);
      ctx.waitUntil(cache.put(ck,new Response(txt,{headers:{"Content-Type":"application/json","Cache-Control":"max-age=3600"}})));
      return new Response(txt,{headers:{...cors,"Content-Type":"application/json"}});
    }
    if(url.pathname==="/api/standings"){
      const league=url.searchParams.get("league"); 
      const season=url.searchParams.get("season")||getSeason();
      const ck=new Request("https://cache.local/S2-"+league+"-"+season);
      let c=await cache.match(ck); if(c) return new Response(await c.text(),{headers:{...cors,"Content-Type":"application/json"}});
      let j=await api("standings?league="+league+"&season="+season);
      let txt=JSON.stringify(j);
      ctx.waitUntil(cache.put(ck,new Response(txt,{headers:{"Content-Type":"application/json","Cache-Control":"max-age=3600"}})));
      return new Response(txt,{headers:{...cors,"Content-Type":"application/json"}});
    }

    return new Response(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND</title><style>
body{margin:0;background:#000;color:#fff;font-family:Arial;font-weight:700}
header{position:sticky;top:0;background:#000;padding:10px;border-bottom:2px solid #0f0;z-index:99}
.dates{display:flex;gap:8px;overflow-x:auto;margin-top:10px}.d{border:1px solid #333;background:#111;color:#888;padding:8px 14px;border-radius:20px;font-size:12px;cursor:pointer;white-space:nowrap}.d.active{background:#0f0;color:#000}
.filters{display:flex;gap:8px;margin-top:12px}.f{border:1px solid #333;background:#111;color:#888;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer}.f.active{background:#fff;color:#000}
.refresh{margin-left:auto;background:#000;border:1px solid #0f0;color:#0f0;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;font-weight:900}
.country{background:#0f0;color:#000;padding:11px 12px;margin-top:12px;display:flex;justify-content:space-between;cursor:pointer}
.card{background:#111;border:1px solid #222;margin:6px 8px;border-radius:10px;padding:12px;display:flex;justify-content:space-between;cursor:pointer}
.card.live{border-left:4px solid #0f0;background:#0f2b0f}
.time{font-size:12px;min-width:58px;text-align:center;padding:6px 8px;border-radius:20px}.time.ns{color:#0f0;background:#000;border:1px solid #0f0}.time.live{color:#000;background:#0f0}
#modal{position:fixed;inset:0;background:rgba(0,0,0,0.92);display:none;z-index:999;align-items:flex-end}#modal.show{display:flex}.modal-box{background:#151515;width:100%;max-height:90vh;overflow:auto;border-radius:20px 20px 0 0;border-top:2px solid #0f0;padding:16px}
.tabBar{display:flex;gap:6px;overflow-x:auto;margin-bottom:14px}.ev{padding:8px 0;border-bottom:1px solid #222;font-size:13px;display:flex;justify-content:space-between}
table th{color:#888;font-size:11px} table td{font-size:12px;padding:7px 2px}
</style></head><body>
<header><b style="color:#0f0">DIAMOND LIVESCORE</b><div class="dates" id="dates"></div><div class="filters"><div class="f active" id="f-all">All</div><div class="f" id="f-live">Live</div><div class="f" id="f-ft">Finished</div><div class="refresh" id="refreshBtn">Refresh</div></div></header>
<div id="list"></div><div id="modal"><div class="modal-box" id="modalBox"></div></div>
<script>
let list=document.getElementById('list'),datesEl=document.getElementById('dates'),allData=[],currentFilter='all',selectedKey='live',cacheStore={},currentMatch=null;
function fmtDate(d){return d.toISOString().slice(0,10)}
function dayLabel(d,i){const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];if(i===0)return 'Today';return days[d.getDay()]+' '+String(d.getDate()).padStart(2,'0');}
function buildDates(){datesEl.innerHTML='';let t=new Date();for(let i=-1;i<=1;i++){let dt=new Date();dt.setDate(t.getDate()+i);let b=document.createElement('div');b.className='d'+(i===0?' active':'');b.textContent=dayLabel(dt,i);let k=i===0?'live':fmtDate(dt);b.dataset.key=k;b.onclick=()=>{document.querySelectorAll('.d').forEach(x=>x.classList.remove('active'));b.classList.add('active');selectedKey=k;load(k,false);};datesEl.appendChild(b);}}
function getTime(m){if(m.elapsed) return m.elapsed+"'";if(!m.timestamp) return '';let x=new Date(m.timestamp*1000);x.setHours(x.getHours()+1);return x.toISOString().slice(11,16);}
function timeClass(m){return m.elapsed?'time live':'time ns';}
function sc(m){if(m.status==='NS') return '<div class="score" style="color:#555">VS</div>';return '<div class="score" style="font-size:18px">'+m.score+'</div>';}
function setFilter(t){currentFilter=t;document.querySelectorAll('.filters .f').forEach(x=>x.classList.remove('active'));document.getElementById('f-'+t).classList.add('active');render(allData);}
document.getElementById('f-all').onclick=()=>setFilter('all');document.getElementById('f-live').onclick=()=>setFilter('live');document.getElementById('f-ft').onclick=()=>setFilter('ft');
document.getElementById('refreshBtn').onclick=()=>load(selectedKey,true);
async function load(k,f){
  if(!f&&cacheStore[k]){allData=cacheStore[k];render(allData);return;}
  list.innerHTML='<div style="text-align:center;padding:30px;color:#0f0">Loading...</div>';
  let r=await fetch('/api/matches?date='+k+(f?'&refresh=1':'')); let j=await r.json();
  if(j.count===0){ list.innerHTML='<div style="text-align:center;padding:60px 20px;color:#333">No matches available</div>'; return; }
  cacheStore[k]=j.data||[];allData=cacheStore[k];render(allData);
}
function render(data){
  let fd=data; if(currentFilter==='live') fd=data.filter(m=>m.elapsed&&m.status!=='FT'); if(currentFilter==='ft') fd=data.filter(m=>m.status==='FT');
  if(!fd.length){ list.innerHTML='<div style="text-align:center;padding:60px 20px;color:#333">No '+currentFilter+' matches</div>'; return; }
  let h='',last=''; for(let m of fd){let key=m.country+' - '+m.league; if(key!==last){if(last!=='') h+='</div>'; let tb='<span class="standingsBtn" style="background:#fff;color:#000;padding:3px 8px;border-radius:10px;font-size:10px;margin-left:6px" data-league="'+m.leagueId+'" data-season="'+m.season+'">TABLE</span>'; h+='<div class="country"><span>'+key+tb+'</span><span>▼</span></div><div class="league-group">'; last=key;} let idx=allData.indexOf(m); let cls=m.elapsed?'card live':'card'; h+='<div class="'+cls+'" data-i="'+idx+'"><div style="display:flex;gap:10px;align-items:center"><div class="'+timeClass(m)+'">'+getTime(m)+'</div><div><div>'+m.home+'</div><div>'+m.away+'</div></div></div><div>'+sc(m)+'</div></div>';} if(last!=='') h+='</div>'; list.innerHTML=h;
  document.querySelectorAll('.country').forEach(el=>{el.onclick=(e)=>{if(e.target.classList.contains('standingsBtn'))return; let g=el.nextElementSibling; g.style.display=g.style.display==='none'?'block':'none';}});
  document.querySelectorAll('.card').forEach(el=>{el.onclick=()=>openMatch(parseInt(el.dataset.i))});
  document.querySelectorAll('.standingsBtn').forEach(b=>{b.onclick=(e)=>{e.stopPropagation(); openMatchByData({leagueId:b.dataset.league,season:b.dataset.season,hasStandings:true},'standings');}});
}
function openMatch(i){currentMatch=allData[i]; openMatchByData(currentMatch,'events');}
function openMatchByData(m,def){
  currentMatch=m;
  let box=document.getElementById('modalBox');
  box.innerHTML='<div style="display:flex;justify-content:space-between;margin-bottom:10px"><b style="color:#0f0">'+(m.home?m.home+' vs '+m.away:'Standings 2026/27')+'</b><div style="background:#222;padding:6px 12px;border-radius:20px;cursor:pointer" onclick="document.getElementById(\\'modal\\').classList.remove(\\'show\\')">Close</div></div><div class="tabBar"><div class="f active" data-tab="events">🟥🟨 Cards</div><div class="f" data-tab="lineup">Lineup</div><div class="f" data-tab="h2h">H2H</div><div class="f" data-tab="standings" style="background:#0f0;color:#000">Table 26/27</div></div><div id="tabContent">Loading...</div>';
  document.getElementById('modal').classList.add('show');
  box.querySelectorAll('.tabBar .f').forEach(t=>{t.onclick=()=>{box.querySelectorAll('.tabBar .f').forEach(x=>x.classList.remove('active')); t.classList.add('active'); loadTab(t.dataset.tab);}});
  loadTab(def);
}
async function loadTab(tab){
  let m=currentMatch; let el=document.getElementById('tabContent'); el.innerHTML='Loading...';
  if(tab==='events'){
    let r=await fetch('/api/events?fixture='+m.fixtureId); let j=await r.json(); let ev=j.response||[];
    if(!ev.length){ el.innerHTML='<div style="color:#666;text-align:center;padding:20px">No cards/goals yet<br>FT: '+m.ft+' HT: '+m.ht+'</div>'; return; }
    el.innerHTML=ev.map(e=>{let icon=e.type==='Card'?(e.detail.includes('Red')?'🟥 RED':'🟨 YELLOW'):e.type==='Goal'?'⚽ GOAL':e.type; return '<div class="ev"><span>'+e.time.elapsed+"' "+e.player.name+' ('+e.team.name+')</span><b style="color:'+(icon.includes('RED')?'red':icon.includes('YELLOW')?'#ffcc00':'#0f0')+'">'+icon+'</b></div>';}).join('');
  }
  if(tab==='lineup'){
    let r=await fetch('/api/lineups?fixture='+m.fixtureId); let j=await r.json(); if(!j.response.length){ el.innerHTML='<div style="color:#666;text-align:center;padding:20px">Lineups not yet out</div>'; return; }
    el.innerHTML=j.response.map(tm=>'<b style="color:#0f0">'+tm.team.name+' '+tm.formation+'</b><br>'+tm.startXI.map(p=>p.player.number+'. '+p.player.name).join('<br>')).join('<hr>');
  }
  if(tab==='h2h'){
    let h2h=m.teamHomeId+'-'+m.teamAwayId; let r=await fetch('/api/h2h?h2h='+h2h); let j=await r.json();
    el.innerHTML=(j.response||[]).map(f=>'<div class="ev"><span>'+new Date(f.fixture.date).toLocaleDateString()+'</span><span>'+f.teams.home.name+' '+f.goals.home+'-'+f.goals.away+' '+f.teams.away.name+'</span></div>').join('')||'No H2H';
  }
  if(tab==='standings'){
    let r=await fetch('/api/standings?league='+m.leagueId+'&season='+m.season); let j=await r.json();
    let t=j.response[0]?.league?.standings[0]||[];
    if(!t.length){ el.innerHTML='<div style="color:#666;text-align:center;padding:20px">No table - Cup game</div>'; return; }
    // EXACT LIKE FLASHSCORE: # Team MP W D L G PTS
    el.innerHTML='<div style="background:#0f0;color:#000;padding:8px;font-size:12px">Football » England: Premier League » Standings 26/27</div><table style="width:100%;border-collapse:collapse;margin-top:8px"><tr><th>#</th><th style="text-align:left">Team</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>G</th><th>PTS</th></tr>'+t.map(x=>'<tr style="border-bottom:1px solid #222"><td>'+x.rank+'.</td><td style="text-align:left;padding:6px 0">'+x.team.name+'</td><td>'+x.all.played+'</td><td>'+x.all.win+'</td><td>'+x.all.draw+'</td><td>'+x.all.lose+'</td><td>'+x.all.goals.for+':'+x.all.goals.against+'</td><td><b style="color:#0f0">'+x.points+'</b></td></tr>').join('')+'</table>';
  }
}
buildDates();load('live',false);
</script></body></html>`,{headers:{...cors,"Content-Type":"text/html"}});
  }
}
