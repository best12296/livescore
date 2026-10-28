export default {
  async fetch() {
    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE - OFFICIAL</title>
<script type="module" src="https://widgets.api-sports.io/3.1.0/widgets.js"></script>
<style>
body{margin:0;background:#000;color:#fff;font-family:Arial,sans-serif}
.banner{display:flex;align-items:center;justify-content:center;gap:10px;padding:10px;font-weight:bold;position:sticky;z-index:99;font-size:13px;text-align:center}
.banner a{color:#fff;text-decoration:none;display:flex;align-items:center;gap:8px}
.b1{background:#0a5cff;top:0}
.b2{background:#111;border-bottom:2px solid #00ff66;top:42px}
.b2 a{color:#00ff66}
.logo{height:22px;background:#fff;border-radius:4px;padding:2px 5px}
.logo-bc{height:22px;border-radius:4px}
.section-title{background:#0e0e0e;padding:10px 15px;font-weight:bold;color:#00ff66;border-left:4px solid #00ff66;margin-top:10px}
api-sports-widget[data-theme="Diamond"]{--primary-color:#00ff66 !important;--background-color:#000 !important;--text-color:#fff !important;--text-color-info:#00ff66 !important;--border:1px solid #1a1a1a !important;}

/* Custom BET NOW popup inside game modal */
.custom-bet-bar{display:flex;gap:8px;justify-content:center;padding:10px;background:#0e0e0e;position:sticky;bottom:0;z-index:9999}
.btn{flex:1;text-align:center;padding:10px 5px;border-radius:6px;font-weight:bold;text-decoration:none;font-size:13px}
.btn-1x{background:#0a5cff;color:#fff !important}
.btn-bc{background:#000;color:#00ff66 !important;border:1px solid #00ff66}
</style>
</head><body>

<div class="banner b1">
<a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">
<img class="logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/1xBet_logo.png/320px-1xBet_logo.png" alt="1XBET"> 1XBET CODE: 1x_6045135 - 200% BONUS
</a>
</div>

<div class="banner b2">
<a href="https://bc.game/i-99vfhj262r-n/" target="_blank">
<img class="logo-bc" src="https://bc.game/favicon.ico" alt="BC.GAME"> BC.GAME CODE: 99vfhj262r - 300% BONUS
</a>
</div>

<api-sports-widget data-type="config" data-key="98a19520b228fd8dcff8459b07f0d569" data-sport="football" data-theme="Diamond" data-show-logos="true" data-target-game="modal" data-target-standings="modal" data-timezone="Africa/Lagos"></api-sports-widget>

<div class="section-title">LIVE SCORES</div>
<api-sports-widget data-type="games" data-show-toolbar="true" data-tab="all" data-refresh="300"></api-sports-widget>

<div class="section-title">LEAGUE TABLES</div>
<api-sports-widget data-type="standings" data-league="39" data-season="2025" data-show-toolbar="true"></api-sports-widget>

<script>
// Add BET NOW buttons inside game popup automatically
setInterval(()=>{
  const modal = document.querySelector('api-sports-widget');
  if(!modal) return;
  const shadow = document.querySelector('[id*="api-sports"]');
  // Create fixed bottom bar if not exists
  if(!document.getElementById('my-bet-bar')){
    const bar = document.createElement('div');
    bar.id='my-bet-bar';
    bar.className='custom-bet-bar';
    bar.innerHTML = \`<a class="btn btn-1x" href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW</a><a class="btn btn-bc" href="https://bc.game/i-99vfhj262r-n/" target="_blank">BC.GAME - BET NOW</a>\`;
    document.body.appendChild(bar);
  }
},2000);
</script>

</body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" }});
  }
}
