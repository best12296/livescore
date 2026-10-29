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
      const q = url.searchParams.toString();
      const r = await fetch("https://soccer.highlightly.net/highlights"+(q?"?"+q:""), { headers: { "x-rapidapi-key": KEY } });
      return new Response(await r.text(), { headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/match"){
      const r = await fetch("https://soccer.highlightly.net/matches/"+url.searchParams.get("id"), { headers: { "x-rapidapi-key": KEY } });
      return new Response(await r.text(), { headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/events"){
      const r = await fetch("https://soccer.highlightly.net/events/"+url.searchParams.get("id"), { headers: { "x-rapidapi-key": KEY } });
      return new Response(await r.text(), { headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/standings"){
      const league = url.searchParams.get("leagueName") || url.searchParams.get("league") || "Serie A";
      const season = url.searchParams.get("season") || "2024";
      // Try both endpoints - soccer.highlightly.net/standings and /leagues
      let r = await fetch(`https://soccer.highlightly.net/standings?leagueName=${encodeURIComponent(league)}&season=${season}`, { headers: { "x-rapidapi-key": KEY } });
      if(!r.ok){
        r = await fetch(`https://soccer.highlightly.net/leagues?leagueName=${encodeURIComponent(league)}`, { headers: { "x-rapidapi-key": KEY } });
      }
      return new Response(await r.text(), { headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND LIVESCORE</title>
<style>
html,body{margin:0;background:#000;color:#fff;font-family:Arial}
.top{display:flex;justify-content:center;padding:12px;background:#000;border-bottom:3px solid #00ff66;position:sticky;top:0;z-index:200}
.logo{background:#00ff66;color:#000;padding:8px 28px;border-radius:8px;font-weight:900;font-style:italic}
.bet{padding:10px}.bet a{background:#00ff66;color:#000;padding:13px;border-radius:10px;font-weight:900;text-decoration:none;text-align:center;display:block}
.tabs{display:flex;gap:6px;padding:10px;background:#000;position:sticky;top:56px;z-index:150;border-bottom:2px solid #00ff66;overflow-x:auto}
.tab{padding:8px 14px;border-radius:20px;font-weight:900;font-size:12px;white-space:nowrap;cursor:pointer;border:1.5px solid #00ff66}
.tab-inactive{background:#000;color:#00ff66}.tab-active{background:#00ff66;color:#000}
.sectionTitle{background:#00ff66;color:#000;padding:9px 10px;font-weight:900;font-size:12px;margin-top:2px}
.league-header{background:#111;border-top:2.5px solid #00ff66;border-bottom:1px solid #00ff66;padding:10px 10px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}
.league-header:hover{background:#1a1a1a}
.country-badge{background:#00ff66;color:#000;font-weight:900;font-size:10px;padding:3px 8px;border-radius:4px}
.league-name{color:#00ff66;font-weight:900;font-size:12px;margin-left:8px}
.league-count{color:#00ff66;font-weight:900;font-size:11px;background:#000;border:1px solid #00ff66;padding:2px 8px;border-radius:12px}
.match{display:flex;justify-content:space-between;align-items:center;padding:11px 10px;background:#0a0a0a;border-bottom:1px solid #1a1a1a;cursor:pointer}
.match:hover{background:#151515}
.time-box{width:72px;text-align:center}
.time-green{color:#00ff66;font-weight:900;font-size:13px}.time-live{color:#ff3b30;font-weight:900;font-size:13px}.time-ft{color:#fff;font-weight:900;font-size:13px}
.team{font-size:13px}.score{color:#fff;font-weight:900;font-size:16px;text-align:center;min-width:50px;line-height:18px}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2.5px solid #00ff66;z-index:9999}.bottom a{background:#00ff66;color:#000;padding:13px;border-radius:10px;font-weight:900;text-align:center;display:block;text-decoration:none}
.spacer{height:90px}.loading{padding:20px;text-align:center;color:#00ff66}
#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:none;overflow-y:auto}
#modalTop{background:#000;border-bottom:2.5px solid #00ff66;padding:12px;position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;z-index:10}
.closeBtn{background:#00ff66;color:#000;border:none;padding:10px 18px;border-radius:8px;font-weight:900}
.box{background:#0a0a0a;border:1px solid #222;border-radius:10px;padding:12px;margin:8px}
.detailScore{font-size:32px;font-weight:900;color:#fff;text-align:center}
.detailLeague{color:#00ff66;font-weight:900;text-align:center;font-size:12px;margin:4px}
.btnBet{background:#00ff66;color:#000;padding:13px;border-radius:10px;font-weight:900;display:block;text-align:center;text-decoration:none;margin:8px}
.btnWatch{background:#111;color:#00ff66;border:1px solid #00ff66;padding:5px 10px;border-radius:6px;font-weight:900;font-size:11px}
.btnStandings{background:#00ff66;color:#000;border:none;padding:6px 12px;border-radius:6px;font-weight:900;font-size:11px;margin-left:6px}
video{width:100%;border-radius:10px;background:#000}
.eventRow{display:flex;gap:8px;padding:6px 0;border-bottom:1px solid #1a1a1a;font-size:12px}
.eventTime{color:#00ff66;font-weight:900;width:36px}
/* STANDINGS TABLE */
table.standings{width:100%;border-collapse:collapse;font-size:12px}
table.standings th{background:#00ff66;color:#000;padding:8px 4px;font-weight:900;text-align:center}
table.standings td{padding:8px 4px;border-bottom:1px solid #1a1a1a;text-align:center}
table.standings td.teamCell{text-align:left;color:#fff;font-weight:700}
.standingsPos{color:#00ff66;font-weight:900}
</style>
</head><body>
<div class="top"><span class="logo">DIAMOND LIVESCORE</span></div>
<div class="bet"><a href="${MY_1XBET}" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>
<div class="tabs">
<div class="tab tab-inactive" onclick="setTab('yesterday')" id="tab-yesterday">YESTERDAY</div>
<div class="tab tab-active" onclick="setTab('today')" id="tab-today">TODAY</div>
<div class="tab tab-inactive" onclick="setTab('live')" id="tab-live">LIVE</div>
<div class="tab tab-inactive" onclick="setTab('finished')" id="tab-finished">FINISHED</div>
<div class="tab tab-inactive" onclick="loadStandings('Serie A')" id="tab-standings">TABLE</div>
<div class="tab tab-inactive" onclick="refreshCurrent()" id="tab-refresh">REFRESH</div>
</div>
<div id="content"><div class="loading">Loading...</div></div>
<div id="modal"><div id="modalTop"><span style="color:#00ff66;font-weight:900" id="modalTitle">MATCH DETAILS</span><button class="closeBtn" onclick="closeModal()">X CLOSE</button></div><div id="modalContent"></div></div>
<div class="spacer"></div>
<div class="bottom"><a href="${MY_1XBET}" target="_blank">1XBET - BET NOW</a></div>
<script>
var CURRENT_TAB='today'; var ALL_MATCHES=[]; var TOP_LEAGUES=["serie a","premier league","laliga","la liga","bundesliga","ligue 1","eredivisie","champions league","europa league"];
function getDateStr(o){ var n=new Date(); n.setDate(n.getDate()+o); var l=new Date(n.toLocaleString('en-US',{timeZone:'Africa/Lagos'})); return l.getFullYear()+"-"+String(l.getMonth()+1).padStart(2,'0')+"-"+String(l.getDate()).padStart(2,'0'); }
function getScores(m){ try{ var s=m.state?.score?.current||""; if(typeof s==='string' && s.indexOf('-')>-1){ var p=s.split('-'); return {h:p[0].trim(), a:p[1].trim()}; } return {h:null, a:null}; }catch(e){ return {h:null, a:null}; } }
function getTimeInfo(m){ var s=m.date||""; var desc=(m.state?.description||m.status||"").toUpperCase(); var isFin=desc.indexOf('FINISHED')>-1; var isLive=desc.indexOf('HALF')>-1||desc.indexOf('LIVE')>-1; var clock=m.state?.clock; var timeStr="-"; try{ if(s){ var dt=new Date(s); if(!isNaN(dt.getTime())) timeStr=dt.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'}); } }catch(e){} var display=timeStr; if(isFin) display='FT'; else if(isLive) display= clock!=null ? clock+"' LIVE" : 'LIVE'; return {display:display, isLive:isLive, isFinished:isFin, ts: s ? new Date(s).getTime():0, desc: m.state?.description||"", clock: clock, rawDate: s}; }
function setTab(t){ CURRENT_TAB=t; var els=document.querySelectorAll('[id^="tab-"]'); for(var i=0;i<els.length;i++){ if(els[i].id==='tab-refresh'||els[i].id==='tab-standings') continue; els[i].className='tab tab-inactive'; } document.getElementById('tab-'+t).className='tab tab-active'; document.getElementById('tab-standings').className='tab tab-inactive'; if(t==='yesterday') loadDate(getDateStr(-1)); else if(t==='today') loadDate(getDateStr(0)); else render(); }
function refreshCurrent(){ var b=document.getElementById('tab-refresh'); b.textContent='LOADING...'; if(CURRENT_TAB==='yesterday') loadDate(getDateStr(-1)); else if(CURRENT_TAB==='today') loadDate(getDateStr(0)); else { render(); b.textContent='REFRESH'; } }
async function loadDate(dstr){ document.getElementById('content').innerHTML='<div class="loading">Loading '+dstr+'...</div>'; try{ var res=await fetch('/api/highlightly?date='+dstr); var data=await res.json(); ALL_MATCHES=data.data||data.matches||[]; if(!Array.isArray(ALL_MATCHES)) ALL_MATCHES=[]; render(); }catch(e){ document.getElementById('content').innerHTML='<div class="loading">Error '+e.message+'</div>'; } document.getElementById('tab-refresh').textContent='REFRESH'; }
function render(){ var f=ALL_MATCHES; if(CURRENT_TAB==='live') f=ALL_MATCHES.filter(function(m){ return getTimeInfo(m).isLive; }); if(CURRENT_TAB==='finished') f=ALL_MATCHES.filter(function(m){ return getTimeInfo(m).isFinished; }); if(f.length===0){ document.getElementById('content').innerHTML='<div class="loading">No '+CURRENT_TAB.toUpperCase()+' matches.</div>'; return; } var top={}, other={}; f.forEach(function(m){ var ln=(m.league?.name||"Unknown").trim(); var cn=(m.country?.name||m.league?.country||"World"); if(typeof cn!=='string') cn=cn.name||"World"; cn=cn.trim(); var key=(cn+"|"+ln).toUpperCase(); var isTop=false; for(var i=0;i<TOP_LEAGUES.length;i++){ if(ln.toLowerCase().indexOf(TOP_LEAGUES[i])>-1){ isTop=true; break; } } var tgt=isTop?top:other; if(!tgt[key]) tgt[key]={country:cn, league:ln, games:[]}; tgt[key].games.push(m); }); var html=''; if(Object.keys(top).length>0){ html+='<div class="sectionTitle">TOP 9 LEAGUES - Always On Top</div>'+renderGroups(top); } if(Object.keys(other).length>0){ html+='<div class="sectionTitle">OTHER LEAGUES</div>'+renderGroups(other); } document.getElementById('content').innerHTML=html; }
function renderGroups(g){ var out=''; Object.values(g).forEach(function(gr){ gr.games.sort(function(a,b){ return getTimeInfo(a).ts - getTimeInfo(b).ts; }); out+='<div class="league-header" onclick="loadStandings(\\''+gr.league.replace(/'/g,"")+'\\')"><div style="display:flex;align-items:center"><span class="country-badge">'+gr.country.toUpperCase()+'</span><span class="league-name">'+gr.league.toUpperCase()+'</span></div><div><span class="league-count">'+gr.games.length+'</span><button class="btnStandings">TABLE</button></div></div>'; gr.games.forEach(function(m){ var h=m.homeTeam?.name||"Home"; var a=m.awayTeam?.name||"Away"; var ti=getTimeInfo(m); var sc=getScores(m); var scoreHtml=''; if(sc.h!=null) scoreHtml='<span style="color:#fff">'+sc.h+'</span><br><span style="color:#fff">'+sc.a+'</span>'; else if(ti.isFinished) scoreHtml='FT'; else scoreHtml='<span style="color:#00ff66">-</span><br><span style="color:#00ff66">-</span>'; var tc='time-green'; if(ti.isLive) tc='time-live'; if(ti.isFinished) tc='time-ft'; out+='<div class="match" onclick="openDetails(\\''+m.id+'\\')"><div class="time-box"><div class="'+tc+'">'+ti.display+'</div></div><div style="flex:1;margin-left:10px"><div class="team">'+h+'</div><div class="team" style="margin-top:4px;color:#aaa">'+a+'</div></div><div class="score">'+scoreHtml+'</div><div style="margin-left:8px"><button class="btnWatch" onclick="event.stopPropagation(); openVideoOnly(\\''+m.id+'\\',\\''+h.replace(/'/g,"")+' vs '+a.replace(/'/g,"")+'\\')">VIDEO</button></div></div>'; }); }); return out; }

// STANDINGS FUNCTION
async function loadStandings(leagueName){
  var tabs=document.querySelectorAll('.tab'); for(var i=0;i<tabs.length;i++) tabs[i].className='tab tab-inactive';
  document.getElementById('tab-standings').className='tab tab-active';
  document.getElementById('content').innerHTML='<div class="loading">Loading standings for '+leagueName+'...</div>';
  try{
    var res=await fetch('/api/standings?leagueName='+encodeURIComponent(leagueName));
    var data=await res.json();
    var table = data.data || data.standings || data || [];
    if(!Array.isArray(table) && table.standings) table = table.standings;
    if(!Array.isArray(table) && table.groups) table = table.groups[0]?.standings || [];
    if(table.length===0){
      document.getElementById('content').innerHTML='<div class="box">No standings for '+leagueName+'. Try: <br><br><button class="btnStandings" onclick="loadStandings(\\'Premier League\\')">Premier League</button> <button class="btnStandings" onclick="loadStandings(\\'Serie A\\')">Serie A</button> <button class="btnStandings" onclick="loadStandings(\\'La Liga\\')">La Liga</button> <button class="btnStandings" onclick="loadStandings(\\'Bundesliga\\')">Bundesliga</button></div><a href="${MY_1XBET}" target="_blank" class="btnBet">BET NOW</a>';
      return;
    }
    var html='<div class="sectionTitle">'+leagueName.toUpperCase()+' - STANDINGS</div>';
    html+='<div style="padding:6px;display:flex;gap:6px;overflow-x:auto"><button class="btnStandings" onclick="loadStandings(\\'Premier League\\')">EPL</button><button class="btnStandings" onclick="loadStandings(\\'Serie A\\')">SERIE A</button><button class="btnStandings" onclick="loadStandings(\\'La Liga\\')">LA LIGA</button><button class="btnStandings" onclick="loadStandings(\\'Bundesliga\\')">BUNDESLIGA</button><button class="btnStandings" onclick="loadStandings(\\'Ligue 1\\')">LIGUE 1</button></div>';
    html+='<div class="box" style="padding:0;overflow-x:auto"><table class="standings"><tr><th>#</th><th style="text-align:left">TEAM</th><th>P</th><th>W</th><th>D</th><th>L</th><th>PTS</th></tr>';
    table.forEach(function(row, idx){
      var pos = row.position || row.rank || (idx+1);
      var team = row.team?.name || row.teamName || row.name || "Team";
      var played = row.played || row.matches || row.P || 0;
      var won = row.won || row.W || 0;
      var drawn = row.drawn || row.D || row.draw || 0;
      var lost = row.lost || row.L || 0;
      var pts = row.points || row.pts || row.PTS || 0;
      html+='<tr><td class="standingsPos">'+pos+'</td><td class="teamCell">'+team+'</td><td>'+played+'</td><td>'+won+'</td><td>'+drawn+'</td><td>'+lost+'</td><td style="color:#00ff66;font-weight:900">'+pts+'</td></tr>';
    });
    html+='</table></div><a href="${MY_1XBET}" target="_blank" class="btnBet">BET ON '+leagueName.toUpperCase()+' - 1XBET BONUS 300%</a>';
    document.getElementById('content').innerHTML=html;
  }catch(e){
    document.getElementById('content').innerHTML='<div class="box">Error loading standings: '+e.message+'<br><br>This league may need PRO plan. But try:<br><button class="btnStandings" onclick="loadStandings(\\'Premier League\\')">EPL</button> <button class="btnStandings" onclick="loadStandings(\\'Serie A\\')">Serie A</button></div>';
  }
}

async function openDetails(id){
  document.getElementById('modal').style.display='block';
  document.getElementById('modalTitle').textContent='MATCH DETAILS';
  document.getElementById('modalContent').innerHTML='<div class="loading">Loading '+id+'...</div>';
  try{
    var [matchRes, highRes, eventsRes] = await Promise.all([ fetch('/api/match?id='+id), fetch('/api/highlights?id='+id), fetch('/api/events?id='+id) ]);
    var matchData = await matchRes.json(); var highData = await highRes.json(); var eventsData = await eventsRes.json();
    var m = matchData.data||matchData||{}; if(Array.isArray(m)) m=m[0]||{};
    var home=m.homeTeam?.name||"Home"; var away=m.awayTeam?.name||"Away";
    var league=m.league?.name||"Unknown"; var country=m.country?.name||"";
    var ti=getTimeInfo(m); var sc=getScores(m);
    var scoreBig = sc.h!=null ? sc.h+" - "+sc.a : ti.display;
    var html='<div class="box"><div class="detailLeague">'+country.toUpperCase()+' - '+league.toUpperCase()+'</div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px"><div style="flex:1;text-align:center"><b>'+home+'</b></div><div style="text-align:center"><div class="detailScore">'+scoreBig+'</div><div style="color:'+(ti.isLive?'#ff3b30':'#00ff66')+';font-weight:900;font-size:12px;margin-top:4px">'+ti.display+' '+(ti.desc||'')+'</div></div><div style="flex:1;text-align:center"><b>'+away+'</b></div></div></div>';
    html+='<div style="display:flex;gap:6px;margin:8px"><a href="${MY_1XBET}" target="_blank" class="btnBet" style="flex:1">BET NOW</a><button class="btnBet" style="flex:1;background:#111;color:#00ff66;border:1px solid #00ff66" onclick="loadStandings(\\''+league.replace(/'/g,"")+'\\'); closeModal();">VIEW TABLE</button></div>';
    var vids=highData.data||highData.highlights||highData||[]; if(!Array.isArray(vids)) vids=[vids];
    html+='<div class="box"><b style="color:#00ff66">VIDEO HIGHLIGHTS</b></div>';
    var found=false;
    vids.forEach(function(v){ var u=v.url||v.videoUrl||''; if(u){ found=true; var e=u; if(u.indexOf('watch?v=')>-1) e=u.replace('watch?v=','embed/'); html+='<div class="box"><iframe src="'+e+'" style="width:100%;height:220px;border:none;border-radius:10px" allowfullscreen></iframe></div>'; } });
    if(!found) html+='<div class="box">No video yet. <a href="https://www.youtube.com/results?search_query='+encodeURIComponent(home+' vs '+away+' highlights')+'" target="_blank" style="color:#00ff66">Search YouTube</a><br><br><iframe width="100%" height="200" src="https://www.youtube.com/embed?listType=search&list='+encodeURIComponent(home+' vs '+away+' highlights')+'" style="border:none;border-radius:10px" allowfullscreen></iframe></div>';
    var events = eventsData.data||eventsData.events||[]; if(!Array.isArray(events)) events=[events];
    if(events.length>0){ html+='<div class="box"><b style="color:#00ff66">MATCH EVENTS</b></div><div class="box">'; events.forEach(function(ev){ var time=ev.time||ev.minute||''; var type=ev.type||''; var player=ev.player||''; var team=ev.team?.name||''; html+='<div class="eventRow"><div class="eventTime">'+time+'\\'</div><div><b style="color:#00ff66">'+type+'</b> - '+player+' <span style="color:#aaa">('+team+')</span></div></div>'; }); html+='</div>'; }
    html+='<a href="${MY_1XBET}" target="_blank" class="btnBet">BET AGAIN - 300% BONUS</a>';
    document.getElementById('modalContent').innerHTML=html;
  }catch(e){ document.getElementById('modalContent').innerHTML='<div class="box">Error '+e.message+'</div>'; }
}
async function openVideoOnly(id, title){ document.getElementById('modal').style.display='block'; document.getElementById('modalTitle').textContent='VIDEO'; document.getElementById('modalContent').innerHTML='<div class="box"><b>'+title+'</b></div><div class="loading">Loading...</div>'; try{ var res=await fetch('/api/highlights?id='+id); var data=await res.json(); var vids=data.data||data.highlights||[]; if(!Array.isArray(vids)) vids=[vids]; var html='<div class="box"><b>'+title+'</b></div>'; var found=false; vids.forEach(function(v){ var u=v.url||v.videoUrl||''; if(u){ found=true; var e=u; if(u.indexOf('watch?v=')>-1) e=u.replace('watch?v=','embed/'); html+='<div class="box"><iframe src="'+e+'" style="width:100%;height:220px;border:none;border-radius:10px" allowfullscreen></iframe></div>'; } }); if(!found) html+='<div class="box">No video. <a href="https://www.youtube.com/results?search_query='+encodeURIComponent(title+' highlights')+'" target="_blank" style="color:#00ff66">YouTube</a><br><iframe width="100%" height="200" src="https://www.youtube.com/embed?listType=search&list='+encodeURIComponent(title+' highlights')+'" style="border:none" allowfullscreen></iframe></div>'; document.getElementById('modalContent').innerHTML=html+'<a href="${MY_1XBET}" target="_blank" class="btnBet">BET NOW</a>'; }catch(e){ document.getElementById('modalContent').innerHTML='<div class="box">Error '+e.message+'</div>'; } }
function closeModal(){ document.getElementById('modal').style.display='none'; }
loadDate(getDateStr(0));
</script>
</body></html>`;
    return new Response(html, { headers: {"Content-Type":"text/html","Cache-Control":"no-cache"} });
  }
}
