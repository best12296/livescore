export default {
  async fetch() {
    const html = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE - Live Scores</title>
<script type="module" src="https://widgets.api-sports.io/3.1.0/widgets.js"><\/script>
<style>
body{margin:0;background:#000;color:#fff;font-family:Arial,sans-serif}
.top-banner{background:#0a5cff;color:#fff;text-align:center;padding:12px 10px;font-weight:bold;position:sticky;top:0;z-index:100;font-size:14px;line-height:1.3}
.top-banner a{color:#fff;text-decoration:none;display:block}
.bottom-banner{background:#111;border-top:2px solid #00ff66;text-align:center;padding:13px 10px;position:fixed;bottom:0;left:0;right:0;z-index:100;font-size:14px}
.bottom-banner a{color:#00ff66;text-decoration:none;font-weight:bold;display:block}
.content{padding-bottom:75px}
api-sports-widget[data-theme="Diamond"]{
--primary-color:#00ff66;
--success-color:#00ff66;
--background-color:#000000;
--text-color:#ffffff;
--text-color-info:#00ff66;
--border:1px solid #1a1a1a;
--hover:rgba(0,255,102,0.12);
--game-height:2.9rem;
--league-height:2.5rem;
--teams-logo-size:22px;
}
</style>
</head>
<body>

<div class="top-banner">
<a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">
🔥 1XBET - 200% BONUS - CODE: DIAMOND - CLICK TO BET NOW
</a>
</div>

<div class="content">
<api-sports-widget data-type="config" data-key="98a19520b228fd8dcff8459b07f0d569" data-sport="football" data-theme="Diamond" data-lang="en" data-timezone="Africa/Lagos" data-show-logos="true" data-target-game="modal" data-target-standings="modal" data-target-team="modal"></api-sports-widget>
<api-sports-widget data-type="games" data-show-toolbar="true" data-tab="all" data-refresh="60"></api-sports-widget>
</div>

<div class="bottom-banner">
<a href="https://bc.game/i-99vfhj262r-n/" target="_blank">
🎰 BC.GAME - CODE: 99vfhj262r - 300% BONUS + 20 FREE SPINS
</a>
</div>

</body>
</html>`;
    return new Response(html, { 
      headers: { 
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=60"
      }
    });
  }
}
