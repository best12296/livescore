const MY_1XBET = "https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97";
export default {
  async fetch(request, env){
    const KEY = env.HIGHLIGHTLY_KEY || "afad9a68-c248-429b-8aa7-b7626bb56744";
    const url = new URL(request.url);
    if(url.pathname === "/api/highlightly"){
      const date = url.searchParams.get("date") || new Date().toISOString().split('T')[0];
      const r = await fetch("https://soccer.highlightly.net/matches?date="+date, { headers: { "x-rapidapi-key": KEY } });
      return new Response(await r.text(), { headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/highlights"){
      const r = await fetch("https://soccer.highlightly.net/highlights?matchId="+url.searchParams.get("id"), { headers: { "x-rapidapi-key": KEY } });
      return new Response(await r.text(), { headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND LIVESCORE</title>
<style>html,body{margin:0;background:#000;color:#fff;font-family:Arial}.top{display:flex;justify-content:center;padding:12px;background:#000;border-bottom:3px solid #00ff66;position:sticky;top:0;z-index:200}.logo{background:#00ff66;color:#000;padding:8px 28px;border-radius:8px;font-weight:900;font-style:italic}.bet{padding:10px}.bet a{background:#00ff66;color:#000;padding:13px;border-radius:10px;font-weight:900;text-decoration:none;text-align:center;display:block}.tabs{display:flex;gap:6px;padding:10px;background:#000;position:sticky;top:56px;z-index:150;border-bottom:2px solid #00ff66;overflow-x:auto}.tab{padding:8px 14px;border-radius:20px;font-weight:900;font-size:12px;white-space:nowrap;cursor:pointer;border:1.5px solid #00ff66}.tab-inactive{background:#000;color:#00ff66}.tab-active{background:#00ff66;color:#000}.sectionTitle{background:#00ff66;color:#000;padding:9px 10px;font-weight:900;font-size:12px;margin-top:2px}.league-header{background:#111;border-top:2.5px solid #00ff66;border-bottom:1px solid #00ff66;padding:10px 10px;display:flex;justify-content:space-between;align-items:center}.country-badge{background:#00ff66;color:#000;font-weight:900;font-size:10px;padding:3px 8px;border-radius:4px}.league-name{color:#00ff66;font-weight:900;font-size:12px;margin-left:8px}.league-count{color:#00ff66;font-weight:900;font-size:11px;background:#000;border:1px solid #00ff66;padding:2px 8px;border-radius:12px}.match{display:flex;justify-content:space-between;align-items:center;padding:11px 10px;background:#0a0a0a;border-bottom:1px solid #1a1a1a}.time-box{width:62px;text-align:center}.time-green{color:#00ff66;font-weight:900;font-size:13px}.time-live{color:#ff3b30;font-weight:900;font-size:13px;animation:blink 1s infinite}.time-ft{color:#fff;font-weight:900;font-size:13px}.team{font-size:13px}.score{color:#fff;font-weight:900;font-size:16px;text-align:center;min-width:50px;line-height:18px}.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2.5px solid #00ff66;z-index:9999}.bottom a{background:#00ff66;color:#000;padding:13px;border-radius:10px;font-weight:900;text-align:center;display:block;text-decoration:none}.spacer{height:90px}.loading{padding:20px;text-align:center;color:#00ff66}#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:none;overflow-y:auto}#modalTop{background:#000;border-bottom:2.5px solid #00ff66;padding:12px;position:sticky;top:0;display:flex;justify-content:space-between;align-items:center}.closeBtn{background:#00ff66;color:#000;border:none;padding:10px 18px;border-radius:8px;font-weight:900}.box{background:#0a0a0a;border:1px solid #1a1a1a;border-radius:10px;padding:10px;margin:8px}video{width:100%;border-radius:10px}.btnWatch{background:#111;color:#00ff66;border:1px solid #00ff66;padding:5px 10px;border-radius:6px;font-weight:900;font-size:11px}</style>
</head><body>
<div class="top"><span class="logo">DIAMOND LIVESCORE</span></div>
<div class="bet"><a href="${MY_1XBET}" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>
<div class="tabs"><div class="tab tab-inactive" onclick="setTab('yesterday')" id="tab-yesterday">YESTERDAY</div><div class="tab tab-active" onclick="setTab('today')" id="tab-today">TODAY</div><div class="tab tab-inactive" onclick="setTab('live')" id="tab-live">LIVE</div><div class="tab tab-inactive" onclick="setTab('finished')" id="tab-finished">FINISHED</div><div class="tab tab-inactive" onclick="refreshCurrent()" id="tab-refresh">REFRESH</div></div>
<div id="content"><div class="loading">Loading...</div></div>
<div id="modal"><div id="modalTop"><span style="color:#00ff66;font-weight:900">VIDEO HIGHLIGHTS</span><button class="closeBtn" onclick="closeModal()">X CLOSE</button></div><div id="modalContent"></div></div>
<div class="spacer"></div>
<div class="bottom"><a href="${MY_1XBET}" target="_blank">1XBET - BET NOW</a></div>
<script>
var CURRENT_TAB='today'; var ALL_MATCHES=[]; var TOP_LEAGUES=["serie a","premier league","laliga","la liga","bundesliga","ligue 1","eredivisie","champions league","europa league"];
function getDateStr(o){ var n=new Date(); n.setDate(n.getDate()+o); var l=new Date(n.toLocaleString('en-US',{timeZone:'Africa/Lagos'})); return l.getFullYear()+"-"+String(l.getMonth()+1).padStart(2,'0')+"-"+String(l.getDate()).padStart(2,'0'); }

function getScores(m){
  // CORRECT FIELD FROM DOCS: state.score.current = "3 - 1"
  try{
    var s = m.state?.score?.current || m.state?.score?.Current || m.state?.score || "";
    if(typeof s==='string' && s.indexOf('-')>-1){ var p=s.split('-'); return {h:p[0].trim(), a:p[1].trim()}; }
    // fallback old fields
    if(m.homeScore!=null && m.awayScore!=null) return {h:m.homeScore, a:m.awayScore};
    if(m.score && typeof m.score==='string' && m.score.indexOf('-')>-1){ var p2=m.score.split('-'); return {h:p2[0].trim(), a:p2[1].trim()}; }
    if(m.score?.home!=null) return {h:m.score.home, a:m.score.away};
    return {h:null, a:null};
  }catch(e){ return {h:null, a:null}; }
}
function getTimeInfo(m){
  var s=m.date||""; var stateDesc=(m.state?.description||m.status||m.matchStatus||"").toUpperCase(); var isLive=stateDesc.indexOf('LIVE')>-1||stateDesc.indexOf('FIRST HALF')>-1||stateDesc.indexOf('SECOND HALF')>-1||stateDesc.indexOf('HALF')>-1||m.state?.clock!=null && stateDesc.indexOf('FINISHED')==-1; var isFinished=stateDesc.indexOf('FINISHED')>-1||stateDesc.indexOf('FT')>-1;
  var clock=m.state?.clock; var display="-";
  try{ if(s){ var d=new Date(s); if(!isNaN(d.getTime())) display=d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'}); } }catch(e){}
  if(isFinished) display='FT'; else if(isLive){ display= clock!=null ? clock+"' LIVE" : 'LIVE'; }
  else if(m.state?.description){ display=m.state.description; if(display.length>10) display=display.slice(0,10); }
  return {display:display, isLive:isLive, isFinished:isFinished, ts: s ? new Date(s).getTime() : 0};
}
function setTab(t){ CURRENT_TAB=t; var els=document.querySelectorAll('[id^="tab-"]'); for(var i=0;i<els.length;i++){ if(els[i].id==='tab-refresh') continue; els[i].className='tab tab-inactive'; } document.getElementById('tab-'+t).className='tab tab-active'; if(t==='yesterday') loadDate(getDateStr(-1)); else if(t==='today') loadDate(getDateStr(0)); else render(); }
function refreshCurrent(){ var b=document.getElementById('tab-refresh'); b.textContent='LOADING...'; if(CURRENT_TAB==='yesterday') loadDate(getDateStr(-1)); else if(CURRENT_TAB==='today') loadDate(getDateStr(0)); else { render(); b.textContent='REFRESH'; } }
async function loadDate(dstr){
  document.getElementById('content').innerHTML='<div class="loading">Loading '+dstr+'...</div>';
  try{ var res=await fetch('/api/highlightly?date='+dstr); var data=await res.json(); ALL_MATCHES=data.data||data.matches||[]; if(!Array.isArray(ALL_MATCHES)) ALL_MATCHES=[]; console.log('RAW SAMPLE', ALL_MATCHES[0]); render(); }catch(e){ document.getElementById('content').innerHTML='<div class="loading">Error '+e.message+'</div>'; }
  document.getElementById('tab-refresh').textContent='REFRESH';
}
function render(){
  var filtered=ALL_MATCHES; if(CURRENT_TAB==='live') filtered=ALL_MATCHES.filter(function(m){ return getTimeInfo(m).isLive; }); if(CURRENT_TAB==='finished') filtered=ALL_MATCHES.filter(function(m){ return getTimeInfo(m).isFinished; });
  if(filtered.length===0){ document.getElementById('content').innerHTML='<div class="loading">No '+CURRENT_TAB.toUpperCase()+' matches.</div>'; return; }
  var topGroups={}, otherGroups={};
  filtered.forEach(function(m){ var ln=(m.league?.name||m.competition?.name||"Unknown").trim(); var cn=(m.country?.name||m.league?.country||m.country||"World"); if(typeof cn!=='string') cn=cn.name||"World"; cn=cn.trim(); var key=(cn+"|"+ln).toUpperCase(); var isTop=false; for(var i=0;i<TOP_LEAGUES.length;i++){ if(ln.toLowerCase().indexOf(TOP_LEAGUES[i])>-1){ isTop=true; break; } } var tgt=isTop?topGroups:otherGroups; if(!tgt[key]) tgt[key]={country:cn, league:ln, games:[]}; tgt[key].games.push(m); });
  var html=''; if(Object.keys(topGroups).length>0){ html+='<div class="sectionTitle">TOP 9 LEAGUES - Always On Top</div>'+renderGroups(topGroups); } if(Object.keys(otherGroups).length>0){ html+='<div class="sectionTitle">OTHER LEAGUES</div>'+renderGroups(otherGroups); }
  document.getElementById('content').innerHTML=html;
}
function renderGroups(groups){
  var out=''; Object.values(groups).forEach(function(g){
    g.games.sort(function(a,b){ return getTimeInfo(a).ts - getTimeInfo(b).ts; });
    out+='<div class="league-header"><div style="display:flex;align-items:center"><span class="country-badge">'+g.country.toUpperCase()+'</span><span class="league-name">'+g.league.toUpperCase()+'</span></div><span class="league-count">'+g.games.length+'</span></div>';
    g.games.forEach(function(m){
      var home=m.homeTeam?.name||m.home?.name||"Home"; var away=m.awayTeam?.name||m.away?.name||"Away"; var ti=getTimeInfo(m); var sc=getScores(m);
      var scoreHtml='';
      if(sc.h!=null && sc.a!=null){ scoreHtml='<span style="color:#fff">'+sc.h+'</span><br><span style="color:#fff">'+sc.a+'</span>'; }
      else if(ti.isFinished){ scoreHtml='<span style="color:#fff;font-size:12px">FT</span>'; }
      else { scoreHtml='<span style="color:#00ff66">-</span><br><span style="color:#00ff66">-</span>'; }
      var timeClass='time-green'; if(ti.isLive) timeClass='time-live'; if(ti.isFinished) timeClass='time-ft';
      out+='<div class="match"><div class="time-box"><div class="'+timeClass+'">'+ti.display+'</div></div><div style="flex:1;margin-left:10px"><div class="team">'+home+'</div><div class="team" style="margin-top:4px;color:#aaa">'+away+'</div></div><div class="score">'+scoreHtml+'</div><div style="margin-left:8px"><button class="btnWatch" onclick="openMatch(\\''+m.id+'\\',\\''+home.replace(/'/g,"")+' vs '+away.replace(/'/g,"")+'\\')">VIDEO</button></div></div>';
    });
  }); return out;
}
async function openMatch(id, title){
  document.getElementById('modal').style.display='block';
  document.getElementById('modalContent').innerHTML='<div class="box"><b style="color:#00ff66">'+title+'</b><br><a href="${MY_1XBET}" target="_blank" style="background:#00ff66;color:#000;padding:12px;border-radius:8px;font-weight:900;display:block;text-align:center;text-decoration:none;margin-top:8px">BET NOW - 1XBET</a></div><div class="loading">Loading video...</div>';
  try{
    var res=await fetch('/api/highlights?id='+id); var data=await res.json(); var vids=data.data||data.highlights||data||[]; if(!Array.isArray(vids)) vids=[vids];
    var html='<div class="box"><b>'+title+'</b></div>'; var found=false;
    vids.forEach(function(v){ var u=v.url||v.videoUrl||v.link||''; var t=v.title||'Highlights'; if(u){ found=true; if(u.indexOf('youtube')>-1||u.indexOf('youtu.be')>-1){ var e=u; if(u.indexOf('watch?v=')>-1) e=u.replace('watch?v=','embed/'); html+='<div class="box"><div style="color:#00ff66;font-weight:900">'+t+'</div><iframe src="'+e+'" style="width:100%;height:220px;border:none;border-radius:10px" allowfullscreen></iframe></div>'; } else { html+='<div class="box"><div style="color:#00ff66;font-weight:900">'+t+'</div><video controls src="'+u+'"></video></div>'; } } });
    if(!found) html+='<div class="box">No video yet. Highlightly uploads 10-30 mins after FT.</div>';
    document.getElementById('modalContent').innerHTML=html;
  }catch(e){ document.getElementById('modalContent').innerHTML='<div class="box">Error '+e.message+'</div>'; }
}
function closeModal(){ document.getElementById('modal').style.display='none'; }
loadDate(getDateStr(0));
</script>
</body></html>`;
    return new Response(html, { headers: {"Content-Type":"text/html","Cache-Control":"no-cache"} });
  }
}
