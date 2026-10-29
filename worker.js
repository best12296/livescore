export default {
  async fetch(request) {
    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE</title>
<script type="module" src="https://widgets.api-sports.io/3.1.0/widgets.js"></script>
<style>
html,body{margin:0;background:#000;color:#fff;font-family:Arial,sans-serif}
.top-logos{background:#000;display:flex;justify-content:center;padding:12px;border-bottom:2px solid #00ff66;position:sticky;top:0;z-index:100}
.logo-1x{background:#00ff66;color:#000;padding:6px 22px;border-radius:6px;font-weight:900;font-style:italic;font-size:18px}
.bet-bar{display:flex;gap:10px;padding:10px;background:#000}
.bet-bar.top{position:sticky;top:52px;z-index:99}
.bet-bar.bottom{position:fixed;bottom:0;left:0;right:0;border-top:2px solid #00ff66;z-index:9999;background:#000}
.btn{flex:1;text-align:center;padding:14px;border-radius:10px;font-weight:900;text-decoration:none;font-size:15px}
.btn-1x{background:#00ff66;color:#000;box-shadow:0 0 12px #00ff66}
.spacer{height:80px}
#main{background:#000;min-height:400px}
#standingsWrap{display:none;background:#000;padding:10px}
#backBtn{background:#00ff66;color:#000;border:none;padding:10px 16px;border-radius:8px;font-weight:900;margin-bottom:12px}
#standingsTitle{color:#00ff66;font-weight:900;margin-bottom:10px;font-size:16px;border-left:3px solid #00ff66;padding-left:8px}
</style>
</head><body>

<div class="top-logos"><span class="logo-1x">DIAMOND LIVESCORE</span></div>

<div class="bet-bar top">
<a class="btn btn-1x" href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a>
</div>

<div id="main">
<api-sports-widget data-type="config" data-key="98a19520b228fd8dcff8459b07f0d569" data-sport="football" data-theme="Diamond" data-show-logos="true" data-target-game="modal" data-timezone="Africa/Lagos"></api-sports-widget>

<div id="gamesWrap">
<api-sports-widget id="gamesWidget" data-type="games" data-show-toolbar="true" data-tab="all"></api-sports-widget>
</div>

<div id="standingsWrap">
<button id="backBtn" onclick="showGames()">← BACK TO SCORES</button>
<div id="standingsTitle"></div>
<div id="standingsContainer"></div>
</div>

</div>

<div class="spacer"></div>

<div class="bet-bar bottom">
<a class="btn btn-1x" href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a>
</div>

<script>
window.showStandings = function(leagueId, leagueName){
  document.getElementById('gamesWrap').style.display='none';
  document.getElementById('standingsWrap').style.display='block';
  document.getElementById('standingsTitle').innerText = leagueName.toUpperCase() + ' - STANDINGS';
  const container = document.getElementById('standingsContainer');
  container.innerHTML = '';
  const w = document.createElement('api-sports-widget');
  w.setAttribute('data-type','standings');
  w.setAttribute('data-league', leagueId);
  w.setAttribute('data-season','2025');
  container.appendChild(w);
  window.scrollTo(0,0);
}
window.showGames = function(){
  document.getElementById('standingsWrap').style.display='none';
  document.getElementById('gamesWrap').style.display='block';
}

function paintWidget(){
  document.querySelectorAll('api-sports-widget').forEach(w=>{
    if(!w.shadowRoot) return;
    const root = w.shadowRoot;
    if(!root.querySelector('#diamond-green-fix')){
      const s = document.createElement('style');
      s.id = 'diamond-green-fix';
      s.textContent = \`
        *{background:transparent !important;background-color:transparent !important;color:#fff !important}
        :host, .widget, .container, [class*="container"], [class*="wrapper"], [class*="content"], main, body, html{
          background:#000 !important;background-color:#000 !important;color:#fff !important
        }
        [class*="toolbar"], [class*="header"], [class*="top"], [class*="nav"], header, [class*="tabs"], [class*="league"]{
          background:#000 !important;background-color:#000 !important;
          color:#00ff66 !important;border-bottom:1.5px solid #00ff66 !important;
        }
        [class*="game"], [class*="match"], [class*="card"], [class*="row"], [class*="item"], [class*="standing"], tr{
          background:#0a0a0a !important;background-color:#0a0a0a !important;
          border:1px solid #1a1a1a !important;border-left:2px solid #00ff66 !important;
          color:#fff !important;
        }
        [class*="team"], td, th, span, div{color:#fff !important}
        [class*="time"], [class*="score"], strong{color:#00ff66 !important}
        th{background:#000 !important;color:#00ff66 !important}
        svg, path{fill:#00ff66 !important;stroke:#00ff66 !important}
      \`;
      root.appendChild(s);
    }

    // Add green Standings button
    root.querySelectorAll('[class*="league"], [class*="group"]').forEach(h=>{
      if(h.querySelector('.diamond-standing')) return;
      const text = h.textContent || '';
      if(text.length < 3 || text.length > 70) return;
      const btn = document.createElement('span');
      btn.className = 'diamond-standing';
      btn.textContent = 'Standings >';
      btn.style.cssText = 'color:#00ff66 !important;cursor:pointer;font-size:12px;margin-left:auto;font-weight:900;border:1px solid #00ff66;padding:2px 8px;border-radius:12px;background:#000 !important';
      btn.onclick = (e)=>{
        e.stopPropagation();
        let leagueId = 39;
        window.showStandings(leagueId, text);
      };
      h.style.display='flex'; h.style.alignItems='center';
      h.appendChild(btn);
    });
  });
}
setInterval(paintWidget, 700);
new MutationObserver(paintWidget).observe(document.body,{childList:true,subtree:true});
</script>

</body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html", "Cache-Control":"no-cache" }});
  }
}
