export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = env.FOOTBALL_API_KEY;

    if (url.pathname === "/api/matches") {
      try {
        let d = url.searchParams.get("date") || "today";
        let date = new Date();
        if (d === "yesterday") date.setDate(date.getDate()-1);
        if (d === "tomorrow") date.setDate(date.getDate()+1);
        const dateStr = date.toISOString().slice(0,10);

        // live-football-api.com uses query param
        const apiUrl = `https://live-football-api.com/api/v1/matches?apikey=${key}&date=${dateStr}`;
        
        const r = await fetch(apiUrl);
        const json = await r.json();
        
        // return whatever data comes
        return new Response(JSON.stringify(json.data || json.matches || json || []), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      } catch (e) {
        return new Response(JSON.stringify({error: e.message}), {headers: {"Content-Type":"application/json"}});
      }
    }

    return new Response(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#0a0a0a;color:#fff;font-family:sans-serif;margin:0;padding:10px}.tabs{display:flex;gap:8px}.tabs button{padding:8px 14px;border:none;border-radius:8px;background:#222;color:#fff}.tabs button.active{background:#fff;color:#000}.match{background:#18181b;padding:12px;margin:10px 0;border-radius:10px;display:flex;justify-content:space-between}.ht{color:#facc15;font-size:12px}.ft{font-weight:bold}</style></head><body>
    <div class="tabs"><button id="today" onclick="load('today')" class="active">Today</button><button id="yesterday" onclick="load('yesterday')">Yesterday</button><button id="tomorrow" onclick="load('tomorrow')">Tomorrow</button></div>
    <div id="list">Loading...</div>
    <script>
    async function load(d){
      document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
      document.getElementById(d).classList.add('active');
      document.getElementById('list').innerHTML='Loading '+d+' matches...';
      try{
        const res=await fetch('/api/matches?date='+d);
        const text=await res.text();
        console.log(text);
        const data=JSON.parse(text);
        const arr=Array.isArray(data)?data:(data.data||data.matches||[]);
        if(!arr.length){document.getElementById('list').innerHTML='No matches for '+d+' <br><small>'+text.slice(0,200)+'</small>';return}
        document.getElementById('list').innerHTML=arr.map(m=>{
          const home=m.homeTeam?.name||m.home_team||m.teams?.home||'Home';
          const away=m.awayTeam?.name||m.away_team||m.teams?.away||'Away';
          const ht=m.score?.halftime||m.ht||' - ';
          const ft=m.score?.fulltime||m.ft|| (m.score?.home!==undefined? m.score.home+'-'+m.score.away : m.score||'0-0');
          const status=m.status||m.fixture?.status||'';
          return '<div class="match"><div>'+ (m.competition?.name||m.league||'') +'<br>'+home+' vs '+away+'<br><span class="ht">HT: '+JSON.stringify(ht)+'</span></div><div class="ft">'+status+'<br>'+JSON.stringify(ft)+'</div></div>';
        }).join('');
      }catch(e){document.getElementById('list').innerHTML='Error: '+e.message}
    }
    load('today');
    </script></body></html>`, {headers: {"Content-Type":"text/html"}});
  }
}
