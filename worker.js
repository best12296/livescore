export default {
  async fetch(request, env){
    const HIGHLIGHTLY_KEY = env.HIGHLIGHTLY_KEY || "afad9a68-c248-429b-8aa7-b7626bb56744";
    const url = new URL(request.url);

    if(url.pathname === "/api/highlightly"){
      const date = url.searchParams.get("date") || new Date().toISOString().split('T')[0];
      const r = await fetch(`https://soccer.highlightly.net/matches?date=${date}`, {
        headers: { "x-rapidapi-key": HIGHLIGHTLY_KEY }
      });
      return new Response(await r.text(), { headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }

    if(url.pathname === "/api/highlights"){
      const id = url.searchParams.get("id");
      const r = await fetch(`https://soccer.highlightly.net/highlights?matchId=${id}`, {
        headers: { "x-rapidapi-key": HIGHLIGHTLY_KEY }
      });
      return new Response(await r.text(), { headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }

    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DIAMOND LIVESCORE - HIGHLIGHTLY ONLY</title>
<style>
html,body{margin:0;background:#000;color:#fff;font-family:Arial}
.top{background:#000;display:flex;justify-content:center;padding:12px;border-bottom:2px solid #00ff66;position:sticky;top:0;z-index:100}
.logo{background:#00ff66;color:#000;padding:6px 22px;border-radius:6px;font-weight:900;font-style:italic}
.bet{padding:10px;background:#000}
.bet a{background:#00ff66;color:#000;padding:12px;border-radius:10px;font-weight:900;text-decoration:none;text-align:center;display:block}
.sectionTitle{background:#00ff66;color:#000;padding:8px;font-weight:900;font-size:13px}
.league{background:#111;color:#00ff66;padding:10px 8px;font-weight:900;font-size:13px;border-top:2px solid #00ff66;display:flex;justify-content:space-between}
.match{display:flex;justify-content:space-between;align-items:center;padding:10px 8px;background:#0a0a0a;border-bottom:1px solid #151515;cursor:pointer}
.team{display:flex;align-items:center;gap:6px;font-size:13px}
.score{color:#00ff66;font-weight:900;text-align:right}
.status{color:#00ff66;font-size:11px;font-weight:900;width:42px}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2px solid #00ff66;z-index:9999}
.bottom a{background:#00ff66;color:#000;padding:12px;border-radius:10px;font-weight:900;text-align:center;display:block;text-decoration:none}
.spacer{height:90px}
.loading{padding:20px;text-align:center;color:#00ff66}
#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:none;overflow-y:auto}
#modalTop{background:#000;border-bottom:2px solid #00ff66;padding:10px;position:sticky;top:0;display:flex;justify-content:space-between;align-items:center}
.closeBtn{background:#00ff66;color:#000;border:none;padding:10px 18px;border-radius:8px;font-weight:900}
.box{background:#0a0a0a;border:1px solid #151515;border-radius:10px;padding:10px;margin:8px}
video{width:100%;border-radius:10px}
</style>
</head><body>
<div class="top"><span class="logo">DIAMOND LIVESCORE</span></div>
<div class="bet"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>
<div id="main">
<div class="sectionTitle">⭐ TOP 9 LEAGUES - Today (Serie A Frosinone vs Lecce go show here)</div>
<div id="topLeagues"><div class="loading">Loading Top 9 from Highlightly...</div></div>
<div class="sectionTitle">OTHER LEAGUES</div>
<div id="otherLeagues"><div class="loading">Loading...</div></div>
<div class="sectionTitle">🔥 VIDEO HIGHLIGHTS</div>
<div id="highlights"><div class="loading">Loading highlights...</div></div>
</div>
<div id="modal"><div id="modalTop"><span style="color:#00ff66;font-weight:900">MATCH + VIDEO</span><button class="closeBtn" onclick="closeModal()">X CLOSE</button></div><div id="modalContent"></div></div>
<div class="spacer"></div>
<div class="bottom"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET - BET NOW</a></div>
<script>
const TOP_KEYWORDS = ["champions league","europa league","conference league","premier league","laliga","la liga","ligue 1","bundesliga","serie a","eredivisie"];
function formatDate(){const tz=new Date().toLocaleString('en-GB',{timeZone:'Africa/Lagos'});const p=tz.split(',')[0].split('/');return \`\${p[2]}-\${p[1].padStart(2,'0')}-\${p[0].padStart(2,'0')}\`;}
async function loadAll(){
  const date=formatDate();
  const res=await fetch('/api/highlightly?date='+date);
  const data=await res.json();
  const matches=data.data||data.matches||data.response||data||[];
  if(!Array.isArray(matches) || matches.length===0){
    document.getElementById('topLeagues').innerHTML='<div class="loading">No matches today. Response: '+(JSON.stringify(data).slice(0,300))+'</div>';
    return;
  }
  const top=[]; const other=[];
  matches.forEach(m=>{
    const leagueName=(m.league?.name||m.competition?.name||'').toLowerCase();
    const isTop=TOP_KEYWORDS.some(k=>leagueName.includes(k));
    if(isTop) top.push(m); else other.push(m);
  });
  // TOP
  let html=''; const groups={};
  top.forEach(m=>{ const ln=m.league?.name||m.competition?.name||'Top League'; if(!groups[ln])groups[ln]=[]; groups[ln].push(m); });
  Object.entries(groups).forEach(([ln,games])=>{
    html+=\`<div class="league"><span>\${ln.toUpperCase()}</span><span>\${games.length}</span></div>\`;
    games.forEach(match=>{
      const home=match.homeTeam?.name||match.home?.name||'Home'; const away=match.awayTeam?.name||match.away?.name||'Away';
      const hs=match.homeScore??'-'; const as=match.awayScore??'-'; const time=match.time||match.status||'NS';
      html+=\`<div class="match" onclick="openMatch('\${match.id}')"><div style="flex:1"><div class="team"><span class="status">\${time}</span><span>\${home}</span></div><div class="team"><span class="status"></span><span>\${away}</span></div></div><div class="score">\${hs}<br>\${as}</div></div>\`;
    });
  });
  document.getElementById('topLeagues').innerHTML=html||'<div class="loading">No Top 9 today - Flashscore show Serie A 18:30 Frosinone-Lecce go appear later</div>';
  // OTHER
  let html2=''; const groups2={};
  other.forEach(m=>{ const ln=m.league?.name||m.competition?.name||'League'; if(!groups2[ln])groups2[ln]=[]; groups2[ln].push(m); });
  Object.entries(groups2).forEach(([ln,games])=>{
    html2+=\`<div class="league"><span>\${ln.toUpperCase()}</span><span>\${games.length}</span></div>\`;
    games.forEach(match=>{
      const home=match.homeTeam?.name||'Home'; const away=match.awayTeam?.name||'Away'; const hs=match.homeScore??'-'; const as=match.awayScore??'-'; const time=match.time||'NS';
      html2+=\`<div class="match" onclick="openMatch('\${match.id}')"><div style="flex:1"><div class="team"><span class="status">\${time}</span><span>\${home}</span></div><div class="team"><span class="status"></span><span>\${away}</span></div></div><div class="score">\${hs}<br>\${as}</div></div>\`;
    });
  });
  document.getElementById('otherLeagues').innerHTML=html2||'<div class="loading">No other leagues today.</div>';
  // HIGHLIGHTS
  let hHtml=''; matches.slice(0,10).forEach(m=>{
    const home=m.homeTeam?.name||'Home'; const away=m.awayTeam?.name||'Away';
    hHtml+=\`<div class="box"><b>\${home} vs \${away}</b><br><button onclick="openMatch('\${m.id}')" style="background:#00ff66;color:#000;border:none;padding:8px 12px;border-radius:6px;font-weight:900;margin-top:6px">▶ WATCH HIGHLIGHTS</button></div>\`;
  });
  document.getElementById('highlights').innerHTML=hHtml;
}
async function openMatch(id){
  document.getElementById('modal').style.display='block';
  document.getElementById('modalContent').innerHTML='<div class="loading">Loading highlights...</div>';
  try{
    const res=await fetch('/api/highlights?id='+id); const data=await res.json();
    const vids=data.data||data.highlights||data||[];
    let html='<div class="box">Match ID: '+id+'</div>';
    if(Array.isArray(vids) && vids.length>0){
      vids.forEach(v=>{ const url=v.url||v.videoUrl||''; if(url) html+=\`<div class="box"><video controls src="\${url}"></video><br><b>\${v.title||'Highlight'}</b></div>\`; });
    } else {
      html+='<div class="box">No video yet. Frosinone vs Lecce 18:30 never finish, video go appear after.</div>';
    }
    document.getElementById('modalContent').innerHTML=html;
  }catch(e){ document.getElementById('modalContent').innerHTML='Error: '+e.message; }
}
function closeModal(){document.getElementById('modal').style.display='none';}
loadAll();
</script>
</body></html>`;
    return new Response(html, { headers: {"Content-Type":"text/html","Cache-Control":"no-cache"} });
  }
}
