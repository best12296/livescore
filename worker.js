export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = env.FOOTBALL_API_KEY?.trim();

    // API ENDPOINT
    if (url.pathname === "/api/matches") {
      try {
        if (!key) {
          return new Response(JSON.stringify({success:false, message:"FOOTBALL_API_KEY not set in Cloudflare"}), {
            headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}
          });
        }

        // live-football-api.com uses ?key=YOURKEY
        const apiUrl = `https://live-football-api.com/api/v1/matches?key=${encodeURIComponent(key)}`;
        
        const r = await fetch(apiUrl, { headers: { "Accept": "application/json" } });
        const json = await r.json();

        // provider returns {success, data} or {matches} or array
        const matches = json.data || json.matches || json.response || json || [];
        
        return new Response(JSON.stringify(matches), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });

      } catch (e) {
        return new Response(JSON.stringify({success:false, message:e.message}), {
          headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}
        });
      }
    }

    // FRONTEND WITH HT + FT
    return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LiveScore - HT/FT</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,sans-serif;padding:12px}
.header{font-size:22px;font-weight:800;margin-bottom:12px}
.tabs{display:flex;gap:8px;margin-bottom:14px}
.tabs button{padding:9px 16px;border:none;border-radius:20px;background:#1f1f1f;color:#aaa;font-weight:600;cursor:pointer}
.tabs button.active{background:#fff;color:#000}
.card{background:#151515;border-radius:12px;padding:12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center}
.league{font-size:11px;color:#888;margin-bottom:4px;text-transform:uppercase}
.teams{font-size:14px;line-height:20px}
.teams span{color:#aaa}
.ht{color:#facc15;font-size:11px;margin-top:4px;display:block}
.ft{font-weight:800;font-size:16px;text-align:right}
.ft small{display:block;font-size:11px;color:#22c55e;font-weight:500}
.loading{color:#666;padding:20px;text-align:center}
</style>
</head>
<body>
<div class="header">LiveScore</div>
<div class="tabs">
<button id="today" class="active" onclick="load('today')">Today</button>
<button id="yesterday" onclick="load('yesterday')">Yesterday</button>
<button id="tomorrow" onclick="load('tomorrow')">Tomorrow</button>
</div>
<div id="list" class="loading">Loading...</div>
<script>
let allData=[];
async function load(day){
  document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
  document.getElementById(day).classList.add('active');
  const list=document.getElementById('list');
  list.innerHTML='Loading '+day+' matches...';
  try{
    const res=await fetch('/api/matches?date='+day);
    const txt=await res.text();
    let data;
    try{ data=JSON.parse(txt); }catch{ list.innerHTML='<pre style="white-space:pre-wrap;font-size:11px">'+txt.slice(0,1000)+'</pre>'; return; }
    let arr=Array.isArray(data)?data:(data.data||data.matches||data.response||[]);
    if(!arr.length){
      if(data.success===false){ list.innerHTML='No matches for '+day+'<br><br><small style="color:#888">'+JSON.stringify(data)+'</small>'; return; }
      list.innerHTML='No matches for '+day; return;
    }
    allData=arr;
    // filter by day on frontend if provider returns all
    let filtered=arr;
    if(day!=='today'){
      const d=new Date();
      if(day==='yesterday') d.setDate(d.getDate()-1);
      if(day==='tomorrow') d.setDate(d.getDate()+1);
      const ds=d.toISOString().slice(0,10);
      filtered=arr.filter(m=>{
        const md=(m.date||m.match_date||m.fixture_date||'').slice(0,10);
        return md===ds || true; // show all if no date field
      });
    }
    if(!filtered.length) filtered=arr.slice(0,50);
    list.innerHTML=filtered.map(m=>{
      const league=m.league?.name||m.competition?.name||m.league_name||m.competition_name||'';
      const home=m.home_team||m.homeTeam?.name||m.teams?.home?.name||m.home||'Home';
      const away=m.away_team||m.awayTeam?.name||m.teams?.away?.name||m.away||'Away';
      const homeName=typeof home==='string'?home:home.name||'Home';
      const awayName=typeof away==='string'?away:away.name||'Away';
      const htScore=m.score?.halftime||m.halftime||m.ht||'';
      const htText=typeof htScore==='object' ? (htScore.home!==undefined? htScore.home+'-'+htScore.away : JSON.stringify(htScore)) : htScore;
      const ftScore=m.score?.fulltime||m.fulltime||m.ft||m.score||'';
      let ftText='';
      if(typeof ftScore==='object'){
        if(ftScore.home!==undefined) ftText=ftScore.home+'-'+ftScore.away;
        else if(ftScore.fulltime) ftText=ftScore.fulltime.home+'-'+ftScore.fulltime.away;
        else ftText=(m.goals?.home??'')+'-'+(m.goals?.away??'');
      }else ftText=ftScore;
      if(!ftText || ftText==='-') ftText=(m.goals?.home??0)+'-'+(m.goals?.away??0);
      const status=m.status||m.fixture?.status?.short||m.match_status||'';
      return '<div class="card"><div><div class="league">'+league+'</div><div class="teams">'+homeName+'<br>'+awayName+'<span class="ht">HT: '+(htText||'0-0')+'</span></div></div><div class="ft">'+(status?'<small>'+status+'</small>':'')+ftText+'</div></div>';
    }).join('');
  }catch(e){
    list.innerHTML='Error: '+e.message;
  }
}
load('today');
</script>
</body>
</html>`, {headers: {"Content-Type":"text/html"}});
  }
}
