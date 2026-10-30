// DIAMOND V20 - LIVESCORE.COM FREE API - SAME AS YOUR SCREENSHOT - NO KEY NEEDED
// API: prod-public-api.livescore.com - The real LiveScore.com API!

export default {
async fetch(req, env){
const url = new URL(req.url);

// API: FETCH FROM REAL LIVESCORE.COM
if(url.pathname==="/api/matches"){
  let date = url.searchParams.get("date")||""; // YYYY-MM-DD
  // Convert YYYY-MM-DD to YYYYMMDD for LiveScore API
  let d = date.replace(/-/g,"");
  if(!d) { let n=new Date(); d=n.getFullYear()+String(n.getMonth()+1).padStart(2,'0')+String(n.getDate()).padStart(2,'0'); }
  
  try{
    // REAL LIVESCORE.COM API - FREE - NO KEY!
    let apiUrl = `https://prod-public-api.livescore.com/v1/api/app/date/soccer/${d}/3?MD=1&locale=en`;
    let r = await fetch(apiUrl, {
      headers: {
        "User-Agent":"Mozilla/5.0",
        "Referer":"https://www.livescore.com/",
        "Accept":"application/json"
      }
    });
    let j = await r.json();
    
    // Convert LiveScore.com format to our format
    let matches = [];
    let stages = j.Stages||j.stages||[];
    stages.forEach(st=>{
      let leagueName = st.Snm||st.CompN||"League";
      let country = st.Cnm||st.CompD||"World";
      let leagueId = st.Sid||st.Cid||Math.random();
      let events = st.Events||st.events||[];
      events.forEach(ev=>{
        let home = ev.T1&&ev.T1[0]&&ev.T1[0].Nm||"Home";
        let away = ev.T2&&ev.T2[0]&&ev.T2[0].Nm||"Away";
        let homeId = ev.T1&&ev.T1[0]&&ev.T1[0].ID||0;
        let awayId = ev.T2&&ev.T2[0]&&ev.T2[0].ID||0;
        let scoreHome = ev.Tr1||ev.Tr1S1||"";
        let scoreAway = ev.Tr2||ev.Tr2S2||"";
        let status = ev.Eps||ev.ECo||ev.Es||"NS";
        let time = ev.Esd||ev.EsdTS||"";
        // Score string
        let current = "";
        if(ev.Tr1!=null && ev.Tr2!=null) current = ev.Tr1+" - "+ev.Tr2;
        // State description
        let desc = "Not Started";
        if(status==="FT") desc="Finished";
        else if(status==="LIVE"||status==="HT"||status==="1H"||status==="2H") desc="Live";
        else if(ev.Et) desc = ev.Et;
        
        matches.push({
          id: ev.Eid||ev.ID||Math.random(),
          date: time,
          league: {id: leagueId, name: leagueName},
          country: {name: country},
          homeTeam: {name: home, id: homeId},
          awayTeam: {name: away, id: awayId},
          state: {score:{current: current}, description: desc, status: status},
          status: desc,
          // Keep raw for table
          _stageId: st.Sid,
          _eid: ev.Eid
        });
      });
    });
    
    return new Response(JSON.stringify({data: matches, source:"livescore.com free", stages: stages.length}),{
      headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}
    });
  }catch(e){
    return new Response(JSON.stringify({data:[], error:e.message, note:"LiveScore API failed"}),{
      headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}
    });
  }
}

// TABLE FROM LIVESCORE.COM
if(url.pathname==="/api/table"){
  let stageId = url.searchParams.get("id")||"";
  try{
    let apiUrl = `https://prod-public-api.livescore.com/v1/api/app/stage/soccer/${stageId}/table?locale=en`;
    let r = await fetch(apiUrl,{headers:{"User-Agent":"Mozilla/5.0","Referer":"https://www.livescore.com/"}});
    let j = await r.json();
    // j has Tables or LeagueTable
    let tables = j.LeagueTable||j.Tables||j.table||[];
    let rows = [];
    // Try parse
    if(Array.isArray(tables)) {
      // tables[0].teamTables or rows
      let t = tables[0]||{};
      let teamRows = t.teamTables||t.Teams||t.tables||tables;
      if(Array.isArray(teamRows)){
        teamRows.forEach((tr,i)=>{
          let team = tr.Tnm||tr.teamName||tr.Team||"Team";
          let mp = tr.Pld||tr.pld||0;
          let w = tr.W||tr.wins||0;
          let d = tr.D||0;
          let l = tr.L||0;
          let gf = tr.GF||tr.goalsFor||0;
          let ga = tr.GA||0;
          let pts = tr.Pts||tr.pts||0;
          rows.push({pos:i+1, team:team, MP:mp, W:w, D:d, L:l, G:gf+":"+ga, PTS:pts});
        });
      }
    }
    return new Response(JSON.stringify({data: rows, raw: j, source:"livescore.com table"}),{
      headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}
    });
  }catch(e){
    return new Response(JSON.stringify({data:[], error:e.message}),{
      headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}
    });
  }
}

