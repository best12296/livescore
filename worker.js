export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const dateParam = url.searchParams.get("date") || "today";

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    if (path === "/api/matches") {
      let d = new Date();
      if (dateParam === "tomorrow") d.setDate(d.getDate() + 1);
      if (dateParam === "yesterday") d.setDate(d.getDate() - 1);
      const dateStr = d.toISOString().slice(0,10);
      const API_KEY = env.FOOTBALL_API_KEY || "088f79cadddb9cebccc50b31fc30ff16545878cde9bac042269d8a9bc6b16736";

      let data = [];
      let source = "live-football-api";
      let debug = "";

      try {
        // YOUR API - correct endpoint from your screenshot
        const apiUrl = `https://www.live-football-api.com/api/v1/matches?api_key=${API_KEY}&date=${dateStr}`;
        const r = await fetch(apiUrl);
        const j = await r.json();
        debug = `API: ${apiUrl} => credits: ${j.credits_remaining} success:${j.success}`;

        let rawMatches = [];
        if (j.data) {
          if (Array.isArray(j.data)) rawMatches = j.data;
          else if (Array.isArray(j.data.matches)) rawMatches = j.data.matches;
          else if (typeof j.data === 'object') {
            // data is { "Premier League": [...], "La Liga": [...] } or similar
            for (let key in j.data) {
              if (Array.isArray(j.data[key])) rawMatches.push(...j.data[key]);
            }
            // if still empty and data itself is match object
            if (rawMatches.length === 0 && j.data.id) rawMatches = [j.data];
          }
        }

        if (rawMatches.length > 0) {
          data = rawMatches.map(m => ({
            id: m.id || m.match_id || Math.random(),
            league: m.league_name || m.competition || m.league || m.tournament || "Live",
            home: m.home_team || m.home || m.teams?.home || "Home",
            away: m.away_team || m.away || m.teams?.away || "Away",
            home_score: m.home_score ?? m.score?.home ?? m.home_goals ?? 0,
            away_score: m.away_score ?? m.score?.away ?? m.away_goals ?? 0,
            status: m.status || m.match_status || "LIVE",
            minute: m.minute || m.timer || m.time || "",
            ht: m.ht_score || m.halftime || m.score?.halftime || "0-0",
            ft: `${m.home_score ?? 0}-${m.away_score ?? 0}`,
          }));
        } else {
          // If API returns success but empty for date, try without date (get all live)
          const apiUrl2 = `https://www.live-football-api.com/api/v1/matches?api_key=${API_KEY}`;
          const r2 = await fetch(apiUrl2);
          const j2 = await r2.json();
          debug += ` | Retry no-date: credits ${j2.credits_remaining} count ${JSON.stringify(j2.data).slice(0,100)}`;
          let raw2 = [];
          if (j2.data && typeof j2.data === 'object') {
            for (let k in j2.data) if (Array.isArray(j2.data[k])) raw2.push(...j2.data[k]);
            if (Array.isArray(j2.data)) raw2 = j2.data;
          }
          if (raw2.length > 0) {
            data = raw2.map(m => ({
              id: m.id, league: m.league_name || m.league || "Live",
              home: m.home_team || m.home, away: m.away_team || m.away,
              home_score: m.home_score ?? 0, away_score: m.away_score ?? 0,
              status: m.status || "LIVE", minute: m.minute || "", ht: m.ht_score || "0-0", ft: `${m.home_score ?? 0}-${m.away_score ?? 0}`,
            }));
          }
        }

        // If STILL empty, keep source as live-football-api but data empty (means no games today)
        if (data.length === 0) {
          debug += " | No matches returned for " + dateStr + " - API returned empty";
        }

      } catch(e) {
        source = `live-football-api-error: ${e.message}`;
        debug = e.message;
      }

      // Only fallback to ESPN if live API totally failed
      if (data.length === 0 && source.includes("error")) {
        try {
          const espnDate = dateStr.replace(/-/g,"");
          const r = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard?dates=${espnDate}`);
          const j = await r.json();
          data = (j.events || []).map(ev => {
            const comp = ev.competitions?.[0];
            return {
              id: ev.id, league: comp?.league?.name || "Football",
              home: comp?.competitors?.find(c=>c.homeAway==="home")?.team?.displayName || "Home",
              away: comp?.competitors?.find(c=>c.homeAway==="away")?.team?.displayName || "Away",
              home_score: comp?.competitors?.find(c=>c.homeAway==="home")?.score || "0",
              away_score: comp?.competitors?.find(c=>c.homeAway==="away")?.score || "0",
              status: comp?.status?.type?.description || "FT", minute: comp?.status?.displayClock || "", ht: "0-0", ft: "0-0",
            };
          });
          source = `espn-fallback (${debug})`;
        } catch {}
      }

      return new Response(JSON.stringify({success:true, date:dateStr, source, debug, count:data.length, data}), {
        headers: { "Content-Type":"application/json", ...cors }
      });
    }

    return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Diamond LiveScore - LIVE API</title>
    <style>body{margin:0;background:#0f0f0f;color:#fff;font-family:system-ui;padding:10px} .header{background:#1a1a1a;padding:12px;border-radius:12px;display:flex;justify-content:space-between;margin-bottom:10px} .tabs{display:flex;gap:8px;margin-bottom:10px} .tab{padding:8px 16px;border-radius:20px;background:#222;cursor:pointer} .tab.active{background:#fff;color:#000} .match{background:#1e1e1e;border-radius:12px;padding:12px;margin-bottom:8px;display:flex;justify-content:space-between} .badge{font-size:10px;color:#aaa;background:#2a2a2a;padding:4px 8px;border-radius:20px;max-width:200px;overflow:hidden}</style>
    </head><body>
    <div class="header"><b>⚽ Diamond LiveScore</b><span id="src" class="badge">loading...</span></div>
    <div class="tabs"><div class="tab" onclick="load('yesterday')">Yesterday</div><div class="tab active" onclick="load('today')">Today</div><div class="tab" onclick="load('tomorrow')">Tomorrow</div></div>
    <div id="list">Loading LIVE from your API...</div>
    <script>
    async function load(d){
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      [...document.querySelectorAll('.tab')].find(t=>t.textContent.toLowerCase()===d)?.classList.add('active');
      document.getElementById('list').innerHTML='Loading...';
      const r=await fetch('/api/matches?date='+d); const j=await r.json();
      document.getElementById('src').innerText=j.source+' | '+j.debug;
      if(!j.data.length){document.getElementById('list').innerHTML='<p>No matches for '+d+'<br><small>Debug: '+j.debug+'</small></p>'; return;}
      document.getElementById('list').innerHTML=j.data.map(m=>\`<div class="match"><div><small>\${m.league}</small><br><b>\${m.home} \${m.home_score} - \${m.away_score} \${m.away}</b><br><small>HT: \${m.ht}</small></div><div><span class="badge">\${m.status} \${m.minute}</span></div></div>\`).join('');
    }
    load('today');
    </script></body></html>`, { headers: { "Content-Type":"text/html", ...cors }});
  }
}
