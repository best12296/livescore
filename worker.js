const API_KEY = "98a19520b228fd8dcff8459b07f0d569";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api") {
      const date = url.searchParams.get("date");
      const cacheKey = new Request("https://cache.live/"+date, request);
      const cache = caches.default;
      let res = await cache.match(cacheKey);
      if (!res) {
        const api = await fetch(`https://v3.football.api-sports.io/fixtures?date=${date}`, {
          headers: { "x-apisports-key": API_KEY }
        });
        const data = await api.json();
        res = new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=300" }
        });
        ctx.waitUntil(cache.put(cacheKey, res.clone()));
      }
      return res;
    }

    return new Response(`<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE</title>
<style>
*{box-sizing:border-box}
body{background:#000;color:#fff;font-family:Arial;margin:0;padding:10px}
h1{color:#00ff00;font-size:24px;margin:5px 0 12px 2px;font-weight:900}
.tabs{display:flex;gap:10px;overflow-x:auto;padding-bottom:5px}
.tab{padding:10px 18px;border-radius:25px;background:#1e1e1e;color:#888;border:1px solid #333;white-space:nowrap;cursor:pointer;font-weight:600}
.tab.active{background:#00ff00;color:#000;border-color:#00ff00}
.filters{display:flex;gap:10px;margin:12px 0;overflow-x:auto}
.f{padding:8px 16px;border-radius:20px;background:#1e1e1e;color:#888;border:1px solid #333;cursor:pointer;white-space:nowrap}
.f.active{background:#fff;color:#000;border-color:#fff}
.f.refresh{border:1px solid #00ff00;color:#00ff00;background:#000;margin-left:auto}
.f.refresh.active{background:#00ff00;color:#000}
.line{height:3px;background:#00ff00;margin:10px -10px}
.match{background:#121212;border-radius:12px;padding:12px;margin:8px 0;display:flex;align-items:center;gap:12px}
.time{border:1px solid #00ff00;color:#00ff00;padding:5px 12px;border-radius:20px;min-width:65px;text-align:center;font-weight:bold;background:#000}
.time.live{background:#00ff00;color:#000}
.team{flex:1;line-height:1.4}
.score{font-weight:bold;text-align:right}
#msg{color:#666;text-align:center;margin-top:80px;font-size:18px;padding:20px}
</style></head><body>
<h1>DIAMOND LIVESCORE</h1>
<div class="tabs" id="tabs"></div>
<div class="filters">
<div class="f active" id="b-all" onclick="setF('all')">All Games</div>
<div class="f" id="b-live" onclick="setF('live')">Live</div>
<div class="f" id="b-ft" onclick="setF('ft')">Finished</div>
<div class="f refresh" onclick="load(true)">Refresh</div>
</div>
<div class="line"></div>
<div id="games"><div id="msg">Loading...</div></div>
<script>
let filter='all', selected='', mem={};
function getDates(){
  let arr=[]; for(let i=-2;i<=2;i++){let d=new Date();d.setHours(12);d.setDate(d.getDate()+i);arr.push(d)} return arr;
}
function fmtTab(d){
  let today=new Date(); today.setHours(12,0,0,0); let cd=new Date(d); cd.setHours(12,0,0,0);
  if(cd.getTime()===today.getTime()) return 'Today';
  return d.toLocaleDateString('en',{weekday:'short'})+' '+d.getDate();
}
function renderTabs(){
  let dates=getDates(); const box=document.getElementById('tabs'); box.innerHTML='';
  dates.forEach(d=>{
    let iso=d.toISOString().split('T')[0];
    if(!selected) selected=iso;
    let div=document.createElement('div'); div.className='tab'+(iso===selected?' active':'');
    div.textContent=fmtTab(d); div.onclick=()=>{selected=iso; renderTabs(); load();};
    box.appendChild(div);
  });
  if(!selected) selected=new Date().toISOString().split('T')[0];
}
function setF(f){filter=f; document.querySelectorAll('.f').forEach(e=>e.classList.remove('active')); document.getElementById('b-'+(f==='all'?'all':f==='live'?'live':'ft')).classList.add('active'); if(mem[selected]) draw(mem[selected]);}
async function load(force=false){
  const box=document.getElementById('games');
  if(!force && mem[selected]){draw(mem[selected]); return;}
  box.innerHTML='<div id="msg">Loading...</div>';
  try{
    const r=await fetch('/api?date='+selected); const j=await r.json();
    mem[selected]=j; draw(j);
  }catch(e){ box.innerHTML='<div id="msg">Error. Press Refresh.</div>';}
}
function draw(data){
  let list=data.response||[];
  if(filter==='live') list=list.filter(m=>['1H','2H','HT','ET','P','BT','LIVE'].includes(m.fixture.status.short));
  if(filter==='ft') list=list.filter(m=>['FT','AET','PEN'].includes(m.fixture.status.short));
  if(list.length===0){ document.getElementById('games').innerHTML='<div id="msg">No '+(filter==='ft'?'ft':filter)+' matches for today. Try other date or press Refresh.</div>'; return; }
  let html=''; const groups={};
  list.forEach(m=>{let k=m.league.name; if(!groups[k]) groups[k]=[]; groups[k].push(m);});
  for(let lg in groups){
    html+='<div style="color:#888;margin:15px 2px 5px 2px;font-size:12px">'+lg+'</div>';
    groups[lg].forEach(m=>{
      let isLive=['1H','2H','HT'].includes(m.fixture.status.short);
      let t=m.fixture.status.short==='NS'? new Date(m.fixture.date).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : isLive? m.fixture.status.elapsed+"'" : m.fixture.status.short;
      html+='<div class="match"><div class="time '+(isLive?'live':'')+'">'+t+'</div><div class="team">'+m.teams.home.name+'<br>'+m.teams.away.name+'</div><div class="score">'+(m.goals.home!=null?m.goals.home+' - '+m.goals.away:'')+'<br><span style="font-size:11px;color:#888">'+(m.goals.home!=null?'':'vs')+'</span></div></div>';
    });
  }
  document.getElementById('games').innerHTML=html;
}
renderTabs(); load();
</script></body></html>`, {headers:{"Content-Type":"text/html"}});
  }
}
