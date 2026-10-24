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
if(m.minute) return m.minute+"'";
if(m.status && String(m.status).match(/^\d+/)) return String(m.status).includes("'") ? m.status : m.status+"'";
let t = m.time || m.kickoff || m.start_time || "";
if(t && t.includes(":") && t.slice(0,5)!=="00:00") return t.slice(0,5);
if(m.timestamp){
let d = new Date((m.timestamp*1000));
return d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Africa/Lagos'});
}
if(m.date && m.date.includes("T")){
let d = new Date(m.date);
if(!isNaN(d)) return d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Africa/Lagos'});
}
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
data = j.data.map(m=>({
id: String(m.id||Math.random()),
country: getName(m.country||m.country_name||"").toUpperCase() || "WORLD",
league: getName(m.league_name||m.league||"")||"League",
home: getName(m.home_team||m.home),
away: getName(m.away_team||m.away),
time: getTime(m),
minute: m.minute || (String(m.status||"").match(/^\d+/) ? m.status : ""),
status: getName(m.status)||"",
home_score: m.home_score,
away_score: m.away_score,
isLive: String(m.status||"").toLowerCase().includes("live") || (m.minute>0)
}));
} else {
for (let k in j.data) {
if (!Array.isArray(j.data[k])) continue;
let parts = k.split(" - ");
let apiCountry = parts[0] ? parts[0].trim().toUpperCase() : "WORLD";
let apiLeague = parts.length>1 ? parts.slice(1).join(" - ").trim() : k.trim();
j.data[k].forEach(m=>{
let leagueFromMatch = getName(m.league_name||m.league||"");
let countryFromMatch = getName(m.country||m.country_name||"");
let finalLeague = leagueFromMatch || apiLeague;
let finalCountry = countryFromMatch ? countryFromMatch.toUpperCase() : apiCountry;
if(finalCountry==="MATCHES" && countryFromMatch) finalCountry = countryFromMatch.toUpperCase();
if(finalLeague.toUpperCase()==="MATCHES" && leagueFromMatch) finalLeague = leagueFromMatch;
data.push({
id: String(m.id||Math.random()),
country: finalCountry,
league: finalLeague,
home: getName(m.home_team||m.home),
away: getName(m.away_team||m.away),
time: getTime(m),
minute: m.minute || "",
status: getName(m.status)||"",
home_score: m.home_score,
away_score: m.away_score,
isLive: String(m.status||"").toLowerCase().includes("live") || (m.minute>0)
});
});
}
}
}
data = data.filter(m=> !(m.country==="MATCHES" && m.league==="MATCHES"));
return new Response(JSON.stringify({count:data.length, data}), {headers:{"Content-Type":"application/json",...cors}});
} catch(e){ return new Response(JSON.stringify({count:0, data:[], error:e.message}), {headers:{"Content-Type":"application/json",...cors}}); }
}
return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
*{box-sizing:border-box}
body{background:#fff;color:#000;font-family:Arial,Helvetica,sans-serif;margin:0;font-size:14px}
.h{background:#111;color:#fff;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #00c853}
.h b{color:#00ff88;font-size:18px}
.dates{display:flex;gap:6px;overflow:auto;padding:8px;background:#222;white-space:nowrap}
.d{min-width:70px;background:#333;color:#fff;border-radius:8px;padding:6px;text-align:center;cursor:pointer;font-size:11px;line-height:1.2}
.d.active{background:#00c853;color:#000;font-weight:900}
.country-bar{background:#000;color:#fff;padding:5px 8px;font-weight:700;font-size:13px;text-transform:uppercase;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333}
.country-bar span:last-child{font-weight:400;text-decoration:underline;cursor:pointer;font-size:12px}
.match-row{display:flex;align-items:center;gap:8px;padding:6px 8px;border-bottom:1px solid #e5e5e5;background:#fff;cursor:pointer}
.match-row:active{background:#e8ffe8}
.t{width:48px;font-size:13px;font-weight:400;flex-shrink:0}
.t.live{color:#cc0000;font-weight:700}
.teams{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.teams b{font-weight:400}
.score{width:50px;text-align:right;font-weight:700;flex-shrink:0;color:#0033cc}
.score.live{color:#cc0000}
.score.dash{color:#000;font-weight:400}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.85);display:none;align-items:center;justify-content:center;z-index:99;padding:15px}
.modal-bg.open{display:flex}
.modal{background:#fff;border:2px solid #000;border-radius:4px;width:100%;max-width:400px;padding:0;overflow:hidden}
.modal-head{background:#000;color:#fff;padding:8px 10px;font-weight:700;font-size:13px;display:flex;justify-content:space-between}
.modal-body{padding:12px}
.close{background:#00c853;color:#000;border:none;width:100%;padding:10px;border-radius:4px;font-weight:900;margin-top:10px;cursor:pointer}
</style></head><body>
<div class="h"><b>DIAMOND LIVESCORE</b><span id="src" style="font-size:11px;color:#ccc">0 matches</span></div>
<div class="dates" id="dates"></div>
<div id="list">Loading...</div>
<div class="modal-bg" id="bg"><div class="modal" id="modal"></div></div>
<script>
var dates=document.getElementById('dates');var list=document.getElementById('list');var all=[];
function build(){var h='';for(var i=-3;i<=4;i++){var d=new Date();d.setDate(d.getDate()+i);var iso=d.toISOString().slice(0,10);var lab=i==0?'TODAY':i==-1?'YEST':i==1?'TOM':d.toLocaleDateString('en',{weekday:'short'});var num=d.getDate()+' '+d.toLocaleDateString('en',{month:'short'});var act=i==0?' active':'';h+='<div class="d'+act+'" onclick="load(\\''+iso+'\\',this)"><div>'+lab+'</div><b>'+num+'</b></div>';}dates.innerHTML=h;}
async function load(iso,el){
if(el){document.querySelectorAll('.d').forEach(t=>t.classList.remove('active'));el.classList.add('active');}
list.innerHTML='<div style="padding:15px;text-align:center">Loading '+iso+'...</div>';
try{
var r=await fetch('/api/matches?date='+iso);
var j=await r.json();
all=j.data||[];
document.getElementById('src').innerText=(j.count||0)+' matches';
if(!all.length){list.innerHTML='<div style="padding:20px;text-align:center">No games for '+iso+'</div>';return;}
var g={};
all.forEach(function(m){
// Let API arrange country and league
var key=(m.country+': '+m.league).toUpperCase();
if(key.includes('MATCHES: MATCHES')) key='OTHER: '+m.league;
if(!g[key]) g[key]=[];
g[key].push(m);
});
var out='';
for(var key in g){
var matches=g[key];
if(!key || key==='OTHER: MATCHES' || key===': ') continue;
out+='<div class="country-bar"><span>'+key+'</span><span>Standings</span></div>';
matches.forEach(function(m){
var isLive = m.isLive || (m.minute && parseInt(m.minute)>0);
var timeClass = isLive ? 't live' : 't';
var timeText = m.minute ? m.minute+"'" : m.time;
var hasScore = (m.home_score!=null && m.away_score!=null && (m.home_score!=='' || m.away_score!==''));
var scoreText = hasScore ? (m.home_score+'-'+m.away_score) : '-';
var scoreClass = hasScore ? (isLive ? 'score live' : 'score') : 'score dash';
out+='<div class="match-row" onclick="openM(\\''+m.id+'\\')"><div class="'+timeClass+'">'+timeText+'</div><div class="teams">'+m.home+' - '+m.away+'</div><div class="'+scoreClass+'">'+scoreText+'</div></div>';
});
}
list.innerHTML=out;
}catch(e){list.innerHTML='Error '+e.message;}
}
function openM(id){
var m=null;for(var i=0;i<all.length;i++)if(all[i].id==id)m=all[i];if(!m)return;
var score = (m.home_score!=null)? m.home_score+' - '+m.away_score : '-';
document.getElementById('modal').innerHTML=
'<div class="modal-head"><span>'+m.country+': '+m.league+'</span><span onclick="closeM()" style="cursor:pointer">X</span></div>'+
'<div class="modal-body">'+
'<div style="text-align:center;padding:10px;background:#f5f5f5;border-radius:4px;margin-bottom:10px"><b>'+m.home+'</b><br><span style="font-size:22px;font-weight:900">'+(m.home_score!=null?m.home_score+' - '+m.away_score:'vs')+'</span><br><b>'+m.away+'</b></div>'+
'<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee"><span>Time</span><b>'+m.time+'</b></div>'+
'<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee"><span>League</span><b>'+m.league+'</b></div>'+
'<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee"><span>Country</span><b>'+m.country+'</b></div>'+
'<div style="display:flex;justify-content:space-between;padding:6px 0"><span>Score</span><b>'+score+'</b></div>'+
'<button class="close" onclick="closeM()">CLOSE</button>'+
'</div>';
document.getElementById('bg').classList.add('open');
}
function closeM(){document.getElementById('bg').classList.remove('open');}
document.getElementById('bg').addEventListener('click',function(e){if(e.target.id=='bg')closeM();});
build();load(new Date().toISOString().slice(0,10));
<\/script></body></html>`, {headers:{"Content-Type":"text/html",...cors}});
}
}
