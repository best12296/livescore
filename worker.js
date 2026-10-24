export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const dateParam = url.searchParams.get("date") || "today";

    // CORS
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    // API Route
    if (path === "/api/matches" || path === "/api/matches/") {
      let d = new Date();
      if (dateParam === "tomorrow") d.setDate(d.getDate() + 1);
      if (dateParam === "yesterday") d.setDate(d.getDate() - 1);
      const dateStr = d.toISOString().slice(0,10);

      const API_KEY = env.FOOTBALL_API_KEY || "088f79cadddb9cebccc50b31fc30ff16545878cde9bac042269d8a9bc6b16736";
      
      let data = [];
      let source = "espn-fallback";
      let debug = "";

      // TRY YOUR LIVE-FOOTBALL-API.COM
      try {
        const endpoints = [
          `https://www.live-football-api.com/api/v1/matches?api_key=${API_KEY}&date=${dateStr}`,
          `https://www.live-football-api.com/api/v1/matches?key=${API_KEY}&date=${dateStr}`,
          `https://live-football-api.com/api/v1/matches?api_key=${API_KEY}&date=${dateStr}`,
          `https://www.live-football-api.com/api/v1/matches?api_key=${API_KEY}`,
        ];

        for (let ep of endpoints) {
          const r = await fetch(ep, { 
            headers: { 
              "Accept": "application/json",
              "X-API-Key": API_KEY,
              "Authorization": `Bearer ${API_KEY}`
            } 
          });
          const txt = await r.text();
          let j;
          try { j = JSON.parse(txt); } catch(e){ j = null; }
          
          if (j && (j.data || j.matches || j.result || Array.isArray(j))) {
            let raw = j.data || j.matches || j.result || j;
            if (Array.isArray(raw) && raw.length > 0) {
              data = raw.map(m => ({
                id: m.id || m.match_id || `${m.home_team}-${m.away_team}`,
                league: m.league?.name || m.competition || m.tournament || m.championship || "Live",
                league_logo: m.league?.logo || "",
                home: m.home_team || m.home?.name || m.teams?.home?.name || "Home",
                away: m.away_team || m.away?.name || m.teams?.away?.name || "Away",
                home_logo: m.home_team_logo || m.home?.logo || "",
                away_logo: m.away_team_logo || m.away?.logo || "",
                time: m.time || m.kickoff || m.date || m.start_time || "",
                minute: m.minute || m.timer || m.status?.minute || "",
                status: m.status || m.state || m.match_status || (m.live ? "LIVE" : "FT"),
                ht: m.ht_score || m.halftime || m.score?.halftime || "",
                ft: m.ft_score || m.score?.fulltime || `${m.home_score || 0}-${m.away_score || 0}`,
                home_score: m.home_score ?? m.score?.home ?? m.goals?.home ?? 0,
                away_score: m.away_score ?? m.score?.away ?? m.goals?.away ?? 0,
              }));
              source = "live-football-api";
              debug = `OK from ${ep} count=${data.length}`;
              break;
            }
          }
          debug += ` | Try ${ep.slice(0,50)} => ${txt.slice(0,100)}`;
        }
      } catch(e) {
        debug += ` ERROR: ${e.message}`;
      }

      // FALLBACK TO ESPN IF YOUR API EMPTY
      if (data.length === 0) {
        try {
          const espnDate = dateStr.replace(/-/g,"");
          const espnParam = dateParam === "today" ? "" : `?dates=${espnDate}`;
          const r = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard${espnParam}`);
          const j = await r.json();
          data = (j.events || []).map(ev => {
            const comp = ev.competitions?.[0];
            return {
              id: ev.id,
              league: comp?.league?.name || ev.league || "Football",
              home: comp?.competitors?.find(c=>c.homeAway==="home")?.team?.displayName || "Home",
              away: comp?.competitors?.find(c=>c.homeAway==="away")?.team?.displayName || "Away",
              home_score: comp?.competitors?.find(c=>c.homeAway==="home")?.score || "0",
              away_score: comp?.competitors?.find(c=>c.homeAway==="away")?.score || "0",
              status: comp?.status?.type?.description || "FT",
              minute: comp?.status?.displayClock || "",
              ht: `${comp?.competitors?.find(c=>c.homeAway==="home")?.score || 0}-${comp?.competitors?.find(c=>c.homeAway==="away")?.score || 0}`,
              ft: `${comp?.competitors?.find(c=>c.homeAway==="home")?.score || 0}-${comp?.competitors?.find(c=>c.homeAway==="away")?.score || 0}`,
            };
          });
          if(source !== "live-football-api") source = `espn-fallback (debug: ${debug.slice(0,300)})`;
        } catch(e) {
          source = `error (debug: ${debug})`;
        }
      }

      return new Response(JSON.stringify({success:true, date:dateStr, source, debug, count:data.length, data}), {
        headers: { "Content-Type":"application/json", ...cors }
      });
    }

    // FRONTEND HTML
    return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Diamond LiveScore</title>
    <style>body{margin:0;background:#0f0f0f;color:#fff;font-family:system-ui;padding:10px} .header{background:#1a1a1a;padding:12px;border-radius:12px;display:flex;justify-content:space-between;align-items:center;margin-bottom:10px} .tabs{display:flex;gap:8px;margin-bottom:10px} .tab{padding:8px 16px;border-radius:20px;background:#222;cursor:pointer} .tab.active{background:#fff;color:#000} .match{background:#1e1e1e;border-radius:12px;padding:12px;margin-bottom:8px;display:flex;justify-content:space-between} .badge{font-size:11px;color:#aaa;background:#2a2a2a;padding:4px 8px;border-radius:20px}</style>
    </head><body>
    <div class="header"><b>⚽ Diamond LiveScore</b><span id="src" class="badge">loading...</span></div>
    <div class="tabs"><div class="tab" onclick="load('yesterday')">Yesterday</div><div class="tab active" onclick="load('today')">Today</div><div class="tab" onclick="load('tomorrow')">Tomorrow</div></div>
    <div id="list">Loading...</div>
    <script>
    async function load(d){
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      [...document.querySelectorAll('.tab')].find(t=>t.textContent.toLowerCase()===d)?.classList.add('active');
      document.getElementById('list').innerHTML='Loading...';
      const r=await fetch('/api/matches?date='+d); const j=await r.json();
      document.getElementById('src').innerText=j.source;
      if(!j.data.length){document.getElementById('list').innerHTML='<p>No matches for '+d+'<br><small>'+j.debug+'</small></p>'; return;}
      document.getElementById('list').innerHTML=j.data.map(m=>\`<div class="match"><div><small>\${m.league}</small><br><b>\${m.home} \${m.home_score} - \${m.away_score} \${m.away}</b><br><small>HT: \${m.ht} | FT: \${m.ft}</small></div><div><span class="badge">\${m.status} \${m.minute}</span></div></div>\`).join('');
    }
    load('today'); setInterval(()=>load('today'),30000);
    </script></body></html>`, { headers: { "Content-Type":"text/html", ...cors }});
  }
}
