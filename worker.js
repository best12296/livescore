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

    // API
    if (url.pathname === "/api/matches") {
      const date = url.searchParams.get("date") || new Date().toISOString().slice(0,10);
      const cacheKey = new Request(url.toString(), request);
      let cached = await cache.match(cacheKey);
      if (cached) {
        let r = new Response(cached.body, cached);
        r.headers.set("Access-Control-Allow-Origin", "*");
        return r;
      }
      if (!KEY) {
        return new Response(JSON.stringify({ error: "Missing API_FOOTBALL_KEY", count: 0, data: [] }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      try {
        const apiRes = await fetch(`https://v3.football.api-sports.io/fixtures?date=${date}`, {
          headers: { "x-apisports-key": KEY }
        });
        const j = await apiRes.json();
        let data = [];
        (j.response || []).forEach(f => {
          let country = (f.league?.country || "WORLD").toUpperCase();
          let league = f.league?.name || "";
          let short = f.fixture?.status?.short || "NS";
          let longStatus = f.fixture?.status?.long || "";
          let ts = f.fixture?.timestamp;
          let hs = f.goals?.home;
          let as = f.goals?.away;
          let ht = f.score?.halftime;
          let elapsed = f.fixture?.status?.elapsed;
          
          // FORCE FT - NEVER SHOW 90'
          let status = short;
          if (short === "FT" || longStatus === "Match Finished") status = "FT";
          if (short === "AET" || short === "PEN") status = "FT";

          data.push({
            id: String(f.fixture?.id),
            country, league,
            timestamp: ts,
            status: status,
            longStatus: longStatus,
            elapsed: elapsed,
            home: f.teams?.home?.name,
            away: f.teams?.away?.name,
            score: `${hs ?? 0}-${as ?? 0}`,
            htScore: ht ? `${ht.home ?? 0}-${ht.away ?? 0}` : null
          });
        });
        data.sort((a,b) => a.country.localeCompare(b.country) || a.league.localeCompare(b.league));
        let resp = new Response(JSON.stringify({ count: data.length, data }), {
          headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "public, max-age=60" }
        });
        await cache.put(cacheKey, resp.clone());
        return resp;
      } catch (e) {
        return new Response(JSON.stringify({ count: 0, data: [], error: String(e) }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
    }

    // FRONTEND
    return new Response(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DIAMOND LIVESCORE</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#000;color:#fff;font-family:Arial,sans-serif}
header{position:sticky;top:0;background:#000;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222;z-index:10}
#date{ background:#111;color:#fff;border:1px solid #333;padding:8px 12px;border-radius:20px}
.country{padding:12px 10px 4px;font-weight:bold;color:#aaa;font-size:13px}
.league{padding:0 10px 6px;color:#666;font-size:12px}
.card{background:#111;border:1px solid #222;margin:0 8px 8px;border-radius:10px;padding:10px;display:flex;justify-content:space-between;align-items:center}
.card.live{border-left:3px solid #0f0}
.card.ft{border-left:3px solid #555}
.team{font-size:14px;line-height:18px}
.score{font-weight:bold;font-size:16px;text-align:center;min-width:80px}
.status{font-size:12px;color:#888}
.status.ft{color:#fff;font-weight:bold}
.status.live{color:#0f0;font-weight:bold}
</style>
</head>
<body>
<header><b>DIAMOND LIVESCORE</b><input type="date" id="date"></header>
<div id="list">Loading...</div>
<script>
const dateInput = document.getElementById('date');
const list = document.getElementById('list');
dateInput.valueAsDate = new Date();

// FORCE FT - NEVER SHOW 90' - 2 BACK 2 FRONT ONLY - 2 is +2
function getDisplayStatus(m){
  let s = m.status;
  if(s === 'FT') return '<span class="status ft">FT</span>';
  if(s === 'HT') return '<span class="status live">HT</span>';
  if(m.elapsed){ return '<span class="status live">' + m.elapsed + "'</span>"; }
  if(s === 'NS'){
    // 2 BACK 2 FRONT ONLY: add +1 hour for Nigeria WAT, display
    if(m.timestamp){
      let d = new Date(m.timestamp*1000);
      // +1 hour
      d.setHours(d.getHours()+1);
      return '<span class="status">'+ d.toISOString().slice(11,16) +'</span>';
    }
    return '<span class="status">NS</span>';
  }
  return '<span class="status">'+s+'</span>';
}

function getScore(m){
  if(m.status === 'NS') return 'VS';
  return m.score;
}

async function load(){
  list.innerHTML='Loading...';
  let d = dateInput.value;
  try{
    let r = await fetch('/api/matches?date='+d);
    let j = await r.json();
    let data = j.data || [];
    if(data.length===0){ list.innerHTML='<div style="padding:20px;text-align:center;color:#666">No matches for '+d+'</div>'; return; }
    let html='';
    let lastCountry='';
    let lastLeague='';
    data.forEach(m=>{
      if(m.country!==lastCountry){
        html+='<div class="country">'+m.country+'</div>';
        lastCountry=m.country; lastLeague='';
      }
      if(m.league!==lastLeague){
        html+='<div class="league">'+m.league+'</div>';
        lastLeague=m.league;
      }
      let isLive = m.elapsed && m.status!=='FT';
      let cls = m.status==='FT' ? 'card ft' : (isLive ? 'card live' : 'card');
      html+='<div class="'+cls+'"><div class="team"><div>'+m.home+'</div><div>'+m.away+'</div></div><div class="score"><div>'+getScore(m)+'</div>'+getDisplayStatus(m)+'</div></div>';
    });
    list.innerHTML=html;
  }catch(e){ list.innerHTML='Error: '+e; }
}
dateInput.addEventListener('change', load);
load();
setInterval(load, 60000);
</script>
</body>
</html>`, { headers: { ...cors, "Content-Type": "text/html; charset=utf-8" } });
  }
}
