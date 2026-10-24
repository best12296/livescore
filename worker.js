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
const getCountry = (league, home, away) => {
const L = (league||"").toUpperCase();
const H = (home||"").toUpperCase();
const A = (away||"").toUpperCase();
const HA = H+" "+A;

// --- BRAZIL TEAMS - CHECK FIRST BEFORE ITALY ---
const BRAZIL = ["SÃO BERNARDO","SAO BERNARDO","SPORT","CRICIÚMA","CRICIUMA","VILA NOVA","CRB","LONDRINA","PONTE PRETA","FORTALEZA","OPERÁRIO","OPERARIO","ATHLETIC","AVAI","AVAÍ","BOTAFOGO SP","ATLÉTICO GO","ATLETICO GO","NOVORIZONTINO","AMERICA MG","AMÉRICA MG","CORITIBA","GOIÁS","GOIAS","CEARÁ","CEARA","GUARANI","ITUANO","MIRASSOL","CHAPECOENSE","SANTOS","BRUSQUE","PAULISTA"];
if(BRAZIL.some(t=>HA.includes(t))) return "BRAZIL";

// --- ITALY TEAMS ---
const ITALY = ["AVELLINO","CALCIO PADOVA","PADOVA","CREMONESE","JUVE STABIA","MODENA","CESENA","SÜDTIROL","SUDTIROL","SAMPDORIA","VIRTUS","MANTOVA","CATANZARO","ASCOLI","AREZZO","BENEVENTO","PALERMO","BARI","BRESCIA","SPEZIA","PISA","CARRARESE","FROSINONE","REGGIANA"];
if(ITALY.some(t=>HA.includes(t))) return "ITALY";

// --- OTHER COUNTRIES ---
if(["INCA","LIMEÑO","LIMENO","CACAHUATIQUE","ÁGUILA","AGUILA","FAS","ISIDRO","METAPAN"].some(t=>HA.includes(t))) return "EL SALVADOR";
if(["UNIVERSITARIO","JUAN PABLO","HUANCAYO","CUSCO","CRISTAL","ALIANZA ATL"].some(t=>HA.includes(t))) return "PERU";
if(["SERENA","CONCEPCIÓN","CONCEPCION"].some(t=>HA.includes(t))) return "CHILE";
if(["SKA","YENISEY","UFA","NIZHNY","KAMAZ","SOCHI","CHELYABINSK"].some(t=>HA.includes(t))) return "RUSSIA";
if(["FUJIEDA","TOKUSHIMA","OMIYA","YOKOHAMA"].some(t=>HA.includes(t))) return "JAPAN";
if(["JEONNAM","DAEGU","GIMPO","GIMHAE"].some(t=>HA.includes(t))) return "SOUTH KOREA";

// LEAGUE BASED
if(L.includes("FNL")) return "RUSSIA";
if(L.includes("J2")||L.includes("J-LEAGUE")||L.includes("J LEAGUE")) return "JAPAN";
if(L.includes("K-LEAGUE")||L.includes("K LEAGUE")) return "SOUTH KOREA";
if(L.includes("SERIE B")){
  // If still not detected, check again: if has SP, GO, MG, CE — likely Brazil
  if(HA.includes(" SP")||HA.includes(" GO")||HA.includes(" MG")||HA.includes(" CRB")||HA.includes("AVAI")) return "BRAZIL";
  return "ITALY";
}
if(L.includes("SERIE A")) return "ITALY";
if(L.includes("PRIMERA DIVISION")){
  if(HA.includes("LIMEÑO")||HA.includes("AGUILA")||HA.includes("FAS")||HA.includes("INCA")) return "EL SALVADOR";
  if(HA.includes("CUSCO")||HA.includes("CRISTAL")||HA.includes("UNIVERSITARIO")) return "PERU";
  if(HA.includes("SERENA")||HA.includes("CONCEPC")) return "CHILE";
  return "EL SALVADOR";
}
if(L.includes("BRASIL")||L.includes("BRASILEIRAO")) return "BRAZIL";
return "OTHER";
};
if (path === "/api/matches") {
const KEY = env.FOOTBALL_API_KEY || "088f79cadddb9cebccc50b31fc30ff16545878cde9bac042269d8a9bc6b16736";
const date = url.searchParams.get("date") || new Date().toISOString().slice(0,10);
try {
const r = await fetch("https://www.live-football-api.com/api/v1/matches?api_key=" + KEY + "&date=" + date);
const j = await r.json();
let raw = [];
if (j.data) {
if (Array.isArray(j.data)) raw = j.data;
else for (let k in j.data) if (Array.isArray(j.data[k])) raw=raw.concat(j.data[k]);
}
const data = raw.map(m=>{
let league = getName(m.league_name||m.league||m.competition)||"League";
let home = getName(m.home_team||m.home)||"Home";
let away = getName(m.away_team||m.away)||"Away";
let country = getCountry(league, home, away);
return {id: String(m.id||Math.random()),country,league,home,away,time:(m.time||"00:00").toString().slice(0,5),home_score:m.home_score,away_score:m.away_score,isStarted:(m.home_score>0||m.away_score>0)};
}).filter(m=>m.country!=="OTHER" && m.country!=="WORLD");
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
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.85);display:none;align-items:center;justify-content:center;z-index:99;padding:15px}
.modal-bg.open{display:flex}
.modal{background:#fff;border:3px solid #00c853;border-radius:12px;width:100%;max-width:380px;padding:16px}
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