return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND V20 - LIVESCORE FREE</title><style>
*{box-sizing:border-box}body{margin:0;background:#000;color:#fff;font-family:Arial}
.top{background:#fff;color:#000;padding:12px;text-align:center;font-weight:900;letter-spacing:1px;display:flex;justify-content:center;align-items:center;gap:8px;position:sticky;top:0;z-index:200;border-bottom:3px solid #00ff66}.logo{font-size:18px;font-weight:900}.live-dot{background:#00ff66;color:#000;padding:3px 8px;border-radius:4px;font-size:11px}
.sportsBar{display:flex;gap:6px;padding:10px;background:#111;overflow-x:auto;border-bottom:2px solid #222;position:sticky;top:51px;z-index:150}.sportBtn{padding:10px 14px;border-radius:20px;font-weight:900;font-size:11px;white-space:nowrap;cursor:pointer;border:1.5px solid #333}.sport-inactive{background:#000;color:#aaa}.sport-active{background:#fff;color:#000}
.days{display:flex;justify-content:space-between;align-items:center;padding:10px 15px;background:#1a1a1a;border-bottom:1px solid #333;position:sticky;top:100px;z-index:149}.dayNav{display:flex;align-items:center;gap:15px;width:100%;justify-content:space-between}.dayBtn{padding:8px 14px;border-radius:6px;font-weight:900;font-size:13px;cursor:pointer;background:#2a2a2a;color:#fff;border:none}.dayBtn.active{background:#fff;color:#000}.centerDay{font-weight:900;font-size:16px}
.section{background:#1a1a1a;padding:12px 15px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222;cursor:pointer}.section:hover{background:#222}.sectionLeft{display:flex;align-items:center;gap:10px}.flag{width:22px;height:22px;background:#333;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px}.leagueName{font-weight:900;font-size:13px}.leagueSub{font-size:11px;color:#aaa}
.match{background:#000;display:flex;justify-content:space-between;align-items:center;padding:14px 15px;border-bottom:1px solid #111;cursor:pointer}.match:hover{background:#0a0a0a}.timeBox{width:55px;font-size:12px;color:#aaa}.ft{color:#fff;font-weight:900}.live{color:#ff3b30;font-weight:900}.teamRow{display:flex;align-items:center;gap:8px;margin:3px 0}.teamLogo{width:18px;height:18px;background:#222;border-radius:50%}.teamName{font-size:13px}.scoreBox{text-align:center;min-width:30px;font-weight:900;font-size:14px}
.box{background:#111;border:1px solid #222;border-radius:8px;padding:12px;margin:8px}table{width:100%;border-collapse:collapse;font-size:11px}th{background:#fff;color:#000;padding:8px 4px}td{padding:9px 4px;border-bottom:1px solid #1a1a1a;text-align:center}
#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:none;overflow-y:auto}#modalTop{background:#fff;color:#000;padding:12px;position:sticky;top:0;display:flex;justify-content:space-between;align-items:center}.close{background:#000;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:900}.tabs{display:flex;background:#111;border-bottom:2px solid #333}.tabs button{flex:1;padding:13px;background:#111;color:#aaa;border:none;font-weight:900;cursor:pointer}.tabs button.active{background:#fff;color:#000}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:1px solid #333;z-index:9999}.bottom a{background:#00ff66;color:#000;padding:13px;border-radius:12px;font-weight:900;text-align:center;display:flex;justify-content:center;gap:10px;text-decoration:none}.spacer{height:80px}.loading{padding:30px;text-align:center;color:#aaa}.bet{padding:10px}.bet a{background:#00ff66;color:#000;padding:13px;border-radius:12px;font-weight:900;text-decoration:none;display:flex;justify-content:center;gap:10px}
</style></head><body>
<div class="top"><span class="logo">LiveScore</span><span style="color:#666;font-size:10px">TM</span><span class="live-dot">FREE API</span></div>
<div class="bet"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank"><span style="background:#fff;color:#0066ff;padding:5px 14px;border-radius:6px;font-weight:900">1XBET</span><span>BET NOW 300% BONUS</span></a></div>
<div class="sportsBar"><div class="sportBtn sport-active">⚽ Football</div><div class="sportBtn sport-inactive">🏒 Hockey</div><div class="sportBtn sport-inactive">🏀 Basketball</div></div>
<div class="days"><div class="dayNav"><button class="dayBtn" id="btn-live">LIVE</button><button class="dayBtn" onclick="changeDay(-1)"><</button><span class="centerDay" id="centerDay">Today</span><button class="dayBtn" onclick="changeDay(1)">></button><button class="dayBtn" onclick="pickDate()">📅</button></div></div>
<div id="content"><div class="loading">Loading from livescore.com FREE API...<br>Same as your screenshot!</div></div>
<div id="modal"><div id="modalTop"><span id="mt" style="font-weight:900">MATCH</span><button class="close" onclick="closeModal()">X</button></div><div class="tabs"><button id="tb-d" class="active" onclick="showTab('d')">DETAILS</button><button id="tb-t" onclick="showTab('t')">TABLE</button></div><div id="tab-d"></div><div id="tab-t" style="display:none"><div id="tbox"></div></div></div>
<div class="spacer"></div><div class="bottom"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank"><span style="background:#fff;color:#0066ff;padding:5px 14px;border-radius:6px;font-weight:900">1XBET</span><span>V20 FREE LIVESCORE API</span></a></div>
<script>
var ALL=[];var curOffset=0;var curStage=null;
function getDateStr(offset){
  var n=new Date(); n.setDate(n.getDate()+offset);
  var l=new Date(n.toLocaleString('en-US',{timeZone:'Africa/Lagos'}));
  return l.getFullYear()+"-"+String(l.getMonth()+1).padStart(2,'0')+"-"+String(l.getDate()).padStart(2,'0');
}
function getLabel(offset){
  if(offset===0) return "Today";
  if(offset===-1) return "Yesterday";
  if(offset===1) return "Tomorrow";
  var n=new Date(); n.setDate(n.getDate()+offset);
  return n.toLocaleDateString('en-GB',{day:'2-digit',month:'short'});
}
async function load(offset){
  curOffset=offset;
  document.getElementById('centerDay').textContent=getLabel(offset);
  var dStr=getDateStr(offset);
  document.getElementById('content').innerHTML='<div class="loading">Loading '+dStr+' from livescore.com API...<br>Free - No Key!</div>';
  try{
    var r=await fetch('/api/matches?date='+dStr+'&t='+Date.now());
    var j=await r.json();
    ALL=j.data||[];
    render();
  }catch(e){
    document.getElementById('content').innerHTML='<div class="box">Error: '+e.message+'</div>';
  }
}
function render(){
  if(ALL.length===0){
    document.getElementById('content').innerHTML='<div class="box" style="text-align:center;padding:20px">No matches for '+getDateStr(curOffset)+'<br>LiveScore.com API returned 0<br>Try Yesterday/Tomorrow</div>';
    return;
  }
  var groups={};
  ALL.forEach(m=>{
    var lid=m.league.id; var ln=m.league.name; var cn=m.country.name;
    var k=String(lid);
    if(!groups[k]) groups[k]={country:cn, league:ln, leagueId:lid, stageId:m._stageId, games:[]};
    groups[k].games.push(m);
  });
  var html='';
  Object.values(groups).forEach(gr=>{
    html+='<div class="section" data-stage="'+gr.stageId+'"><div class="sectionLeft"><div class="flag">⚽</div><div><div class="leagueName">'+gr.league+'</div><div class="leagueSub">'+gr.country+'</div></div></div><div>></div></div>';
    gr.games.forEach(m=>{
      var h=m.homeTeam.name; var a=m.awayTeam.name;
      var score=m.state.score.current||"";
      var parts=score.split('-');
      var hs=parts[0]||""; var as=parts[1]||"";
      var isFT=m.state.description==="Finished";
      var timeText=isFT?"FT":(m.date?new Date(m.date).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}):"");
      if(m.state.description==="Live") timeText="LIVE";
      var cls=isFT?"ft":(m.state.description==="Live"?"live":"");
      html+='<div class="match" data-id="'+m.id+'" data-stage="'+gr.stageId+'"><div class="timeBox"><div class="'+cls+'">'+(timeText||"FT")+'</div></div><div style="flex:1;margin-left:10px"><div class="teamRow"><div class="teamLogo"></div><div class="teamName">'+h+'</div></div><div class="teamRow"><div class="teamLogo"></div><div class="teamName">'+a+'</div></div></div><div class="scoreBox"><div>'+hs+'</div><div>'+as+'</div></div></div>';
    });
  });
  document.getElementById('content').innerHTML=html;
  document.querySelectorAll('.section').forEach(el=>el.onclick=function(){openTable(this.dataset.stage);});
  document.querySelectorAll('.match').forEach(el=>el.onclick=function(){openDetails(this.dataset.id);});
}
function changeDay(dir){ load(curOffset+dir); }
function pickDate(){ var d=prompt("Enter date YYYY-MM-DD","2025-10-30"); if(d){ var target=new Date(d); var today=new Date(); var diff=Math.round((target-today)/(1000*60*60*24)); load(diff); } }
async function openTable(stageId){
  curStage=stageId;
  document.getElementById('modal').style.display='block';
  showTab('t');
  document.getElementById('mt').textContent='Table';
  document.getElementById('tbox').innerHTML='<div class="loading">Loading table for stage '+stageId+' from livescore.com...</div>';
  try{
    var r=await fetch('/api/table?id='+stageId+'&t='+Date.now());
    var j=await r.json();
    var rows=j.data||[];
    if(rows.length===0){
      document.getElementById('tbox').innerHTML='<div class="box">No table yet for this league.<br>Raw: '+JSON.stringify(j).slice(0,500)+'</div>';
      return;
    }
    var h='<div class="box" style="padding:0;overflow-x:auto"><div style="background:#fff;color:#000;padding:10px;font-weight:900;text-align:center">FULL TABLE - LIVESCORE.COM ('+rows.length+' TEAMS)</div><table><tr><th>#</th><th style="text-align:left">Team</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>G</th><th>PTS</th></tr>';
    rows.forEach(r=>{h+='<tr><td>'+r.pos+'</td><td style="text-align:left">'+r.team+'</td><td>'+r.MP+'</td><td>'+r.W+'</td><td>'+r.D+'</td><td>'+r.L+'</td><td>'+r.G+'</td><td style="font-weight:900">'+r.PTS+'</td></tr>';});
    h+='</table></div>';
    document.getElementById('tbox').innerHTML=h;
  }catch(e){ document.getElementById('tbox').innerHTML='<div class="box">Error: '+e.message+'</div>'; }
}
function openDetails(id){
  var m=ALL.find(x=>String(x.id)===String(id));
  if(!m) return;
  document.getElementById('modal').style.display='block';
  showTab('d');
  document.getElementById('mt').textContent=m.homeTeam.name+' vs '+m.awayTeam.name;
  document.getElementById('tab-d').innerHTML='<div class="box" style="text-align:center"><div style="font-weight:900">'+m.league.name+'</div><div style="font-size:28px;margin:15px 0">'+(m.state.score.current||"vs")+'</div><div>'+m.homeTeam.name+'<br>'+m.awayTeam.name+'</div><div style="color:#aaa;margin-top:10px">'+m.state.description+'</div></div>';
  curStage=m._stageId;
}
function showTab(id){document.getElementById('tab-d').style.display=id==='d'?'block':'none';document.getElementById('tab-t').style.display=id==='t'?'block':'none';document.getElementById('tb-d').classList.toggle('active',id==='d');document.getElementById('tb-t').classList.toggle('active',id==='t');}
function closeModal(){document.getElementById('modal').style.display='none';}
load(0);
setInterval(()=>load(curOffset),120000);
<\/script></body></html>`,{headers:{"Content-Type":"text/html"}});
}
}
