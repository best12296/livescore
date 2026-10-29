const API_KEY = "98a19520b228fd8dcff8459b07f0d569";
const TOP_IDS = {2:1,3:2,848:3,39:4,140:5,61:6,78:7,135:8,88:9};

export default {
  async fetch(request){
    const url = new URL(request.url);
    if(url.pathname === "/api/top"){
      const date = url.searchParams.get("date") || new Date().toISOString().split('T')[0];
      // Use Lagos timezone so 18:30 matches no go disappear
      const [today, tomorrow] = await Promise.all([
        fetch(`https://v3.football.api-sports.io/fixtures?date=${date}&timezone=Africa/Lagos`, { headers: { "x-apisports-key": API_KEY }}).then(r=>r.json()),
        fetch(`https://v3.football.api-sports.io/fixtures?date=${date}&timezone=Africa/Lagos`, { headers: { "x-apisports-key": API_KEY }}).then(r=>r.json())
      ]);
      // Merge and filter only Top 9
      const all = [...(today.response||[]), ...(tomorrow.response||[])];
      // Remove duplicate fixture ids
      const seen = new Set(); const uniq=[];
      for(const f of all){ if(!seen.has(f.fixture.id)){ seen.add(f.fixture.id); uniq.push(f);} }
      const filtered = uniq.filter(f=> TOP_IDS[f.league.id]);
      // Sort by league order
      filtered.sort((a,b)=> TOP_IDS[a.league.id] - TOP_IDS[b.league.id]);
      return new Response(JSON.stringify({response:filtered, debugDate:date}), { headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/detail"){
      const id = url.searchParams.get("id");
      const [f, stats, events, lineups] = await Promise.all([
        fetch(`https://v3.football.api-sports.io/fixtures?id=${id}`, { headers: { "x-apisports-key": API_KEY }}).then(r=>r.json()),
        fetch(`https://v3.football.api-sports.io/fixtures/statistics?fixture=${id}`, { headers: { "x-apisports-key": API_KEY }}).then(r=>r.json()),
        fetch(`https://v3.football.api-sports.io/fixtures/events?fixture=${id}`, { headers: { "x-apisports-key": API_KEY }}).then(r=>r.json()),
        fetch(`https://v3.football.api-sports.io/fixtures/lineups?fixture=${id}`, { headers: { "x-apisports-key": API_KEY }}).then(r=>r.json()),
      ]);
      return new Response(JSON.stringify({fixture:f.response[0], stats:stats.response, events:events.response, lineups:lineups.response}), { headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }

    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE</title>
<script type="module" src="https://widgets.api-sports.io/3.1.0/widgets.js"></script>
<style>
html,body{margin:0;background:#000;color:#fff;font-family:Arial}
.top{background:#000;display:flex;justify-content:center;padding:12px;border-bottom:2px solid #00ff66;position:sticky;top:0;z-index:100}
.logo{background:#00ff66;color:#000;padding:6px 22px;border-radius:6px;font-weight:900;font-style:italic}
.bet{padding:10px;background:#000}
.bet a{background:#00ff66;color:#000;padding:12px;border-radius:10px;font-weight:900;text-decoration:none;text-align:center;display:block}
.sectionTitle{background:#00ff66;color:#000;padding:8px;font-weight:900;font-size:13px}
.league{background:#111;color:#00ff66;padding:10px 8px;font-weight:900;font-size:13px;border-top:2px solid #00ff66;display:flex;justify-content:space-between}
.match{display:flex;justify-content:space-between;align-items:center;padding:10px 8px;background:#0a0a0a;border-bottom:1px solid #151515;cursor:pointer}
.team{display:flex;align-items:center;gap:6px;font-size:13px}
.team img{width:18px}
.score{color:#00ff66;font-weight:900;text-align:right}
.status{color:#00ff66;font-size:11px;font-weight:900;width:42px}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2px solid #00ff66;z-index:9999}
.bottom a{background:#00ff66;color:#000;padding:12px;border-radius:10px;font-weight:900;text-align:center;display:block;text-decoration:none}
.spacer{height:90px}
.loading{padding:20px;text-align:center;color:#00ff66}
#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:none;overflow-y:auto}
#modalTop{background:#000;border-bottom:2px solid #00ff66;padding:10px;position:sticky;top:0;display:flex;justify-content:space-between;align-items:center}
.closeBtn{background:#00ff66;color:#000;border:none;padding:10px 18px;border-radius:8px;font-weight:900}
.box{background:#0a0a0a;border:1px solid #151515;border-radius:10px;padding:10px;margin:8px}
</style>
</head><body>

<div class="top"><span class="logo">DIAMOND LIVESCORE</span></div>
<div class="bet"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>

<api-sports-widget data-type="config" data-key="98a19520b228fd8dcff8459b07f0d569" data-sport="football" data-theme="grey" data-show-logos="true" data-target-game="modal" data-target-team="modal" data-target-player="modal" data-timezone="Africa/Lagos" data-refresh="30"></api-sports-widget>

<div id="main">
<div class="sectionTitle">⭐ TOP 9 LEAGUES - ALWAYS ON TOP (Today - Serie A go show here)</div>
<div id="topLeagues"><div class="loading">Loading Top 9 - checking Serie A Frosinone vs Lecce...</div></div>

<div class="sectionTitle">OTHER LEAGUES - Official Widget</div>
<api-sports-widget id="otherWidget" data-type="games" data-show-toolbar="true" data-tab="all"></api-sports-widget>
</div>

<div id="modal"><div id="modalTop"><span style="color:#00ff66;font-weight:900">MATCH DETAILS</span><button class="closeBtn" onclick="closeModal()">X CLOSE</button></div><div id="modalContent"></div></div>

<div class="spacer"></div>
<div class="bottom"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>

<script>
const TOP = {2:1,3:2,848:3,39:4,140:5,61:6,78:7,135:8,88:9};
function formatDate(d){ const tz=new Date().toLocaleString('en-GB',{timeZone:'Africa/Lagos'}); const parts=tz.split(',')[0].split('/'); return \`\${parts[2]}-\${parts[1].padStart(2,'0')}-\${parts[0].padStart(2,'0')}\`; }

async function loadTop(){
  const date = formatDate(new Date());
  const res = await fetch('/api/top?date='+date);
  const json = await res.json();
  const fixtures = json.response||[];
  
  if(fixtures.length===0){
    document.getElementById('topLeagues').innerHTML='<div class="loading">No Top 9 yet for '+date+'. But Flashscore show Serie A today, make we check API... If API no get Serie A, na API coverage issue, but code don ready.</div>';
    return;
  }
  
  const groups={};
  fixtures.forEach(f=>{
    if(!groups[f.league.id]) groups[f.league.id]={league:f.league,games:[], order:TOP[f.league.id]};
    groups[f.league.id].games.push(f);
  });
  const sorted = Object.values(groups).sort((a,b)=>a.order-b.order);
  
  let html='';
  sorted.forEach(g=>{
    html+=\`<div class="league"><span>\${g.league.country.toUpperCase()} : \${g.league.name}</span><span>\${g.games.length}</span></div>\`;
    g.games.forEach(m=>{
      const st=m.fixture.status.short; 
      const time = new Date(m.fixture.date).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit', timeZone:'Africa/Lagos'});
      const status = st==='FT'?'FT':st==='NS'?time:st;
      html+=\`<div class="match" onclick="openMatch(\${m.fixture.id})"><div style="flex:1"><div class="team"><span class="status">\${status}</span><img src="\${m.teams.home.logo}"><span>\${m.teams.home.name}</span></div><div class="team"><span class="status"></span><img src="\${m.teams.away.logo}"><span>\${m.teams.away.name}</span></div></div><div class="score">\${m.goals.home??'-'}<br>\${m.goals.away??'-'}</div></div>\`;
    });
  });
  document.getElementById('topLeagues').innerHTML=html;
}

async function openMatch(id){
  document.getElementById('modal').style.display='block';
  document.getElementById('modalContent').innerHTML='<div class="loading">Loading...</div>';
  const res=await fetch('/api/detail?id='+id); const d=await res.json(); const f=d.fixture;
  if(!f){ document.getElementById('modalContent').innerHTML='No data'; return; }
  let eventsHtml=''; (d.events||[]).forEach(ev=>{
    const icon=ev.type==='Goal'?'⚽':ev.type==='Card'?(ev.detail.includes('Yellow')?'🟨':'🟥'):'🔄';
    eventsHtml+=\`<div style="display:flex;gap:8px;padding:6px 0;border-bottom:1px solid #111;font-size:13px"><span>\${ev.time.elapsed}'</span><span>\${icon}</span><span>\${ev.player.name} - \${ev.detail}</span></div>\`;
  });
  if(!eventsHtml) eventsHtml='<div style="padding:10px;color:#888">No events yet - match never start. Kickoff: Frosinone vs Lecce 18:30</div>';
  document.getElementById('modalContent').innerHTML=\`
    <div class="box" style="text-align:center;color:#00ff66;font-weight:900">\${f.league.country} : \${f.league.name}</div>
    <div class="box"><div style="display:flex;justify-content:space-between;align-items:center"><div style="text-align:center"><img src="\${f.teams.home.logo}" style="width:48px"><br><b>\${f.teams.home.name}</b></div><div style="text-align:center;font-size:28px;color:#00ff66;font-weight:900">\${f.goals.home??0} - \${f.goals.away??0}</div><div style="text-align:center"><img src="\${f.teams.away.logo}" style="width:48px"><br><b>\${f.teams.away.name}</b></div></div></div>
    <div class="box"><div style="color:#00ff66;font-weight:900;margin-bottom:8px">EVENTS</div>\${eventsHtml}</div>
  \`;
}
function closeModal(){ document.getElementById('modal').style.display='none'; }

function paint(){
  document.querySelectorAll('api-sports-widget').forEach(el=>{
    if(el.shadowRoot && !el.shadowRoot.querySelector('#fix')){
      const s=document.createElement('style');
      s.id='fix';
      s.textContent='[class*="toolbar"]{background:#000 !important;border-bottom:2px solid #00ff66 !important} [class*="tab"]{background:#000 !important;color:#00ff66 !important;border:1px solid #00ff66 !important} [class*="active"]{background:#00ff66 !important;color:#000 !important} [class*="game"]{background:#0a0a0a !important} [class*="score"]{color:#00ff66 !important}';
      el.shadowRoot.appendChild(s);
    }
  });
}
setInterval(paint,800);
loadTop();
</script>
</body></html>`;
    return new Response(html, { headers: {"Content-Type":"text/html","Cache-Control":"no-cache"} });
  }
}
