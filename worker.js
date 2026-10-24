export default {
async fetch(request, env) {
const url = new URL(request.url);
const path = url.pathname;
const cors = {"Access-Control-Allow-Origin":"*"};
const getName = (v) => {
if(!v) return "";
if(typeof v==='string') return v;
if(typeof v==='object') return v.name || v.team_name || v.displayName || v.league_name || v.country || "";
return String(v);
};
// COUNTRY FROM LEAGUE - fixes WORLD issue
const countryFromLeague = (league) => {
const L = (league||"").toLowerCase();
if(L.includes("premier league")||L.includes("championship")||L.includes("league one")||L.includes("league two")) return "ENGLAND";
if(L.includes("serie a")||L.includes("serie b")) return "ITALY";
if(L.includes("la liga")||L.includes("laliga")||L.includes("la.liga")||L.includes("segunda")) return "SPAIN";
if(L.includes("bundesliga")||L.includes("2. bundesliga")) return "GERMANY";
if(L.includes("ligue 1")||L.includes("ligue 2")) return "FRANCE";
if(L.includes("eredivisie")||L.includes("eerste divisie")) return "NETHERLANDS";
if(L.includes("primeira")||L.includes("liga portugal")) return "PORTUGAL";
if(L.includes("caf")||L.includes("champions")&&L.includes("afr")||L.includes("(tun)")||L.includes("(egy)")||L.includes("(mar)")) return "AFRICA";
if(L.includes("world cup")||L.includes("u17")||L.includes("world")) return "WORLD";
return "WORLD";
};
if (path === "/api/matches") {
const KEY = env.FOOTBALL_API_KEY || "088f79cadddb9cebccc50b31fc30ff16545878cde9bac042269d8a9bc6b16736";
try {
const r = await fetch("https://www.live-football-api.com/api/v1/matches?api_key=" + KEY);
const j = await r.json();
let raw = [];
if (j.data) {
if (Array.isArray(j.data)) raw = j.data;
else for (let k in j.data) if (Array.isArray(j.data[k])) { 
j.data[k].forEach(x=>{
let parts = k.split(" - ");
let lg = parts.length>1 ? parts.slice(1).join(" - ") : k;
x._league = lg;
x._country = countryFromLeague(lg);
});
raw=raw.concat(j.data[k]); 
}
}
const data = raw.map(m=>({
id: String(m.id||Math.random()),
country: m._country || countryFromLeague(m._league) || "WORLD",
league: m._league || getName(m.league_name) || "League",
home: getName(m.home_team||m.home)||"Home",
away: getName(m.away_team||m.away)||"Away",
time: (m.time||m.kickoff||"15:00").toString().slice(0,5),
status: getName(m.status)||"Live",
minute: (m.minute||"")+"",
home_score: m.home_score??0,
away_score: m.away_score??0,
ht: (typeof m.ht_score==='object' ? m.ht_score.home+"-"+m.ht_score.away : m.ht_score||"0-0")+"",
ft: (m.home_score??0)+"-"+(m.away_score??0)
}));
return new Response(JSON.stringify({count:data.length, data, debug:"credits:"+(j.credits_remaining||0)}), {headers:{"Content-Type":"application/json",...cors}});
} catch(e){ return new Response(JSON.stringify({error:e.message}), {headers:{"Content-Type":"application/json",...cors}}); }
}
return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
body{background:#e9e9e9;color:#000;font-family:system-ui;margin:0}
.h{background:#111;border-bottom:3px solid #00c853;padding:12px;display:flex;justify-content:space-between;color:#fff}
.h b{color:#00ff88}
.dates{display:flex;gap:6px;overflow:auto;padding:8px;background:#222}
.d{min-width:64px;background:#333;color:#fff;border-radius:10px;padding:6px;text-align:center;cursor:pointer;font-size:12px}
.d.active{background:#00c853;color:#000;font-weight:900}
.country-head{background:#000;color:#fff;padding:6px 10px;font-size:13px;font-weight:900;margin-top:0;border-top:2px solid #fff;text-transform:uppercase}
.country-head span{color:#00ff88}
.m{background:#fff;border-bottom:1px solid #ddd;padding:6px 10px;display:flex;gap:8px;font-size:13px;cursor:pointer}
.time{width:45px;color:#333;font-weight:700}
.team{flex:1}
.score{font-weight:900;color:#c00}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.9);display:none;align-items:center;justify-content:center;z-index:99;padding:15px}
.modal-bg.open{display:flex}
.modal{background:#fff;border:3px solid #00c853;border-radius:12px;width:100%;max-width:380px;padding:16px;color:#000}
.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee}
.close{background:#00c853;color:#000;border:none;width:100%;padding:10px;border-radius:8px;font-weight:900;margin-top:10px}
</style></head><body><div class="h"><b>DIAMOND LIVESCORE</b><span id="src" style="font-size:11px">LIVE</span></div><div class="dates" id="dates"></div><div id="list">Loading...</div><div class="modal-bg" id="bg"><div class="modal" id="modal"></div></div><script>
var dates=document.getElementById('dates');var list=document.getElementById('list');var all=[];
function build(){var h='';for(var i=-3;i<=4;i++){var d=new Date();d.setDate(d.getDate()+i);var iso=d.toISOString().slice(0,10);var lab=i==0?'TODAY':i==-1?'YEST':i==1?'TOM':d.toLocaleDateString('en',{weekday:'short'});var num=d.getDate()+' '+d.toLocaleDateString('en',{month:'short'});var act=i==0?' active':'';h+='<div class="d'+act+'" onclick="load(\\''+iso+'\\',this)"><small>'+lab+'</small><br><b>'+num+'</b></div>';}dates.innerHTML=h;}
async function load(iso,el){if(el){document.querySelectorAll('.d').forEach(t=>t.classList.remove('active'));el.classList.add('active');}list.innerHTML='Loading...';try{var r=await fetch('/api/matches?date='+iso);var j=await r.json();all=j.data;document.getElementById('src').innerText=j.count+' matches | '+j.debug;if(!j.data.length){list.innerHTML='No matches';return;}var g={};j.data.forEach(m=>{var k=(m.country+': '+m.league).toUpperCase();if(!g[k])g[k]=[];g[k].push(m);});var out='';for(var L in g){out+='<div class="country-head">'+L+' <span style="float:right;font-weight:400;text-decoration:underline">Standings</span></div>';g[L].forEach(m=>{var live=(m.status+'').toLowerCase().includes('live')||m.minute;var scoreText=m.home_score+'-'+m.away_score;if(m.status.toLowerCase().includes('half')||m.minute)scoreText='<span style="color:#090;font-weight:900">'+scoreText+'</span>';out+='<div class="m" onclick="openM(\\''+m.id+'\\')"><div class="time">'+m.time+'</div><div class="team">'+m.home+' - '+m.away+' <b class="score">'+(m.home_score||0)+'-'+(m.away_score||0)+'</b></div></div>';});}list.innerHTML=out;}catch(e){list.innerHTML='Error '+e.message;}}
function openM(id){var m=null;for(var i=0;i<all.length;i++)if(all[i].id==id)m=all[i];if(!m)return;document.getElementById('modal').innerHTML='<h3 style="text-align:center">'+m.country+': '+m.league+'</h3><div style="text-align:center;padding:10px;font-weight:900">'+m.home+' '+m.home_score+' - '+m.away_score+' '+m.away+'</div><div class="row"><span>Country</span><b>'+m.country+'</b></div><div class="row"><span>League</span><b>'+m.league+'</b></div><div class="row"><span>Time</span><b>'+m.time+'</b></div><div class="row"><span>Status</span><b>'+m.status+' '+m.minute+'</b></div><div class="row"><span>HT</span><b>'+m.ht+'</b></div><div class="row"><span>FT</span><b>'+m.ft+'</b></div><div class="row"><span>Correct HT</span><b>'+m.ht+'</b></div><div class="row"><span>Correct FT</span><b>'+m.ft+'</b></div><button class="close" onclick="closeM()">CLOSE</button>';document.getElementById('bg').classList.add('open');}
function closeM(){document.getElementById('bg').classList.remove('open');}
document.getElementById('bg').addEventListener('click',e=>{if(e.target.id=='bg')closeM();});
build();load(new Date().toISOString().slice(0,10));setInterval(()=>load(new Date().toISOString().slice(0,10)),30000);
<\/script></body></html>`, {headers:{"Content-Type":"text/html",...cors}});
}
}
