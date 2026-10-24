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
const getCountry = (league, countryField) => {
if(countryField && typeof countryField==='string' && countryField.toLowerCase()!=='world') return countryField.toUpperCase();
let L=(league||"").toLowerCase();
if(L.includes("premier")||L.includes("championship")||L.includes("england")||L.includes("fa cup")||L.includes("efl")) return "ENGLAND";
if(L.includes("serie")||L.includes("coppa")||L.includes("italy")||L.includes("italian")) return "ITALY";
if(L.includes("la liga")||L.includes("laliga")||L.includes("segunda")||L.includes("spain")||L.includes("copa del rey")) return "SPAIN";
if(L.includes("bundesliga")||L.includes("germany")||L.includes("dfb")) return "GERMANY";
if(L.includes("ligue")||L.includes("france")) return "FRANCE";
if(L.includes("eredivisie")||L.includes("netherlands")) return "NETHERLANDS";
if(L.includes("primeira")||L.includes("portugal")) return "PORTUGAL";
if(L.includes("brasil")||L.includes("brazil")||L.includes("serie b")||L.includes("paulista")||L.includes("carioca")) return "BRAZIL";
if(L.includes("liga mx")||L.includes("mexico")||L.includes("ascenso")) return "MEXICO";
if(L.includes("mls")||L.includes("usl")||L.includes("usa")) return "USA";
if(L.includes("caf")||L.includes("botola")||L.includes("ligue pro")||L.includes("tunisia")||L.includes("egypt")||L.includes("morocco")||L.includes("tanzania")) return "AFRICA";
if(L.includes("colombia")||L.includes("argentina")||L.includes("chile")||L.includes("peru")||L.includes("ecuador")) return "SOUTH AMERICA";
return (countryField||"").toUpperCase() || "WORLD";
};
if (path === "/api/matches") {
const KEY = env.FOOTBALL_API_KEY || "088f79cadddb9cebccc50b31fc30ff16545878cde9bac042269d8a9bc6b16736";
try {
const r = await fetch("https://www.live-football-api.com/api/v1/matches?api_key=" + KEY);
const j = await r.json();
let raw = [];
if (j.data) {
if (Array.isArray(j.data)) raw = j.data;
else for (let k in j.data) if (Array.isArray(j.data[k])) raw=raw.concat(j.data[k]);
}
const data = raw.map(m=>{
let league = getName(m.league_name||m.league||m.competition||m.tournament)||"League";
let countryRaw = getName(m.country||m.country_name||m.area);
let country = getCountry(league, countryRaw);
if(country==="WORLD" && league.toLowerCase()==="matches") {
// try get from teams
league = getName(m.league_name)||"League";
country = getCountry(league, countryRaw);
}
return {
id: String(m.id||Math.random()),
country: country,
league: league,
home: getName(m.home_team||m.home)||"Home",
away: getName(m.away_team||m.away)||"Away",
time: (m.time||"00:00").toString().slice(0,5),
status: getName(m.status)||"NS",
minute: (m.minute||"")+"",
home_score: m.home_score,
away_score: m.away_score,
isStarted: (m.home_score>0||m.away_score>0|| (m.status && (m.status.toLowerCase().includes("live")||m.status.toLowerCase().includes("finished")||m.minute)))
};
}).filter(m=> m.country!=="WORLD" ); // REMOVE WORLD
return new Response(JSON.stringify({count:data.length, data}), {headers:{"Content-Type":"application/json",...cors}});
} catch(e){ return new Response(JSON.stringify({error:e.message}), {headers:{"Content-Type":"application/json",...cors}}); }
}
return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
body{background:#f0f0f0;color:#000;font-family:system-ui;margin:0}
.h{background:#111;color:#fff;padding:12px;display:flex;justify-content:space-between;border-bottom:3px solid #00c853}
.h b{color:#00ff88}
.dates{display:flex;gap:6px;overflow:auto;padding:8px;background:#222}
.d{min-width:64px;background:#333;color:#fff;border-radius:10px;padding:6px;text-align:center;cursor:pointer;font-size:11px}
.d.active{background:#00c853;color:#000;font-weight:900}
.country-head{background:#000;color:#fff;padding:7px 10px;font-size:13px;font-weight:900;text-transform:uppercase;display:flex;justify-content:space-between;border-top:1px solid #333}
.m{background:#fff;border-bottom:1px solid #ddd;padding:8px 10px;display:flex;align-items:center;gap:10px}
.time{width:44px;font-weight:700;font-size:13px}
.clubs{flex:1;line-height:1.4}
.club{font-size:13px}
.score-col{width:36px;text-align:right;font-weight:900}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.85);display:none;align-items:center;justify-content:center;z-index:99;padding:15px}
.modal-bg.open{display:flex}
.modal{background:#fff;border:3px solid #00c853;border-radius:12px;width:100%;max-width:380px;padding:16px}
.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee}
.close{background:#00c853;color:#000;border:none;width:100%;padding:11px;border-radius:8px;font-weight:900;margin-top:10px}
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
list.innerHTML='Loading...';
try{
var r=await fetch('/api/matches?date='+iso);
var j=await r.json();
all=j.data;
document.getElementById('src').innerText=j.count+' matches';
if(!j.data.length){list.innerHTML='<div style="padding:20px;text-align:center">No games</div>';return;}
var g={};
j.data.forEach(m=>{
var k=m.country+': '+m.league;
var up=k.toUpperCase();
if(!g[up])g[up]=[];
g[up].push(m);
});
var out='';
for(var L in g){
out+='<div class="country-head"><span>'+L+'</span><u>Standings</u></div>';
g[L].forEach(m=>{
var show=m.isStarted;
var scoreHTML=show?'<div class="score-col">'+m.home_score+'-'+m.away_score+'</div>':'<div class="score-col">-</div>';
out+='<div class="m" onclick="openM(\\''+m.id+'\\')"><div class="time">'+m.time+'</div><div class="clubs"><div class="club">'+m.home+'</div><div class="club">'+m.away+'</div></div>'+scoreHTML+'</div>';
});
}
list.innerHTML=out;
}catch(e){list.innerHTML='Error '+e.message;}
}
function openM(id){var m=null;for(var i=0;i<all.length;i++)if(all[i].id==id)m=all[i];if(!m)return;document.getElementById('modal').innerHTML='<h3 style="text-align:center">'+m.country+': '+m.league+'</h3><div style="text-align:center;padding:10px;font-weight:900">'+m.home+'<br>'+(m.isStarted?m.home_score+' - '+m.away_score:'vs')+'<br>'+m.away+'</div><div class="row"><span>Country</span><b>'+m.country+'</b></div><div class="row"><span>League</span><b>'+m.league+'</b></div><div class="row"><span>Time</span><b>'+m.time+'</b></div><button class="close" onclick="closeM()">CLOSE</button>';document.getElementById('bg').classList.add('open');}
function closeM(){document.getElementById('bg').classList.remove('open');}
document.getElementById('bg').addEventListener('click',e=>{if(e.target.id=='bg')closeM();});
build();load(new Date().toISOString().slice(0,10));
<\/script></body></html>`, {headers:{"Content-Type":"text/html",...cors}});
}
}
