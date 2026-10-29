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

<api-sports-widget data-type="config" data-key="98a19520b228fd8dcff8459b07f0d569" data-sport="football" data-theme="grey" data-show-logos="true" data-target-game="modal" data-target-team="modal" data-target-player="modal" data-timezone="Africa/Lagos" data-refresh="30"></api-sports-widget>

<div id="main">

<div class="sectionTitle">⭐ TOP 9 LEAGUES - ALWAYS ON TOP (Champions League, Europa, EPL, LaLiga, Ligue1, Bundesliga, Serie A, Eredivisie)</div>
<!-- TOP WIDGET -->
<api-sports-widget id="topWidget" data-type="games" data-show-toolbar="false" data-tab="all"></api-sports-widget>

<div class="sectionTitle">OTHER LEAGUES</div>
<!-- OTHER WIDGET -->
<api-sports-widget id="otherWidget" data-type="games" data-show-toolbar="true" data-tab="all"></api-sports-widget>

</div>

<div class="spacer"></div>
<div class="bottom"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>

<script>
const TOP = ["CHAMPIONS LEAGUE","EUROPA LEAGUE","CONFERENCE LEAGUE","PREMIER LEAGUE","LALIGA","LA LIGA","LIGUE 1","BUNDESLIGA","SERIE A","EREDIVISIE"];

function isTopLeague(text){
  const t = text.toUpperCase();
  return TOP.some(k => t.includes(k));
}

