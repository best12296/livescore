export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "*" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const KEYS = [env.API_FOOTBALL_KEY, env.API_FOOTBALL_KEY2, env.API_FOOTBALL_KEY3].filter(Boolean);

    if (url.pathname === "/api/matches") {
      const date = url.searchParams.get("date") || new Date().toISOString().slice(0,10);
      const cacheKey = new Request(`https://cache.local/${date}`);
      const cache = caches.default;
      let cached = await cache.match(cacheKey);
      if(cached){ return new Response(await cached.text(), { headers: { ...cors, "Content-Type":"application/json", "X-Cache":"HIT" } }); }
      if (KEYS.length===0) return new Response(JSON.stringify({count:0,data:[],error:"NO KEY"}), {headers:{...cors,"Content-Type":"application/json"}});
      let finalData = null; let lastError = null;
      for(let KEY of KEYS){
        try{
          let apiRes = await fetch(`https://v3.football.api-sports.io/fixtures?date=${date}`, { headers: { "x-apisports-key": KEY } });
          let j = await apiRes.json();
          if(j.errors && Object.keys(j.errors).length>0){
            if(JSON.stringify(j.errors).toLowerCase().includes("limit") || j.errors.requests){ lastError=j.errors; continue; }
          }
          let data=[];
          (j.response||[]).forEach(f=>{
            let short=f.fixture?.status?.short||"NS";
            let st=short; if(short==="FT"||f.fixture?.status?.long==="Match Finished") st="FT";
            data.push({ id:f.fixture?.id, country:(f.league?.country||"WORLD").toUpperCase(), league:f.league?.name, timestamp:f.fixture?.timestamp, status:st, elapsed:f.fixture?.status?.elapsed, home:f.teams?.home?.name, away:f.teams?.away?.name, score:`${f.goals?.home??0}-${f.goals?.away??0}` });
          });
          data.sort((a,b)=>a.country.localeCompare(b.country)||a.league.localeCompare(b.league));
          finalData = {count:data.length, data}; break;
        }catch(e){ lastError=e.message; continue; }
      }
      if(!finalData){ return new Response(JSON.stringify({count:0,data:[],error:"QUOTA FINISHED - Try tomorrow",details:lastError}), {headers:{...cors,"Content-Type":"application/json"}}); }
      let txt = JSON.stringify(finalData);
      let toCache = new Response(txt, {headers:{"Content-Type":"application/json","Cache-Control":"max-age=3600"}});
      ctx.waitUntil(cache.put(cacheKey,toCache));
      return new Response(txt, {headers:{...cors,"Content-Type":"application/json","X-Cache":"MISS"}});
    }

    return new Response(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND LIVESCORE</title><style>
body{margin:0;background:#000;color:#fff;font-family:Arial;font-weight:700}
header{position:sticky;top:0;background:#000;padding:10px 12px;border-bottom:2px solid #0f0;z-index:99}
.top b{color:#0f0;font-size:18px}
.dates{display:flex;gap:8px;overflow-x:auto;margin-top:10px}.dates::-webkit-scrollbar{display:none}
.d{border:1px solid #333;background:#111;color:#888;padding:8px 14px;border-radius:20px;font-size:12px;white-space:nowrap;cursor:pointer}.d.active{background:#0f0;color:#000;font-weight:900}
.country{background:#0a0a0a;color:#0f0;padding:10px 12px;margin-top:12px;font-size:12px;border-left:3px solid #0f0}
.league{color:#666;padding:6px 12px;font-size:11px}
.card{background:#111;border:1px solid #222;margin:6px 8px;border-radius:10px;padding:12px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}.card:active{transform:scale(0.97)}
.card.live{border-left:3px solid #0f0;background:#0f0f0f}.card.ft{border-left:3px solid #444}
.left{display:flex;gap:10px;align-items:center}.time{color:#0f0;font-size:12px;min-width:45px;text-align:center;background:#0f0f0f;border:1px solid #0f0;padding:4px 6px;border-radius:6px}.time.ns{color:#888;background:#111;border-color:#333}
.teams{line-height:20px;font-size:14px}.mid{text-align:right;min-width:70px}.score{font-size:18px;font-weight:900}.min{font-size:11px;color:#0f0}.ftbadge{color:#fff;background:#333;padding:2px 8px;border-radius:10px;font-size:11px}
</style></head><body><header><div class="top"><b>DIAMOND LIVESCORE</b></div><div class="dates" id="dates"></div></header><div id="list">Loading...</div><script>
const list=document.getElementById('list'),datesEl=document.getElementById('dates');let selectedDate=new Date();
function fmtDate(d){return d.toISOString().slice(0,10)}
function dayLabel(d,i){const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];if(i===0)return'Today';return days[d.getDay()]+' '+String(d.getDate()).padStart(2,'0');}
function buildDates(){datesEl.innerHTML='';for(let i=-2;i<=2;i++){let dt=new Date();dt.setDate(dt.getDate()+i);let iso=fmtDate(dt);let btn=document.createElement('div');btn.className='d'+(i===0?' active':'');btn.textContent=dayLabel(dt,i);btn.onclick=()=>{selectedDate=dt;document.querySelectorAll('.d').forEach(x=>x.classList.remove('active'));btn.classList.add('active');load(iso)};datesEl.appendChild(btn);}}
function getTime(ts){if(!ts)return'';let x=new Date(ts*1000);x.setHours(x.getHours()+1);return x.toISOString().slice(11,16);}
// FIXED: NS no show for right side
function sc(m){if(m.status==='NS')return '';return '<div class="score">'+m.score+'</div>'+(m.status==='FT'?'<div class="ftbadge">FT</div>':(m.elapsed?'<div class="min">'+m.elapsed+"'"+'</div>':''));}
async function load(d){if(!d)d=fmtDate(selectedDate);list.innerHTML='<div style="text-align:center;padding:30px;color:#0f0">Loading '+d+'...</div>';let r=await fetch('/api/matches?date='+d);let j=await r.json();if(j.error){list.innerHTML='<div style="text-align:center;padding:40px;color:red">'+j.error+'</div>';return}let data=j.data||[];if(!data.length){list.innerHTML='<div style="text-align:center;padding:40px;color:#666">No matches for '+d+'</div>';return}let h='',lc='',ll='';data.forEach(m=>{if(m.country!==lc){h+='<div class="country">'+m.country+'</div>';lc=m.country;ll=''}if(m.league!==ll){h+='<div class="league">'+m.league+'</div>';ll=m.league}let cls=m.status==='FT'?'card ft':(m.elapsed&&m.status!=='FT'?'card live':'card');let timeClass=m.status==='NS'?'time ns':'time';h+='<div class="'+cls+'" onclick="alert(\\''+m.home+' vs '+m.away+'\\')"><div class="left"><div class="'+timeClass+'">'+getTime(m.timestamp)+'</div><div class="teams"><div>'+m.home+'</div><div>'+m.away+'</div></div></div><div class="mid">'+sc(m)+'</div></div>';});list.innerHTML=h;}
buildDates();load();
<\/script></body></html>`, { headers: { ...cors, "Content-Type":"text/html" } });
  }
}
