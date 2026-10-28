export default {
  async fetch() {
    const html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE</title>
<script type="module" src="https://widgets.api-sports.io/3.1.0/widgets.js"><\/script>
<style>
body{margin:0;background:#000;color:#fff;font-family:Arial}
.banner{ text-align:center; padding:11px 8px; font-weight:bold; position:sticky; z-index:99; font-size:13px; line-height:1.3 }
.banner a{color:#fff; text-decoration:none; display:block}
.b1{background:#0a5cff; top:0;}
.b2{background:#111; border-bottom:2px solid #00ff66; top:38px;}
.b2 a{color:#00ff66}
.content{padding-top:5px}
api-sports-widget[data-theme="Diamond"]{--primary-color:#00ff66;--background-color:#000;--text-color:#fff;--text-color-info:#00ff66;--border:1px solid #1a1a1a}
</style></head><body>

<div class="banner b1"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">🔥 1XBET - 200% BONUS - CODE: 1x_6045135 - CLICK TO BET NOW</a></div>

<div class="banner b2"><a href="https://bc.game/i-99vfhj262r-n/" target="_blank">🎰 BC.GAME - CODE: 99vfhj262r - 300% BONUS + 20 FREE SPINS</a></div>

<div class="content">
<api-sports-widget data-type="config" data-key="98a19520b228fd8dcff8459b07f0d569" data-sport="football" data-theme="Diamond" data-show-logos="true" data-target-game="modal" data-target-standings="modal" data-timezone="Africa/Lagos"></api-sports-widget>
<api-sports-widget data-type="games" data-show-toolbar="true" data-tab="all" data-refresh="300"></api-sports-widget>
</div>

</body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" }});
  }
}
