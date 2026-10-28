export default {
  async fetch() {
    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE</title>
<script type="module" src="https://widgets.api-sports.io/3.1.0/widgets.js"></script>
<style>
body{margin:0;background:#000;color:#fff;font-family:Arial,sans-serif}
.top-logos{background:#000;display:flex;justify-content:center;gap:12px;padding:12px;border-bottom:2px solid #00ff66;position:sticky;top:0;z-index:100}
.logo-1x{background:#fff;color:#0a5cff;padding:6px 16px;border-radius:6px;font-weight:900;font-style:italic;font-size:18px}
.logo-bc{background:#0f1910;color:#00ff66;padding:6px 14px;border-radius:6px;font-weight:900;font-size:17px;border:2px solid #00ff66}
.bet-bar{display:flex;gap:10px;padding:10px;background:#000}
.bet-bar.top{position:sticky;top:52px;z-index:99}
.bet-bar.bottom{position:fixed;bottom:0;left:0;right:0;border-top:2px solid #00ff66;z-index:9999}
.btn{flex:1;text-align:center;padding:12px;border-radius:10px;font-weight:900;text-decoration:none;font-size:13px}
.btn-1x{background:#00ff66;color:#000}
.btn-bc{background:#000;color:#00ff66;border:1.5px solid #00ff66}
.spacer{height:80px}
</style>
</head><body>
<div class="top-logos"><span class="logo-1x">1XBET</span><span class="logo-bc">BC.GAME</span></div>
<div class="bet-bar top">
<a class="btn btn-1x" href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW</a>
<a class="btn btn-bc" href="https://bc.game/i-99vfhj262r-n/" target="_blank">BC.GAME - BET NOW</a>
</div>
<api-sports-widget data-type="config" data-key="98a19520b228fd8dcff8459b07f0d569" data-sport="football" data-theme="Diamond" data-show-logos="true" data-target-game="modal" data-timezone="Africa/Lagos"></api-sports-widget>
<api-sports-widget data-type="games" data-show-toolbar="true" data-tab="all"></api-sports-widget>
<div class="spacer"></div>
<div class="bet-bar bottom">
<a class="btn btn-1x" href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW</a>
<a class="btn btn-bc" href="https://bc.game/i-99vfhj262r-n/" target="_blank">BC.GAME - BET NOW</a>
</div>
</body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html" }});
  }
}
