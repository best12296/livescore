export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/matches") {
      let dateParam = url.searchParams.get("date") || "today";
      let d = new Date();
      if(dateParam==="yesterday") d.setDate(d.getDate()-1);
      if(dateParam==="tomorrow") d.setDate(d.getDate()+1);
      let dateStr = /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : d.toISOString().slice(0,10);
      let espnDate = dateStr.replace(/-/g,"");
      
      try{
        const espnUrl = `https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard?dates=${espnDate}`;
        const r = await fetch(espnUrl);
        const j = await r.json();
        let events = j.events || [];
        let mapped = events.map(ev=>{
          const comp = ev.competitions?.[0];
          const home = comp?.competitors?.find(c=>c.homeAway==="home");
          const away = comp?.competitors?.find(c=>c.homeAway==="away");
          return {
            league_name: ev.league?.name || "Football",
            home_name: home?.team?.displayName || "Home",
            away_name: away?.team?.displayName || "Away",
            status: comp?.status?.type?.shortDetail || comp?.status?.type?.description || "",
            ht_score: comp?.status?.type?.description?.includes("HT") ? (home?.score+"-"+away?.score) : "0-0",
            ft_score: (home?.score||"0")+"-"+(away?.score||"0"),
            score: (home?.score||"0")+"-"+(away?.score||"0")
          };
        });
        return new Response(JSON.stringify({success:true,date:dateStr,source:"espn",count:mapped.length,data:mapped}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
      }catch(e){
        return new Response(JSON.stringify({success:false,message:e.message}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
      }
    }
    return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LiveScore</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0a;color:#fff;font-family:system-ui;padding:12px}.h{font-size:22px;font-weight:800;margin-bottom:12px}.tabs{display:flex;gap:8px;margin-bottom:14px}button{padding:9px 16px;border:none;border-radius:20px;background:#1f1f1f;color:#aaa;font-weight:600}button.active{background:#fff;color:#000}.card{background:#151515;border-radius:12px;padding:12px;margin-bottom:10px;display:flex;justify-content:space-between}.league{font-size:11px;color:#888}.ht{color:#facc15;font-size:11px;margin-top:4px;display:block}.ft{font-weight:800;font-size:18px;text-align:right}.ft small{display:block;font-size:11px;color:#22c55e}</style></head><body><div class="h">LiveScore - Free</div><div class="tabs"><button id="today" class="active" onclick="load('today')">Today</button><button id="yesterday" onclick="load('yesterday')">Yesterday</button><button id="tomorrow" onclick="load('tomorrow')">Tomorrow</button></div><div id="list">Loading...</div><script>async function load(day){document.querySelectorAll('button').forEach(b=>b.classList.remove('active'));document.getElementById(day).classList.add('active');const list=document.getElementById('list');list.innerHTML='Loading '+day+'...';try{const res=await fetch('/api/matches?date='+day);const json=await res.json();let arr=json.data||[];if(!arr.length){list.innerHTML='No matches for '+day+' ('+json.date+') - try Yesterday';return}list.innerHTML=arr.map(m=>'<div class="card"><div><div class="league">'+m.league_name+'</div><div>'+m.home_name+'<br>'+m.away_name+'<span class="ht">HT: '+(m.ht_score||'0-0')+'</span></div></div><div class="ft"><small>'+(m.status||'')+'</small>'+(m.ft_score||'0-0')+'</div></div>').join('')}catch(e){list.innerHTML='Error:'+e.message}}load('today');</script></body></html>`,{headers:{"Content-Type":"text/html"}});
  }
}
