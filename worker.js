export default {
async fetch(request, env) {
const url = new URL(request.url);
const path = url.pathname;
const cors = {"Access-Control-Allow-Origin":"*"};
const getName = (v) => {
if(!v) return "";
if(typeof v==='string') return v;
if(typeof v==='object') return v.name || v.team_name || v.league_name || v.country || "";
return String(v);
};
if (path === "/api/matches") {
const KEY = env.FOOTBALL_API_KEY || "088f79cadddb9cebccc50b31fc30ff16545878cde9bac042269d8a9bc6b16736";
const date = url.searchParams.get("date") || new Date().toISOString().slice(0,10);
try {
const r = await fetch("https://www.live-football-api.com/api/v1/matches?api_key=" + KEY + "&date=" + date);
const j = await r.json();
let data = [];
if (j.data) {
if (Array.isArray(j.data)) {
data = j.data.map(m=>({
id: String(m.id||Math.random()),
country: getName(m.country||m.country_name||m.area||"").toUpperCase() || "WORLD",
league: getName(m.league_name||m.league||m.competition)||"League",
home: getName(m.home_team||m.home)||"Home",
away: getName(m.away_team||m.away)||"Away",
time: (m.time||"00:00").toString().slice(0,5),
home_score: m.home_score,
away_score: m.away_score,
isStarted: (m.home_score>0||m.away_score>0)
}));
} else {
// API grouped like "ITALY - SERIE B": [matches], "BRAZIL - SERIE B": [matches]
for (let k in j.data) {
if (!Array.isArray(j.data[k])) continue;
let parts = k.split(" - ");
let apiCountry = parts[0] ? parts[0].trim().toUpperCase() : "WORLD";
let apiLeague = parts.length>1 ? parts.slice(1).join(" - ").trim() : k.trim();
j.data[k].forEach(m=>{
data.push({
id: String(m.id||Math.random()),
country: getName(m.country||apiCountry).toUpperCase(),
league: getName(m.league_name||apiLeague),
home: getName(m.home_team||m.home),
away: getName(m.away_team||m.away),
time: (m.time||"00:00").toString().slice(0,5),
home_score: m.home_score,
away_score: m.away_score,
isStarted: (m.home_score>0||m.away_score>0)
});
});
}
}
}
return new Response(JSON.stringify({count:data.length, data}), {headers:{"Content-Type":"application/json",...cors}});
} catch(e){ return new Response(JSON.stringify({count:0, data:[], error:e.message}), {headers:{"Content-Type":"application/json",...cors}}); }
}
return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
body{background:#f2f2f2;color:#000;font-family:system-ui;margin:0}
.h{background:#111;color:#fff;padding:12px;display:flex;justify-content:space-between;border-bottom:3px solid #00c853}
.h b{color:#00ff88}
.dates{display:flex;gap:6px;overflow:auto;padding:8px;background:#222}
.d{min-width:64px;background:#333;color:#fff;border-radius:10px;padding:6px;text-align:center;cursor:pointer;font-size:11px}
.d.active{background:#00c853;color:#000;font-weight:900}
.country-head{background:#000;color:#fff;padding:7px 10px;font-size:13px;font-weight:900;text-transform:uppercase;display:flex;justify-content:space-between}
.m{background:#fff;border-bottom:1px solid #ddd;padding:8px 10px;display:flex;align-items:center;gap:10px}
.time{width:44px;font-weight:700}
.clubs{flex:1;line-height:1.4}
.club{font-size:13px}
.score-col{width:36px;text-align:right;font-weight:900}
</style></head><body>
<div class="h"><b>DIAMOND LIVESCORE</b><span id="src" style="font-size:11px">LIVE</span></div>
<div class="dates" id="dates"></div>
<div id="list">Loading...</div>
<script>
var dates=document.getElementById('dates');var list=document.getElementById('list');var all=[];
function build(){var h='';for(var i=-3;i<=4;i++){var d=new Date();d.setDate(d.getDate()+i);var iso=d.toISOString().slice(0,10);var lab=i==0?'TODAY':i==-1?'YEST':i==1?'TOM':d.toLocaleDateString('en',{weekday:'short'});var num=d.getDate()+' '+d.toLocaleDateString('en',{month:'short'});var act=i==0?' active':'';h+='<div class="d'+act+'" onclick="load(\\''+iso+'\\',this)"><small>'+lab+'</small><br><b>'+num+'</b></div>';}dates.innerHTML=h;}
async function load(iso,el){
if(el){document.querySelectorAll('.d').forEach(t=>t.classList.remove('active'));el.classList.add('active');}
list.innerHTML='Loading '+iso+'...';
try{
var r=await fetch('/api/matches?date='+iso);
var j=await r.json();
all=j.data||[];
document.getElementById('src').innerText=(j.count||0)+' matches';
if(!all.length){list.innerHTML='<div style="padding:20px;text-align:center">No games</div>';return;}
var g={};
all.forEach(function(m){
var key=(m.country+': '+m.league).toUpperCase();
if(!g[key]) g[key]=[];
g[key].push(m);
});
var out='';
for(var key in g){
var matches=g[key];
out+='<div class="country-head"><span>'+key+'</span><u>STANDINGS</u></div>';
matches.forEach(function(m){
var scoreHTML=m.isStarted?'<div class="score-col">'+m.home_score+'-'+m.away_score+'</div>':'<div class="score-col">-</div>';
out+='<div class="m"><div class="time">'+m.time+'</div><div class="clubs"><div class="club">'+m.home+'</div><div class="club">'+m.away+'</div></div>'+scoreHTML+'</div>';
});
}
list.innerHTML=out;
}catch(e){list.innerHTML='Error '+e.message;}
}
build();load(new Date().toISOString().slice(0,10));
<\/script></body></html>`, {headers:{"Content-Type":"text/html",...cors}});
}
}
