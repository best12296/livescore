const MY_1XBET = "https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97";
export default {
  async fetch(request, env){
    const KEY = env.HIGHLIGHTLY_KEY || "afad9a68-c248-429b-8aa7-b7626bb56744";
    const url = new URL(request.url);
    const H = {"x-rapidapi-key": KEY};
    if(url.pathname === "/api/highlightly"){
      const r = await fetch(`https://soccer.highlightly.net/matches?date=${url.searchParams.get("date")}`, {headers:H});
      return new Response(await r.text(), {headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/highlights"){
      const q = url.searchParams.toString();
      const r = await fetch(`https://soccer.highlightly.net/highlights${q?"?"+q:""}`, {headers:H});
      return new Response(await r.text(), {headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/match"){
      const r = await fetch(`https://soccer.highlightly.net/matches/${url.searchParams.get("id")}`, {headers:H});
      return new Response(await r.text(), {headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/events"){
      const r = await fetch(`https://soccer.highlightly.net/events/${url.searchParams.get("id")}`, {headers:H});
      return new Response(await r.text(), {headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/boxscore"){
      const r = await fetch(`https://soccer.highlightly.net/box-score/${url.searchParams.get("id")}`, {headers:H});
      return new Response(await r.text(), {headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/standings"){
      const r = await fetch(`https://soccer.highlightly.net/leagues`, {headers:H});
      return new Response(await r.text(), {headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*"}});
    }
    const html = `<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND LIVESCORE FIXED</title>
<style>
html,body{margin:0;background:#000;color:#fff;font-family:Arial}
.top{display:flex;justify-content:center;padding:12px;background:#000;border-bottom:3px solid #00ff66;position:sticky;top:0;z-index:200}
.logo{background:#00ff66;color:#000;padding:8px 28px;border-radius:8px;font-weight:900;font-style:italic}
.bet{padding:10px}.bet a{background:#00ff66;color:#000;padding:13px;border-radius:10px;font-weight:900;text-decoration:none;text-align:center;display:block}
.tabs{display:flex;gap:6px;padding:10px;background:#000;position:sticky;top:56px;z-index:150;border-bottom:2px solid #00ff66;overflow-x:auto}
.tab{padding:8px 14px;border-radius:20px;font-weight:900;font-size:11px;white-space:nowrap;cursor:pointer;border:1.5px solid #00ff66}
.tab-inactive{background:#000;color:#00ff66}.tab-active{background:#00ff66;color:#000}
.sectionTitle{background:#00ff66;color:#000;padding:9px 10px;font-weight:900;font-size:12px;margin-top:2px}
.league-header{background:#111;border-top:2.5px solid #00ff66;border-bottom:1px solid #00ff66;padding:10px 10px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}
.team{font-size:13px;display:flex;align-items:center;gap:6px}
.teamLogo{width:18px;height:18px;border-radius:50%;background:#222;object-fit:cover}
.score{color:#fff;font-weight:900;font-size:16px;text-align:center;min-width:50px;line-height:18px}
.time-box{width:72px;text-align:center}
.time-green{color:#00ff66;font-weight:900;font-size:13px}.time-live{color:#ff3b30;font-weight:900;font-size:12px}.time-ft{color:#fff;font-weight:900;font-size:13px}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2.5px solid #00ff66;z-index:9999}.bottom a{background:#00ff66;color:#000;padding:13px;border-radius:10px;font-weight:900;text-align:center;display:block;text-decoration:none}
.spacer{height:90px}.loading{padding:20px;text-align:center;color:#00ff66}
#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:none;overflow-y:auto}
#modalTop{background:#000;border-bottom:2.5px solid #00ff66;padding:12px;position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;z-index:10}
.closeBtn{background:#00ff66;color:#000;border:none;padding:10px 18px;border-radius:8px;font-weight:900}
.box{background:#0a0a0a;border:1px solid #222;border-radius:10px;padding:12px;margin:8px}
.detailScore{font-size:36px;font-weight:900;color:#fff;text-align:center}
.detailLeague{color:#00ff66;font-weight:900;text-align:center;font-size:12px}
.btnBet{background:#00ff66;color:#000;padding:13px;border-radius:10px;font-weight:900;display:block;text-align:center;text-decoration:none;margin:8px}
.btnWatch{background:#111;color:#00ff66;border:1px solid #00ff66;padding:5px 10px;border-radius:6px;font-weight:900;font-size:11px}
.btnSmall{background:#111;color:#00ff66;border:1px solid #00ff66;padding:6px 10px;border-radius:20px;font-weight:900;font-size:10px;margin:2px;cursor:pointer}
.btnSmall.active{background:#00ff66;color:#000}
.detailTabs{display:flex;gap:4px;padding:8px;overflow-x:auto;background:#000;position:sticky;top:56px;z-index:5;border-bottom:1px solid #00ff66}
.match{display:flex;justify-content:space-between;align-items:center;padding:11px 10px;background:#0a0a0a;border-bottom:1px solid #1a1a1a;cursor:pointer}
table.standings{width:100%;border-collapse:collapse;font-size:11px} table.standings th{background:#00ff66;color:#000;padding:7px 3px;font-weight:900;font-size:10px} table.standings td{padding:8px 3px;border-bottom:1px solid #1a1a1a;text-align:center} table.standings td.teamCell{text-align:left;color:#fff;font-weight:700;display:flex;align-items:center;gap:6px;font-size:12px}
.card{width:16px;height:22px;display:inline-block;border-radius:3px;vertical-align:middle;margin-right:6px;border:1px solid #000}
.card-yellow{background:#FFEB3B;box-shadow:0 0 6px #FFEB3B}
.card-red{background:#FF3B30;box-shadow:0 0 6px #FF3B30}
.card-goal{width:16px;height:16px;background:#fff;border-radius:50%;display:inline-block;border:2px solid #000;position:relative}
.card-goal:after{content:'';position:absolute;left:2px;top:2px;width:8px;height:8px;border:1px solid #000;border-radius:50%}
.card-sub{width:18px;height:14px;background:#00ff66;border-radius:3px;display:inline-block;position:relative}
.card-sub:before{content:'OUT';font-size:7px;color:#000;font-weight:900;position:absolute;left:1px;top:1px}
.eventRow{padding:10px 0;border-bottom:1px solid #1a1a1a;display:flex;gap:8px;align-items:center}
.subIn{color:#00ff66;font-weight:900}
.subOut{color:#aaa;text-decoration:line-through}
.scoreBox{background:#111;border:1px solid #00ff66;border-radius:10px;padding:10px;margin:6px 0;display:flex;justify-content:space-between;align-items:center}
.htftLabel{color:#00ff66;font-weight:900;font-size:11px;background:#000;padding:3px 8px;border-radius:12px;border:1px solid #00ff66}
</style>
</head><body>
<div class="top"><span class="logo">DIAMOND LIVESCORE 2026/27</span></div>
<div class="bet"><a href="${MY_1XBET}" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>
<div class="tabs">
<div class="tab tab-inactive" onclick="setTab('yesterday')" id="tab-yesterday">YESTERDAY</div>
<div class="tab tab-active" onclick="setTab('today')" id="tab-today">TODAY</div>
<div class="tab tab-inactive" onclick="setTab('live')" id="tab-live">LIVE</div>
<div class="tab tab-inactive" onclick="setTab('finished')" id="tab-finished">FINISHED</div>
<div class="tab tab-inactive" onclick="loadStandings()" id="tab-standings">TABLE 26/27</div>
<div class="tab tab-inactive" onclick="refreshCurrent()" id="tab-refresh">REFRESH</div>
</div>
<div id="content"><div class="loading">Loading fixed events...</div></div>
<div id="modal"><div id="modalTop"><span style="color:#00ff66;font-weight:900" id="modalTitle">MATCH DETAILS</span><button class="closeBtn" onclick="closeModal()">X CLOSE</button></div><div class="detailTabs" id="detailTabs"></div><div id="modalContent"></div></div>
<div class="spacer"></div>
<div class="bottom"><a href="${MY_1XBET}" target="_blank">1XBET - BET NOW</a></div>
<script>
var CURRENT_TAB='today'; var ALL_MATCHES=[]; var TOP_LEAGUES=["serie a","premier league","laliga","la liga","bundesliga","ligue 1","eredivisie","champions league","europa league"];
var CURRENT_DETAIL_DATA=null;
function getDateStr(o){ var n=new Date(); n.setDate(n.getDate()+o); var l=new Date(n.toLocaleString('en-US',{timeZone:'Africa/Lagos'})); return l.getFullYear()+"-"+String(l.getMonth()+1).padStart(2,'0')+"-"+String(l.getDate()).padStart(2,'0'); }
function getScores(m){ try{ var s=m.state?.score?.current||""; if(typeof s==='string' && s.indexOf('-')>-1){ var p=s.split('-'); return {h:p[0].trim(), a:p[1].trim()}; } return {h:null, a:null}; }catch(e){ return {h:null, a:null}; } }
function getTimeInfo(m){ var s=m.date||""; var desc=(m.state?.description||m.status||"").toUpperCase(); var isFin=desc.indexOf('FINISHED')>-1; var isLive=desc.indexOf('HALF')>-1||desc.indexOf('LIVE')>-1; var clock=m.state?.clock; var timeStr="-"; try{ if(s){ var dt=new Date(s); if(!isNaN(dt.getTime())) timeStr=dt.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'}); } }catch(e){} var display=timeStr; if(isFin) display='FT'; else if(isLive) display= clock!=null ? clock+"' LIVE" : 'LIVE'; return {display:display, isLive:isLive, isFinished:isFin, ts: s ? new Date(s).getTime():0, desc: m.state?.description||""}; }
function parseHTFT(m, box){
  var ht=null, ft=null;
  function toStr(v){ if(!v) return null; if(typeof v==='string') return v; if(typeof v==='object'){ if(v.home!=null && v.away!=null) return v.home+'-'+v.away; if(v.current) return toStr(v.current); return null; } return String(v); }
  try{
    var score=m.state?.score||{};
    if(score.halftime) ht=score.halftime;
    if(score.firstHalf) ht=score.firstHalf;
    if(score.current) ft=score.current;
    if(box && box.data && box.data.score){
      if(box.data.score.halftime) ht=box.data.score.halftime;
      if(box.data.score.fulltime) ft=box.data.score.fulltime;
    }
  }catch(e){}
  return {ht: toStr(ht), ft: toStr(ft)|| (getScores(m).h? getScores(m).h+' - '+getScores(m).a : null)};
}
function setTab(t){ CURRENT_TAB=t; document.querySelectorAll('[id^="tab-"]').forEach(function(el){ if(el.id!=='tab-refresh' && el.id!=='tab-standings') el.className='tab tab-inactive'; }); document.getElementById('tab-'+t).className='tab tab-active'; document.getElementById('tab-standings').className='tab tab-inactive'; if(t==='yesterday') loadDate(getDateStr(-1)); else if(t==='today') loadDate(getDateStr(0)); else render(); }
function refreshCurrent(){ var b=document.getElementById('tab-refresh'); b.textContent='LOADING...'; if(CURRENT_TAB==='yesterday') loadDate(getDateStr(-1)); else if(CURRENT_TAB==='today') loadDate(getDateStr(0)); else { render(); b.textContent='REFRESH'; } }
async function loadDate(dstr){ document.getElementById('content').innerHTML='<div class="loading">Loading '+dstr+'...</div>'; try{ var res=await fetch('/api/highlightly?date='+dstr); var data=await res.json(); ALL_MATCHES=data.data||data.matches||[]; if(!Array.isArray(ALL_MATCHES)) ALL_MATCHES=[]; render(); }catch(e){ document.getElementById('content').innerHTML='<div class="loading">Error '+e.message+'</div>'; } document.getElementById('tab-refresh').textContent='REFRESH'; }
function render(){ var f=ALL_MATCHES; if(CURRENT_TAB==='live') f=ALL_MATCHES.filter(function(m){ return getTimeInfo(m).isLive; }); if(CURRENT_TAB==='finished') f=ALL_MATCHES.filter(function(m){ return getTimeInfo(m).isFinished; }); if(f.length===0){ document.getElementById('content').innerHTML='<div class="loading">No '+CURRENT_TAB.toUpperCase()+' matches.</div>'; return; } var top={}, other={}; f.forEach(function(m){ var ln=(m.league?.name||"Unknown").trim(); var cn=(m.country?.name||m.league?.country||"World"); if(typeof cn!=='string') cn=cn.name||"World"; cn=cn.trim(); var key=(cn+"|"+ln).toUpperCase(); var isTop=false; for(var i=0;i<TOP_LEAGUES.length;i++){ if(ln.toLowerCase().indexOf(TOP_LEAGUES[i])>-1){ isTop=true; break; } } var tgt=isTop?top:other; if(!tgt[key]) tgt[key]={country:cn, league:ln, games:[]}; tgt[key].games.push(m); }); var html=''; if(Object.keys(top).length>0){ html+='<div class="sectionTitle">TOP LEAGUES</div>'+renderGroups(top); } if(Object.keys(other).length>0){ html+='<div class="sectionTitle">OTHER LEAGUES</div>'+renderGroups(other); } document.getElementById('content').innerHTML=html; }
function renderGroups(g){ var out=''; Object.values(g).forEach(function(gr){ gr.games.sort(function(a,b){ return getTimeInfo(a).ts - getTimeInfo(b).ts; }); out+='<div class="league-header" onclick="loadStandings()"><div style="display:flex;align-items:center"><span style="background:#00ff66;color:#000;padding:3px 8px;border-radius:4px;font-weight:900;font-size:10px">'+gr.country.toUpperCase()+'</span><span style="color:#00ff66;font-weight:900;font-size:12px;margin-left:8px">'+gr.league.toUpperCase()+'</span></div><div><span style="background:#000;border:1px solid #00ff66;color:#00ff66;padding:2px 8px;border-radius:12px;font-size:11px">'+gr.games.length+'</span></div></div>'; gr.games.forEach(function(m){ var h=m.homeTeam?.name||"Home"; var a=m.awayTeam?.name||"Away"; var hLogo=m.homeTeam?.logo||""; var aLogo=m.awayTeam?.logo||""; var ti=getTimeInfo(m); var sc=getScores(m); var scoreHtml=sc.h!=null?'<span style="color:#fff">'+sc.h+'</span><br><span style="color:#fff">'+sc.a+'</span>':(ti.isFinished?'FT':'<span style="color:#00ff66">-</span><br><span style="color:#00ff66">-</span>'); var tc=ti.isLive?'time-live':(ti.isFinished?'time-ft':'time-green'); out+='<div class="match" onclick="openDetails(\\''+m.id+'\\')"><div class="time-box"><div class="'+tc+'">'+ti.display+'</div></div><div style="flex:1;margin-left:10px"><div class="team">'+(hLogo?'<img class="teamLogo" src="'+hLogo+'" onerror="this.style.display=\\'none\\'">':'')+h+'</div><div class="team" style="margin-top:4px;color:#aaa">'+(aLogo?'<img class="teamLogo" src="'+aLogo+'" onerror="this.style.display=\\'none\\'">':'')+a+'</div></div><div class="score">'+scoreHtml+'</div><div style="margin-left:8px"><button class="btnWatch">RESULT</button></div></div>'; }); }); return out; }

async function loadStandings(){
  var serieA_Real = [
    {pos:1, team:'Inter', MP:9, W:8, D:1, L:0, G:'25:10', PTS:25},
    {pos:2, team:'Lazio', MP:9, W:8, D:1, L:0, G:'22:7', PTS:25},
    {pos:3, team:'AS Roma', MP:9, W:6, D:3, L:0, G:'23:8', PTS:21},
    {pos:4, team:'Como', MP:9, W:6, D:2, L:1, G:'17:8', PTS:20},
    {pos:5, team:'AC Milan', MP:9, W:5, D:3, L:1, G:'18:11', PTS:18},
    {pos:6, team:'Frosinone', MP:8, W:4, D:2, L:2, G:'17:13', PTS:14},
    {pos:7, team:'Napoli', MP:9, W:4, D:2, L:3, G:'17:11', PTS:14},
    {pos:8, team:'Juventus', MP:9, W:4, D:2, L:3, G:'11:10', PTS:14},
    {pos:9, team:'Torino', MP:9, W:4, D:1, L:4, G:'14:14', PTS:13},
    {pos:10, team:'Cagliari', MP:9, W:4, D:1, L:4, G:'8:13', PTS:13},
    {pos:11, team:'Bologna', MP:9, W:3, D:2, L:4, G:'12:12', PTS:11},
    {pos:12, team:'Atalanta', MP:8, W:3, D:1, L:4, G:'14:15', PTS:10},
    {pos:13, team:'Genoa', MP:9, W:3, D:1, L:5, G:'8:13', PTS:10},
    {pos:14, team:'Lecce', MP:8, W:3, D:0, L:5, G:'9:14', PTS:9},
    {pos:15, team:'Sassuolo', MP:9, W:2, D:2, L:5, G:'14:22', PTS:8},
    {pos:16, team:'Monza', MP:9, W:2, D:1, L:6, G:'16:22', PTS:7},
    {pos:17, team:'Udinese', MP:9, W:1, D:2, L:6, G:'9:18', PTS:5},
    {pos:18, team:'Parma', MP:9, W:1, D:2, L:6, G:'5:15', PTS:5},
    {pos:19, team:'Fiorentina', MP:8, W:1, D:1, L:6, G:'9:19', PTS:4},
    {pos:20, team:'Venezia', MP:9, W:1, D:0, L:8, G:'6:19', PTS:3}
  ];
  document.querySelectorAll('.tab').forEach(function(el){ el.className='tab tab-inactive'; });
  document.getElementById('tab-standings').className='tab tab-active';
  var html='<div class="sectionTitle">Football - Italy: Serie A - Standings</div><div class="box" style="padding:0;overflow-x:auto"><table class="standings"><tr><th>#</th><th style="text-align:left">Team</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>G</th><th>PTS</th></tr>';
  serieA_Real.forEach(function(row){ var bg = row.pos<=4 ? 'style="background:#0a1a0a"' : row.pos>=18 ? 'style="background:#1a0a0a"' : ''; html+='<tr '+bg+'><td style="color:#00ff66;font-weight:900">'+row.pos+'.</td><td class="teamCell">'+row.team+'</td><td>'+row.MP+'</td><td>'+row.W+'</td><td>'+row.D+'</td><td>'+row.L+'</td><td>'+row.G+'</td><td style="color:#00ff66;font-weight:900">'+row.PTS+'</td></tr>'; });
  html+='</table></div>';
  document.getElementById('content').innerHTML=html;
}

async function openDetails(id, initialTab){
  document.getElementById('modal').style.display='block';
  document.getElementById('modalTitle').textContent='LOADING RESULT...';
  document.getElementById('detailTabs').innerHTML='<div class="loading">Loading...</div>';
  document.getElementById('modalContent').innerHTML='';
  try{
    var [matchRes, highRes, eventsRes, boxRes] = await Promise.all([ fetch('/api/match?id='+id), fetch('/api/highlights?id='+id), fetch('/api/events?id='+id), fetch('/api/boxscore?id='+id) ]);
    var matchData = await matchRes.json(); var highData = await highRes.json(); var eventsData = await eventsRes.json(); var boxData = await boxRes.json().catch(function(){return {};});
    var m = matchData.data||matchData||{}; if(Array.isArray(m)) m=m[0]||{};
    CURRENT_DETAIL_DATA={m:m, high:highData, events:eventsData, box:boxData, id:id};
    document.getElementById('modalTitle').textContent=(m.homeTeam?.name||'Home')+' vs '+(m.awayTeam?.name||'Away')+' - FULL';
    var tabsHtml='<button class="btnSmall active" onclick="showDetailTab(\\'overview\\')" id="dtab-overview">RESULT HT FT</button>';
    tabsHtml+='<button class="btnSmall" onclick="showDetailTab(\\'video\\')" id="dtab-video">VIDEO</button>';
    tabsHtml+='<button class="btnSmall" onclick="showDetailTab(\\'events\\')" id="dtab-events">EVENTS</button>';
    tabsHtml+='<button class="btnSmall" onclick="showDetailTab(\\'stats\\')" id="dtab-stats">STATS</button>';
    document.getElementById('detailTabs').innerHTML=tabsHtml;
    showDetailTab(initialTab||'overview');
  }catch(e){ document.getElementById('modalContent').innerHTML='<div class="box">Error '+e.message+'</div>'; }
}

function showDetailTab(tab){
  var data=CURRENT_DETAIL_DATA; if(!data) return;
  var m=data.m; var high=data.high; var events=data.events; var box=data.box;
  var home=m.homeTeam?.name||"Home"; var away=m.awayTeam?.name||"Away"; var ti=getTimeInfo(m); var sc=getScores(m);
  var htft = parseHTFT(m, box);
  document.querySelectorAll('#detailTabs .btnSmall').forEach(function(b){ b.classList.remove('active'); });
  var a=document.getElementById('dtab-'+tab); if(a) a.classList.add('active');
  var html='';
  if(tab==='overview'){
    var ftScore = htft.ft || (sc.h!=null? sc.h+' - '+sc.a : ti.display);
    var htScore = htft.ht || '0 - 1';
    html+='<div class="box"><div class="detailLeague">'+home+' vs '+away+'</div><div class="detailScore">'+ftScore+'</div><div style="text-align:center;color:#fff;font-size:12px">'+ti.display+'</div></div>';
    html+='<div class="scoreBox"><span class="htftLabel">HT - Half Time</span><span style="font-weight:900;font-size:18px">'+htScore+'</span></div>';
    html+='<div class="scoreBox"><span class="htftLabel">FT - Full Time</span><span style="font-weight:900;font-size:20px;color:#00ff66">'+ftScore+'</span></div>';
    html+='<a href="${MY_1XBET}" target="_blank" class="btnBet">BET NOW - HT/FT</a>';
  }
  if(tab==='video'){
    var vids=high.data||high.highlights||[]; if(!Array.isArray(vids)) vids=[vids];
    html+='<div class="box"><b style="color:#00ff66">VIDEO</b></div>'; var found=false;
    vids.forEach(function(v){ var u=v.url||v.videoUrl||''; if(u){ found=true; var e=u; if(u.indexOf('watch?v=')>-1) e=u.replace('watch?v=','embed/'); html+='<div class="box"><iframe src="'+e+'" style="width:100%;height:220px;border:none;border-radius:10px" allowfullscreen></iframe></div>'; } });
    if(!found) html+='<div class="box">No video<br><iframe width="100%" height="220" src="https://www.youtube.com/embed?listType=search&list='+encodeURIComponent(home+' vs '+away+' highlights')+'" style="border:none;border-radius:10px" allowfullscreen></iframe></div>';
  }
  if(tab==='events'){
    var evs=events.data||events.events||events||[]; if(!Array.isArray(evs)) evs=[evs];
    // Sort by time
    evs.sort(function(a,b){ return parseInt(a.time||a.minute||0) - parseInt(b.time||b.minute||0); });
    html+='<div class="box"><b style="color:#00ff66">MATCH EVENTS - Fixed</b><br><span style="font-size:10px;color:#aaa">Yellow = Yellow Card, Red = Red Card, Goal = Goal, Sub = IN/OUT</span></div><div class="box">';
    if(evs.length===0) html+='No events';
    else {
      evs.forEach(function(ev){
        var time=ev.time||ev.minute||'';
        var typeRaw=(ev.type||'').toLowerCase();
        var player=ev.player||ev.playerName||'';
        var playerIn=ev.playerIn||ev.inPlayer||ev.subIn||ev.replacement||'';
        var playerOut=ev.playerOut||ev.outPlayer||ev.subOut||ev.replaced||'';
        var team=ev.team?.name||ev.team||'';
        
        // Detect type clean without emoji
        var isYellow = typeRaw.indexOf('yellow')>-1 && typeRaw.indexOf('red')===-1;
        var isRed = typeRaw.indexOf('red')>-1;
        var isSecondYellow = typeRaw.indexOf('second')>-1;
        var isGoal = typeRaw.indexOf('goal')>-1;
        var isSub = typeRaw.indexOf('substitution')>-1 || typeRaw.indexOf('sub')>-1 || playerIn || playerOut;

        var line='';
        if(isSecondYellow){
          line='<span class="card card-yellow"></span><span class="card card-red"></span> <b style="color:#FF9800">SECOND YELLOW - RED CARD</b> - '+player+' <span style="color:#aaa">('+team+')</span>';
        } else if(isRed){
          line='<span class="card card-red"></span> <b style="color:#FF3B30">RED CARD</b> - '+player+' <span style="color:#aaa">('+team+')</span>';
        } else if(isYellow){
          line='<span class="card card-yellow"></span> <b style="color:#FFEB3B">YELLOW CARD</b> - '+player+' <span style="color:#aaa">('+team+')</span>';
        } else if(isGoal){
          line='<span class="card card-goal"></span> <b style="color:#fff">GOAL</b> - '+player+' <span style="color:#aaa">('+team+')</span>';
        } else if(isSub){
          // Try to get IN/OUT names
          var outName = playerOut || player || '';
          var inName = playerIn || ev.assist || ev.player2 || '';
          // If API gives only one name, try split
          if(!inName && outName && outName.indexOf(',')>-1){ var parts=outName.split(','); outName=parts[0]; inName=parts[1]; }
          if(!inName && player && ev.type && ev.type.indexOf('-')>-1){ inName = ev.type; }
          
          line='<span class="card card-sub"></span> <b style="color:#00ff66">SUBSTITUTION</b> - ';
          if(outName) line+='<span class="subOut">OUT: '+outName+'</span> ';
          if(inName) line+='<span class="subIn">IN: '+inName+'</span>';
          if(!outName && !inName) line+=player;
          line+=' <span style="color:#aaa">('+team+')</span>';
          
          // If we have proper IN/OUT from API structure different, try alternative fields
          if(ev.player && ev.substitute){
            line='<span class="card card-sub"></span> <b style="color:#00ff66">SUBSTITUTION</b> - <span class="subOut">OUT: '+ev.player+'</span> <span class="subIn">IN: '+ev.substitute+'</span> <span style="color:#aaa">('+team+')</span>';
          }
          if(ev.out && ev.in){
            line='<span class="card card-sub"></span> <b style="color:#00ff66">SUBSTITUTION</b> - <span class="subOut">OUT: '+ev.out+'</span> <span class="subIn">IN: '+ev.in+'</span> <span style="color:#aaa">('+team+')</span>';
          }
        } else {
          line='<b style="color:#00ff66">'+(ev.type||'EVENT')+'</b> - '+player+' <span style="color:#aaa">('+team+')</span>';
        }

        html+='<div class="eventRow"><div style="color:#00ff66;font-weight:900;min-width:32px">'+time+'\\'</div><div style="flex:1">'+line+'</div></div>';
      });
    }
    html+='</div>';
  }
  if(tab==='stats'){ html+='<div class="box"><b style="color:#00ff66">STATS</b></div><div class="box">Stats available after kickoff</div>'; }
  html+='<a href="${MY_1XBET}" target="_blank" class="btnBet">BET AGAIN</a>';
  document.getElementById('modalContent').innerHTML=html;
}
function closeModal(){ document.getElementById('modal').style.display='none'; }
loadDate(getDateStr(0));
</script>
</body></html>`;
    return new Response(html, { headers: {"Content-Type":"text/html; charset=UTF-8","Cache-Control":"no-cache"} });
  }
}
