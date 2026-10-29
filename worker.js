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
<api-sports-widget data-type="config" data-key="98a19520b228fd8dcff8459b07f0d569" data-sport="football" data-theme="grey" data-show-logos="true" data-target-game="modal" data-timezone="Africa/Lagos" data-refresh="60"></api-sports-widget>
<api-sports-widget data-type="games" data-show-toolbar="true" data-tab="all"></api-sports-widget>
</div>

<div class="spacer"></div>
<div class="bottom"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>

<script>
// YOUR TOP LEAGUES ORDER
const TOP_ORDER = [
  "CHAMPIONS LEAGUE",
  "EUROPA LEAGUE",
  "CONFERENCE LEAGUE",
  "ENGLAND : PREMIER LEAGUE",
  "PREMIER LEAGUE",
  "SPAIN : LALIGA",
  "LALIGA",
  "FRANCE : LIGUE 1",
  "LIGUE 1",
  "GERMANY : BUNDESLIGA",
  "BUNDESLIGA",
  "ITALY : SERIE A",
  "SERIE A",
  "NETHERLANDS : EREDIVISIE",
  "EREDIVISIE"
];

function getPriority(text){
  const t = text.toUpperCase();
  for(let i=0;i<TOP_ORDER.length;i++){
    if(t.includes(TOP_ORDER[i])) return i;
  }
  return 999;
}

function paintAndPin(){
  document.querySelectorAll('*').forEach(el=>{
    if(!el.shadowRoot) return;
    const r = el.shadowRoot;
    
    // GREEN/BLACK DESIGN
    if(!r.querySelector('#fix')){
      const s=document.createElement('style');
      s.id='fix';
      s.textContent=\`
        [class*="toolbar"]{background:#000 !important;border-bottom:2px solid #00ff66 !important}
        [class*="toolbar"] div{color:#000 !important;font-weight:900 !important}
        [class*="tab"]{background:#000 !important;color:#00ff66 !important;border:1px solid #00ff66 !important;border-radius:8px !important}
        [class*="active"]{background:#00ff66 !important;color:#000 !important}
        [class*="game"]{background:#0a0a0a !important}
        [class*="score"]{color:#00ff66 !important}
        [class*="league"]{border-top:2px solid #00ff66 !important}
      \`;
      r.appendChild(s);
    }

    // PIN TOP LEAGUES LOGIC
    // Find a container that has league headers
    const allDivs = r.querySelectorAll('div');
    let listContainer = null;
    for(const d of allDivs){
      if(d.children.length > 3 && d.innerText && d.innerText.includes(' : ')){
        if(d.innerText.length > 50) { listContainer = d; break; }
      }
    }
    if(!listContainer) return;

    const headers = [];
    listContainer.querySelectorAll('*').forEach(node=>{
      const txt = (node.innerText||'').split('\\n')[0]||'';
      if(txt.includes(' : ') && txt.length < 70 && !txt.includes('FT') && !txt.match(/\\d+\\s*\\(\\d+\\)/) && node.children.length <=3){
        if(txt.toUpperCase().includes('BRAZIL') || txt.toUpperCase().includes('COLOMBIA') || txt.toUpperCase().includes('EUROPE') || txt.toUpperCase().includes('ENGLAND') || txt.toUpperCase().includes('SPAIN') || txt.toUpperCase().includes('ITALY') || txt.toUpperCase().includes('FRANCE') || txt.toUpperCase().includes('GERMANY') || txt.toUpperCase().includes('NETHERLANDS') || txt.toUpperCase().includes('WORLD')){
          headers.push(node);
        }
      }
    });

    if(headers.length < 2) return;

    const groups = headers.map(h=>{
      const txt = h.innerText.split('\\n')[0].trim();
      return { el: h, text: txt, priority: getPriority(txt), parent: h.parentElement, next: [] };
    });

    // Collect matches after each header until next header
    groups.forEach((g, idx)=>{
      let sibling = g.el.nextElementSibling;
      const nextHeader = groups[idx+1]?.el;
      while(sibling && sibling !== nextHeader){
        g.next.push(sibling);
        sibling = sibling.nextElementSibling;
      }
    });

    const hasTopLeague = groups.some(g=> g.priority < 999);
    if(!hasTopLeague) return;

    groups.sort((a,b)=> a.priority - b.priority);

    // Re-append in sorted order
    const commonParent = groups[0].parent;
    if(!commonParent) return;
    
    groups.forEach(g=>{
      commonParent.appendChild(g.el);
      g.next.forEach(n=> commonParent.appendChild(n));
    });
  });
}

setInterval(paintAndPin, 800);
</script>
</body></html>`;
    return new Response(html, { headers: {"Content-Type":"text/html","Cache-Control":"no-cache"} });
  }
}
