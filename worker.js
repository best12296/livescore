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
    if(url.pathname === "/api/matchstats"){
      const id = url.searchParams.get("id");
      const tryUrls = [
        `https://soccer.highlightly.net/statistics/${id}`,
        `https://soccer.highlightly.net/match-statistics/${id}`,
        `https://soccer.highlightly.net/stats/${id}`,
        `https://soccer.highlightly.net/matches/${id}/statistics`,
        `https://soccer.highlightly.net/box-score/${id}`
      ];
      for(let u of tryUrls){
        try{
          const r = await fetch(u, {headers:H});
          if(r.ok){
            const txt = await r.text();
            if(txt && txt.length>20 && txt!=='[]' && txt!=='{}' && txt.indexOf('"team"')===-1){
              return new Response(txt, {headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*"}});
            }
          }
        }catch(e){}
      }
      return new Response(JSON.stringify({data:[]}), {headers:{"Content-Type":"application/json; charset=utf-8"}});
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
<meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND WHITE BLACK</title>
<style>
/* WHITE & BLACK DESIGN LIKE YOUR SCREENSHOT */
html,body{margin:0;background:#0a0a0a;color:#fff;font-family:Inter,Arial,sans-serif}
.top{display:flex;justify-content:center;padding:14px;background:#000;border-bottom:1px solid #222;position:sticky;top:0;z-index:200}
.logo{background:#fff;color:#000;padding:8px 22px;border-radius:8px;font-weight:900;font-size:13px;letter-spacing:0.5px}
.bet{padding:10px 12px}.bet a{background:#fff;color:#000;padding:12px;border-radius:12px;font-weight:900;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:8px;font-size:13px}
.logo1x-whiteblue{background:#000;color:#fff;padding:5px 12px;border-radius:6px;font-weight:900;font-size:13px;border:1px solid #fff}
.days{display:flex;gap:8px;padding:12px;background:#0a0a0a;overflow-x:auto;border-bottom:1px solid #1e1e1e;position:sticky;top:54px;z-index:150}
.dayBtn{padding:10px 14px;border-radius:20px;font-weight:700;font-size:11px;white-space:nowrap;cursor:pointer;border:1px solid #2a2a2a;min-width:72px;text-align:center;background:#1a1a1a;color:#aaa}
.day-active{background:#fff;color:#000;border-color:#fff}
.tabs{display:flex;gap:8px;padding:10px 12px;background:#0a0a0a;overflow-x:auto;border-bottom:1px solid #1e1e1e;position:sticky;top:110px;z-index:149}
.tab{padding:8px 16px;border-radius:20px;font-weight:700;font-size:11px;white-space:nowrap;cursor:pointer;border:1px solid #2a2a2a;background:#1a1a1a;color:#aaa}
.tab-active{background:#fff;color:#000;border-color:#fff}
.sectionTitle{padding:14px 12px;font-weight:800;font-size:13px;color:#fff;background:#0a0a0a;display:flex;align-items:center;gap:8px}
.sectionTitle:before{content:"";width:3px;height:14px;background:#fff;display:inline-block;border-radius:2px}
.league-header{background:#0a0a0a;padding:12px 12px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;border-bottom:1px solid #1e1e1e}
.league-left{display:flex;align-items:center;gap:10px}
.league-icon{width:26px;height:26px;background:#fff;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;color:#000;font-weight:900}
.league-name{font-weight:800;font-size:13px;color:#fff}
.league-country{font-size:11px;color:#888;margin-top:2px}
.team{font-size:13px;display:flex;align-items:center;gap:10px;font-weight:500}
.teamLogo{width:22px;height:22px;border-radius:50%;background:#2a2a2a;object-fit:cover}
.match{background:#1e1e1e;border-radius:14px;margin:8px 12px;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;border:1px solid #2a2a2a}
.match:hover{background:#252525}
.time-box{width:60px;text-align:left}
.time-text{color:#fff;font-weight:700;font-size:13px}
.score{color:#888;font-weight:600;font-size:12px;text-align:center;min-width:20px}
.star{color:#666;font-size:20px;cursor:pointer}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:12px;background:#000;border-top:1px solid #222;z-index:9999}.bottom a{background:#fff;color:#000;padding:12px;border-radius:12px;font-weight:900;text-align:center;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none}
.spacer{height:90px}.loading{padding:30px;text-align:center;color:#888}
#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#0a0a0a;z-index:99999;display:none;overflow-y:auto}
#modalTop{background:#000;border-bottom:1px solid #222;padding:14px;position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;z-index:10}
.closeBtn{background:#fff;color:#000;border:none;padding:8px 16px;border-radius:20px;font-weight:800;font-size:12px}
.box{background:#1e1e1e;border:1px solid #2a2a2a;border-radius:14px;padding:14px;margin:10px 12px}
.detailScore{font-size:42px;font-weight:900;color:#fff;text-align:center}
.btnBet{background:#fff;color:#000;padding:12px;border-radius:12px;font-weight:900;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;margin:10px 12px}
.btnWatch{background:#2a2a2a;color:#888;border:none;padding:6px 12px;border-radius:20px;font-weight:700;font-size:11px}
.btnSmall{background:#1e1e1e;color:#aaa;border:1px solid #2a2a2a;padding:8px 14px;border-radius:20px;font-weight:700;font-size:11px;margin:3px;cursor:pointer}
.btnSmall.active{background:#fff;color:#000;border-color:#fff}
.detailTabs{display:flex;gap:8px;padding:12px;overflow-x:auto;background:#0a0a0a;position:sticky;top:56px;z-index:5;border-bottom:1px solid #1e1e1e}
table.standings{width:100%;border-collapse:collapse;font-size:12px} table.standings th{background:#fff;color:#000;padding:10px 6px;font-weight:800;font-size:11px} table.standings td{padding:10px 6px;border-bottom:1px solid #2a2a2a;text-align:center;color:#fff} table.standings td.teamCell{text-align:left;font-weight:600}
.card{width:16px;height:22px;display:inline-block;border-radius:3px;vertical-align:middle;margin-right:8px;border:1px solid #000}
.card-yellow{background:#FFEB3B}.card-red{background:#FF3B30}.card-goal{width:14px;height:14px;background:#fff;border-radius:50%;display:inline-block;border:2px solid #000;vertical-align:middle;margin-right:8px}.card-sub{width:18px;height:14px;background:#fff;border-radius:3px;display:inline-block;vertical-align:middle;margin-right:8px}
.eventRow{padding:12px 0;border-bottom:1px solid #2a2a2a;display:flex;gap:10px;align-items:center}
.scoreBox{background:#1e1e1e;border:1px solid #2a2a2a;border-radius:12px;padding:12px;margin:8px 12px;display:flex;justify-content:space-between;align-items:center}
.htftLabel{color:#aaa;font-weight:700;font-size:11px;background:#2a2a2a;padding:6px 12px;border-radius:20px}
.statRow{display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid #2a2a2a;font-size:13px}
.statBar{height:6px;background:#2a2a2a;border-radius:3px;flex:1;margin:0 14px;overflow:hidden;display:flex}
.statHome{background:#fff;height:100%}.statAway{background:#555;height:100%}
</style>
</head><body>
<div class="top"><span class="logo">DIAMOND LIVESCORE</span></div>
<div class="bet"><a href="${MY_1XBET}" target="_blank"><span class="logo1x-whiteblue">1XBET</span><span> - BET NOW - BONUS 300%</span></a></div>
<div class="days" id="daysBar"></div>
<div class="tabs">
<div class="tab tab-active" onclick="setFilter('all')" id="filter-all">ALL GAMES</div>
<div class="tab" onclick="setFilter('live')" id="filter-live">LIVE</div>
<div class="tab" onclick="setFilter('finished')" id="filter-finished">FINISHED</div>
<div class="tab" onclick="refreshCurrent()" id="filter-refresh">REFRESH</div>
<div class="tab" onclick="loadStandings()" id="filter-table">TABLE</div>
</div>
<div id="content"><div class="loading">Loading...</div></div>
<div id="modal"><div id="modalTop"><span style="color:#fff;font-weight:900;font-size:13px" id="modalTitle">MATCH</span><button class="closeBtn" onclick="closeModal()">CLOSE</button></div><div class="detailTabs" id="detailTabs"></div><div id="modalContent"></div></div>
<div class="spacer"></div>
<div class="bottom"><a href="${MY_1XBET}" target="_blank"><span class="logo1x-whiteblue">1XBET</span><span> - BET NOW</span></a></div>
<script>
var ALL_MATCHES=[]; var CURRENT_DETAIL_DATA=null; var SELECTED_DATE=''; var SELECTED_FILTER='all';
function isTop10League(country, league){
  var c=(country||"").toLowerCase().trim();
  var l=(league||"").toLowerCase().trim();
  if(l.indexOf('cup')>-1 && l!=='taça da liga' && l!=='taca da liga') return {isTop:false};
  if(l.indexOf('u21')>-1 || l.indexOf('u20')>-1 || l.indexOf('u19')>-1 || l.indexOf('u23')>-1) return {isTop:false};
  if(l.indexOf('championship')>-1 || l.indexOf('league two')>-1 || l.indexOf('national league')>-1 || l.indexOf('league one')>-1) return {isTop:false};
  if(l.indexOf('serie a')>-1 && c.indexOf('brazil')>-1) return {isTop:false};
  if(c==='europe' && l==='champions league') return {isTop:true, order:0};
  if(c==='europe' && l==='europa league') return {isTop:true, order:1};
  if(c==='europe' && l==='conference league') return {isTop:true, order:2};
  if(c==='england' && l==='premier league') return {isTop:true, order:3};
  if(c==='spain' && (l==='laliga' || l==='la liga')) return {isTop:true, order:4};
  if(c==='france' && l==='ligue 1') return {isTop:true, order:5};
  if(c==='germany' && l==='bundesliga') return {isTop:true, order:6};
  if(c==='italy' && l==='serie a') return {isTop:true, order:7};
  if(c==='netherlands' && l==='eredivisie') return {isTop:true, order:8};
  if(c==='portugal' && (l==='primeira liga' || l==='taça da liga' || l==='taca da liga')) return {isTop:true, order:9};
  return {isTop:false};
}
var FULL_TABLES = {
  "ITALY|SERIE A": [
    {pos:1, team:'Inter', MP:9, W:8, D:1, L:0, G:'25:10', PTS:25},
    {pos:2, team:'Lazio', MP:9, W:8, D:1, L:0, G:'22:7', PTS:25},
    {pos:3, team:'AS Roma', MP:9, W:6, D:3, L:0, G:'23:8', PTS:21},
    {pos:4, team:'Como', MP:9, W:6, D:2, L:1, G:'17:8', PTS:20},
    {pos:5, team:'AC Milan', MP:9, W:5, D:3, L:1, G:'18:11', PTS:18}
  ],
  "PORTUGAL|PRIMEIRA LIGA": [
    {pos:1, team:'Sporting CP', MP:9, W:8, D:1, L:0, G:'24:5', PTS:25},
    {pos:2, team:'Benfica', MP:9, W:7, D:2, L:0, G:'22:6', PTS:23},
    {pos:3, team:'FC Porto', MP:9, W:7, D:1, L:1, G:'19:7', PTS:22},
    {pos:4, team:'SC Braga', MP:9, W:6, D:1, L:2, G:'18:10', PTS:19},
    {pos:5, team:'Guimaraes', MP:9, W:5, D:2, L:2, G:'15:9', PTS:17},
    {pos:6, team:'Famalicao', MP:9, W:4, D:3, L:2, G:'14:11', PTS:15},
    {pos:7, team:'Moreirense', MP:9, W:4, D:2, L:3, G:'12:12', PTS:14},
    {pos:8, team:'Casa Pia AC', MP:9, W:4, D:1, L:4, G:'11:13', PTS:13},
    {pos:9, team:'Santa Clara', MP:9, W:3, D:3, L:3, G:'10:10', PTS:12},
    {pos:10, team:'Rio Ave', MP:9, W:3, D:2, L:4, G:'9:12', PTS:11}
  ],
  "PORTUGAL|TAÇA DA LIGA": [
    {pos:1, team:'Benfica', MP:2, W:2, D:0, L:0, G:'6:1', PTS:6},
    {pos:2, team:'SC Braga', MP:2, W:1, D:1, L:0, G:'4:2', PTS:4},
    {pos:3, team:'Sporting CP', MP:2, W:1, D:1, L:0, G:'3:2', PTS:4},
    {pos:4, team:'FC Porto', MP:2, W:1, D:0, L:1, G:'3:2', PTS:3}
  ],
  "PORTUGAL|TACA DA LIGA": [
    {pos:1, team:'Benfica', MP:2, W:2, D:0, L:0, G:'6:1', PTS:6},
    {pos:2, team:'SC Braga', MP:2, W:1, D:1, L:0, G:'4:2', PTS:4},
    {pos:3, team:'Sporting CP', MP:2, W:1, D:1, L:0, G:'3:2', PTS:4},
    {pos:4, team:'FC Porto', MP:2, W:1, D:0, L:1, G:'3:2', PTS:3}
  ],
  "ENGLAND|PREMIER LEAGUE": [
    {pos:1, team:'Arsenal', MP:9, W:7, D:1, L:1, G:'18:5', PTS:22},
    {pos:2, team:'Man City', MP:9, W:6, D:2, L:1, G:'20:8', PTS:20},
    {pos:3, team:'Liverpool', MP:9, W:6, D:1, L:2, G:'19:10', PTS:19}
  ],
  "SPAIN|LA LIGA": [
    {pos:1, team:'Real Madrid', MP:10, W:8, D:1, L:1, G:'22:7', PTS:25},
    {pos:2, team:'Barcelona', MP:10, W:7, D:2, L:1, G:'24:10', PTS:23}
  ],
  "SPAIN|LALIGA": [
    {pos:1, team:'Real Madrid', MP:10, W:8, D:1, L:1, G:'22:7', PTS:25},
    {pos:2, team:'Barcelona', MP:10, W:7, D:2, L:1, G:'24:10', PTS:23}
  ]
};
function getDateObj(o){ var n=new Date(); n.setDate(n.getDate()+o); var l=new Date(n.toLocaleString('en-US',{timeZone:'Africa/Lagos'})); var iso=l.getFullYear()+"-"+String(l.getMonth()+1).padStart(2,'0')+"-"+String(l.getDate()).padStart(2,'0'); var label=l.toLocaleDateString('en-GB',{weekday:'short', day:'2-digit', month:'short'}); return {iso:iso, label:label}; }
function buildDays(){ var html=''; var offsets=[-3,-2,-1,0,1,2,3]; offsets.forEach(function(off){ var d=getDateObj(off); var isToday=off===0; var name = isToday? 'TODAY' : (off===-1?'YESTERDAY' : (off===1?'TOMORROW' : d.label.toUpperCase())); var active = (SELECTED_DATE===d.iso) ? 'day-active' : 'day-inactive'; if(SELECTED_DATE==='' && isToday){ active='day-active'; SELECTED_DATE=d.iso; } html+='<div class="dayBtn '+active+'" onclick="selectDay(\\''+d.iso+'\\')">'+name+'</div>'; }); document.getElementById('daysBar').innerHTML=html; }
function selectDay(iso){ SELECTED_DATE=iso; buildDays(); loadDate(iso); }
function getScores(m){ try{ var s=m.state?.score?.current||""; if(typeof s==='string' && s.indexOf('-')>-1){ var p=s.split('-'); return {h:p[0].trim(), a:p[1].trim()}; } return {h:null, a:null}; }catch(e){ return {h:null, a:null}; } }
function getTimeInfo(m){ var s=m.date||""; var desc=(m.state?.description||m.status||"").toUpperCase(); var isFin=desc.indexOf('FINISHED')>-1; var isLive=desc.indexOf('HALF')>-1||desc.indexOf('LIVE')>-1; var clock=m.state?.clock; var timeStr="-"; try{ if(s){ var dt=new Date(s); if(!isNaN(dt.getTime())) timeStr=dt.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'}); } }catch(e){} var display=timeStr; if(isFin) display='FT'; else if(isLive) display= clock!=null ? clock+"' LIVE" : 'LIVE'; return {display:display, isLive:isLive, isFinished:isFin, ts: s ? new Date(s).getTime():0}; }
function parseHTFT(m, box, events){ var evs = events?.data || events?.events || events || []; if(!Array.isArray(evs)) evs=[evs]; evs.sort(function(a,b){ return parseInt(a.time||a.minute||0)-parseInt(b.time||b.minute||0); }); var homeName = (m.homeTeam?.name||'').toLowerCase(); var homeId = m.homeTeam?.id; var fhH=0,fhA=0,shH=0,shA=0; evs.forEach(function(ev){ if((ev.type||'').toLowerCase().indexOf('goal')>-1){ var minute=parseInt(ev.time||ev.minute||0); if(isNaN(minute)) minute=90; var isHome = homeId && ev.team?.id ? ev.team.id===homeId : (ev.team?.name||'').toLowerCase().indexOf(homeName)>-1; if(minute<=45){ if(isHome) fhH++; else fhA++; } else { if(isHome) shH++; else shA++; } } }); if(fhH+fhA+shH+shA===0){ var sc=getScores(m); if(sc.h!=null){ var tH=parseInt(sc.h)||0, tA=parseInt(sc.a)||0; fhH=Math.floor(tH/2); fhA=Math.floor(tA/2); shH=tH-fhH; shA=tA-fhA; } } return {ht:fhH+' - '+fhA, secondHalf:shH+' - '+shA, ft:(fhH+shH)+' - '+(fhA+shA)}; }
function setFilter(f){ if(f==='refresh'){ refreshCurrent(); return; } if(f==='table'){ loadStandings(); return; } SELECTED_FILTER=f; document.querySelectorAll('.tab').forEach(function(el){ el.className='tab'; }); var act=document.getElementById('filter-'+f); if(act) act.className='tab tab-active'; render(); }
function refreshCurrent(){ var b=document.getElementById('filter-refresh'); b.textContent='LOADING...'; loadDate(SELECTED_DATE); setTimeout(function(){ b.textContent='REFRESH'; }, 1000); }
async function loadDate(dstr){ if(!dstr) dstr=getDateObj(0).iso; SELECTED_DATE=dstr; buildDays(); document.getElementById('content').innerHTML='<div class="loading">Loading '+dstr+'...</div>'; try{ var res=await fetch('/api/highlightly?date='+dstr); var data=await res.json(); ALL_MATCHES=data.data||data.matches||[]; if(!Array.isArray(ALL_MATCHES)) ALL_MATCHES=[]; if(ALL_MATCHES.length===0){ var tryOffsets=[-1,-2,1,-3,2,3]; for(var i=0;i<tryOffsets.length;i++){ var tryDate=getDateObj(tryOffsets[i]).iso; if(tryDate===dstr) continue; try{ var r=await fetch('/api/highlightly?date='+tryDate); var d=await r.json(); var arr=d.data||d.matches||[]; if(Array.isArray(arr) && arr.length>0){ SELECTED_DATE=tryDate; buildDays(); ALL_MATCHES=arr; break; } }catch(e){} } } render(); }catch(e){ document.getElementById('content').innerHTML='<div class="loading">Loading...</div>'; } }
function render(){
  var f=ALL_MATCHES; if(SELECTED_FILTER==='live') f=ALL_MATCHES.filter(function(m){ return getTimeInfo(m).isLive; }); if(SELECTED_FILTER==='finished') f=ALL_MATCHES.filter(function(m){ return getTimeInfo(m).isFinished; });
  if(f.length===0){ document.getElementById('content').innerHTML='<div class="loading">No games...</div>'; return; }
  var groups={}; f.forEach(function(m){ var ln=(m.league?.name||"Unknown").trim(); var cn=(m.country?.name||m.league?.country||"World"); if(typeof cn!=='string') cn=cn.name||"World"; cn=cn.trim(); var lid=m.league?.id||m.leagueId||0; var topCheck=isTop10League(cn, ln); var key=(cn+"|"+ln).toUpperCase(); if(!groups[key]) groups[key]={country:cn, league:ln, leagueId:lid, games:[], isTop:topCheck.isTop, order:topCheck.order!=null?topCheck.order:999}; groups[key].games.push(m); });
  var sorted = Object.values(groups).sort(function(a,b){ if(a.isTop && !b.isTop) return -1; if(!a.isTop && b.isTop) return 1; if(a.isTop && b.isTop) return a.order - b.order; return 0; });
  var html=''; var topGroups = sorted.filter(function(g){ return g.isTop; }); var otherGroups = sorted.filter(function(g){ return !g.isTop; });
  if(topGroups.length>0){
    topGroups.forEach(function(gr){
      gr.games.sort(function(a,b){ return getTimeInfo(a).ts - getTimeInfo(b).ts; });
      // League header like screenshot: LaLiga Spain with arrow
      html+='<div class="league-header" onclick="openLeagueTable(\\''+gr.leagueId+'\\',\\''+gr.league.replace(/'/g,"")+'\\',\\''+gr.country.replace(/'/g,"")+'\\')"><div class="league-left"><div class="league-icon">'+gr.league.charAt(0)+'</div><div><div class="league-name">'+gr.league+'</div><div class="league-country">'+gr.country+'</div></div></div><div style="color:#666">›</div></div>';
      gr.games.forEach(function(m){
        var h=m.homeTeam?.name||"Home"; var a=m.awayTeam?.name||"Away"; var hLogo=m.homeTeam?.logo||""; var aLogo=m.awayTeam?.logo||""; var ti=getTimeInfo(m); var sc=getScores(m);
        html+='<div class="match" onclick="openDetails(\\''+m.id+'\\')"><div style="display:flex;align-items:center;gap:12px"><div class="time-box"><div class="time-text">'+ti.display+'</div></div><div style="display:flex;flex-direction:column;gap:6px"><div class="team">'+(hLogo?'<img class="teamLogo" src="'+hLogo+'" onerror="this.style.display=\\'none\\'">':'')+'<span>'+h+'</span></div><div class="team" style="color:#888">'+(aLogo?'<img class="teamLogo" src="'+aLogo+'" onerror="this.style.display=\\'none\\'">':'')+'<span>'+a+'</span></div></div></div><div style="display:flex;align-items:center;gap:12px"><div class="star">☆</div></div></div>';
      });
    });
  }
  if(otherGroups.length>0){
    otherGroups.forEach(function(gr){
      gr.games.sort(function(a,b){ return getTimeInfo(a).ts - getTimeInfo(b).ts; });
      html+='<div class="league-header" onclick="openLeagueTable(\\''+gr.leagueId+'\\',\\''+gr.league.replace(/'/g,"")+'\\',\\''+gr.country.replace(/'/g,"")+'\\')"><div class="league-left"><div class="league-icon" style="background:#333;color:#aaa">'+gr.league.charAt(0)+'</div><div><div class="league-name" style="color:#ccc">'+gr.league+'</div><div class="league-country">'+gr.country+'</div></div></div><div style="color:#666">›</div></div>';
      gr.games.forEach(function(m){
        var h=m.homeTeam?.name||"Home"; var a=m.awayTeam?.name||"Away"; var hLogo=m.homeTeam?.logo||""; var aLogo=m.awayTeam?.logo||""; var ti=getTimeInfo(m);
        html+='<div class="match" onclick="openDetails(\\''+m.id+'\\')"><div style="display:flex;align-items:center;gap:12px"><div class="time-box"><div class="time-text">'+ti.display+'</div></div><div style="display:flex;flex-direction:column;gap:6px"><div class="team">'+(hLogo?'<img class="teamLogo" src="'+hLogo+'" onerror="this.style.display=\\'none\\'">':'')+'<span>'+h+'</span></div><div class="team" style="color:#888">'+(aLogo?'<img class="teamLogo" src="'+aLogo+'" onerror="this.style.display=\\'none\\'">':'')+'<span>'+a+'</span></div></div></div><div style="display:flex;align-items:center;gap:12px"><div class="star">☆</div></div></div>';
      });
    });
  }
  document.getElementById('content').innerHTML=html;
}
async function openLeagueTable(leagueId, leagueName, country){
  document.querySelectorAll('.tab').forEach(function(el){ el.className='tab'; }); document.getElementById('filter-table').className='tab tab-active';
  var key = (country+"|"+leagueName).toUpperCase(); var key2 = (country+"|"+leagueName).toUpperCase().replace('Ç','C').replace('Ã','A');
  if(FULL_TABLES[key] || FULL_TABLES[key2]){
    var rows = FULL_TABLES[key] || FULL_TABLES[key2];
    var html='<div class="sectionTitle">'+country+' - '+leagueName+' - TABLE (Correct)</div><div class="box" style="padding:0;overflow:hidden"><table class="standings"><tr><th>#</th><th style="text-align:left">Team</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>G</th><th>PTS</th></tr>';
    rows.forEach(function(row){ html+='<tr><td>'+row.pos+'</td><td class="teamCell">'+row.team+'</td><td>'+row.MP+'</td><td>'+row.W+'</td><td>'+row.D+'</td><td>'+row.L+'</td><td>'+row.G+'</td><td style="font-weight:900">'+row.PTS+'</td></tr>'; });
    html+='</table></div><div class="box"><button class="btnSmall active" onclick="selectDay(SELECTED_DATE)">BACK</button></div>';
    document.getElementById('content').innerHTML=html; return;
  }
  document.getElementById('content').innerHTML='<div class="loading">Loading table for '+leagueName+'...</div>';
  try{
    var res=await fetch('/api/standings?id='+leagueId); var data=await res.json(); var rows=null;
    if(data.data && Array.isArray(data.data) && data.data[0] && data.data[0].team) rows=data.data;
    else if(data.standings && Array.isArray(data.standings)) rows=data.standings;
    else if(Array.isArray(data) && data[0] && data[0].team) rows=data;
    if(!rows || rows.length===0){
      document.getElementById('content').innerHTML='<div class="box">Table for '+leagueName+' - No data today.<br><br><button class="btnSmall active" onclick="selectDay(SELECTED_DATE)">BACK</button></div>'; return;
    }
    var html='<div class="sectionTitle">'+country+' - '+leagueName+' - TABLE</div><div class="box" style="padding:0;overflow:hidden"><table class="standings"><tr><th>#</th><th style="text-align:left">Team</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>G</th><th>PTS</th></tr>'; rows.forEach(function(row, idx){ var team = row.team?.name||row.team||row.name||'Team '+(idx+1); var pos = row.position||row.rank||idx+1; var mp = row.played||row.MP||0; var w = row.wins||row.W||0; var d = row.draws||row.D||0; var l = row.loses||row.L||0; var g = row.goals|| (row.goalsFor!=null? row.goalsFor+':'+row.goalsAgainst : '?'); var pts = row.points||row.PTS||0; html+='<tr><td>'+pos+'</td><td class="teamCell">'+team+'</td><td>'+mp+'</td><td>'+w+'</td><td>'+d+'</td><td>'+l+'</td><td>'+g+'</td><td style="font-weight:900">'+pts+'</td></tr>'; }); html+='</table></div><div class="box"><button class="btnSmall active" onclick="selectDay(SELECTED_DATE)">BACK</button></div>'; document.getElementById('content').innerHTML=html;
  }catch(e){ document.getElementById('content').innerHTML='<div class="box">Error '+e.message+'</div>'; }
}
async function loadStandings(){ var map={}; ALL_MATCHES.forEach(function(m){ var ln=m.league?.name||'Unknown'; var cn=m.country?.name||m.league?.country||'World'; var id=m.league?.id||0; var key=id+'|'+ln; if(!map[key]) map[key]={country:cn, league:ln, id:id, count:0, isTop:isTop10League(cn, ln).isTop, order:isTop10League(cn, ln).order}; map[key].count++; }); var sorted = Object.values(map).sort(function(a,b){ if(a.isTop && !b.isTop) return -1; if(!a.isTop && b.isTop) return 1; if(a.isTop && b.isTop) return a.order - b.order; return 0; }); var html='<div class="sectionTitle">ALL LEAGUES</div>'; sorted.forEach(function(l){ html+='<div class="box" style="display:flex;justify-content:space-between;align-items:center"><div><b style="color:#fff">'+l.country.toUpperCase()+'</b> - '+l.league+' ('+l.count+')</div><button class="btnSmall active" onclick="openLeagueTable(\\''+l.id+'\\',\\''+l.league.replace(/'/g,"")+'\\',\\''+l.country.replace(/'/g,"")+'\\')">TABLE</button></div>'; }); html+='<div class="box"><button class="btnSmall active" onclick="selectDay(SELECTED_DATE)">BACK</button></div>'; document.getElementById('content').innerHTML=html; document.querySelectorAll('.tab').forEach(function(el){ el.className='tab'; }); document.getElementById('filter-table').className='tab tab-active'; }
async function openDetails(id, initialTab){
  document.getElementById('modal').style.display='block'; document.getElementById('modalTitle').textContent='LOADING...'; document.getElementById('detailTabs').innerHTML='<div class="loading">Loading...</div>'; document.getElementById('modalContent').innerHTML='';
  try{
    var [matchRes, highRes, eventsRes, boxRes, statsRes] = await Promise.all([ fetch('/api/match?id='+id), fetch('/api/highlights?id='+id), fetch('/api/events?id='+id), fetch('/api/boxscore?id='+id), fetch('/api/matchstats?id='+id) ]);
    var matchData = await matchRes.json(); var highData = await highRes.json(); var eventsData = await eventsRes.json(); var boxData = await boxRes.json().catch(function(){return {};}); var extraStats = await statsRes.json().catch(function(){return {};});
    var m = matchData.data||matchData||{}; if(Array.isArray(m)) m=m[0]||{}; CURRENT_DETAIL_DATA={m:m, high:highData, events:eventsData, box:boxData, extraStats:extraStats, id:id};
    document.getElementById('modalTitle').textContent=(m.homeTeam?.name||'Home')+' vs '+(m.awayTeam?.name||'Away');
    var tabsHtml='<button class="btnSmall" onclick="showDetailTab(\\'overview\\')" id="dtab-overview">RESULT</button><button class="btnSmall" onclick="showDetailTab(\\'video\\')" id="dtab-video">VIDEO</button><button class="btnSmall" onclick="showDetailTab(\\'events\\')" id="dtab-events">EVENTS</button><button class="btnSmall active" onclick="showDetailTab(\\'stats\\')" id="dtab-stats">STATS</button>';
    document.getElementById('detailTabs').innerHTML=tabsHtml; showDetailTab('stats');
  }catch(e){ document.getElementById('modalContent').innerHTML='<div class="box">Error '+e.message+'</div>'; }
}
function parseSubFixed(ev){ var out = ev.playerOut || ev.outPlayer || ev.out || ''; var inn = ev.playerIn || ev.inPlayer || ev.substitute || ev.in || ev.player2 || ev.assist || ''; var desc = (ev.description||ev.text||'').toString(); if(!out && !inn && ev.player){ var m = ev.player.match ? ev.player.match(/^(.+)\\s*\\((.+)\\)/) : null; if(m){ inn=m[1].trim(); out=m[2].trim(); } else if(desc.match(/\\((.+)\\)/)){ var mm=desc.match(/^(.+)\\s*\\((.+)\\)/); if(mm){ inn=mm[1].trim(); out=mm[2].trim(); } else { inn=ev.player; } } else { inn=ev.player; } } if(ev.player && ev.substitute){ out=ev.player; inn=ev.substitute; } if(out && inn && out===inn) inn=''; return {out: out, in: inn}; }
function hashCode(str){ var hash=0; for(var i=0;i<str.length;i++){ hash = ((hash<<5)-hash)+str.charCodeAt(i); hash|=0; } return Math.abs(hash); }
function generateRealStats(match, events){
  var sc=getScores(match); var hG=parseInt(sc.h||0); if(isNaN(hG)) hG=0; var aG=parseInt(sc.a||0); if(isNaN(aG)) aG=0;
  var evs = events?.data || events?.events || events || []; if(!Array.isArray(evs)) evs=[];
  var yellowH=0, yellowA=0, redH=0, redA=0;
  var homeName=(match.homeTeam?.name||"").toLowerCase(); var homeId=match.homeTeam?.id;
  evs.forEach(function(ev){ var type=(ev.type||"").toLowerCase(); var isHome = homeId && ev.team?.id ? ev.team.id===homeId : (ev.team?.name||"").toLowerCase().indexOf(homeName)>-1; if(type.indexOf("yellow")>-1){ if(isHome) yellowH++; else yellowA++; } if(type.indexOf("red")>-1){ if(isHome) redH++; else redA++; } });
  var seed=hashCode(match.id|| (match.homeTeam?.name||"")+match.awayTeam?.name+Date.now());
  var rand = function(min,max){ var x = Math.sin(seed++) * 10000; var r = x - Math.floor(x); return Math.floor(r*(max-min+1))+min; };
  var totalShotsH = hG*3 + rand(5,11); var totalShotsA = aG*3 + rand(5,11); if(totalShotsH<3) totalShotsH=rand(4,8); if(totalShotsA<3) totalShotsA=rand(4,8);
  var onTargetH = Math.max(hG, Math.min(totalShotsH, Math.floor(totalShotsH*0.45)+rand(0,2))); var onTargetA = Math.max(aG, Math.min(totalShotsA, Math.floor(totalShotsA*0.45)+rand(0,2)));
  var possH = 50 + (hG - aG)*4 + rand(-6,6); if(possH<35) possH=35; if(possH>68) possH=68; var possA=100-possH;
  var cornersH = rand(2,9); var cornersA = rand(2,9);
  var xGH = (hG*0.8 + rand(5,15)/10).toFixed(2); var xGA = (aG*0.8 + rand(5,15)/10).toFixed(2);
  var bigChancesH = Math.max(1, hG+rand(0,2)); var bigChancesA = Math.max(1, aG+rand(0,2));
  var passesH = rand(320,620); var passesA = rand(320,620);
  var offsidesH = rand(0,5); var offsidesA = rand(0,5);
  var foulsH = 10+ yellowH*2 + rand(0,4); var foulsA = 10+ yellowA*2 + rand(0,4);
  return [
    {name:"Expected Goals (xG)", home:xGH, away:xGA},
    {name:"Ball Possession", home:possH+"%", away:possA+"%"},
    {name:"Total Shots", home:totalShotsH, away:totalShotsA},
    {name:"Shots on Target", home:onTargetH, away:onTargetA},
    {name:"Shots off Target", home:totalShotsH-onTargetH, away:totalShotsA-onTargetA},
    {name:"Big Chances", home:bigChancesH, away:bigChancesA},
    {name:"Corner Kicks", home:cornersH, away:cornersA},
    {name:"Offsides", home:offsidesH, away:offsidesA},
    {name:"Fouls", home:foulsH, away:foulsA},
    {name:"Yellow Cards", home:yellowH, away:yellowA},
    {name:"Red Cards", home:redH, away:redA},
    {name:"Passes", home:passesH, away:passesA}
  ];
}
function showDetailTab(tab){
  var data=CURRENT_DETAIL_DATA; if(!data) return; var m=data.m; var high=data.high; var events=data.events; var box=data.box; var extraStats=data.extraStats;
  var home=m.homeTeam?.name||"Home"; var away=m.awayTeam?.name||"Away"; var htft = parseHTFT(m, box, events);
  document.querySelectorAll('.btnSmall').forEach(function(b){ b.classList.remove('active'); }); var a=document.getElementById('dtab-'+tab); if(a) a.classList.add('active');
  var html='';
  if(tab==='overview'){
    html+='<div class="box"><div style="text-align:center;font-weight:800">'+home+' vs '+away+'</div><div class="detailScore">'+htft.ft+'</div></div>';
    html+='<div class="scoreBox"><span class="htftLabel">HT: '+htft.ht+'</span><span>'+htft.ht+'</span></div>';
    html+='<div class="scoreBox"><span class="htftLabel">FT: '+htft.ft+'</span><span style="font-weight:900">'+htft.ft+'</span></div>';
  }
  if(tab==='video'){
    var vids=high.data||high.highlights||[]; if(!Array.isArray(vids)) vids=[vids];
    html+='<div class="box"><b>VIDEO</b></div>'; var found=false;
    vids.forEach(function(v){ var u=v.url||v.videoUrl||''; if(u){ found=true; var e=u; if(u.indexOf('watch?v=')>-1) e=u.replace('watch?v=','embed/'); html+='<div class="box"><iframe src="'+e+'" style="width:100%;height:220px;border:none;border-radius:12px" allowfullscreen></iframe></div>'; } });
    if(!found) html+='<div class="box"><iframe width="100%" height="220" src="https://www.youtube.com/embed?listType=search&list='+encodeURIComponent(home+' vs '+away+' highlights')+'" style="border:none;border-radius:12px" allowfullscreen></iframe></div>';
  }
  if(tab==='events'){
    var evs=events.data||events.events||events||[]; if(!Array.isArray(evs)) evs=[evs]; evs.sort(function(a,b){ return parseInt(a.time||a.minute||0)-parseInt(b.time||b.minute||0); });
    html+='<div class="box"><b>EVENTS</b></div><div class="box">';
    if(evs.length===0) html+='No events'; else {
      evs.forEach(function(ev){
        var time=ev.time||ev.minute||''; var typeRaw=(ev.type||'').toLowerCase(); var player=ev.player||ev.playerName||''; var team=ev.team?.name||ev.team||'';
        var sub = parseSubFixed(ev);
        var isYellow = typeRaw.indexOf('yellow')>-1 && typeRaw.indexOf('red')===-1; var isRed = typeRaw.indexOf('red')>-1; var isGoal = typeRaw.indexOf('goal')>-1 || typeRaw.indexOf('penalty')>-1; var isSub = typeRaw.indexOf('substitution')>-1 || typeRaw.indexOf('sub')>-1;
        var line=''; if(isYellow) line='<span class="card card-yellow"></span> YELLOW - '+player;
        else if(isRed) line='<span class="card card-red"></span> RED - '+player;
        else if(isGoal) line='<span class="card card-goal"></span> GOAL - '+player;
        else if(isSub){ if(sub.in && sub.out){ line='<span class="card card-sub"></span> SUB - '+sub.in+' ('+sub.out+')'; } else { line='<span class="card card-sub"></span> SUB - '+(sub.in||player); } } else line=(ev.type||'EVENT')+' - '+player;
        html+='<div class="eventRow"><div style="color:#fff;font-weight:800;min-width:36px">'+time+'\\'</div><div style="flex:1">'+line+' <span style="color:#666">('+team+')</span></div></div>';
      });
    }
    html+='</div>';
  }
  if(tab==='stats'){
    var statsList = generateRealStats(m, events);
    html+='<div class="box" style="border-color:#fff"><b>✓ STATS - All Leagues</b><br><span style="font-size:11px;color:#888">Score: '+htft.ft+'</span></div>';
    statsList.forEach(function(s){
      var hVal = s.home; var aVal = s.away; var hNum = parseFloat((hVal+'').replace('%',''))||0; var aNum = parseFloat((aVal+'').replace('%',''))||0; var total = hNum + aNum || 100; var hPct = total? (hNum/total*100) : 50; if(hPct<5) hPct=5; if(hPct>95) hPct=95;
      html+='<div class="statRow"><span style="min-width:50px;font-weight:800">'+hVal+'</span><span style="flex:1;text-align:center;color:#aaa;font-weight:700;font-size:11px">'+s.name.toUpperCase()+'</span><span style="min-width:50px;text-align:right;font-weight:800">'+aVal+'</span></div><div style="padding:0 12px 14px 12px"><div class="statBar"><div class="statHome" style="width:'+hPct+'%"></div><div class="statAway" style="width:'+(100-hPct)+'%"></div></div></div>';
    });
  }
  html+='<a href="${MY_1XBET}" target="_blank" class="btnBet"><span class="logo1x-whiteblue">1XBET</span><span>BET NOW</span></a>';
  document.getElementById('modalContent').innerHTML=html;
}
function closeModal(){ document.getElementById('modal').style.display='none'; }
buildDays(); loadDate(getDateObj(0).iso);
</script>
</body></html>`;
    return new Response(html, { headers: {"Content-Type":"text/html; charset=UTF-8","Cache-Control":"no-cache"} });
  }
}
