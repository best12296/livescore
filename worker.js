export default {
  async fetch() {
    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE</title>
<script type="module" src="https://widgets.api-sports.io/3.1.0/widgets.js"></script>
<style>
body{margin:0;background:#000;color:#fff;font-family:Arial,sans-serif}
.banner{display:flex;align-items:center;justify-content:center;gap:10px;padding:12px 10px;font-weight:900;font-size:13px;position:sticky;z-index:99}
.b1{background:#0a5cff;top:0}
.b2{background:#0a0a0a;border-bottom:2px solid #00ff66;top:0}
.banner a{text-decoration:none;display:flex;align-items:center;gap:8px}
.b1 a{color:#fff}
.b2 a{color:#00ff66}
/* LOGO wey no dey break */
.logo-1x{background:#fff;color:#0a5cff;padding:4px 10px;border-radius:4px;font-weight:900;font-style:italic;letter-spacing:1px}
.logo-bc{background:#00ff66;color:#000;padding:4px 10px;border-radius:4px;font-weight:900}
.section-title{background:#0e0e0e;padding:10px 15px;font-weight:bold;color:#00ff66;border-left:4px solid #00ff66;margin-top:10px}
.bet-bar{display:flex;gap:10px;padding:12px;background:#0e0e0e;position:fixed;bottom:0;left:0;right:0;z-index:9999;border-top:1px solid #222}
.btn{flex:1;text-align:center;padding:12px;border-radius:8px;font-weight:bold;text-decoration:none;font-size:14px}
.btn-1x{background:#0a5cff;color:#fff}
.btn-bc{background:#000;color:#00ff66;border:1.5px solid #00ff66}
.spacer{height:70px}
</style>
</head><body>

<div class="banner b1">
<a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">
<span class="logo-1x">1XBET</span> CODE: 1x_6045135 - 200% BONUS
</a>
</div>

<div class="banner b2">
<a href="https://bc.game/i-99vfhj262r-n/" target="_blank">
<span class="logo-bc">BC.GAME</span> CODE: 99vfhj262r - 300% BONUS
</a>
</div>

<api-sports-widget data-type="config" data-key="98a19520b228fd8dcff8459b07f0d569" data-sport="football" data-theme="Diamond" data-show-logos="true" data-target-game="modal" data-target-standings="modal" data-timezone="Africa/Lagos"></api-sports-widget>

<div class="section-title">LIVE SCORES - 28 OCT.</div>
<api-sports-widget data-type="games" data-show-toolbar="true" data-tab="all" data-refresh="300"></api-sports-widget>

<div class="section-title">LEAGUE TABLES</div>
<api-sports-widget data-type="standings" data-league="39" data-season="2025" data-show-toolbar="true"></api-sports-widget>

<div class="spacer"></div>
<div class="bet-bar">
<a class="btn btn-1x" href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW</a>
<a class="btn btn-bc" href="https://bc.game/i-99vfhj262r-n/" target="_blank">BC.GAME - BET NOW</a>
</div>

</body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" }});
  }
}
