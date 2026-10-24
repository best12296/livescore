export default {
async fetch(request, env) {
const url = new URL(request.url);
const cors = {"Access-Control-Allow-Origin":"*"};
const getName = v => typeof v==='string'?v:(v?.name||v?.team_name||v?.league_name||v?.country||"");
const getTime = m => {
if(m.minute) return m.minute+"'";
let t=m.time||m.kickoff||m.start_time||"";
if(t&&t.includes(":")&&t.slice(0,5)!=="00:00") return t.slice(0,5);
if(m.timestamp){let d=new Date(m.timestamp*1000);return d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Africa/Lagos'});}
return "00:00";
};
const getScore = m => {
let hs=m.home_score??m.score_home??m.homeScore??null;
let as=m.away_score??m.score_away??m.awayScore??null;
if(m.score&&typeof m.score==="string"&&m.score.includes("-")){[hs,as]=m.score.split("-");}
if(m.ft&&typeof m.ft==="string"&&m.ft.includes("-")){[hs,as]=m.ft.split("-");}
if(hs!=null&&as!=null&&hs!==""&&as!=="") return {hs:String(hs),as:String(as),has:true};
return {hs:null,as:null,has:false};
};
// FIX ONLY MATCHES/WORLD TO AVOID MIXING, THEN SORT A-Z
const fixCountry = (league,home,away,c) => {
if(c!=="MATCHES"&&c!=="WORLD") return c;
let HA=(home+" "+away).toUpperCase();
let L=league.toUpperCase();
if(L.includes("SERIE A")||L.includes("SERIE B")){
 if(["SANTOS","BAHIA","INTERNACIONAL","BOTAFOGO","MIRASSOL","SAO PAULO","VITORIA","VITÓRIA","PARANAENSE","PALMEIRAS","BRAGANTINO","VASCO","FLAMENGO","CORINTHIANS","CRUZEIRO","REMO"].some(t=>HA.includes(t))) return "BRAZIL";
 if(["CAGLIARI","BOLOGNA","COMO","SASSUOLO","NAPOLI","ROMA","LAZIO","PARMA","UDINESE","JUVENTUS","INTER","FIORENTINA"].some(t=>HA.includes(t))) return "ITALY";
 if(["GIM","SAN LORENZO","PLATENSE","NEWELLS"].some(t=>HA.includes(t))) return "ARGENTINA";
}
if(L.includes("LIGA MX")||L.includes("LIGA DE EXPANSION")) return "MEXICO";
if(L.includes("K-LEAGUE")) return "SOUTH KOREA";
return c==="MATCHES"?"WORLD":c;
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
let p=k.split(" - ");
let apiC=p[0]?p[0].trim().toUpperCase():"WORLD";
let apiL=p.length>1?p.slice(1).join(" - ").trim():k.trim();
j.data[k].forEach(m=>{
let home=getName(m.home_team||m.home);
let away=getName(m.away_team||m.away);
let league=getName(m.league_name||m.league)||apiL;
let country=(getName(m.country)||apiC).toUpperCase();
let fixed=fixCountry(league,home,away,country);
let sc=getScore(m);
data.push({id:String(m.id||Math.random()),country:fixed,league,time:getTime(m),minute:m.minute||"",home,away,home_score:sc.hs,away_score:sc.as,hasScore:sc.has,isLive:String(m.status||"").toLowerCase().includes("live")||!!m.minute});
});
}
data.sort((a,b)=> (a.country+a.league).localeCompare(b.country+b.league) || a.time.localeCompare(b.time));
return new Response(JSON.stringify({count:data.length,data}),{headers:{"Content-Type":"application/json",...cors}});
}catch(e){return new Response(JSON.stringify({count:0,data:[]}),{headers:{"Content-Type":"application/json",...cors}});}
}

return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Diamond Livescore</title><style>
body{background:#eef2f5;margin:0;font-family:system-ui,Arial;font-size:14px}
.h{background:#000;color:#fff;padding:12px 14px;display:flex;justify-content:space-between;border-bottom:4px solid #00c853;position:sticky;top:0;z-index:10}
.h b{color:#00e676;font-size:18px}
.h span{background:#111;border:1px solid #00c853;color:#00e676;padding:4px 10px;border-radius:20px;font-size:11px}
.dates{display:flex;gap:6px;overflow:auto;padding:10px;background:#111}
.d{min-width:68px;background:#222;color:#bbb;border:1px solid #333;border-radius:10px;padding:6px;text-align:center;cursor:pointer;font-size:11px}
.d.active{background:#00c853;color:#000;font-weight:900}
.d b{display:block;color:#fff} .d.active b{color:#000}
.country-bar{background:#000;color:#fff;padding:8px 10px;font-weight:900;font-size:12px;text-transform:uppercase;display:flex;justify-content:space-between;border-left:5px solid #00c853}
.country-bar u{color:#00e676;border:1px solid #00e676;padding:3px 8px;border-radius:4px;font-size:11px;text-decoration:none}
.match-row{display:flex;gap:8px;padding:10px;background:#fff;border-bottom:1px solid #ddd;cursor:pointer}
.t{width:52px;font-weight:800;flex-shrink:0}
.t.live{color:#c00}
.teams{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.score{width:45px;text-align:right;font-weight:900;color:#0033cc;flex-shrink:0}
.score.live{color:#c00}
.score.dash{color:#777}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;align-items:center;justify-content:center;z-index:99;padding:16px}
.modal-bg.open{display:flex}
.modal{background:#fff;width:100%;max-width:380px;border-radius:10px;border:3px solid #00c853;overflow:hidden}
.modal-head{background:#000;color:#fff;padding:10px 12px;font-weight:800;display:flex;justify-content:space-between;border-bottom:3px solid #00c853}
.close{background:#00c853;color:#000;border:none;width:100%;padding:11px;border-radius:6px;font-weight:900;margin-top:12px}
</style></head><body>
<div class="h"><b>DIAMOND LIVESCORE</b><span id="src">0 matches</span></div>
<div class="dates" id="dates"></div>
<div id="list"></div>
<div class="modal-bg" id="bg"><div class="modal" id="modal"></div></div>
<script>
var dates=document.getElementById('dates'),list=document.getElementById('list'),all=[];
function build(){var h='';for(var i=-3;i<=4;i++){var d=new Date();d.setDate(d.getDate()+i);var iso=d.toISOString().slice(0,10);var lab=i==0?'TODAY':i==-1?'YEST':i==1?'TOM':d.toLocaleDateString('en',{weekday:'short'});var num=d.getDate()+' '+d.toLocaleDateString('en',{month:'short'});var act=i==0?' active':'';h+='<div class="d'+act+'" onclick="load(\\''+iso+'\\',this)"><small>'+lab+'</small><b>'+num+'</b></div>';}dates.innerHTML=h;}
async function load(iso,el){
if(el){document.querySelectorAll('.d').forEach(t=>t.classList.remove('active'));el.classList.add('active');}
list.innerHTML='<div style="padding:20px;text-align:center">Loading '+iso+'...</div>';
try{
var r=await fetch('/api/matches?date='+iso);
var j=await r.json();
all=j.data||[];
document.getElementById('src').innerText=(j.count||0)+' matches';
if(!all.length){list.innerHTML='<div style="padding:20px;text-align:center">No games</div>';return;}
var g={};
all.forEach(m=>{var key=(m.country+': '+m.league).toUpperCase();if(!g[key])g[key]=[];g[key].push(m);});
var sortedKeys=Object.keys(g).sort((a,b)=>a.localeCompare(b));
var out='';
sortedKeys.forEach(key=>{
var matches=g[key].sort((a,b)=>a.time.localeCompare(b.time));
out+='<div class="country-bar"><span>'+key+'</span><u>STANDINGS</u></div>';
matches.forEach(m=>{
var isLive=m.isLive||(m.minute&&parseInt(m.minute)>0);
var timeText=m.minute?m.minute+"'":m.time;
var tClass=isLive?'t live':'t';
var scoreText=m.hasScore?m.home_score+'-'+m.away_score:'-';
var sClass=m.hasScore?(isLive?'score live':'score'):'score dash';
out+='<div class="match-row" onclick="openM(\\''+m.id+'\\')"><div class="'+tClass+'">'+timeText+'</div><div class="teams">'+m.home+' - '+m.away+'</div><div class="'+sClass+'">'+scoreText+'</div></div>';
});
});
list.innerHTML=out;
}catch(e){list.innerHTML='Error '+e.message;}
}
function openM(id){var m=null;for(var i=0;i<all.length;i++)if(all[i].id==id)m=all[i];if(!m)return;var sc=m.hasScore?m.home_score+' - '+m.away_score:'vs';document.getElementById('modal').innerHTML='<div class="modal-head"><span>'+m.country+': '+m.league+'</span><span onclick="closeM()" style="cursor:pointer">✕</span></div><div style="padding:14px"><div style="text-align:center;background:#f5f5f5;padding:12px;border-radius:8px"><b>'+m.home+'</b><br><span style="font-size:24px;font-weight:900;color:#00a651;display:block;margin:6px 0">'+sc+'</span><b>'+m.away+'</b></div><div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee"><span>Country</span><b style="color:#00a651">'+m.country+'</b></div><div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee"><span>League</span><b>'+m.league+'</b></div><div style="display:flex;justify-content:space-between;padding:8px 0"><span>Time</span><b>'+m.time+'</b></div><button class="close" onclick="closeM()">CLOSE</button></div>';document.getElementById('bg').classList.add('open');}
function closeM(){document.getElementById('bg').classList.remove('open');}
document.getElementById('bg').addEventListener('click',e=>{if(e.target.id=='bg')closeM();});
build();load(new Date().toISOString().slice(0,10));
<\/script></body></html>`,{headers:{"Content-Type":"text/html",...cors}});
}
}
