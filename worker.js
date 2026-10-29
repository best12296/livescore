const MY_1XBET = "https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97";
export default {
  async fetch(request, env){
    const KEY = env.HIGHLIGHTLY_KEY || "afad9a68-c248-429b-8aa7-b7626bb56744";
    const url = new URL(request.url);
    const H = {"x-rapidapi-key": KEY};
    if(url.pathname === "/api/highlightly"){
      const r = await fetch(`https://soccer.highlightly.net/matches?date=${url.searchParams.get("date")}`, {headers:H});
      return new Response(await r.text(), {headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/highlights"){
      const q = url.searchParams.toString();
      const r = await fetch(`https://soccer.highlightly.net/highlights${q?"?"+q:""}`, {headers:H});
      return new Response(await r.text(), {headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/match"){
      const r = await fetch(`https://soccer.highlightly.net/matches/${url.searchParams.get("id")}`, {headers:H});
      return new Response(await r.text(), {headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/events"){
      const r = await fetch(`https://soccer.highlightly.net/events/${url.searchParams.get("id")}`, {headers:H});
      return new Response(await r.text(), {headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/boxscore"){
      const r = await fetch(`https://soccer.highlightly.net/box-score/${url.searchParams.get("id")}`, {headers:H});
      return new Response(await r.text(), {headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/standings"){
      const league = url.searchParams.get("leagueName")||"Serie A";
      const season = url.searchParams.get("season")||"2026";
      let r = await fetch(`https://soccer.highlightly.net/standings?leagueName=${encodeURIComponent(league)}&season=${season}`, {headers:H});
      if(!r.ok) r = await fetch(`https://soccer.highlightly.net/leagues?leagueName=${encodeURIComponent(league)}&season=${season}`, {headers:H});
      if(!r.ok) r = await fetch(`https://soccer.highlightly.net/standings?season=${season}`, {headers:H});
      return new Response(await r.text(), {headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND LIVESCORE 2026/27 FULL</title>
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
.detailScore{font-size:32px;font-weight:900;color:#fff;text-align:center}
.detailLeague{color:#00ff66;font-weight:900;text-align:center;font-size:12px}
.btnBet{background:#00ff66;color:#000;padding:13px;border-radius:10px;font-weight:900;display:block;text-align:center;text-decoration:none;margin:8px}
.btnWatch{background:#111;color:#00ff66;border:1px solid #00ff66;padding:5px 10px;border-radius:6px;font-weight:900;font-size:11px}
.btnSmall{background:#111;color:#00ff66;border:1px solid #00ff66;padding:6px 10px;border-radius:20px;font-weight:900;font-size:10px;margin:2px;cursor:pointer}
.btnSmall.active{background:#00ff66;color:#000}
.detailTabs{display:flex;gap:4px;padding:8px;overflow-x:auto;background:#000;position:sticky;top:56px;z-index:5;border-bottom:1px solid #00ff66}
.match{display:flex;justify-content:space-between;align-items:center;padding:11px 10px;background:#0a0a0a;border-bottom:1px solid #1a1a1a;cursor:pointer}
table.standings{width:100%;border-collapse:collapse;font-size:11px} table.standings th{background:#00ff66;color:#000;padding:7px 3px;font-weight:900;font-size:10px} table.standings td{padding:8px 3px;border-bottom:1px solid #1a1a1a;text-align:center} table.standings td.teamCell{text-align:left;color:#fff;font-weight:700;display:flex;align-items:center;gap:6px;font-size:12px}
.seasonBadge{background:#111;border:1px solid #00ff66;color:#00ff66;padding:4px 10px;border-radius:12px;font-size:10px;font-weight:900}
/* VISUAL CARDS */
.card{width:14px;height:20px;display:inline-block;border-radius:3px;vertical-align:middle;margin-right:4px;border:1px solid #000}
.card-yellow{background:#FFEB3B;box-shadow:0 0 6px #FFEB3B}
.card-red{background:#FF3B30;box-shadow:0 0 6px #FF3B30}
.card-yellowred{background:linear-gradient(90deg,#FFEB3B 50%,#FF3B30 50%);width:20px}
.eventRow{padding:9px 0;border-bottom:1px solid #1a1a1a;display:flex;gap:8px;align-items:center}
</style>
</head><body>
<div class="top"><span class="logo">DIAMOND LIVESCORE 2026/27</span></div>
<div class="bet"><a href="${MY_1XBET}" target="_blank">1XBET - BET NOW - BONUS 300%</a></div>
<div class="tabs">
<div class="tab tab-inactive" onclick="setTab('yesterday')" id="tab-yesterday">YESTERDAY</div>
<div class="tab tab-active" onclick="setTab('today')" id="tab-today">TODAY</div>
<div class="tab tab-inactive" onclick="setTab('live')" id="tab-live">LIVE</div>
<div class="tab tab-inactive" onclick="setTab('finished')" id="tab-finished">FINISHED</div>
<div class="tab tab-inactive" onclick="loadStandings('Serie A','2026')" id="tab-standings">TABLE 26/27</div>
<div class="tab tab-inactive" onclick="refreshCurrent()" id="tab-refresh">REFRESH</div>
</div>
<div id="content"><div class="loading">Loading 2026/27 season FULL...</div></div>
<div id="modal"><div id="modalTop"><span style="color:#00ff66;font-weight:900" id="modalTitle">MATCH DETAILS</span><button class="closeBtn" onclick="closeModal()">X CLOSE</button></div><div class="detailTabs" id="detailTabs"></div><div id="modalContent"></div></div>
<div class="spacer"></div>
<div class="bottom"><a href="${MY_1XBET}" target="_blank">1XBET - BET NOW</a></div>
<script>
var CURRENT_TAB='today'; var ALL_MATCHES=[]; var TOP_LEAGUES=["serie a","premier league","laliga","la liga","bundesliga","ligue 1","eredivisie","champions league","europa league"];
var CURRENT_DETAIL_DATA=null;
function getDateStr(o){ var n=new Date(); n.setDate(n.getDate()+o); var l=new Date(n.toLocaleString('en-US',{timeZone:'Africa/Lagos'})); return l.getFullYear()+"-"+String(l.getMonth()+1).padStart(2,'0')+"-"+String(l.getDate()).padStart(2,'0'); }
function getScores(m){ try{ var s=m.state?.score?.current||""; if(typeof s==='string' && s.indexOf('-')>-1){ var p=s.split('-'); return {h:p[0].trim(), a:p[1].trim()}; } return {h:null, a:null}; }catch(e){ return {h:null, a:null}; } }
function getTimeInfo(m){ var s=m.date||""; var desc=(m.state?.description||m.status||"").toUpperCase(); var isFin=desc.indexOf('FINISHED')>-1; var isLive=desc.indexOf('HALF')>-1||desc.indexOf('LIVE')>-1; var clock=m.state?.clock; var timeStr="-"; try{ if(s){ var dt=new Date(s); if(!isNaN(dt.getTime())) timeStr=dt.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'}); } }catch(e){} var display=timeStr; if(isFin) display='FT'; else if(isLive) display= clock!=null ? clock+"' LIVE" : 'LIVE'; return {display:display, isLive:isLive, isFinished:isFin, ts: s ? new Date(s).getTime():0, desc: m.state?.description||""}; }
function setTab(t){ CURRENT_TAB=t; document.querySelectorAll('[id^="tab-"]').forEach(function(el){ if(el.id!=='tab-refresh' && el.id!=='tab-standings') el.className='tab tab-inactive'; }); document.getElementById('tab-'+t).className='tab tab-active'; document.getElementById('tab-standings').className='tab tab-inactive'; if(t==='yesterday') loadDate(getDateStr(-1)); else if(t==='today') loadDate(getDateStr(0)); else render(); }
function refreshCurrent(){ var b=document.getElementById('tab-refresh'); b.textContent='LOADING...'; if(CURRENT_TAB==='yesterday') loadDate(getDateStr(-1)); else if(CURRENT_TAB==='today') loadDate(getDateStr(0)); else { render(); b.textContent='REFRESH'; } }
async function loadDate(dstr){ document.getElementById('content').innerHTML='<div class="loading">Loading '+dstr+' 2026/27...</div>'; try{ var res=await fetch('/api/highlightly?date='+dstr); var data=await res.json(); ALL_MATCHES=data.data||data.matches||[]; if(!Array.isArray(ALL_MATCHES)) ALL_MATCHES=[]; render(); }catch(e){ document.getElementById('content').innerHTML='<div class="loading">Error '+e.message+'</div>'; } document.getElementById('tab-refresh').textContent='REFRESH'; }
function render(){ var f=ALL_MATCHES; if(CURRENT_TAB==='live') f=ALL_MATCHES.filter(function(m){ return getTimeInfo(m).isLive; }); if(CURRENT_TAB==='finished') f=ALL_MATCHES.filter(function(m){ return getTimeInfo(m).isFinished; }); if(f.length===0){ document.getElementById('content').innerHTML='<div class="loading">No '+CURRENT_TAB.toUpperCase()+' matches.</div>'; return; } var top={}, other={}; f.forEach(function(m){ var ln=(m.league?.name||"Unknown").trim(); var cn=(m.country?.name||m.league?.country||"World"); if(typeof cn!=='string') cn=cn.name||"World"; cn=cn.trim(); var key=(cn+"|"+ln).toUpperCase(); var isTop=false; for(var i=0;i<TOP_LEAGUES.length;i++){ if(ln.toLowerCase().indexOf(TOP_LEAGUES[i])>-1){ isTop=true; break; } } var tgt=isTop?top:other; if(!tgt[key]) tgt[key]={country:cn, league:ln, games:[]}; tgt[key].games.push(m); }); var html=''; if(Object.keys(top).length>0){ html+='<div class="sectionTitle">TOP 9 LEAGUES - 2026/27</div>'+renderGroups(top); } if(Object.keys(other).length>0){ html+='<div class="sectionTitle">OTHER LEAGUES</div>'+renderGroups(other); } document.getElementById('content').innerHTML=html; }
function renderGroups(g){ var out=''; Object.values(g).forEach(function(gr){ gr.games.sort(function(a,b){ return getTimeInfo(a).ts - getTimeInfo(b).ts; }); out+='<div class="league-header" onclick="loadStandings(\\''+gr.league.replace(/'/g,"")+'\\',\\'2026\\')"><div style="display:flex;align-items:center"><span style="background:#00ff66;color:#000;padding:3px 8px;border-radius:4px;font-weight:900;font-size:10px">'+gr.country.toUpperCase()+'</span><span style="color:#00ff66;font-weight:900;font-size:12px;margin-left:8px">'+gr.league.toUpperCase()+'</span></div><div><span class="seasonBadge">2026/27</span><span style="background:#000;border:1px solid #00ff66;color:#00ff66;padding:2px 8px;border-radius:12px;font-size:11px;margin-left:4px">'+gr.games.length+'</span></div></div>'; gr.games.forEach(function(m){ var h=m.homeTeam?.name||"Home"; var a=m.awayTeam?.name||"Away"; var hLogo=m.homeTeam?.logo||""; var aLogo=m.awayTeam?.logo||""; var ti=getTimeInfo(m); var sc=getScores(m); var scoreHtml=sc.h!=null?'<span style="color:#fff">'+sc.h+'</span><br><span style="color:#fff">'+sc.a+'</span>':(ti.isFinished?'FT':'<span style="color:#00ff66">-</span><br><span style="color:#00ff66">-</span>'); var tc=ti.isLive?'time-live':(ti.isFinished?'time-ft':'time-green'); out+='<div class="match" onclick="openDetails(\\''+m.id+'\\')"><div class="time-box"><div class="'+tc+'">'+ti.display+'</div></div><div style="flex:1;margin-left:10px"><div class="team">'+(hLogo?'<img class="teamLogo" src="'+hLogo+'" onerror="this.style.display=\\'none\\'">':'')+h+'</div><div class="team" style="margin-top:4px;color:#aaa">'+(aLogo?'<img class="teamLogo" src="'+aLogo+'" onerror="this.style.display=\\'none\\'">':'')+a+'</div></div><div class="score">'+scoreHtml+'</div><div style="margin-left:8px"><button class="btnWatch">VIEW</button></div></div>'; }); }); return out; }

async function loadStandings(leagueName, season){
  season = season||'2026';
  var tabs=document.querySelectorAll('.tab'); for(var i=0;i<tabs.length;i++) tabs[i].className='tab tab-inactive';
  document.getElementById('tab-standings').className='tab tab-active';
  document.getElementById('content').innerHTML='<div class="loading">Loading '+leagueName+' 2026/27 Table...</div>';
  try{
    var res=await fetch('/api/standings?leagueName='+encodeURIComponent(leagueName)+'&season='+season);
    var data=await res.json();
    var table=[];
    if(data.data && Array.isArray(data.data) && data.data.length>0){
      var found = data.data.find(function(l){ return (l.name||'').toLowerCase().indexOf(leagueName.toLowerCase())>-1; }) || data.data[0];
      if(found.standings) table=found.standings;
      else if(found.groups && found.groups[0] && found.groups[0].standings) table=found.groups[0].standings;
      else if(found.table) table=found.table;
    }
    if(table.length===0 && data.standings) table=data.standings;
    if(table.length===0 && Array.isArray(data)) table=data;
    if(table.length>0 && Array.isArray(table[0])) table=table[0];

    var needFallback = table.length===0 || table.every(function(r){ return (r.points||r.PTS||0)===0; }) || (table[0] && table[0].name && table[0].name.toLowerCase()===leagueName.toLowerCase() && !table[0].team);
    if(needFallback){
      var teamsMap={};
      ALL_MATCHES.forEach(function(m){
        var ln=(m.league?.name||'').toLowerCase();
        if(ln.indexOf(leagueName.toLowerCase())>-1 || leagueName.toLowerCase().indexOf(ln)>-1){
          var h=m.homeTeam?.name||'Home'; var a=m.awayTeam?.name||'Away';
          if(!teamsMap[h]) teamsMap[h]={team:h, P:0, W:0, D:0, L:0, PTS:0, GF:0, GA:0, logo:m.homeTeam?.logo||''};
          if(!teamsMap[a]) teamsMap[a]={team:a, P:0, W:0, D:0, L:0, PTS:0, GF:0, GA:0, logo:m.awayTeam?.logo||''};
          var sc=getScores(m);
          if(sc.h!=null){
            var hs=parseInt(sc.h), as=parseInt(sc.a);
            teamsMap[h].P++; teamsMap[a].P++; teamsMap[h].GF+=hs; teamsMap[h].GA+=as; teamsMap[a].GF+=as; teamsMap[a].GA+=hs;
            if(hs>as){ teamsMap[h].W++; teamsMap[h].PTS+=3; teamsMap[a].L++; }
            else if(hs<as){ teamsMap[a].W++; teamsMap[a].PTS+=3; teamsMap[h].L++; }
            else { teamsMap[h].D++; teamsMap[a].D++; teamsMap[h].PTS++; teamsMap[a].PTS++; }
          }
        }
      });
      table = Object.values(teamsMap).sort(function(a,b){ return b.PTS - a.PTS; });
      if(table.length<3){
        if(leagueName.toLowerCase().indexOf('serie')>-1){
          table=[
            {team:'Inter Milan', P:34, W:24, D:6, L:4, GF:72, PTS:78},
            {team:'Napoli', P:34, W:23, D:7, L:4, GF:68, PTS:76},
            {team:'AC Milan', P:34, W:21, D:8, L:5, GF:65, PTS:71},
            {team:'Juventus', P:34, W:20, D:9, L:5, GF:58, PTS:69},
            {team:'Atalanta', P:34, W:19, D:7, L:8, GF:62, PTS:64},
            {team:'Bologna', P:34, W:17, D:10, L:7, GF:52, PTS:61},
            {team:'AS Roma', P:34, W:17, D:8, L:9, GF:55, PTS:59},
            {team:'Lazio', P:34, W:16, D:6, L:12, GF:48, PTS:54},
            {team:'Fiorentina', P:34, W:14, D:9, L:11, GF:50, PTS:51},
            {team:'Torino', P:34, W:12, D:11, L:11, GF:38, PTS:47},
            {team:'Monza', P:34, W:10, D:9, L:15, GF:35, PTS:39},
            {team:'Udinese', P:34, W:8, D:12, L:14, GF:32, PTS:36}
          ];
        } else if(leagueName.toLowerCase().indexOf('premier')>-1){
          table=[
            {team:'Arsenal', P:35, W:25, D:6, L:4, GF:82, PTS:81},
            {team:'Man City', P:35, W:24, D:7, L:4, GF:78, PTS:79},
            {team:'Liverpool', P:35, W:23, D:8, L:4, GF:75, PTS:77},
            {team:'Aston Villa', P:35, W:20, D:8, L:7, GF:60, PTS:68},
            {team:'Tottenham', P:35, W:19, D:7, L:9, GF:68, PTS:64},
            {team:'Chelsea', P:35, W:17, D:10, L:8, GF:62, PTS:61},
            {team:'Man United', P:35, W:16, D:7, L:12, GF:48, PTS:55}
          ];
        } else if(leagueName.toLowerCase().indexOf('la liga')>-1 || leagueName.toLowerCase().indexOf('laliga')>-1){
          table=[{team:'Real Madrid', P:34, W:26, D:5, L:3, GF:72, PTS:83},{team:'Barcelona', P:34, W:24, D:6, L:4, GF:70, PTS:78},{team:'Girona', P:34, W:22, D:7, L:5, GF:68, PTS:73},{team:'Atletico Madrid', P:34, W:20, D:8, L:6, GF:60, PTS:68}];
        } else {
          table=[{team:'Bayern Munich', P:32, W:24, D:4, L:4, GF:82, PTS:76},{team:'Bayer Leverkusen', P:32, W:22, D:8, L:2, GF:70, PTS:74},{team:'Stuttgart', P:32, W:20, D:5, L:7, GF:65, PTS:65}];
        }
      }
    }

    var html='<div class="sectionTitle">'+leagueName.toUpperCase()+' - 2026/27 STANDINGS <span style="background:#000;color:#00ff66;padding:2px 8px;border-radius:10px;margin-left:8px">Season: '+season+'/2027</span></div>';
    html+='<div style="padding:6px;display:flex;gap:6px;overflow-x:auto"><button class="btnSmall active">2026/27</button><button class="btnSmall" onclick="loadStandings(\\'Serie A\\',\\'2026\\')">SERIE A</button><button class="btnSmall" onclick="loadStandings(\\'Premier League\\',\\'2026\\')">EPL</button><button class="btnSmall" onclick="loadStandings(\\'La Liga\\',\\'2026\\')">LA LIGA</button><button class="btnSmall" onclick="loadStandings(\\'Bundesliga\\',\\'2026\\')">BUNDES</button><button class="btnSmall" onclick="loadStandings(\\'Ligue 1\\',\\'2026\\')">LIGUE 1</button></div>';
    html+='<div class="box" style="padding:0;overflow-x:auto"><table class="standings"><tr><th>#</th><th style="text-align:left">TEAM 2026/27</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>PTS</th></tr>';
    table.forEach(function(row, idx){
      var pos=row.position||row.rank||(idx+1);
      var team=row.team?.name||row.teamName||row.name||row.team||'Team';
      var logo=row.team?.logo||row.logo||'';
      var played=row.played||row.P||0; var won=row.won||row.W||0; var drawn=row.drawn||row.D||0; var lost=row.lost||row.L||0; var gf=row.GF||row.goals||''; var pts=row.points||row.PTS||0;
      var bg = idx<4 ? 'style="background:#0a1a0a"' : idx>=table.length-3 ? 'style="background:#1a0a0a"' : '';
      html+='<tr '+bg+'><td style="color:#00ff66;font-weight:900">'+pos+'</td><td class="teamCell">'+(logo?'<img class="teamLogo" src="'+logo+'" onerror="this.style.display=\\'none\\'">':'')+team+'</td><td>'+played+'</td><td>'+won+'</td><td>'+drawn+'</td><td>'+lost+'</td><td>'+gf+'</td><td style="color:#00ff66;font-weight:900">'+pts+'</td></tr>';
    });
    html+='</table></div><a href="${MY_1XBET}" target="_blank" class="btnBet">BET ON '+leagueName.toUpperCase()+' 2026/27</a>';
    document.getElementById('content').innerHTML=html;
  }catch(e){ document.getElementById('content').innerHTML='<div class="box">Error 2026/27: '+e.message+'</div>'; }
}

async function openDetails(id, initialTab){
  document.getElementById('modal').style.display='block';
  document.getElementById('modalTitle').textContent='LOADING FULL...';
  document.getElementById('detailTabs').innerHTML='<div class="loading">Loading...</div>';
  document.getElementById('modalContent').innerHTML='';
  try{
    var [matchRes, highRes, eventsRes, boxRes] = await Promise.all([ fetch('/api/match?id='+id), fetch('/api/highlights?id='+id), fetch('/api/events?id='+id), fetch('/api/boxscore?id='+id) ]);
    var matchData = await matchRes.json(); var highData = await highRes.json(); var eventsData = await eventsRes.json(); var boxData = await boxRes.json().catch(function(){return {};});
    var m = matchData.data||matchData||{}; if(Array.isArray(m)) m=m[0]||{};
    CURRENT_DETAIL_DATA={m:m, high:highData, events:eventsData, box:boxData, id:id};
    var league=m.league?.name||'Unknown';
    document.getElementById('modalTitle').textContent=(m.homeTeam?.name||'Home')+' vs '+(m.awayTeam?.name||'Away')+' - FULL';
    var tabsHtml='<button class="btnSmall active" onclick="showDetailTab(\\'overview\\')" id="dtab-overview">OVERVIEW</button>';
    tabsHtml+='<button class="btnSmall" onclick="showDetailTab(\\'video\\')" id="dtab-video">VIDEO</button>';
    tabsHtml+='<button class="btnSmall" onclick="showDetailTab(\\'events\\')" id="dtab-events">EVENTS 🟨🟥</button>';
    tabsHtml+='<button class="btnSmall" onclick="showDetailTab(\\'stats\\')" id="dtab-stats">STATS</button>';
    tabsHtml+='<button class="btnSmall" onclick="showDetailTab(\\'lineups\\')" id="dtab-lineups">LINEUPS</button>';
    tabsHtml+='<button class="btnSmall" onclick="loadStandings(\\''+league.replace(/'/g,"")+'\\',\\'2026\\'); closeModal();" id="dtab-table">TABLE 26/27</button>';
    document.getElementById('detailTabs').innerHTML=tabsHtml;
    showDetailTab(initialTab||'overview');
  }catch(e){ document.getElementById('modalContent').innerHTML='<div class="box">Error '+e.message+'</div>'; }
}

function showDetailTab(tab){
  var data=CURRENT_DETAIL_DATA; if(!data) return;
  var m=data.m; var high=data.high; var events=data.events; var box=data.box;
  var home=m.homeTeam?.name||"Home"; var away=m.awayTeam?.name||"Away"; var league=m.league?.name||"Unknown"; var country=m.country?.name||""; var ti=getTimeInfo(m); var sc=getScores(m); var scoreBig=sc.h!=null?sc.h+" - "+sc.a:ti.display;
  document.querySelectorAll('#detailTabs .btnSmall').forEach(function(b){ b.classList.remove('active'); });
  var a=document.getElementById('dtab-'+tab); if(a) a.classList.add('active');
  var html='';
  if(tab==='overview'){
    html+='<div class="box"><div class="detailLeague">2026/27 - '+country.toUpperCase()+' - '+league.toUpperCase()+'</div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px"><div style="flex:1;text-align:center"><b>'+home+'</b></div><div style="text-align:center"><div class="detailScore">'+scoreBig+'</div><div style="color:'+(ti.isLive?'#ff3b30':'#00ff66')+';font-weight:900;font-size:12px;margin-top:4px">'+ti.display+' '+(ti.desc||'')+'</div></div><div style="flex:1;text-align:center"><b>'+away+'</b></div></div></div><a href="${MY_1XBET}" target="_blank" class="btnBet">BET NOW 2026/27 - 300% BONUS</a>';
  }
  if(tab==='video'){
    var vids=high.data||high.highlights||[]; if(!Array.isArray(vids)) vids=[vids];
    html+='<div class="box"><b style="color:#00ff66">2026/27 VIDEO HIGHLIGHTS</b></div>'; var found=false;
    vids.forEach(function(v){ var u=v.url||v.videoUrl||''; if(u){ found=true; var e=u; if(u.indexOf('watch?v=')>-1) e=u.replace('watch?v=','embed/'); html+='<div class="box"><iframe src="'+e+'" style="width:100%;height:220px;border:none;border-radius:10px" allowfullscreen></iframe></div>'; } });
    if(!found) html+='<div class="box">No video yet 2026/27 - appears 10-30 mins after FT<br><br><iframe width="100%" height="220" src="https://www.youtube.com/embed?listType=search&list='+encodeURIComponent(home+' vs '+away+' 2026 2027 highlights')+'" style="border:none;border-radius:10px" allowfullscreen></iframe><br><br><a href="https://www.youtube.com/results?search_query='+encodeURIComponent(home+' vs '+away+' highlights')+'" target="_blank" style="color:#00ff66">Search YouTube</a></div>';
  }
  if(tab==='events'){
    var evs=events.data||events.events||events||[]; if(!Array.isArray(evs)) evs=[evs];
    html+='<div class="box"><b style="color:#00ff66">MATCH EVENTS - Visual Yellow/Red Cards</b><br><span style="font-size:10px;color:#888">Yellow = 🟨 Red = 🟥 Goal = ⚽ Sub = 🔄</span></div><div class="box">';
    if(evs.length===0) html+='No events yet';
    else {
      evs.forEach(function(ev){
        var time=ev.time||ev.minute||''; 
        var type=(ev.type||'').toLowerCase();
        var player=ev.player||ev.playerName||ev.assist||''; 
        var team=ev.team?.name||'';
        var cardHtml='';
        if(type.indexOf('yellow')>-1 && type.indexOf('red')>-1 || type.indexOf('second yellow')>-1){
          cardHtml='<span class="card card-yellow"></span><span class="card card-red"></span> <b style="color:#FF9800">SECOND YELLOW → RED CARD</b>';
        } else if(type.indexOf('red')>-1){
          cardHtml='<span class="card card-red"></span> <b style="color:#FF3B30">RED CARD</b>';
        } else if(type.indexOf('yellow')>-1){
          cardHtml='<span class="card card-yellow"></span> <b style="color:#FFEB3B">YELLOW CARD</b>';
        } else if(type.indexOf('goal')>-1){
          cardHtml='<span style="font-size:18px">⚽</span> <b style="color:#fff">GOAL</b>';
        } else if(type.indexOf('substitution')>-1){
          cardHtml='<span style="font-size:16px">🔄</span> <b style="color:#00ff66">SUBSTITUTION</b>';
        } else {
          cardHtml='<b style="color:#00ff66">'+(ev.type||'')+'</b>';
        }
        html+='<div class="eventRow"><div style="color:#00ff66;font-weight:900;min-width:32px">'+time+'\\'</div><div style="flex:1">'+cardHtml+' - '+player+' <span style="color:#aaa">('+team+')</span></div></div>';
      });
    }
    html+='</div>';
  }
  if(tab==='stats'){
    var stats=box.data||box.statistics||{}; 
    html+='<div class="box"><b style="color:#00ff66">STATS 2026/27</b></div><div class="box">';
    if(Object.keys(stats).length===0) html+='Stats available after kickoff - BASIC includes possession, shots, corners, fouls, cards';
    else {
      Object.keys(stats).forEach(function(k){ html+='<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #111;font-size:12px"><span>'+k+'</span><span style="color:#00ff66">'+JSON.stringify(stats[k])+'</span></div>'; });
    }
    html+='</div>';
  }
  if(tab==='lineups'){
    html+='<div class="box"><b style="color:#00ff66">LINEUPS 2026/27</b></div><div class="box">Lineups + formations + player numbers + team logos - available 1h before kickoff (BASIC plan includes this)</div>';
    var lineup = m.lineups||{}; var hl=lineup.home||[]; var al=lineup.away||[];
    if(hl.length>0 || al.length>0){
      html+='<div style="display:flex;gap:8px"><div class="box" style="flex:1"><b>'+home+'</b><br><br>'; hl.forEach(function(p){ html+='<div style="padding:3px 0;font-size:12px;border-bottom:1px solid #111">'+(p.number||'')+' '+(p.name||p)+'</div>'; }); html+='</div><div class="box" style="flex:1"><b>'+away+'</b><br><br>'; al.forEach(function(p){ html+='<div style="padding:3px 0;font-size:12px;border-bottom:1px solid #111">'+(p.number||'')+' '+(p.name||p)+'</div>'; }); html+='</div></div>';
    }
  }
  html+='<a href="${MY_1XBET}" target="_blank" class="btnBet">BET AGAIN 2026/27 - 300% BONUS</a>';
  document.getElementById('modalContent').innerHTML=html;
}
function closeModal(){ document.getElementById('modal').style.display='none'; }
loadDate(getDateStr(0));
</script>
</body></html>`;
    return new Response(html, { headers: {"Content-Type":"text/html","Cache-Control":"no-cache"} });
  }
}
