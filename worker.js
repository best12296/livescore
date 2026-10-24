export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = env.FOOTBALL_API_KEY?.trim();
    const secret = env.FOOTBALL_API_SECRET?.trim();

    if (url.pathname === "/api/matches") {
      try {
        if (!key || !secret) {
          return new Response(JSON.stringify({success:false,message:"Set KEY and SECRET in Cloudflare",has_key:!!key,has_secret:!!secret}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
        }

        // date handling
        let dateParam = url.searchParams.get("date") || "today";
        let d = new Date();
        if(dateParam==="yesterday") d.setDate(d.getDate()-1);
        if(dateParam==="tomorrow") d.setDate(d.getDate()+1);
        // if ?date=2026-10-24 format, use it directly
        let dateStr;
        if(/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) dateStr = dateParam;
        else dateStr = d.toISOString().slice(0,10);

        // CORRECT ENDPOINT - this is what live-score-api uses
        const apiUrl = `https://livescore-api.com/api-client/fixtures/matches.json?key=${encodeURIComponent(key)}&secret=${encodeURIComponent(secret)}&date=${dateStr}`;

        const r = await fetch(apiUrl);
        const json = await r.json();

        // provider returns {data:{match:[...]}} or {data:{fixture:[...]}}
        let matches = [];
        if (json.data) {
          if (Array.isArray(json.data.match)) matches = json.data.match;
          else if (Array.isArray(json.data.fixture)) matches = json.data.fixture;
          else if (Array.isArray(json.data.matches)) matches = json.data.matches;
          else if (Array.isArray(json.data)) matches = json.data;
        } else if (Array.isArray(json.match)) matches = json.match;

        // Also try live scores for today to get live FT/HT
        if(dateParam==="today" || dateStr===new Date().toISOString().slice(0,10)){
          try{
            const liveUrl = `https://livescore-api.com/api-client/scores/live.json?key=${encodeURIComponent(key)}&secret=${encodeURIComponent(secret)}`;
            const lr = await fetch(liveUrl);
            const ljson = await lr.json();
            let liveMatches = ljson.data?.match || ljson.data?.matches || ljson.match || [];
            if(liveMatches.length) {
              // merge live on top
              matches = liveMatches.concat(matches);
            }
          }catch(e){}
        }

        return new Response(JSON.stringify({success:true,date:dateStr,count:matches.length,data:matches,raw:json}),{
          headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}
        });

      } catch (e) {
        return new Response(JSON.stringify({success:false,message:e.message}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
      }
    }

    return new Response(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LiveScore HT/FT</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0a;color:#fff;font-family:system-ui;padding:12px}.h{font-size:22px;font-weight:800;margin-bottom:12px}.tabs{display:flex;gap:8px;margin-bottom:14px}button{padding:9px 16px;border:none;border-radius:20px;background:#1f1f1f;color:#aaa;font-weight:600}button.active{background:#fff;color:#000}.card{background:#151515;border-radius:12px;padding:12px;margin-bottom:10px;display:flex;justify-content:space-between}.league{font-size:11px;color:#888;text-transform:uppercase;margin-bottom:4px}.teams{font-size:14px;line-height:20px}.ht{color:#facc15;font-size:11px;margin-top:4px;display:block}.ft{font-weight:800;font-size:16px;text-align:right}.ft small{display:block;font-size:11px;color:#22c55e}</style>
</head><body>
<div class="h">LiveScore</div>
<div class="tabs"><button id="today" class="active" onclick="load('today')">Today</button><button id="yesterday" onclick="load('yesterday')">Yesterday</button><button id="tomorrow" onclick="load('tomorrow')">Tomorrow</button></div>
<div id="list">Loading...</div>
<script>
async function load(day){
  document.querySelectorAll('button').forEach(b=>b.classList.remove('active'));document.getElementById(day).classList.add('active');
  const list=document.getElementById('list');list.innerHTML='Loading '+day+'...';
  try{
    const res=await fetch('/api/matches?date='+day);const json=await res.json();
    if(json.success===false){list.innerHTML='Error: '+json.message+'<br><small>'+JSON.stringify(json)+'</small>';return}
    let arr=json.data||[];if(!arr.length){list.innerHTML='No matches for '+day+' ('+json.date+')';return}
    list.innerHTML=arr.slice(0,120).map(m=>{
      const league=m.league_name||m.competition_name||m.competition?.name||m.league?.name||'';
      const home=m.home_name||m.home_team||m.homeTeam?.name||m.teams?.home?.name||'Home';
      const away=m.away_name||m.away_team||m.awayTeam?.name||m.teams?.away?.name||'Away';
      const ht = (m.score?.ht||m.ht||m.scores?.ht||'') || (m.ht_score?m.ht_score:'');
      const htText = typeof ht==='object'? (ht[0]+'-'+ht[1]) : ht;
      const ft = m.score||m.ft_score||m.scores?.ft||'';
      let ftText='';if(typeof ft==='object') ftText=(ft.home||ft[0]||0)+'-'+(ft.away||ft[1]||0); else ftText=ft|| (m.status==='HT'?'0-0':(m.goals?.home!=null?m.goals.home+'-'+m.goals.away:m.score));
      const status=m.status||m.match_status||m.time||m.scheduled||'';
      return '<div class="card"><div><div class="league">'+league+'</div><div class="teams">'+home+'<br>'+away+'<span class="ht">HT: '+(htText||m.score?.ht||'0-0')+'</span></div></div><div class="ft"><small>'+status+'</small>'+(ftText||m.score||'vs')+'</div></div>';
    }).join('');
  }catch(e){list.innerHTML='Error: '+e.message}
}
load('today');
</script></body></html>`,{headers:{"Content-Type":"text/html"}});
  }
}
