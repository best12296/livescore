const API_KEY = "98a19520b228fd8dcff8459b07f0d569";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    if(url.pathname === "/api/standings"){
      const league = url.searchParams.get("league") || "39";
      const season = url.searchParams.get("season") || "2025";
      const apiRes = await fetch(`https://v3.football.api-sports.io/standings?league=${league}&season=${season}`, {
        headers: { "x-apisports-key": API_KEY }
      });
      const data = await apiRes.json();
      return new Response(JSON.stringify(data), { 
        headers: { "Content-Type":"application/json", "Access-Control-Allow-Origin":"*" }
      });
    }

    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE</title>
<script type="module" src="https://widgets.api-sports.io/3.1.0/widgets.js"></script>
<style>
html,body{margin:0;background:#000 !important;color:#fff;font-family:Arial,sans-serif}
.top-logos{background:#000;display:flex;justify-content:center;padding:12px;border-bottom:2px solid #00ff66;position:sticky;top:0;z-index:100}
.logo-1x{background:#00ff66;color:#000;padding:6px 22px;border-radius:6px;font-weight:900;font-style:italic;font-size:18px}
.bet-bar{display:flex;gap:8px;padding:10px;background:#000;overflow-x:auto}
.bet-bar.top{position:sticky;top:52px;z-index:99}
.bet-bar.bottom{position:fixed;bottom:0;left:0;right:0;border-top:2px solid #00ff66;z-index:9999;background:#000}
.btn{flex:1;text-align:center;padding:12px;border-radius:10px;font-weight:900;text-decoration:none;font-size:13px;white-space:nowrap}
.btn-1x{background:#00ff66;color:#000}
.btn-table{background:#111;color:#00ff66;border:1px solid #00ff66}
.spacer{height:90px}
#main{background:#000}
#standingsWrap{display:none;background:#000;padding:10px;min-height:400px}
#backBtn{background:#00ff66;color:#000;border:none;padding:12px;border-radius:8px;font-weight:900;width:100%;margin-bottom:12px}
#tableTitle{color:#00ff66;font-weight:900;border-left:3px solid #00ff66;padding-left:8px;margin-bottom:10px}
table{width:100%;border-collapse:collapse;background:#0e0e0e}
th{background:#000;color:#00ff66;padding:10px 6px;text-align:left;font-size:12px;border-bottom:2px solid #00ff66}
td{padding:10px 6px;border-bottom:1px solid #1a1a1a;font-size:13px;color:#fff}
.pos{color:#00ff66;font-weight:900}
</style>
</head><body>

<div class="top-logos"><span class="logo-1x">DIAMOND LIVESCORE</span></div>

<div class="bet-bar top" style="flex-direction:column">
<a class="btn btn-1x" href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a>
<div style="display:flex;gap:6px;overflow-x:auto;margin-top:8px">
<button class="btn btn-table" onclick="loadTable(39,'England Premier League')">EPL</button>
<button class="btn btn-table" onclick="loadTable(140,'Spain La Liga')">LA LIGA</button>
<button class="btn btn-table" onclick="loadTable(135,'Italy Serie A')">SERIE A</button>
<button class="btn btn-table" onclick="loadTable(78,'Bundesliga')">BUNDESLIGA</button>
<button class="btn btn-table" onclick="loadTable(61,'Ligue 1')">LIGUE 1</button>
<button class="btn btn-table" onclick="loadTable(239,'Colombia Primera A')">COLOMBIA</button>
</div>
</div>

<div id="main">
<div id="gamesWrap">
<api-sports-widget data-type="config" data-key="98a19520b228fd8dcff8459b07f0d569" data-sport="football" data-theme="Diamond" data-show-logos="true" data-target-game="modal" data-timezone="Africa/Lagos"></api-sports-widget>
<api-sports-widget data-type="games" data-show-toolbar="true" data-tab="all"></api-sports-widget>
</div>
<div id="standingsWrap">
<button id="backBtn" onclick="showGames()">← BACK TO SCORES</button>
<div id="tableTitle"></div>
<div id="tableContent">Loading...</div>
</div>
</div>

<div class="spacer"></div>
<div class="bet-bar bottom">
<a class="btn btn-1x" href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a>
</div>

<script>
async function loadTable(leagueId, leagueName){
  document.getElementById('gamesWrap').style.display='none';
  document.getElementById('standingsWrap').style.display='block';
  document.getElementById('tableTitle').innerText = leagueName.toUpperCase() + ' - TABLE';
  document.getElementById('tableContent').innerHTML = '<div style="color:#00ff66;text-align:center;padding:20px">Loading Table...</div>';
  try{
    const res = await fetch('/api/standings?league='+leagueId+'&season=2025');
    const json = await res.json();
    const standings = json.response[0]?.league?.standings[0];
    if(!standings){ document.getElementById('tableContent').innerHTML = 'No table found.'; return; }
    let html = '<table><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>Pts</th></tr>';
    standings.forEach(team=>{
      html += \`<tr><td class="pos">\${team.rank}</td><td><img src="\${team.team.logo}" style="width:18px;margin-right:6px">\${team.team.name}</td><td>\${team.all.played}</td><td>\${team.all.win}</td><td>\${team.all.draw}</td><td>\${team.all.lose}</td><td style="color:#00ff66;font-weight:900">\${team.points}</td></tr>\`;
    });
    html += '</table>';
    document.getElementById('tableContent').innerHTML = html;
  }catch(e){ document.getElementById('tableContent').innerHTML = 'Error: ' + e.message; }
  window.scrollTo(0,0);
}
function showGames(){
  document.getElementById('standingsWrap').style.display='none';
  document.getElementById('gamesWrap').style.display='block';
}
</script>
</body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html" }});
  }
}
