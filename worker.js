export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*"
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const KEY = env.API_FOOTBALL_KEY;
    const cache = caches.default;

    if (url.pathname === "/api/matches") {
      const date = url.searchParams.get("date") || new Date().toISOString().slice(0, 10);
      const cacheKey = new Request(url.toString(), request);
      let cached = await cache.match(cacheKey);
      if (cached) { let r = new Response(cached.body, cached); r.headers.set("Access-Control-Allow-Origin", "*"); return r; }
      if (!KEY) return new Response(JSON.stringify({ count: 0, data: [], error: "NO KEY" }), { headers: { ...cors, "Content-Type": "application/json" } });
      try {
        const apiRes = await fetch(`https://v3.football.api-sports.io/fixtures?date=${date}`, { headers: { "x-apisports-key": KEY } });
        const j = await apiRes.json();
        let data = [];
        (j.response || []).forEach(f => {
          let short = f.fixture?.status?.short || "NS";
          let longStatus = f.fixture?.status?.long || "";
          let status = short;
          if (short === "FT" || longStatus === "Match Finished" || short === "AET" || short === "PEN") status = "FT";
          data.push({
            id: f.fixture?.id,
            country: (f.league?.country || "WORLD").toUpperCase(),
            league: f.league?.name || "",
            timestamp: f.fixture?.timestamp,
            status: status,
            elapsed: f.fixture?.status?.elapsed,
            home: f.teams?.home?.name,
            away: f.teams?.away?.name,
            score: `${f.goals?.home ?? 0}-${f.goals?.away ?? 0}`
          });
        });
        data.sort((a,b)=> a.country.localeCompare(b.country) || a.league.localeCompare(b.league));
        let resp = new Response(JSON.stringify({ count: data.length, data }), { headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "public, max-age=30" } });
        await cache.put(cacheKey, resp.clone());
        return resp;
      } catch (e) {
        return new Response(JSON.stringify({ count: 0, data: [] }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
    }

    return new Response(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE</title>
<style>
body{margin:0;background:#000;color:#fff;font-family:Arial;font-weight:600}
header{position:sticky;top:0;background:#000;padding:14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #0f0;z-index:99}
header b{color:#0f0;letter-spacing:1px}
#date{background:#0a0a0a;color:#0f0;border:1px solid #0f0;padding:7px 12px;border-radius:20px;outline:none}
#list{padding-bottom:20px}
.country{background:#0a0a0a;color:#0f0;padding:10px 12px;margin-top:12px;font-size:12px;border-left:3px solid #0f0;letter-spacing:1px}
.league{color:#666;padding:6px 12px;font-size:11px}
.card{background:#111;border:1px solid #222;margin:6px 8px;border-radius:10px;padding:12px;display:flex;justify-content:space-between;align-items:center}
.card.live{border-left:3px solid #0f0; background:#0f0f0f}
.card.ft{border-left:3px solid #333}
.teams{line-height:20px;font-size:14px}
.mid{text-align:center;min-width:80px}
.score{font-size:18px;color:#fff;font-weight:900}
.st{font-size:11px;margin-top:3px}
.st.live{color:#0f0;font-weight:900}
.st.ft{color:#fff;background:#222;padding:2px 8px;border-radius:10px;display:inline-block}
.st.ns{color:#888}
.vs{color:#555;font-size:14px}
</style>
</head>
<body>
<header><b>DIAMOND LIVESCORE</b><input type="date" id="date"></header>
<div id="list">Loading...</div>
<script>
const d=document.getElementById('date'), list=document.getElementById('list');
d.valueAsDate=new Date();
function fmt(m){
 if(m.status==='FT') return '<div class="st ft">FT</div>';
 if(m.status==='HT') return '<div class="st live">HT</div>';
 if(m.elapsed && m.status!=='FT') return '<div class="st live">'+m.elapsed+"'"+"</div>";
 if(m.timestamp){
   let x=new Date(m.timestamp*1000); x.setHours(x.getHours()+1);
   return '<div class="st ns">'+x.toISOString().slice(11,16)+'</div>';
 }
 return '<div class="st ns">'+m.status+'</div>';
}
function sc(m){ return m.status==='NS' ? '<div class="vs">VS</div>' : '<div class="score">'+m.score+'</div>'; }
async function load(){
 list.innerHTML='<div style="text-align:center;padding:30px;color:#0f0">Loading...</div>';
 let date=d.value;
 let r=await fetch('/api/matches?date='+date); let j=await r.json();
 let data=j.data||[];
 if(!data.length){ list.innerHTML='<div style="text-align:center;padding:40px;color:#666">No matches for '+date+'<br><small>Change date to yesterday</small></div>'; return; }
 let h='', lc='', ll='';
 data.forEach(m=>{
  if(m.country!==lc){ h+='<div class="country">'+m.country+'</div>'; lc=m.country; ll=''; }
  if(m.league!==ll){ h+='<div class="league">'+m.league+'</div>'; ll=m.league; }
  let live=m.elapsed && m.status!=='FT';
  let cls= m.status==='FT' ? 'card ft' : (live ? 'card live' : 'card');
  h+='<div class="'+cls+'"><div class="teams"><div>'+m.home+'</div><div>'+m.away+'</div></div><div class="mid">'+sc(m)+fmt(m)+'</div></div>';
 });
 list.innerHTML=h;
}
d.addEventListener('change',load); load(); setInterval(load,60000);
<\/script>
</body>
</html>`, { headers: { ...cors, "Content-Type": "text/html; charset=utf-8" } });
  }
}
