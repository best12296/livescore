export default {
  async fetch() {
    const html = `<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>DIAMOND LIVESCORE</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
<script type="module" crossorigin src="https://widgets.api-sports.io/3.1.0/widgets.js"></script>
<style>
body{margin:0;background:#000 !important;color:#fff !important}
.navbar{background:#000 !important;border-bottom:2px solid #00ff66 !important}
.navbar-brand{color:#00ff66 !important;font-weight:900;font-style:italic}
.nav-link{color:#fff !important;border:1px solid #00ff66 !important;border-radius:8px !important;margin:2px !important;font-weight:700}
.nav-link.active,.nav-link:hover{background:#00ff66 !important;color:#000 !important}
.container-fluid,.content{max-width:1440px;margin:auto}
.card{background:#0a0a0a !important;border:1px solid #1a1a1a !important;border-top:2px solid #00ff66 !important}
.top-logos{background:#000;display:flex;justify-content:center;padding:10px;border-bottom:2px solid #00ff66;position:sticky;top:0;z-index:100}
.logo-1x{background:#00ff66;color:#000;padding:6px 22px;border-radius:6px;font-weight:900;font-style:italic}
.bet-bar{display:flex;gap:8px;padding:10px;background:#000;overflow-x:auto}
.btn-1x{background:#00ff66;color:#000;padding:12px;border-radius:10px;font-weight:900;text-decoration:none;text-align:center;width:100%;display:block}
.bet-bar.bottom{position:fixed;bottom:0;left:0;right:0;border-top:2px solid #00ff66;z-index:9999;background:#000}
.spacer{height:80px}
#game-content{position:sticky;top:70px;overflow-y:auto}
#game-content api-sports-widget{max-height:calc(100vh - 100px)}
#standings-content api-sports-widget,#team-content api-sports-widget{margin-bottom:1rem;max-height:55vh}
#leagues-list{position:sticky;top:70px;overflow-y:auto;max-height:calc(100vh - 80px)}
/* FORCE WIDGET TO BLACK/GREEN */
api-sports-widget{--widget-bg:#000 !important}
</style>
</head>
<body>

<div class="top-logos"><span class="logo-1x">DIAMOND LIVESCORE</span></div>

<nav class="header navbar navbar-expand-lg sticky-top">
<div class="container-fluid">
<a class="navbar-brand" href="/">DIAMOND</a>
<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"><span class="navbar-toggler-icon"></span></button>
<div class="collapse navbar-collapse" id="navbarSupportedContent">
<ul class="navbar-nav me-auto mb-2 mb-lg-0">
<li class="nav-item"><a class="nav-link active" data-sport="football" href="#">Football</a></li>
<li class="nav-item"><a class="nav-link" data-sport="basketball" href="#">Basketball</a></li>
<li class="nav-item"><a class="nav-link" data-sport="baseball" href="#">Baseball</a></li>
<li class="nav-item"><a class="nav-link" data-sport="rugby" href="#">Rugby</a></li>
</ul>
</div>
</div>
</nav>

<div class="bet-bar">
<a class="btn-1x" href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a>
</div>

<div class="content p-2">
<div class="row">

<div class="col-12 col-lg-3 mb-3">
<div id="leagues-list" class="card text-bg-dark border-dark">
<div class="card-body p-0">
<api-sports-widget data-type="leagues"></api-sports-widget>
</div>
</div>
</div>

<div class="col-12 col-lg-5 mb-3">
<div class="card text-bg-dark border-dark">
<div class="card-body p-0">
<div id="games-list">
<api-sports-widget data-type="games"></api-sports-widget>
</div>
</div>
</div>
</div>

<div class="col-12 col-lg-4 mb-3">
<div class="card text-bg-dark border-dark mb-2">
<div class="card-body p-0">
<div id="standings-content"></div>
</div>
</div>
<div class="card text-bg-dark border-dark mb-2">
<div class="card-body p-0">
<div id="team-content"></div>
</div>
</div>
<div id="game-content" class="card text-bg-dark border-dark">
<div class="card-body p-0">
<api-sports-widget data-type="game" data-game-id="1208086"></api-sports-widget>
</div>
</div>
</div>

</div>
</div>

<div class="spacer"></div>
<div class="bet-bar bottom">
<a class="btn-1x" href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a>
</div>

<!-- CONFIG - YOUR KEY INSIDE -->
<api-sports-widget 
  data-type="config" 
  data-sport="football" 
  data-key="98a19520b228fd8dcff8459b07f0d569"
  data-lang="en" 
  data-theme="grey" 
  data-show-error="false" 
  data-show-logos="true"
  data-refresh="20" 
  data-favorite="true" 
  data-player-trophies="true" 
  data-standings="true"
  data-player-injuries="true"
  data-team-squad="true" 
  data-team-statistics="true" 
  data-player-statistics="true"
  data-tab="games"
  data-game-tab="statistics"
  data-target-player="modal" 
  data-target-league="#games-list" 
  data-target-team="#team-content" 
  data-target-game="#game-content .card-body" 
  data-target-standings="#standings-content"
  data-timezone="Africa/Lagos"
 ></api-sports-widget>

<script>
document.addEventListener('click', function (event) {
  if (!event.target.matches('.nav-link')) return
  event.preventDefault()
  let sport = event.target.getAttribute('data-sport')
  document.querySelectorAll('.nav-link').forEach(n=>n.classList.remove('active'))
  event.target.classList.add('active')
  let widget = document.querySelector('api-sports-widget[data-type="config"]');
  widget.setAttribute('data-sport', sport);
  let leagues = document.querySelector('api-sports-widget[data-type="leagues"]');
  leagues.innerHTML = ''; leagues.setAttribute('data-sport', sport); leagues.connectedCallback()
  let games = document.querySelector('api-sports-widget[data-type="games"]');
  games.innerHTML = ''; games.setAttribute('data-sport', sport); games.connectedCallback()
  let game = document.querySelector('api-sports-widget[data-type="game"]');
  game.innerHTML = ''; game.setAttribute('data-sport', sport); game.connectedCallback()
  window.document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true, cancelable: true }));
});

// FORCE BLACK/GREEN ON TOOLBAR
function forceGreen(){
  document.querySelectorAll('*').forEach(el=>{
    if(el.shadowRoot){
      if(!el.shadowRoot.querySelector('#force-diamond')){
        const s = document.createElement('style');
        s.id='force-diamond';
        s.textContent=\`
          [class*="toolbar"],[class*="tabs"]{background:#000 !important;border-bottom:2px solid #00ff66 !important}
          [class*="tab"]{background:#000 !important;color:#00ff66 !important;border:1px solid #00ff66 !important}
          [class*="active"]{background:#00ff66 !important;color:#000 !important}
          [class*="game"],[class*="card"]{background:#0a0a0a !important}
          [class*="score"],strong{color:#00ff66 !important}
        \`;
        el.shadowRoot.appendChild(s);
      }
    }
  });
}
setInterval(forceGreen, 800);
</script>

</body>
</html>`;
    return new Response(html, { headers: { "Content-Type": "text/html", "Cache-Control":"no-cache" }});
  }
}
