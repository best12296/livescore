export default {
  async fetch() {
    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE</title>
<script type="module" src="https://widgets.api-sports.io/3.1.0/widgets.js"></script>
<style>
html,body{margin:0;background:#000 !important;color:#fff;font-family:Arial,sans-serif}
.top-logos{background:#000;display:flex;justify-content:center;padding:12px;border-bottom:2px solid #00ff66;position:sticky;top:0;z-index:100}
.logo-1x{background:#00ff66;color:#000;padding:6px 22px;border-radius:6px;font-weight:900;font-style:italic;font-size:18px}
.bet-bar{display:flex;gap:8px;padding:10px;background:#000;overflow-x:auto}
.bet-bar.top{position:sticky;top:52px;z-index:99}
.bet-bar.bottom{position:fixed;bottom:0;left:0;right:0;border-top:2px solid #00ff66;z-index:9999;background:#000}
.btn{flex:1;text-align:center;padding:12px;border-radius:10px;font-weight:900;text-decoration:none;font-size:13px}
.btn-1x{background:#00ff66;color:#000}
.spacer{height:90px}
#main{background:#000;min-height:100vh}
</style>
</head><body>

<div class="top-logos"><span class="logo-1x">DIAMOND LIVESCORE</span></div>

<div class="bet-bar top">
<a class="btn btn-1x" href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a>
</div>

<div id="main">
<api-sports-widget data-type="config" data-key="98a19520b228fd8dcff8459b07f0d569" data-sport="football" data-theme="Diamond" data-show-logos="true" data-target-game="modal" data-timezone="Africa/Lagos"></api-sports-widget>
<api-sports-widget data-type="games" data-show-toolbar="true" data-tab="all"></api-sports-widget>
</div>

<div class="spacer"></div>

<div class="bet-bar bottom">
<a class="btn btn-1x" href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a>
</div>

<script>
function forceGreenBlack(root){
  if(!root || root.querySelector('#diamond-force')) return;
  const style = document.createElement('style');
  style.id = 'diamond-force';
  style.textContent = \`
    :host{background:#000 !important}
    *{background-color:transparent !important}
    /* TOOLBAR CONTAINER */
    [class*="toolbar"], [class*="Toolbar"], [class*="header"], [class*="filter"], [class*="tabs-container"]{
      background:#000 !important;
      background-color:#000 !important;
      border:none !important;
      border-bottom:2px solid #00ff66 !important;
      padding:6px !important;
    }
    /* ALL, LIVE, FINISHED, SCHEDULED BUTTONS */
    [class*="tab"], [class*="Tab"], button, [role="tab"], [class*="filter"] > div, [class*="toolbar"] > div > div{
      background:#000 !important;
      color:#00ff66 !important;
      border:1px solid #00ff66 !important;
      border-radius:8px !important;
      font-weight:900 !important;
      margin:2px !important;
    }
    /* ACTIVE TAB - ALL */
    [class*="active"], [class*="Active"], [class*="selected"], [aria-selected="true"]{
      background:#00ff66 !important;
      background-color:#00ff66 !important;
      color:#000 !important;
      border:1px solid #00ff66 !important;
    }
    /* DATE AND SEARCH BAR */
    [class*="date"], [class*="Date"], [class*="calendar"], [class*="Calendar"], [class*="toolbar"] div:nth-child(2){
      background:#000 !important;
      color:#00ff66 !important;
      border-top:1px solid #111 !important;
    }
    /* DATE TEXT 29 OCT */
    [class*="date"] span, [class*="Date"] span{
      color:#00ff66 !important;
    }
    /* SEARCH ICON */
    svg{fill:#00ff66 !important;color:#00ff66 !important}
    /* LEAGUE HEADERS - Colombia : Primera A */
    [class*="league"], [class*="League"], [class*="tournament"], [class*="country"]{
      background:#000 !important;
      color:#fff !important;
      border-bottom:1px solid #1a1a1a !important;
      border-top:2px solid #00ff66 !important;
    }
    /* MATCH ROWS */
    [class*="game"], [class*="match"], [class*="Match"], [class*="row"], [class*="card"]{
      background:#0a0a0a !important;
      border-bottom:1px solid #151515 !important;
    }
    [class*="game"]:hover, [class*="match"]:hover{
      background:#111 !important;
    }
    /* TEAM NAMES */
    [class*="team"], [class*="Team"]{
      color:#fff !important;
    }
    /* SCORES - GREEN */
    [class*="score"], [class*="Score"], strong, b{
      color:#00ff66 !important;
      font-weight:900 !important;
    }
    /* FT - GREEN */
    [class*="status"], [class*="Status"], [class*="time"], [class*="Time"]{
      color:#00ff66 !important;
      font-weight:900 !important;
    }
    /* PARENT WIDGET */
    div{background:#000 !important}
  \`;
  root.appendChild(style);
  
  // FORCE INLINE STYLE FOR TOOLBAR BUTTONS
  root.querySelectorAll('*').forEach(el=>{
    const txt = (el.innerText||'').trim();
    if(['ALL','LIVE','FINISHED','SCHEDULED'].includes(txt)){
      el.style.setProperty('background','#000','important');
      el.style.setProperty('color','#00ff66','important');
      el.style.setProperty('border','1px solid #00ff66','important');
      el.style.setProperty('border-radius','8px','important');
      el.style.setProperty('font-weight','900','important');
      el.style.setProperty('padding','8px 14px','important');
      if(txt==='ALL'){
        el.style.setProperty('background','#00ff66','important');
        el.style.setProperty('color','#000','important');
      }
    }
    if(txt.includes('OCT') || txt.includes('29')){
      el.style.setProperty('color','#00ff66','important');
      el.style.setProperty('background','#000','important');
    }
  });
}

function scan(){
  document.querySelectorAll('*').forEach(el=>{
    if(el.shadowRoot){
      forceGreenBlack(el.shadowRoot);
      // Deep shadow
      el.shadowRoot.querySelectorAll('*').forEach(s=>{
        if(s.shadowRoot) forceGreenBlack(s.shadowRoot);
      });
    }
  });
}

setInterval(scan, 400);
new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load', ()=>{ setTimeout(scan, 100); setTimeout(scan, 600); setTimeout(scan, 1500); });
</script>

</body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html", "Cache-Control":"no-cache" }});
  }
}