function paintAndFilter(){
  document.querySelectorAll('api-sports-widget').forEach(widget=>{
    const root = widget.shadowRoot;
    if(!root) return;
    
    if(!root.querySelector('#fix')){
      const s=document.createElement('style');
      s.id='fix';
      s.textContent=\`
        [class*="toolbar"]{background:#000 !important;border-bottom:2px solid #00ff66 !important}
        [class*="toolbar"] div{color:#00ff66 !important;font-weight:900 !important}
        [class*="tab"]{background:#000 !important;color:#00ff66 !important;border:1px solid #00ff66 !important;border-radius:8px !important}
        [class*="active"]{background:#00ff66 !important;color:#000 !important}
        [class*="game"]{background:#0a0a0a !important}
        [class*="score"]{color:#00ff66 !important}
      \`;
      root.appendChild(s);
    }

    const isTopWidget = widget.id === 'topWidget';
    const isOtherWidget = widget.id === 'otherWidget';

    // Find all league headers inside this widget
    const allElements = root.querySelectorAll('*');
    let currentGroupIsTop = false;
    let currentGroupShouldHide = false;

    allElements.forEach(el=>{
      const txt = (el.innerText||'').split('\\n')[0]||'';
      // Detect league header like "Colombia : Primera A" or "England : Premier League"
      if(txt.includes(' : ') && txt.length < 80 && !txt.match(/\\d+/) === false ? false : true){
        // More precise check: header usually has no FT and is short
        if(txt.length < 70 && !el.innerText.includes('FT') && txt.includes(' : ')){
          // Check if this looks like a league header (not a match)
          if(txt.toUpperCase().includes('COLOMBIA') || txt.toUpperCase().includes('BRAZIL') || txt.toUpperCase().includes('WORLD') || txt.toUpperCase().includes('ENGLAND') || txt.toUpperCase().includes('SPAIN') || txt.toUpperCase().includes('ITALY') || txt.toUpperCase().includes('FRANCE') || txt.toUpperCase().includes('GERMANY') || txt.toUpperCase().includes('NETHERLANDS') || txt.toUpperCase().includes('EUROPE') || txt.toUpperCase().includes('SURINAME')){
            const top = isTopLeague(txt);
            currentGroupIsTop = top;
            
            if(isTopWidget){
              // Top widget: HIDE if NOT top league
              if(!top){
                el.style.display = 'none';
                currentGroupShouldHide = true;
              } else {
                el.style.display = '';
                currentGroupShouldHide = false;
                // Sort priority - keep Champions League at very top by moving element to top
                el.parentElement?.appendChild(el);
              }
            }
            if(isOtherWidget){
              // Other widget: HIDE if it IS top league (because top already shows it)
              if(top){
                el.style.display = 'none';
                currentGroupShouldHide = true;
              } else {
                el.style.display = '';
                currentGroupShouldHide = false;
              }
            }
            return;
          }
        }
      }
      // If we are inside a hidden group (match belonging to hidden league), hide it too
      if(currentGroupShouldHide){
        // Check if this is a match element (has score)
        if(el.innerText && (el.innerText.includes('(0)') || el.innerText.includes('FT') || el.innerText.match(/\\d+\\s*\\(\\d+\\)/))){
          // Find its parent league container
          let parent = el;
          while(parent && parent !== root){
            if(parent.style.display === 'none'){
              break;
            }
            // Hide match rows that belong to hidden league header
            if(parent.parentElement && parent.parentElement.children.length > 2){
              // Hide the match row
              if(isTopWidget && !currentGroupIsTop) el.style.display = 'none';
              if(isOtherWidget && currentGroupIsTop) el.style.display = 'none';
            }
            parent = parent.parentElement;
          }
        }
      }
    });

    // Better approach: hide by checking previous league header
    let lastHeaderIsTop = null;
    let lastHeaderHidden = false;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let node;
    while(node = walker.nextNode()){
      const txt = (node.innerText||'').split('\\n')[0]||'';
      if(txt.includes(' : ') && txt.length < 70 && txt.includes(' : ') && !txt.match(/^\\s*\\d/)){
        if(txt.toUpperCase().includes(':')){
          const isTop = isTopLeague(txt);
          lastHeaderIsTop = isTop;
          if(isTopWidget){
            node.style.display = isTop ? '' : 'none';
            lastHeaderHidden = !isTop;
          } else if(isOtherWidget){
            node.style.display = isTop ? 'none' : '';
            lastHeaderHidden = isTop;
          }
          continue;
        }
      }
      // If this is a match row, hide based on last header
      if(lastHeaderHidden && node.textContent && node.textContent.length < 200){
        if(node.textContent.includes('FT') || node.textContent.match(/\\d+\\s*\\(\\d+\\)/) || node.textContent.includes('Once Caldas') || node.textContent.includes('Violette')){
          // This is likely a match, hide it if its league is hidden
          if(isTopWidget || isOtherWidget){
            // Don't hide too aggressively - only hide direct match containers
            if(node.parentElement && node.parentElement !== root){
              // Keep it simple: if last header was hidden, hide this element if it's a game row
              const style = window.getComputedStyle ? window.getComputedStyle(node) : null;
              if(node.children.length <= 5 && node.innerText && node.innerText.length < 100){
                node.style.display = 'none';
              }
            }
          }
        }
      }
    }
  });
}

// More aggressive filtering for top widget - sort order
function reorderTopWidget(){
  document.querySelectorAll('api-sports-widget#topWidget').forEach(widget=>{
    const root = widget.shadowRoot;
    if(!root) return;
    const priority = ["CHAMPIONS LEAGUE","EUROPA LEAGUE","CONFERENCE LEAGUE","PREMIER LEAGUE","LALIGA","LIGUE 1","BUNDESLIGA","SERIE A","EREDIVISIE"];
    function getPrio(t){ const up=t.toUpperCase(); for(let i=0;i<priority.length;i++){ if(up.includes(priority[i])) return i; } return 999; }
    
    // Find container with leagues
    let container = null;
    root.querySelectorAll('div').forEach(d=>{ if(d.children.length > 4 && d.innerText.includes(' : ')) container = d; });
    if(!container) return;
    
    const headers = [];
    container.querySelectorAll('*').forEach(n=>{
      const txt=(n.innerText||'').split('\\n')[0]||'';
      if(txt.includes(' : ') && txt.length<70 && (txt.toUpperCase().includes('EUROPE')||txt.toUpperCase().includes('ENGLAND')||txt.toUpperCase().includes('SPAIN')||txt.toUpperCase().includes('ITALY')||txt.toUpperCase().includes('FRANCE')||txt.toUpperCase().includes('GERMANY')||txt.toUpperCase().includes('NETHERLANDS'))){
        if(isTopLeague(txt)){
          headers.push({el:n, text:txt, prio:getPrio(txt)});
        }
      }
    });
    
    headers.sort((a,b)=>a.prio-b.prio);
    headers.forEach(h=>{
      if(h.el.parentElement){
        h.el.parentElement.appendChild(h.el);
        let sib = h.el.nextElementSibling;
        while(sib && !isTopLeague(sib.innerText||'')){
          const next = sib.nextElementSibling;
          if(sib.innerText && sib.innerText.length < 150) h.el.parentElement.appendChild(sib);
          if(next && next.innerText && next.innerText.includes(' : ') && next.innerText.length<70) break;
          sib = next;
        }
      }
    });
  });
}

setInterval(()=>{ paintAndFilter(); reorderTopWidget(); }, 800);
</script>
</body></html>`;
    return new Response(html, { headers: {"Content-Type":"text/html","Cache-Control":"no-cache"} });
  }
}
