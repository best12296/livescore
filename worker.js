const MY_1XBET = "https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97";
const BASE = "https://sports.highlightly.net";
const SPORTS = {
  football:{name:"FOOTBALL", icon:"⚽", path:"football"},
  basketball:{name:"BASKETBALL", icon:"🏀", path:"basketball"},
  hockey:{name:"HOCKEY", icon:"🏒", path:"hockey"},
  rugby:{name:"RUGBY", icon:"🏉", path:"rugby"},
  volleyball:{name:"VOLLEYBALL", icon:"🏐", path:"volleyball"},
  handball:{name:"HANDBALL", icon:"🤾", path:"handball"},
  tennis:{name:"TENNIS", icon:"🎾", path:"tennis"}
};

export default {
async fetch(request, env){
const KEY = env.HIGHLIGHTLY_KEY || "afad9a68-c248-429b-8aa7-b7626bb56744";
const H = {"x-rapidapi-key": KEY};
const cache = caches.default;
async function cachedFetch(u,ttl){let r=new Request(u,{headers:H});let c=await cache.match(r);if(c)return c;let f=await fetch(u,{headers:H});let t=await f.text();let res=new Response(t,{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Cache-Control":"public, max-age="+ttl}});if(f.ok&&t.length>10)await cache.put(r,res.clone());return res;}

if(request.url.includes("/api/matches")){
 let u=new URL(request.url);let s=u.searchParams.get("sport")||"football";let d=u.searchParams.get("date")||new Date().toISOString().split('T')[0];let p=SPORTS[s]?.path||s;
 return await cachedFetch(`${BASE}/${p}/matches?date=${d}`, d===new Date().toISOString().split('T')[0]?30:300);
}
if(request.url.includes("/api/details")){
 let u=new URL(request.url);let s=u.searchParams.get("sport")||"football";let id=u.searchParams.get("id")||"";let p=SPORTS[s]?.path||s;
 return await cachedFetch(`${BASE}/${p}/matches/${id}`,30);
}
if(request.url.includes("/api/stats")){
 let u=new URL(request.url);let s=u.searchParams.get("sport")||"football";let id=u.searchParams.get("id")||"";let p=SPORTS[s]?.path||s;
 for(let ep of [`${BASE}/${p}/matches/${id}/statistics`, `${BASE}/${p}/matches/${id}/stats`]){
  try{let f=await fetch(ep,{headers:H});if(f.ok){let t=await f.text();if(t.length>20)return new Response(t,{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});}}catch(e){}
 }
 return new Response(JSON.stringify({data:{}}),{headers:{"Content-Type":"application/json"}});
}
if(request.url.includes("/api/standings")){
 let u=new URL(request.url);let s=u.searchParams.get("sport")||"football";let id=u.searchParams.get("id")||"";let p=SPORTS[s]?.path||s;
 // PLUS TABLE STANDING - try all seasons and all endpoint shapes
 let endpoints = [`${BASE}/${p}/standings?leagueId=${id}`, `${BASE}/${p}/standings?league_id=${id}&season=2025`, `${BASE}/${p}/leagues/${id}/standings`];
 for(let ep of endpoints){
  try{
   let r=await fetch(ep,{headers:H});
   if(!r.ok) continue;
   let j=JSON.parse(await r.text());
   let rows=j.data||j.standings||j.result||j||[];
   if(!Array.isArray(rows)) rows=rows.standings||rows.data||[];
   if(rows.length<1) continue;
   let auto=rows.map(t=>({
    team:t.team?.name||t.team||t.name||"Team",
    MP:t.played||t.MP||0, W:t.wins||t.W||0, D:t.draws||t.D||0, L:t.loses||t.L||0,
    G:t.goalsFor!=null?`${t.goalsFor}:${t.goalsAgainst}`: (t.pointsFor?`${t.pointsFor}:${t.pointsAgainst}`:"0:0"),
    PTS:t.points||t.PTS||0
   })).sort((a,b)=>b.PTS-a.PTS).map((t,i)=>({pos:i+1,...t}));
   if(auto.length>0){
    let req=new Request(ep,{headers:H});
    let res=new Response(JSON.stringify({data:auto}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Cache-Control":"public, max-age=600"}});
    await cache.put(req,res.clone());
    return res;
   }
  }catch(e){}
 }
 // Try seasons loop
 for(let se of ["2026","2025","2024","2023"]){
  try{let r=await fetch(`${BASE}/${p}/standings?leagueId=${id}&season=${se}`,{headers:H});if(!r.ok)continue;let j=JSON.parse(await r.text());let rows=j.data||j.standings||[];if(rows.length<1)continue;let auto=rows.map(t=>({team:t.team?.name||t.team,MP:t.played||0,W:t.wins||0,D:t.draws||0,L:t.loses||0,G:t.goalsFor!=null?`${t.goalsFor}:${t.goalsAgainst}`:"0:0",PTS:t.points||0})).sort((a,b)=>b.PTS-a.PTS).map((t,i)=>({pos:i+1,...t}));return new Response(JSON.stringify({data:auto}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});}catch(e){}
 }
 return new Response(JSON.stringify({data:[]}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
}

return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND - TABLE STANDING ALL SPORTS</title>
<style>html,body{margin:0;background:#000;color:#fff;font-family:Arial}.top{display:flex;justify-content:center;padding:12px;border-bottom:3px solid #00ff66;background:#000;position:sticky;top:0;z-index:200}.logo{background:#00ff66;color:#000;padding:8px 28px;border-radius:8px;font-weight:900}.sportsBar{display:flex;gap:6px;padding:10px;background:#111;overflow-x:auto;border-bottom:2px solid #00ff66;position:sticky;top:54px;z-index:150}.sportBtn{padding:10px 14px;border-radius:20px;font-weight:900;font-size:11px;border:1.5px solid #00ff66;min-width:70px;text-align:center;cursor:pointer}.sport-inactive{background:#000;color:#00ff66}.sport-active{background:#00ff66;color:#000}.days{display:flex;gap:8px;padding:10px;background:#000;overflow-x:auto;border-bottom:1px solid #333;position:sticky;top:103px;z-index:149}.dayBtn{padding:12px 16px;border-radius:20px;font-weight:900;font-size:12px;border:1.5px solid #00ff66;min-width:80px;text-align:center;cursor:pointer}.day-inactive{background:#000;color:#00ff66}.day-active{background:#00ff66;color:#000}.sectionTitle{background:#00ff66;color:#000;padding:9px 10px;font-weight:900;font-size:12px;display:flex;justify-content:space-between}.match{display:flex;justify-content:space-between;padding:12px 10px;background:#0a0a0a;border-bottom:1px solid #1a1a1a;cursor:pointer}.league-header{background:#111;border-top:2px solid #00ff66;padding:10px;display:flex;justify-content:space-between}.score{color:#00ff66;font-weight:900;min-width:50px;text-align:center}.time-box{width:72px;text-align:center}.time-live{color:#ff3b30;font-weight:900;animation:blink 1s infinite}.time-ft{color:#fff;font-weight:900}.time-green{color:#00ff66;font-weight:900}@keyframes blink{50%{opacity:.4}}.box{background:#0a0a0a;border:1px solid #222;border-radius:10px;padding:12px;margin:8px}table.standings{width:100%;border-collapse:collapse;font-size:11px}table.standings th{background:#00ff66;color:#000;padding:7px 3px}table.standings td{padding:8px 3px;border-bottom:1px solid #1a1a1a;text-align:center}table.standings td.teamCell{text-align:left;color:#fff}.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2.5px solid #00ff66;z-index:9999}.bottom a{background:#00ff66;color:#000;padding:12px;border-radius:12px;font-weight:900;display:flex;justify-content:center;gap:10px;text-decoration:none}.spacer{height:90px}.loading{padding:20px;text-align:center;color:#00ff66}#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:none;overflow-y:auto}#modalTop{background:#000;border-bottom:2.5px solid #00ff66;padding:12px;position:sticky;top:0;display:flex;justify-content:space-between}#modalTop span{color:#00ff66;font-weight:900}.closeBtn{background:#00ff66;color:#000;border:none;padding:10px 18px;border-radius:8px;font-weight:900}.tabs{display:flex;background:#111;border-bottom:2px solid #00ff66}.tabs button{flex:1;padding:12px;background:#111;color:#00ff66;border:none;font-weight:900;cursor:pointer}.tabs button.active{background:#00ff66;color:#000}.grid{display:grid;grid-template-columns:1fr 110px 1fr;text-align:center;gap:10px;padding:12px;font-size:13px}.bet{padding:10px}.bet a{background:#00ff66;color:#000;padding:12px;border-radius:12px;font-weight:900;display:flex;justify-content:center;gap:10px;text-decoration:none}.logo1x-whiteblue{background:#fff;color:#0066ff;padding:5px 14px;border-radius:6px;font-weight:900;font-style:italic}</style></head><body>
<div class="top"><span class="logo">DIAMOND - TABLE ALL SPORTS</span></div>
<div class="bet"><a href="${MY_1XBET}" target="_blank"><span class="logo1x-whiteblue">1XBET</span><span>BET 300% BONUS</span></a></div>
<div class="sportsBar" id="sportsBar"></div><div class="days" id="daysBar"></div>
<div id="content"><div class="loading">Loading ALL SPORTS...</div></div>
<div id="modal"><div id="modalTop"><span id="modalTitle">MATCH</span><button class="closeBtn" onclick="closeModal()">X CLOSE</button></div><div class="tabs"><button id="tb-d" class="active" onclick="showTab('d')">DETAILS</button><button id="tb-s" onclick="showTab('s')">STATS</button><button id="tb-t" onclick="showTab('t')">TABLE STANDING</button></div><div id="tab-d"></div><div id="tab-s" style="display:none"><div id="statsGrid" class="grid"></div></div><div id="tab-t" style="display:none"><div id="tableBox"></div></div><div class="bet"><a href="${MY_1XBET}" target="_blank"><span class="logo1x-whiteblue">1XBET</span><span>BET THIS MATCH NOW</span></a></div></div>
<div class="spacer"></div><div class="bottom"><a href="${MY_1XBET}" target="_blank"><span class="logo1x-whiteblue">1XBET</span><span>BET ALL SPORTS TABLE</span></a></div>
<script>
var ALL=[];var SPORT='football';var DATE='';var auto=null;var curL=null;
var SPORTS={football:{name:"FOOTBALL",icon:"⚽"},basketball:{name:"BASKETBALL",icon:"🏀"},hockey:{name:"HOCKEY",icon:"🏒"},rugby:{name:"RUGBY",icon:"🏉"},volleyball:{name:"VOLLEYBALL",icon:"🏐"},handball:{name:"HANDBALL",icon:"🤾"},tennis:{name:"TENNIS",icon:"🎾"}};
function getIso(o){var n=new Date();n.setDate(n.getDate()+o);var l=new Date(n.toLocaleString('en-US',{timeZone:'Africa/Lagos'}));return l.getFullYear()+"-"+String(l.getMonth()+1).padStart(2,'0')+"-"+String(l.getDate()).padStart(2,'0');}
var dMap={};function init(){dMap['yesterday']=getIso(-1);dMap['today']=getIso(0);dMap['tomorrow']=getIso(1);for(var i=-7;i<=7;i++){if(i===-1||i===0||i===1)continue;dMap['d'+i]=getIso(i);}}
function buildSports(){var h='';for(var k in SPORTS){var a=k===SPORT?'sport-active':'sport-inactive';h+='<div class="sportBtn '+a+'" onclick="selSport(\\''+k+'\\')">'+SPORTS[k].icon+' '+SPORTS[k].name+'</div>';}document.getElementById('sportsBar').innerHTML=h;}
function selSport(s){SPORT=s;buildSports();buildDays();load(DATE||dMap['today'],false);start();}
function buildDays(){var h='';[{k:'yesterday',l:'YESTERDAY'},{k:'today',l:'TODAY'},{k:'tomorrow',l:'TOMORROW'}].forEach(function(d){var iso=dMap[d.k];var act=(DATE===iso)?'day-active':'day-inactive';if(DATE===''&&d.k==='today'){act='day-active';DATE=iso;}h+='<div class="dayBtn '+act+'" onclick="selDay(\\''+d.k+'\\')">'+d.l+'</div>';});document.getElementById('daysBar').innerHTML=h;}
function selDay(k){DATE=dMap[k]||dMap['today'];buildDays();load(DATE,false);start();}
function getS(m){try{var s=m.state?.score?.current||m.score?.current||"";if(typeof s==='string'&&s.indexOf('-')>-1){var p=s.split('-');return{h:p[0].trim(),a:p[1].trim()};}return{h:null,a:null};}catch(e){return{h:null,a:null};}
function getT(m){var s=m.date||"";var desc=(m.state?.description||m.status||"").toUpperCase();var fin=desc.indexOf('FINISHED')>-1;var live=desc.indexOf('LIVE')>-1||desc.indexOf('HALF')>-1||desc.indexOf('PERIOD')>-1;var ts="-";try{if(s){var dt=new Date(s);ts=dt.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'});}}catch(e){}return{display:fin?'FT':(live?'LIVE':ts),isLive:live,isFin:fin,ts:s?new Date(s).getTime():0};}
async function load(d,silent){if(!d)d=getIso(0);DATE=d;buildSports();buildDays();if(!silent)document.getElementById('content').innerHTML='<div class="loading">Loading '+SPORTS[SPORT].name+'...</div>';try{var r=await fetch('/api/matches?sport='+SPORT+'&date='+d+'&t='+Date.now());var j=await r.json();ALL=j.data||j.matches||[];render(silent);}catch(e){}}
function render(silent){if(ALL.length===0){if(!silent)document.getElementById('content').innerHTML='<div class="box">No '+SPORT+' games</div>';return;}var g={};ALL.forEach(function(m){var ln=(m.league?.name||"League").trim();var cn=(m.country?.name||"World");if(typeof cn!=='string')cn=cn.name||"World";var lid=m.league?.id||0;var key=(cn+"|"+ln).toUpperCase();if(!g[key])g[key]={country:cn,league:ln,leagueId:lid,games:[]};g[key].games.push(m);});var html='<div class="sectionTitle"><span>'+SPORTS[SPORT].icon+' '+SPORT.toUpperCase()+' - '+DATE+' ('+ALL.length+')</span><span style="color:#ff3b30;font-size:10px">● AUTO 30s</span></div>';Object.values(g).forEach(function(gr){gr.games.sort((a,b)=>getT(a).ts-getT(b).ts);html+='<div class="league-header"><div><span style="background:#00ff66;color:#000;padding:3px 8px;border-radius:4px;font-weight:900;font-size:10px">'+gr.country.toUpperCase()+'</span><span style="color:#00ff66;font-weight:900;margin-left:8px">'+gr.league.toUpperCase()+'</span></div><span style="background:#00ff66;color:#000;padding:2px 8px;border-radius:12px;font-size:10px">TABLE AUTO</span></div>';gr.games.forEach(function(m){var h=m.homeTeam?.name||"Home";var a=m.awayTeam?.name||"Away";var ti=getT(m);var sc=getS(m);var sh=sc.h!=null?'<span style="color:#00ff66">'+sc.h+'</span><br><span style="color:#00ff66">'+sc.a+'</span>':(ti.isFin?'FT':'-');var tc=ti.isLive?'time-live':(ti.isFin?'time-ft':'time-green');html+='<div class="match" onclick="openD(\\''+m.id+'\\',\\''+gr.leagueId+'\\')"><div class="time-box"><div class="'+tc+'">'+ti.display+'</div></div><div style="flex:1;margin-left:10px"><div>'+h+'</div><div style="color:#aaa;margin-top:4px">'+a+'</div></div><div class="score">'+sh+'</div></div>';});});document.getElementById('content').innerHTML=html;}
function start(){if(auto)clearInterval(auto);auto=setInterval(function(){load(DATE,true);},30000);}
async function openD(id,lid){
 curL=lid;document.getElementById('modal').style.display='block';showTab('d');
 document.getElementById('tab-d').innerHTML='<div class="loading">Loading DETAILS...</div>';
 document.getElementById('statsGrid').innerHTML='<div class="loading">Loading STATS...</div>';
 document.getElementById('tableBox').innerHTML='<div class="loading">Loading TABLE STANDING for '+SPORT+'...</div>';
 try{
  var r=await fetch('/api/details?sport='+SPORT+'&id='+id+'&t='+Date.now());var j=await r.json();var m=j.data||j||{};if(Array.isArray(m))m=m[0]||{};
  var h=m.homeTeam?.name||"Home";var a=m.awayTeam?.name||"Away";var sc=getS(m);var ft=sc.h!=null?sc.h+' - '+sc.a:'VS';
  document.getElementById('modalTitle').textContent=h+' vs '+a+' - '+SPORT.toUpperCase();
  document.getElementById('tab-d').innerHTML='<div class="box" style="text-align:center"><div style="color:#00ff66;font-weight:900">'+SPORTS[SPORT].icon+' '+SPORT.toUpperCase()+' - '+(m.league?.name||'League')+'</div><div style="font-size:36px;font-weight:900;margin:10px 0">'+ft+'</div><div style="color:#aaa;font-size:11px">Status: '+(m.state?.description||m.status||'')+'<br>Date: '+DATE+'<br>League ID: '+curL+'</div></div>';
  var sr=await fetch('/api/stats?sport='+SPORT+'&id='+id+'&t='+Date.now());var sj=await sr.json();var st=sj.data||sj||{};if(Array.isArray(st))st=st[0]||{};
  var grid=document.getElementById('statsGrid');
  function find(keys){for(let k of keys){if(st[k]!=null)return st[k];if(m[k]!=null)return m[k];if(st.home&&st.home[k]!=null)return st.home[k];}return '-';}
  var html='<b>'+h+'</b><span style=color:#00ff66>TEAM</span><b>'+a+'</b>';
  if(SPORT==='football'){html+='<span>'+(find(['homePossession','possessionHome'])||'50%')+'</span><span style=color:#00ff66>Possession</span><span>'+(find(['awayPossession'])||'50%')+'</span><span>'+find(['homeShots','shotsHome'])+'</span><span style=color:#00ff66>Shots</span><span>'+find(['awayShots','shotsAway'])+'</span><span>'+find(['homeCorners','cornersHome'])+'</span><span style=color:#00ff66>Corners</span><span>'+find(['awayCorners','cornersAway'])+'</span>';}
  else if(SPORT==='hockey'){html+='<span>'+find(['homeShots','shotsHome','shots'])+'</span><span style=color:#00ff66>Shots</span><span>'+find(['awayShots','shotsAway'])+'</span><span>'+find(['homeSaves','savesHome'])+'</span><span style=color:#00ff66>Saves</span><span>'+find(['awaySaves','savesAway'])+'</span><span>'+find(['homePenalties','penaltiesHome','powerPlayHome'])+'</span><span style=color:#00ff66>Penalties</span><span>'+find(['awayPenalties','penaltiesAway'])+'</span>';}
  else if(SPORT==='basketball'){html+='<span>'+(sc.h||'-')+'</span><span style=color:#00ff66>Score</span><span>'+(sc.a||'-')+'</span><span>'+find(['reboundsHome','homeRebounds'])+'</span><span style=color:#00ff66>Rebounds</span><span>'+find(['reboundsAway','awayRebounds'])+'</span>';}
  else if(SPORT==='volleyball'){html+='<span>'+find(['attacksHome','homeAttacks'])+'</span><span style=color:#00ff66>Attacks</span><span>'+find(['attacksAway','awayAttacks'])+'</span><span>'+find(['blocksHome','homeBlocks'])+'</span><span style=color:#00ff66>Blocks</span><span>'+find(['blocksAway','awayBlocks'])+'</span>';}
  else {html+='<span>'+find(['homeShots','attacksHome','acesHome'])+'</span><span style=color:#00ff66>Shots/Attacks</span><span>'+find(['awayShots','attacksAway','acesAway'])+'</span>';}
  grid.innerHTML=html;

  // TABLE STANDING FOR ALL SPORTS
  if(curL){
   var rt=await fetch('/api/standings?sport='+SPORT+'&id='+curL+'&t='+Date.now());
   var td=await rt.json();var rows=td.data||[];
   if(rows.length>0){
    var th='<div class="sectionTitle"><span>'+(m.league?.name||'League').toUpperCase()+' - '+SPORT.toUpperCase()+' TABLE</span><span>'+rows.length+' TEAMS</span></div><div class="box" style="padding:0;overflow-x:auto"><table class="standings"><tr><th>#</th><th style="text-align:left">Team</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>G</th><th>PTS</th></tr>';
    rows.forEach(r=>{var hl=(r.team.toUpperCase()===h.toUpperCase()||r.team.toUpperCase()===a.toUpperCase())?' style="background:#003300;border-left:3px solid #00ff66"':'';th+='<tr'+hl+'><td style="color:#00ff66;font-weight:900">'+r.pos+'.</td><td class="teamCell" style="font-weight:900">'+r.team+'</td><td>'+r.MP+'</td><td>'+r.W+'</td><td>'+r.D+'</td><td>'+r.L+'</td><td>'+r.G+'</td><td style="color:#00ff66;font-weight:900">'+r.PTS+'</td></tr>';});
    th+='</table></div><div class="box" style="color:#00ff66;font-size:11px">✓ AUTO TABLE FOR ALL SPORTS - '+SPORT.toUpperCase()+'<br>✓ Green highlight = teams playing now<br>✓ Sorted by Points</div>';
    document.getElementById('tableBox').innerHTML=th;
   } else {
    document.getElementById('tableBox').innerHTML='<div class="box" style="text-align:center"><div style="color:#ff3b30;font-weight:900">No table for this league yet</div><div style="font-size:11px;color:#aaa;margin-top:10px">This '+SPORT+' league: '+(m.league?.name||'')+'<br>League ID: '+curL+'<br><br>HOCKEY / small leagues sometimes no standings.<br>But FOOTBALL, BASKETBALL leagues have full table.<br><br>Current match:<br><b style="color:#00ff66">'+h+'</b> vs <b style="color:#00ff66">'+a+'</b><br>Score: '+ft+'</div></div>';
   }
  }
 }catch(e){document.getElementById('tab-d').innerHTML='<div class="box">Error '+e.message+'</div>';}
}
function showTab(id){document.getElementById('tab-d').style.display=id==='d'?'block':'none';document.getElementById('tab-s').style.display=id==='s'?'block':'none';document.getElementById('tab-t').style.display=id==='t'?'block':'none';document.getElementById('tb-d').classList.toggle('active',id==='d');document.getElementById('tb-s').classList.toggle('active',id==='s');document.getElementById('tb-t').classList.toggle('active',id==='t');}
function closeModal(){document.getElementById('modal').style.display='none';}
init();buildSports();buildDays();load(getIso(0),false);start();
</script></body></html>`,{headers:{"Content-Type":"text/html"}});
}
}
