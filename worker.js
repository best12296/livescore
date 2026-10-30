const MY_1XBET = "https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97";
const SPORTS = {
  football:{url:"https://soccer.highlightly.net/football", name:"FOOTBALL", icon:"⚽"},
  basketball:{url:"https://basketball.highlightly.net/basketball", name:"BASKETBALL", icon:"🏀"},
  handball:{url:"https://handball.highlightly.net/handball", name:"HANDBALL", icon:"🤾"},
  volleyball:{url:"https://volleyball.highlightly.net/volleyball", name:"VOLLEYBALL", icon:"🏐"},
  hockey:{url:"https://hockey.highlightly.net/hockey", name:"HOCKEY", icon:"🏒"},
  rugby:{url:"https://rugby.highlightly.net/rugby", name:"RUGBY", icon:"🏉"},
  tennis:{url:"https://tennis.highlightly.net/tennis", name:"TENNIS", icon:"🎾"}
};

export default {
async fetch(request, env){
const KEY = env.HIGHLIGHTLY_KEY || "afad9a68-c248-429b-8aa7-b7626bb56744";
const url = new URL(request.url);
const H = {"x-rapidapi-key": KEY};
const cache = caches.default;
async function cachedFetch(apiUrl, ttl=60){
 let req = new Request(apiUrl, {headers:H});
 let cached = await cache.match(req);
 if(cached) return cached;
 let r = await fetch(apiUrl, {headers:H});
 let txt = await r.text();
 let res = new Response(txt, {headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Cache-Control":"public, max-age="+ttl}});
 if(r.ok && txt.length>10) await cache.put(req, res.clone());
 return res;
}
if(url.pathname==="/api/sports"){
 let s=url.searchParams.get("sport")||"football";
 let d=url.searchParams.get("date")||"";
 let base=SPORTS[s].url;
 let ttl=d===new Date().toISOString().split('T')[0]?30:300;
 return await cachedFetch(`${base}/matches?date=${d}`, ttl);
}
if(url.pathname==="/api/standings"){
 let s=url.searchParams.get("sport")||"football";
 let id=url.searchParams.get("id")||"";
 let base=SPORTS[s].url;
 let ck=new Request(`${base}/standings?leagueId=${id}`,{headers:H});
 let c=await cache.match(ck);
 if(c) return c;
 for(let season of ["2026","2025","2024"]){
  try{
   let r=await fetch(`${base}/standings?leagueId=${id}&season=${season}`,{headers:H});
   if(!r.ok) continue;
   let j=JSON.parse(await r.text());
   let rows=j.data||j.standings||[];
   if(rows.length<1) continue;
   let auto=rows.map(t=>({
    team:t.team?.name||t.team||t.name, MP:t.played||0, W:t.wins||0, D:t.draws||0, L:t.loses||0,
    G:t.goalsFor!=null?`${t.goalsFor}:${t.goalsAgainst}`:`${t.pointsFor||0}:${t.pointsAgainst||0}`,
    PTS:t.points||0, GD:(t.goalsFor||t.pointsFor||0)-(t.goalsAgainst||t.pointsAgainst||0)
   })).sort((a,b)=>b.PTS-a.PTS||b.GD-a.GD).map((t,i)=>({pos:i+1,...t}));
   let res=new Response(JSON.stringify({data:auto}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Cache-Control":"public, max-age=600"}});
   await cache.put(ck,res.clone()); return res;
  }catch(e){}
 }
 return new Response(JSON.stringify({data:[]}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
}
if(url.pathname==="/api/match"){
 let s=url.searchParams.get("sport")||"football";
 let id=url.searchParams.get("id")||"";
 let base=SPORTS[s].url;
 return await cachedFetch(`${base}/matches/${id}`,30);
}

const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND ALL SPORTS TABLE</title>
<style>
html,body{margin:0;background:#000;color:#fff;font-family:Arial}
.top{display:flex;justify-content:center;padding:12px;background:#000;border-bottom:3px solid #00ff66;position:sticky;top:0;z-index:200}
.logo{background:#00ff66;color:#000;padding:8px 28px;border-radius:8px;font-weight:900;font-style:italic}
.sportsBar{display:flex;gap:6px;padding:10px;background:#111;overflow-x:auto;border-bottom:2px solid #00ff66;position:sticky;top:54px;z-index:150}
.sportBtn{padding:10px 16px;border-radius:20px;font-weight:900;font-size:11px;white-space:nowrap;cursor:pointer;border:1.5px solid #00ff66;min-width:80px;text-align:center}
.sport-inactive{background:#000;color:#00ff66}.sport-active{background:#00ff66;color:#000}
.days{display:flex;gap:8px;padding:10px;background:#000;overflow-x:auto;border-bottom:1px solid #333;position:sticky;top:103px;z-index:149}
.dayBtn{padding:12px 18px;border-radius:20px;font-weight:900;font-size:12px;white-space:nowrap;cursor:pointer;border:1.5px solid #00ff66;min-width:90px;text-align:center}
.day-inactive{background:#000;color:#00ff66}.day-active{background:#00ff66;color:#000}
.moreDaysBox{background:#0a0a0a;border:2px solid #00ff66;border-radius:10px;margin:8px;overflow:hidden;display:none}
.sectionTitle{background:#00ff66;color:#000;padding:9px 10px;font-weight:900;font-size:12px;display:flex;justify-content:space-between}
.match{display:flex;justify-content:space-between;align-items:center;padding:12px 10px;background:#0a0a0a;border-bottom:1px solid #1a1a1a;cursor:pointer}
.league-header{background:#111;border-top:2px solid #00ff66;padding:10px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}
.score{color:#00ff66;font-weight:900;font-size:16px;text-align:center;min-width:50px}
.time-box{width:72px;text-align:center}.time-live{color:#ff3b30;font-weight:900;animation:blink 1s infinite}.time-ft{color:#fff;font-weight:900}.time-green{color:#00ff66;font-weight:900}
@keyframes blink{50%{opacity:0.4}}
.box{background:#0a0a0a;border:1px solid #222;border-radius:10px;padding:12px;margin:8px}
table.standings{width:100%;border-collapse:collapse;font-size:11px} table.standings th{background:#00ff66;color:#000;padding:7px 3px} table.standings td{padding:8px 3px;border-bottom:1px solid #1a1a1a;text-align:center} table.standings td.teamCell{text-align:left;color:#fff}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2.5px solid #00ff66;z-index:9999}.bottom a{background:#00ff66;color:#000;padding:12px;border-radius:12px;font-weight:900;text-align:center;display:flex;justify-content:center;gap:10px;text-decoration:none}
.spacer{height:90px}.loading{padding:20px;text-align:center;color:#00ff66}
#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:none;overflow-y:auto}
#modalTop{background:#000;border-bottom:2.5px solid #00ff66;padding:12px;position:sticky;top:0;display:flex;justify-content:space-between;align-items:center}
.closeBtn{background:#00ff66;color:#000;border:none;padding:10px 18px;border-radius:8px;font-weight:900}
.tabs{display:flex;background:#111;border-bottom:2px solid #00ff66} .tabs button{flex:1;padding:12px;background:#111;color:#00ff66;border:none;font-weight:900;cursor:pointer} .tabs button.active{background:#00ff66;color:#000}
.grid{display:grid;grid-template-columns:1fr 90px 1fr;text-align:center;gap:8px;padding:10px;font-size:12px}
.bet{padding:10px}.bet a{background:#00ff66;color:#000;padding:12px;border-radius:12px;font-weight:900;text-decoration:none;display:flex;justify-content:center;gap:10px}
.logo1x-whiteblue{background:#fff;color:#0066ff;padding:5px 14px;border-radius:6px;font-weight:900;font-style:italic}
</style>
</head><body>
<div class="top"><span class="logo">DIAMOND - ALL SPORTS TABLE</span></div>
<div class="bet"><a href="${MY_1XBET}" target="_blank"><span class="logo1x-whiteblue">1XBET</span><span>BET NOW BONUS 300%</span></a></div>
<div class="sportsBar" id="sportsBar"></div>
<div class="days" id="daysBar"></div>
<div class="moreDaysBox" id="moreDaysBox"></div>
<div id="content"><div class="loading">Loading...</div></div>
<div id="modal"><div id="modalTop"><span style="color:#00ff66;font-weight:900" id="modalTitle">MATCH</span><button class="closeBtn" onclick="closeModal()">X CLOSE</button></div>
<div class="tabs"><button id="tb-d" class="active" onclick="showTab('d')">DETAILS</button><button id="tb-s" onclick="showTab('s')">STATS</button><button id="tb-t" onclick="showTab('t')">TABLE</button></div>
<div id="tab-d"></div>
<div id="tab-s" style="display:none"><div id="statsGrid" class="grid"></div></div>
<div id="tab-t" style="display:none"><div id="tableBox"></div></div>
<div class="bet"><a href="${MY_1XBET}" target="_blank"><span class="logo1x-whiteblue">1XBET</span><span>BET NOW ON THIS MATCH</span></a></div>
</div>
<div class="spacer"></div>
<div class="bottom"><a href="${MY_1XBET}" target="_blank"><span class="logo1x-whiteblue">1XBET</span><span>BET ALL SPORTS AUTO LIVE 30s</span></a></div>
<script>
var ALL_MATCHES=[]; var SELECTED_SPORT='football'; var SELECTED_DATE=''; var moreOpen=false; var autoTimer=null; var curLeagueId=null;
var SPORTS={football:{name:"FOOTBALL",icon:"⚽"},basketball:{name:"BASKETBALL",icon:"🏀"},handball:{name:"HANDBALL",icon:"🤾"},volleyball:{name:"VOLLEYBALL",icon:"🏐"},hockey:{name:"HOCKEY",icon:"🏒"},rugby:{name:"RUGBY",icon:"🏉"},tennis:{name:"TENNIS",icon:"🎾"}};
function getIso(off){ var n=new Date(); n.setDate(n.getDate()+off); var l=new Date(n.toLocaleString('en-US',{timeZone:'Africa/Lagos'})); return l.getFullYear()+"-"+String(l.getMonth()+1).padStart(2,'0')+"-"+String(l.getDate()).padStart(2,'0'); }
var dateMap={}; function initDates(){ dateMap['yesterday']=getIso(-1); dateMap['today']=getIso(0); dateMap['tomorrow']=getIso(1); for(var i=-7;i<=7;i++){ if(i===-1||i===0||i===1) continue; dateMap['d'+i]=getIso(i); } }
function buildSports(){ var html=''; for(var k in SPORTS){ var active=k===SELECTED_SPORT?'sport-active':'sport-inactive'; html+='<div class="sportBtn '+active+'" onclick="selectSport(\\''+k+'\\')">'+SPORTS[k].icon+' '+SPORTS[k].name+'</div>'; } document.getElementById('sportsBar').innerHTML=html; }
function selectSport(s){ SELECTED_SPORT=s; buildSports(); buildDays(); loadDate(dateMap['today'], false); startAuto(); }
function formatMoreDay(iso){ var dt=new Date(iso); return String(dt.getDate()).padStart(2,'0')+'/'+String(dt.getMonth()+1).padStart(2,'0')+' '+dt.toLocaleDateString('en-GB',{weekday:'short'}).substring(0,2); }
function buildDays(){ var html=''; [{key:'yesterday',label:'YESTERDAY'},{key:'today',label:'TODAY'},{key:'tomorrow',label:'TOMORROW'}].forEach(function(d){ var iso=dateMap[d.key]; var active=(SELECTED_DATE===iso)?'day-active':'day-inactive'; if(SELECTED_DATE===''&&d.key==='today'){active='day-active';SELECTED_DATE=iso;} html+='<div class="dayBtn '+active+'" onclick="selectDay(\\''+d.key+'\\')">'+d.label+'</div>'; }); html+='<div class="dayBtn '+(moreOpen?'day-active':'day-inactive')+'" onclick="toggleMoreDays()">MORE DAYS »</div>'; document.getElementById('daysBar').innerHTML=html; }
function selectDay(k){ moreOpen=false; document.getElementById('moreDaysBox').style.display='none'; SELECTED_DATE=dateMap[k]||dateMap['today']; buildDays(); loadDate(SELECTED_DATE,false); startAuto(); }
function toggleMoreDays(){ moreOpen=!moreOpen; if(!moreOpen){document.getElementById('moreDaysBox').style.display='none';buildDays();return;} var html='<div style="background:#8B0000;color:#fff;padding:10px;font-weight:900">More days</div>'; for(var i=-7;i<=7;i++){ if(i===-1) html+='<div style="padding:12px;border-bottom:1px solid #222;cursor:pointer" onclick="selectMore(\\'yesterday\\')"><a style="color:#00ccff">Yesterday</a></div>'; else if(i===0) html+='<div style="padding:12px;border-bottom:1px solid #222;cursor:pointer" onclick="selectMore(\\'today\\')"><a style="color:#00ccff">Today</a></div>'; else if(i===1) html+='<div style="padding:12px;border-bottom:1px solid #222;cursor:pointer" onclick="selectMore(\\'tomorrow\\')"><a style="color:#00ccff">Tomorrow</a></div>'; else{ var iso=getIso(i); html+='<div style="padding:12px;border-bottom:1px solid #222;cursor:pointer" onclick="selectMore(\\'d'+i+'\\')"><a style="color:#00ccff">'+formatMoreDay(iso)+'</a></div>'; } } document.getElementById('moreDaysBox').innerHTML=html; document.getElementById('moreDaysBox').style.display='block'; buildDays(); }
function selectMore(k){ SELECTED_DATE=dateMap[k]||getIso(0); moreOpen=false; document.getElementById('moreDaysBox').style.display='none'; buildDays(); loadDate(SELECTED_DATE,false); startAuto(); }
function getScores(m){ try{ var s=m.state?.score?.current||""; if(typeof s==='string'&&s.indexOf('-')>-1){ var p=s.split('-'); return {h:p[0].trim(),a:p[1].trim()}; } return {h:null,a:null}; }catch(e){ return {h:null,a:null}; } }
function getTimeInfo(m){ var s=m.date||""; var desc=(m.state?.description||m.status||"").toUpperCase(); var isFin=desc.indexOf('FINISHED')>-1; var isLive=desc.indexOf('HALF')>-1||desc.indexOf('LIVE')>-1; var timeStr="-"; try{ if(s){ var dt=new Date(s); if(!isNaN(dt.getTime())) timeStr=dt.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'}); } }catch(e){} var display=isFin?'FT':(isLive?'LIVE':timeStr); return {display:display,isLive:isLive,isFinished:isFin,ts:s?new Date(s).getTime():0}; }
async function loadDate(dstr,silent){ if(!dstr) dstr=getIso(0); SELECTED_DATE=dstr; buildSports(); buildDays(); if(!silent) document.getElementById('content').innerHTML='<div class="loading">Loading '+SPORTS[SELECTED_SPORT].name+'...</div>'; try{ var res=await fetch('/api/sports?sport='+SELECTED_SPORT+'&date='+dstr+'&t='+Date.now()); var data=await res.json(); ALL_MATCHES=data.data||data.matches||[]; if(!Array.isArray(ALL_MATCHES)) ALL_MATCHES=[]; render(silent); }catch(e){ if(!silent) document.getElementById('content').innerHTML='<div class="box">No games</div>'; } }
function render(silent){ if(ALL_MATCHES.length===0){ if(!silent) document.getElementById('content').innerHTML='<div class="box">No '+SELECTED_SPORT+' games for '+SELECTED_DATE+'</div>'; return; } var groups={}; ALL_MATCHES.forEach(function(m){ var ln=(m.league?.name||"Unknown").trim(); var cn=(m.country?.name||m.league?.country||"World"); if(typeof cn!=='string') cn=cn.name||"World"; cn=cn.trim(); var lid=m.league?.id||0; var key=(cn+"|"+ln).toUpperCase(); if(!groups[key]) groups[key]={country:cn,league:ln,leagueId:lid,games:[]}; groups[key].games.push(m); }); var html='<div class="sectionTitle"><span>'+SPORTS[SELECTED_SPORT].icon+' '+SELECTED_SPORT.toUpperCase()+' - '+SELECTED_DATE+' ('+ALL_MATCHES.length+')</span><span style="color:#ff3b30;font-size:10px">● AUTO 30s</span></div>'; Object.values(groups).forEach(function(gr){ gr.games.sort((a,b)=>getTimeInfo(a).ts-getTimeInfo(b).ts); html+='<div class="league-header" onclick="openTableFromList(\\''+gr.leagueId+'\\')"><div><span style="background:#00ff66;color:#000;padding:3px 8px;border-radius:4px;font-weight:900;font-size:10px">'+gr.country.toUpperCase()+'</span><span style="color:#00ff66;font-weight:900;margin-left:8px">'+gr.league.toUpperCase()+'</span></div><span style="background:#00ff66;color:#000;padding:2px 8px;border-radius:12px;font-size:10px">TABLE</span></div>'; gr.games.forEach(function(m){ var h=m.homeTeam?.name||"Home"; var a=m.awayTeam?.name||"Away"; var ti=getTimeInfo(m); var sc=getScores(m); var scoreHtml=sc.h!=null?'<span style="color:#00ff66;font-weight:900">'+sc.h+'</span><br><span style="color:#00ff66;font-weight:900">'+sc.a+'</span>':(ti.isFinished?'FT':'-'); var tc=ti.isLive?'time-live':(ti.isFinished?'time-ft':'time-green'); html+='<div class="match" onclick="openDetails(\\''+m.id+'\\',\\''+gr.leagueId+'\\')"><div class="time-box"><div class="'+tc+'">'+ti.display+'</div></div><div style="flex:1;margin-left:10px"><div style="font-size:13px">'+h+'</div><div style="font-size:13px;color:#aaa;margin-top:4px">'+a+'</div></div><div class="score">'+scoreHtml+'</div></div>'; }); }); document.getElementById('content').innerHTML=html; }
function startAuto(){ if(autoTimer) clearInterval(autoTimer); autoTimer=setInterval(function(){ loadDate(SELECTED_DATE,true); },30000); }
async function openTableFromList(lid){ var first=ALL_MATCHES.find(m=> (m.league?.id||0)==lid); if(first) openDetails(first.id, lid); }
async function openDetails(id, leagueId){
 curLeagueId=leagueId||null;
 document.getElementById('modal').style.display='block';
 showTab('d');
 document.getElementById('tab-d').innerHTML='<div class="loading">Loading DETAILS - '+SELECTED_SPORT+'...</div>';
 document.getElementById('statsGrid').innerHTML='<div class="loading">Loading STATS...</div>';
 document.getElementById('tableBox').innerHTML='<div class="loading">Loading TABLE...</div>';
 try{
  var res=await fetch('/api/match?sport='+SELECTED_SPORT+'&id='+id+'&t='+Date.now());
  var data=await res.json(); var m=data.data||data||{}; if(Array.isArray(m)) m=m[0]||{};
  var h=m.homeTeam?.name||"Home"; var a=m.awayTeam?.name||"Away"; var sc=getScores(m); var ft=sc.h!=null?sc.h+' - '+sc.a:'0 - 0';
  var league=m.league?.name||"League"; var status=m.state?.description||m.status||"";
  document.getElementById('modalTitle').textContent=h+' vs '+a+' - '+SELECTED_SPORT.toUpperCase();
  // DETAILS TAB
  document.getElementById('tab-d').innerHTML='<div class="box" style="text-align:center"><div style="color:#00ff66;font-weight:900">'+SPORTS[SELECTED_SPORT].icon+' '+SELECTED_SPORT.toUpperCase()+' - '+league+'</div><div style="font-size:36px;font-weight:900;margin:10px 0">'+ft+'</div><div style="color:#aaa;font-size:11px">Status: '+status+'<br>Date: '+SELECTED_DATE+'<br>League ID: '+(curLeagueId||m.league?.id)+'</div><div style="margin-top:10px;color:#ff3b30;font-size:11px">● AUTO LIVE</div></div>';
  // STATS TAB - ALL SPORTS DIFFERENT
  var st=m.stats||m.state||{};
  var grid=document.getElementById('statsGrid');
  if(SELECTED_SPORT==='football'){
   grid.innerHTML='<b>'+h+'</b><span style=color:#00ff66>TEAM</span><b>'+a+'</b><span>'+(st.homePossession||'50%')+'</span><span style=color:#00ff66>Possession</span><span>'+(st.awayPossession||'50%')+'</span><span>'+(st.homeShots||st.shots?.home||'-')+'</span><span style=color:#00ff66>Shots</span><span>'+(st.awayShots||'-')+'</span><span>'+(st.homeCorners||'-')+'</span><span style=color:#00ff66>Corners</span><span>'+(st.awayCorners||'-')+'</span><span>'+(st.homeYellow||'-')+'</span><span style=color:#00ff66>Yellow</span><span>'+(st.awayYellow||'-')+'</span>';
  } else if(SELECTED_SPORT==='basketball'){
   grid.innerHTML='<b>HOME</b><span style=color:#00ff66>STAT</span><b>AWAY</b><span>'+(sc.h||'-')+'</span><span style=color:#00ff66>Score</span><span>'+(sc.a||'-')+'</span><span>'+(st.q1||'-')+'</span><span style=color:#00ff66>Q1</span><span>'+(st.q2||'-')+'</span><span>'+(st.rebounds||'-')+'</span><span style=color:#00ff66>Rebounds</span><span>'+(st.fouls||'-')+'</span>';
  } else if(SELECTED_SPORT==='tennis'){
   grid.innerHTML='<b>P1</b><span style=color:#00ff66>STAT</span><b>P2</b><span>'+(st.acesHome||'0')+'</span><span style=color:#00ff66>Aces</span><span>'+(st.acesAway||'0')+'</span><span>'+(st.doubleHome||'0')+'</span><span style=color:#00ff66>Double Fault</span><span>'+(st.doubleAway||'0')+'</span><span>'+(st.breakHome||'0')+'</span><span style=color:#00ff66>Break Pts</span><span>'+(st.breakAway||'0')+'</span>';
  } else {
   grid.innerHTML='<b>HOME</b><span style=color:#00ff66>STAT</span><b>AWAY</b><span>'+(st.attacksHome||'-')+'</span><span style=color:#00ff66>Attacks</span><span>'+(st.attacksAway||'-')+'</span><span>'+(st.shotsHome||'-')+'</span><span style=color:#00ff66>Shots</span><span>'+(st.shotsAway||'-')+'</span><span>'+(st.blocks||'-')+'</span><span style=color:#00ff66>Blocks</span><span>'+(st.serves||'-')+'</span>';
  }
  // TABLE TAB
  if(curLeagueId){
   var rt=await fetch('/api/standings?sport='+SELECTED_SPORT+'&id='+curLeagueId+'&t='+Date.now());
   var td=await rt.json(); var rows=td.data||[];
   if(rows.length>0){
    var html='<div class="box" style="padding:0;overflow-x:auto"><table class="standings"><tr><th>#</th><th style="text-align:left">Team</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>G</th><th>PTS</th></tr>';
    rows.forEach(r=>{ var hl=(r.team.toUpperCase()===h.toUpperCase()||r.team.toUpperCase()===a.toUpperCase())?' style="background:#0f2f0f"':''; html+='<tr'+hl+'><td style="color:#00ff66;font-weight:900">'+r.pos+'.</td><td class="teamCell">'+r.team+'</td><td>'+r.MP+'</td><td>'+r.W+'</td><td>'+r.D+'</td><td>'+r.L+'</td><td>'+r.G+'</td><td style="color:#00ff66;font-weight:900">'+r.PTS+'</td></tr>'; });
    html+='</table></div><div class="box" style="color:#00ff66;font-size:11px">✓ AUTO TABLE FOR '+SELECTED_SPORT.toUpperCase()+' - Highlight current match teams</div>';
    document.getElementById('tableBox').innerHTML=html;
   } else { document.getElementById('tableBox').innerHTML='<div class="box">No table for this league in '+SELECTED_SPORT+'</div>'; }
  }
 }catch(e){ document.getElementById('tab-d').innerHTML='<div class="box">Error loading details</div>'; }
}
function showTab(id){
 document.getElementById('tab-d').style.display=id==='d'?'block':'none';
 document.getElementById('tab-s').style.display=id==='s'?'block':'none';
 document.getElementById('tab-t').style.display=id==='t'?'block':'none';
 document.getElementById('tb-d').classList.toggle('active',id==='d');
 document.getElementById('tb-s').classList.toggle('active',id==='s');
 document.getElementById('tb-t').classList.toggle('active',id==='t');
}
function closeModal(){ document.getElementById('modal').style.display='none'; }
initDates(); buildSports(); buildDays(); loadDate(getIso(0),false); startAuto();
document.addEventListener('visibilitychange',function(){ if(!document.hidden) loadDate(SELECTED_DATE,true); });
</script>
</body></html>`;
return new Response(html,{headers:{"Content-Type":"text/html; charset=UTF-8","Cache-Control":"no-cache"}});
}
}
