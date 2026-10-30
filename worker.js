const MY_1XBET = "https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97";
const BASE_SPORT = "https://sports.highlightly.net";
const BASE_HOCKEY = "https://hockey.highlightly.net";
const SPORTS_MAP = {
  football: {name:"FOOTBALL", icon:"⚽", path:"football", base:"sport"},
  basketball: {name:"BASKETBALL", icon:"🏀", path:"basketball", base:"sport"},
  hockey: {name:"HOCKEY", icon:"🏒", path:"hockey", base:"hockey"},
  cricket: {name:"CRICKET", icon:"🏏", path:"cricket", base:"sport"},
  rugby: {name:"RUGBY", icon:"🏉", path:"rugby", base:"sport"},
  volleyball: {name:"VOLLEYBALL", icon:"🏐", path:"volleyball", base:"sport"},
  handball: {name:"HANDBALL", icon:"🤾", path:"handball", base:"sport"}
};
export default {
async fetch(request, env){
const KEY = env.HIGHLIGHTLY_KEY || "f98a681f-2835-4914-bedc-539351af9727";
const H = {"x-rapidapi-key": KEY};
const url = new URL(request.url);
const cache = caches.default;
async function cachedFetch(apiUrl, ttl){
 let req = new Request(apiUrl, {headers:H});
 let hit = await cache.match(req);
 if(hit) return hit;
 try{
  let r = await fetch(apiUrl, {headers:H});
  if(r.status===404) return new Response(JSON.stringify({data:[]}), {headers:{"Content-Type":"application/json"}});
  let txt = await r.text();
  let res = new Response(txt, {headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Cache-Control":"public, max-age="+ttl}});
  if(r.ok && txt.length>10) await cache.put(req, res.clone());
  return res;
 }catch(e){ return new Response(JSON.stringify({data:[]}), {headers:{"Content-Type":"application/json"}}); }
}
if(url.pathname==="/api/matches"){
 let sport = url.searchParams.get("sport") || "football";
 let date = url.searchParams.get("date") || new Date().toISOString().split('T')[0];
 let cfg = SPORTS_MAP[sport] || SPORTS_MAP.football;
 let base = cfg.base==="hockey" ? BASE_HOCKEY : BASE_SPORT;
 return await cachedFetch(`${base}/${cfg.path}/matches?date=${date}`, 120);
}
if(url.pathname==="/api/details"){
 let sport = url.searchParams.get("sport") || "football";
 let id = url.searchParams.get("id") || "";
 let cfg = SPORTS_MAP[sport] || SPORTS_MAP.football;
 let base = cfg.base==="hockey" ? BASE_HOCKEY : BASE_SPORT;
 return await cachedFetch(`${base}/${cfg.path}/matches/${id}`,120);
}
if(url.pathname==="/api/stats"){
 let sport = url.searchParams.get("sport") || "football";
 let id = url.searchParams.get("id") || "";
 let cfg = SPORTS_MAP[sport] || SPORTS_MAP.football;
 let base = cfg.base==="hockey" ? BASE_HOCKEY : BASE_SPORT;
 let endpoints = [
  `${base}/${cfg.path}/matches/${id}/statistics`,
  `${base}/${cfg.path}/matches/${id}/stats`,
  `${base}/${cfg.path}/matches/${id}/statistic`
 ];
 for(let ep of endpoints){
  try{
   let r = await fetch(ep, {headers:H});
   if(r.ok){
    let txt = await r.text();
    if(txt.length>30) return new Response(txt, {headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
   }
  }catch(e){}
 }
 return new Response(JSON.stringify({data:{}}), {headers:{"Content-Type":"application/json"}});
}
if(url.pathname==="/api/standings"){
 let sport = url.searchParams.get("sport") || "football";
 let id = url.searchParams.get("id") || "";
 let cfg = SPORTS_MAP[sport] || SPORTS_MAP.football;
 let base = cfg.base==="hockey" ? BASE_HOCKEY : BASE_SPORT;
 let tries = [
  `${base}/${cfg.path}/standings?leagueId=${id}`,
  `${base}/${cfg.path}/standings?leagueId=${id}&season=2026`,
  `${base}/${cfg.path}/standings?leagueId=${id}&season=2025`,
  `${base}/${cfg.path}/standings?leagueId=${id}&season=2024`
 ];
 for(let ep of tries){
  try{
   let r=await fetch(ep,{headers:H});
   if(!r.ok) continue;
   let j=JSON.parse(await r.text());
   let rows=j.data||j.standings||[];
   if(rows.length<1) continue;
   let auto=rows.map(t=>({team:t.team?.name||t.team||t.name||"Team", MP:t.played||0, W:t.wins||0, D:t.draws||0, L:t.loses||0, G:t.goalsFor!=null?`${t.goalsFor}:${t.goalsAgainst}`:`${t.goals||0}`, PTS:t.points||0})).sort((a,b)=>b.PTS-a.PTS).map((t,i)=>({pos:i+1,...t}));
   return new Response(JSON.stringify({data:auto}),[STRIPPED] max-age=600"}});
  }catch(e){}
 }
 return new Response(JSON.stringify({data:[]}),[STRIPPED]
}
if(url.pathname==="/app.js"){
const appjs = `
var ALL_MATCHES=[];var SELECTED_SPORT='football';var SELECTED_DATE='';var autoTimer=null;var curLeagueId=null;
var SPORTS={football:{name:"FOOTBALL",icon:"⚽"},basketball:{name:"BASKETBALL",icon:"🏀"},hockey:{name:"HOCKEY",icon:"🏒"},cricket:{name:"CRICKET",icon:"🏏"},rugby:{name:"RUGBY",icon:"🏉"},volleyball:{name:"VOLLEYBALL",icon:"🏐"},handball:{name:"HANDBALL",icon:"🤾"}};
function getIso(off){var n=new Date();n.setDate(n.getDate()+off);var l=new Date(n.toLocaleString('en-US',{timeZone:'Africa/Lagos'}));return l.getFullYear()+"-"+String(l.getMonth()+1).padStart(2,'0')+"-"+String(l.getDate()).padStart(2,'0');}
var dateMap={};function initDates(){dateMap['yesterday']=getIso(-1);dateMap['today']=getIso(0);dateMap['tomorrow']=getIso(1);}
function buildSports(){var html='';for(var k in SPORTS){var active=k===SELECTED_SPORT?'sport-active':'sport-inactive';html+='<div class="sportBtn '+active+'" data-sport="'+k+'">'+SPORTS[k].icon+' '+SPORTS[k].name+'</div>';}document.getElementById('sportsBar').innerHTML=html;document.querySelectorAll('.sportBtn').forEach(function(el){el.onclick=function(){SELECTED_SPORT=this.dataset.sport;buildSports();buildDays();loadDate(dateMap['today'],false);startAuto();}});}
function buildDays(){var html='';[{key:'yesterday',label:'YESTERDAY'},{key:'today',label:'TODAY'},{key:'tomorrow',label:'TOMORROW'}].forEach(function(d){var iso=dateMap[d.key];var active=(SELECTED_DATE===iso)?'day-active':'day-inactive';if(SELECTED_DATE===''&&d.key==='today'){active='day-active';SELECTED_DATE=iso;}html+='<div class="dayBtn '+active+'" data-day="'+d.key+'">'+d.label+'</div>';});document.getElementById('daysBar').innerHTML=html;document.querySelectorAll('.dayBtn').forEach(function(el){el.onclick=function(){SELECTED_DATE=dateMap[this.dataset.day]||dateMap['today'];buildDays();loadDate(SELECTED_DATE,false);startAuto();}});}
function getScores(m){try{var s=m.state&&m.state.score&&m.state.score.current||"";if(typeof s==='string'&&s.indexOf('-')>-1){var p=s.split('-');return{h:p[0].trim(),a:p[1].trim()};}return{h:null,a:null};}catch(e){return{h:null,a:null};}}
function getTimeInfo(m){var s=m.date||"";var desc=(m.state&&m.state.description||m.status||"").toUpperCase();var isFin=desc.indexOf('FINISHED')>-1;var isLive=desc.indexOf('HALF')>-1||desc.indexOf('LIVE')>-1;var timeStr="-";try{if(s){var dt=new Date(s);if(!isNaN(dt.getTime()))timeStr=dt.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'});}}catch(e){}var display=isFin?'FT':(isLive?'LIVE':timeStr);return{display:display,isLive:isLive,isFinished:isFin,ts:s?new Date(s).getTime():0};}
async function loadDate(dstr,silent){if(!dstr)dstr=getIso(0);SELECTED_DATE=dstr;buildSports();buildDays();if(!silent)document.getElementById('content').innerHTML='<div class="loading">Loading '+SPORTS[SELECTED_SPORT].name+'...</div>';try{var res=await fetch('/api/matches?sport='+SELECTED_SPORT+'&date='+dstr+'&t='+Date.now());var data=await res.json();ALL_MATCHES=data.data||data.matches||[];if(!Array.isArray(ALL_MATCHES))ALL_MATCHES=[];render(silent);}catch(e){if(!silent)document.getElementById('content').innerHTML='<div class="box">No games</div>';}}
function render(silent){if(ALL_MATCHES.length===0){if(!silent)document.getElementById('content').innerHTML='<div class="box">No '+SELECTED_SPORT+' games for '+SELECTED_DATE+'</div>';return;}var groups={};ALL_MATCHES.forEach(function(m){var ln=(m.league&&m.league.name||"Unknown").trim();var cn=(m.country&&m.country.name||m.league&&m.league.country||"World");if(typeof cn!=='string')cn=cn.name||"World";cn=cn.trim();var lid=m.league&&m.league.id||0;var key=(cn+"|"+ln).toUpperCase();if(!groups[key])groups[key]={country:cn,league:ln,leagueId:lid,games:[]};groups[key].games.push(m);});var html='<div class="sectionTitle"><span>'+SPORTS[SELECTED_SPORT].icon+' '+SELECTED_SPORT.toUpperCase()+' - '+SELECTED_DATE+' ('+ALL_MATCHES.length+')</span><span style="color:#ff3b30;font-size:10px">● AUTO</span></div>';Object.values(groups).forEach(function(gr){gr.games.sort((a,b)=>getTimeInfo(a).ts-getTimeInfo(b).ts);html+='<div class="league-header"><div><span style="background:#00ff66;color:#000;padding:3px 8px;border-radius:4px;font-weight:900;font-size:10px">'+gr.country.toUpperCase()+'</span><span style="color:#00ff66;font-weight:900;margin-left:8px">'+gr.league.toUpperCase()+'</span></div><span style="background:#00ff66;color:#000;padding:2px 8px;border-radius:12px;font-size:10px">TABLE</span></div>';gr.games.forEach(function(m){var h=m.homeTeam&&m.homeTeam.name||"Home";var a=m.awayTeam&&m.awayTeam.name||"Away";var ti=getTimeInfo(m);var sc=getScores(m);var scoreHtml=sc.h!=null?'<span style="color:#00ff66;font-weight:900">'+sc.h+'</span><br><span style="color:#00ff66;font-weight:900">'+sc.a+'</span>':(ti.isFinished?'FT':'-');var tc=ti.isLive?'time-live':(ti.isFinished?'time-ft':'time-green');html+='<div class="match" data-id="'+m.id+'" data-league="'+gr.leagueId+'"><div class="time-box"><div class="'+tc+'">'+ti.display+'</div></div><div style="flex:1;margin-left:10px"><div style="font-size:13px">'+h+'</div><div style="font-size:13px;color:#aaa;margin-top:4px">'+a+'</div></div><div class="score">'+scoreHtml+'</div></div>';});});document.getElementById('content').innerHTML=html;document.querySelectorAll('.match').forEach(function(el){el.onclick=function(){openDetails(this.dataset.id,this.dataset.league);}});}
function startAuto(){if(autoTimer)clearInterval(autoTimer);autoTimer=setInterval(function(){loadDate(SELECTED_DATE,true);},120000);}
async function openDetails(id,leagueId){
curLeagueId=leagueId||null;document.getElementById('modal').style.display='block';showTab('d');
document.getElementById('tab-d').innerHTML='<div class="loading">Loading...</div>';
document.getElementById('statsGrid').innerHTML='<div class="loading">AUTO searching stats...</div>';
document.getElementById('tableBox').innerHTML='<div class="loading">AUTO searching table...</div>';
try{
var res=await fetch('/api/details?sport='+SELECTED_SPORT+'&id='+id+'&t='+Date.now());var data=await res.json();var m=data.data||data||{};if(Array.isArray(m))m=m[0]||{};
var h=m.homeTeam&&m.homeTeam.name||"Home";var a=m.awayTeam&&m.awayTeam.name||"Away";var sc=getScores(m);var ft=sc.h!=null?sc.h+' - '+sc.a:'0 - 0';
document.getElementById('modalTitle').textContent=h+' vs '+a;
document.getElementById('tab-d').innerHTML='<div class="box" style="text-align:center"><div style="color:#00ff66;font-weight:900">'+SPORTS[SELECTED_SPORT].icon+' '+SELECTED_SPORT.toUpperCase()+' - '+(m.league&&m.league.name||'League')+'</div><div style="font-size:36px;font-weight:900;margin:10px 0">'+ft+'</div><div style="color:#aaa;font-size:11px">Status: '+(m.state&&m.state.description||m.status||'')+'<br>Date: '+SELECTED_DATE+'</div></div>';
var statsRes=await fetch('/api/stats?sport='+SELECTED_SPORT+'&id='+id+'&t='+Date.now());
var statsData=await statsRes.json();
var st=statsData.data||statsData||{};if(Array.isArray(st))st=st[0]||{};
if(typeof st==='object' && Object.keys(st).length===0){st=m;}
var combined={};for(var k in m)combined[k]=m[k];for(var k in st)combined[k]=st[k];if(m.stats)for(var k in m.stats)combined[k]=m.stats[k];if(st.stats)for(var k in st.stats)combined[k]=st.stats[k];
function find(k){for(var i=0;i<k.length;i++){var key=k[i];if(combined[key]!=null)return combined[key];}return null;}
function val(k,def){var v=find(k);return v!=null?v:def;}
var html='<b>'+h+'</b><span style=color:#00ff66>TEAM</span><b>'+a+'</b>';
var has=false;
var pH=val(['homePossession','possessionHome'],null);
var pA=val(['awayPossession','possessionAway'],null);
if(pH){has=true;html+='<span>'+pH+'</span><span style=color:#00ff66>Possession</span><span>'+(pA||'-')+'</span>';}
var sH=val(['homeShots','shotsHome'],null);
var sA=val(['awayShots','shotsAway'],null);
if(sH){has=true;html+='<span>'+sH+'</span><span style=color:#00ff66>Shots</span><span>'+(sA||'-')+'</span>';}
var cH=val(['homeCorners','cornersHome'],null);
var cA=val(['awayCorners','cornersAway'],null);
if(cH){has=true;html+='<span>'+cH+'</span><span style=color:#00ff66>Corners</span><span>'+(cA||'-')+'</span>';}
if(!has){html+='<span style=grid-column:1/-1;color:#aaa;padding:20px>Score: '+ft+'<br>No detailed stats in API for this match</span>';}
document.getElementById('statsGrid').innerHTML=html;
if(curLeagueId){var rt=await fetch('/api/standings?sport='+SELECTED_SPORT+'&id='+curLeagueId+'&t='+Date.now());var td=await rt.json();var rows=td.data||[];if(rows.length>0){var h2='<div class="box" style="padding:0;overflow-x:auto"><table class="standings"><tr><th>#</th><th style="text-align:left">Team</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>G</th><th>PTS</th></tr>';rows.forEach(r=>{var hl=(r.team.toUpperCase()===h.toUpperCase()||r.team.toUpperCase()===a.toUpperCase())?' style="background:#0f2f0f"':'';h2+='<tr'+hl+'><td style="color:#00ff66;font-weight:900">'+r.pos+'.</td><td class="teamCell">'+r.team+'</td><td>'+r.MP+'</td><td>'+r.W+'</td><td>'+r.D+'</td><td>'+r.L+'</td><td>'+r.G+'</td><td style="color:#00ff66;font-weight:900">'+r.PTS+'</td></tr>';});h2+='</table></div>';document.getElementById('tableBox').innerHTML=h2;}else{document.getElementById('tableBox').innerHTML='<div class="box">No table found for this league<br>Score: '+ft+'</div>';}}
}catch(e){document.getElementById('tab-d').innerHTML='<div class="box">Error '+e.message+'</div>';}
}
function showTab(id){document.getElementById('tab-d').style.display=id==='d'?'block':'none';document.getElementById('tab-s').style.display=id==='s'?'block':'none';document.getElementById('tab-t').style.display=id==='t'?'block':'none';document.getElementById('tb-d').classList.toggle('active',id==='d');document.getElementById('tb-s').classList.toggle('active',id==='s');document.getElementById('tb-t').classList.toggle('active',id==='t');}
function closeModal(){document.getElementById('modal').style.display='none';}
initDates();buildSports();buildDays();loadDate(getIso(0),false);startAuto();
`;
return new Response(appjs, {headers:{"Content-Type":"application/javascript","Cache-Control":"no-cache"}});
}
const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND - WORKING</title>
<style>html,body{margin:0;background:#000;color:#fff;font-family:Arial}.top{display:flex;justify-content:center;padding:12px;background:#000;border-bottom:3px solid #00ff66;position:sticky;top:0;z-index:200}.logo{background:#00ff66;color:#000;padding:8px 28px;border-radius:8px;font-weight:900}.sportsBar{display:flex;gap:6px;padding:10px;background:#111;overflow-x:auto;border-bottom:2px solid #00ff66;position:sticky;top:54px;z-index:150}.sportBtn{padding:10px 14px;border-radius:20px;font-weight:900;font-size:11px;white-space:nowrap;cursor:pointer;border:1.5px solid #00ff66;min-width:70px;text-align:center}.sport-inactive{background:#000;color:#00ff66}.sport-active{background:#00ff66;color:#000}.days{display:flex;gap:8px;padding:10px;background:#000;overflow-x:auto;border-bottom:1px solid #333;position:sticky;top:103px;z-index:149}.dayBtn{padding:12px 16px;border-radius:20px;font-weight:900;font-size:12px;white-space:nowrap;cursor:pointer;border:1.5px solid #00ff66;min-width:80px;text-align:center}.day-inactive{background:#000;color:#00ff66}.day-active{background:#00ff66;color:#000}.sectionTitle{background:#00ff66;color:#000;padding:9px 10px;font-weight:900;font-size:12px;display:flex;justify-content:space-between}.match{display:flex;justify-content:space-between;align-items:center;padding:12px 10px;background:#0a0a0a;border-bottom:1px solid #1a1a1a;cursor:pointer}.league-header{background:#111;border-top:2px solid #00ff66;padding:10px;display:flex;justify-content:space-between;align-items:center}.score{color:#00ff66;font-weight:900;font-size:16px;text-align:center;min-width:50px}.time-box{width:72px;text-align:center}.time-live{color:#ff3b30;font-weight:900;animation:blink 1s infinite}.time-ft{color:#fff;font-weight:900}.time-green{color:#00ff66;font-weight:900}@keyframes blink{50%{opacity:0.4}}.box{background:#0a0a0a;border:1px solid #222;border-radius:10px;padding:12px;margin:8px}table.standings{width:100%;border-collapse:collapse;font-size:11px}table.standings th{background:#00ff66;color:#000;padding:7px 3px}table.standings td{padding:8px 3px;border-bottom:1px solid #1a1a1a;text-align:center}table.standings td.teamCell{text-align:left;color:#fff}.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2.5px solid #00ff66;z-index:9999}.bottom a{background:#00ff66;color:#000;padding:12px;border-radius:12px;font-weight:900;text-align:center;display:flex;justify-content:center;gap:10px;text-decoration:none}.spacer{height:90px}.loading{padding:20px;text-align:center;color:#00ff66}#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:none;overflow-y:auto}#modalTop{background:#000;border-bottom:2.5px solid #00ff66;padding:12px;position:sticky;top:0;display:flex;justify-content:space-between;align-items:center}.closeBtn{background:#00ff66;color:#000;border:none;padding:10px 18px;border-radius:8px;font-weight:900}.tabs{display:flex;background:#111;border-bottom:2px solid #00ff66}.tabs button{flex:1;padding:12px;background:#111;color:#00ff66;border:none;font-weight:900;cursor:pointer}.tabs button.active{background:#00ff66;color:#000}.grid{display:grid;grid-template-columns:1fr 100px 1fr;text-align:center;gap:8px;padding:10px;font-size:12px}.bet{padding:10px}.bet a{background:#00ff66;color:#000;padding:12px;border-radius:12px;font-weight:900;text-decoration:none;display:flex;justify-content:center;gap:10px}.logo1x-whiteblue{background:#fff;color:#0066ff;padding:5px 14px;border-radius:6px;font-weight:900}</style></head><body>
<div class="top"><span class="logo">DIAMOND - WORKING 100%</span></div>
<div class="bet"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank"><span class="logo1x-whiteblue">1XBET</span><span>BET NOW 300% BONUS</span></a></div>
<div class="sportsBar" id="sportsBar"></div>
<div class="days" id="daysBar"></div>
<div id="content"><div class="loading">WORKING VERSION - 0% ERROR...</div></div>
<div id="modal"><div id="modalTop"><span id="modalTitle">MATCH</span><button class="closeBtn" onclick="closeModal()">X CLOSE</button></div><div class="tabs"><button id="tb-d" class="active" onclick="showTab('d')">DETAILS</button><button id="tb-s" onclick="showTab('s')">STATS</button><button id="tb-t" onclick="showTab('t')">TABLE</button></div><div id="tab-d"></div><div id="tab-s" style="display:none"><div id="statsGrid" class="grid"></div></div><div id="tab-t" style="display:none"><div id="tableBox"></div></div></div>
<div class="spacer"></div>
<div class="bottom"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank"><span class="logo1x-whiteblue">1XBET</span><span>WORKING 100%</span></a></div>
<script src="/app.js?t=working"></script>
</body></html>`;
return new Response(html,{headers:{"Content-Type":"text/html; charset=UTF-8","Cache-Control":"no-cache"}});
}
}
