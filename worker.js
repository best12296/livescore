export default {
async fetch(request, env) {
const url = new URL(request.url);
const cors = {"Access-Control-Allow-Origin":"*"};
const getName = v => {
if(!v) return "";
if(typeof v==='string') return v;
if(typeof v==='object') return v.name||v.team_name||v.league_name||v.country||v.country_name||"";
return String(v);
};
const getTime = m => {
if(m.minute) return m.minute+"'";
let t=m.time||m.kickoff||m.start_time||m.match_time||"";
if(t&&t.includes(":")&&t.slice(0,5)!=="00:00") return t.slice(0,5);
if(m.timestamp){let d=new Date(m.timestamp*1000);return d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Africa/Lagos'});}
return t||"00:00";
};
// GET SCORE FROM ANY FIELD API SENDS
const getScore = m => {
let hs = m.home_score ?? m.score_home ?? m.homeScore ?? m.goals_home ?? m.team_home_score ?? m.h_score ?? null;
let as = m.away_score ?? m.score_away ?? m.awayScore ?? m.goals_away ?? m.team_away_score ?? m.a_score ?? null;
// if API gives "1-0" string
if(m.score && typeof m.score==="string" && m.score.includes("-")){
let p=m.score.split("-");
hs=p[0]; as=p[1];
}
if(m.ft && typeof m.ft==="string" && m.ft.includes("-")){
let p=m.ft.split("-");
hs=p[0]; as=p[1];
}
if(hs===""||hs==="") hs=null;
if(as===""||as==="") as=null;
if(hs!=null && as!=null) return {hs:String(hs),as:String(as),has:true};
return {hs:null,as:null,has:false};
};
// FIX ONLY MATCHES BUCKET - SPLIT BRAZIL vs ITALY
const fixMatchesBucket = (league, home, away, currentCountry) => {
if(currentCountry!=="MATCHES") return currentCountry;
let H=(home||"").toUpperCase();
let A=(away||"").toUpperCase();
let HA=H+" "+A;
let L=(league||"").toUpperCase();
if(L.includes("SERIE A")||L.includes("SERIE B")){
  let BRA=["SANTOS","BAHIA","INTERNACIONAL","BOTAFOGO","MIRASSOL","SAO PAULO","VITÓRIA","VITORIA","PARANAENSE","PALMEIRAS","BRAGANTINO","VASCO","CORINTHIANS","CHAPECOENSE","FLUMINENSE","CRUZEIRO","REMO","GIM MENDOZA","PLATENSE","SAN LORENZO","NEWELLS"];
  let ITA=["CAGLIARI","BOLOGNA","COMO","SASSUOLO","NAPOLI","ROMA","LAZIO","PARMA","UDINESE","JUVENTUS","INTER","MILAN","ATALANTA","FIORENTINA"];
  if(BRA.some(t=>HA.includes(t))) return "BRAZIL";
  if(ITA.some(t=>HA.includes(t))) return "ITALY";
  if(H.includes("GIM")||H.includes("SAN LORENZO")) return "ARGENTINA";
}
if(L.includes("LIGA MX")) return "MEXICO";
if(L.includes("K-LEAGUE")) return "SOUTH KOREA";
if(L.includes("PREMIER LEAGUE")) return "ENGLAND";
return "WORLD";
};

if(url.pathname==="/api/matches"){
const KEY=env.FOOTBALL_API_KEY||"088f79cadddb9cebccc50b31fc30ff16545878cde9bac042269d8a9bc6b16736";
const date=url.searchParams.get("date")||new Date().toISOString().slice(0,10);
try{
const r=await fetch("https://www.live-football-api.com/api/v1/matches?api_key="+KEY+"&date="+date);
const j=await r.json();
let data=[];
for(let k in j.data){
if(!Array.isArray(j.data[k])) continue;
let parts=k.split(" - ");
let apiCountry=parts[0]?parts[0].trim().toUpperCase():"WORLD";
let apiLeague=parts.length>1?parts.slice(1).join(" - ").trim():k.trim();
j.data[k].forEach(m=>{
let home=getName(m.home_team||m.home);
let away=getName(m.away_team||m.away);
let league=getName(m.league_name||m.league)||apiLeague;
let country=(getName(m.country)||apiCountry).toUpperCase();
let fixedCountry=fixMatchesBucket(league,home,away,country);
let sc=getScore(m);
data.push({
id:String(m.id||Math.random()),
country:fixedCountry,
league:league,
home:home,
away:away,
time:getTime(m),
minute:m.minute||"",
home_score:sc.hs,
away_score:sc.as,
hasScore:sc.has,
isLive:String(m.status||"").toLowerCase().includes("live")||!!m.minute
});
});
}
return new Response(JSON.stringify({count:data.length,data}),{headers:{"Content-Type":"application/json",...cors}});
}catch(e){return new Response(JSON.stringify({count:0,data:[],error:e.message}),{headers:{"Content-Type":"application/json",...cors}});}
}

return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
body{background:#f2f2f2;margin:0;font-family:system-ui,Arial;font-size:14px}
.h{background:#000;color:#fff;padding:12px 14px;display:flex;justify-content:space-between;border-bottom:4px solid #00c853;position:sticky;top:0;z-index:10}
.h b{color:#00e676;font-size:18px}
.h span{background:#111;border:1px solid #00c853;color:#00e676;padding:4px 10px;border-radius:20px;font-size:11px}
.dates{display:flex;gap:6px;overflow:auto;padding:10px;background:#111}
.d{min-width:68px;background:#222;color:#bbb;border:1px solid #333;border-radius:10px;padding:6px;text-align:center;cursor:pointer;font-size:11px}
.d.active{background:#00c853;color:#000;font-weight:900}
.country-bar{background:#000;color:#fff;padding:8px 10px;font-weight:900;font-size:12px;text-transform:uppercase;display:flex;justify-content:space-between;border-left:5px solid #00c853}
.country-bar u{color:#00e676;border:1px solid #00e676;padding:3px 8px;border-radius:4px;font-size:11px;text-decoration:none}
.match-row{display:flex;gap:8px;padding:10px;border-bottom:1px solid #ddd;background:#fff;cursor:pointer}
.match-row:active{background:#d4edda}
.t{width:52px;font-weight:800;flex-shrink:0}
.t.live{color:#c00}
.teams{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.score{width:45px;text-align:right;font-weight:900;color:#0033cc;flex-shrink:0}
.score.live{color:#c00}
.score.dash{color:#777;font-weight:400}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;align-items:center;justify-content:center;z-index:99;padding:16px}
.modal-bg.open{display:flex}
.modal{background:#fff;width:100%;max-width:380px;border-radius:10px;border:3px solid #00c853;overflow:hidden}
.modal-head{background:#000;color:#fff;padding:10px 12px;font-weight:800;display:flex;justify-content:space-between;border-bottom:3px solid #00c853}
.modal-head span:first-child{color:#00e676}
.close{background:#00c853;color:#000;border:none;width:100%;padding:11px;border-radius:6px;font-weight:900;margin-top:12px}
</style></head><body>
<div class="h"><b>DIAMOND LIVESCORE</b><span id="src">0 matches</span></div>
<div class="dates" id="dates"></div>
<div id="list"></div>
<div class="modal-bg" id="bg"><div class="modal" id="modal"></div></div>
<script>
var dates=document.getElementById('dates'),list=document.getElementById('list'),all=[];
function build(){var h='';for(var i=-3;i<=4;i++){var d=new Date();d.setDate(d.getDate()+i);var iso=d.toISOString().slice(0,10);var lab=i==0?'TODAY':i==-1?'YEST':i==1?'TOM':d.toLocaleDateString('en',{weekday:'short'});var num=d.getDate()+' '+d.toLocaleDateString('en',{month:'short'});var act=i==0?' active':'';h+='<div class="d'+act+'" onclick="load(\\''+iso+'\\',this)"><small>'+lab+'</small><b>'+num+'</b></div>';}dates.innerHTML=h;}
async function load(iso,el){if(el){document.querySelectorAll('.d').forEach(t=>t.classList.remove('active'));el.classList.add('active');}list.innerHTML='<div style="padding:20px;text-align:center">Loading '+iso+'...</div>';try{var r=await fetch('/api/matches?date='+iso);var j=await r.json();all=j.data||[];document.getElementById('src').innerText=(j.count||0)+' matches';var g={};all.forEach(m=>{var key=(m.country+': '+m.league).toUpperCase();if(key.startsWith('MATCHES:')){if(m.country==='MATCHES') return;}if(!g[key])g[key]=[];g[key].push(m);});var out='';for(var key in g){if(key.includes('MATCHES: SERIE A')) continue;out+='<div class="country-bar"><span>'+key+'</span><u>STANDINGS</u></div>';g[key].forEach(m=>{var isLive=m.isLive||(m.minute&&parseInt(m.minute)>0);var timeText=m.minute?m.minute+"'":m.time;var tClass=isLive?'t live':'t';var scoreText=m.hasScore?m.home_score+'-'+m.away_score:'-';var sClass=m.hasScore?(isLive?'score live':'score'):'score dash';out+='<div class="match-row" onclick="openM(\\''+m.id+'\\')"><div class="'+tClass+'">'+timeText+'</div><div class="teams">'+m.home+' - '+m.away+'</div><div class="'+sClass+'">'+scoreText+'</div></div>';});}list.innerHTML=out||'<div style="padding:20px;text-align:center">No games</div>';}catch(e){list.innerHTML='Error '+e.message;}}
function openM(id){var m=null;for(var i=0;i<all.length;i++)if(all[i].id==id)m=all[i];if(!m)return;var score=m.hasScore?m.home_score+' - '+m.away_score:'-';document.getElementById('modal').innerHTML='<div class="modal-head"><span>'+m.country+': '+m.league+'</span><span onclick="closeM()" style="cursor:pointer">✕</span></div><div style="padding:14px"><div style="text-align:center;background:#f5f5f5;padding:12px;border-radius:8px"><b>'+m.home+'</b><br><span style="font-size:24px;font-weight:900;color:#00a651;margin:6px 0;display:block">'+score+'</span><b>'+m.away+'</b></div><div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee"><span>Country</span><b style="color:#00a651">'+m.country+'</b></div><div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee"><span>League</span><b>'+m.league+'</b></div><div style="display:flex;justify-content:space-between;padding:8px 0"><span>Time</span><b>'+m.time+'</b></div><button class="close" onclick="closeM()">CLOSE</button></div>';document.getElementById('bg').classList.add('open');}
function closeM(){document.getElementById('bg').classList.remove('open');}
document.getElementById('bg').addEventListener('click',e=>{if(e.target.id=='bg')closeM();});
build();load(new Date().toISOString().slice(0,10));
<\/script></body></html>`,{headers:{"Content-Type":"text/html",...cors}});
}
}
