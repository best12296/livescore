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
let t = m.time || m.kickoff || m.start_time || "";
if(t && t.includes(":") && t.slice(0,5)!=="00:00") return t.slice(0,5);
if(m.timestamp){let d=new Date(m.timestamp*1000); return d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Africa/Lagos'});}
return "00:00";
};
// ALL LEAGUES ARRANGED - NO MORE WORLD
const detectCountry = (league, home, away) => {
const L = (league||"").toUpperCase();
const H = (home||"").toUpperCase();
const A = (away||"").toUpperCase();
const HA = H+" "+A;

// 1. ENGLAND
if(["MAN. CITY","MAN CITY","ASTON VILLA","ARSENAL","LIVERPOOL","CHELSEA","MAN UTD","TOTTENHAM","NEWCASTLE","BRIGHTON","BRENTFORD","CRYSTAL PALACE","SUNDERLAND","LEEDS","HULL","BOURNEMOUTH","EVERTON","WEST HAM","FULHAM","WOLVES","FOREST","BURNLEY"].some(t=>HA.includes(t))) return "ENGLAND";

// 2. SOUTH KOREA - K LEAGUE
if(L.includes("K-LEAGUE") || ["JEONNAM","DAEGU","GIMPO","GIMHAE","BUSAN","CHEONAN","ANYANG","ULSAN","JEONBUK","POHANG","INCHEON","SUWON","GWANGJU"].some(t=>HA.includes(t))) return "SOUTH KOREA";

// 3. JAPAN
if(L.includes("J-LEAGUE")||L.includes("J2 LEAGUE")||L.includes("J1")||["FUJIEDA","TOKUSHIMA","OMIYA","YOKOHAMA","JEF UNITED","IWAKI","MACHIDA","KASHIWA"].some(t=>HA.includes(t))) return "JAPAN";

// 4. RUSSIA
if(L.includes("FNL")||["SKA","YENISEY","UFA","NIZHNY","KAMAZ","TEKSTILSHCHIK","SOCHI","AKRON","RODINA","FAKEL","DINAMO M","KHARKIV","LIVYI","LNZ CHERKASY"].some(t=>HA.includes(t)) && (L.includes("FNL")||L.includes("RUSSIA")||L.includes("PREMIER")==false)) {
  if(["GOMEL","DINAMO MINSK","OKZHETPES","KASPIY","ZHETYSU","TOBOL"].some(t=>HA.includes(t))==false) {
    if(L.includes("FNL")||HA.includes("SKA")||HA.includes("YENISEY")) return "RUSSIA";
  }
}

// 5. BRAZIL
const BRAZIL_TEAMS = ["SANTOS","BAHIA","INTERNACIONAL","BOTAFOGO","MIRASSOL","SAO PAULO","SÃO PAULO","VITÓRIA","VITORIA","PARANAENSE","PALMEIRAS","BRAGANTINO","VASCO","CORINTHIANS","CHAPECOENSE","FLUMINENSE","FLAMENGO","CRUZEIRO","GREMIO","FORTALEZA","SPORT","CRICIUMA","CRICIÚMA","VILA NOVA","CRB","LONDRINA","PONTE PRETA","AVAI","AVAÍ","GOIAS","GOIÁS","ATLETICO GO","ATLÉTICO GO","NOVORIZONTINO","CORITIBA","AMERICA MG","ATHLETIC","OPERÁRIO","SAO BERNARDO"];
if(BRAZIL_TEAMS.some(t=>HA.includes(t))) return "BRAZIL";

// 6. ITALY
const ITALY_TEAMS = ["INTER","FIORENTINA","ATALANTA","FROSINONE","GENOA","VENEZIA","LECCE","JUVENTUS","LAZIO","PARMA","UDINESE","MILAN","BOLOGNA","NAPOLI","ROMA","TORINO","COMO","SASSUOLO","EMPOLI","MONZA","VERONA","AVELLINO","PADOVA","CREMONESE","SAMPDORIA","BARI","PALERMO","CESENA","MODENA"];
if(ITALY_TEAMS.some(t=>HA.includes(t))) return "ITALY";

// 7. SPAIN
if(["ATH BILBAO","GETAFE","CELTA VIGO","BETIS","REAL SOCIEDAD","LEVANTE","BARCELONA","REAL MADRID","ATLETICO MADRID","VILLARREAL","SEVILLA"].some(t=>HA.includes(t))) return "SPAIN";

// 8. GERMANY
if(["HOFFENHEIM","BAYER LEVERKUSEN","FREIBURG","BAYERN MUNICH","DORTMUND","LEIPZIG","STUTTGART"].some(t=>HA.includes(t))) return "GERMANY";

// 9. FRANCE
if(["MONACO","LILLE","ANGERS","LORIENT","AUXERRE","LE MANS","MARSEILLE","LE HAVRE","RENNES","STRASBOURG","TOULOUSE","TROYES","PSG","LYON"].some(t=>HA.includes(t))) return "FRANCE";

// 10. NETHERLANDS
if(["SITTARD","EXCELSIOR","NIJMEGEN","GRONINGEN","PSV","FEYENOORD","SPARTA ROTTERDAM","AJAX","AZ ALKMAAR","TWENTE"].some(t=>HA.includes(t))) return "NETHERLANDS";

// 11. BANGLADESH
if(["ARAMBAGH","CITY CLUB","MOHAMMEDAN","WANDERERS","PWD","BANGLADESH POL","KINGS","CHATTOGRAM","BASHUNDHARA","ABAHANI"].some(t=>HA.includes(t))) return "BANGLADESH";

// 12. MONGOLIA
if(["KHOVD","ERCHIM","WESTERN"].some(t=>HA.includes(t))) return "MONGOLIA";

// 13. UKRAINE
if(["EPITSENTR","KHARKIV","LIVYI BEREH","LNZ CHERKASY","DINAMO KIEV","SHAKHTAR","ZORYA","KRYVBAS","DNIPRO"].some(t=>HA.includes(t))) return "UKRAINE";

// 14. BELARUS
if(["GOMEL","DINAMO MINSK","BATE","SHAKHTYOR","ISL OCH","NAFTAN"].some(t=>HA.includes(t))) return "BELARUS";

// 15. KAZAKHSTAN
if(["OKZHETPES","KASPIY","ZHETYSU","TOBOL","KYZYL-ZHAR","ULYTAU","AKTOBE","ASTANA","KAIRAT","ORDABASY"].some(t=>HA.includes(t))) return "KAZAKHSTAN";

// 16. SINGAPORE
if(["YOUNG LIONS","BALESTIER","TAMPINES","LION CITY","HOUGANG"].some(t=>HA.includes(t))) return "SINGAPORE";

// 17. WALES
if(["CONNAH'S QUAY","LLANDUDNO","TNS","NEW SAINTS","CONNAHS"].some(t=>HA.includes(t))) return "WALES";

// 18. KENYA / AFRICA
if(["ULINZI","MARA SUGAR","GOR MAHIA","SOFAPAKA"].some(t=>HA.includes(t))) return "KENYA";

// 19. BY LEAGUE NAME (if team not detected)
if(L.includes("K-LEAGUE 2")||L.includes("K-LEAGUE2")||L.includes("K LEAGUE 2")) return "SOUTH KOREA";
if(L.includes("K-LEAGUE")) return "SOUTH KOREA";
if(L.includes("J2 LEAGUE")||L.includes("J1 LEAGUE")||L.includes("J-LEAGUE")) return "JAPAN";
if(L.includes("FNL")) return "RUSSIA";
if(L.includes("SERIE A")||L.includes("SERIE B")) {
  // default Italy if not Brazil
  if(BRAZIL_TEAMS.some(t=>HA.includes(t))) return "BRAZIL";
  return "ITALY";
}
if(L.includes("PREMIER LEAGUE")) {
  // if not detected elsewhere, default ENGLAND (like flashscore does for big league)
  if(["KHOVD","ARAMBAGH","YOUNG LIONS","CONNAH","GOMEL","OKZHETPES","EPITSENTR"].some(t=>HA.includes(t))==false) return "ENGLAND";
}
if(L.includes("BUNDESLIGA")) return "GERMANY";
if(L.includes("LALIGA")||L.includes("LA LIGA")) return "SPAIN";
if(L.includes("LIGUE 1")) return "FRANCE";
if(L.includes("EREDIVISIE")) return "NETHERLANDS";
if(L.includes("PRIMEIRA LIGA")) return "PORTUGAL";
if(L.includes("SUPER LIG")) return "TURKEY";
if(L.includes("JUPILER")||L.includes("PRO LEAGUE")) return "BELGIUM";
if(L.includes("LIGUE 1 UGANDA")||L.includes("UGANDA")) return "UGANDA";

return null;
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
for(let m of j.data){data.push({apiCountry:getName(m.country||"").toUpperCase(),apiLeague:getName(m.league_name||m.league||""),home:getName(m.home_team||m.home),away:getName(m.away_team||m.away),time:getTime(m),minute:m.minute||"",home_score:m.home_score,away_score:m.away_score,isLive:String(m.status||"").toLowerCase().includes("live")});}
} else {
for (let k in j.data) {
if (!Array.isArray(j.data[k])) continue;
let parts = k.split(" - ");
let apiCountry = parts[0] ? parts[0].trim().toUpperCase() : "WORLD";
let apiLeague = parts.length>1 ? parts.slice(1).join(" - ").trim() : k.trim();
for(let m of j.data[k]){
let leagueFromMatch = getName(m.league_name||m.league||"");
let finalLeague = leagueFromMatch || apiLeague;
let finalCountry = getName(m.country||"").toUpperCase() || apiCountry;
data.push({apiCountry:finalCountry,apiLeague:finalLeague,home:getName(m.home_team||m.home),away:getName(m.away_team||m.away),time:getTime(m),minute:m.minute||"",home_score:m.home_score,away_score:m.away_score,isLive:String(m.status||"").toLowerCase().includes("live")});
}
}
}
}
let finalData = data.map(m=>{
let detected = detectCountry(m.apiLeague, m.home, m.away);
let country = detected || m.apiCountry;
// FORCE NO WORLD - ALL MUST BE ARRANGED
if(!country || country==="WORLD" || country==="MATCHES" || country==="" || country.includes("WORLD")){
country = detected || "OTHER";
if(m.apiLeague.toUpperCase().includes("K-LEAGUE")) country="SOUTH KOREA";
else if(m.apiLeague.toUpperCase().includes("PREMIER LEAGUE") && !detected) country="ENGLAND";
else if(m.apiLeague.toUpperCase().includes("SERIE A")||m.apiLeague.toUpperCase().includes("SERIE B")) country="ITALY";
}
if(country==="OTHER") {
// last fallback - use league keyword
if(m.apiLeague.toUpperCase().includes("K-LEAGUE")) country="SOUTH KOREA";
else if(m.apiLeague.toUpperCase().includes("PREMIER")) country="ENGLAND";
else country="WORLD";
}
return {id:String(Math.random()).slice(2),country,league:m.apiLeague,home:m.home,away:m.away,time:m.time,minute:m.minute,home_score:m.home_score,away_score:m.away_score,isLive:m.isLive};
}).filter(m=> m.country!=="MATCHES" && m.league.toUpperCase()!=="MATCHES");
// FINAL FILTER - REMOVE ANY REMAINING WORLD
finalData = finalData.filter(m=> m.country!=="WORLD");

