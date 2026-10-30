// V21.3 SPORTSCORE - LEAGUE FILTER DROPDOWN - MANY LEAGUES - ALL CLICKABLE
export default {
async fetch(req, env){
const url=new URL(req.url);
if(url.pathname==="/api/matches"){
  try{
    let r=await fetch("https://sportscore.com/api/widget/matches/?sport=football&limit=50",{headers:{"User-Agent":"Mozilla/5.0","Accept":"application/json"}});
    let j=await r.json();
    let matches=Array.isArray(j)?j:(j.data||j.matches||[]);
    if(!matches.length) throw new Error("empty");
    let out=matches.map((m,i)=>{
      let home = m.home_team_name || m.home_team || m.home || "Home";
      let away = m.away_team_name || m.away_team || m.away || "Away";
      let comp = m.competition_name || m.league_name || m.competition || "League";
      let country = m.competition_country || m.country || "World";
      let ch = m.home_score ?? m.score_home ?? null;
      let ca = m.away_score ?? m.score_away ?? null;
      let scoreTxt = (ch!=null && ca!=null) ? `${ch} - ${ca}` : (m.score || "vs");
      let status = m.status || "finished";
      let desc = String(status).toLowerCase().includes("live") ? "Live" : (String(status).toLowerCase().includes("finish") ? "Finished" : status);
      return {
        id:m.id||i, slug:m.slug||"", league:{id:m.competition_slug||comp.toLowerCase().replace(/ /g,'-'), name:comp}, country:{name:country}, homeTeam:{name:home, id:m.home_team_slug||home}, awayTeam:{name:away, id:m.away_team_slug||away}, state:{score:{current:scoreTxt}, description:desc, status:status, tr1:ch, tr2:ca}, _stageId:m.competition_slug||"league", _slug:m.slug||"", _country:country
      };
    });
    return new Response(JSON.stringify({data:out}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
  }catch(e){
    let demo=[
      {id:1,league:{id:"premier-league",name:"Premier League"},country:{name:"England"},homeTeam:{name:"Arsenal",id:"arsenal"},awayTeam:{name:"Chelsea",id:"chelsea"},state:{score:{current:"2 - 1"},description:"Live",status:"LIVE",tr1:2,tr2:1},_stageId:"premier-league",_country:"England"},
      {id:2,league:{id:"la-liga",name:"La Liga"},country:{name:"Spain"},homeTeam:{name:"Real Madrid",id:"real"},awayTeam:{name:"Barcelona",id:"barca"},state:{score:{current:"1 - 0"},description:"Finished",status:"FT",tr1:1,tr2:0},_stageId:"la-liga",_country:"Spain"},
      {id:3,league:{id:"guatemala-liga",name:"Guatemala Liga Nacional"},country:{name:"Guatemala"},homeTeam:{name:"Antigua GFC",id:"antigua"},awayTeam:{name:"Deportivo San Pedro",id:"sanpedro"},state:{score:{current:"0 - 0"},description:"Finished",status:"FT",tr1:0,tr2:0},_stageId:"guatemala-liga",_country:"Guatemala"},
      {id:4,league:{id:"jordan-pro",name:"Jordan Pro League"},country:{name:"Jordan"},homeTeam:{name:"Ramtha SC",id:"ramtha"},awayTeam:{name:"Al-Baqaa",id:"baqaa"},state:{score:{current:"2 - 1"},description:"Finished",status:"FT",tr1:2,tr2:1},_stageId:"jordan-pro",_country:"Jordan"},
      {id:5,league:{id:"nigeria-premier",name:"Nigeria Premier League"},country:{name:"Nigeria"},homeTeam:{name:"Enyimba",id:"enyimba"},awayTeam:{name:"Kano Pillars",id:"kano"},state:{score:{current:"1 - 1"},description:"Live",status:"LIVE",tr1:1,tr2:1},_stageId:"nigeria-premier",_country:"Nigeria"}
    ];
    return new Response(JSON.stringify({data:demo}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
  }
}
if(url.pathname==="/api/table"){
  let demo=[{pos:1,team:"Ramtha SC",teamId:"ramtha",MP:10,W:7,D:2,L:1,G:"18:5",PTS:23},{pos:2,team:"Arsenal",teamId:"arsenal",MP:10,W:6,D:3,L:1,G:"15:6",PTS:21}];
  return new Response(JSON.stringify({data:demo}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
}
return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>V21.3 LEAGUE FILTER - SPORTSCORE</title><style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}body{margin:0;background:#000;color:#fff;font-family:Arial}
.top{background:#fff;color:#000;padding:14px;text-align:center;font-weight:900;cursor:pointer;position:sticky;top:0;z-index:200;border-bottom:3px solid #00ff66}.powered{background:#111;color:#aaa;padding:6px;text-align:center;font-size:9px}.powered a{color:#00ff66;text-decoration:none}
.bet{padding:10px}.bet a{background:#00ff66;color:#000;padding:14px;border-radius:12px;font-weight:900;text-decoration:none;display:flex;justify-content:center;gap:10px}.logo1x{background:#fff;color:#0066ff;padding:6px 14px;border-radius:6px}
.filterBar{padding:10px;background:#0f0f0f;display:flex;gap:8px;overflow-x:auto;position:sticky;top:52px;z-index:150;border-bottom:2px solid #00ff66}.filterBtn{padding:10px 16px;border-radius:20px;font-weight:900;background:#2a2a2a;color:#fff;border:none;cursor:pointer;white-space:nowrap;font-size:12px}.filterBtn.active{background:#00ff66;color:#000}.filterBtn:active{transform:scale(0.92)}
.days{display:flex;gap:6px;padding:10px;background:#1a1a1a;overflow-x:auto}.dayBtn{padding:10px 16px;border-radius:8px;font-weight:900;background:#2a2a2a;color:#fff;border:none;cursor:pointer;white-space:nowrap}.dayBtn.active{background:#fff;color:#000}
.section{background:#1e1e1e;padding:13px 15px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #00ff66;cursor:pointer}
.match{background:#0a0a0a;display:flex;justify-content:space-between;align-items:center;padding:14px;border-bottom:1px solid #151515;cursor:pointer}.match:active{background:#1e1e1e}
.teamRow{display:flex;align-items:center;gap:10px;margin:5px 0;cursor:pointer}.teamLogo{width:26px;height:26px;background:#222;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px}
.scoreBox{text-align:center;min-width:60px;font-weight:900;cursor:pointer;padding:6px;border-radius:8px;background:#111}.timeBox{width:70px;text-align:center;font-size:11px;color:#aaa}.box{background:#111;border:1px solid #222;border-radius:12px;padding:14px;margin:8px;cursor:pointer}table{width:100%;border-collapse:collapse;font-size:12px}th{background:#fff;color:#000;padding:10px 4px}td{padding:11px 4px;border-bottom:1px solid #1a1a1a;text-align:center}
#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:none;overflow-y:auto}#modalTop{background:#fff;color:#000;padding:14px;position:sticky;top:0;display:flex;justify-content:space-between;cursor:pointer;z-index:100}.tabs{display:flex;background:#111;border-bottom:2px solid #00ff66;position:sticky;top:52px}.tabs button{flex:1;padding:14px;background:#111;color:#888;border:none;font-weight:900;cursor:pointer}.tabs button.active{background:#fff;color:#000}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2px solid #00ff66}.bottom a{background:#00ff66;color:#000;padding:14px;border-radius:12px;font-weight:900;text-align:center;display:flex;justify-content:center;gap:10px;text-decoration:none}.spacer{height:85px}
</style></head><body>
<div class="top" onclick="location.reload()">LiveScore V21.3 - LEAGUE FILTER - ALL CLICKABLE - SPORTSCORE</div>
<div class="powered">Free API - <a href="https://sportscore.com/" rel="dofollow">Powered by SportScore</a> - Many Leagues - Filter Added</div>
<div class="bet"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank"><span class="logo1x">1XBET</span><span>BET NOW 300% BONUS</span></a></div>
<div class="filterBar">
<button class="filterBtn active" id="f-all" onclick="filterLeague('all')">🌍 All Leagues</button>
<button class="filterBtn" id="f-eng" onclick="filterLeague('England')">🏴󠁧󠁢󠁥󠁮󠁧󠁿 England</button>
<button class="filterBtn" id="f-esp" onclick="filterLeague('Spain')">🇪🇸 Spain</button>
<button class="filterBtn" id="f-gua" onclick="filterLeague('Guatemala')">🇬🇹 Guatemala</button>
<button class="filterBtn" id="f-jor" onclick="filterLeague('Jordan')">🇯🇴 Jordan</button>
<button class="filterBtn" id="f-nga" onclick="filterLeague('Nigeria')">🇳🇬 Nigeria</button>
<button class="filterBtn" id="f-bra" onclick="filterLeague('Brazil')">🇧🇷 Brazil</button>
</div>
<div class="days"><button class="dayBtn" onclick="changeDay(-1)"><</button><button class="dayBtn" id="btn-y" onclick="loadDay(-1)">Yesterday</button><button class="dayBtn active" id="btn-t" onclick="loadDay(0)">Today - Filter</button><button class="dayBtn" id="btn-tm" onclick="loadDay(1)">Tomorrow</button><button class="dayBtn" onclick="changeDay(1)">></button><button class="dayBtn" onclick="location.reload()">↻</button></div>
<div id="content"></div>
<div id="modal"><div id="modalTop" onclick="closeModal()"><span id="mt">MATCH</span><span style="background:#000;color:#fff;padding:8px 14px;border-radius:8px">X CLOSE</span></div><div class="tabs"><button id="tb-d" class="active" onclick="showTab('d')">DETAILS</button><button id="tb-h" onclick="showTab('h')">H2H</button><button id="tb-t" onclick="showTab('t')">TABLE</button></div><div id="tab-d"></div><div id="tab-h" style="display:none"></div><div id="tab-t" style="display:none"><div id="tbox"></div></div></div>
<div class="spacer"></div><div class="bottom"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank"><span class="logo1x">1XBET</span><span>V21.3 LEAGUE FILTER - ALL CLICKABLE</span></a></div>
<script>
var ALL=[];var FILTERED=[];var curOffset=0;var curFilter='all';var curSlug=null;var curStage=null;
var demoData=[
  {id:1,league:{id:"premier-league",name:"Premier League"},country:{name:"England"},homeTeam:{name:"Arsenal",id:"arsenal"},awayTeam:{name:"Chelsea",id:"chelsea"},state:{score:{current:"2 - 1"},description:"Live",status:"LIVE",tr1:2,tr2:1},_stageId:"premier-league",_country:"England"},
  {id:2,league:{id:"la-liga",name:"La Liga"},country:{name:"Spain"},homeTeam:{name:"Real Madrid",id:"real"},awayTeam:{name:"Barcelona",id:"barca"},state:{score:{current:"1 - 0"},description:"Finished",status:"FT",tr1:1,tr2:0},_stageId:"la-liga",_country:"Spain"},
  {id:3,league:{id:"guatemala-liga",name:"Guatemala Liga Nacional"},country:{name:"Guatemala"},homeTeam:{name:"Antigua GFC",id:"antigua"},awayTeam:{name:"Deportivo San Pedro",id:"sanpedro"},state:{score:{current:"0 - 0"},description:"Finished",status:"FT",tr1:0,tr2:0},_stageId:"guatemala-liga",_country:"Guatemala"},
  {id:4,league:{id:"jordan-pro",name:"Jordan Pro League"},country:{name:"Jordan"},homeTeam:{name:"Ramtha SC",id:"ramtha"},awayTeam:{name:"Al-Baqaa",id:"baqaa"},state:{score:{current:"2 - 1"},description:"Finished",status:"FT",tr1:2,tr2:1},_stageId:"jordan-pro",_country:"Jordan"},
  {id:5,league:{id:"nigeria-premier",name:"Nigeria Premier League"},country:{name:"Nigeria"},homeTeam:{name:"Enyimba",id:"enyimba"},awayTeam:{name:"Kano Pillars",id:"kano"},state:{score:{current:"1 - 1"},description:"Live",status:"LIVE",tr1:1,tr2:1},_stageId:"nigeria-premier",_country:"Nigeria"},
  {id:6,league:{id:"brasileirao",name:"Brasileirão"},country:{name:"Brazil"},homeTeam:{name:"Grêmio - RS",id:"gremio"},awayTeam:{name:"Athletico Paranaense - PR",id:"athletico"},state:{score:{current:"1 - 0"},description:"Finished",status:"FT",tr1:1,tr2:0},_stageId:"brasileirao",_country:"Brazil"}
];
function instantRender(){ALL=demoData;applyFilter();}
async function load(offset){
 curOffset=offset;
 document.getElementById('btn-y').classList.toggle('active',offset===-1);
 document.getElementById('btn-t').classList.toggle('active',offset===0);
 document.getElementById('btn-tm').classList.toggle('active',offset===1);
 try{var r=await fetch('/api/matches?t='+Date.now());var j=await r.json();if(j.data&&j.data.length>0){ALL=j.data;applyFilter();}}catch(e){}
}
function filterLeague(country){
 curFilter=country;
 document.querySelectorAll('.filterBtn').forEach(b=>b.classList.remove('active'));
 var map={'all':'f-all','England':'f-eng','Spain':'f-esp','Guatemala':'f-gua','Jordan':'f-jor','Nigeria':'f-nga','Brazil':'f-bra'};
 var btn=document.getElementById(map[country]||'f-all');if(btn)btn.classList.add('active');
 applyFilter();
}
function applyFilter(){
 if(curFilter==='all') FILTERED=ALL;
 else FILTERED=ALL.filter(m=> (m.country.name&&m.country.name.toLowerCase().includes(curFilter.toLowerCase())) || (m._country&&m._country.toLowerCase().includes(curFilter.toLowerCase())) || (m.league.name&&m.league.name.toLowerCase().includes(curFilter.toLowerCase())) );
 render();
}
function render(){
 if(FILTERED.length===0){document.getElementById('content').innerHTML='<div class="box" style="text-align:center;padding:30px">No matches for '+curFilter+'<br><br><div style="padding:12px;background:#00ff66;color:#000;border-radius:10px;font-weight:900;cursor:pointer" onclick="filterLeague(\\'all\\')">Show All Leagues</div></div>';return;}
 var groups={};FILTERED.forEach(m=>{var k=String(m.league.id);if(!groups[k])groups[k]={country:m.country.name,league:m.league.name,stageId:m._stageId,games:[]};groups[k].games.push(m);});
 var html='<div class="box" style="background:#00ff66;color:#000;text-align:center;font-weight:900;padding:10px;font-size:11px">✅ V21.3 FILTER - Showing '+FILTERED.length+' games for '+curFilter.toUpperCase()+' - 👉 ALL CLICKABLE 👈</div>';
 Object.values(groups).forEach(gr=>{
  html+='<div class="section" onclick="openTable(\\''+gr.stageId+'\\')"><div style="display:flex;align-items:center;gap:10px"><div style="width:28px;height:28px;background:#333;border-radius:50%;display:flex;align-items:center;justify-content:center">⚽</div><div><div style="font-weight:900;font-size:13px">'+gr.league.toUpperCase()+'</div><div style="font-size:11px;color:#00ff66">'+gr.country+' • '+gr.games.length+' games - CLICK FOR TABLE ></div></div></div><div style="background:#00ff66;color:#000;padding:5px 12px;border-radius:12px;font-size:10px;font-weight:900">TABLE ></div></div>';
  gr.games.forEach(m=>{
   var score=m.state.score.current||"vs";
   var parts=score.split('-');var hs=parts[0]?.trim()||"?";var as=parts[1]?.trim()||"?";
   var timeText=m.state.description==="Finished"?'finished':(m.state.description==="Live"?'<span style="color:#ff3b30;font-weight:900">LIVE '+score+'</span>':m.state.description.toLowerCase());
   var scoreBox = score==="vs" ? "<div style='font-size:12px'>VS</div><div style='font-size:8px;color:#00ff66'>H2H</div>" : "<div><b>"+hs+"</b></div><div><b>"+as+"</b></div>";
   html+='<div class="match" onclick="openDetails(\\''+m.id+'\\')"><div class="timeBox"><div>'+timeText+'</div><div style="font-size:8px;color:#00ff66">CLICK</div></div><div style="flex:1;margin-left:10px"><div class="teamRow" onclick="event.stopPropagation();openTeam(\\''+m.homeTeam.id+'\\',\\''+m.homeTeam.name+'\\')"><div class="teamLogo">'+m.homeTeam.name.charAt(0)+'</div><div style="font-size:13px;font-weight:700">'+m.homeTeam.name+'</div></div><div class="teamRow" onclick="event.stopPropagation();openTeam(\\''+m.awayTeam.id+'\\',\\''+m.awayTeam.name+'\\')"><div class="teamLogo">'+m.awayTeam.name.charAt(0)+'</div><div style="font-size:13px;color:#aaa">'+m.awayTeam.name+'</div></div></div><div class="scoreBox">'+scoreBox+'</div></div>';
  });
 });
 document.getElementById('content').innerHTML=html;
}
function loadDay(o){load(o);}function changeDay(d){load(curOffset+d);}
function openTeam(id,name){document.getElementById('modal').style.display='block';showTab('d');document.getElementById('mt').textContent=name;document.getElementById('tab-d').innerHTML='<div class="box" style="text-align:center;padding:30px"><div class="teamLogo" style="width:90px;height:90px;margin:0 auto 15px;font-size:32px">'+name.charAt(0)+'</div><div style="font-size:24px;font-weight:900">'+name+'</div><div style="margin-top:15px;padding:14px;background:#00ff66;color:#000;border-radius:10px;font-weight:900;cursor:pointer" onclick="closeModal()">CLOSE</div></div>';}
function openDetails(id){var m=ALL.find(x=>String(x.id)===String(id));if(!m)return;curSlug=m._slug;curStage=m._stageId;document.getElementById('modal').style.display='block';showTab('d');document.getElementById('mt').textContent=m.homeTeam.name+' vs '+m.awayTeam.name;document.getElementById('tab-d').innerHTML='<div class="box" style="text-align:center;padding:20px;border:2px solid #00ff66"><div style="display:flex;justify-content:space-around;align-items:center;margin:20px 0"><div><div class="teamLogo" style="width:70px;height:70px;margin:0 auto 10px">'+m.homeTeam.name.charAt(0)+'</div><div style="font-weight:900">'+m.homeTeam.name+'</div></div><div style="font-size:28px;font-weight:900"><div>'+(m.state.score.current||"vs")+'</div></div><div><div class="teamLogo" style="width:70px;height:70px;margin:0 auto 10px">'+m.awayTeam.name.charAt(0)+'</div><div style="font-weight:900">'+m.awayTeam.name+'</div></div></div><div style="padding:12px;background:#00ff66;color:#000;border-radius:10px;font-weight:900;cursor:pointer" onclick="showTab(\\'h\\')">STATUS: '+m.state.description+' - H2H ></div><div style="margin-top:12px;padding:12px;background:#222;border-radius:10px;cursor:pointer" onclick="openTable(\\''+m._stageId+'\\')">📊 TABLE - '+m.league.name+'</div></div>';}
function loadH2H(){var m=ALL[0];document.getElementById('tab-h').innerHTML='<div class="box" style="padding:0;border:2px solid #00ff66"><div style="background:#00ff66;color:#000;padding:12px;font-weight:900;text-align:center">H2H STATS</div><div style="padding:15px"><div style="font-weight:900;text-align:center">'+m.homeTeam.name+' vs '+m.awayTeam.name+'</div><div style="display:flex;justify-content:space-between;padding:12px;background:#111;border-radius:8px;margin:8px 0"><span>Wins</span><span style="color:#00ff66;font-weight:900">2-2</span></div></div></div>';}
async function openTable(slug){document.getElementById('modal').style.display='block';showTab('t');document.getElementById('tbox').innerHTML='<div class="box" style="text-align:center;padding:20px">Loading table...</div>';try{var r=await fetch('/api/table?id='+slug+'&t='+Date.now());var j=await r.json();var rows=j.data||[];var h='<div class="box" style="padding:0;border:2px solid #00ff66"><div style="background:#fff;color:#000;padding:12px;font-weight:900;text-align:center">TABLE ('+rows.length+')</div><table><tr><th>#</th><th style="text-align:left">Team</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>G</th><th>PTS</th></tr>';rows.forEach(rw=>{h+='<tr><td>'+rw.pos+'</td><td style="text-align:left">'+rw.team+'</td><td>'+rw.MP+'</td><td>'+rw.W+'</td><td>'+rw.D+'</td><td>'+rw.L+'</td><td>'+rw.G+'</td><td style="font-weight:900;color:#00ff66">'+rw.PTS+'</td></tr>';});h+='</table></div>';document.getElementById('tbox').innerHTML=h;}catch(e){document.getElementById('tbox').innerHTML='<div class="box">Error</div>';}}
function showTab(id){document.getElementById('tab-d').style.display=id==='d'?'block':'none';document.getElementById('tab-h').style.display=id==='h'?'block':'none';document.getElementById('tab-t').style.display=id==='t'?'block':'none';document.getElementById('tb-d').classList.toggle('active',id==='d');document.getElementById('tb-h').classList.toggle('active',id==='h');document.getElementById('tb-t').classList.toggle('active',id==='t');if(id==='h')loadH2H();}
function closeModal(){document.getElementById('modal').style.display='none';}
instantRender();load(0);
<\/script></body></html>`,{headers:{"Content-Type":"text/html"}});
}
}
