export default {
async fetch(request, env) {
const url = new URL(request.url);
const path = url.pathname;
const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,OPTIONS","Access-Control-Allow-Headers":"*"};
if(request.method==="OPTIONS") return new Response("",{headers:cors});

const getName = (v) => {
if(!v) return "";
if(typeof v==='string') return v;
if(typeof v==='object') return v.name || v.team_name || v.league_name || v.country || v.country_name || "";
return String(v);
};
const getTime = (m) => {
if(m.minute) return m.minute+"'";
let t = m.time || m.kickoff || m.start_time || "";
if(t && t.includes(":") && t.slice(0,5)!=="00:00") return t.slice(0,5);
if(m.timestamp){let d=new Date(m.timestamp*1000); return d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Africa/Lagos'});}
if(m.date && m.date.includes("T")){let d=new Date(m.date); if(!isNaN(d)) return d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Africa/Lagos'});}
return "00:00";
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
for(let m of j.data){
data.push({
id: String(m.id||Math.random()),
country: getName(m.country||m.country_name||"WORLD").toUpperCase(),
league: getName(m.league_name||m.league||"League"),
home: getName(m.home_team||m.home),
away: getName(m.away_team||m.away),
time: getTime(m),
minute: m.minute||"",
home_score: m.home_score,
away_score: m.away_score,
isLive: String(m.status||"").toLowerCase().includes("live")
});
}
} else {
// LET API ARRANGE - THIS IS THE KEY
for (let k in j.data) {
if (!Array.isArray(j.data[k])) continue;
let parts = k.split(" - ");
let apiCountry = parts[0] ? parts[0].trim().toUpperCase() : "WORLD";
let apiLeague = parts.length>1 ? parts.slice(1).join(" - ").trim() : k.trim();
for(let m of j.data[k]){
let leagueFromMatch = getName(m.league_name||m.league||"");
let countryFromMatch = getName(m.country||"").toUpperCase();
let finalLeague = leagueFromMatch || apiLeague;
let finalCountry = countryFromMatch || apiCountry;
data.push({
id: String(m.id||Math.random()),
country: finalCountry,
league: finalLeague,
home: getName(m.home_team||m.home),
away: getName(m.away_team||m.away),
time: getTime(m),
minute: m.minute||"",
home_score: m.home_score,
away_score: m.away_score,
isLive: String(m.status||"").toLowerCase().includes("live")
});
}
}
}
}
return new Response(JSON.stringify({count:data.length, data}), {headers:{"Content-Type":"application/json",...cors}});
} catch(e){ return new Response(JSON.stringify({count:0, data:[], error:e.message}), {headers:{"Content-Type":"application/json",...cors}}); }
}

return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Diamond Livescore</title><style>
*{box-sizing:border-box}
body{background:#e9ecef;color:#000;font-family:system-ui,Arial,sans-serif;margin:0;font-size:14px}
.h{background:#0a0a0a;color:#fff;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:4px solid #00c853;position:sticky;top:0;z-index:10}
.h b{color:#00e676;font-size:18px;letter-spacing:0.5px}
.h span{color:#aaa;font-size:11px;background:#1a1a1a;padding:5px 10px;border-radius:20px;border:1px solid #00c853}
.dates{display:flex;gap:6px;overflow:auto;padding:10px;background:#121212;white-space:nowrap}
.d{min-width:68px;background:#1f1f1f;color:#bbb;border:1px solid #333;border-radius:10px;padding:7px 4px;text-align:center;cursor:pointer;font-size:11px}
.d b{color:#fff;display:block;margin-top:2px}
.d.active{background:#00c853;color:#000;border-color:#00c853;font-weight:900}
.d.active b{color:#000}
.country-bar{background:#000;color:#fff;padding:8px 10px;font-weight:900;font-size:13px;text-transform:uppercase;display:flex;justify-content:space-between;align-items:center;border-left:5px solid #00c853;border-bottom:1px solid #222}
.country-bar u{font-weight:700;text-decoration:none;color:#00e676;border:1px solid #00e676;padding:3px 8px;border-radius:4px;font-size:11px;cursor:pointer}
.match-row{display:flex;align-items:center;gap:8px;padding:9px 10px;border-bottom:1px solid #dee2e6;background:#fff;cursor:pointer}
.match-row:active{background:#d4edda}
.t{width:52px;font-size:13px;font-weight:800;color:#111;flex-shrink:0}
.t.live{color:#c00}
.teams{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:13.5px}
.score{width:38px;text-align:right;font-weight:800;color:#0033cc;flex-shrink:0}
.score.live{color:#c00}
.score.dash{color:#888;font-weight:400}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.85);display:none;align-items:center;justify-content:center;z-index:99;padding:16px}
.modal-bg.open{display:flex}
.modal{background:#fff;width:100%;max-width:380px;border-radius:10px;overflow:hidden;border:3px solid #00c853}
.modal-head{background:#000;color:#fff;padding:10px 12px;font-weight:800;display:flex;justify-content:space-between;border-bottom:3px solid #00c853}
.modal-head span:first-child{color:#00e676}
.modal-body{padding:14px}
.close{background:#00c853;color:#000;border:none;width:100%;padding:11px;border-radius:6px;font-weight:900;margin-top:12px;cursor:pointer}
</style></head><body>
<div class="h"><b>DIAMOND LIVESCORE</b><span id="src">0 matches</span></div>
<div class="dates" id="dates"></div>
<div id="list" style="padding-bottom:20px">Loading...</div>
<div class="modal-bg" id="bg"><div class="modal" id="modal"></div></div>
<script>
var dates=document.getElementById('dates');var list=document.getElementById('list');var all=[];
function build(){var h='';for(var i=-3;i<=4;i++){var d=new Date();d.setDate(d.getDate()+i);var iso=d.toISOString().slice(0,10);var lab=i==0?'TODAY':i==-1?'YEST':i==1?'TOM':d.toLocaleDateString('en',{weekday:'short'});var num=d.getDate()+' '+d.toLocaleDateString('en',{month:'short'});var act=i==0?' active':'';h+='<div class="d'+act+'" onclick="load(\\''+iso+'\\',this)"><small>'+lab+'</small><b>'+num+'</b></div>';}dates.innerHTML=h;}
async function load(iso,el){
if(el){document.querySelectorAll('.d').forEach(t=>t.classList.remove('active'));el.classList.add('active');}
list.innerHTML='<div style="padding:20px;text-align:center;color:#666">Loading '+iso+'...</div>';
try{
var r=await fetch('/api/matches?date='+iso);
var j=await r.json();
all=j.data||[];
document.getElementById('src').innerText=(j.count||0)+' matches';
if(!all.length){list.innerHTML='<div style="padding:20px;text-align:center">No games for '+iso+'</div>';return;}
var g={};
all.forEach(function(m){
var key=(m.country+': '+m.league).toUpperCase();
if(!g[key]) g[key]=[];
g[key].push(m);
});
var out='';
for(var key in g){
var matches=g[key];
out+='<div class="country-bar"><span>'+key+'</span><u>STANDINGS</u></div>';
matches.forEach(function(m){
var isLive=m.isLive|| (m.minute && parseInt(m.minute)>0);
var timeText=m.minute?m.minute+"'":m.time;
var tClass=isLive?'t live':'t';
var hasScore=(m.home_score!=null && m.away_score!=null && m.home_score!=='' && m.away_score!=='');
var scoreText=hasScore?m.home_score+'-'+m.away_score:'-';
var sClass=hasScore?(isLive?'score live':'score'):'score dash';
out+='<div class="match-row" onclick="openM(\\''+m.id+'\\')"><div class="'+tClass+'">'+timeText+'</div><div class="teams">'+m.home+' - '+m.away+'</div><div class="'+sClass+'">'+scoreText+'</div></div>';
});
}
list.innerHTML=out;
}catch(e){list.innerHTML='Error '+e.message;}
}
function openM(id){var m=null;for(var i=0;i<all.length;i++)if(all[i].id==id)m=all[i];if(!m)return;document.getElementById('modal').innerHTML='<div class="modal-head"><span>'+m.country+': '+m.league+'</span><span onclick="closeM()" style="cursor:pointer">✕</span></div><div class="modal-body"><div style="text-align:center;background:#f5f5f5;padding:12px;border-radius:8px"><b>'+m.home+'</b><br><span style="font-size:24px;font-weight:900;color:#00a651;margin:6px 0;display:block">'+(m.home_score!=null?m.home_score+' - '+m.away_score:'vs')+'</span><b>'+m.away+'</b></div><div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee"><span>Country</span><b style="color:#00a651">'+m.country+'</b></div><div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee"><span>League</span><b>'+m.league+'</b></div><div style="display:flex;justify-content:space-between;padding:8px 0"><span>Time</span><b>'+m.time+'</b></div><button class="close" onclick="closeM()">CLOSE</button></div>';document.getElementById('bg').classList.add('open');}
function closeM(){document.getElementById('bg').classList.remove('open');}
document.getElementById('bg').addEventListener('click',function(e){if(e.target.id=='bg')closeM();});
build();load(new Date().toISOString().slice(0,10));
<\/script></body></html>`, {headers:{"Content-Type":"text/html",...cors}});
}
}
