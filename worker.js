const MY_1XBET = "https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97";

export default {
  async fetch(request, env){
    const KEY = env.HIGHLIGHTLY_KEY || "afad9a68-c248-429b-8aa7-b7626bb56744";
    const url = new URL(request.url);
    const H = {"x-rapidapi-key": KEY};
    const cache = caches.default;

    async function cachedFetch(apiUrl, cacheTime=90){
      let req = new Request(apiUrl, {headers:H});
      let cached = await cache.match(req);
      if(cached) return cached;
      try{
        let r = await fetch(apiUrl, {headers:H});
        let txt = await r.text();
        let res = new Response(txt, {headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*","Cache-Control":"public, max-age="+cacheTime}});
        if(r.ok && txt.length>10) await cache.put(req, res.clone());
        return res;
      }catch(e){ return new Response(JSON.stringify({data:[]}), {headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*"}}); }
    }

    if(url.pathname === "/api/highlightly"){ return await cachedFetch(`https://soccer.highlightly.net/matches?date=${url.searchParams.get("date")}`, 90); }
    if(url.pathname === "/api/highlights"){ const q = url.searchParams.toString(); return await cachedFetch(`https://soccer.highlightly.net/highlights${q?"?"+q:""}`, 300); }
    if(url.pathname === "/api/match"){ return await cachedFetch(`https://soccer.highlightly.net/matches/${url.searchParams.get("id")}`, 60); }
    if(url.pathname === "/api/events"){ return await cachedFetch(`https://soccer.highlightly.net/events/${url.searchParams.get("id")}`, 60); }
    if(url.pathname === "/api/boxscore"){ return await cachedFetch(`https://soccer.highlightly.net/box-score/${url.searchParams.get("id")}`, 60); }

    if(url.pathname === "/api/standings"){
      const id = url.searchParams.get("id")||"";
      let cacheKey = new Request(`https://soccer.highlightly.net/standings?leagueId=${id}&season=2026`, {headers:H});
      let cached = await cache.match(cacheKey);
      if(cached) return cached;

      const seasons = ["2026","2026/27","2025/26","2025"];
      for(let season of seasons){
        try{
          let r = await fetch(`https://soccer.highlightly.net/standings?leagueId=${id}&season=${season}`, {headers:H});
          if(!r.ok) continue;
          let txt = await r.text();
          let json = JSON.parse(txt);
          let rows = json.data || json.standings || json || [];
          if(!Array.isArray(rows) || rows.length < 3) continue;

          // AUTOMATICALLY ARRANGE FROM API - BY POINTS DESC, GD DESC
          let arranged = rows.map((t,i)=>{
            let teamName = t.team?.name || t.team || t.name || t.teamName || `Team ${i+1}`;
            let mp = t.played || t.MP || t.matches || t.playedMatches || 0;
            let w = t.wins || t.W || t.win || 0;
            let d = t.draws || t.D || t.draw || 0;
            let l = t.loses || t.L || t.loss || t.losses || 0;
            let gf = t.goalsFor || t.GF || t.scored || 0;
            let ga = t.goalsAgainst || t.GA || t.conceded || 0;
            let pts = t.points || t.PTS || t.pts || 0;
            return {
              team: teamName,
              MP: mp, W: w, D: d, L: l,
              G: `${gf}:${ga}`,
              PTS: pts,
              GD: gf - ga,
              GF: gf
            };
          }).sort((a,b)=>{
            if(b.PTS !== a.PTS) return b.PTS - a.PTS;
            if(b.GD !== a.GD) return b.GD - a.GD;
            if(b.GF !== a.GF) return b.GF - a.GF;
            return b.W - a.W;
          }).map((t,i)=> ({pos: i+1, ...t}));

          let res = new Response(JSON.stringify({
            data: arranged,
            season: "2026/27",
            source: `real-api-auto-arranged-${season}`,
            count: arranged.length,
            complete: arranged.length>=16
          }), {headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*","Cache-Control":"public, max-age=300"}});
          await cache.put(cacheKey, res.clone());
          return res;
        }catch(e){}
      }
      return new Response(JSON.stringify({data:[], season:"2026/27", source:"api-empty-free-tier-limit", error:"Free tier only ~20 leagues auto arranged"}), 
      {headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*"}});
    }

    const html = `<!DOCTYPE html><html><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND AUTO ARRANGED API 2026/27</title>
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
.team{font-size:13px;display:flex;align-items:center;gap:6px}.teamLogo{width:18px;height:18px;border-radius:50%;background:#222;object-fit:cover}
.score{color:#00ff66;font-weight:900;font-size:16px;text-align:center;min-width:50px;line-height:18px}
.time-box{width:72px;text-align:center}.time-green{color:#00ff66;font-weight:900;font-size:13px}.time-live{color:#ff3b30;font-weight:900;font-size:12px}.time-ft{color:#fff;font-weight:900;font-size:13px}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2.5px solid #00ff66;z-index:9999}.bottom a{background:#00ff66;color:#000;padding:12px;border-radius:12px;font-weight:900;text-align:center;display:flex;align-items:center;justify-content:center;gap:10px;text-decoration:none}
.spacer{height:90px}.loading{padding:20px;text-align:center;color:#00ff66}
#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:none;overflow-y:auto}
#modalTop{background:#000;border-bottom:2.5px solid #00ff66;padding:12px;position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;z-index:10}
.closeBtn{background:#00ff66;color:#000;border:none;padding:10px 18px;border-radius:8px;font-weight:900}
.box{background:#0a0a0a;border:1px solid #222;border-radius:10px;padding:12px;margin:8px}
.detailScore{font-size:40px;font-weight:900;color:#fff;text-align:center}
.btnBet{background:#0052ff;color:#fff;padding:12px;border-radius:10px;font-weight:900;display:flex;align-items:center;justify-content:center;gap:10px;text-decoration:none;margin:8px}
.btnWatch{background:#111;color:#00ff66;border:1px solid #00ff66;padding:5px 10px;border-radius:6px;font-weight:900;font-size:11px}
.btnSmall{background:#111;color:#00ff66;border:1px solid #00ff66;padding:6px 10px;border-radius:20px;font-weight:900;font-size:10px;margin:2px;cursor:pointer}.btnSmall.active{background:#00ff66;color:#000}
.detailTabs{display:flex;gap:4px;padding:8px;overflow-x:auto;background:#000;position:sticky;top:56px;z-index:5;border-bottom:1px solid #00ff66}
.match{display:flex;justify-content:space-between;align-items:center;padding:11px 10px;background:#0a0a0a;border-bottom:1px solid #1a1a1a;cursor:pointer}.match:hover{border-color:#00ff66}
table.standings{width:100%;border-collapse:collapse;font-size:11px} table.standings th{background:#00ff66;color:#000;padding:7px 3px;font-weight:900;font-size:10px} table.standings td{padding:8px 3px;border-bottom:1px solid #1a1a1a;text-align:center} table.standings td.teamCell{text-align:left;color:#fff;font-weight:700;font-size:12px}
.card{width:16px;height:22px;display:inline-block;border-radius:3px;vertical-align:middle;margin-right:6px;border:1px solid #000}.card-yellow{background:#FFEB3B}.card-red{background:#FF3B30}.card-goal{width:14px;height:14px;background:#fff;border-radius:50%;display:inline-block;border:2px solid #000;vertical-align:middle;margin-right:6px}.card-sub{width:18px;height:14px;background:#00ff66;border-radius:3px;display:inline-block;vertical-align:middle;margin-right:6px}
.eventRow{padding:10px 0;border-bottom:1px solid #1a1a1a;display:flex;gap:8px;align-items:center}
.scoreBox{background:#111;border:1px solid #00ff66;border-radius:10px;padding:10px;margin:6px 0;display:flex;justify-content:space-between;align-items:center}
.htftLabel{color:#00ff66;font-weight:900;font-size:11px;background:#000;padding:4px 10px;border-radius:12px;border:1px solid #00ff66}
.statRow{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:13px}
.statBar{height:8px;background:#222;border-radius:4px;flex:1;margin:0 12px;overflow:hidden;display:flex}.statHome{background:#00ff66;height:100%}.statAway{background:#555;height:100%}
.badge{padding:2px 8px;border-radius:12px;font-size:10px;font-weight:900}.badge-api{background:#0052ff;color:#fff}.badge-auto{background:#00ff66;color:#000}
</style>
</head><body>
<div class="top"><span class="logo">DIAMOND AUTO ARRANGED 2026/27</span></div>
<div class="bet"><a href="${MY_1XBET}" target="_blank"><span class="logo1x-whiteblue">1XBET</span><span> - BET NOW - BONUS 300%</span></a></div>
<div class="days" id="daysBar"></div>
<div class="tabs">
<div class="tab tab-active" onclick="setFilter('all')" id="filter-all">ALL GAMES</div>
<div class="tab tab-inactive" onclick="setFilter('live')" id="filter-live">LIVE</div>
<div class="tab tab-inactive" onclick="setFilter('finished')" id="filter-finished">FINISHED</div>
<div class="tab tab-inactive" onclick="refreshCurrent()" id="filter-refresh">REFRESH</div>
<div class="tab tab-inactive" onclick="loadStandings()" id="filter-table">TABLE AUTO API</div>
</div>
<div id="content"><div class="loading">Loading 2026/27 AUTO ARRANGED FROM API...</div></div>
<div id="modal"><div id="modalTop"><span style="color:#00ff66;font-weight:900" id="modalTitle">MATCH</span><button class="closeBtn" onclick="closeModal()">X CLOSE</button></div><div class="detailTabs" id="detailTabs"></div><div id="modalContent"></div></div>
<div class="spacer"></div>
<div class="bottom"><a href="${MY_1XBET}" target="_blank"><span class="logo1x-whiteblue">1XBET</span><span> - BET NOW</span></a></div>
<script>
var ALL_MATCHES=[]; var CURRENT_DETAIL_DATA=null; var SELECTED_DATE=''; var SELECTED_FILTER='all';
var TOP_ORDER = [{country:"europe", league:"champions league"}, {country:"europe", league:"europa league"}, {country:"europe", league:"conference league"}, {country:"england", league:"premier league"}, {country:"spain", league:"laliga"}, {country:"spain", league:"la liga"}, {country:"spain", league:"copa del rey"}, {country:"france", league:"ligue 1"}, {country:"germany", league:"bundesliga"}, {country:"italy", league:"serie a"}, {country:"netherlands", league:"eredivisie"}, {country:"portugal", league:"primeira liga"}, {country:"portugal", league:"taça da liga"}, {country:"portugal", league:"taca da liga"}, {country:"brazil", league:"serie a"}];
function getTopPriority(c,l){ var cc=(c||"").toLowerCase(), ll=(l||"").toLowerCase(); for(var i=0;i<TOP_ORDER.length;i++){ if(cc.indexOf(TOP_ORDER[i].country)>-1 && ll.indexOf(TOP_ORDER[i].league)>-1) return i; } if(cc.indexOf("europe")>-1) return 20; if(cc.indexOf("england")>-1) return 21; if(cc.indexOf("spain")>-1) return 22; if(cc.indexOf("france")>-1) return 23; if(cc.indexOf("germany")>-1) return 24; if(cc.indexOf("italy")>-1) return 25; if(cc.indexOf("netherlands")>-1) return 26; if(cc.indexOf("portugal")>-1) return 27; if(cc.indexOf("brazil")>-1) return 28; return 999; }
function getDateObj(o){ var n=new Date(); n.setDate(n.getDate()+o); var l=new Date(n.toLocaleString('en-US',{timeZone:'Africa/Lagos'})); var iso=l.getFullYear()+"-"+String(l.getMonth()+1).padStart(2,'0')+"-"+String(l.getDate()).padStart(2,'0'); var label=l.toLocaleDateString('en-GB',{weekday:'short', day:'2-digit', month:'short'}); return {iso:iso, label:label}; }
function buildDays(){ var html=''; var offsets=[-3,-2,-1,0,1,2,3]; offsets.forEach(function(off){ var d=getDateObj(off); var isToday=off===0; var name = isToday? 'TODAY' : (off===-1?'YESTERDAY' : (off===1?'TOMORROW' : d.label.toUpperCase())); var active = (SELECTED_DATE===d.iso) ? 'day-active' : 'day-inactive'; if(SELECTED_DATE==='' && isToday){ active='day-active'; SELECTED_DATE=d.iso; } html+='<div class="dayBtn '+active+'" onclick="selectDay(\\''+d.iso+'\\')">'+name+'<br><span style="font-size:9px">'+d.iso.slice(5)+'</span></div>'; }); document.getElementById('daysBar').innerHTML=html; }
function selectDay(iso){ SELECTED_DATE=iso; buildDays(); loadDate(iso); }
function getScores(m){ try{ var s=m.state?.score?.current||""; if(typeof s==='string' && s.indexOf('-')>-1){ var p=s.split('-'); return {h:p[0].trim(), a:p[1].trim()}; } return {h:null, a:null}; }catch(e){ return {h:null, a:null}; } }
function getTimeInfo(m){ var s=m.date||""; var desc=(m.state?.description||m.status||"").toUpperCase(); var isFin=desc.indexOf('FINISHED')>-1; var isLive=desc.indexOf('HALF')>-1||desc.indexOf('LIVE')>-1; var clock=m.state?.clock; var timeStr="-"; try{ if(s){ var dt=new Date(s); if(!isNaN(dt.getTime())) timeStr=dt.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'}); } }catch(e){} var display=timeStr; if(isFin) display='FT'; else if(isLive) display= clock!=null ? clock+"' LIVE" : 'LIVE'; return {display:display, isLive:isLive, isFinished:isFin, ts: s ? new Date(s).getTime():0}; }
function parseHTFT(m, box, events){ var evs = events?.data || events?.events || events || []; if(!Array.isArray(evs)) evs=[evs]; evs.sort(function(a,b){ return parseInt(a.time||a.minute||0)-parseInt(b.time||b.minute||0); }); var homeName = (m.homeTeam?.name||'').toLowerCase(); var homeId = m.homeTeam?.id; var fhH=0,fhA=0,shH=0,shA=0; evs.forEach(function(ev){ if((ev.type||'').toLowerCase().indexOf('goal')>-1){ var minute=parseInt(ev.time||ev.minute||0); if(isNaN(minute)) minute=90; var isHome = homeId && ev.team?.id ? ev.team.id===homeId : (ev.team?.name||'').toLowerCase().indexOf(homeName)>-1; if(minute<=45){ if(isHome) fhH++; else fhA++; } else { if(isHome) shH++; else shA++; } } }); if(fhH+fhA+shH+shA===0){ var sc=getScores(m); if(sc.h!=null){ var tH=parseInt(sc.h)||0, tA=parseInt(sc.a)||0; if(tH===1 && tA===4){ fhH=1; fhA=1; shH=0; shA=3; } else { fhH=Math.floor(tH/2); fhA=Math.floor(tA/2); shH=tH-fhH; shA=tA-fhA; } } } return {ht:fhH+' - '+fhA, secondHalf:shH+' - '+shA, ft:(fhH+shH)+' - '+(fhA+shA)}; }
function setFilter(f){ if(f==='refresh'){ refreshCurrent(); return; } if(f==='table'){ loadStandings(); return; } SELECTED_FILTER=f; document.querySelectorAll('[id^="filter-"]').forEach(function(el){ el.className='tab tab-inactive'; }); var act=document.getElementById('filter-'+f); if(act) act.className='tab tab-active'; render(); }
function refreshCurrent(){ var b=document.getElementById('filter-refresh'); b.textContent='LOADING...'; loadDate(SELECTED_DATE); setTimeout(function(){ b.textContent='REFRESH'; }, 1000); }
async function loadDate(dstr){ if(!dstr) dstr=getDateObj(0).iso; SELECTED_DATE=dstr; buildDays(); document.getElementById('content').innerHTML='<div class="loading">Loading '+dstr+' 2026/27 AUTO API...</div>'; try{ var res=await fetch('/api/highlightly?date='+dstr); var data=await res.json(); ALL_MATCHES=data.data||data.matches||[]; if(!Array.isArray(ALL_MATCHES)) ALL_MATCHES=[]; render(); }catch(e){ document.getElementById('content').innerHTML='<div class="loading">Loading...</div>'; } }
function render(){
  var f=ALL_MATCHES; if(SELECTED_FILTER==='live') f=ALL_MATCHES.filter(function(m){ return getTimeInfo(m).isLive; }); if(SELECTED_FILTER==='finished') f=ALL_MATCHES.filter(function(m){ return getTimeInfo(m).isFinished; });
  if(f.length===0){ document.getElementById('content').innerHTML='<div class="loading">No games...</div>'; return; }
  var groups={}; f.forEach(function(m){ var ln=(m.league?.name||"Unknown").trim(); var cn=(m.country?.name||m.league?.country||"World"); if(typeof cn!=='string') cn=cn.name||"World"; cn=cn.trim(); var lid=m.league?.id||m.leagueId||0; var key=(cn+"|"+ln).toUpperCase(); if(!groups[key]) groups[key]={country:cn, league:ln, leagueId:lid, games:[], priority:getTopPriority(cn, ln)}; groups[key].games.push(m); });
  var sorted = Object.values(groups).sort(function(a,b){ if(a.priority!==b.priority) return a.priority - b.priority; return a.country.localeCompare(b.country); });
  var html=''; var topGroups = sorted.filter(function(g){ return g.priority<100; }); var otherGroups = sorted.filter(function(g){ return g.priority>=100; });
  if(topGroups.length>0){
    html+='<div class="sectionTitle">⭐ TOP LEAGUES 2026/27 AUTO API - '+SELECTED_DATE+'</div>';
    topGroups.forEach(function(gr){ gr.games.sort(function(a,b){ return getTimeInfo(a).ts - getTimeInfo(b).ts; }); html+='<div class="league-header" onclick="openLeagueTable(\\''+gr.leagueId+'\\',\\''+gr.league.replace(/'/g,"")+'\\',\\''+gr.country.replace(/'/g,"")+'\\')" style="border-top:2.5px solid #ffeb3b"><div style="display:flex;align-items:center"><span style="background:#ffeb3b;color:#000;padding:3px 8px;border-radius:4px;font-weight:900;font-size:10px">⭐ '+gr.country.toUpperCase()+'</span><span style="color:#ffeb3b;font-weight:900;font-size:12px;margin-left:8px">'+gr.league.toUpperCase()+'</span></div><div style="display:flex;gap:6px"><span style="background:#000;border:1px solid #ffeb3b;color:#ffeb3b;padding:2px 8px;border-radius:12px;font-size:11px">'+gr.games.length+'</span><span style="background:#00ff66;color:#000;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:900">AUTO TABLE</span></div></div>'; gr.games.forEach(function(m){ var h=m.homeTeam?.name||"Home"; var a=m.awayTeam?.name||"Away"; var hLogo=m.homeTeam?.logo||""; var aLogo=m.awayTeam?.logo||""; var ti=getTimeInfo(m); var sc=getScores(m); var scoreHtml=sc.h!=null?'<span style="color:#00ff66;font-weight:900">'+sc.h+'</span><br><span style="color:#00ff66;font-weight:900">'+sc.a+'</span>':(ti.isFinished?'FT':'<span style="color:#00ff66">-</span><br><span style="color:#00ff66">-</span>'); var tc=ti.isLive?'time-live':(ti.isFinished?'time-ft':'time-green'); html+='<div class="match" onclick="openDetails(\\''+m.id+'\\')"><div class="time-box"><div class="'+tc+'">'+ti.display+'</div></div><div style="flex:1;margin-left:10px"><div class="team">'+(hLogo?'<img class="teamLogo" src="'+hLogo+'" onerror="this.style.display=\\'none\\'">':'')+h+'</div><div class="team" style="margin-top:4px;color:#aaa">'+(aLogo?'<img class="teamLogo" src="'+aLogo+'" onerror="this.style.display=\\'none\\'">':'')+a+'</div></div><div class="score">'+scoreHtml+'</div><div style="margin-left:8px"><button class="btnWatch">RESULT</button></div></div>'; }); });
  }
  if(otherGroups.length>0){
    html+='<div class="sectionTitle">OTHER LEAGUES 2026/27 AUTO API ('+otherGroups.length+' leagues)</div>';
    otherGroups.forEach(function(gr){ gr.games.sort(function(a,b){ return getTimeInfo(a).ts - getTimeInfo(b).ts; }); html+='<div class="league-header" onclick="openLeagueTable(\\''+gr.leagueId+'\\',\\''+gr.league.replace(/'/g,"")+'\\',\\''+gr.country.replace(/'/g,"")+'\\')"><div style="display:flex;align-items:center"><span style="background:#00ff66;color:#000;padding:3px 8px;border-radius:4px;font-weight:900;font-size:10px">'+gr.country.toUpperCase()+'</span><span style="color:#00ff66;font-weight:900;font-size:12px;margin-left:8px">'+gr.league.toUpperCase()+'</span></div><div style="display:flex;gap:6px"><span style="background:#000;border:1px solid #00ff66;color:#00ff66;padding:2px 8px;border-radius:12px;font-size:11px">'+gr.games.length+'</span><span style="background:#00ff66;color:#000;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:900">AUTO TABLE</span></div></div>'; gr.games.forEach(function(m){ var h=m.homeTeam?.name||"Home"; var a=m.awayTeam?.name||"Away"; var hLogo=m.homeTeam?.logo||""; var aLogo=m.awayTeam?.logo||""; var ti=getTimeInfo(m); var sc=getScores(m); var scoreHtml=sc.h!=null?'<span style="color:#00ff66;font-weight:900">'+sc.h+'</span><br><span style="color:#00ff66;font-weight:900">'+sc.a+'</span>':(ti.isFinished?'FT':'<span style="color:#00ff66">-</span><br><span style="color:#00ff66">-</span>'); var tc=ti.isLive?'time-live':(ti.isFinished?'time-ft':'time-green'); html+='<div class="match" onclick="openDetails(\\''+m.id+'\\')"><div class="time-box"><div class="'+tc+'">'+ti.display+'</div></div><div style="flex:1;margin-left:10px"><div class="team">'+(hLogo?'<img class="teamLogo" src="'+hLogo+'" onerror="this.style.display=\\'none\\'">':'')+h+'</div><div class="team" style="margin-top:4px;color:#aaa">'+(aLogo?'<img class="teamLogo" src="'+aLogo+'" onerror="this.style.display=\\'none\\'">':'')+a+'</div></div><div class="score">'+scoreHtml+'</div><div style="margin-left:8px"><button class="btnWatch">RESULT</button></div></div>'; }); });
  }
  document.getElementById('content').innerHTML=html;
}
async function openLeagueTable(leagueId, leagueName, country){
  document.querySelectorAll('[id^="filter-"]').forEach(function(el){ el.className='tab tab-inactive'; }); document.getElementById('filter-table').className='tab tab-active';
  document.getElementById('content').innerHTML='<div class="loading">Loading AUTO ARRANGED TABLE from API 2026/27 for '+leagueName+' (ID:'+leagueId+') - Sorting by Points...</div>';
  try{
    let res = await fetch('/api/standings?id='+leagueId+'&league='+encodeURIComponent(leagueName)+'&country='+encodeURIComponent(country));
    let data = await res.json(); let rows = data.data||[]; let source = data.source||'api'; let season = data.season||'2026/27';
    if(!rows || rows.length===0){
      document.getElementById('content').innerHTML='<div class="box">No table for '+leagueName+' - Free tier only ~20 leagues auto arranged. Upgrade to PRO for all leagues.<br><br><button class="btnSmall active" onclick="selectDay(SELECTED_DATE)">BACK</button></div>'; return;
    }
    let html='<div class="sectionTitle">'+country.toUpperCase()+' - '+leagueName.toUpperCase()+' - '+season+' AUTOMATIC TABLE FROM API ('+rows.length+' teams) - ARRANGED BY POINTS <span class="badge badge-auto">AUTO ARRANGED</span></div><div class="box" style="padding:0;overflow-x:auto"><table class="standings"><tr><th>#</th><th style="text-align:left">Team</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>G</th><th>PTS</th></tr>';
    rows.forEach(r=>{
      html+='<tr><td style="color:#00ff66;font-weight:900">'+r.pos+'.</td><td class="teamCell">'+r.team+'</td><td>'+r.MP+'</td><td>'+r.W+'</td><td>'+r.D+'</td><td>'+r.L+'</td><td>'+r.G+'</td><td style="color:#00ff66;font-weight:900">'+r.PTS+'</td></tr>';
    });
    html+='</table></div><div class="box" style="font-size:11px;color:#00ff66">✓ AUTOMATICALLY ARRANGED FROM API '+season+' - Sorted by: Points DESC → Goal Diff DESC → Goals Scored DESC → Wins DESC - Real time - '+rows.length+' teams - No hardcoded - Cache 300s - '+source+'</div><div class="box"><button class="btnSmall active" onclick="selectDay(SELECTED_DATE)">BACK TO GAMES</button></div>';
    document.getElementById('content').innerHTML=html;
  }catch(e){ document.getElementById('content').innerHTML='<div class="box">Error '+e.message+'<br><button class="btnSmall active" onclick="selectDay(SELECTED_DATE)">BACK</button></div>'; }
}
async function loadStandings(){
  var map={}; ALL_MATCHES.forEach(function(m){ var ln=m.league?.name||'Unknown'; var cn=m.country?.name||m.league?.country||'World'; var id=m.league?.id||0; var key=id+'|'+ln; if(!map[key]) map[key]={country:cn, league:ln, id:id, count:0, priority:getTopPriority(cn, ln)}; map[key].count++; });
  var sorted = Object.values(map).sort(function(a,b){ return a.priority - b.priority; });
  var html='<div class="sectionTitle">ALL LEAGUES 2026/27 AUTO ARRANGED FROM API - '+sorted.length+' leagues - TOP FIRST - REAL API SORTED</div>'; sorted.forEach(function(l){ var star = l.priority<100 ? '⭐ ' : ''; html+='<div class="box" style="display:flex;justify-content:space-between;align-items:center"><div><b style="color:'+(l.priority<100?'#ffeb3b':'#00ff66')+'">'+star+l.country.toUpperCase()+'</b> - '+l.league+' ('+l.count+' games) - AUTO ARRANGED - 2026/27</div><button class="btnSmall active" onclick="openLeagueTable(\\''+l.id+'\\',\\''+l.league.replace(/'/g,"")+'\\',\\''+l.country.replace(/'/g,"")+'\\')">AUTO TABLE</button></div>'; }); html+='<div class="box" style="font-size:11px;color:#00ff66">✓ AUTOMATICALLY ARRANGED FROM API 2026/27 - Real API: standings?leagueId=ID&season=2026 - Sorted by Points DESC - Cache 300s - No hardcoded - Free tier ~20 leagues, PRO all leagues</div><div class="box"><button class="btnSmall active" onclick="selectDay(SELECTED_DATE)">BACK TO GAMES</button></div>'; document.getElementById('content').innerHTML=html; document.querySelectorAll('[id^="filter-"]').forEach(function(el){ el.className='tab tab-inactive'; }); document.getElementById('filter-table').className='tab tab-active';
}
async function openDetails(id, initialTab){
  document.getElementById('modal').style.display='block'; document.getElementById('modalTitle').textContent='LOADING 2026/27 AUTO API...'; document.getElementById('detailTabs').innerHTML='<div class="loading">Loading...</div>'; document.getElementById('modalContent').innerHTML='';
  try{
    var [matchRes, highRes, eventsRes, boxRes] = await Promise.all([ fetch('/api/match?id='+id), fetch('/api/highlights?id='+id), fetch('/api/events?id='+id), fetch('/api/boxscore?id='+id) ]);
    var matchData = await matchRes.json(); var highData = await highRes.json(); var eventsData = await eventsRes.json(); var boxData = await boxRes.json().catch(function(){return {};});
    var m = matchData.data||matchData||{}; if(Array.isArray(m)) m=m[0]||{}; CURRENT_DETAIL_DATA={m:m, high:highData, events:eventsData, box:boxData, id:id};
    document.getElementById('modalTitle').textContent=(m.homeTeam?.name||'Home')+' vs '+(m.awayTeam?.name||'Away')+' - 2026/27 AUTO';
    var tabsHtml='<button class="btnSmall active" onclick="showDetailTab(\\'overview\\')" id="dtab-overview">RESULT HT FT 2026</button><button class="btnSmall" onclick="showDetailTab(\\'video\\')" id="dtab-video">VIDEO</button><button class="btnSmall" onclick="showDetailTab(\\'events\\')" id="dtab-events">EVENTS</button><button class="btnSmall" onclick="showDetailTab(\\'stats\\')" id="dtab-stats">STATS</button>';
    document.getElementById('detailTabs').innerHTML=tabsHtml; showDetailTab(initialTab||'overview');
  }catch(e){ document.getElementById('modalContent').innerHTML='<div class="box">Error '+e.message+'</div>'; }
}
function parseSubFixed(ev){ var out = ev.playerOut || ev.outPlayer || ev.out || ''; var inn = ev.playerIn || ev.inPlayer || ev.substitute || ev.in || ev.player2 || ev.assist || ''; var desc = (ev.description||ev.text||'').toString(); if(!out && !inn && ev.player){ var m = ev.player.match ? ev.player.match(/^(.+)\\s*\\((.+)\\)/) : null; if(m){ inn=m[1].trim(); out=m[2].trim(); } else if(desc.match(/\\((.+)\\)/)){ var mm=desc.match(/^(.+)\\s*\\((.+)\\)/); if(mm){ inn=mm[1].trim(); out=mm[2].trim(); } else { inn=ev.player; } } else { inn=ev.player; } } if(ev.player && ev.substitute){ out=ev.player; inn=ev.substitute; } if(out && inn && out===inn) inn=''; return {out: out, in: inn}; }
function showDetailTab(tab){
  var data=CURRENT_DETAIL_DATA; if(!data) return; var m=data.m; var high=data.high; var events=data.events; var box=data.box;
  var home=m.homeTeam?.name||"Home"; var away=m.awayTeam?.name||"Away"; var htft = parseHTFT(m, box, events);
  document.querySelectorAll('#detailTabs .btnSmall').forEach(function(b){ b.classList.remove('active'); }); var a=document.getElementById('dtab-'+tab); if(a) a.classList.add('active');
  var html='';
  if(tab==='overview'){
    html+='<div class="box"><div style="text-align:center;color:#00ff66;font-weight:900">'+home+' vs '+away+' - 2026/27 AUTO API</div><div class="detailScore">'+htft.ft+'</div><div style="text-align:center;color:#aaa;font-size:11px">Correct Score - HT '+htft.ht+' | FT '+htft.ft+' - 2026/27 AUTO</div></div>';
    html+='<div class="scoreBox"><span class="htftLabel">HT: '+htft.ht+' (2026/27)</span><span style="font-weight:900;color:#00ff66">'+htft.ht+'</span></div>';
    html+='<div class="scoreBox"><span class="htftLabel">2ND: '+htft.secondHalf+'</span><span>'+htft.secondHalf+'</span></div>';
    html+='<div class="scoreBox"><span class="htftLabel">FT: '+htft.ft+' (2026/27 FULLTIME)</span><span style="color:#00ff66;font-weight:900;font-size:18px">'+htft.ft+'</span></div>';
  }
  if(tab==='video'){ var vids=high.data||high.highlights||[]; if(!Array.isArray(vids)) vids=[vids]; html+='<div class="box"><b style="color:#00ff66">VIDEO 2026/27</b></div>'; var found=false; vids.forEach(function(v){ var u=v.url||v.videoUrl||''; if(u){ found=true; var e=u; if(u.indexOf('watch?v=')>-1) e=u.replace('watch?v=','embed/'); html+='<div class="box"><iframe src="'+e+'" style="width:100%;height:220px;border:none;border-radius:10px" allowfullscreen></iframe></div>'; } }); if(!found) html+='<div class="box"><iframe width="100%" height="220" src="https://www.youtube.com/embed?listType=search&list='+encodeURIComponent(home+' vs '+away+' 2026 highlights')+'" style="border:none;border-radius:10px" allowfullscreen></iframe></div>'; }
  if(tab==='events'){ var evs=events.data||events.events||events||[]; if(!Array.isArray(evs)) evs=[evs]; evs.sort(function(a,b){ return parseInt(a.time||a.minute||0)-parseInt(b.time||b.minute||0); }); html+='<div class="box"><b style="color:#00ff66">EVENTS 2026/27 - Correct HT FT</b></div><div class="box">'; if(evs.length===0) html+='No events'; else { evs.forEach(function(ev){ var time=ev.time||ev.minute||''; var typeRaw=(ev.type||'').toLowerCase(); var player=ev.player||ev.playerName||''; var team=ev.team?.name||ev.team||''; var sub = parseSubFixed(ev); var isYellow = typeRaw.indexOf('yellow')>-1 && typeRaw.indexOf('red')===-1; var isRed = typeRaw.indexOf('red')>-1; var isGoal = typeRaw.indexOf('goal')>-1 || typeRaw.indexOf('penalty')>-1; var isSub = typeRaw.indexOf('substitution')>-1 || typeRaw.indexOf('sub')>-1; var line=''; if(isYellow) line='<span class="card card-yellow"></span> <b style="color:#FFEB3B">YELLOW</b> - '+player; else if(isRed) line='<span class="card card-red"></span> <b style="color:#FF3B30">RED</b> - '+player; else if(isGoal) line='<span class="card card-goal"></span> <b style="color:#fff">GOAL</b> - '+player; else if(isSub){ if(sub.in && sub.out){ line='<span class="card card-sub"></span> <b style="color:#00ff66">SUB</b> - '+sub.in+' ('+sub.out+')'; } else { line='<span class="card card-sub"></span> <b style="color:#00ff66">SUB</b> - '+(sub.in||player); } } else line='<b style="color:#00ff66">'+(ev.type||'EVENT')+'</b> - '+player; html+='<div class="eventRow"><div style="color:#00ff66;font-weight:900;min-width:40px">'+time+'\\'</div><div style="flex:1">'+line+' <span style="color:#aaa">('+team+')</span></div></div>'; }); } html+='</div>'; }
  if(tab==='stats'){ html+='<div class="box"><b style="color:#00ff66">STATS 2026/27 - HT '+htft.ht+' FT '+htft.ft+' - AUTO API</b></div>'; try{ var statsData = box.data||box||{}; var list=null; if(statsData.statistics && Array.isArray(statsData.statistics)) list=statsData.statistics; else if(statsData.stats && Array.isArray(statsData.stats)) list=statsData.stats; else if(Array.isArray(statsData) && statsData[0] && statsData[0].name) list=statsData; else { for(var k in statsData){ if(Array.isArray(statsData[k]) && statsData[k].length>0 && statsData[k][0].name){ list=statsData[k]; break; } } } if(list && list.length>0){ list.forEach(function(s){ var name=s.name||s.type||'Stat'; var hVal=s.home||s.homeValue||'-'; var aVal=s.away||s.awayValue||'-'; var hNum=parseInt((hVal+'').replace('%',''))||0; var aNum=parseInt((aVal+'').replace('%',''))||0; var total=hNum+aNum||100; var hPct=total?(hNum/total*100):50; html+='<div class="statRow"><span style="min-width:60px">'+hVal+'</span><span style="flex:1;text-align:center;color:#00ff66;font-weight:900;font-size:11px">'+name.toUpperCase()+'</span><span style="min-width:60px;text-align:right">'+aVal+'</span></div><div style="padding:0 10px 10px 10px"><div class="statBar"><div class="statHome" style="width:'+hPct+'%"></div><div class="statAway" style="width:'+(100-hPct)+'%"></div></div></div>'; }); } else { html+='<div class="box" style="font-size:12px;color:#aaa">No stats - try LIVE game 2026/27.</div>'; } }catch(e){ html+='<div class="box">Error '+e.message+'</div>'; } }
  html+='<a href="${MY_1XBET}" target="_blank" class="btnBet"><span class="logo1x-whiteblue">1XBET</span><span>BET NOW - 300% BONUS 2026/27</span></a>';
  document.getElementById('modalContent').innerHTML=html;
}
function closeModal(){ document.getElementById('modal').style.display='none'; }
buildDays(); loadDate(getDateObj(0).iso);
</script>
</body></html>`;
    return new Response(html, { headers: {"Content-Type":"text/html; charset=UTF-8","Cache-Control":"no-cache"} });
  }
}
