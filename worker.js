export default {
async fetch(request, env) {
const url = new URL(request.url);
const path = url.pathname;
const cors = {"Access-Control-Allow-Origin":"*"};
const getName = (v) => {
if(!v) return "";
if(typeof v==='string') return v;
if(typeof v==='object') return v.name || v.team_name || v.league_name || v.country || v.country_name || "";
return String(v);
};
const getTime = (m) => {
let t = m.time || m.kickoff || m.start_time || m.match_time || m.kickoff_time || "";
if(t && t.includes(":")) {
let hh = t.slice(0,5);
if(hh!=="00:00") return hh;
}
// try timestamp
if(m.timestamp || m.start_timestamp){
let ts = m.timestamp || m.start_timestamp;
let d = new Date(ts*1000);
if(!isNaN(d)) return d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Africa/Lagos'});
}
if(m.date && m.date.includes("T")){
let d = new Date(m.date);
if(!isNaN(d)) return d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Africa/Lagos'});
}
return t || "00:00";
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
league: getName(m.league_name||m.league||m.competition||m.tournament)||"League",
home: getName(m.home_team||m.home),
away: getName(m.away_team||m.away),
time: getTime(m),
rawTime: getTime(m),
status: getName(m.status)||"NS",
home_score: m.home_score,
away_score: m.away_score,
minute: m.minute||"",
isStarted: (m.home_score>0||m.away_score>0||String(m.status).toLowerCase().includes("live"))
}));
} else {
for (let k in j.data) {
if (!Array.isArray(j.data[k])) continue;
let parts = k.split(" - ");
let apiCountry = parts[0] ? parts[0].trim().toUpperCase() : "WORLD";
let apiLeague = parts.length>1 ? parts.slice(1).join(" - ").trim() : k.trim();
j.data[k].forEach(m=>{
let leagueFromMatch = getName(m.league_name||m.league||m.competition);
let countryFromMatch = getName(m.country||m.country_name);
// If API key is "MATCHES: MATCHES" or "WORLD - MATCHES", use league from match itself
let finalLeague = apiLeague;
let finalCountry = apiCountry;
if(apiLeague.toUpperCase()==="MATCHES" || apiCountry==="MATCHES"){
finalLeague = leagueFromMatch || apiLeague;
finalCountry = countryFromMatch ? countryFromMatch.toUpperCase() : "WORLD";
}
if(finalLeague.toUpperCase()==="MATCHES" && leagueFromMatch) finalLeague = leagueFromMatch;
if(finalCountry==="WORLD" && countryFromMatch) finalCountry = countryFromMatch.toUpperCase();

data.push({
id: String(m.id||Math.random()),
country: finalCountry || apiCountry,
league: finalLeague || apiLeague,
home: getName(m.home_team||m.home),
away: getName(m.away_team||m.away),
time: getTime(m),
status: getName(m.status)||"NS",
minute: m.minute||"",
home_score: m.home_score,
away_score: m.away_score,
isStarted: (m.home_score>0||m.away_score>0||String(m.status).toLowerCase().includes("live"))
});
});
}
}
}
// Remove the useless MATCHES:MATCHES header, keep real leagues
data = data.filter(m=> !(m.country==="MATCHES" && m.league==="MATCHES") );
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
.country-head{background:#000;color:#fff;padding:7px 10px;font-size:13px;font-weight:900;text-transform:uppercase;display:flex;justify-content:space-between;position:sticky;top:0}
.m{background:#fff;border-bottom:1px solid #ddd;padding:8px 10px;display:flex;align-items:center;gap:10px;cursor:pointer}
.m:active{background:#e8ffe8}
.time{width:50px;font-weight:700;font-size:13px}
.clubs{flex:1;line-height:1.4}
.club{font-size:13px}
.score-col{width:45px;text-align:right;font-weight:900;font-size:13px}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.85);display:none;align-items:center;justify-content:center;z-index:99;padding:15px}
.modal-bg.open{display:flex}
.modal{background:#fff;border:3px solid #00c853;border-radius:12px;width:100%;max-width:380px;padding:16px;color:#000}
.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;font-size:14px}
.close{background:#00c853;color:#000;border:none;width:100%;padding:11px;border-radius:8px;font-weight:900;margin-top:12px;cursor:pointer}
</style></head><body>
<div class="h"><b>DIAMOND LIVESCORE</b><span id="src" style="font-size:11px">LIVE</span></div>
<div class="dates" id="dates"></div>
<div id="list">Loading...</div>
<div class="modal-bg" id="bg"><div class="modal" id="modal"></div></div>
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
if(!all.length){list.innerHTML='<div style="padding:20px;text-align:center">No games for '+iso+'</div>';return;}
var g={};
all.forEach(function(m){
var key=(m.country+': '+m.league).toUpperCase();
if(key==='MATCHES: MATCHES' || key===': ' || key==='WORLD: MATCHES') key='OTHER: '+m.league;
if(!g[key]) g[key]=[];
g[key].push(m);
});
var out='';
for(var key in g){
var matches=g[key];
if(!key || key.includes('MATCHES: MATCHES')) continue;
out+='<div class="country-head"><span>'+key+'</span><u>STANDINGS</u></div>';
matches.forEach(function(m){
var scoreHTML=m.isStarted?'<div class="score-col">'+(m.home_score!=null?m.home_score:0)+'-'+(m.away_score!=null?m.away_score:0)+'</div>':'<div class="score-col">-</div>';
var live = m.minute ? ' <small style="color:red">'+m.minute+'</small>' : '';
out+='<div class="m" onclick="openM(\\''+m.id+'\\')"><div class="time">'+m.time+live+'</div><div class="clubs"><div class="club">'+m.home+'</div><div class="club">'+m.away+'</div></div>'+scoreHTML+'</div>';
});
}
list.innerHTML=out||'<div style="padding:20px;text-align:center">No valid leagues</div>';
}catch(e){list.innerHTML='Error '+e.message;}
}
function openM(id){
var m=null;for(var i=0;i<all.length;i++)if(all[i].id==id)m=all[i];if(!m)return;
var ft = m.isStarted ? (m.home_score+' - '+m.away_score) : '-';
document.getElementById('modal').innerHTML=
'<h3 style="text-align:center;margin:0 0 10px">'+m.country+': '+m.league+'</h3>'+
'<div style="text-align:center;padding:10px;background:#f5f5f5;border-radius:8px;font-weight:900;line-height:1.6">'+m.home+'<br><span style="font-size:20px">'+(m.isStarted?m.home_score+' - '+m.away_score:'vs')+'</span><br>'+m.away+'</div>'+
'<div class="row"><span>Country</span><b>'+m.country+'</b></div>'+
'<div class="row"><span>League</span><b>'+m.league+'</b></div>'+
'<div class="row"><span>Time</span><b>'+m.time+'</b></div>'+
'<div class="row"><span>Status</span><b>'+m.status+' '+(m.minute||'')+'</b></div>'+
'<div class="row"><span>Score</span><b>'+ft+'</b></div>'+
'<button class="close" onclick="closeM()">CLOSE</button>';
document.getElementById('bg').classList.add('open');
}
function closeM(){document.getElementById('bg').classList.remove('open');}
document.getElementById('bg').addEventListener('click',function(e){if(e.target.id=='bg')closeM();});
build();load(new Date().toISOString().slice(0,10));
<\/script></body></html>`, {headers:{"Content-Type":"text/html",...cors}});
}
}
