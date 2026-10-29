const API_KEY = "98a19520b228fd8dcff8459b07f0d569";
const TOP_IDS = {2:1,3:2,848:3,39:4,140:5,61:6,78:7,135:8,88:9};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if(path === "/api/fixtures"){
      const date = url.searchParams.get("date") || new Date().toISOString().split('T')[0];
      const r = await fetch(`https://v3.football.api-sports.io/fixtures?date=${date}`, { headers: { "x-apisports-key": API_KEY }});
      return new Response(JSON.stringify(await r.json()), { headers: { "Content-Type":"application/json", "Access-Control-Allow-Origin":"*" }});
    }
    if(path === "/api/fixture"){
      const id = url.searchParams.get("id");
      const r = await fetch(`https://v3.football.api-sports.io/fixtures?id=${id}`, { headers: { "x-apisports-key": API_KEY }});
      return new Response(JSON.stringify(await r.json()), { headers: { "Content-Type":"application/json", "Access-Control-Allow-Origin":"*" }});
    }
    if(path === "/api/stats"){
      const id = url.searchParams.get("id");
      const r = await fetch(`https://v3.football.api-sports.io/fixtures/statistics?fixture=${id}`, { headers: { "x-apisports-key": API_KEY }});
      return new Response(JSON.stringify(await r.json()), { headers: { "Content-Type":"application/json", "Access-Control-Allow-Origin":"*" }});
    }

    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE</title>
