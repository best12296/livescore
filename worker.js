const API_KEY = "98a19520b228fd8dcff8459b07f0d569"; // your new 0% key

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // API ROUTE - with 5 minutes cache
    if (url.pathname === "/api") {
      const date = url.searchParams.get("date") || new Date().toISOString().split('T')[0];
      const cacheKey = new Request(`https://cache-${date}`, request);
      const cache = caches.default;
      let response = await cache.match(cacheKey);
      
      if (!response) {
        const apiRes = await fetch(`https://v3.football.api-sports.io/fixtures?date=${date}`, {
          headers: { "x-apisports-key": API_KEY }
        });
        const data = await apiRes.json();
        
        response = new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=300" }
        });
        ctx.waitUntil(cache.put(cacheKey, response.clone()));
      }
      return response;
    }

    // FRONTEND - Fast HTML
    return new Response(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE</title>
<style>
body{background:#0e0e0e;color:#fff;font-family:Arial;margin:0;padding:10px}
h1{color:#00ff00;margin:5px 0}
.tabs{display:flex;gap:8px;overflow:auto;margin:10px 0}
.tab{padding:8px 16px;border-radius:20px;background:#222;border:1px solid #333;color:#fff;white-space:nowrap;cursor:pointer}
.tab.active{background:#00ff00;color:#000;font-weight:bold}
.filters{display:flex;gap:8px;margin-bottom:10px}
.f{padding:6px 14px;border-radius:20px;border:1px solid #00ff00;background:#000;color:#00ff00;cursor:pointer}
.f.active{background:#00ff00;color:#000}
.league{background:#00ff00;color:#000;padding:8px;font-weight:bold;margin:12px 0 5px 0;display:flex;justify-content:space-between}
.match{background:#1a1a1a;padding:10px;border-radius:12px;margin-bottom:8px;display:flex;align-items:center;gap:10px}
.time{border:1px solid #00ff00;color:#00ff00;padding:4px 12px;border-radius:20px;font-weight:bold;min-width:50px;text-align:center;background:#000}
.time.live{background:#00ff00;color:#000}
.team{flex:1}
.score{font-weight:bold;font-size:18px;text-align:right}
.ft{font-size:12px;background:#333;padding:2px 10px;border-radius:10px;text-align:center}
</style>
</head>
<body>
<h1>DIAMOND LIVESCORE</h1>
<div class="tabs" id="tabs"></div>
<div class="filters">
<div class="f active" onclick="filter='all';load()">All Games</div>
<div class="f" onclick="filter='live';load()">Live</div>
<div class="f" onclick="filter='ft';load()">Finished</div>
<div class="f" style="margin-left:auto" onclick="load(true)">Refresh</div>
</div>
<div id="games">Loading...</div>
<script>
let filter='all';
let dates=[];
for(let i=-2;i<=3;i++){let d=new Date();d.setDate(d.getDate()+i);dates.push(d)}
let selected = new Date().toISOString().split('T')[0];

function renderTabs(){
  const c=document.getElementById('tabs');c.innerHTML='';
  dates.forEach(d=>{
    const iso=d.toISOString().split('T')[0];
    const label = iso===new Date().toISOString().split('T')[0]?'Today':d.toLocaleDateString('en',{weekday:'short'})+' '+d.getDate();
    const div=document.createElement('div');
    div.className='tab'+(iso===selected?' active':'');
    div.textContent=label;
    div.onclick=()=>{selected=iso;renderTabs();load()};
    c.appendChild(div);
  })
}
async function load(force=false){
  const box=document.getElementById('games');
  if(!force && window.cache && window.cache[selected]){render(window.cache[selected]);return}
  box.innerHTML='Loading...';
  const res=await fetch('/api?date='+selected);
  const data=await res.json();
  if(!window.cache)window.cache={};
  window.cache[selected]=data;
  render(data);
}
function render(data){
  const box=document.getElementById('games');
  let html='';
  const groups={};
  (data.response||[]).forEach(m=>{
    const l=m.league.name; const c=m.league.country+' - '+l;
    if(!groups[c])groups[c]=[];groups[c].push(m);
  });
  for(let league in groups){
    let matches=groups[league];
    if(filter==='live')matches=matches.filter(m=>m.fixture.status.short==='1H'||m.fixture.status.short==='2H'||m.fixture.status.short==='HT');
    if(filter==='ft')matches=matches.filter(m=>m.fixture.status.short==='FT');
    if(matches.length===0)continue;
    html+='<div class="league"><span>'+league+'</span><span>★</span></div>';
    matches.forEach(m=>{
      const time = m.fixture.status.short==='FT'||m.fixture.status.short==='1H'||m.fixture.status.short==='2H' ? m.fixture.status.elapsed+"'": new Date(m.fixture.date).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
      const isLive = ['1H','2H','HT'].includes(m.fixture.status.short);
      html+='<div class="match"><div class="time '+(isLive?'live':'')+'">'+time+'</div><div class="team">'+m.teams.home.name+'<br>'+m.teams.away.name+'</div><div class="score">'+(m.goals.home!=null?m.goals.home+' - '+m.goals.away:'')+'<div class="ft">'+m.fixture.status.short+'</div></div></div>';
    })
  }
  box.innerHTML=html||'No games';
}
renderTabs();load();
</script>
</body>
</html>`, { headers: { "Content-Type": "text/html" } });
  }
}
