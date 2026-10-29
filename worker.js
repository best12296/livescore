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
.sectionTitle{background:#00ff66;color:#000;padding:8px;font-weight:900;font-size:13px;margin-top:4px}
#main{background:#000;min-height:100vh}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2px solid #00ff66;z-index:9999}
.bottom a{background:#00ff66;color:#000;padding:12px;border-radius:10px;font-weight:900;text-decoration:none;text-align:center;display:block}
.spacer{height:90px}
</style>
</head><body>
<div class="top"><span class="logo">DIAMOND LIVESCORE</span></div>
<div class="bet"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>

<!-- OFFICIAL CONFIG - THIS MAKES MATCH CLICKABLE WITH EVENTS & LINEUPS -->
<api-sports-widget data-type="config" data-key="98a19520b228fd8dcff8459b07f0d569" data-sport="football" data-theme="grey" data-show-logos="true" data-target-game="modal" data-target-team="modal" data-target-player="modal" data-timezone="Africa/Lagos" data-refresh="30"></api-sports-widget>

<div id="main">

<div class="sectionTitle">⭐ TOP 9 LEAGUES - CHAMPIONS LEAGUE, EUROPA, EPL, LALIGA, LIGUE 1, BUNDESLIGA, SERIE A, EREDIVISIE</div>
<!-- WIDGET 1 - ONLY TOP 9 LEAGUES - THEY WILL ALWAYS BE ON TOP -->
<api-sports-widget 
  data-type="games" 
  data-league="2,3,848,39,140,61,78,135,88"
  data-show-toolbar="false"
  data-tab="all">
</api-sports-widget>

<div class="sectionTitle">OTHER LEAGUES</div>
<!-- WIDGET 2 - ALL GAMES -->
<api-sports-widget 
  data-type="games" 
  data-show-toolbar="true" 
  data-tab="all">
</api-sports-widget>

</div>

<div class="spacer"></div>
<div class="bottom"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>

<script>
function paint(){
  document.querySelectorAll('*').forEach(el=>{
    if(el.shadowRoot){
      const r = el.shadowRoot;
      if(!r.querySelector('#green-fix')){
        const s=document.createElement('style');
        s.id='green-fix';
        s.textContent=\`
          [class*="toolbar"]{background:#000 !important;border-bottom:2px solid #00ff66 !important}
          [class*="toolbar"] div{color:#00ff66 !important;font-weight:900 !important}
          [class*="tab"]{background:#000 !important;color:#00ff66 !important;border:1px solid #00ff66 !important;border-radius:8px !important}
          [class*="tab"][class*="active"], [class*="active"]{background:#00ff66 !important;color:#000 !important}
          [class*="game"]{background:#0a0a0a !important;cursor:pointer}
          [class*="score"]{color:#00ff66 !important;font-weight:900 !important}
          [class*="league"]{border-top:2px solid #00ff66 !important}
          [class*="modal"]{background:#000 !important}
          [class*="header"]{background:#000 !important;color:#00ff66 !important;border-bottom:2px solid #00ff66 !important}
        \`;
        r.appendChild(s);
      }
    }
  });
}
setInterval(paint, 600);
</script>
</body></html>`;
    return new Response(html, { headers: {"Content-Type":"text/html","Cache-Control":"no-cache"} });
  }
}
