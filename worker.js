export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "*" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const API_KEY = "98a19520b228fd8dcff8459b07f0d569";
    function getPriority(leagueName, countryName){
      const l=(leagueName||"").toLowerCase().trim(); const c=(countryName||"").toLowerCase().trim();
      if(l.includes("u18")||l.includes("u19")||l.includes("u20")||l.includes("women")||l.includes("youth")) return { rank:999, displayCountry:null };
      if(l==="uefa champions league") return { rank:1, displayCountry:"EUROPE" };
      if(l==="uefa europa league") return { rank:2, displayCountry:"EUROPE" };
      if(l==="premier league" && c==="england") return { rank:10, displayCountry:"ENGLAND" };
      if(l.includes("la liga") && c==="spain") return { rank:11, displayCountry:"SPAIN" };
      if(l==="ligue 1" && c==="france") return { rank:12, displayCountry:"FRANCE" };
      if(l==="bundesliga" && c==="germany") return { rank:13, displayCountry:"GERMANY" };
      if(l==="serie a" && c==="italy") return { rank:14, displayCountry:"ITALY" };
      return { rank:999, displayCountry:null };
    }
    if(url.pathname==="/api/matches"){
      const date=url.searchParams.get("date")||"2026-10-26"; 
      const force=url.searchParams.get("refresh")==="1";
      const cacheKey=new Request("https://cache.local/FINAL-2627-ALL-"+date); 
      const cache=caches.default;
      if(!force){ const cached=await cache.match(cacheKey); if(cached) return new Response(await cached.text(), { headers:{...cors,"Content-Type":"application/json"}}); }
      const apiRes=await fetch("https://v3.football.api-sports.io/fixtures?date="+date,{headers:{"x-apisports-key":API_KEY}});
      const j=await apiRes.json(); 
      const data=[];
      for(const f of (j.response||[])){
        const league=f.league?.name||""; const country=f.league?.country||"WORLD"; const p=getPriority(league,country);
        data.push({ country:(p.displayCountry||country).toUpperCase(), league:league, leagueId:f.league?.id||0, season:2026, timestamp:f.fixture?.timestamp, status:f.fixture?.status?.short||"NS", elapsed:f.fixture?.status?.elapsed||"", home:f.teams?.home?.name||"", away:f.teams?.away?.name||"", score:(f.goals?.home??0)+"-"+(f.goals?.away??0), ht:(f.score?.halftime?.home??"-")+"-"+(f.score?.halftime?.away??"-"), ft:(f.score?.fulltime?.home??f.goals?.home??0)+"-"+(f.score?.fulltime?.away??f.goals?.away??0), longStatus:f.fixture?.status?.long||"NS", rank:p.rank });
      }
      data.sort((a,b)=> a.rank-b.rank || a.country.localeCompare(b.country));
      const txt=JSON.stringify({count:data.length,data:data}); 
      if(data.length>0) ctx.waitUntil(cache.put(cacheKey,new Response(txt,{headers:{"Content-Type":"application/json","Cache-Control":"max-age=300"}})));
      return new Response(txt,{headers:{...cors,"Content-Type":"application/json"}});
    }
    if(url.pathname==="/api/standings"){
      const league=url.searchParams.get("league");
      const cache=caches.default;
      const cacheKey=new Request("https://cache.local/FINAL-2627-STAND-"+league);
      const cached=await cache.match(cacheKey);
      if(cached) return new Response(await cached.text(), {headers:{...cors,"Content-Type":"application/json"}});
      const r=await fetch(`https://v3.football.api-sports.io/standings?league=${league}&season=2026`, {headers:{"x-apisports-key":API_KEY}});
      const j=await r.json();
      const txt=JSON.stringify(j);
      if(j.response && j.response.length>0) ctx.waitUntil(cache.put(cacheKey,new Response(txt,{headers:{"Content-Type":"application/json","Cache-Control":"max-age=86400"}})));
      return new Response(txt, {headers:{...cors,"Content-Type":"application/json"}});
    }
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND LIVESCORE</title><style>
body{margin:0;background:#000;color:#fff;font-family:Arial;font-weight:700}
header{position:sticky;top:0;background:#000;padding:10px 12px;border-bottom:2px solid #0f0;z-index:99}
.top b{color:#0f0;font-size:18px}.dates{display:flex;gap:8px;overflow-x:auto;margin-top:10px}.d{border:1px solid #333;background:#111;color:#888;padding:8px 14px;border-radius:20px;font-size:12px;white-space:nowrap;cursor:pointer}.d.active{background:#0f0;color:#000;font-weight:900}
.filters{display:flex;gap:8px;margin-top:12px;align-items:center}.f{border:1px solid #333;background:#111;color:#888;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer}.f.active{background:#fff;color:#000;font-weight:900}
.refresh{margin-left:auto;background:#000;border:1px solid #0f0;color:#0f0;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;font-weight:900}
.country{background:#00ff00 !important;color:#000 !important;padding:11px 12px;margin-top:12px;font-size:13px;border-left:4px solid #fff !important;display:flex;justify-content:space-between;font-weight:900;cursor:pointer}
.card{background:#111;border:1px solid #222;margin:6px 8px;border-radius:10px;padding:12px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}
.card.live{border-left:3px solid #0f0;background:#0f0f0f}.card.ft{border-left:3px solid #444}
.left{display:flex;gap:10px;align-items:center}.time{color:#0f0 !important;font-size:12px;min-width:50px;text-align:center;background:#000 !important;border:1px solid #0f0 !important;padding:5px 8px;border-radius:20px;font-weight:900}
.teams{line-height:20px;font-size:14px}.mid{text-align:right;min-width:70px}.score{font-size:18px;font-weight:900}.ftbadge{color:#fff;background:#333;padding:2px 8px;border-radius:10px;font-size:11px}
#modal,#standModal{position:fixed;inset:0;background:rgba(0,0,0,0.92);display:none;z-index:999;align-items:flex-end}
#modal.show,#standModal.show{display:flex}.modal-box{background:#151515;width:100%;max-height:90vh;overflow:auto;border-radius:20px 20px 0 0;border-top:2px solid #0f0;padding:16px}
.modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.modal-head b{color:#0f0;font-size:13px}.close{color:#fff;border:1px solid #333;background:#222;padding:6px 14px;border-radius:20px;cursor:pointer}
.teamRow{display:flex;justify-content:space-between;padding:12px 0;font-size:18px;border-bottom:1px solid #222}
.resultGrid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:18px;text-align:center}.rBox{background:#0e0e0e;border:1px solid #333;padding:14px 6px;border-radius:14px}.rBox span{color:#888;font-size:10px;display:block;margin-bottom:6px}.rBox b{color:#0f0;font-size:20px}
.tableWrap{overflow-x:auto;width:100%;-webkit-overflow-scrolling:touch;border:1px solid #222;border-radius:10px}
table{width:100%;border-collapse:collapse;min-width:550px}
th{color:#888;font-size:10px;text-align:center;padding:10px 6px;border-bottom:1px solid #333;background:#151515;position:sticky;top:0}
th:nth-child(2){text-align:left;position:sticky;left:0;background:#151515;z-index:3}
td{padding:10px 6px;font-size:12px;border-bottom:1px solid #222;text-align:center;white-space:nowrap}
td:nth-child(2){text-align:left;position:sticky;left:0;background:#151515;font-weight:700;z-index:2;min-width:90px}
td:first-child{color:#0f0;font-weight:900}.pts{color:#0f0 !important;font-weight:900;background:#002200;border-radius:8px}.form span{padding:2px 4px;border-radius:4px;font-size:10px;margin:0 1px}.W{background:#0f0;color:#000}.D{background:#555;color:#fff}.L{background:#f00;color:#fff}
</style></head><body>
<header><div class="top"><b>DIAMOND LIVESCORE</b></div><div class="dates" id="dates"></div><div class="filters"><div class="f active" id="f-all">All Games</div><div class="f" id="f-live">Live</div><div class="f" id="f-ft">Finished</div><div class="refresh" id="refreshBtn">Refresh</div></div></header>
<div id="list">Loading...</div>
<div id="modal"><div class="modal-box"><div class="modal-head"><b id="mLeague">Match</b><div class="close" onclick="document.getElementById('modal').classList.remove('show')">Close</div></div><div id="mTeams"></div><div class="resultGrid"><div class="rBox"><span>HALF TIME</span><b id="mHT">-</b></div><div class="rBox"><span>FULL TIME</span><b id="mFT">-</b></div><div class="rBox"><span>STATUS</span><b id="mST" style="font-size:11px">-</b></div></div></div></div>
<div id="standModal"><div class="modal-box"><div class="modal-head"><b id="sLeague">2026/2027 Standings</b><div class="close" onclick="document.getElementById('standModal').classList.remove('show')">Close</div></div><div class="tableWrap" id="sTable">Loading 2026/2027...</div><div style="color:#0f0;font-size:10px;margin-top:10px;text-align:center">← Team name sticks, scroll → to see GF GA GD Pts Form</div></div></div>
<script>
const list=document.getElementById('list');const datesEl=document.getElementById('dates');let selectedDate=new Date();let allData=[];let currentFilter='all';
function fmtDate(d){return d.toISOString().slice(0,10)}function dayLabel(d,i){const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];if(i===0)return 'Today';return days[d.getDay()]+' '+String(d.getDate()).padStart(2,'0');}
function buildDates(){datesEl.innerHTML='';for(let i=-1;i<=1;i++){let dt=new Date();dt.setDate(dt.getDate()+i);let btn=document.createElement('div');btn.className='d'+(i===0?' active':'');btn.textContent=dayLabel(dt,i);btn.onclick=function(){selectedDate=dt;document.querySelectorAll('.d').forEach(x=>x.classList.remove('active'));btn.classList.add('active');load(fmtDate(dt),false);};datesEl.appendChild(btn);}}
function getTime(ts){if(!ts)return '';let x=new Date(ts*1000);x.setHours(x.getHours()+1);return x.toISOString().slice(11,16);}
function sc(m){ if(m.status==='NS') return ''; return '<div class="score">'+m.score+'</div><div class="ftbadge">'+m.status+'</div>'; }
function setFilter(t){currentFilter=t;document.querySelectorAll('.f').forEach(x=>x.classList.remove('active'));document.getElementById('f-'+t).classList.add('active');render(allData);}
document.getElementById('f-all').onclick=()=>setFilter('all');document.getElementById('f-live').onclick=()=>setFilter('live');document.getElementById('f-ft').onclick=()=>setFilter('ft');document.getElementById('refreshBtn').onclick=()=>load(fmtDate(selectedDate), true);
async function load(d, force){if(!d)d=fmtDate(selectedDate);list.innerHTML='<div style="text-align:center;padding:30px;color:#0f0">Loading '+d+'...</div>';let r=await fetch('/api/matches?date='+d+(force?'&refresh=1':''));let j=await r.json();allData=j.data||[];render(allData);}
function render(data){
let filtered=data;if(currentFilter==='live')filtered=data.filter(m=>m.elapsed!=='' && m.status!=='FT');if(currentFilter==='ft')filtered=data.filter(m=>m.status==='FT');if(!filtered.length){list.innerHTML='<div style="text-align:center;padding:40px;color:#666">No '+currentFilter+' matches</div>';return}
let h='';let lc='';let ll='';
for(let m of filtered){
if(m.country!==lc || m.league!==ll){
h+='<div class="country" data-league="'+m.leagueId+'" data-season="2026" data-name="'+m.country+' - '+m.league+'"><span>'+m.country+' - '+m.league+'</span><span>TABLE 26/27 ▸</span></div>';lc=m.country;ll=m.league;
}
let cls=m.status==='FT'?'card ft':(m.elapsed!==''?'card live':'card');let realIdx=allData.indexOf(m);
h+='<div class="'+cls+'" data-i="'+realIdx+'"><div class="left"><div class="time">'+getTime(m.timestamp)+'</div><div class="teams"><div>'+m.home+'</div><div>'+m.away+'</div></div></div><div class="mid">'+sc(m)+'</div></div>';
}
list.innerHTML=h;
document.querySelectorAll('.card').forEach(el=>el.onclick=()=>openMatch(parseInt(el.dataset.i)));
document.querySelectorAll('.country').forEach(el=>el.onclick=()=>openStanding(el.dataset.league,'2026',el.dataset.name));
}
function openMatch(i){let m=allData[i];if(!m)return;document.getElementById('mLeague').textContent=m.country+' - '+m.league;let s=m.score.split('-');document.getElementById('mTeams').innerHTML='<div class="teamRow"><span>'+m.home+'</span><b>'+s[0]+'</b></div><div class="teamRow"><span>'+m.away+'</span><b>'+s[1]+'</b></div>';document.getElementById('mHT').textContent=m.ht;document.getElementById('mFT').textContent=m.ft;document.getElementById('mST').textContent=m.longStatus;document.getElementById('modal').classList.add('show');}
async function openStanding(leagueId, season, name){
document.getElementById('sLeague').textContent=name+' - 2026/2027';
document.getElementById('sTable').innerHTML='Loading 2026/2027...';
document.getElementById('standModal').classList.add('show');
let r=await fetch('/api/standings?league='+leagueId+'&season='+season);
let j=await r.json();
let standings=j.response?.[0]?.league?.standings?.[0];
if(!standings){document.getElementById('sTable').innerHTML='No 2026/27 table - cup competition';return;}
let html='<table><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th><th>Form</th></tr>';
standings.forEach(s=>{
let form=(s.form||'').slice(-5).split('').map(f=>'<span class="'+f+'">'+f+'</span>').join('');
html+='<tr><td>'+s.rank+'</td><td>'+s.team.name+'</td><td>'+s.all.played+'</td><td>'+s.all.win+'</td><td>'+s.all.draw+'</td><td>'+s.all.lose+'</td><td>'+s.all.goals.for+'</td><td>'+s.all.goals.against+'</td><td>'+s.goalsDiff+'</td><td class="pts">'+s.points+'</td><td class="form">'+form+'</td></tr>';
});
document.getElementById('sTable').innerHTML=html+'</table>';
}
buildDates();load(fmtDate(selectedDate), false);
</script></body></html>`;
    return new Response(html, { headers:{...cors,"Content-Type":"text/html"}});
  }
}
