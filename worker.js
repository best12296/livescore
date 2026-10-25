export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"*"};
    const KEY = env.API_FOOTBALL_KEY;
    const cache = caches.default;

    if(url.pathname==="/api/matches"){
      const date = url.searchParams.get("date") || new Date().toISOString().slice(0,10);
      const cacheKey = new Request(url.toString(), request);
      let cached = await cache.match(cacheKey);
      if(cached){let r=new Response(cached.body,cached);r.headers.set("Access-Control-Allow-Origin","*");return r;}
      try{
        const r=await fetch(`https://v3.football.api-sports.io/fixtures?date=${date}`,{headers:{"x-apisports-key":KEY}});
        const j=await r.json();let data=[];
        (j.response||[]).forEach(f=>{
          let country=(f.league?.country||"WORLD").toUpperCase();
          let league=f.league?.name||"";
          let status=f.fixture?.status?.short||"NS";
          let longStatus=f.fixture?.status?.long||"";
          let ts=f.fixture?.timestamp;let timeStr="00:00";if(ts){let d=new Date(ts*1000);timeStr=d.toISOString().slice(11,16);}
          let hs=f.goals?.home;let as=f.goals?.away;let ht=f.score?.halftime;
          let isLive=["1H","2H","HT","ET","LIVE","P","BT"].includes(status);
          data.push({id:String(f.fixture?.id),country,league,time:timeStr,status,longStatus,isLive,score:`${hs??0}-${as??0}`,home:f.teams?.home?.name,away:f.teams?.away?.name,elapsed:f.fixture?.status?.elapsed,htScore:ht});
        });
        data.sort((a,b)=>a.country.localeCompare(b.country)||a.league.localeCompare(b.league));
        let resp=new Response(JSON.stringify({count:data.length,data}),{headers:{...cors,"Content-Type":"application/json","Cache-Control":"public, max-age=60"}});
        await cache.put(cacheKey, resp.clone());return resp;
      }catch(e){return new Response(JSON.stringify({count:0,data:[]}),{headers:cors});}
    }

    return new Response(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width"><style>*{box-sizing:border-box}body{margin:0;background:#000;color:#fff;font-family:Arial}header{position:sticky;top:0;background:#000;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;z-index:10}select{background:#111;color:#fff;border:1px solid #333;padding:6px 10px;border-radius:20px}.card{background:#111;border:1px solid #222;margin:8px;border-radius:10px;padding:10px}.live{border-left:3px solid #0f0}</style></head><body><header><b>DIAMOND LIVESCORE</b><select id="date"></select></header><div id="list"></div><script>/* 2 BACK 2 FRONT ONLY - 2 is +2 */function buildUI(){/* your FT fix here */} function displayTime(ts){if(!ts)return "00:00";let d=new Date(ts*1000);return d.toISOString().slice(11,16);} function getStatusText(s){if(s==="FT")return "FT";if(s==="NS")return s;let n=parseInt(s);if(!isNaN(n))return n+"'";return s;} buildUI();<\/script></body></html>`,{headers:{...cors,"Content-Type":"text/html"}});
  }
}