<style>
html,body{margin:0;background:#000;color:#fff;font-family:Arial}
.top{background:#000;display:flex;justify-content:center;padding:12px;border-bottom:2px solid #00ff66;position:sticky;top:0;z-index:100}
.logo{background:#00ff66;color:#000;padding:6px 22px;border-radius:6px;font-weight:900;font-style:italic;font-size:18px}
.bet{padding:10px;background:#000;position:sticky;top:53px;z-index:99}
.bet a{background:#00ff66;color:#000;padding:12px;border-radius:10px;font-weight:900;text-decoration:none;text-align:center;display:block}
.tabs{display:flex;background:#000;border-bottom:2px solid #00ff66;position:sticky;top:103px;z-index:98}
.tab{flex:1;padding:12px;text-align:center;font-weight:900;cursor:pointer;border:none;background:#000;color:#00ff66;font-size:13px}
.tab.active{background:#00ff66;color:#000}
.datebar{display:flex;justify-content:space-between;align-items:center;padding:10px;background:#000;color:#00ff66;border-bottom:1px solid #111;position:sticky;top:145px;z-index:97}
.datebar button{background:#000;color:#00ff66;border:1px solid #00ff66;border-radius:6px;padding:4px 10px;font-weight:900}
.league{background:#000;color:#fff;padding:10px 8px;font-weight:900;font-size:13px;border-top:2px solid #00ff66;display:flex;justify-content:space-between;cursor:pointer}
.league.top-priority{color:#00ff66 !important;background:#0a0a0a}
.match{display:flex;justify-content:space-between;align-items:center;padding:10px 8px;background:#0a0a0a;border-bottom:1px solid #151515;cursor:pointer}
.match:hover{background:#111}
.team{display:flex;align-items:center;gap:6px;font-size:13px}
.team img{width:18px;height:18px}
.score{color:#00ff66;font-weight:900;font-size:13px;text-align:right}
.status{color:#00ff66;font-size:11px;font-weight:900;width:42px}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2px solid #00ff66;z-index:9999}
.bottom a{background:#00ff66;color:#000;padding:12px;border-radius:10px;font-weight:900;text-decoration:none;text-align:center;display:block}
.spacer{height:90px}
.loading{padding:20px;text-align:center;color:#00ff66}
#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.95);z-index:99999;display:none;overflow-y:auto;padding:10px}
#modalContent{background:#0a0a0a;border:2px solid #00ff66;border-radius:12px;padding:12px;max-width:600px;margin:20px auto}
.closeBtn{background:#00ff66;color:#000;border:none;padding:10px;border-radius:8px;font-weight:900;width:100%;margin-bottom:10px}
.teamBig{display:flex;justify-content:space-between;align-items:center;padding:12px;background:#000;border-radius:8px;margin-bottom:8px}
.teamBig img{width:40px}
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

<div class="datebar">
<button onclick="changeDate(-1)"><</button>
<span id="dateLabel">TODAY</span>
<button onclick="changeDate(1)">></button>
</div>

<div id="main"><div class="loading">Loading matches...</div></div>

<div id="modal" onclick="if(event.target.id==='modal') closeModal()"><div id="modalContent"></div></div>

<div class="spacer"></div>
<div class="bottom"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>

<script>
let currentDate = new Date();
let allFixtures = [];
let currentTab = 'all';
const TOP_IDS = {2:1,3:2,848:3,39:4,140:5,61:6,78:7,135:8,88:9};
function formatDate(d){ return d.toISOString().split('T')[0]; }
function labelDate(d){
  const today=new Date(); today.setHours(0,0,0,0);
  const dd=new Date(d); dd.setHours(0,0,0,0);
  const diff=Math.round((dd-today)/86400000);
  if(diff===0) return 'TODAY - ' + formatDate(d).slice(5);
  if(diff===1) return 'TOMORROW';
  if(diff===-1) return 'YESTERDAY';
  return formatDate(d);
}
async function load(){
  document.getElementById('main').innerHTML='<div class="loading">Loading...</div>';
  document.getElementById('dateLabel').innerText=labelDate(currentDate);
  const res=await fetch('/api/fixtures?date='+formatDate(currentDate));
  const json=await res.json();
  allFixtures=json.response||[];
  render();
}
function render(){
  let filtered=allFixtures;
  if(currentTab==='live') filtered=allFixtures.filter(f=> ['1H','2H','HT','ET','P','LIVE','BT'].includes(f.fixture.status.short));
  if(currentTab==='finished') filtered=allFixtures.filter(f=> ['FT','AET','PEN'].includes(f.fixture.status.short));
  if(currentTab==='scheduled') filtered=allFixtures.filter(f=> ['NS','TBD'].includes(f.fixture.status.short));
  const groups={};
  filtered.forEach(f=>{
    const key=f.league.id;
    if(!groups[key]) groups[key]={league:f.league,games:[]};
    groups[key].games.push(f);
  });
  const sorted=Object.values(groups).sort((a,b)=>{
    const pa=TOP_IDS[a.league.id]||999; const pb=TOP_IDS[b.league.id]||999;
    return pa-pb;
  });
  if(sorted.length===0){ document.getElementById('main').innerHTML='<div class="loading">No matches</div>'; return; }
  let html='';
  sorted.forEach(g=>{
    const isTop=TOP_IDS[g.league.id]?true:false;
    html+=\`<div class="league \${isTop?'top-priority':''}" onclick="filterLeague(\${g.league.id})"><span>\${g.league.country.toUpperCase()} : \${g.league.name}</span><span>\${g.games.length} ></span></div>\`;
    g.games.forEach(f=>{
      const status=f.fixture.status.short;
      const time=status==='FT'?'FT':status==='NS'?new Date(f.fixture.date).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}):status;
      const sh=f.goals.home??'-'; const sa=f.goals.away??'-';
      html+=\`<div class="match" onclick="openMatch(\${f.fixture.id})">
        <div style="flex:1">
          <div class="team"><span class="status">\${time}</span><img src="\${f.teams.home.logo}"><span>\${f.teams.home.name}</span></div>
          <div class="team"><span class="status"></span><img src="\${f.teams.away.logo}"><span>\${f.teams.away.name}</span></div>
        </div>
        <div class="score">\${sh}<br>\${sa}</div>
      </div>\`;
    });
  });
  document.getElementById('main').innerHTML=html;
}
function filterLeague(id){
  const g=allFixtures.filter(f=> f.league.id===id);
  if(g.length>0){ allFixtures=g; render(); window.scrollTo(0,0); }
}
async function openMatch(id){
  document.getElementById('modal').style.display='block';
  document.getElementById('modalContent').innerHTML='<div class="loading">Loading details...</div>';
  const res=await fetch('/api/fixture?id='+id);
  const json=await res.json();
  const f=json.response[0];
  if(!f){ document.getElementById('modalContent').innerHTML='No data'; return; }
  const sRes=await fetch('/api/stats?id='+id);
  const sJson=await sRes.json();
  const stats=sJson.response||[];
  let statsHtml='';
  if(stats.length>=2){
    const homeStats=stats[0].statistics||[];
    const awayStats=stats[1].statistics||[];
    homeStats.forEach((h,i)=>{
      const a=awayStats[i];
      statsHtml+=\`<div class="statRow"><span>\${h.value??0}</span><span style="color:#00ff66">\${h.type}</span><span>\${a?a.value:0}</span></div>\`;
    });
  }
  document.getElementById('modalContent').innerHTML=\`
    <button class="closeBtn" onclick="closeModal()">X CLOSE</button>
    <div style="text-align:center;color:#00ff66;font-weight:900;margin-bottom:10px">\${f.league.country} : \${f.league.name}</div>
    <div class="teamBig">
      <div style="text-align:center"><img src="\${f.teams.home.logo}"><br>\${f.teams.home.name}</div>
      <div style="font-size:28px;color:#00ff66;font-weight:900">\${f.goals.home??0} - \${f.goals.away??0}<br><span style="font-size:12px">\${f.fixture.status.long}</span></div>
      <div style="text-align:center"><img src="\${f.teams.away.logo}"><br>\${f.teams.away.name}</div>
    </div>
    <div style="background:#000;padding:8px;border-radius:8px;margin-bottom:8px">
      <div>Venue: \${f.fixture.venue?.name||'-'}</div>
      <div>Date: \${new Date(f.fixture.date).toLocaleString()}</div>
      <div>Status: \${f.fixture.status.long}</div>
    </div>
    <div style="color:#00ff66;font-weight:900;margin:10px 0">STATISTICS</div>
    \${statsHtml||'<div style="padding:10px">No stats yet</div>'}
    <a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank" style="display:block;background:#00ff66;color:#000;padding:12px;border-radius:10px;text-align:center;font-weight:900;text-decoration:none;margin-top:12px">1XBET - BET NOW</a>
  \`;
}
function closeModal(){ document.getElementById('modal').style.display='none'; }
function changeDate(dir){ currentDate.setDate(currentDate.getDate()+dir); load(); }
document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); currentTab=btn.dataset.tab; render();
  });
});
load();
</script>
</body></html>`;
    return new Response(html, { headers: { "Content-Type":"text/html", "Cache-Control":"no-cache" }});
  }
}
