export default {
  async fetch() {
    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE - GREEN BLACK</title>
<script type="module" src="https://widgets.api-sports.io/3.1.0/widgets.js"></script>
<style>
body{margin:0;background:#000;color:#fff;font-family:Arial,sans-serif}
.top-banner{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 10px;font-weight:900;font-size:13px;background:#000;border-bottom:2px solid #00ff66;position:sticky;top:0;z-index:100}
.top-banner a{color:#00ff66;text-decoration:none;display:flex;align-items:center;gap:8px}
.logo-bc{background:#00ff66;color:#000;padding:4px 10px;border-radius:5px;font-weight:900}
.bet-bar{display:flex;gap:10px;padding:10px;background:#0a0a0a;z-index:99}
.bet-bar.top{position:sticky;top:44px;border-bottom:1px solid #1a1a1a}
.bet-bar.bottom{position:fixed;bottom:0;left:0;right:0;border-top:2px solid #00ff66;z-index:9999;background:#000}
.btn{flex:1;text-align:center;padding:12px;border-radius:8px;font-weight:900;text-decoration:none;font-size:13px}
.btn-1x{background:#00ff66;color:#000 !important}
.btn-bc{background:#000;color:#00ff66 !important;border:1.5px solid #00ff66}
.section-title{background:linear-gradient(90deg,#000,#0a1a0a);padding:12px 15px;font-weight:900;color:#00ff66;border-left:4px solid #00ff66;letter-spacing:1px}
.spacer{height:80px}
/* GREEN BLACK POPUP */
#codePopup{position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:10000;backdrop-filter:blur(5px)}
.popup-box{background:#0a0a0a;border:2px solid #00ff66;border-radius:12px;padding:20px;width:90%;max-width:320px;text-align:center;box-shadow:0 0 20px #00ff6640}
.popup-box h2{color:#00ff66;margin:0 0 10px;font-size:18px}
.popup-box p{font-size:13px;color:#ccc;margin:6px 0}
.code{display:block;background:#000;border:1px dashed #00ff66;color:#00ff66;padding:8px;border-radius:6px;font-weight:900;margin:8px 0;letter-spacing:1px}
.close-btn{background:#00ff66;color:#000;border:none;padding:12px;width:100%;border-radius:8px;font-weight:900;margin-top:12px;cursor:pointer}
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

<div class="section-title">⚽ LIVE SCORES - DIAMOND GREEN BLACK</div>
<api-sports-widget data-type="games" data-show-toolbar="true" data-tab="all" data-refresh="300"></api-sports-widget>

<div class="spacer"></div>

<div class="bet-bar bottom">
<a class="btn btn-1x" href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW</a>
<a class="btn btn-bc" href="https://bc.game/i-99vfhj262r-n/" target="_blank">BC.GAME - BET NOW</a>
</div>

<div id="codePopup">
  <div class="popup-box">
    <h2>🎁 USE MY CODES & GET BONUS</h2>
    <p>Register with my codes to get up to 300% bonus</p>
    <span class="code">1XBET CODE: 1x_6045135</span>
    <span class="code">BC.GAME CODE: 99vfhj262r</span>
    <p style="font-size:11px;color:#888">Don't forget to enter code at registration to get bonus. My link already tracks you!</p>
    <button class="close-btn" onclick="document.getElementById('codePopup').style.display='none'">I DON COPY AM - BET NOW</button>
  </div>
</div>

<script>
setTimeout(()=>{ 
  const p=document.getElementById('codePopup');
  if(p) p.style.display='flex';
}, 2500);
// Close popup when click outside
document.getElementById('codePopup').addEventListener('click', function(e){
  if(e.target===this) this.style.display='none';
});
</script>

</body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" }});
  }
}
