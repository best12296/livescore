export default {
async fetch(request, env) {
const url = new URL(request.url);
const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"*"};
const KEY = env.API_FOOTBALL_KEY || "YOUR_KEY_HERE";

if(url.pathname==="/api/matches"){
const date = url.searchParams.get("date") || new Date().toISOString().slice(0,10);
try{
const r = await fetch(`https://v3.football.api-sports.io/fixtures?date=${date}`,{
headers:{"x-apisports-key":KEY}
});
const j = await r.json();
let data = [];
(j.response||[]).forEach(f=>{
let country = (f.league?.country||"WORLD").toUpperCase();
let league = f.league?.name||"League";
let home = f.teams?.home?.name||"Home";
let away = f.teams?.away?.name||"Away";
let status = f.fixture?.status?.short||"NS";
let minute = f.fixture?.status?.elapsed||"";
let ts = f.fixture?.timestamp;
let timeStr = "00:00";
if(ts){ let d=new Date(ts*1000); timeStr=d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Africa/Lagos'}); }
let hs = f.goals?.home;
let as = f.goals?.away;
let hasScore = hs!=null && as!=null;
let isLive = ["1H","2H","HT","ET","LIVE","P"].includes(status) || !!minute;
data.push({id:String(f.fixture?.id||Math.random()),country,league,time:timeStr,minute,home,away,home_score:hasScore?String(hs):null,away_score:hasScore?String(as):null,hasScore,isLive});
});
// A TO Z - COUNTRY THEN LEAGUE
data.sort((a,b)=> (a.country+a.league).localeCompare(b.country+b.league) || a.time.localeCompare(b.time));
return new Response(JSON.stringify({count:data.length,data}),{headers:{"Content-Type":"application/json",...cors}});
}catch(e){return new Response(JSON.stringify({count:0,data:[],error:e.message}),{headers:{"Content-Type":"application/json",...cors}})}
}

return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Diamond Livescore</title><style>
body{background:#eef2f5;margin:0;font-family:system-ui,Arial;font-size:14px}
.h{background:#000;color:#fff;padding:12px 14px;display:flex;justify-content:space-between;border-bottom:4px solid #00c853;position:sticky;top:0}
.h b{color:#00e676;font-size:18px}
.h span{background:#111;border:1px solid #00c853;color:#00e676;padding:4px 10px;border-radius:20px;font-size:11px}
.dates{display:flex;gap:6px;overflow:auto;padding:10px;background:#111}
.d{min-width:68px;background:#222;color:#bbb;border:1px solid #333;border-radius:10px;padding:6px;text-align:center;cursor:pointer;font-size:11px}
.d.active{background:#00c853;color:#000;font-weight:900}
.d b{display:block;color:#fff} .d.active b{color:#000}
.country-bar{background:#000;color:#fff;padding:8px 10px;font-weight:900;font-size:12px;text-transform:uppercase;display:flex;justify-content:space-between;border-left:5px solid #00c853}
.match-row{display:flex;gap:8px;padding:10px;background:#fff;border-bottom:1px solid #ddd}
.t{width:52px;font-weight:800} .t.live{color:#c00} .teams{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis} .score{width:45px;text-align:right;font-weight:900;color:#0033cc} .score.live{color:#c00} .score.dash{color:#777}
</style></head><body>
<div class="h"><b>DIAMOND LIVESCORE</b><span id="src">0 matches</span></div>
<div class="dates" id="dates"></div>
<div id="list"></div>
<script>
var dates=document.getElementById('dates'),list=document.getElementById('list'),all=[];
function build(){var h='';for(var i=-3;i<=4;i++){var d=new Date();d.setDate(d.getDate()+i);var iso=d.toISOString().slice(0,10);var lab=i==0?'TODAY':i==-1?'YEST':i==1?'TOM':d.toLocaleDateString('en',{weekday:'short'});var num=d.getDate()+' '+d.toLocaleDateString('en',{month:'short'});var act=i==0?' active':'';h+='<div class="d'+act+'" onclick="load(\\''+iso+'\\',this)"><small>'+lab+'</small><b>'+num+'</b></div>';}dates.innerHTML=h;}
async function load(iso,el){
if(el){document.querySelectorAll('.d').forEach(t=>t.classList.remove('active'));el.classList.add('active');}
list.innerHTML='<div style="padding:20px;text-align:center">Loading '+iso+'...</div>';
try{
var r=await fetch('/api/matches?date='+iso); var j=await r.json(); all=j.data||[];
document.getElementById('src').innerText=(j.count||0)+' matches';
if(!all.length){list.innerHTML='<div style="padding:20px;text-align:center">No games</div>';return;}
var g={}; all.forEach(m=>{var key=(m.country+': '+m.league).toUpperCase();if(!g[key])g[key]=[];g[key].push(m);});
var sortedKeys=Object.keys(g).sort((a,b)=>a.localeCompare(b));
var out='';
sortedKeys.forEach(key=>{
var matches=g[key].sort((a,b)=>a.time.localeCompare(b.time));
out+='<div class="country-bar"><span>'+key+'</span></div>';
matches.forEach(m=>{
var timeText=m.minute?m.minute+"'":m.time;
var tClass=m.isLive?'t live':'t';
var scoreText=m.hasScore?m.home_score+'-'+m.away_score:'-';
var sClass=m.hasScore?(m.isLive?'score live':'score'):'score dash';
out+='<div class="match-row"><div class="'+tClass+'">'+timeText+'</div><div class="teams">'+m.home+' - '+m.away+'</div><div class="'+sClass+'">'+scoreText+'</div></div>';
});
});
list.innerHTML=out;
}catch(e){list.innerHTML='Error '+e.message;}
}
build();load(new Date().toISOString().slice(0,10));
<\/script></body></html>`,{headers:{"Content-Type":"text/html",...cors}});
}
}
