export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/matches") {
      const key = env.FOOTBALL_API_KEY;
      let date = url.searchParams.get("date") || "today";
      const now = new Date();
      if (date === "today") date = now.toISOString().slice(0,10);
      if (date === "yesterday") { let d=new Date(now); d.setDate(d.getDate()-1); date=d.toISOString().slice(0,10); }
      if (date === "tomorrow") { let d=new Date(now); d.setDate(d.getDate()+1); date=d.toISOString().slice(0,10); }
      try {
        const r = await fetch("https://live-football-api.com/api/matches?date="+date, { headers: { "X-API-Key": key } });
        const t = await r.text();
        return new Response(t, { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
      } catch (e) {
        return new Response(JSON.stringify({data:[]}), { headers: { "Content-Type": "application/json" } });
      }
    }
    return new Response("<!DOCTYPE html><html><head><meta name=viewport content='width=device-width,initial-scale=1'><style>body{margin:0;background:#000;color:#fff;font-family:system-ui;font-size:13px}.line{display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid #222;background:#151515;white-space:nowrap;overflow:hidden}.score{font-weight:800}.ht{color:#ffeb3b;font-size:11px;margin-left:8px}</style></head><body><div style=display:flex;gap:5px;padding:8px;background:#111><button onclick=load('today')>Today</button><button onclick=load('yesterday')>Yesterday</button><button onclick=load('tomorrow')>Tomorrow</button></div><div id=list>Loading...</div><script>async function load(day){document.getElementById('list').innerHTML='Loading...';const r=await fetch('/api/matches?date='+day);const j=await r.json();let ms=j.data||j.matches||j||[];if(!Array.isArray(ms))ms=ms.data||[];let h='';for(let m of ms){let home=(m.homeTeam&&m.homeTeam.name)||m.home_team||'Home';let away=(m.awayTeam&&m.awayTeam.name)||m.away_team||'Away';let hg=(m.score&&m.score.home)||'-';let ag=(m.score&&m.score.away)||'-';let ht=m.ht_score||'?-?';h+='<div class=line><div>'+home+' vs '+away+'</div><span class=score>'+hg+'-'+ag+'</span><span class=ht>HT '+ht+' | FT '+hg+'-'+ag+'</span></div>';}document.getElementById('list').innerHTML=h||'No matches for '+day;}load('today');</script></body></html>", { headers: { "Content-Type": "text/html" } });
  }
}
