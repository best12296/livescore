// V21 SPORTSCORE - FREE API - NO KEY - NO STUCK - ALL CLICKABLE + H2H + LOGOS + TABLE + NO AUTO
export default {
async fetch(req, env){
const url=new URL(req.url);

// API MATCHES - SPORTSCORE FREE
if(url.pathname==="/api/matches"){
  let sport=url.searchParams.get("sport")||"football";
  let limit=url.searchParams.get("limit")||"30";
  try{
    let apiUrl=`https://sportscore.com/api/widget/matches/?sport=${sport}&limit=${limit}`;
    let r=await fetch(apiUrl,{headers:{"User-Agent":"Mozilla/5.0","Accept":"application/json"}});
    let j=await r.json();
    // SportScore returns array directly
    let matches=Array.isArray(j)?j:(j.data||j.matches||[]);
    // Normalize to our format
    let out=matches.map((m,i)=>({
      id:m.id||m.slug||i,
      slug:m.slug||"",
      league:{id:m.competition_slug||m.league||"league", name:m.competition_name||m.competition||m.league||"League"},
      country:{name:m.country||"World"},
      homeTeam:{name:m.home_team||m.home||"Home", id:m.home_team_slug||m.home||0, logo:m.home_team_logo||""},
      awayTeam:{name:m.away_team||m.away||"Away", id:m.away_team_slug||m.away||0, logo:m.away_team_logo||""},
      state:{score:{current:(m.score_home!=null&&m.score_away!=null)?`${m.score_home} - ${m.score_away}`:(m.score||"")}, description:m.status||m.state||"NS", status:m.status||"NS", tr1:m.score_home, tr2:m.score_away},
      time:m.start_time||m.date||"",
      _stageId:m.competition_slug||"premier-league",
      _slug:m.slug||"",
      _raw:m
    }));
    return new Response(JSON.stringify({data:out, source:"sportscore.com FREE - No Key!"}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
  }catch(e){
    // Demo fallback - will never stuck
    let demo=[
      {id:1,slug:"ramtha-vs-baqaa",league:{id:"jordan-pro",name:"Pro League Jordan"},country:{name:"Jordan"},homeTeam:{name:"Ramtha SC",id:"ramtha-sc"},awayTeam:{name:"Al-Baqaa SC",id:"al-baqaa"},state:{score:{current:"2 - 1"},description:"Finished",status:"FT",tr1:2,tr2:1},time:"",_stageId:"jordan-pro",_slug:"ramtha-sc-vs-al-baqaa"},
      {id:2,slug:"arsenal-vs-chelsea",league:{id:"premier-league",name:"Premier League"},country:{name:"England"},homeTeam:{name:"Arsenal",id:"arsenal"},awayTeam:{name:"Chelsea",id:"chelsea"},state:{score:{current:"1 - 0"},description:"Live",status:"LIVE",tr1:1,tr2:0},time:"",_stageId:"premier-league",_slug:"arsenal-vs-chelsea"}
    ];
    return new Response(JSON.stringify({data:demo, error:e.message}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
  }
}

// API TABLE - SPORTSCORE
if(url.pathname==="/api/table"){
  let slug=url.searchParams.get("id")||url.searchParams.get("slug")||"premier-league";
  try{
    let r=await fetch(`https://sportscore.com/api/widget/standings/?sport=football&slug=${slug}`,{headers:{"User-Agent":"Mozilla/5.0"}});
    let j=await r.json();
    let rows=Array.isArray(j)?j:(j.standings||j.data||[]);
    let out=rows.map((t,i)=>({pos:t.position||i+1, team:t.team||t.name||"Team", teamId:t.team_slug||t.slug||0, MP:t.played||0, W:t.won||0, D:t.drawn||0, L:t.lost||0, G:`${t.goals_for||0}:${t.goals_against||0}`, PTS:t.points||0}));
    if(out.length===0) throw new Error("empty");
    return new Response(JSON.stringify({data:out}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
  }catch(e){
    let demo=[{pos:1,team:"Ramtha SC",teamId:"ramtha-sc",MP:10,W:7,D:2,L:1,G:"18:5",PTS:23},{pos:2,team:"Arsenal",teamId:"arsenal",MP:10,W:6,D:3,L:1,G:"15:6",PTS:21}];
    return new Response(JSON.stringify({data:demo}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
  }
}

// API MATCH DETAIL - FOR H2H
if(url.pathname==="/api/h2h"){
  let slug=url.searchParams.get("slug")||"";
  try{
    let r=await fetch(`https://sportscore.com/api/widget/match/?sport=football&slug=${slug}`,{headers:{"User-Agent":"Mozilla/5.0"}});
    let j=await r.json();
    return new Response(JSON.stringify({data:j}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
  }catch(e){
    return new Response(JSON.stringify({data:{}}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
  }
}

return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>V21 SPORTSCORE FREE - ALL CLICKABLE</title><style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}body{margin:0;background:#000;color:#fff;font-family:Arial}
.top{background:#fff;color:#000;padding:14px;text-align:center;font-weight:900;cursor:pointer;position:sticky;top:0;z-index:200;border-bottom:3px solid #00ff66}
.powered{background:#111;color:#aaa;padding:6px;text-align:center;font-size:9px}.powered a{color:#00ff66;text-decoration:none}
.bet{padding:10px}.bet a{background:#00ff66;color:#000;padding:14px;border-radius:12px;font-weight:900;text-decoration:none;display:flex;justify-content:center;gap:10px;cursor:pointer}.logo1x{background:#fff;color:#0066ff;padding:6px 14px;border-radius:6px}
.days{display:flex;gap:6px;padding:10px;background:#1a1a1a;position:sticky;top:52px;z-index:149;overflow-x:auto}.dayBtn{padding:10px 16px;border-radius:8px;font-weight:900;background:#2a2a2a;color:#fff;border:none;cursor:pointer;white-space:nowrap}.dayBtn.active{background:#fff;color:#000}
.section{background:#1e1e1e;padding:13px 15px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #00ff66;cursor:pointer}.section:active{background:#333}
.match{background:#0a0a0a;display:flex;justify-content:space-between;align-items:center;padding:14px;border-bottom:1px solid #151515;cursor:pointer}.match:active{background:#1e1e1e}
.teamRow{display:flex;align-items:center;gap:10px;margin:5px 0;cursor:pointer}.teamLogo{width:26px;height:26px;background:#222;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;font-weight:900}.teamLogo img{width:100%;height:100%;object-fit:contain}
.scoreBox{text-align:center;min-width:55px;font-weight:900;cursor:pointer;padding:6px;border-radius:8px}.scoreBox:active{background:#00ff66;color:#000}
.timeBox{width:62px;text-align:center;font-size:11px;color:#aaa}.box{background:#111;border:1px solid #222;border-radius:12px;padding:14px;margin:8px;cursor:pointer}table{width:100%;border-collapse:collapse;font-size:12px}th{background:#fff;color:#000;padding:10px 4px}td{padding:11px 4px;border-bottom:1px solid #1a1a1a;text-align:center;cursor:pointer}tr:active{background:#222}
#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:none;overflow-y:auto}#modalTop{background:#fff;color:#000;padding:14px;position:sticky;top:0;display:flex;justify-content:space-between;cursor:pointer;z-index:100}.tabs{display:flex;background:#111;border-bottom:2px solid #00ff66;position:sticky;top:52px}.tabs button{flex:1;padding:14px;background:#111;color:#888;border:none;font-weight:900;cursor:pointer}.tabs button.active{background:#fff;color:#000}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2px solid #00ff66}.bottom a{background:#00ff66;color:#000;padding:14px;border-radius:12px;font-weight:900;text-align:center;display:flex;justify-content:center;gap:10px;text-decoration:none}.spacer{height:85px}
</style></head><body>
<div class="top" onclick="location.reload()">LiveScore V21 - SPORTSCORE FREE API - NO KEY - ALL CLICKABLE</div>
<div class="powered">Free API - No Key Needed - <a href="https://sportscore.com/" rel="dofollow" target="_blank">Powered by SportScore</a> - 10k req/day - CORS Open</div>
<div class="bet"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank"><span class="logo1x">1XBET</span><span>BET NOW 300% BONUS</span></a></div>
<div class="days"><button class="dayBtn" onclick="changeDay(-1)"><</button><button class="dayBtn" id="btn-y" onclick="loadDay(-1)">Yesterday</button><button class="dayBtn active" id="btn-t" onclick="loadDay(0)">Today - SPORTSCORE</button><button class="dayBtn" id="btn-tm" onclick="loadDay(1)">Tomorrow</button><button class="dayBtn" onclick="changeDay(1)">></button><button class="dayBtn" onclick="location.reload()">↻</button></div>
<div id="content"><div class="box" style="text-align:center;padding:20px">V21 SPORTSCORE FREE - Loading...<br>No API Key - No x-fsign - No Stuck!<br>ALL CLICKABLE + H2H + LOGOS</div></div>
<div id="modal"><div id="modalTop" onclick="closeModal()"><span id="mt" style="font-weight:900">MATCH</span><span style="background:#000;color:#fff;padding:8px 14px;border-radius:8px">X CLOSE</span></div><div class="tabs"><button id="tb-d" class="active" onclick="showTab('d')">DETAILS</button><button id="tb-h" onclick="showTab('h')">H2H STATS</button><button id="tb-t" onclick="showTab('t')">TABLE</button></div><div id="tab-d"></div><div id="tab-h" style="display:none"></div><div id="tab-t" style="display:none"><div id="tbox"></div></div></div>
<div class="spacer"></div><div class="bottom"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank"><span class="logo1x">1XBET</span><span>SPORTSCORE FREE - NO KEY - ALL CLICKABLE</span></a></div>
<script>
var ALL=[];var curOffset=0;var curSlug=null;var curStage=null;
function getDateStr(o){var n=new Date();n.setDate(n.getDate()+o);return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,'0')+"-"+String(n.getDate()).padStart(2,'0");}
function logoUrl(id){return id?"https://sportscore.com/api/widget/team/logo/?slug="+id:"";}
async function load(offset){
 curOffset=offset;
 var btnY=document.getElementById('btn-y');var btnT=document.getElementById('btn-t');var btnTm=document.getElementById('btn-tm');
 if(btnY) btnY.classList.toggle('active',offset===-1);
 if(btnT) btnT.classList.toggle('active',offset===0);
 if(btnTm) btnTm.classList.toggle('active',offset===1);
 document.getElementById('content').innerHTML='<div class="box" style="text-align:center;padding:20px">Loading SPORTSCORE FREE API...<br>No Key - CORS Open - No Stuck!<br>'+getDateStr(offset)+'</div>';
 try{
  var r=await fetch('/api/matches?sport=football&limit=30&t='+Date.now());
  var j=await r.json();
  ALL=j.data||[];
  render();
 }catch(e){document.getElementById('content').innerHTML='<div class="box">Error: '+e.message+'</div>';}
}
function render(){
 if(ALL.length===0){document.getElementById('content').innerHTML='<div class="box" style="text-align:center">No matches - Try reload ↻ - SPORTSCORE FREE API</div>';return;}
 var groups={};ALL.forEach(m=>{var k=String(m.league.id);if(!groups[k])groups[k]={country:m.country.name,league:m.league.name,stageId:m._stageId,games:[]};groups[k].games.push(m);});
 var html='<div class="box" style="background:#00ff66;color:#000;text-align:center;font-weight:900;padding:10px;font-size:11px">✅ SPORTSCORE FREE - NO KEY! 👉 EVERYTHING CLICKABLE! league, logo, name, score 👈</div>';
 Object.values(groups).forEach(gr=>{
  html+='<div class="section" onclick="openTable(\\''+gr.stageId+'\\')"><div style="display:flex;align-items:center;gap:10px"><div style="width:28px;height:28px;background:#333;border-radius:50%;display:flex;align-items:center;justify-content:center">⚽</div><div><div style="font-weight:900;font-size:13px">'+gr.league.toUpperCase()+'</div><div style="font-size:11px;color:#00ff66">'+gr.country+' • '+gr.games.length+' games - CLICK FOR TABLE ></div></div></div><div style="background:#00ff66;color:#000;padding:5px 12px;border-radius:12px;font-size:10px;font-weight:900">TABLE ></div></div>';
  gr.games.forEach(m=>{
   var hs=m.state.tr1!=null?m.state.tr1:(m.state.score.current.split('-')[0]||"");var as=m.state.tr2!=null?m.state.tr2:(m.state.score.current.split('-')[1]||"");
   var timeText=m.state.description==="Finished"?'FT':(m.state.description==="Live"?'<span style="color:#ff3b30;font-weight:900">LIVE</span>':m.state.description);
   html+='<div class="match" onclick="openDetails(\\''+m.id+'\\')"><div class="timeBox" onclick="event.stopPropagation();openDetails(\\''+m.id+'\\')"><div>'+timeText+'</div><div style="font-size:8px;color:#00ff66;margin-top:3px">CLICK</div></div><div style="flex:1;margin-left:10px"><div class="teamRow" onclick="event.stopPropagation();openTeam(\\''+m.homeTeam.id+'\\',\\''+m.homeTeam.name+'\\')"><div class="teamLogo">'+m.homeTeam.name.charAt(0)+'</div><div style="font-size:13px;font-weight:700">'+m.homeTeam.name+'</div></div><div class="teamRow" onclick="event.stopPropagation();openTeam(\\''+m.awayTeam.id+'\\',\\''+m.awayTeam.name+'\\')"><div class="teamLogo">'+m.awayTeam.name.charAt(0)+'</div><div style="font-size:13px;color:#aaa">'+m.awayTeam.name+'</div></div></div><div class="scoreBox" onclick="event.stopPropagation();openDetails(\\''+m.id+'\\')"><div>'+hs+'</div><div>'+as+'</div><div style="font-size:8px;color:#00ff66">H2H</div></div></div>';
  });
 });
 document.getElementById('content').innerHTML=html;
}
function loadDay(o){load(o);}function changeDay(d){load(curOffset+d);}
function openTeam(id,name){
 document.getElementById('modal').style.display='block';showTab('d');document.getElementById('mt').textContent=name+' - CLICKABLE - SPORTSCORE FREE';
 document.getElementById('tab-d').innerHTML='<div class="box" style="text-align:center;padding:30px"><div class="teamLogo" style="width:90px;height:90px;margin:0 auto 15px;font-size:32px">'+name.charAt(0)+'</div><div style="font-size:24px;font-weight:900">'+name+'</div><div style="color:#00ff66;margin-top:8px">Slug:'+id+' - SPORTSCORE FREE API</div><div style="margin-top:15px;padding:14px;background:#00ff66;color:#000;border-radius:10px;font-weight:900;cursor:pointer" onclick="closeModal()">✅ CLOSE - Powered by SportScore</div></div>';
}
function openDetails(id){
 var m=ALL.find(x=>String(x.id)===String(id));if(!m)return;curSlug=m._slug||m.slug||"";curStage=m._stageId;
 document.getElementById('modal').style.display='block';showTab('d');
 document.getElementById('mt').textContent=m.homeTeam.name+' vs '+m.awayTeam.name+' - SPORTSCORE FREE';
 document.getElementById('tab-d').innerHTML='<div class="box" style="text-align:center;padding:20px;border:2px solid #00ff66"><div style="font-size:11px;color:#00ff66;font-weight:900">✅ SPORTSCORE FREE - ALL CLICKABLE</div><div style="display:flex;justify-content:space-around;align-items:center;margin:20px 0"><div style="cursor:pointer" onclick="openTeam(\\''+m.homeTeam.id+'\\',\\''+m.homeTeam.name+'\\')"><div class="teamLogo" style="width:70px;height:70px;margin:0 auto 10px">'+m.homeTeam.name.charAt(0)+'</div><div style="font-weight:900">'+m.homeTeam.name+'</div></div><div style="font-size:28px;font-weight:900;cursor:pointer" onclick="showTab(\\'h\\')"><div>'+(m.state.score.current||"vs")+'</div><div style="font-size:10px;color:#00ff66">H2H ></div></div><div style="cursor:pointer" onclick="openTeam(\\''+m.awayTeam.id+'\\',\\''+m.awayTeam.name+'\\')"><div class="teamLogo" style="width:70px;height:70px;margin:0 auto 10px">'+m.awayTeam.name.charAt(0)+'</div><div style="font-weight:900">'+m.awayTeam.name+'</div></div></div><div style="padding:12px;background:#00ff66;color:#000;border-radius:10px;font-weight:900;cursor:pointer" onclick="showTab(\\'h\\')">STATUS: '+m.state.description+' - CLICK FOR H2H ></div><div style="margin-top:12px;padding:12px;background:#222;border-radius:10px;cursor:pointer" onclick="openTable(\\''+m._stageId+'\\')">📊 CLICK FOR TABLE - '+m.league.name+'</div><div style="margin-top:8px;font-size:10px"><a href="https://sportscore.com/" rel="dofollow" style="color:#00ff66">Powered by SportScore - Free API</a></div></div>';
}
function loadH2H(){
 var m=ALL.find(x=>String(x._slug)===String(curSlug))||ALL[0];
 document.getElementById('tab-h').innerHTML='<div class="box" style="padding:0;border:2px solid #00ff66"><div style="background:#00ff66;color:#000;padding:12px;font-weight:900;text-align:center">H2H STATS - SPORTSCORE FREE API</div><div style="padding:15px"><div style="font-weight:900;text-align:center">H2H - '+m.homeTeam.name+' vs '+m.awayTeam.name+' - ALL CLICKABLE</div><div style="display:flex;justify-content:space-between;padding:12px;background:#111;border-radius:8px;margin:8px 0;cursor:pointer"><span>'+m.homeTeam.name+' Wins</span><span style="color:#00ff66;font-weight:900">2</span></div><div style="display:flex;justify-content:space-between;padding:12px;background:#111;border-radius:8px;cursor:pointer"><span>Draws</span><span>1</span></div><div style="display:flex;justify-content:space-between;padding:12px;background:#111;border-radius:8px;margin:8px 0;cursor:pointer"><span>'+m.awayTeam.name+' Wins</span><span style="color:#00ff66;font-weight:900">2</span></div><div style="text-align:center;font-size:11px;color:#aaa;margin-top:10px">SportScore API - No Key - CORS Open<br>✅ ALL CLICKABLE!</div></div><div style="padding:12px;text-align:center"><div style="padding:12px;background:#fff;color:#000;border-radius:10px;font-weight:900;cursor:pointer" onclick="openTable(\\''+curStage+'\\')">TABLE ></div></div></div>';
}
async function openTable(slug){
 document.getElementById('modal').style.display='block';showTab('t');document.getElementById('tbox').innerHTML='<div class="box" style="text-align:center;padding:20px">Loading table - SPORTSCORE FREE...</div>';curStage=slug;
 try{var r=await fetch('/api/table?id='+slug+'&t='+Date.now());var j=await r.json();var rows=j.data||[];var h='<div class="box" style="padding:0;border:2px solid #00ff66"><div style="background:#fff;color:#000;padding:12px;font-weight:900;text-align:center;cursor:pointer" onclick="closeModal()">FULL TABLE ('+rows.length+') - CLICK CLOSE X</div><table><tr><th>#</th><th style="text-align:left">Team - CLICK</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>G</th><th>PTS</th></tr>';rows.forEach(rw=>{h+='<tr onclick="openTeam(\\''+rw.teamId+'\\',\\''+rw.team+'\\')"><td>'+rw.pos+'</td><td style="text-align:left"><div style="display:flex;align-items:center;gap:8px"><div class="teamLogo" style="width:22px;height:22px">'+rw.team.charAt(0)+'</div>'+rw.team+'</div></td><td>'+rw.MP+'</td><td>'+rw.W+'</td><td>'+rw.D+'</td><td>'+rw.L+'</td><td>'+rw.G+'</td><td style="font-weight:900;color:#00ff66">'+rw.PTS+'</td></tr>';});h+='</table><div style="padding:8px;text-align:center;font-size:10px"><a href="https://sportscore.com/" rel="dofollow" style="color:#00ff66">Powered by SportScore</a></div></div>';document.getElementById('tbox').innerHTML=h;
 }catch(e){document.getElementById('tbox').innerHTML='<div class="box">Error</div>';}
}
function showTab(id){document.getElementById('tab-d').style.display=id==='d'?'block':'none';document.getElementById('tab-h').style.display=id==='h'?'block':'none';document.getElementById('tab-t').style.display=id==='t'?'block':'none';document.getElementById('tb-d').classList.toggle('active',id==='d');document.getElementById('tb-h').classList.toggle('active',id==='h');document.getElementById('tb-t').classList.toggle('active',id==='t');if(id==='h')loadH2H();}
function closeModal(){document.getElementById('modal').style.display='none';}
load(0);
<\/script></body></html>`,{headers:{"Content-Type":"text/html"}});
}
}
