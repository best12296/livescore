export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "*" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const API_KEY = "98a19520b228fd8dcff8459b07f0d569";
    const TODAY = new Date().toISOString().slice(0,10);

    // TOP 9 LEAGUES - ALWAYS ON TOP
    function getTopRank(leagueName, countryName){
      const l = leagueName.toLowerCase().trim();
      const c = countryName.toLowerCase().trim();
      if (l === "uefa champions league") return 1;
      if (l === "uefa europa league") return 2;
      if (l === "premier league" && c === "england") return 3;
      if ((l === "la liga" || l === "laliga") && c === "spain") return 4;
      if (l === "ligue 1" && c === "france") return 5;
      if (l === "bundesliga" && c === "germany") return 6;
      if (l === "serie a" && c === "italy") return 7;
      if (l === "eredivisie" && c === "netherlands") return 8;
      if (l === "championship" && c === "england") return 9;
      return 999; // not top, will go A-Z
    }

    if(url.pathname==="/api/matches"){
      const date=url.searchParams.get("date")||TODAY;
      const cacheKey=new Request("https://cache.local/TOP9-AZ-NOTABLE-"+date);
      const cache=caches.default;
      const cached=await cache.match(cacheKey);
      if(cached && url.searchParams.get("refresh")!=="1") return new Response(await cached.text(), {headers:{...cors,"Content-Type":"application/json"}});
      const apiRes=await fetch("https://v3.football.api-sports.io/fixtures?date="+date,{headers:{"x-apisports-key":API_KEY}});
      const j=await apiRes.json();
      const data=[];
      for(const f of (j.response||[])){
        const league=f.league?.name||""; const country=f.league?.country||"WORLD";
        const rank=getTopRank(league, country);
        data.push({ 
          country:country.toUpperCase(), 
          league:league, 
          leagueId:f.league?.id||0, 
          timestamp:f.fixture?.timestamp, 
          status:f.fixture?.status?.short||"NS", 
          elapsed:f.fixture?.status?.elapsed||"", 
          home:f.teams?.home?.name||"", 
          away:f.teams?.away?.name||"", 
          score:(f.goals?.home??0)+"-"+(f.goals?.away??0), 
          rank:rank 
        });
      }
      // SORT: Top 9 first (rank 1-9), then A-Z by country-league
      data.sort((a,b)=>{
        if(a.rank!==b.rank) return a.rank-b.rank;
        const nameA = (a.country+" - "+a.league).toLowerCase();
        const nameB = (b.country+" - "+b.league).toLowerCase();
        return nameA.localeCompare(nameB);
      });
      const txt=JSON.stringify({count:data.length,data:data});
      ctx.waitUntil(cache.put(cacheKey,new Response(txt,{headers:{"Content-Type":"application/json","Cache-Control":"max-age=120"}})));
      return new Response(txt,{headers:{...cors,"Content-Type":"application/json"}});
    }

    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND LIVESCORE</title><style>
body{margin:0;background:#000;color:#fff;font-family:Arial;font-weight:700}
header{position:sticky;top:0;background:#000;padding:10px 12px;border-bottom:2px solid #0f0;z-index:99}
.top b{color:#0f0;font-size:18px}
.dates{display:flex;gap:8px;overflow-x:auto;margin-top:10px}.dates::-webkit-scrollbar{display:none}
.d{border:1px solid #333;background:#111;color:#888;padding:8px 14px;border-radius:20px;font-size:12px;white-space:nowrap;cursor:pointer}.d.active{background:#0f0;color:#000;font-weight:900}
.filters{display:flex;gap:8px;margin-top:12px;align-items:center}.f{border:1px solid #333;background:#111;color:#888;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer}.f.active{background:#fff;color:#000;font-weight:900}
.refresh{margin-left:auto;background:#000;border:1px solid #0f0;color:#0f0;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;font-weight:900}
.country{background:#00ff00 !important;color:#000 !important;padding:11px 12px;margin-top:12px;font-size:13px;border-left:4px solid #fff !important;display:flex;justify-content:space-between;font-weight:900}
.card{background:#111;border:1px solid #222;margin:6px 8px;border-radius:10px;padding:12px;display:flex;justify-content:space-between;align-items:center}
.left{display:flex;gap:10px;align-items:center}.time{color:#0f0 !important;font-size:12px;min-width:50px;text-align:center;background:#000 !important;border:1px solid #0f0 !important;padding:5px 8px;border-radius:20px;font-weight:900}
.teams{line-height:20px;font-size:14px}.mid{text-align:right;min-width:70px}.score{font-size:18px;font-weight:900}.ftbadge{color:#fff;background:#333;padding:2px 8px;border-radius:10px;font-size:11px}
</style></head><body>
<header><div class="top"><b>DIAMOND LIVESCORE</b></div><div class="dates" id="dates"></div><div class="filters"><div class="f active" id="f-all">All Games</div><div class="f" id="f-live">Live</div><div class="f" id="f-ft">Finished</div><div class="refresh" id="refreshBtn">Refresh</div></div></header>
<div id="list">Loading...</div>
<script>
const list=document.getElementById('list');const datesEl=document.getElementById('dates');let selectedDate=new Date();let allData=[];
function fmtDate(d){return d.toISOString().slice(0,10)}function dayLabel(d,i){const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];if(i===0)return 'Today';return days[d.getDay()]+' '+String(d.getDate()).padStart(2,'0');}
function buildDates(){datesEl.innerHTML='';for(let i=-1;i<=1;i++){let dt=new Date();dt.setDate(dt.getDate()+i);let btn=document.createElement('div');btn.className='d'+(i===0?' active':'');btn.textContent=dayLabel(dt,i);btn.onclick=function(){selectedDate=dt;document.querySelectorAll('.d').forEach(x=>x.classList.remove('active'));btn.classList.add('active');load(fmtDate(dt),false);};datesEl.appendChild(btn);}}
function getTime(ts){if(!ts)return '';let x=new Date(ts*1000);x.setHours(x.getHours()+1);return x.toISOString().slice(11,16);}
function sc(m){ if(m.status==='NS') return ''; return '<div class="score">'+m.score+'</div><div class="ftbadge">'+m.status+'</div>'; }
document.getElementById('refreshBtn').onclick=()=>load(fmtDate(selectedDate), true);
async function load(d, force){if(!d)d=fmtDate(selectedDate);list.innerHTML='<div style="text-align:center;padding:30px;color:#0f0">Loading '+d+'...</div>';let r=await fetch('/api/matches?date='+d+(force?'&refresh=1':''));let j=await r.json();allData=j.data||[];render(allData);}
function render(data){
if(!data.length){list.innerHTML='<div style="text-align:center;padding:40px;color:#666">No games</div>';return}
let h='';let lastKey='';
for(let m of data){
let key=m.country+' - '+m.league;
if(key!==lastKey){
h+='<div class="country"><span>'+key+'</span></div>';
lastKey=key;
}
h+='<div class="card"><div class="left"><div class="time">'+getTime(m.timestamp)+'</div><div class="teams"><div>'+m.home+'</div><div>'+m.away+'</div></div></div><div class="mid">'+sc(m)+'</div></div>';
}
list.innerHTML=h;
}
buildDates();load(fmtDate(selectedDate), false);
</script></body></html>`;
    return new Response(html, { headers:{...cors,"Content-Type":"text/html"}});
  }
}