return new Response(JSON.stringify({count:finalData.length, data:finalData}), {headers:{"Content-Type":"application/json",...cors}});
} catch(e){ return new Response(JSON.stringify({count:0, data:[], error:e.message}), {headers:{"Content-Type":"application/json",...cors}}); }
}
return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
body{background:#fff;color:#000;font-family:Arial,sans-serif;margin:0;font-size:14px}
.h{background:#111;color:#fff;padding:10px 12px;display:flex;justify-content:space-between;border-bottom:3px solid #00c853}
.h b{color:#00ff88}
.dates{display:flex;gap:6px;overflow:auto;padding:8px;background:#222}
.d{min-width:70px;background:#333;color:#fff;border-radius:8px;padding:6px;text-align:center;cursor:pointer;font-size:11px}
.d.active{background:#00c853;color:#000;font-weight:900}
.country-bar{background:#000;color:#fff;padding:6px 8px;font-weight:700;font-size:13px;text-transform:uppercase;display:flex;justify-content:space-between;border-bottom:1px solid #222}
.match-row{display:flex;align-items:center;gap:8px;padding:7px 8px;border-bottom:1px solid #e0e0e0;background:#fff;cursor:pointer}
.t{width:50px;font-size:13px;flex-shrink:0}
.t.live{color:#c00;font-weight:700}
.teams{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.score{width:60px;text-align:right;font-weight:700;color:#0033cc;flex-shrink:0}
.score.live{color:#c00}
.score.dash{color:#000;font-weight:400}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.85);display:none;align-items:center;justify-content:center;z-index:99;padding:15px}
.modal-bg.open{display:flex}
.modal{background:#fff;width:100%;max-width:380px;border-radius:4px;overflow:hidden}
.modal-head{background:#000;color:#fff;padding:8px 10px;font-weight:700;display:flex;justify-content:space-between}
.modal-body{padding:12px}
.close{background:#00c853;color:#000;border:none;width:100%;padding:10px;border-radius:4px;font-weight:900;margin-top:10px}
</style></head><body>
<div class="h"><b>DIAMOND LIVESCORE</b><span id="src">LIVE</span></div>
<div class="dates" id="dates"></div>
<div id="list">Loading...</div>
<div class="modal-bg" id="bg"><div class="modal" id="modal"></div></div>
<script>
var dates=document.getElementById('dates');var list=document.getElementById('list');var all=[];
function build(){var h='';for(var i=-3;i<=4;i++){var d=new Date();d.setDate(d.getDate()+i);var iso=d.toISOString().slice(0,10);var lab=i==0?'TODAY':i==-1?'YEST':i==1?'TOM':d.toLocaleDateString('en',{weekday:'short'});var num=d.getDate()+' '+d.toLocaleDateString('en',{month:'short'});var act=i==0?' active':'';h+='<div class="d'+act+'" onclick="load(\\''+iso+'\\',this)"><div>'+lab+'</div><b>'+num+'</b></div>';}dates.innerHTML=h;}
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
if(key.includes('WORLD:')||key.includes('MATCHES:')) return;
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
list.innerHTML=out||'<div style="padding:20px">No leagues found - check API</div>';
}catch(e){list.innerHTML='Error '+e.message;}
}
function openM(id){var m=null;for(var i=0;i<all.length;i++)if(all[i].id==id)m=all[i];if(!m)return;document.getElementById('modal').innerHTML='<div class="modal-head"><span>'+m.country+': '+m.league+'</span><span onclick="closeM()" style="cursor:pointer">X</span></div><div class="modal-body"><div style="text-align:center;background:#f5f5f5;padding:10px;border-radius:4px"><b>'+m.home+'</b><br><span style="font-size:20px;font-weight:900">'+(m.home_score!=null?m.home_score+' - '+m.away_score:'vs')+'</span><br><b>'+m.away+'</b></div><div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee"><span>Time</span><b>'+m.time+'</b></div><div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee"><span>Country</span><b>'+m.country+'</b></div><div style="display:flex;justify-content:space-between;padding:6px 0"><span>League</span><b>'+m.league+'</b></div><button class="close" onclick="closeM()">CLOSE</button></div>';document.getElementById('bg').classList.add('open');}
function closeM(){document.getElementById('bg').classList.remove('open');}
document.getElementById('bg').addEventListener('click',function(e){if(e.target.id=='bg')closeM();});
build();load(new Date().toISOString().slice(0,10));
<\/script></body></html>`, {headers:{"Content-Type":"text/html",...cors}});
}
}
