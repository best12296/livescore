const MY_1XBET = "https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97";
export default {
  async fetch(request, env){
    const HIGHLIGHTLY_KEY = env.HIGHLIGHTLY_KEY || "afad9a68-c248-429b-8aa7-b7626bb56744";
    const url = new URL(request.url);
    if(url.pathname === "/api/highlightly"){
      const date = url.searchParams.get("date") || new Date().toISOString().split('T')[0];
      const r = await fetch("https://soccer.highlightly.net/matches?date="+date, { headers: { "x-rapidapi-key": HIGHLIGHTLY_KEY } });
      const text = await r.text();
      return new Response(text, { headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/highlights"){
      const id = url.searchParams.get("id");
      const r = await fetch("https://soccer.highlightly.net/highlights?matchId="+id, { headers: { "x-rapidapi-key": HIGHLIGHTLY_KEY } });
      return new Response(await r.text(), { headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE</title>
<style>
html,body{margin:0;background:#000;color:#fff;font-family:Arial}
.top{display:flex;justify-content:center;padding:12px;background:#000;border-bottom:3px solid #00ff66;position:sticky;top:0;z-index:200}
.logo{background:#00ff66;color:#000;padding:8px 28px;border-radius:8px;font-weight:900;font-style:italic;font-size:15px}
.bet{padding:10px;background:#000}
.bet a{background:#00ff66;color:#000;padding:13px;border-radius:10px;font-weight:900;text-decoration:none;text-align:center;display:block;font-size:14px}
.tabs{display:flex;gap:6px;padding:10px;background:#000;position:sticky;top:56px;z-index:150;border-bottom:2px solid #00ff66;overflow-x:auto}
.tab{padding:8px 14px;border-radius:20px;font-weight:900;font-size:12px;white-space:nowrap;cursor:pointer;border:1.5px solid #00ff66}
.tab-inactive{background:#000;color:#00ff66}
.tab-active{background:#00ff66;color:#000}
.sectionTitle{background:#00ff66;color:#000;padding:9px 10px;font-weight:900;font-size:12px;margin-top:2px}
.league-header{background:#111;border-top:2.5px solid #00ff66;border-bottom:1px solid #00ff66;padding:10px 10px;display:flex;justify-content:space-between;align-items:center}
.country-badge{background:#00ff66;color:#000;font-weight:900;font-size:10px;padding:3px 8px;border-radius:4px}
.league-name{color:#00ff66;font-weight:900;font-size:12px;margin-left:8px}
.league-count{color:#00ff66;font-weight:900;font-size:11px;background:#000;border:1px solid #00ff66;padding:2px 8px;border-radius:12px}
.match{display:flex;justify-content:space-between;align-items:center;padding:11px 10px;background:#0a0a0a;border-bottom:1px solid #1a1a1a}
.time-box{width:62px;text-align:center}
.time-green{color:#00ff66;font-weight:900;font-size:13px}
.time-live{color:#ff3b30;font-weight:900;font-size:13px;animation:blink 1s infinite}
.time-ft{color:#fff;font-weight:900;font-size:13px}
@keyframes blink{0%{opacity:1}50%{opacity:0.4}100%{opacity:1}}
.team{font-size:13px;line-height:16px}
.score{color:#00ff66;font-weight:900;font-size:15px;text-align:center;min-width:42px;line-height:18px}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2.5px solid #00ff66;z-index:9999}
.bottom a{background:#00ff66;color:#000;padding:13px;border-radius:10px;font-weight:900;text-align:center;display:block;text-decoration:none}
.spacer{height:90px}
.loading{padding:20px;text-align:center;color:#00ff66}
</style>
</head><body>
<div class="top"><span class="logo">DIAMOND LIVESCORE</span></div>
<div class="bet"><a href="${MY_1XBET}" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>
<div class="tabs">
  <div class="tab tab-inactive" onclick="setTab('yesterday')" id="tab-yesterday">YESTERDAY</div>
  <div class="tab tab-active" onclick="setTab('today')" id="tab-today">TODAY</div>
  <div class="tab tab-inactive" onclick="setTab('live')" id="tab-live">LIVE</div>
  <div class="tab tab-inactive" onclick="setTab('finished')" id="tab-finished">FINISHED</div>
  <div class="tab tab-inactive" onclick="refreshCurrent()" id="tab-refresh">REFRESH</div>
</div>
<div id="content"><div class="loading">Loading...</div></div>
<div class="spacer"></div>
<div class="bottom"><a href="${MY_1XBET}" target="_blank">1XBET - BET NOW</a></div>
<script>
var CURRENT_TAB = 'today';
var ALL_MATCHES = [];
var TOP_LEAGUES = ["serie a","premier league","laliga","la liga","bundesliga","ligue 1","eredivisie","champions league","europa league"];

function getDateStr(offset){
  var now = new Date(); now.setDate(now.getDate()+offset);
  var lagos = new Date(now.toLocaleString('en-US',{timeZone:'Africa/Lagos'}));
  var y = lagos.getFullYear();
  var m = String(lagos.getMonth()+1).padStart(2,'0');
  var d = String(lagos.getDate()).padStart(2,'0');
  return y + "-" + m + "-" + d;
}

function getScores(m){
  var h = null, a = null;
  if(m.homeScore!=null) h=m.homeScore;
  if(m.awayScore!=null) a=m.awayScore;
  if(h==null && m.score){
    if(typeof m.score==='object'){ h=m.score.home!=null?m.score.home:m.score.homeTeam; a=m.score.away!=null?m.score.away:m.score.awayTeam; }
    if(typeof m.score==='string' && m.score.indexOf('-')>-1){ var p=m.score.split('-'); h=p[0].trim(); a=p[1].trim(); }
  }
  if(h==null && m.result){
    if(typeof m.result==='string' && m.result.indexOf('-')>-1){ var p2=m.result.split('-'); h=p2[0].trim(); a=p2[1].trim(); }
    if(typeof m.result==='object'){ h=m.result.home; a=m.result.away; }
  }
  if(h==null){ h=m.goals?.home ?? m.fullTime?.home ?? m.ft?.home ?? m.homeGoals; }
  if(a==null){ a=m.goals?.away ?? m.fullTime?.away ?? m.ft?.away ?? m.awayGoals; }
  if(h==null && m.goals_home!=null){ h=m.goals_home; a=m.goals_away; }
  return {h:h, a:a};
}

function getTimeInfo(m){
  var s = m.date || m.startTime || m.kickoff || "";
  var status = (m.status || m.matchStatus || "").toUpperCase();
  var isLive = status.indexOf('LIVE')>-1 || status.indexOf('1H')>-1 || status.indexOf('2H')>-1 || status.indexOf('HT')>-1;
  var isFinished = status.indexOf('FT')>-1 || status.indexOf('FINISHED')>-1 || status.indexOf('ENDED')>-1 || status==='FT';
  var ts = 0; var display = "-";
  try{
    if(s){ var d=new Date(s); if(!isNaN(d.getTime())){ ts=d.getTime(); display=d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'}); if(isLive) display='LIVE'; if(isFinished) display='FT'; } else { if(s.indexOf(':')>-1) display=s.slice(0,5); } }
  }catch(e){}
  if(isFinished) display='FT';
  if(isLive) display='LIVE';
  return {display:display, isLive:isLive, isFinished:isFinished, ts:ts};
}

function setTab(tab){
  CURRENT_TAB=tab;
  var els=document.querySelectorAll('[id^="tab-"]');
  for(var i=0;i<els.length;i++){ if(els[i].id==='tab-refresh') continue; els[i].className='tab tab-inactive'; }
  document.getElementById('tab-'+tab).className='tab tab-active';
  if(tab==='yesterday') loadDate(getDateStr(-1));
  else if(tab==='today') loadDate(getDateStr(0));
  else render();
}
function refreshCurrent(){ var b=document.getElementById('tab-refresh'); b.textContent='LOADING...'; if(CURRENT_TAB==='yesterday') loadDate(getDateStr(-1)); else if(CURRENT_TAB==='today') loadDate(getDateStr(0)); else { render(); b.textContent='REFRESH'; } }

async function loadDate(dateStr){
  document.getElementById('content').innerHTML='<div class="loading">Loading '+dateStr+'...</div>';
  try{
    var res=await fetch('/api/highlightly?date='+dateStr);
    var data=await res.json();
    ALL_MATCHES=data.data||data.matches||[];
    if(!Array.isArray(ALL_MATCHES)) ALL_MATCHES=[];
    render();
  }catch(e){ document.getElementById('content').innerHTML='<div class="loading">Error '+e.message+'</div>'; }
  document.getElementById('tab-refresh').textContent='REFRESH';
}

function render(){
  var filtered=ALL_MATCHES;
  if(CURRENT_TAB==='live') filtered=ALL_MATCHES.filter(function(m){ return getTimeInfo(m).isLive; });
  if(CURRENT_TAB==='finished') filtered=ALL_MATCHES.filter(function(m){ return getTimeInfo(m).isFinished; });

  if(filtered.length===0){ document.getElementById('content').innerHTML='<div class="loading">No '+CURRENT_TAB.toUpperCase()+' matches for this date. Highlightly may have limited coverage vs Flashscore. Try YESTERDAY/TODAY.</div>'; return; }

  var topGroups={}; var otherGroups={};
  filtered.forEach(function(m){
    var leagueName=(m.league?.name||m.competition?.name||"Unknown").trim();
    var countryName=(m.league?.country||m.country?.name||m.country||"World").trim();
    var key=(countryName+"|"+leagueName).toUpperCase();
    var isTop=false;
    for(var i=0;i<TOP_LEAGUES.length;i++){ if(leagueName.toLowerCase().indexOf(TOP_LEAGUES[i])>-1){ isTop=true; break; } }
    var target=isTop?topGroups:otherGroups;
    if(!target[key]) target[key]={country:countryName, league:leagueName, games:[]};
    target[key].games.push(m);
  });

  var html='';
  // TOP 9 ALWAYS ON TOP
  if(Object.keys(topGroups).length>0){
    html+='<div class="sectionTitle">TOP 9 LEAGUES - Always On Top</div>';
    html+=renderGroups(topGroups);
  }
  if(Object.keys(otherGroups).length>0){
    html+='<div class="sectionTitle">OTHER LEAGUES</div>';
    html+=renderGroups(otherGroups);
  }
  document.getElementById('content').innerHTML=html;
}

function renderGroups(groups){
  var out='';
  Object.values(groups).forEach(function(g){
    g.games.sort(function(a,b){ return getTimeInfo(a).ts - getTimeInfo(b).ts; });
    out+='<div class="league-header"><div style="display:flex;align-items:center"><span class="country-badge">'+g.country.toUpperCase()+'</span><span class="league-name">'+g.league.toUpperCase()+'</span></div><span class="league-count">'+g.games.length+'</span></div>';
    g.games.forEach(function(m){
      var home=m.homeTeam?.name||m.home?.name||"Home";
      var away=m.awayTeam?.name||m.away?.name||"Away";
      var ti=getTimeInfo(m);
      var sc=getScores(m);
      var scoreTxt='';
      if(sc.h!=null && sc.a!=null){ scoreTxt=sc.h+'<br>'+sc.a; }
      else if(ti.isFinished || CURRENT_TAB==='yesterday' || CURRENT_TAB==='finished'){ scoreTxt='FT'; }
      else { scoreTxt='<span style="color:#00ff66">-</span><br><span style="color:#00ff66">-</span>'; }
      var timeClass='time-green';
      if(ti.isLive) timeClass='time-live';
      if(ti.isFinished) timeClass='time-ft';
      out+='<div class="match"><div class="time-box"><div class="'+timeClass+'">'+ti.display+'</div></div><div style="flex:1;margin-left:10px"><div class="team">'+home+'</div><div class="team" style="margin-top:4px;color:#aaa">'+away+'</div></div><div class="score">'+scoreTxt+'</div></div>';
    });
  });
  return out;
}
loadDate(getDateStr(0));
</script>
</body></html>`;
    return new Response(html, { headers: {"Content-Type":"text/html","Cache-Control":"no-cache"} });
  }
}
