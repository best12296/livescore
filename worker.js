export default {
async fetch(request, env) {
const url = new URL(request.url);
const path = url.pathname;
const cors = {"Access-Control-Allow-Origin":"*"};
const getName = (v) => {
if(!v) return "";
if(typeof v==='string') return v;
if(typeof v==='object') return v.name || v.team_name || v.displayName || v.shortName || v.league_name || v.country || "";
return String(v);
};
const getScore = (v) => {
if(!v) return "0-0";
if(typeof v==='string') return v;
if(typeof v==='object') return (v.home ?? v.home_score ?? 0) + "-" + (v.away ?? v.away_score ?? 0);
return String(v);
};
if (path === "/api/matches") {
const KEY = env.FOOTBALL_API_KEY || "088f79cadddb9cebccc50b31fc30ff16545878cde9bac042269d8a9bc6b16736";
try {
const r = await fetch("https://www.live-football-api.com/api/v1/matches?api_key=" + KEY);
const j = await r.json();
let raw = [];
if (j.data) {
if (Array.isArray(j.data)) raw = j.data;
else for (let k in j.data) if (Array.isArray(j.data[k])) { j.data[k].forEach(x=>x._lg=k); raw=raw.concat(j.data[k]); }
}
const data = raw.map(m=>({
id: String(m.id||m.match_id||Math.random()),
country: getName(m.country||m.country_name||m.area)||"World",
league: getName(m.league||m.league_name||m.competition||m._lg)||"Live",
home: getName(m.home_team||m.home||m.homeTeam)||"Home",
away: getName(m.away_team||m.away||m.awayTeam)||"Away",
time: (m.time||m.kickoff||m.start_time||"15:00")+"",
status: getName(m.status||m.match_status)||m.status||"Live",
minute: (m.minute||m.timer||"")+"",
home_score: m.home_score ?? m.home_goals ?? (m.score && m.score.home) ?? 0,
away_score: m.away_score ?? m.away_goals ?? (m.score && m.score.away) ?? 0,
ht: getScore(m.ht_score||m.halftime||m.score && m.score.halftime),
ft: (m.home_score??0)+"-"+(m.away_score??0)
}));
return new Response(JSON.stringify({count:data.length, data, debug:"credits:"+(j.credits_remaining||0)}), {headers:{"Content-Type":"application/json",...cors}});
} catch(e){ return new Response(JSON.stringify({error:e.message}), {headers:{"Content-Type":"application/json",...cors}}); }
}
return new Response(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#050a05;color:#fff;font-family:system-ui} .h{background:#0a1a0a;border-bottom:3px solid #00c853;padding:14px;display:flex;justify-content:space-between} .h b{color:#00ff88} .dates{display:flex;gap:8px;overflow:auto;padding:10px;background:#091209} .d{min-width:68px;background:#132013;border:1px solid #234723;border-radius:12px;padding:8px;text-align:center;cursor:pointer} .d.active{background:#00c853;color:#000;font-weight:900} .lh{background:#0f2010;color:#8fdb8f;padding:7px 12px;font-size:11px;border-left:4px solid #00c853;margin-top:12px} .m{background:#101c10;border:1px solid #1d3a1d;border-radius:14px;margin:6px 10px;padding:12px;display:flex;gap:10px;cursor:pointer} .time{width:55px;color:#8fd48f;font-size:11px} .time b{color:#00ff88;font-size:14px;display:block} .teams{flex:1} .score{color:#00ff88;font-weight:900} .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.9);display:none;align-items:center;justify-content:center;z-index:99;padding:15px} .modal-bg.open{display:flex} .modal{background:#0f2410;border:2px solid #00c853;border-radius:18px;width:100%;max-width:380px;padding:18px} .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #1d3a1d} .close{background:#00c853;color:#000;border:none;width:100%;padding:12px;border-radius:10px;font-weight:900;margin-top:10px} </style></head><body><div class="h"><b>💎 DIAMOND LIVESCORE</b><span id="src">LIVE</span></div><div class="dates" id="dates"></div><div id="list">Loading...</div><div class="modal-bg" id="bg"><div class="modal" id="modal"></div></div><script>
var dates=document.getElementById('dates');var list=document.getElementById('list');var all=[];
function build(){var h='';for(var i=-3;i<=4;i++){var d=new Date();d.setDate(d.getDate()+i);var iso=d.toISOString().slice(0,10);var lab=i==0?'TODAY':i==-1?'YEST':i==1?'TOM':d.toLocaleDateString('en',{weekday:'short'});var num=d.getDate()+' '+d.toLocaleDateString('en',{month:'short'});var act=i==0?' active':'';h+='<div class="d'+act+'" onclick="load(\\''+iso+'\\',this)"><small>'+lab+'</small><br><b>'+num+'</b></div>';}dates.innerHTML=h;}
async function load(iso,el){if(el){document.querySelectorAll('.d').forEach(t=>t.classList.remove('active'));el.classList.add('active');}list.innerHTML='Loading...';try{var r=await fetch('/api/matches?date='+iso);var j=await r.json();all=j.data;document.getElementById('src').innerText=j.count+' matches | credits:'+j.debug;if(!j.data.length){list.innerHTML='No matches';return;}var g={};j.data.forEach(m=>{var k=(m.country+' - '+m.league).toUpperCase();if(!g[k])g[k]=[];g[k].push(m);});var out='';for(var L in g){out+='<div class="lh">'+L+'</div>';g[L].forEach(m=>{out+='<div class="m" onclick="openM(\\''+m.id+'\\')"><div class="time"><b>'+(m.time+'').slice(11,16)+'</b>'+m.status+'</div><div class="teams"><div style="display:flex;justify-content:space-between"><span>'+m.home+'</span><span class="score">'+m.home_score+'</span></div><div style="display:flex;justify-content:space-between"><span>'+m.away+'</span><span class="score">'+m.away_score+'</span></div></div><div style="font-size:11px;min-width:60px;text-align:right">'+(m.minute?m.minute+"'":'')+'<br>HT:'+m.ht+'</div></div>';});}list.innerHTML=out;}catch(e){list.innerHTML='Error '+e.message;}}
function openM(id){var m=null;for(var i=0;i<all.length;i++)if(all[i].id==id)m=all[i];if(!m)return;document.getElementById('modal').innerHTML='<h3 style="color:#00ff88;text-align:center">'+m.country+' • '+m.league+'</h3><div style="text-align:center;padding:10px;font-weight:900;font-size:18px">'+m.home+' '+m.home_score+' - '+m.away_score+' '+m.away+'</div><div class="row"><span>Time</span><b>'+m.time+'</b></div><div class="row"><span>Status</span><b>'+m.status+' '+m.minute+'</b></div><div class="row"><span>HT</span><b>'+m.ht+'</b></div><div class="row"><span>FT</span><b>'+m.ft+'</b></div><div class="row"><span>Correct HT</span><b>'+m.ht+'</b></div><div class="row"><span>Correct FT</span><b>'+m.ft+'</b></div><button class="close" onclick="closeM()">CLOSE</button>';document.getElementById('bg').classList.add('open');}
function closeM(){document.getElementById('bg').classList.remove('open');}
document.getElementById('bg').addEventListener('click',e=>{if(e.target.id=='bg')closeM();});
build();load(new Date().toISOString().slice(0,10));setInterval(()=>load(new Date().toISOString().slice(0,10)),30000);
<\/script></body></html>`, {headers:{"Content-Type":"text/html",...cors}});
}
}
