const MY_1XBET = "https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97";
const SPORTS = {
  football: {url:"https://soccer.highlightly.net", name:"FOOTBALL", icon:"⚽"},
  basketball: {url:"https://basketball.highlightly.net", name:"BASKETBALL", icon:"🏀"},
  handball: {url:"https://handball.highlightly.net", name:"HANDBALL", icon:"🤾"},
  volleyball: {url:"https://volleyball.highlightly.net", name:"VOLLEYBALL", icon:"🏐"},
  hockey: {url:"https://hockey.highlightly.net", name:"HOCKEY", icon:"🏒"},
  rugby: {url:"https://rugby.highlightly.net", name:"RUGBY", icon:"🏉"}
};

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
    if(url.pathname === "/api/sports"){
      let sport = url.searchParams.get("sport")||"football";
      let date = url.searchParams.get("date")||"";
      let base = SPORTS[sport]?.url || SPORTS.football.url;
      return await cachedFetch(`${base}/matches?date=${date}`, 90);
    }
    if(url.pathname === "/api/standings"){
      let sport = url.searchParams.get("sport")||"football";
      let id = url.searchParams.get("id")||"";
      let base = SPORTS[sport]?.url || SPORTS.football.url;
      let cacheKey = new Request(`${base}/standings?leagueId=${id}&season=2026`, {headers:H});
      let cached = await cache.match(cacheKey);
      if(cached) return cached;
      for(let season of ["2026","2026/27","2025"]){
        try{
          let r = await fetch(`${base}/standings?leagueId=${id}&season=${season}`, {headers:H});
          if(!r.ok) continue;
          let json = JSON.parse(await r.text());
          let rows = json.data || json.standings || [];
          if(rows.length<2) continue;
          let auto = rows.map((t,i)=>({
            team: t.team?.name || t.team || t.name,
            MP: t.played || 0, W: t.wins || 0, D: t.draws || 0, L: t.loses || 0,
            G: t.goalsFor!=null ? `${t.goalsFor}:${t.goalsAgainst}` : (t.pointsFor ? `${t.pointsFor}:${t.pointsAgainst}` : "0:0"),
            PTS: t.points || 0, GD: (t.goalsFor||t.pointsFor||0)-(t.goalsAgainst||t.pointsAgainst||0)
          })).sort((a,b)=> b.PTS - a.PTS || b.GD - a.GD).map((t,i)=>({pos:i+1,...t}));
          let res = new Response(JSON.stringify({data:auto, season:"2026/27", sport:sport}), 
          {headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*","Cache-Control":"public, max-age=300"}});
          await cache.put(cacheKey, res.clone());
          return res;
        }catch(e){}
      }
      return new Response(JSON.stringify({data:[]}), {headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*"}});
    }
    if(url.pathname === "/api/match"){
      let sport = url.searchParams.get("sport")||"football";
      let id = url.searchParams.get("id")||"";
      let base = SPORTS[sport]?.url || SPORTS.football.url;
      return await cachedFetch(`${base}/matches/${id}`, 60);
    }

    const html = `<!DOCTYPE html><html><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND - MORE DAYS LIST</title>
<style>
html,body{margin:0;background:#000;color:#fff;font-family:Arial}
.top{display:flex;justify-content:center;padding:12px;background:#000;border-bottom:3px solid #00ff66;position:sticky;top:0;z-index:200}
.logo{background:#00ff66;color:#000;padding:8px 28px;border-radius:8px;font-weight:900;font-style:italic}
.sportsBar{display:flex;gap:6px;padding:10px;background:#111;overflow-x:auto;border-bottom:2px solid #00ff66;position:sticky;top:54px;z-index:150;scrollbar-width:none}
.sportBtn{padding:10px 16px;border-radius:20px;font-weight:900;font-size:11px;white-space:nowrap;cursor:pointer;border:1.5px solid #00ff66;min-width:80px;text-align:center}
.sport-inactive{background:#000;color:#00ff66}.sport-active{background:#00ff66;color:#000}
.days{display:flex;gap:8px;padding:10px;background:#000;overflow-x:auto;border-bottom:1px solid #333;position:sticky;top:103px;z-index:149;scrollbar-width:none}
.dayBtn{padding:12px 18px;border-radius:20px;font-weight:900;font-size:12px;white-space:nowrap;cursor:pointer;border:1.5px solid #00ff66;min-width:90px;text-align:center}
.day-inactive{background:#000;color:#00ff66}.day-active{background:#00ff66;color:#000;box-shadow:0 0 8px #00ff66}
.moreDaysBox{background:#0a0a0a;border:2px solid #00ff66;border-radius:10px;margin:8px;overflow:hidden;display:none}
.moreHeader{background:#8B0000;color:#fff;padding:10px 12px;font-weight:900;font-size:13px}
.moreRow{padding:12px 15px;border-bottom:1px solid #222;background:#0a0a0a;cursor:pointer}
.moreRow a{color:#00ccff;text-decoration:underline;font-size:13px}
.moreRow:hover{background:#111}
.sectionTitle{background:#00ff66;color:#000;padding:9px 10px;font-weight:900;font-size:12px}
.match{display:flex;justify-content:space-between;align-items:center;padding:12px 10px;background:#0a0a0a;border-bottom:1px solid #1a1a1a;cursor:pointer}
.league-header{background:#111;border-top:2px solid #00ff66;padding:10px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}
.score{color:#00ff66;font-weight:900;font-size:16px;text-align:center;min-width:50px}
.time-box{width:72px;text-align:center}.time-green{color:#00ff66;font-weight:900}.time-live{color:#ff3b30;font-weight:900}.time-ft{color:#fff;font-weight:900}
.box{background:#0a0a0a;border:1px solid #222;border-radius:10px;padding:12px;margin:8px}
.btnSmall{background:#111;color:#00ff66;border:1px solid #00ff66;padding:6px 12px;border-radius:20px;font-weight:900;font-size:10px;cursor:pointer}.btnSmall.active{background:#00ff66;color:#000}
table.standings{width:100%;border-collapse:collapse;font-size:11px} table.standings th{background:#00ff66;color:#000;padding:7px 3px} table.standings td{padding:8px 3px;border-bottom:1px solid #1a1a1a;text-align:center} table.standings td.teamCell{text-align:left;color:#fff}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2.5px solid #00ff66;z-index:9999}.bottom a{background:#00ff66;color:#000;padding:12px;border-radius:12px;font-weight:900;text-align:center;display:flex;justify-content:center;gap:10px;text-decoration:none}
.spacer{height:90px}.loading{padding:20px;text-align:center;color:#00ff66}
#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:none;overflow-y:auto}
#modalTop{background:#000;border-bottom:2.5px solid #00ff66;padding:12px;position:sticky;top:0;display:flex;justify-content:space-between;align-items:center}
.closeBtn{background:#00ff66;color:#000;border:none;padding:10px 18px;border-radius:8px;font-weight:900}
.bet{padding:10px}.bet a{background:#00ff66;color:#000;padding:12px;border-radius:12px;font-weight:900;text-decoration:none;display:flex;justify-content:center;gap:10px}
.logo1x-whiteblue{background:#fff;color:#0066ff;padding:5px 14px;border-radius:6px;font-weight:900;font-style:italic}
</style>
</head><body>
<div class="top"><span class="logo">DIAMOND SPORTS API ALL</span></div>
<div class="bet"><a href="${MY_1XBET}" target="_blank"><span class="logo1x-whiteblue">1XBET</span><span>BET NOW BONUS 300% - ALL SPORTS</span></a></div>
<div class="sportsBar" id="sportsBar"></div>
<div class="days" id="daysBar"></div>
<div class="moreDaysBox" id="moreDaysBox"></div>
<div id="content"><div class="loading">Loading SPORTS API ALL...</div></div>
<div id="modal"><div id="modalTop"><span style="color:#00ff66;font-weight:900" id="modalTitle">MATCH</span><button class="closeBtn" onclick="closeModal()">X CLOSE</button></div><div id="modalContent"></div></div>
<div class="spacer"></div>
<div class="bottom"><a href="${MY_1XBET}" target="_blank"><span class="logo1x-whiteblue">1XBET</span><span>BET ALL SPORTS NOW</span></a></div>
<script>
var ALL_MATCHES=[]; var SELECTED_SPORT='football'; var SELECTED_DATE=''; var moreOpen=false;
var SPORTS = {
  football: {name:"FOOTBALL", icon:"⚽"},
  basketball: {name:"BASKETBALL", icon:"🏀"},
  handball: {name:"HANDBALL", icon:"🤾"},
  volleyball: {name:"VOLLEYBALL", icon:"🏐"},
  hockey: {name:"HOCKEY", icon:"🏒"},
  rugby: {name:"RUGBY", icon:"🏉"}
};
function getIso(off){ var n=new Date(); n.setDate(n.getDate()+off); var l=new Date(n.toLocaleString('en-US',{timeZone:'Africa/Lagos'})); return l.getFullYear()+"-"+String(l.getMonth()+1).padStart(2,'0')+"-"+String(l.getDate()).padStart(2,'0'); }
var dateMap={};
function initDates(){
  dateMap['yesterday']=getIso(-1);
  dateMap['today']=getIso(0);
  dateMap['tomorrow']=getIso(1);
  for(var i=-7;i<=7;i++){ if(i===-1||i===0||i===1) continue; dateMap['d'+i]=getIso(i); }
}
function buildSports(){
  var html=''; for(var k in SPORTS){ var active = k===SELECTED_SPORT ? 'sport-active' : 'sport-inactive'; html+='<div class="sportBtn '+active+'" onclick="selectSport(\\''+k+'\\')">'+SPORTS[k].icon+' '+SPORTS[k].name+'</div>'; }
  document.getElementById('sportsBar').innerHTML=html;
}
function selectSport(s){ SELECTED_SPORT=s; buildSports(); buildDays(); loadDate(dateMap['today']); }
function formatMoreDay(iso){
  var dt=new Date(iso);
  var dd=String(dt.getDate()).padStart(2,'0');
  var mm=String(dt.getMonth()+1).padStart(2,'0');
  var map={Mon:'Mo',Tue:'Tu',Wed:'We',Thu:'Th',Fri:'Fr',Sat:'Sa',Sun:'Su'};
  var short=dt.toLocaleDateString('en-GB',{weekday:'short'});
  var wd=map[short]||short.substring(0,2);
  return dd+'/'+mm+' '+wd;
}
function buildDays(){
  var html='';
  var days = [
    {key:'yesterday', label:'YESTERDAY'},
    {key:'today', label:'TODAY'},
    {key:'tomorrow', label:'TOMORROW'}
  ];
  days.forEach(function(d){
    var iso=dateMap[d.key];
    var active=(SELECTED_DATE===iso)?'day-active':'day-inactive';
    if(SELECTED_DATE==='' && d.key==='today'){ active='day-active'; SELECTED_DATE=iso; }
    html+='<div class="dayBtn '+active+'" onclick="selectDay(\\''+d.key+'\\')">'+d.label+'</div>';
  });
  var moreActive = moreOpen ? 'day-active' : 'day-inactive';
  html+='<div class="dayBtn '+moreActive+'" onclick="toggleMoreDays()">MORE DAYS »</div>';
  document.getElementById('daysBar').innerHTML=html;
}
function selectDay(k){
  moreOpen=false;
  document.getElementById('moreDaysBox').style.display='none';
  SELECTED_DATE=dateMap[k]||dateMap['today'];
  buildDays();
  loadDate(SELECTED_DATE);
}
function toggleMoreDays(){
  moreOpen=!moreOpen;
  if(!moreOpen){ document.getElementById('moreDaysBox').style.display='none'; buildDays(); return; }
  var html='<div class="moreHeader">More days</div>';
  // 7 days before like screenshot
  for(var i=-7;i<=-1;i++){
    if(i===-1){
      html+='<div class="moreRow" onclick="selectMore(\\'yesterday\\')"><a>Yesterday</a></div>';
    } else {
      var iso=getIso(i);
      var label=formatMoreDay(iso);
      var k='d'+i;
      html+='<div class="moreRow" onclick="selectMore(\\''+k+'\\')"><a>'+label+'</a></div>';
    }
  }
  html+='<div class="moreRow" onclick="selectMore(\\'today\\')"><a>Today</a></div>';
  html+='<div class="moreRow" onclick="selectMore(\\'tomorrow\\')"><a>Tomorrow</a></div>';
  for(var j=2;j<=7;j++){
    var iso2=getIso(j);
    var label2=formatMoreDay(iso2);
    var k2='d'+j;
    html+='<div class="moreRow" onclick="selectMore(\\''+k2+'\\')"><a>'+label2+'</a></div>';
  }
  document.getElementById('moreDaysBox').innerHTML=html;
  document.getElementById('moreDaysBox').style.display='block';
  buildDays();
}
function selectMore(k){
  SELECTED_DATE=dateMap[k]||getIso(0);
  moreOpen=false;
  document.getElementById('moreDaysBox').style.display='none';
  buildDays();
  loadDate(SELECTED_DATE);
}
function getScores(m){ try{ var s=m.state?.score?.current||""; if(typeof s==='string' && s.indexOf('-')>-1){ var p=s.split('-'); return {h:p[0].trim(), a:p[1].trim()}; } return {h:null, a:null}; }catch(e){ return {h:null, a:null}; } }
function getTimeInfo(m){ var s=m.date||""; var desc=(m.state?.description||m.status||"").toUpperCase(); var isFin=desc.indexOf('FINISHED')>-1; var isLive=desc.indexOf('HALF')>-1||desc.indexOf('LIVE')>-1; var timeStr="-"; try{ if(s){ var dt=new Date(s); if(!isNaN(dt.getTime())) timeStr=dt.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'}); } }catch(e){} var display=isFin?'FT':(isLive?'LIVE':timeStr); return {display:display, isLive:isLive, isFinished:isFin, ts: s ? new Date(s).getTime():0}; }
async function loadDate(dstr){ if(!dstr) dstr=getIso(0); SELECTED_DATE=dstr; buildSports(); buildDays(); document.getElementById('content').innerHTML='<div class="loading">Loading '+SPORTS[SELECTED_SPORT].icon+' '+SELECTED_SPORT.toUpperCase()+' - '+dstr+' - SPORTS API ALL...</div>'; try{ var res=await fetch('/api/sports?sport='+SELECTED_SPORT+'&date='+dstr); var data=await res.json(); ALL_MATCHES=data.data||data.matches||[]; if(!Array.isArray(ALL_MATCHES)) ALL_MATCHES=[]; render(); }catch(e){ document.getElementById('content').innerHTML='<div class="loading">No games for '+SELECTED_SPORT+'...</div>'; } }
function render(){
  if(ALL_MATCHES.length===0){ document.getElementById('content').innerHTML='<div class="box">No '+SELECTED_SPORT+' games for '+SELECTED_DATE+'<br><br>Sports API includes all sports but games depend on date.<br><br>Try other sport or date.</div>'; return; }
  var groups={}; ALL_MATCHES.forEach(function(m){ var ln=(m.league?.name||"Unknown").trim(); var cn=(m.country?.name||m.league?.country||"World"); if(typeof cn!=='string') cn=cn.name||"World"; cn=cn.trim(); var lid=m.league?.id||0; var key=(cn+"|"+ln).toUpperCase(); if(!groups[key]) groups[key]={country:cn, league:ln, leagueId:lid, games:[]}; groups[key].games.push(m); });
  var html='<div class="sectionTitle">'+SPORTS[SELECTED_SPORT].icon+' '+SELECTED_SPORT.toUpperCase()+' - '+SELECTED_DATE+' - SPORTS API ALL ('+ALL_MATCHES.length+' games)</div>';
  Object.values(groups).forEach(function(gr){
    gr.games.sort(function(a,b){ return getTimeInfo(a).ts - getTimeInfo(b).ts; });
    html+='<div class="league-header" onclick="openTable(\\''+gr.leagueId+'\\',\\''+gr.league.replace(/'/g,"")+'\\',\\''+gr.country.replace(/'/g,"")+'\\')"><div><span style="background:#00ff66;color:#000;padding:3px 8px;border-radius:4px;font-weight:900;font-size:10px">'+gr.country.toUpperCase()+'</span><span style="color:#00ff66;font-weight:900;margin-left:8px">'+gr.league.toUpperCase()+'</span></div><div><span style="background:#000;border:1px solid #00ff66;color:#00ff66;padding:2px 8px;border-radius:12px;font-size:11px">'+gr.games.length+'</span> <span style="background:#00ff66;color:#000;padding:2px 8px;border-radius:12px;font-size:10px">TABLE AUTO</span></div></div>';
    gr.games.forEach(function(m){
      var h=m.homeTeam?.name||"Home"; var a=m.awayTeam?.name||"Away"; var ti=getTimeInfo(m); var sc=getScores(m);
      var scoreHtml=sc.h!=null?'<span style="color:#00ff66;font-weight:900">'+sc.h+'</span><br><span style="color:#00ff66;font-weight:900">'+sc.a+'</span>':(ti.isFinished?'FT':'-');
      var tc=ti.isLive?'time-live':(ti.isFinished?'time-ft':'time-green');
      html+='<div class="match" onclick="openDetails(\\''+m.id+'\\')"><div class="time-box"><div class="'+tc+'">'+ti.display+'</div></div><div style="flex:1;margin-left:10px"><div style="font-size:13px">'+h+'</div><div style="font-size:13px;color:#aaa;margin-top:4px">'+a+'</div></div><div class="score">'+scoreHtml+'</div></div>';
    });
  });
  document.getElementById('content').innerHTML=html;
}
async function openTable(leagueId, leagueName, country){
  document.getElementById('content').innerHTML='<div class="loading">Loading AUTO TABLE for '+leagueName+' - '+SELECTED_SPORT+'...</div>';
  try{
    let res = await fetch('/api/standings?sport='+SELECTED_SPORT+'&id='+leagueId);
    let data = await res.json(); let rows = data.data||[];
    if(rows.length===0){ document.getElementById('content').innerHTML='<div class="box">No table for '+leagueName+'<br><button class="btnSmall active" onclick="selectDay(\\'today\\')">BACK</button></div>'; return; }
    let html='<div class="sectionTitle">'+country.toUpperCase()+' - '+leagueName.toUpperCase()+' - '+SELECTED_SPORT.toUpperCase()+' AUTO TABLE ('+rows.length+' teams)</div><div class="box" style="padding:0;overflow-x:auto"><table class="standings"><tr><th>#</th><th style="text-align:left">Team</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>G</th><th>PTS</th></tr>';
    rows.forEach(r=>{ html+='<tr><td style="color:#00ff66;font-weight:900">'+r.pos+'.</td><td class="teamCell">'+r.team+'</td><td>'+r.MP+'</td><td>'+r.W+'</td><td>'+r.D+'</td><td>'+r.L+'</td><td>'+r.G+'</td><td style="color:#00ff66;font-weight:900">'+r.PTS+'</td></tr>'; });
    html+='</table></div><div class="box" style="color:#00ff66;font-size:11px">✓ AUTO ARRANGED FROM SPORTS API - Sorted by Points</div><div class="box"><button class="btnSmall active" onclick="selectDay(\\'today\\')">BACK</button></div>';
    document.getElementById('content').innerHTML=html;
  }catch(e){ document.getElementById('content').innerHTML='<div class="box">Error '+e.message+'</div>'; }
}
async function openDetails(id){
  document.getElementById('modal').style.display='block'; document.getElementById('modalContent').innerHTML='<div class="loading">Loading...</div>';
  try{
    var res = await fetch('/api/match?sport='+SELECTED_SPORT+'&id='+id); var data = await res.json(); var m = data.data||data||{};
    if(Array.isArray(m)) m=m[0]||{}; var h=m.homeTeam?.name||"Home"; var a=m.awayTeam?.name||"Away"; var sc=getScores(m); var ft = sc.h!=null ? sc.h+' - '+sc.a : '0 - 0';
    document.getElementById('modalTitle').textContent=h+' vs '+a+' - '+SELECTED_SPORT.toUpperCase();
    document.getElementById('modalContent').innerHTML='<div class="box" style="text-align:center"><div style="color:#00ff66;font-weight:900">'+SPORTS[SELECTED_SPORT].icon+' '+SELECTED_SPORT.toUpperCase()+'</div><div style="font-size:40px;font-weight:900">'+ft+'</div><div style="color:#aaa;font-size:11px">'+h+' vs '+a+'</div></div><a href="${MY_1XBET}" target="_blank" style="background:#0052ff;color:#fff;padding:12px;border-radius:10px;font-weight:900;display:flex;justify-content:center;gap:10px;text-decoration:none;margin:8px"><span class="logo1x-whiteblue">1XBET</span><span>BET NOW</span></a>';
  }catch(e){ document.getElementById('modalContent').innerHTML='<div class="box">Error</div>'; }
}
function closeModal(){ document.getElementById('modal').style.display='none'; }
initDates(); buildSports(); buildDays(); loadDate(getIso(0));
</script>
</body></html>`;
    return new Response(html, { headers: {"Content-Type":"text/html; charset=UTF-8","Cache-Control":"no-cache"} });
  }
}
