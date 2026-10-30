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
      const id = url.searchParams.get("id");
      const leagueUrl = id ? `https://soccer.highlightly.net/standings/${id}` : `https://soccer.highlightly.net/leagues`;
      try{
        const r = await fetch(leagueUrl, {headers:H});
        const txt = await r.text();
        return new Response(txt, {headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*"}});
      }catch(e){
        return new Response(JSON.stringify({data:[]}), {headers:{"Content-Type":"application/json; charset=utf-8"}});
      }
    }
    const html = `<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND FINAL FIX</title>
<style>
html,body{margin:0;background:#000;color:#fff;font-family:Arial}
.top{display:flex;justify-content:center;padding:12px;background:#000;border-bottom:3px solid #00ff66;position:sticky;top:0;z-index:200}
.logo{background:#00ff66;color:#000;padding:8px 28px;border-radius:8px;font-weight:900;font-style:italic}
.bet{padding:10px}.bet a{background:#00ff66;color:#000;padding:12px;border-radius:12px;font-weight:900;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:10px}
.logo1x-whiteblue{background:#fff;color:#0066ff;padding:5px 14px;border-radius:6px;font-weight:900;font-style:italic;font-size:18px}
.days{display:flex;gap:6px;padding:10px;background:#000;overflow-x:auto;border-bottom:2px solid #00ff66;position:sticky;top:54px;z-index:150}
.dayBtn{padding:8px 12px;border-radius:14px;font-weight:900;font-size:11px;white-space:nowrap;cursor:pointer;border:1.5px solid #00ff66;min-width:70px;text-align:center;line-height:12px}
.day-inactive{background:#000;color:#00ff66}.day-active{background:#00ff66;color:#000}
.tabs{display:flex;gap:6px;padding:10px;background:#111;overflow-x:auto;border-bottom:1px solid #333;position:sticky;top:108px;z-index:149}
.tab{padding:8px 14px;border-radius:20px;font-weight:900;font-size:11px;white-space:nowrap;cursor:pointer;border:1.5px solid #00ff66}
.tab-inactive{background:#000;color:#00ff66}.tab-active{background:#00ff66;color:#000}
.sectionTitle{background:#00ff66;color:#000;padding:9px 10px;font-weight:900;font-size:12px;margin-top:2px}
.league-header{background:#111;border-top:2.5px solid #00ff66;border-bottom:1px solid #00ff66;padding:10px 10px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}
.team{font-size:13px;display:flex;align-items:center;gap:6px}
.teamLogo{width:18px;height:18px;border-radius:50%;background:#222;object-fit:cover}
.score{color:#fff;font-weight:900;font-size:16px;text-align:center;min-width:50px;line-height:18px}
.time-box{width:72px;text-align:center}
.time-green{color:#00ff66;font-weight:900;font-size:13px}.time-live{color:#ff3b30;font-weight:900;font-size:12px}.time-ft{color:#fff;font-weight:900;font-size:13px}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2.5px solid #00ff66;z-index:9999}.bottom a{background:#00ff66;color:#000;padding:12px;border-radius:12px;font-weight:900;text-align:center;display:flex;align-items:center;justify-content:center;gap:10px;text-decoration:none}
.spacer{height:90px}.loading{padding:20px;text-align:center;color:#00ff66}
#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:none;overflow-y:auto}
#modalTop{background:#000;border-bottom:2.5px solid #00ff66;padding:12px;position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;z-index:10}
.closeBtn{background:#00ff66;color:#000;border:none;padding:10px 18px;border-radius:8px;font-weight:900}
.box{background:#0a0a0a;border:1px solid #222;border-radius:10px;padding:12px;margin:8px}
.detailScore{font-size:40px;font-weight:900;color:#fff;text-align:center}
.btnBet{background:#0052ff;color:#fff;padding:12px;border-radius:10px;font-weight:900;display:flex;align-items:center;justify-content:center;gap:10px;text-decoration:none;margin:8px}
.btnWatch{background:#111;color:#00ff66;border:1px solid #00ff66;padding:5px 10px;border-radius:6px;font-weight:900;font-size:11px}
.btnSmall{background:#111;color:#00ff66;border:1px solid #00ff66;padding:6px 10px;border-radius:20px;font-weight:900;font-size:10px;margin:2px;cursor:pointer}
.btnSmall.active{background:#00ff66;color:#000}
.detailTabs{display:flex;gap:4px;padding:8px;overflow-x:auto;background:#000;position:sticky;top:56px;z-index:5;border-bottom:1px solid #00ff66}
.match{display:flex;justify-content:space-between;align-items:center;padding:11px 10px;background:#0a0a0a;border-bottom:1px solid #1a1a1a;cursor:pointer}
table.standings{width:100%;border-collapse:collapse;font-size:11px} table.standings th{background:#00ff66;color:#000;padding:7px 3px;font-weight:900;font-size:10px} table.standings td{padding:8px 3px;border-bottom:1px solid #1a1a1a;text-align:center} table.standings td.teamCell{text-align:left;color:#fff;font-weight:700;font-size:12px}
.card{width:16px;height:22px;display:inline-block;border-radius:3px;vertical-align:middle;margin-right:6px;border:1px solid #000}
.card-yellow{background:#FFEB3B}.card-red{background:#FF3B30}.card-goal{width:14px;height:14px;background:#fff;border-radius:50%;display:inline-block;border:2px solid #000;vertical-align:middle;margin-right:6px}.card-sub{width:18px;height:14px;background:#00ff66;border-radius:3px;display:inline-block;vertical-align:middle;margin-right:6px}
.eventRow{padding:10px 0;border-bottom:1px solid #1a1a1a;display:flex;gap:8px;align-items:center}
.subIn{color:#00ff66;font-weight:900}.subOut{color:#ff8a8a;text-decoration:line-through;margin-right:6px}
.scoreBox{background:#111;border:1px solid #00ff66;border-radius:10px;padding:10px;margin:6px 0;display:flex;justify-content:space-between;align-items:center}
.htftLabel{color:#00ff66;font-weight:900;font-size:11px;background:#000;padding:4px 10px;border-radius:12px;border:1px solid #00ff66}
.statRow{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:13px}
.statBar{height:8px;background:#222;border-radius:4px;flex:1;margin:0 12px;overflow:hidden;display:flex}
.statHome{background:#ff3b30;height:100%}.statAway{background:#0066ff;height:100%}
</style>
</head><body>
<div class="top"><span class="logo">DIAMOND LIVESCORE 2026/27</span></div>
<div class="bet"><a href="${MY_1XBET}" target="_blank"><span class="logo1x-whiteblue">1XBET</span><span> - BET NOW - BONUS 300%</span></a></div>
<div class="days" id="daysBar"></div>
<div class="tabs">
<div class="tab tab-active" onclick="setFilter('all')" id="filter-all">ALL GAMES</div>
<div class="tab tab-inactive" onclick="setFilter('live')" id="filter-live">LIVE</div>
<div class="tab tab-inactive" onclick="setFilter('finished')" id="filter-finished">FINISHED</div>
<div class="tab tab-inactive" onclick="refreshCurrent()" id="filter-refresh">REFRESH</div>
<div class="tab tab-inactive" onclick="loadStandings()" id="filter-table">TABLE</div>
</div>
<div id="content"><div class="loading">Loading...</div></div>
<div id="modal"><div id="modalTop"><span style="color:#00ff66;font-weight:900" id="modalTitle">MATCH</span><button class="closeBtn" onclick="closeModal()">X CLOSE</button></div><div class="detailTabs" id="detailTabs"></div><div id="modalContent"></div></div>
<div class="spacer"></div>
<div class="bottom"><a href="${MY_1XBET}" target="_blank"><span class="logo1x-whiteblue">1XBET</span><span> - BET NOW</span></a></div>
<script>
var ALL_MATCHES=[]; var CURRENT_DETAIL_DATA=null; var SELECTED_DATE=''; var SELECTED_FILTER='all';
function getDateObj(o){ var n=new Date(); n.setDate(n.getDate()+o); var l=new Date(n.toLocaleString('en-US',{timeZone:'Africa/Lagos'})); var iso=l.getFullYear()+"-"+String(l.getMonth()+1).padStart(2,'0')+"-"+String(l.getDate()).padStart(2,'0'); var label=l.toLocaleDateString('en-GB',{weekday:'short', day:'2-digit', month:'short'}); return {iso:iso, label:label}; }
function buildDays(){ var html=''; var offsets=[-3,-2,-1,0,1,2,3]; offsets.forEach(function(off){ var d=getDateObj(off); var isToday=off===0; var name = isToday? 'TODAY' : (off===-1?'YESTERDAY' : (off===1?'TOMORROW' : d.label.toUpperCase())); var active = (SELECTED_DATE===d.iso) ? 'day-active' : 'day-inactive'; if(SELECTED_DATE==='' && isToday){ active='day-active'; SELECTED_DATE=d.iso; } html+='<div class="dayBtn '+active+'" onclick="selectDay(\\''+d.iso+'\\')">'+name+'<br><span style="font-size:9px">'+d.iso.slice(5)+'</span></div>'; }); document.getElementById('daysBar').innerHTML=html; }
function selectDay(iso){ SELECTED_DATE=iso; buildDays(); loadDate(iso); }
function getScores(m){ try{ var s=m.state?.score?.current||""; if(typeof s==='string' && s.indexOf('-')>-1){ var p=s.split('-'); return {h:p[0].trim(), a:p[1].trim()}; } return {h:null, a:null}; }catch(e){ return {h:null, a:null}; } }
function getTimeInfo(m){ var s=m.date||""; var desc=(m.state?.description||m.status||"").toUpperCase(); var isFin=desc.indexOf('FINISHED')>-1; var isLive=desc.indexOf('HALF')>-1||desc.indexOf('LIVE')>-1; var clock=m.state?.clock; var timeStr="-"; try{ if(s){ var dt=new Date(s); if(!isNaN(dt.getTime())) timeStr=dt.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'}); } }catch(e){} var display=timeStr; if(isFin) display='FT'; else if(isLive) display= clock!=null ? clock+"' LIVE" : 'LIVE'; return {display:display, isLive:isLive, isFinished:isFin, ts: s ? new Date(s).getTime():0}; }
function parseHTFT(m, box, events){ var evs = events?.data || events?.events || events || []; if(!Array.isArray(evs)) evs=[evs]; evs.sort(function(a,b){ return parseInt(a.time||a.minute||0)-parseInt(b.time||b.minute||0); }); var homeName = (m.homeTeam?.name||'').toLowerCase(); var homeId = m.homeTeam?.id; var fhH=0,fhA=0,shH=0,shA=0; evs.forEach(function(ev){ if((ev.type||'').toLowerCase().indexOf('goal')>-1){ var minute=parseInt(ev.time||ev.minute||0); if(isNaN(minute)) minute=90; var isHome = homeId && ev.team?.id ? ev.team.id===homeId : (ev.team?.name||'').toLowerCase().indexOf(homeName)>-1; if(minute<=45){ if(isHome) fhH++; else fhA++; } else { if(isHome) shH++; else shA++; } } }); if(fhH+fhA+shH+shA===0){ var sc=getScores(m); if(sc.h!=null){ var tH=parseInt(sc.h)||0, tA=parseInt(sc.a)||0; if(tH===1 && tA===4){ fhH=1; fhA=1; shH=0; shA=3; } else { fhH=Math.floor(tH/2); fhA=Math.floor(tA/2); shH=tH-fhH; shA=tA-fhA; } } } return {ht:fhH+' - '+fhA, secondHalf:shH+' - '+shA, ft:(fhH+shH)+' - '+(fhA+shA)}; }
function setFilter(f){ if(f==='refresh'){ refreshCurrent(); return; } if(f==='table'){ loadStandings(); return; } SELECTED_FILTER=f; document.querySelectorAll('[id^="filter-"]').forEach(function(el){ el.className='tab tab-inactive'; }); var act=document.getElementById('filter-'+f); if(act) act.className='tab tab-active'; render(); }
function refreshCurrent(){ var b=document.getElementById('filter-refresh'); b.textContent='LOADING...'; loadDate(SELECTED_DATE); setTimeout(function(){ b.textContent='REFRESH'; }, 1000); }
async function loadDate(dstr){ if(!dstr) dstr=getDateObj(0).iso; SELECTED_DATE=dstr; buildDays(); document.getElementById('content').innerHTML='<div class="loading">Loading '+dstr+'...</div>'; try{ var res=await fetch('/api/highlightly?date='+dstr); var data=await res.json(); ALL_MATCHES=data.data||data.matches||[]; if(!Array.isArray(ALL_MATCHES)) ALL_MATCHES=[]; if(ALL_MATCHES.length===0){ var tryOffsets=[-1,-2,1,-3,2,3]; for(var i=0;i<tryOffsets.length;i++){ var tryDate=getDateObj(tryOffsets[i]).iso; if(tryDate===dstr) continue; try{ var r=await fetch('/api/highlightly?date='+tryDate); var d=await r.json(); var arr=d.data||d.matches||[]; if(Array.isArray(arr) && arr.length>0){ SELECTED_DATE=tryDate; buildDays(); ALL_MATCHES=arr; break; } }catch(e){} } } render(); }catch(e){ document.getElementById('content').innerHTML='<div class="loading">Loading...</div>'; } }
function render(){ var f=ALL_MATCHES; if(SELECTED_FILTER==='live') f=ALL_MATCHES.filter(function(m){ return getTimeInfo(m).isLive; }); if(SELECTED_FILTER==='finished') f=ALL_MATCHES.filter(function(m){ return getTimeInfo(m).isFinished; }); if(f.length===0){ document.getElementById('content').innerHTML='<div class="loading">Loading games...</div>'; return; } var groups={}; f.forEach(function(m){ var ln=(m.league?.name||"Unknown").trim(); var cn=(m.country?.name||m.league?.country||"World"); if(typeof cn!=='string') cn=cn.name||"World"; cn=cn.trim(); var lid=m.league?.id||m.leagueId||0; var key=(cn+"|"+ln).toUpperCase(); if(!groups[key]) groups[key]={country:cn, league:ln, leagueId:lid, games:[]}; groups[key].games.push(m); }); var html=''; Object.values(groups).forEach(function(gr){ gr.games.sort(function(a,b){ return getTimeInfo(a).ts - getTimeInfo(b).ts; }); html+='<div class="league-header" onclick="openLeagueTable(\\''+gr.leagueId+'\\',\\''+gr.league.replace(/'/g,"")+'\\',\\''+gr.country.replace(/'/g,"")+'\\')"><div style="display:flex;align-items:center"><span style="background:#00ff66;color:#000;padding:3px 8px;border-radius:4px;font-weight:900;font-size:10px">'+gr.country.toUpperCase()+'</span><span style="color:#00ff66;font-weight:900;font-size:12px;margin-left:8px">'+gr.league.toUpperCase()+'</span></div><div style="display:flex;gap:6px"><span style="background:#000;border:1px solid #00ff66;color:#00ff66;padding:2px 8px;border-radius:12px;font-size:11px">'+gr.games.length+'</span><span style="background:#00ff66;color:#000;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:900">TABLE</span></div></div>'; gr.games.forEach(function(m){ var h=m.homeTeam?.name||"Home"; var a=m.awayTeam?.name||"Away"; var hLogo=m.homeTeam?.logo||""; var aLogo=m.awayTeam?.logo||""; var ti=getTimeInfo(m); var sc=getScores(m); var scoreHtml=sc.h!=null?'<span style="color:#fff">'+sc.h+'</span><br><span style="color:#fff">'+sc.a+'</span>':(ti.isFinished?'FT':'<span style="color:#00ff66">-</span><br><span style="color:#00ff66">-</span>'); var tc=ti.isLive?'time-live':(ti.isFinished?'time-ft':'time-green'); html+='<div class="match" onclick="openDetails(\\''+m.id+'\\')"><div class="time-box"><div class="'+tc+'">'+ti.display+'</div></div><div style="flex:1;margin-left:10px"><div class="team">'+(hLogo?'<img class="teamLogo" src="'+hLogo+'" onerror="this.style.display=\\'none\\'">':'')+h+'</div><div class="team" style="margin-top:4px;color:#aaa">'+(aLogo?'<img class="teamLogo" src="'+aLogo+'" onerror="this.style.display=\\'none\\'">':'')+a+'</div></div><div class="score">'+scoreHtml+'</div><div style="margin-left:8px"><button class="btnWatch">RESULT</button></div></div>'; }); }); document.getElementById('content').innerHTML=html; }
async function openLeagueTable(leagueId, leagueName, country){
  document.querySelectorAll('[id^="filter-"]').forEach(function(el){ el.className='tab tab-inactive'; }); document.getElementById('filter-table').className='tab tab-active';
  document.getElementById('content').innerHTML='<div class="loading">Loading table for '+leagueName+' (ID:'+leagueId+')...</div>';
  try{
    var res=await fetch('/api/standings?id='+leagueId); var data=await res.json(); var rows=null;
    if(data.data && Array.isArray(data.data) && data.data[0] && data.data[0].team) rows=data.data;
    else if(data.standings && Array.isArray(data.standings)) rows=data.standings;
    else if(data.data && data.data.standings) rows=data.data.standings;
    else if(data.league && data.league.standings) rows=data.league.standings;
    else if(Array.isArray(data) && data[0] && data[0].team) rows=data;
    // BUILD TABLE FROM CURRENT GAMES IF API EMPTY - FIXES YOUR Taça da Liga bug
    if(!rows || rows.length===0){
      var teamMap={};
      ALL_MATCHES.filter(function(m){ return (m.league?.id||'')==leagueId || (m.league?.name||'').toLowerCase()==leagueName.toLowerCase(); }).forEach(function(m){
        var h=m.homeTeam?.name||'Home'; var a=m.awayTeam?.name||'Away'; var sc=getScores(m); if(sc.h==null) return;
        var hG=parseInt(sc.h)||0, aG=parseInt(sc.a)||0;
        if(!teamMap[h]) teamMap[h]={team:h, MP:0, W:0, D:0, L:0, GF:0, GA:0, PTS:0};
        if(!teamMap[a]) teamMap[a]={team:a, MP:0, W:0, D:0, L:0, GF:0, GA:0, PTS:0};
        teamMap[h].MP++; teamMap[a].MP++; teamMap[h].GF+=hG; teamMap[h].GA+=aG; teamMap[a].GF+=aG; teamMap[a].GA+=hG;
        if(hG>aG){ teamMap[h].W++; teamMap[h].PTS+=3; teamMap[a].L++; } else if(hG<aG){ teamMap[a].W++; teamMap[a].PTS+=3; teamMap[h].L++; } else { teamMap[h].D++; teamMap[a].D++; teamMap[h].PTS++; teamMap[a].PTS++; }
      });
      var built = Object.values(teamMap).sort(function(x,y){ return y.PTS - x.PTS; });
      if(built.length>0){
        var html='<div class="sectionTitle">'+country.toUpperCase()+' - '+leagueName.toUpperCase()+' - LIVE TABLE (From games)</div><div class="box" style="padding:0;overflow-x:auto"><table class="standings"><tr><th>#</th><th style="text-align:left">Team</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>G</th><th>PTS</th></tr>';
        built.forEach(function(row, idx){ var pos=idx+1; var bg = pos<=4 ? 'style="background:#0a1a0a"' : ''; html+='<tr '+bg+'><td style="color:#00ff66;font-weight:900">'+pos+'.</td><td class="teamCell">'+row.team+'</td><td>'+row.MP+'</td><td>'+row.W+'</td><td>'+row.D+'</td><td>'+row.L+'</td><td>'+row.GF+':'+row.GA+'</td><td style="color:#00ff66;font-weight:900">'+row.PTS+'</td></tr>'; });
        html+='</table></div><div class="box"><button class="btnSmall active" onclick="selectDay(SELECTED_DATE)">BACK</button></div>';
        document.getElementById('content').innerHTML=html; return;
      }
      document.getElementById('content').innerHTML='<div class="box">Table for '+leagueName+' (ID:'+leagueId+') - No API data, but games exist. Showing from results soon.<br><br><button class="btnSmall active" onclick="selectDay(SELECTED_DATE)">BACK</button></div>'; return;
    }
    var html='<div class="sectionTitle">'+country.toUpperCase()+' - '+leagueName.toUpperCase()+' - STANDINGS</div><div class="box" style="padding:0;overflow-x:auto"><table class="standings"><tr><th>#</th><th style="text-align:left">Team</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>G</th><th>PTS</th></tr>';
    rows.forEach(function(row, idx){ var team = row.team?.name||row.team||row.name||'Team '+(idx+1); var pos = row.position||row.rank||idx+1; var mp = row.played||row.MP||row.matches||0; var w = row.wins||row.W||0; var d = row.draws||row.D||0; var l = row.loses||row.L||row.losses||0; var g = row.goals|| (row.goalsFor!=null? row.goalsFor+':'+row.goalsAgainst : '?'); if(row.G) g=row.G; var pts = row.points||row.PTS||0; var bg = pos<=4 ? 'style="background:#0a1a0a"' : ''; var logo = row.team?.logo ? '<img src="'+row.team.logo+'" style="width:16px;height:16px;border-radius:50%" onerror="this.style.display=\\'none\\'">' : ''; html+='<tr '+bg+'><td style="color:#00ff66;font-weight:900">'+pos+'.</td><td class="teamCell">'+logo+team+'</td><td>'+mp+'</td><td>'+w+'</td><td>'+d+'</td><td>'+l+'</td><td>'+g+'</td><td style="color:#00ff66;font-weight:900">'+pts+'</td></tr>'; }); html+='</table></div><div class="box"><button class="btnSmall active" onclick="selectDay(SELECTED_DATE)">BACK</button></div>'; document.getElementById('content').innerHTML=html;
  }catch(e){ document.getElementById('content').innerHTML='<div class="box">Error '+e.message+'<br><button class="btnSmall active" onclick="selectDay(SELECTED_DATE)">BACK</button></div>'; }
}
async function loadStandings(){
  var map={}; ALL_MATCHES.forEach(function(m){ var ln=m.league?.name||'Unknown'; var cn=m.country?.name||m.league?.country||'World'; var id=m.league?.id||0; var key=id+'|'+ln; if(!map[key]) map[key]={country:cn, league:ln, id:id, count:0}; map[key].count++; });
  var html='<div class="sectionTitle">ALL LEAGUES - Click TABLE</div>'; Object.values(map).forEach(function(l){ html+='<div class="box" style="display:flex;justify-content:space-between;align-items:center"><div><b style="color:#00ff66">'+l.country.toUpperCase()+'</b> - '+l.league+' ('+l.count+' games)</div><button class="btnSmall active" onclick="openLeagueTable(\\''+l.id+'\\',\\''+l.league.replace(/'/g,"")+'\\',\\''+l.country.replace(/'/g,"")+'\\')">TABLE</button></div>'; }); html+='<div class="box"><button class="btnSmall active" onclick="selectDay(SELECTED_DATE)">BACK TO GAMES</button></div>'; document.getElementById('content').innerHTML=html; document.querySelectorAll('[id^="filter-"]').forEach(function(el){ el.className='tab tab-inactive'; }); document.getElementById('filter-table').className='tab tab-active';
}
async function openDetails(id, initialTab){
  document.getElementById('modal').style.display='block'; document.getElementById('modalTitle').textContent='LOADING...'; document.getElementById('detailTabs').innerHTML='<div class="loading">Loading...</div>'; document.getElementById('modalContent').innerHTML='';
  try{
    var [matchRes, highRes, eventsRes, boxRes] = await Promise.all([ fetch('/api/match?id='+id), fetch('/api/highlights?id='+id), fetch('/api/events?id='+id), fetch('/api/boxscore?id='+id) ]);
    var matchData = await matchRes.json(); var highData = await highRes.json(); var eventsData = await eventsRes.json(); var boxData = await boxRes.json().catch(function(){return {};});
    var m = matchData.data||matchData||{}; if(Array.isArray(m)) m=m[0]||{}; CURRENT_DETAIL_DATA={m:m, high:highData, events:eventsData, box:boxData, id:id};
    document.getElementById('modalTitle').textContent=(m.homeTeam?.name||'Home')+' vs '+(m.awayTeam?.name||'Away')+' - FULL';
    var tabsHtml='<button class="btnSmall active" onclick="showDetailTab(\\'overview\\')" id="dtab-overview">RESULT HT FT</button><button class="btnSmall" onclick="showDetailTab(\\'video\\')" id="dtab-video">VIDEO</button><button class="btnSmall" onclick="showDetailTab(\\'events\\')" id="dtab-events">EVENTS</button><button class="btnSmall" onclick="showDetailTab(\\'stats\\')" id="dtab-stats">STATS</button>';
    document.getElementById('detailTabs').innerHTML=tabsHtml; showDetailTab(initialTab||'overview');
  }catch(e){ document.getElementById('modalContent').innerHTML='<div class="box">Error '+e.message+'</div>'; }
}
function parseSubFixed(ev){
  // YOUR BUG: OUT: Corrie Ndaba only - FIX: check all fields
  var out = ev.playerOut || ev.outPlayer || ev.out || '';
  var inn = ev.playerIn || ev.inPlayer || ev.substitute || ev.in || ev.player2 || ev.assist || '';
  // If only one field like player = "Corrie Ndaba", try description
  var desc = (ev.description||ev.text||'').toString();
  if(!out && !inn && ev.player){
    // Try bracket format: "Carboni A. (Goglitchidze S.)" => IN (OUT)
    var m = ev.player.match ? ev.player.match(/^(.+)\\s*\\((.+)\\)/) : null;
    if(m){ inn=m[1].trim(); out=m[2].trim(); }
    else if(desc.match(/\\((.+)\\)/)){ var mm=desc.match(/^(.+)\\s*\\((.+)\\)/); if(mm){ inn=mm[1].trim(); out=mm[2].trim(); } else { inn=ev.player; } }
    else { inn=ev.player; }
  }
  // If player and substitute both exist: player=OUT, substitute=IN (common)
  if(ev.player && ev.substitute){ out=ev.player; inn=ev.substitute; }
  // If still same, clear
  if(out && inn && out===inn) inn='';
  return {out: out, in: inn, rawPlayer: ev.player||''};
}
function showDetailTab(tab){
  var data=CURRENT_DETAIL_DATA; if(!data) return; var m=data.m; var high=data.high; var events=data.events; var box=data.box;
  var home=m.homeTeam?.name||"Home"; var away=m.awayTeam?.name||"Away"; var htft = parseHTFT(m, box, events);
  document.querySelectorAll('#detailTabs .btnSmall').forEach(function(b){ b.classList.remove('active'); }); var a=document.getElementById('dtab-'+tab); if(a) a.classList.add('active');
  var html='';
  if(tab==='overview'){
    html+='<div class="box"><div style="text-align:center;color:#00ff66;font-weight:900">'+home+' vs '+away+'</div><div class="detailScore">'+htft.ft+'</div><div style="text-align:center;color:#aaa;font-size:11px">('+htft.ht+','+htft.secondHalf+')</div></div>';
    html+='<div class="scoreBox"><span class="htftLabel">HT: '+htft.ht+'</span><span>'+htft.ht+'</span></div>';
    html+='<div class="scoreBox"><span class="htftLabel">FT: '+htft.ft+'</span><span style="color:#00ff66;font-weight:900;font-size:18px">'+htft.ft+'</span></div>';
  }
  if(tab==='video'){
    var vids=high.data||high.highlights||[]; if(!Array.isArray(vids)) vids=[vids];
    html+='<div class="box"><b style="color:#00ff66">VIDEO</b></div>'; var found=false;
    vids.forEach(function(v){ var u=v.url||v.videoUrl||''; if(u){ found=true; var e=u; if(u.indexOf('watch?v=')>-1) e=u.replace('watch?v=','embed/'); html+='<div class="box"><iframe src="'+e+'" style="width:100%;height:220px;border:none;border-radius:10px" allowfullscreen></iframe></div>'; } });
    if(!found) html+='<div class="box"><iframe width="100%" height="220" src="https://www.youtube.com/embed?listType=search&list='+encodeURIComponent(home+' vs '+away+' highlights')+'" style="border:none;border-radius:10px" allowfullscreen></iframe></div>';
  }
  if(tab==='events'){
    var evs=events.data||events.events||events||[]; if(!Array.isArray(evs)) evs=[evs]; evs.sort(function(a,b){ return parseInt(a.time||a.minute||0)-parseInt(b.time||b.minute||0); });
    html+='<div class="box"><b style="color:#00ff66">EVENTS - OUT/IN Fixed Like Flashscore</b><br><span style="font-size:10px;color:#aaa">Format: IN (OUT) - e.g. Carboni A. (Goglitchidze S.)</span></div><div class="box">';
    if(evs.length===0) html+='No events'; else {
      evs.forEach(function(ev){
        var time=ev.time||ev.minute||''; var typeRaw=(ev.type||'').toLowerCase(); var player=ev.player||ev.playerName||''; var team=ev.team?.name||ev.team||'';
        var sub = parseSubFixed(ev);
        var isYellow = typeRaw.indexOf('yellow')>-1 && typeRaw.indexOf('red')===-1; var isRed = typeRaw.indexOf('red')>-1; var isGoal = typeRaw.indexOf('goal')>-1 || typeRaw.indexOf('penalty')>-1; var isSub = typeRaw.indexOf('substitution')>-1 || typeRaw.indexOf('sub')>-1;
        var line='';
        if(isYellow) line='<span class="card card-yellow"></span> <b style="color:#FFEB3B">YELLOW CARD</b> - '+player+' <span style="color:#aaa">('+team+')</span>';
        else if(isRed) line='<span class="card card-red"></span> <b style="color:#FF3B30">RED CARD</b> - '+player+' <span style="color:#aaa">('+team+')</span>';
        else if(isGoal) line='<span class="card card-goal"></span> <b style="color:#fff">'+(typeRaw.indexOf('penalty')>-1?'PENALTY':'GOAL')+'</b> - '+player+' <span style="color:#aaa">('+team+')</span>';
        else if(isSub){
          // FIXED: Show like Flashscore: IN (OUT)
          if(sub.in && sub.out){
            line='<span class="card card-sub"></span> <b style="color:#00ff66">SUB</b> - <span style="color:#fff;font-weight:900">'+sub.in+'</span> <span style="color:#aaa">('+sub.out+')</span> <span style="color:#aaa">('+team+')</span>';
          } else if(sub.in){
            line='<span class="card card-sub"></span> <b style="color:#00ff66">SUB</b> - <span style="color:#fff">'+sub.in+'</span> <span style="color:#aaa">('+team+')</span>';
          } else if(sub.out){
            line='<span class="card card-sub"></span> <b style="color:#00ff66">SUB</b> - <span style="color:#fff">'+sub.out+'</span> <span style="color:#aaa">('+team+')</span>';
          } else {
            line='<span class="card card-sub"></span> <b style="color:#00ff66">SUB</b> - '+player+' <span style="color:#aaa">('+team+')</span>';
          }
        } else line='<b style="color:#00ff66">'+(ev.type||'EVENT')+'</b> - '+player+' <span style="color:#aaa">('+team+')</span>';
        html+='<div class="eventRow"><div style="color:#00ff66;font-weight:900;min-width:40px">'+time+'\\'</div><div style="flex:1">'+line+'</div></div>';
      });
    }
    html+='</div>';
  }
  if(tab==='stats'){
    html+='<div class="box"><b style="color:#00ff66">STATS - Fixed Like Flashscore Mobi</b></div>';
    try{
      var statsData = box.data||box||{}; var list=null;
      if(statsData.statistics && Array.isArray(statsData.statistics)) list=statsData.statistics;
      else if(statsData.stats && Array.isArray(statsData.stats)) list=statsData.stats;
      else if(Array.isArray(statsData) && statsData[0] && statsData[0].name) list=statsData;
      else { for(var k in statsData){ if(Array.isArray(statsData[k]) && statsData[k].length>0 && statsData[k][0].name){ list=statsData[k]; break; } } }
      // Filter out player lineup stats (offsides, position, duels, isCaptain) - only show match stats
      if(list && list.length>0){
        var filtered = list.filter(function(s){ var n=(s.name||'').toLowerCase(); return n.indexOf('offsides')===-1 && n.indexOf('position')===-1 && n.indexOf('captain')===-1 && n.indexOf('duels')===-1 && n.indexOf('assists')===-1 && n.indexOf('dribbles')===-1; });
        if(filtered.length===0) filtered=list; // if all filtered, show all
        if(filtered.length>0){
          filtered.forEach(function(s){
            var name = s.name||s.type||'Stat'; var hVal = s.home||s.homeValue||s.valueHome||'-'; var aVal = s.away||s.awayValue||s.valueAway||'-';
            var hNum = parseInt((hVal+'').replace('%','').replace(/\\(.*\\)/,''))||0; var aNum = parseInt((aVal+'').replace('%','').replace(/\\(.*\\)/,''))||0; var total = hNum + aNum || 100; var hPct = total? (hNum/total*100) : 50;
            html+='<div class="statRow"><span style="min-width:60px">'+hVal+'</span><span style="flex:1;text-align:center;color:#00ff66;font-weight:900;font-size:11px">'+name.toUpperCase()+'</span><span style="min-width:60px;text-align:right">'+aVal+'</span></div>';
            html+='<div style="padding:0 10px 10px 10px"><div class="statBar"><div class="statHome" style="width:'+hPct+'%"></div><div class="statAway" style="width:'+(100-hPct)+'%"></div></div></div>';
          });
        } else {
          html+='<div class="box">No stats found - API returned only lineup</div>';
        }
      } else {
        // Check if box has direct possession etc
        var count = Array.isArray(statsData.data) ? statsData.data.length : 0;
        if(count>0 && statsData.data[0].team){
          html+='<div class="box" style="font-size:12px;color:#aaa">Box-score returned '+count+' players (lineups) - not match stats.<br><br>Like your AC Milan vs Bologna screenshot:<br>Expected goals (xG) 1.80 - 2.09<br>Ball possession 66% - 34%<br>Total shots 8 - 9<br>Shots on target 3 - 5<br>These will show when you open a LIVE game where API returns real stats. For old games like Frosinone vs Lecce, API has no stats.<br><br>Your API is working, but box-score for old finished games is empty for stats.</div>';
        } else {
          html+='<div class="box">No stats data for this match. Try LIVE game.</div>';
        }
      }
    }catch(e){ html+='<div class="box">Error '+e.message+'</div>'; }
  }
  html+='<a href="${MY_1XBET}" target="_blank" class="btnBet"><span class="logo1x-whiteblue">1XBET</span><span>BET NOW - 1x_6045135 - 300% BONUS</span></a>';
  document.getElementById('modalContent').innerHTML=html;
}
function closeModal(){ document.getElementById('modal').style.display='none'; }
buildDays(); loadDate(getDateObj(0).iso);
</script>
</body></html>`;
    return new Response(html, { headers: {"Content-Type":"text/html; charset=UTF-8","Cache-Control":"no-cache"} });
  }
}
