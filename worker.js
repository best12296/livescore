export default {
async fetch(request, env) {
const url = new URL(request.url);
const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"*"};
const KEY = env.API_FOOTBALL_KEY;

if(url.pathname==="/api/matches"){
const date = url.searchParams.get("date") || new Date().toISOString().slice(0,10);
try{
const r = await fetch(`https://v3.football.api-sports.io/fixtures?date=${date}`,{headers:{"x-apisports-key":KEY}});
const j = await r.json();
let data = [];
(j.response||[]).forEach(f=>{
let country=(f.league?.country||"WORLD").toUpperCase();
let league=f.league?.name||"League";
let home=f.teams?.home?.name||"Home";
let away=f.teams?.away?.name||"Away";
let status=f.fixture?.status?.short||"NS";
let minute=f.fixture?.status?.elapsed||"";
let ts=f.fixture?.timestamp;
let timeStr="00:00";
if(ts){let d=new Date(ts*1000);timeStr=d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Africa/Lagos'});}
let hs=f.goals?.home; let as=f.goals?.away;
let hasScore=hs!=null && as!=null;
let isLive=["1H","2H","HT","ET","LIVE","P","BT"].includes(status)||!!minute;
data.push({id:String(f.fixture?.id),country,league,time:timeStr,minute,status,home,away,home_score:hasScore?String(hs):null,away_score:hasScore?String(as):null,hasScore,isLive});
});
data.sort((a,b)=>(a.country+a.league).localeCompare(b.country+b.league)||a.time.localeCompare(b.time));
return new Response(JSON.stringify({count:data.length,data}),{headers:{"Content-Type":"application/json",...cors}});
}catch(e){return new Response(JSON.stringify({count:0,data:[],error:String(e)}),{headers:{"Content-Type":"application/json",...cors}});}
}

return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND LIVESCORE</title><style>
*{box-sizing:border-box}body{margin:0;background:#000;color:#fff;font-family:system-ui,Arial;font-size:13px}
.h{background:#000;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:10;border-bottom:2px solid #00c853}
.h b{color:#00e676;font-size:18px;letter-spacing:.5px} .h span{background:#00c853;color:#000;padding:5px 12px;border-radius:20px;font-weight:900;font-size:11px}
.dates{display:flex;gap:7px;overflow:auto;padding:10px;background:#000;border-bottom:1px solid #111}
.d{min-width:70px;background:#111;color:#777;border:1px solid #222;border-radius:12px;padding:8px 6px;text-align:center;cursor:pointer;font-size:11px;transition:.2s}
.d.active{background:#00c853;color:#000;border-color:#00c853;font-weight:900} .d.active b,.d.active small{color:#000}
.d b{display:block;color:#fff;font-size:13px} .d small{opacity:.8}
.country-bar{background:#0a0a0a;color:#00e676;padding:10px 12px;font-weight:900;font-size:11px;text-transform:uppercase;display:flex;justify-content:space-between;border-left:4px solid #00c853;border-bottom:1px solid #111;letter-spacing:.6px}
.match-row{display:flex;gap:10px;padding:12px 10px;background:#111;border-bottom:1px solid #1a1a1a;cursor:pointer;transition:.15s}
.match-row:hover{background:#1a1a1a} .match-row:active{background:#222}
.t{width:50px;font-weight:900;color:#888;font-size:12px} .t.live{color:#00e676;animation:blink 1s infinite} .teams{flex:1;color:#eee;white-space:nowrap;overflow:hidden;text-overflow:ellipsis} .teams b{color:#fff}
.score{width:50px;text-align:right;font-weight:900;font-size:13px} .score.live{color:#00e676} .score.finished{color:#fff} .score.dash{color:#444}
@keyframes blink{50%{opacity:.4}}
#modal{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;align-items:flex-end;z-index:99}
#modal.show{display:flex} .modal-box{width:100%;background:#0f0f0f;border-top:3px solid #00c853;border-radius:18px 18px 0 0;padding:16px;animation:up .25s}
@keyframes up{from{transform:translateY(100%)}to{transform:translateY(0)}}
.modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px} .modal-head b{color:#00e676}
.close{width:32px;height:32px;border-radius:50%;background:#222;color:#fff;border:1px solid #333;display:grid;place-items:center;cursor:pointer}
.stat{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #1a1a1a} .stat span:last-child{color:#00e676;font-weight:800}
.btn{margin-top:12px;width:100%;background:#00c853;color:#000;border:0;padding:12px;border-radius:12px;font-weight:900;cursor:pointer}
</style></head><body>
<div class="h"><b>DIAMOND LIVESCORE</b><span id="src">0 matches</span></div>
<div class="dates" id="dates"></div>
<div id="list"></div>
<div id="modal" onclick="if(event.target==this)closeModal()"><div class="modal-box"><div class="modal-head"><b id="mTitle">Match Details</b><div class="close" onclick="closeModal()">✕</div></div><div id="mBody"></div><button class="btn" onclick="closeModal()">CLOSE</button></div></div>
<script>
var dates=document.getElementById('dates'),list=document.getElementById('list'),modal=document.getElementById('modal'),all=[],gData={};
function build(){var h='';for(var i=-3;i<=4;i++){var d=new Date();d.setDate(d.getDate()+i);var iso=d.toISOString().slice(0,10);var lab=i==0?'TODAY':i==-1?'YEST':i==1?'TOM':d.toLocaleDateString('en',{weekday:'short'});var num=d.getDate()+' '+d.toLocaleDateString('en',{month:'short'});var act=i==0?' active':'';h+='<div class="d'+act+'" onclick="load(\\''+iso+'\\',this)"><small>'+lab+'</small><b>'+num+'</b></div>';}dates.innerHTML=h;}
function openMatch(id){var m=gData[id];if(!m)return;document.getElementById('mTitle').innerText=m.country+': '+m.league;document.getElementById('mBody').innerHTML='<div class="stat"><span>Match</span><span>'+m.home+' vs '+m.away+'</span></div><div class="stat"><span>Time</span><span>'+m.time+(m.minute?' ('+m.minute+"'"+')':'')+'</span></div><div class="stat"><span>Status</span><span>'+m.status+'</span></div><div class="stat"><span>Score</span><span>'+(m.hasScore?m.home_score+' - '+m.away_score:'Not Started')+'</span></div><div class="stat"><span>League</span><span>'+m.league+'</span></div><div class="stat"><span>Country</span><span>'+m.country+'</span></div>';modal.classList.add('show');}
function closeModal(){modal.classList.remove('show');}
async function load(iso,el){
if(el){document.querySelectorAll('.d').forEach(t=>t.classList.remove('active'));el.classList.add('active');}
list.innerHTML='<div style="padding:30px;text-align:center;color:#00c853">Loading '+iso+'...</div>';
try{
var r=await fetch('/api/matches?date='+iso);var j=await r.json();all=j.data||[];gData={};
document.getElementById('src').innerText=(j.count||0)+' matches';
if(!all.length){list.innerHTML='<div style="padding:30px;text-align:center;color:#777">No games</div>';return;}
var g={};all.forEach(m=>{gData[m.id]=m;var key=(m.country+': '+m.league).toUpperCase();if(!g[key])g[key]=[];g[key].push(m);});
var sortedKeys=Object.keys(g).sort((a,b)=>a.localeCompare(b));var out='';
sortedKeys.forEach(key=>{
var matches=g[key].sort((a,b)=>a.time.localeCompare(b.time));
out+='<div class="country-bar"><span>'+key+'</span><span style="color:#666">'+matches.length+'</span></div>';
matches.forEach(m=>{
var timeText=m.minute?m.minute+"'":m.time;
var tClass=m.isLive?'t live':'t';
var scoreText=m.hasScore?m.home_score+'-'+m.away_score:'-';
var sClass=m.hasScore?(m.isLive?'score live':'score finished'):'score dash';
out+='<div class="match-row" onclick="openMatch(\\''+m.id+'\\')"><div class="'+tClass+'">'+timeText+'</div><div class="teams">'+m.home+' - '+m.away+'</div><div class="'+sClass+'">'+scoreText+'</div></div>';
});
});
list.innerHTML=out;
}catch(e){list.innerHTML='<div style="padding:20px;color:#f44">Error '+e.message+'</div>';}
}
build();load(new Date().toISOString().slice(0,10));
setInterval(()=>{var el=document.querySelector('.d.active');var iso=el?el.getAttribute('onclick').match(/'([^']+)'/)[1]:new Date().toISOString().slice(0,10);load(iso);},60000);
<\/script></body></html>`,{headers:{"Content-Type":"text/html",...cors}});
}
}
