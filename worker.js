export default {
  async fetch() {
    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE</title>
<script type="module" src="https://widgets.api-sports.io/3.1.0/widgets.js"></script>
<style>
html,body{margin:0;background:#000 !important;color:#fff;font-family:Arial}
.top{background:#000;display:flex;justify-content:center;padding:12px;border-bottom:2px solid #00ff66;position:sticky;top:0;z-index:100}
.logo{background:#00ff66;color:#000;padding:6px 22px;border-radius:6px;font-weight:900;font-style:italic}
.bet{padding:10px;background:#000;position:sticky;top:53px;z-index:99}
.bet a{background:#00ff66;color:#000;padding:12px;border-radius:10px;font-weight:900;text-decoration:none;text-align:center;display:block}
#main{background:#000;min-height:100vh}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2px solid #00ff66;z-index:9999}
.bottom a{background:#00ff66;color:#000;padding:12px;border-radius:10px;font-weight:900;text-decoration:none;text-align:center;display:block}
.spacer{height:90px}
</style>
</head><body>
<div class="top"><span class="logo">DIAMOND LIVESCORE</span></div>
<div class="bet"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>

<div id="main">
<!-- CONFIG -->
<api-sports-widget data-type="config" data-key="98a19520b228fd8dcff8459b07f0d569" data-sport="football" data-theme="grey" data-show-logos="true" data-target-game="modal" data-timezone="Africa/Lagos" data-refresh="60"></api-sports-widget>
<!-- GAMES - THIS SHOWS MATCHES -->
<api-sports-widget data-type="games" data-show-toolbar="true" data-tab="all"></api-sports-widget>
</div>

<div class="spacer"></div>
<div class="bottom"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>

<script>
function paint(){
  document.querySelectorAll('*').forEach(el=>{
    if(el.shadowRoot){
      const r = el.shadowRoot;
      if(!r.querySelector('#fix')){
        const s=document.createElement('style');
        s.id='fix';
        s.textContent=\`
          [class*="toolbar"]{background:#00ff66 !important}
          [class*="toolbar"] div{color:#000 !important;font-weight:900 !important}
          [class*="tab"]{background:#000 !important;color:#00ff66 !important;border:1px solid #00ff66 !important}
          [class*="active"]{background:#00ff66 !important;color:#000 !important}
          [class*="game"]{background:#0a0a0a !important}
          [class*="score"]{color:#00ff66 !important}
        \`;
        r.appendChild(s);
      }
    }
  });
}
setInterval(paint,500);
</script>
</body></html>`;
    return new Response(html, { headers: {"Content-Type":"text/html"} });
  }
}
