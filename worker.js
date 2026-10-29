const API_KEY = "98a19520b228fd8dcff8459b07f0d569";
const TOP_IDS = {2:1,3:2,848:3,39:4,140:5,61:6,78:7,135:8,88:9};

export default {
  async fetch(request){
    const url = new URL(request.url);
    if(url.pathname === "/api/fixtures"){
      const date = url.searchParams.get("date") || new Date().toISOString().split('T')[0];
      const r = await fetch(`https://v3.football.api-sports.io/fixtures?date=${date}`, { headers: { "x-apisports-key": API_KEY }});
      return new Response(JSON.stringify(await r.json()), { headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE</title>
<script type="module" src="https://widgets.api-sports.io/3.1.0/widgets.js"></script>
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
.league{background:#000;color:#fff;padding:10px 8px;font-weight:900;font-size:13px;border-top:2px solid #00ff66;cursor:pointer;display:flex;justify-content:space-between}
.league.top-priority{color:#00ff66;background:#0a0a0a}
.match{display:flex;justify-content:space-between;align-items:center;padding:10px 8px;background:#0a0a0a;border-bottom:1px solid #151515;cursor:pointer}
.match:hover{background:#111}
.team{display:flex;align-items:center;gap:6px;font-size:13px}
.team img{width:18px}
.score{color:#00ff66;font-weight:900;text-align:right}
.status{color:#00ff66;font-size:11px;font-weight:900;width:42px}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2px solid #00ff66;z-index:9999}
.bottom a{background:#00ff66;color:#000;padding:12px;border-radius:10px;font-weight:900;text-align:center;display:block;text-decoration:none}
.spacer{height:90px}
.loading{padding:20px;text-align:center;color:#00ff66}
/* WIDGET MODAL STYLING */
api-sports-widget{--widget-bg:#000}
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

<div id="main"><div class="loading">Loading matches...</div></div>

<!-- WIDGET CONFIG - THIS WILL OPEN GAME DETAILS WITH EVENTS & LINEUPS -->
<api-sports-widget id="cfg" data-type="config" data-key="98a19520b228fd8dcff8459b07f0d569" data-sport="football" data-theme="grey" data-show-logos="true" data-target-game="modal" data-target-team="modal" data-target-player="modal" data-timezone="Africa/Lagos" data-refresh="30"></api-sports-widget>
<div style="display:none"><api-sports-widget id="gameDetail" data-type="game" data-game-id="0"></api-sports-widget></div>

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
      html+=\`<div class="match" onclick="openWidget(\${m.fixture.id})"><div style="flex:1"><div class="team"><span class="status">\${time}</span><img src="\${m.teams.home.logo}"><span>\${m.teams.home.name}</span></div><div class="team"><span class="status"></span><img src="\${m.teams.away.logo}"><span>\${m.teams.away.name}</span></div></div><div class="score">\${m.goals.home??'-'}<br>\${m.goals.away??'-'}</div></div>\`;
    });
  }); document.getElementById('main').innerHTML=html;
}
function openWidget(id){
  // This opens the official API-FOOTBALL widget with Events & lineups
  const w=document.getElementById('gameDetail');
  w.setAttribute('data-game-id', id);
  w.innerHTML=''; w.connectedCallback();
  setTimeout(()=>{ document.querySelector('api-sports-widget[data-type="game"]')?.shadowRoot?.querySelector('button, [class*="open"]')?.click(); }, 100);
  // Trigger widget modal
  const cfg=document.getElementById('cfg');
  // Force open via widget internal method
  w.scrollIntoView();
  // Direct call to open game
  if(window.dispatchEvent){ window.dispatchEvent(new CustomEvent('open-game', {detail:{id}})); }
  // Simple fallback: use widget's target-game=modal - we set game id and click
  setTimeout(()=>{
    const ev = new MouseEvent('click', {bubbles:true});
    w.dispatchEvent(ev);
    // Try to open modal programmatically
    document.body.click();
  }, 300);
  // Most reliable: recreate widget in modal
  const gameWidget = document.createElement('api-sports-widget');
  gameWidget.setAttribute('data-type','game');
  gameWidget.setAttribute('data-game-id', id);
  const modal = document.createElement('div');
  modal.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;overflow:auto;padding:10px';
  modal.innerHTML='<button onclick="this.parentElement.remove()" style="background:#00ff66;color:#000;border:none;padding:12px;border-radius:8px;font-weight:900;width:100%;margin-bottom:10px">X CLOSE</button>';
  modal.appendChild(gameWidget);
  document.body.appendChild(modal);
}
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
