const API_KEY = "98a19520b228fd8dcff8459b07f0d569";
const TOP_IDS = {2:1,3:2,848:3,39:4,140:5,61:6,78:7,135:8,88:9};

export default {
  async fetch(request){
    const url = new URL(request.url);
    const path = url.pathname;

    if(path === "/api/fixtures"){
      const date = url.searchParams.get("date") || new Date().toISOString().split('T')[0];
      const r = await fetch(`https://v3.football.api-sports.io/fixtures?date=${date}`, { headers: { "x-apisports-key": API_KEY }});
      return new Response(JSON.stringify(await r.json()), { headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    if(path === "/api/detail"){
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
<style>
html,body{margin:0;background:#000;color:#fff;font-family:Arial}
.top{background:#000;display:flex;justify-content:center;padding:12px;border-bottom:2px solid #00ff66;position:sticky;top:0;z-index:100}
.logo{background:#00ff66;color:#000;padding:6px 22px;border-radius:6px;font-weight:900;font-style:italic}
.bet{padding:10px;background:#000;position:sticky;top:53px;z-index:99}
.bet a{background:#00ff66;color:#000;padding:12px;border-radius:10px;font-weight:900;text-decoration:none;text-align:center;display:block}
.tabs{display:flex;background:#000;border-bottom:2px solid #00ff66;position:sticky;top:103px;z-index:98}
.tab{flex:1;padding:12px;text-align:center;font-weight:900;cursor:pointer;border:none;background:#000;color:#00ff66;font-size:13px}
.tab.active{background:#00ff66;color:#000}
.datebar{display:flex;justify-content:space-between;align-items:center;padding:10px;background:#000;color:#00ff66;border-bottom:1px solid #111;position:sticky;top:145px;z-index:97}
.datebar button{background:#000;color:#00ff66;border:1px solid #00ff66;border-radius:6px;padding:4px 10px;font-weight:900}
.league{background:#000;color:#fff;padding:10px 8px;font-weight:900;font-size:13px;border-top:2px solid #00ff66;display:flex;justify-content:space-between}
.league.top-priority{color:#00ff66;background:#0a0a0a}
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
.teamBig{display:flex;justify-content:space-between;align-items:center}
.teamBig img{width:48px}
.eventRow{display:flex;gap:8px;padding:6px 0;border-bottom:1px solid #111;font-size:13px;align-items:center}
.statRow{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #111;font-size:13px}
</style>
</head><body>

<div class="top"><span class="logo">DIAMOND LIVESCORE</span></div>
<div class="bet"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>

<div class="tabs">
<button class="tab active" data-tab="all">ALL</button>
<button class="tab" data-tab="live">LIVE</button>
<button class="tab" data-tab="finished">FINISHED</button>
<button class="tab" data-tab="scheduled">SCHEDULED</button>
</div>

<div class="datebar"><button onclick="changeDate(-1)"><</button><span id="dateLabel">TODAY</span><button onclick="changeDate(1)">></button></div>

<div id="main"><div class="loading">Loading...</div></div>

<div id="modal">
  <div id="modalTop"><span style="color:#00ff66;font-weight:900">MATCH DETAILS</span><button class="closeBtn" onclick="closeModal()">X CLOSE</button></div>
  <div id="modalContent"></div>
</div>

<div class="spacer"></div>
<div class="bottom"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>

<script>
let currentDate=new Date(); let allFixtures=[]; let currentTab='all';
const TOP_IDS={2:1,3:2,848:3,39:4,140:5,61:6,78:7,135:8,88:9};
function formatDate(d){return d.toISOString().split('T')[0];}
function labelDate(d){
  const t=new Date(); t.setHours(0,0,0,0); const dd=new Date(d); dd.setHours(0,0,0,0);
  const diff=Math.round((dd-t)/86400000);
  if(diff===0) return 'TODAY - '+formatDate(d).slice(5);
  if(diff===1) return 'TOMORROW'; if(diff===-1) return 'YESTERDAY'; return formatDate(d);
}
async function load(){
  document.getElementById('main').innerHTML='<div class="loading">Loading...</div>';
  document.getElementById('dateLabel').innerText=labelDate(currentDate);
  const res=await fetch('/api/fixtures?date='+formatDate(currentDate));
  const json=await res.json(); allFixtures=json.response||[]; render();
}
function render(){
  let f=allFixtures;
  if(currentTab==='live') f=allFixtures.filter(x=> ['1H','2H','HT','ET','P','LIVE','BT'].includes(x.fixture.status.short));
  if(currentTab==='finished') f=allFixtures.filter(x=> ['FT','AET','PEN'].includes(x.fixture.status.short));
  if(currentTab==='scheduled') f=allFixtures.filter(x=> ['NS','TBD'].includes(x.fixture.status.short));
  const groups={}; f.forEach(x=>{ if(!groups[x.league.id]) groups[x.league.id]={league:x.league,games:[]}; groups[x.league.id].games.push(x); });
  const sorted=Object.values(groups).sort((a,b)=> (TOP_IDS[a.league.id]||999)-(TOP_IDS[b.league.id]||999));
  if(sorted.length===0){ document.getElementById('main').innerHTML='<div class="loading">No matches</div>'; return; }
  let html=''; sorted.forEach(g=>{
    const isTop=TOP_IDS[g.league.id]?true:false;
    html+=\`<div class="league \${isTop?'top-priority':''}"><span>\${g.league.country.toUpperCase()} : \${g.league.name}</span><span>\${g.games.length}</span></div>\`;
    g.games.forEach(m=>{
      const st=m.fixture.status.short; const time=st==='FT'?'FT':st==='NS'?new Date(m.fixture.date).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}):st;
      html+=\`<div class="match" onclick="openMatch(\${m.fixture.id})"><div style="flex:1"><div class="team"><span class="status">\${time}</span><img src="\${m.teams.home.logo}"><span>\${m.teams.home.name}</span></div><div class="team"><span class="status"></span><img src="\${m.teams.away.logo}"><span>\${m.teams.away.name}</span></div></div><div class="score">\${m.goals.home??'-'}<br>\${m.goals.away??'-'}</div></div>\`;
    });
  }); document.getElementById('main').innerHTML=html;
}
async function openMatch(id){
  document.getElementById('modal').style.display='block';
  document.getElementById('modalContent').innerHTML='<div class="loading">Loading match details...</div>';
  const res=await fetch('/api/detail?id='+id);
  const d=await res.json();
  const f=d.fixture;
  if(!f){ document.getElementById('modalContent').innerHTML='<div class="loading">No data</div>'; return; }
  
  let eventsHtml='';
  (d.events||[]).forEach(ev=>{
    const icon = ev.type==='Goal'?'⚽': ev.type==='Card'?(ev.detail.includes('Yellow')?'🟨':'🟥'): '🔄';
    eventsHtml+=\`<div class="eventRow"><span style="width:30px">\${ev.time.elapsed}'</span><span>\${icon}</span><img src="\${ev.team.logo}" style="width:16px"><span>\${ev.player.name} - \${ev.detail}</span></div>\`;
  });
  if(!eventsHtml) eventsHtml='<div style="padding:10px;color:#888">No events yet</div>';

  let statsHtml='';
  if(d.stats && d.stats.length>=2){
    const h=d.stats[0].statistics||[]; const a=d.stats[1].statistics||[];
    h.forEach((item,i)=>{
      statsHtml+=\`<div class="statRow"><span>\${item.value??0}</span><span style="color:#00ff66">\${item.type}</span><span>\${a[i]?a[i].value:0}</span></div>\`;
    });
  }
  if(!statsHtml) statsHtml='<div style="padding:10px;color:#888">Stats will appear when match starts</div>';

  let lineupHtml='';
  (d.lineups||[]).forEach(l=>{
    lineupHtml+=\`<div style="color:#00ff66;font-weight:900;margin:6px 0">\${l.team.name} - \${l.formation||''}</div>\`;
    (l.startXI||[]).forEach(p=>{
      lineupHtml+=\`<div class="eventRow"><span>\${p.player.number}</span><span>\${p.player.name} (\${p.player.pos})</span></div>\`;
    });
  });
  if(!lineupHtml) lineupHtml='<div style="padding:10px;color:#888">Lineups not available yet</div>';

  document.getElementById('modalContent').innerHTML=\`
    <div class="box" style="text-align:center;color:#00ff66;font-weight:900">\${f.league.country.toUpperCase()} : \${f.league.name}</div>
    <div class="box">
      <div class="teamBig">
        <div style="text-align:center"><img src="\${f.teams.home.logo}"><br><b>\${f.teams.home.name}</b></div>
        <div style="text-align:center;font-size:28px;color:#00ff66;font-weight:900">\${f.goals.home??0} - \${f.goals.away??0}<br><span style="font-size:11px;color:#fff">\${f.fixture.status.long} \${f.fixture.status.elapsed?f.fixture.status.elapsed+"'":''}</span></div>
        <div style="text-align:center"><img src="\${f.teams.away.logo}"><br><b>\${f.teams.away.name}</b></div>
      </div>
      <div style="margin-top:10px;font-size:12px;color:#aaa">Venue: \${f.fixture.venue?.name||'-'} | \${new Date(f.fixture.date).toLocaleString()}</div>
    </div>
    <div class="box"><div style="color:#00ff66;font-weight:900;margin-bottom:8px">EVENTS</div>\${eventsHtml}</div>
    <div class="box"><div style="color:#00ff66;font-weight:900;margin-bottom:8px">STATISTICS</div>\${statsHtml}</div>
    <div class="box"><div style="color:#00ff66;font-weight:900;margin-bottom:8px">LINEUPS</div>\${lineupHtml}</div>
    <a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank" style="display:block;background:#00ff66;color:#000;padding:14px;border-radius:10px;text-align:center;font-weight:900;text-decoration:none;margin:10px">1XBET - BET NOW - BONUS 300%</a>
  \`;
}
function closeModal(){ document.getElementById('modal').style.display='none'; }
function changeDate(dir){ currentDate.setDate(currentDate.getDate()+dir); load(); }
document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{ document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); currentTab=btn.dataset.tab; render(); });
});
load();
</script>
</body></html>`;
    return new Response(html, { headers: { "Content-Type":"text/html", "Cache-Control":"no-cache" }});
  }
}
