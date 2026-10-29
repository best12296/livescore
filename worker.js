const MY_1XBET = "https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97";

export default {
  async fetch(request, env){
    const HIGHLIGHTLY_KEY = env.HIGHLIGHTLY_KEY || "afad9a68-c248-429b-8aa7-b7626bb56744";
    const url = new URL(request.url);

    if(url.pathname === "/api/highlightly"){
      const date = url.searchParams.get("date") || new Date().toISOString().split('T')[0];
      const r = await fetch(`https://soccer.highlightly.net/matches?date=${date}`, {
        headers: { "x-rapidapi-key": HIGHLIGHTLY_KEY }
      });
      return new Response(await r.text(), { headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/highlights"){
      const id = url.searchParams.get("id");
      const r = await fetch(`https://soccer.highlightly.net/highlights?matchId=${id}`, {
        headers: { "x-rapidapi-key": HIGHLIGHTLY_KEY }
      });
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
/* TABS - Today Live Finished Yesterday Refresh */
.tabs{display:flex;gap:6px;padding:10px;background:#000;position:sticky;top:56px;z-index:150;border-bottom:2px solid #00ff66;overflow-x:auto}
.tab{padding:8px 14px;border-radius:20px;font-weight:900;font-size:12px;white-space:nowrap;cursor:pointer;border:1.5px solid #00ff66}
.tab-inactive{background:#000;color:#00ff66}
.tab-active{background:#00ff66;color:#000}
.tab-refresh{background:#111;color:#00ff66;border:1.5px solid #00ff66}
.sectionTitle{background:#00ff66;color:#000;padding:9px 10px;font-weight:900;font-size:12px}
.league-header{background:#111;border-top:2.5px solid #00ff66;border-bottom:1px solid #00ff66;padding:10px 10px;display:flex;justify-content:space-between;align-items:center}
.country-badge{background:#00ff66;color:#000;font-weight:900;font-size:10px;padding:3px 8px;border-radius:4px}
.league-name{color:#00ff66;font-weight:900;font-size:12px;margin-left:8px}
.league-count{color:#00ff66;font-weight:900;font-size:11px;background:#000;border:1px solid #00ff66;padding:2px 8px;border-radius:12px}
.match{display:flex;justify-content:space-between;align-items:center;padding:11px 10px;background:#0a0a0a;border-bottom:1px solid #1a1a1a}
.time-box{width:58px;text-align:center}
.time-green{color:#00ff66;font-weight:900;font-size:12px}
.time-live{color:#ff3b30;font-weight:900;font-size:12px;animation:blink 1s infinite}
.time-ft{color:#888;font-weight:900;font-size:12px}
@keyframes blink{0%{opacity:1}50%{opacity:0.4}100%{opacity:1}}
.team{font-size:13px;line-height:16px}
.score{color:#fff;font-weight:900;font-size:13px;text-align:center;width:30px}
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

<div class="tabs" id="tabs">
  <div class="tab tab-inactive" onclick="setTab('yesterday')" id="tab-yesterday">YESTERDAY</div>
  <div class="tab tab-active" onclick="setTab('today')" id="tab-today">TODAY</div>
  <div class="tab tab-inactive" onclick="setTab('live')" id="tab-live">LIVE</div>
  <div class="tab tab-inactive" onclick="setTab('finished')" id="tab-finished">FINISHED</div>
  <div class="tab tab-refresh" onclick="refreshCurrent()">↻ REFRESH</div>
</div>

<div id="main"><div id="content"><div class="loading">Loading...</div></div></div>

<div id="modal"><div id="modalTop"><span style="color:#00ff66;font-weight:900">MATCH</span><button class="closeBtn" onclick="closeModal()">X CLOSE</button></div><div id="modalContent"></div></div>
<div class="spacer"></div>
<div class="bottom"><a href="${MY_1XBET}" target="_blank">1XBET - BET NOW</a></div>

<script>
let CURRENT_TAB = 'today';
let ALL_MATCHES = [];

function getDateStr(offset){
  const now = new Date();
  now.setDate(now.getDate() + offset);
  const lagos = new Date(now.toLocaleString('en-US',{timeZone:'Africa/Lagos'}));
  const y = lagos.getFullYear();
  const m = String(lagos.getMonth()+1).padStart(2,'0');
  const d = String(lagos.getDate()).padStart(2,'0');
  return \`\${y}-\${m}-\${d}\`;
}

function getMatchTime(m){
  let dateStr = m.date || m.startTime || m.kickoff || "";
  if(!dateStr) return { main:"NS", sub:"", isLive:false, isFinished:false, ts:0 };
  try{
    let d = new Date(dateStr);
    const ts = d.getTime();
    if(isNaN(ts)) return { main: dateStr.slice(0,5), sub:"", isLive:false, isFinished:false, ts:0 };
    const time = d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'});
    const status = (m.status || m.matchStatus || "").toUpperCase();
    const isLive = status.includes("LIVE") || status.includes("1H") || status.includes("2H") || status.includes("HT") || status === "LIVE";
    const isFinished = status.includes("FT") || status.includes("FINISHED") || status.includes("ENDED") || status === "FT";
    if(isLive) return { main:"LIVE", sub:time, isLive:true, isFinished:false, ts:ts };
    if(isFinished) return { main:"FT", sub:time, isLive:false, isFinished:true, ts:ts };
    return { main:time, sub:status||"NS", isLive:false, isFinished:false, ts:ts };
  }catch(e){
    return { main:"NS", sub:"", isLive:false, isFinished:false, ts:0 };
  }
}

function setTab(tab){
  CURRENT_TAB = tab;
  document.querySelectorAll('.tab').forEach(t=>{ if(t.id.startsWith('tab-')){ t.className='tab tab-inactive'; } });
  document.getElementById('tab-'+tab).className='tab tab-active';
  if(tab==='yesterday') loadDate(getDateStr(-1));
  else if(tab==='today') loadDate(getDateStr(0));
  else if(tab==='live' || tab==='finished') renderFiltered();
  // keep refresh button style
}

function refreshCurrent(){
  const btn = document.querySelector('.tab-refresh');
  btn.textContent = '↻ LOADING...';
  if(CURRENT_TAB==='yesterday') loadDate(getDateStr(-1), true);
  else if(CURRENT_TAB==='today') loadDate(getDateStr(0), true);
  else { renderFiltered(); btn.textContent='↻ REFRESH'; }
}

async function loadDate(dateStr, isRefresh=false){
  document.getElementById('content').innerHTML='<div class="loading">Loading '+dateStr+'...</div>';
  try{
    const res = await fetch('/api/highlightly?date='+dateStr);
    const data = await res.json();
    ALL_MATCHES = data.data||data.matches||data.response||[];
    if(!Array.isArray(ALL_MATCHES)) ALL_MATCHES = [];
    renderFiltered();
  }catch(e){
    document.getElementById('content').innerHTML='<div class="loading">Error: '+e.message+'</div>';
  }
  document.querySelector('.tab-refresh').textContent='↻ REFRESH';
}

function renderFiltered(){
  let filtered = ALL_MATCHES;
  if(CURRENT_TAB==='live') filtered = ALL_MATCHES.filter(m=> getMatchTime(m).isLive);
  else if(CURRENT_TAB==='finished') filtered = ALL_MATCHES.filter(m=> getMatchTime(m).isFinished);

  if(filtered.length===0){
    let msg = '';
    if(CURRENT_TAB==='live') msg = 'No LIVE matches now. Try TODAY.';
    else if(CURRENT_TAB==='finished') msg = 'No FINISHED matches yet. Try TODAY or YESTERDAY.';
    else if(CURRENT_TAB==='yesterday') msg = 'No matches yesterday.';
    else msg = 'No matches today - Serie A Frosinone vs Lecce 18:30 will appear here.';
    document.getElementById('content').innerHTML='<div class="loading">'+msg+'</div>';
    return;
  }

  // GROUP BY COUNTRY | LEAGUE - NO MIX
  const groups={};
  filtered.forEach(m=>{
    const leagueName = (m.league?.name || m.competition?.name || "Unknown").trim();
    const countryName = (m.league?.country || m.country?.name || m.country || "World").trim();
    const key = (countryName + "|" + leagueName).toUpperCase();
    if(!groups[key]) groups[key]={country:countryName, league:leagueName, games:[]};
    groups[key].games.push(m);
  });

  let html='';
  Object.values(groups).forEach(g=>{
    // Sort games by time
    g.games.sort((a,b)=> getMatchTime(a).ts - getMatchTime(b).ts);
    html+=\`<div class="league-header">
      <div style="display:flex;align-items:center">
        <span class="country-badge">\${g.country.toUpperCase()}</span>
        <span class="league-name">\${g.league.toUpperCase()}</span>
      </div>
      <span class="league-count">\${g.games.length}</span>
    </div>\`;
    g.games.forEach(match=>{
      const home = match.homeTeam?.name || match.home?.name || "Home";
      const away = match.awayTeam?.name || match.away?.name || "Away";
      const t = getMatchTime(match);
      const hs = match.homeScore ?? match.score?.home ?? "-";
      const as = match.awayScore ?? match.score?.away ?? "-";
      let timeClass = 'time-green';
      if(t.isLive) timeClass='time-live';
      if(t.isFinished) timeClass='time-ft';
      html+=\`<div class="match" onclick="openMatch('\${match.id}')">
        <div class="time-box"><div class="\${timeClass}">\${t.main}</div><div style="color:#888;font-size:10px">\${t.sub}</div></div>
        <div style="flex:1;margin-left:8px">
          <div class="team">\${home}</div>
          <div class="team" style="margin-top:3px;color:#aaa">\${away}</div>
        </div>
        <div class="score">\${hs}<br>\${as}</div>
      </div>\`;
    });
  });

  document.getElementById('content').innerHTML = html;
}

async function openMatch(id){
  document.getElementById('modal').style.display='block';
  document.getElementById('modalContent').innerHTML='<div class="box"><a href="${MY_1XBET}" target="_blank" style="background:#00ff66;color:#000;padding:12px;border-radius:8px;font-weight:900;display:block;text-align:center;text-decoration:none">BET NOW - 1XBET BONUS 300%</a></div><div class="loading">Loading highlights...</div>';
}
function closeModal(){document.getElementById('modal').style.display='none';}

// Initial load TODAY
loadDate(getDateStr(0));
</script>
</body></html>`;
    return new Response(html, { headers: {"Content-Type":"text/html","Cache-Control":"no-cache"} });
  }
}
