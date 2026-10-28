export default {
  async fetch() {
    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE</title>
<script type="module" src="https://widgets.api-sports.io/3.1.0/widgets.js"></script>
<style>
body{margin:0;background:#000;color:#fff;font-family:Arial,sans-serif}
.top-banner{display:flex;align-items:center;justify-content:center;gap:8px;padding:11px 10px;font-weight:900;font-size:13px;background:#0a0a0a;border-bottom:2px solid #00ff66;position:sticky;top:0;z-index:100}
.top-banner a{color:#00ff66;text-decoration:none;display:flex;align-items:center;gap:8px}
.logo-bc{background:#00ff66;color:#000;padding:3px 9px;border-radius:5px;font-weight:900}
.bet-bar{display:flex;gap:10px;padding:10px;background:#0e0e0e;z-index:99}
.bet-bar.top{position:sticky;top:43px;border-bottom:1px solid #222}
.bet-bar.bottom{position:fixed;bottom:0;left:0;right:0;border-top:1px solid #222;z-index:9999}
.btn{flex:1;text-align:center;padding:11px;border-radius:8px;font-weight:bold;text-decoration:none;font-size:13px}
.btn-1x{background:#0a5cff;color:#fff}
.btn-bc{background:#000;color:#00ff66;border:1.5px solid #00ff66}
.section-title{background:#0e0e0e;padding:10px 15px;font-weight:bold;color:#00ff66;border-left:4px solid #00ff66}
.spacer{height:75px}
</style>
</head><body>

<div class="top-banner">
<a href="https://bc.game/i-99vfhj262r-n/" target="_blank">
<span class="logo-bc">BC.GAME</span> CODE: 99vfhj262r - 300% BONUS
</a>
</div>

<div class="bet-bar top">
<a class="btn btn-1x" href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW</a>
<a class="btn btn-bc" href="https://bc.game/i-99vfhj262r-n/" target="_blank">BC.GAME - BET NOW</a>
</div>

<api-sports-widget data-type="config" data-key="98a19520b228fd8dcff8459b07f0d569" data-sport="football" data-theme="Diamond" data-show-logos="true" data-target-game="modal" data-timezone="Africa/Lagos"></api-sports-widget>

<div class="section-title">LIVE SCORES</div>
<api-sports-widget data-type="games" data-show-toolbar="true" data-tab="all" data-refresh="300"></api-sports-widget>

<div class="spacer"></div>

<div class="bet-bar bottom">
<a class="btn btn-1x" href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW</a>
<a class="btn btn-bc" href="https://bc.game/i-99vfhj262r-n/" target="_blank">BC.GAME - BET NOW</a>
</div>

</body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" }});
  }
}
