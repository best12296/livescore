const MY_1XBET = "https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97";

export default {
  async fetch(request, env){
    const HIGHLIGHTLY_KEY = env.HIGHLIGHTLY_KEY || "afad9a68-c248-429b-8aa7-b7626bb56744";
    const url = new URL(request.url);
    if(url.pathname === "/api/highlightly"){
      const date = url.searchParams.get("date") || new Date().toISOString().split('T')[0];
      const r = await fetch(`https://soccer.highlightly.net/matches?date=${date}`, { headers: { "x-rapidapi-key": HIGHLIGHTLY_KEY } });
      return new Response(await r.text(), { headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/highlights"){
      const id = url.searchParams.get("id");
      const r = await fetch(`https://soccer.highlightly.net/highlights?matchId=${id}`, { headers: { "x-rapidapi-key": HIGHLIGHTLY_KEY } });
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
.tab-refresh{background:#111;color:#00ff66;border:1.5px solid #00ff66}
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
.score{color:#00ff66;font-weight:900;font-size:15px;text-align:center;min-width:36px;line-height:18px}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2.5px solid #00ff66;z-index:9999}
.bottom a{background:#00ff66;color:#000;padding:13px;border-radius:10px;font-weight:900;text-align:center;display:block;text-decoration:none}
.spacer{height:90px}
.loading{padding:20px;text-align:center;color:#00ff66}
#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:none;overflow-y:auto}
#modalTop{background:#000;border-bottom:2.5px solid #00ff66;padding:12px;position:sticky;top:0;display:flex;justify-content:space-between;align-items:center}
.closeBtn{background:#00ff66;color:#000;border:none;padding:10px 18px;border-radius:8px;font-weight:900}
.box{background:#0a0a0a;border:1px solid #1a1a1a;border-radius:10px;padding:10px;margin:8px}
</style>
</head><body>
<div class="top"><span class="logo">DIAMOND LIVESCORE</span></div>
<div class="bet"><a href="${MY_1XBET}" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>

<div class="tabs">
  <div class="tab tab-inactive" onclick="setTab('yesterday')" id="tab-yesterday">YESTERDAY</div>
  <div class="tab tab-active" onclick="setTab('today')" id="tab-today">TODAY</div>
  <div class="tab tab-inactive" onclick="setTab('live')" id="tab-live">LIVE</div>
  <div class="tab tab-inactive" onclick="setTab('finished')" id="tab-finished">FINISHED</div>
  <div class="tab tab-refresh" onclick="refreshCurrent()" id="tab-refresh">REFRESH</div>
</div>

<div id="main"><div id="content"><div class="loading">Loading...</div></div></div>

<div id="modal"><div id="modalTop"><span style="color:#00ff66;font-weight:900">MATCH</span><button class="closeBtn" onclick="closeModal()">X CLOSE</button></div><div id="modalContent"></div></div>
<div class="spacer"></div>
<div class="bottom"><a href="${MY_1XBET}" target="_blank">1XBET - BET NOW</a></div>

<script>
let CURRENT_TAB = 'today';
let ALL_MATCHES = [];
const TOP_LEAGUES = ["champions league","europa league","conference league","premier league","laliga","la liga","ligue 1","bundesliga","serie a","eredivisie","championship","fa cup"];

function getDateStr(offset){
  const now = new Date(); now.setDate(now.getDate()+offset);
  const lagos = new Date(now.toLocaleString('en-US',{timeZone:'Africa/Lagos'}));
  return lagos.getFullYear() + "-" + String(lagos.getMonth()+1).padStart(2,'0') + "-" + String(lagos.getDate()).padStart(2,'0');
}

function getScores(m){
  // TRY EVERY POSSIBLE SCORE FIELD FROM HIGHLIGHTLY
  let h = m.homeScore ?? m.awayScore ? m.homeScore : undefined;
  let a = m.awayScore;

  if(h===undefined) h = m.score?.home ?? m.score?.homeTeam ?? m.result?.home ?? m.results?.home ?? m.goals?.home ?? m.ft?.home ?? m.fullTime?.home;
  if(a===undefined) a = m.score?.away ?? m.score?.awayTeam ?? m.result?.away ?? m.results?.away ?? m.goals?.away ?? m.ft?.away ?? m.fullTime?.away;

  if(h===undefined && typeof m.score === 'string' && m.score.includes('-')){
    const parts = m.score.split('-'); h = parts[0].trim(); a = parts[1].trim();
  }
  if(h===undefined && m.result){
    if(typeof m.result === 'string' && m.result.includes('-')){ const p=m.result.split('-'); h=p[0]; a=p[1]; }
  }
  // final fallback from score object like {home:1, away:2} as numbers
  if(h===undefined) h = m.homeGoals ?? m.home_goals;
  if(a===undefined) a = m.awayGoals ?? m.away_goals;

  return { h: (h!==undefined && h!==null && h!=="") ? h : null, a: (a!==undefined && a!==null && a!=="") ? a : null };
}

function getMatchTime(m){
  let s = m.date || m.startTime || m.kickoff || "";
  const status = (m.status||m.matchStatus||"").toUpperCase();
  const isLive = status.includes("LIVE") || status.includes("1H") || status.includes("2H") || status.includes("HT");
  const isFinished = status.includes("FT") || status.includes("FINISHED") || status.includes("ENDED") || status==="FT" || m.finished || m.isFinished;
  if(!s) {
    return { main: isFinished ? "FT" : (isLive ? "LIVE" : "-"), isLive, isFinished, ts:0 };
  }
  try{
    let d = new Date(s);
    if(isNaN(d.getTime())) return { main: isFinished ? "FT" : (isLive ? "LIVE" : s.slice(0,5)), isLive, isFinished, ts:0 };
    const time = d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'});
    if(isLive) return { main:"LIVE", isLive:true, isFinished:false, ts:d.getTime() };
    if(isFinished) return { main:"FT", isLive:false, isFinished:true, ts:d.getTime() };
    return { main:time, isLive:false, isFinished:false, ts:d.getTime() };
  }catch(e){ return { main: isFinished ? "FT" : "-", isLive, isFinished, ts:0 } }
}

function setTab(tab){
  CURRENT_TAB=tab;
  document.querySelectorAll('[id^="tab-"]').forEach(el=>{ if(el.id==='tab-refresh') return; el.className='tab tab-inactive'; });
  document.getElementById('tab-'+tab).className='tab tab-active';
  if(tab==='yesterday') loadDate(getDateStr(-1));
  else if(tab==='today') loadDate(getDateStr(0));
  else renderFiltered();
}

function refreshCurrent(){
  const btn=document.getElementById('tab-refresh'); btn.textContent='LOADING...';
  if(CURRENT_TAB==='yesterday') loadDate(getDateStr(-1));
  else if(CURRENT_TAB==='today') loadDate(getDateStr(0));
  else { renderFiltered(); btn.textContent='REFRESH'; }
}

async function loadDate(dateStr){
  document.getElementById('content').innerHTML='<div class="loading">Loading '+dateStr+'...</div>';
  try{
    const res=await fetch('/api/highlightly?date='+dateStr);
    const data=await res.json();
    ALL_MATCHES=data.data||data.matches||[];
    if(!Array.isArray(ALL_MATCHES)) ALL_MATCHES=[];
    console.log('Highlightly sample', ALL_MATCHES[0]);
    renderFiltered();
  }catch(e){
    document.getElementById('content').innerHTML='<div class="loading">Error '+e.message+'</div>';
  }
  document.getElementById('tab-refresh').textContent='REFRESH';
}

function renderFiltered(){
  let filtered=ALL_MATCHES;
  if(CURRENT_TAB==='live') filtered=ALL_MATCHES.filter(m=> getMatchTime(m).isLive);
  if(CURRENT_TAB==='finished') filtered=ALL_MATCHES.filter(m=> getMatchTime(m).isFinished);

  if(filtered.length===0){
    document.getElementById('content').innerHTML='<div class="loading">No '+CURRENT_TAB.toUpperCase()+' matches for this date.</div>';
    return;
  }

  const topGroups={}; const otherGroups={};
  filtered.forEach(m=>{
    const leagueName=(m.league?.name||m.competition?.name||"Unknown").trim();
    const countryName=(m.league?.country||m.country?.name||m.country||"World").trim();
    const key=(countryName+"|"+leagueName).toUpperCase();
    const isTop=TOP_LEAGUES.some(k=> leagueName.toLowerCase().includes(k));
    const target=isTop?topGroups:otherGroups;
    if(!target[key]) target[key]={country:countryName, league:leagueName, games:[]};
    target[key].games.push(m);
  });

  let html='';
  if(Object.keys(topGroups).length>0){
    html+='<div class="sectionTitle">TOP 9 LEAGUES - Always On Top</div>';
    html+=renderGroupHtml(topGroups);
  }
  if(Object.keys(otherGroups).length>0){
    html+='<div class="sectionTitle">OTHER LEAGUES</div>';
    html+=renderGroupHtml(otherGroups);
  }
  document.getElementById('content').innerHTML=html;
}

function renderGroupHtml(groups){
  let h='';
  Object.values(groups).forEach(g=>{
    g.games.sort((a,b)=> getMatchTime(a).ts - getMatchTime(b).ts);
    h+=\`<div class="league-header"><div style="display:flex;align-items:center"><span class="country-badge">\${g.country.toUpperCase()}</span><span class="league-name">\${g.league.toUpperCase()}</span></div><span class="league-count">\${g.games.length}</span></div>\`;
    g.games.forEach(match=>{
      const home=match.homeTeam?.name||match.home?.name||"Home";
      const away=match.awayTeam?.name||match.away?.name||"Away";
      const t=getMatchTime(match);
      const sc=getScores(match);
      let scoreHtml='';
      if(sc.h!==null && sc.a!==null){
        scoreHtml=\`\${sc.h}<br>\${sc.a}\`;
      } else if(t.isFinished || CURRENT_TAB==='yesterday' || CURRENT_TAB==='finished'){
        // For yesterday/finished if no score parsed, show FT but try raw
        const raw = match.score || match.result || "";
        scoreHtml= raw ? String(raw).replace('-','<br>') : '<span style="color:#fff">\${t.main}</span>';
        // Actually show FT if still no score
        if(!raw) scoreHtml='FT<br><span style="font-size:11px">\${t.main==="FT"?"":t.main}</span>';
      } else {
        scoreHtml='<span style="color:#00ff66">-</span><br><span style="color:#00ff66">-</span>';
      }
      let timeClass='time-green';
      if(t.isLive) timeClass='time-live';
      if(t.isFinished || CURRENT_TAB==='yesterday') timeClass='time-ft';
      
      let timeDisplay = t.main;
      if(CURRENT_TAB==='yesterday' || CURRENT_TAB==='finished' || t.isFinished) timeDisplay='FT';

      h+=\`<div class="match" onclick="openMatch('\${match.id}')">
        <div class="time-box"><div class="\${timeClass}">\${timeDisplay}</div></div>
        <div style="flex:1;margin-left:10px">
          <div class="team">\${home}</div>
          <div class="team" style="margin-top:4px;color:#aaa">\${away}</div>
        </div>
        <div class="score">\${scoreHtml}</div>
      </div>\`;
    });
  });
  return h;
}

function openMatch(id){ document.getElementById('modal').style.display='block'; document.getElementById('modalContent').innerHTML='<div class="box"><a href="${MY_1XBET}" target="_blank" style="background:#00ff66;color:#000;padding:12px;border-radius:8px;font-weight:900;display:block;text-align:center;text-decoration:none">BET NOW - 1XBET 300% BONUS</a></div>'; }
function closeModal(){document.getElementById('modal').style.display='none';}

loadDate(getDateStr(0));
</script>
</body></html>`;
    return new Response(html, { headers: {"Content-Type":"text/html","Cache-Control":"no-cache"} });
  }
}
