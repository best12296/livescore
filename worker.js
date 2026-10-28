export default {
  async fetch() {
    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE</title>
<script type="module" src="https://widgets.api-sports.io/3.1.0/widgets.js"></script>
<style>
html,body{margin:0;background:#000;color:#fff;font-family:Arial,sans-serif}
.top-logos{background:#000;display:flex;justify-content:center;padding:12px;border-bottom:2px solid #00ff66;position:sticky;top:0;z-index:100}
.logo-1x{background:#fff;color:#0a5cff;padding:6px 22px;border-radius:6px;font-weight:900;font-style:italic;font-size:18px}
.bet-bar{display:flex;gap:10px;padding:10px;background:#000}
.bet-bar.top{position:sticky;top:52px;z-index:99}
.bet-bar.bottom{position:fixed;bottom:0;left:0;right:0;border-top:2px solid #00ff66;z-index:9999;background:#000}
.btn{flex:1;text-align:center;padding:14px;border-radius:10px;font-weight:900;text-decoration:none;font-size:15px}
.btn-1x{background:#00ff66;color:#000}
.spacer{height:80px}
#main{background:#000;min-height:400px}
</style>
</head><body>

<div class="top-logos"><span class="logo-1x">1XBET</span></div>

<div class="bet-bar top">
<a class="btn btn-1x" href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a>
</div>

<div id="main">
<api-sports-widget data-type="config" data-key="98a19520b228fd8dcff8459b07f0d569" data-sport="football" data-theme="Diamond" data-show-logos="true" data-target-game="modal" data-timezone="Africa/Lagos"></api-sports-widget>
<api-sports-widget id="gamesWidget" data-type="games" data-show-toolbar="true" data-tab="all"></api-sports-widget>
</div>

<div class="spacer"></div>

<div class="bet-bar bottom">
<a class="btn btn-1x" href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a>
</div>

<script>
function paintWidget(){
  const widgets = document.querySelectorAll('api-sports-widget');
  widgets.forEach(w=>{
    if(!w.shadowRoot) return;
    if(w.shadowRoot.querySelector('#diamond-fix')) return;
    const s = document.createElement('style');
    s.id = 'diamond-fix';
    s.textContent = \`
      *{background-color:transparent !important}
      :host, .widget, .container, [class*="container"], [class*="wrapper"]{background:#000 !important;background-color:#000 !important}
      [class*="toolbar"], [class*="header"], [class*="top"], [class*="nav"], header{
        background:#000 !important;background-color:#000 !important;
        color:#00ff66 !important;
        border-bottom:1.5px solid #00ff66 !important;
      }
      [class*="date"], time, [class*="title"]{color:#00ff66 !important}
      [class*="no-games"], [class*="empty"], [class*="message"], div:has(> p){
        background:#0a0a0a !important;background-color:#0a0a0a !important;
        color:#aaa !important;
      }
      [class*="game"], [class*="match"], [class*="card"]{background:#0e0e0e !important;border-color:#1a1a1a !important}
      svg, path{fill:#00ff66 !important; stroke:#00ff66 !important}
    \`;
    w.shadowRoot.appendChild(s);
  });
}
setInterval(paintWidget, 600);
new MutationObserver(paintWidget).observe(document.body,{childList:true,subtree:true});
</script>

</body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html" }});
  }
}
