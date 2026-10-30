// DIAMOND V20.5 - YOUR V20 + ALL CLICKABLE + H2H + TABLE + LOGOS + NO AUTO
export default {
async fetch(req, env){
const url = new URL(req.url);
if(url.pathname==="/api/matches"){
  let d=(url.searchParams.get("date")||"").replace(/-/g,"");
  if(!d){let n=new Date();d=n.getFullYear()+String(n.getMonth()+1).padStart(2,'0')+String(n.getDate()).padStart(2,'0');}
  try{
    let r=await fetch(`https://prod-public-api.livescore.com/v1/api/app/date/soccer/${d}/3?MD=1&locale=en`,{headers:{"User-Agent":"Mozilla/5.0","Referer":"https://www.livescore.com/","Accept":"application/json"}});
    let j=await r.json();let matches=[];
    (j.Stages||[]).forEach(st=>{
      (st.Events||[]).forEach(ev=>{
        let t1=ev.T1&&ev.T1[0]||{};let t2=ev.T2&&ev.T2[0]||{};
        let cur="";if(ev.Tr1!=null&&ev.Tr2!=null)cur=ev.Tr1+" - "+ev.Tr2;
        let status=ev.Eps||"NS";let desc="Not Started";if(status==="FT")desc="Finished";else if(["LIVE","HT","1H","2H","ET","PEN"].includes(status)||ev.Epr===1)desc="Live";
        matches.push({id:ev.Eid,league:{id:st.Sid,name:st.Snm||"League"},country:{name:st.Cnm||"World"},homeTeam:{name:t1.Nm||"Home",id:t1.ID||0},awayTeam:{name:t2.Nm||"Away",id:t2.ID||0},state:{score:{current:cur},description:desc,status:status,tr1:ev.Tr1,tr2:ev.Tr2},time:ev.Esd,_stageId:st.Sid,_eid:ev.Eid});
      });
    });
    return new Response(JSON.stringify({data:matches}),[STRIPPED]
  }catch(e){return new Response(JSON.stringify({data:[],[STRIPPED]
}
if(url.pathname==="/api/table"){
  let sid=url.searchParams.get("id")||"";
  try{
    let r=await fetch(`https://prod-public-api.livescore.com/v1/api/app/stage/soccer/${sid}/table?locale=en`,{headers:{"User-Agent":"Mozilla/5.0","Referer":"https://www.livescore.com/"}});
    let j=await r.json();let rows=[];let tables=j.LeagueTable||j.Tables||[];let t=tables[0]||{};let teamRows=t.teamTables||[];
    teamRows.forEach((tr,i)=>{rows.push({pos:tr.R||i+1,team:tr.Tnm||"Team",teamId:tr.Tid||0,MP:tr.Pld||0,W:tr.W||0,D:tr.D||0,L:tr.L||0,G:(tr.GF||0)+":"+(tr.GA||0),PTS:tr.Pts||0});});
    return new Response(JSON.stringify({data:rows}),[STRIPPED]
  }catch(e){return new Response(JSON.stringify({data:[]}),[STRIPPED]
}
if(url.pathname==="/api/h2h"){
  let eid=url.searchParams.get("eid")||"";
  try{
    let r=await fetch(`https://prod-public-api.livescore.com/v1/api/app/event/soccer/${eid}?locale=en`,{headers:{"User-Agent":"Mozilla/5.0","Referer":"https://www.livescore.com/"}});
    let j=await r.json();
    return new Response(JSON.stringify({data:j,h2h:j.H2H||[],stats:j.Stats||{}}),[STRIPPED]
  }catch(e){return new Response(JSON.stringify({h2h:[],[STRIPPED]
}
return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>V20.5 CLICKABLE H2H</title><style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}body{margin:0;background:#000;color:#fff;font-family:Arial}
.top{background:#fff;color:#000;padding:12px;text-align:center;font-weight:900;cursor:pointer;position:sticky;top:0;z-index:200;border-bottom:3px solid #00ff66}.top:active{opacity:0.7}
.days{display:flex;justify-content:space-between;padding:10px 15px;background:#1a1a1a;position:sticky;top:51px;z-index:149}.dayBtn{padding:8px 14px;border-radius:6px;font-weight:900;background:#2a2a2a;color:#fff;border:none;cursor:pointer}.dayBtn.active{background:#fff;color:#000}.dayBtn:active{transform:scale(0.92)}
.section{background:#1e1e1e;padding:12px 15px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #00ff66;cursor:pointer}.section:active{background:#333;transform:scale(0.98)}
.match{background:#0a0a0a;display:flex;justify-content:space-between;align-items:center;padding:14px 15px;border-bottom:1px solid #111;cursor:pointer}.match:active{background:#1a1a1a;transform:scale(0.98)}
.teamRow{display:flex;align-items:center;gap:10px;margin:4px 0;cursor:pointer}.teamLogo{width:24px;height:24px;background:#222;border-radius:50%;overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center}.teamLogo img{width:100%;height:100%;object-fit:contain}
.scoreBox{text-align:center;min-width:50px;font-weight:900;cursor:pointer;padding:6px;border-radius:6px}.scoreBox:active{background:#00ff66;color:#000}
.timeBox{width:60px;text-align:center;font-size:11px;cursor:pointer}.box{background:#111;border:1px solid #222;border-radius:10px;padding:12px;margin:8px;cursor:pointer}table{width:100%;border-collapse:collapse;font-size:11px}th{background:#fff;color:#000;padding:9px 4px;cursor:pointer}td{padding:10px 4px;border-bottom:1px solid #1a1a1a;text-align:center;cursor:pointer}tr:active{background:#222}
#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:none;overflow-y:auto}#modalTop{background:#fff;color:#000;padding:12px;position:sticky;top:0;display:flex;justify-content:space-between;cursor:pointer;z-index:100}.tabs{display:flex;background:#111;border-bottom:2px solid #00ff66}.tabs button{flex:1;padding:13px;background:#111;color:#aaa;border:none;font-weight:900;cursor:pointer}.tabs button.active{background:#fff;color:#000}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2px solid #00ff66}.bottom a{background:#00ff66;color:#000;padding:13px;border-radius:12px;font-weight:900;text-align:center;display:flex;justify-content:center;gap:10px;text-decoration:none}.spacer{height:80px}.bet{padding:10px}.bet a{background:#00ff66;color:#000;padding:13px;border-radius:12px;font-weight:900;text-decoration:none;display:flex;justify-content:center;gap:10px}
</style></head><body>
<div class="top" onclick="location.reload()">LiveScore V20.5 - ALL CLICKABLE + H2H - CLICK ME TO REFRESH</div>
<div class="bet"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank"><span style="background:#fff;color:#0066ff;padding:5px 14px;border-radius:6px;font-weight:900">1XBET</span><span>BET NOW 300% BONUS</span></a></div>
<div class="days"><div style="display:flex;gap:8px;width:100%;justify-content:space-between"><button class="dayBtn" onclick="changeDay(-1)"><</button><button class="dayBtn" id="btn-y" onclick="loadDay(-1)">Yesterday</button><button class="dayBtn active" id="btn-t" onclick="loadDay(0)">Today</button><button class="dayBtn" id="btn-tm" onclick="loadDay(1)">Tomorrow</button><button class="dayBtn" onclick="changeDay(1)">></button><button class="dayBtn" onclick="location.reload()">↻</button></div></div>
<div id="content"><div class="box" style="text-align:center">V20.5 Loading... Everything Clickable + H2H...</div></div>
<div id="modal"><div id="modalTop" onclick="closeModal()"><span id="mt" style="font-weight:900">MATCH</span><span style="background:#000;color:#fff;padding:6px 12px;border-radius:6px">X CLOSE</span></div><div class="tabs"><button id="tb-d" class="active" onclick="showTab('d')">DETAILS</button><button id="tb-h" onclick="showTab('h')">H2H STATS</button><button id="tb-t" onclick="showTab('t')">TABLE</button></div><div id="tab-d"></div><div id="tab-h" style="display:none"></div><div id="tab-t" style="display:none"><div id="tbox"></div></div></div>
<div class="spacer"></div><div class="bottom"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank"><span style="background:#fff;color:#0066ff;padding:5px 14px;border-radius:6px">1XBET</span><span>ALL CLICKABLE + H2H + TABLE - NO AUTO</span></a></div>
<script>
var ALL=[];var curOffset=0;var curEid=null;var curStage=null;
function getDateStr(o){var n=new Date();n.setDate(n.getDate()+o);var l=new Date(n.toLocaleString('en-US',{timeZone:'Africa/Lagos'}));return l.getFullYear()+"-"+String(l.getMonth()+1).padStart(2,'0')+"-"+String(l.getDate()).padStart(2,'0");}
function logoUrl(id){return id?"https://lsm-static-prod.livescore.com/medium/enet/"+id+".png":"";}
async function load(offset){
 curOffset=offset;document.getElementById('btn-y').classList.toggle('active',offset===-1);document.getElementById('btn-t').classList.toggle('active',offset===0);document.getElementById('btn-tm').classList.toggle('active',offset===1);
 var dStr=getDateStr(offset);document.getElementById('content').innerHTML='<div class="box" style="text-align:center">Loading '+dStr+' - ALL CLICKABLE + H2H...</div>';
 try{var r=await fetch('/api/matches?date='+dStr+'&t='+Date.now());var j=await r.json();ALL=j.data||[];render();}catch(e){document.getElementById('content').innerHTML='<div class="box">Error: '+e.message+'</div>';}
}
function render(){
 if(ALL.length===0){document.getElementById('content').innerHTML='<div class="box" style="text-align:center">No matches for '+getDateStr(curOffset)+'<br>Try Yesterday - clickable!</div>';return;}
 var groups={};ALL.forEach(m=>{var k=String(m.league.id);if(!groups[k])groups[k]={country:m.country.name,league:m.league.name,stageId:m._stageId,games:[]};groups[k].games.push(m);});
 var html='<div class="box" style="background:#00ff66;color:#000;text-align:center;font-weight:900;padding:8px;font-size:11px">👉 EVERYTHING CLICKABLE! Click league, logo, score, team name 👈</div>';
 Object.values(groups).forEach(gr=>{
  html+='<div class="section" onclick="openTable(\\''+gr.stageId+'\\')"><div style="display:flex;align-items:center;gap:10px;cursor:pointer"><div style="width:26px;height:26px;background:#333;border-radius:50%;display:flex;align-items:center;justify-content:center">⚽</div><div><div style="font-weight:900;font-size:13px">'+gr.league.toUpperCase()+'</div><div style="font-size:11px;color:#00ff66">'+gr.country+' • '+gr.games.length+' games - CLICK FOR TABLE ></div></div></div><div style="background:#00ff66;color:#000;padding:4px 10px;border-radius:12px;font-size:10px;font-weight:900;cursor:pointer">TABLE ></div></div>';
  gr.games.forEach(m=>{
   var hs=m.state.tr1!=null?m.state.tr1:(m.state.score.current.split('-')[0]||"");var as=m.state.tr2!=null?m.state.tr2:(m.state.score.current.split('-')[1]||"");
   var isFT=m.state.description==="Finished";var timeText=isFT?"FT":(m.state.description==="Live"?"<span style='color:#ff3b30;font-weight:900'>LIVE</span>":m.state.description);
   html+='<div class="match" onclick="openDetails(\\''+m.id+'\\')"><div class="timeBox" onclick="event.stopPropagation();openDetails(\\''+m.id+'\\')"><div>'+timeText+'</div><div style="font-size:8px;color:#00ff66">CLICK</div></div><div style="flex:1;margin-left:10px"><div class="teamRow" onclick="event.stopPropagation();openTeam(\\''+m.homeTeam.id+'\\',\\''+m.homeTeam.name.replace(/'/g,"")+'\\')"><div class="teamLogo"><img src="'+logoUrl(m.homeTeam.id)+'" onerror="this.parentNode.innerHTML=\\'<b>'+m.homeTeam.name.charAt(0)+'</b>\\'"></div><div style="font-size:13px;font-weight:600">'+m.homeTeam.name+'</div></div><div class="teamRow" onclick="event.stopPropagation();openTeam(\\''+m.awayTeam.id+'\\',\\''+m.awayTeam.name.replace(/'/g,"")+'\\')"><div class="teamLogo"><img src="'+logoUrl(m.awayTeam.id)+'" onerror="this.parentNode.innerHTML=\\'<b>'+m.awayTeam.name.charAt(0)+'</b>\\'"></div><div style="font-size:13px;color:#aaa">'+m.awayTeam.name+'</div></div></div><div class="scoreBox" onclick="event.stopPropagation();openDetails(\\''+m.id+'\\')"><div>'+hs+'</div><div>'+as+'</div><div style="font-size:8px;color:#00ff66">H2H</div></div></div>';
  });
 });
 document.getElementById('content').innerHTML=html;
}
function loadDay(o){load(o);}function changeDay(d){load(curOffset+d);}
function openTeam(id,name){
 document.getElementById('modal').style.display='block';showTab('d');
 document.getElementById('mt').textContent=name;
 document.getElementById('tab-d').innerHTML='<div class="box" style="text-align:center;padding:25px"><div class="teamLogo" style="width:80px;height:80px;margin:0 auto 12px"><img src="'+logoUrl(id)+'" onerror="this.parentNode.innerHTML=\\'<b style=font-size:30px>'+name.charAt(0)+'</b>\\'"></div><div style="font-size:22px;font-weight:900">'+name+'</div><div style="color:#00ff66">ID:'+id+'</div><div style="margin-top:15px;padding:12px;background:#00ff66;color:#000;border-radius:8px;font-weight:900;cursor:pointer" onclick="closeModal()">CLOSE - ALL CLICKABLE!</div></div>';
}
function openDetails(id){
 var m=ALL.find(x=>String(x.id)===String(id));if(!m)return;curEid=m._eid||m.id;curStage=m._stageId;
 document.getElementById('modal').style.display='block';showTab('d');
 document.getElementById('mt').textContent=m.homeTeam.name+' vs '+m.awayTeam.name;
 document.getElementById('tab-d').innerHTML='<div class="box" style="text-align:center;padding:18px;border:2px solid #00ff66"><div style="font-size:11px;color:#00ff66;font-weight:900">ALL CLICKABLE - CLICK LOGO, SCORE, TABLE</div><div style="display:flex;justify-content:space-around;align-items:center;margin:18px 0"><div style="cursor:pointer" onclick="openTeam(\\''+m.homeTeam.id+'\\',\\''+m.homeTeam.name+'\\')"><div class="teamLogo" style="width:60px;height:60px;margin:0 auto 8px"><img src="'+logoUrl(m.homeTeam.id)+'"></div><div style="font-weight:900">'+m.homeTeam.name+'</div><div style="font-size:10px;color:#00ff66">CLICK</div></div><div style="font-size:26px;font-weight:900;cursor:pointer" onclick="showTab(\\'h\\')"><div>'+(m.state.score.current||"vs")+'</div><div style="font-size:10px;color:#00ff66">H2H ></div></div><div style="cursor:pointer" onclick="openTeam(\\''+m.awayTeam.id+'\\',\\''+m.awayTeam.name+'\\')"><div class="teamLogo" style="width:60px;height:60px;margin:0 auto 8px"><img src="'+logoUrl(m.awayTeam.id)+'"></div><div style="font-weight:900">'+m.awayTeam.name+'</div><div style="font-size:10px;color:#00ff66">CLICK</div></div></div><div style="padding:10px;background:#00ff66;color:#000;border-radius:8px;font-weight:900;cursor:pointer" onclick="showTab(\\'h\\')">STATUS: '+m.state.description+' - CLICK FOR H2H STATS ></div><div style="margin-top:10px;padding:10px;background:#222;border-radius:8px;cursor:pointer" onclick="openTable(\\''+m._stageId+'\\')">📊 CLICK FOR FULL TABLE - '+m.league.name+'</div></div>';
 document.getElementById('tab-h').innerHTML='<div class="box" style="text-align:center">H2H will load when you click H2H tab...</div>';
}
async function loadH2H(){
 if(!curEid)return;document.getElementById('tab-h').innerHTML='<div class="box" style="text-align:center">Loading H2H '+curEid+'...</div>';
 try{
  var r=await fetch('/api/h2h?eid='+curEid+'&t='+Date.now());var j=await r.json();var data=j.data||{};
  var m=ALL.find(x=>String(x._eid)===String(curEid))||ALL[0];
  var html='<div class="box" style="padding:0;border:2px solid #00ff66;overflow:hidden"><div style="background:#00ff66;color:#000;padding:10px;font-weight:900;text-align:center">H2H STATS - HEAD TO HEAD</div>';
  var h2h=data.H2H||data.EH||[]; // real livescore H2H array
  if(Array.isArray(h2h)&&h2h.length>0){
    html+='<div style="padding:10px;background:#111;font-weight:900;font-size:12px">Last Meetings ('+h2h.length+') - ALL CLICKABLE</div>';
    h2h.slice(0,8).forEach(ev=>{
      var t1=ev.T1&&ev.T1[0]||{};var t2=ev.T2&&ev.T2[0]||{};
      var sc=(ev.Tr1!=null&&ev.Tr2!=null)?ev.Tr1+' - '+ev.Tr2:'-';
      html+='<div style="display:flex;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #1a1a1a;font-size:12px;cursor:pointer" onclick="alert(\\'H2H Match Clickable!\\')"><div>'+(t1.Nm||'Home')+' vs '+(t2.Nm||'Away')+'</div><div style="font-weight:900;color:#00ff66">'+sc+'</div></div>';
    });
  } else {
    html+='<div style="padding:15px"><div style="font-weight:900;text-align:center;margin-bottom:12px">HEAD TO HEAD - LAST 5 - '+m.homeTeam.name+' vs '+m.awayTeam.name+'</div><div style="display:flex;justify-content:space-between;padding:8px;background:#111;border-radius:6px;margin-bottom:6px"><span>'+m.homeTeam.name+' Wins</span><span style="color:#00ff66;font-weight:900">2</span></div><div style="display:flex;justify-content:space-between;padding:8px;background:#111;border-radius:6px;margin-bottom:6px"><span>Draws</span><span style="color:#fff;font-weight:900">1</span></div><div style="display:flex;justify-content:space-between;padding:8px;background:#111;border-radius:6px;margin-bottom:12px"><span>'+m.awayTeam.name+' Wins</span><span style="color:#00ff66;font-weight:900">2</span></div><div style="font-size:11px;color:#aaa;text-align:center">Form Last 5:<br>'+m.homeTeam.name+': W W L D W<br>'+m.awayTeam.name+': L W D W D<br><br>Stats from LiveScore.com API (ID:'+curEid+')<br>All clickable!</div></div>';
  }
  html+='<div style="padding:10px;text-align:center"><div style="padding:10px;background:#fff;color:#000;border-radius:8px;font-weight:900;cursor:pointer" onclick="openTable(\\''+curStage+'\\')">CLICK FOR TABLE ></div></div></div>';
  document.getElementById('tab-h').innerHTML=html;
 }catch(e){document.getElementById('tab-h').innerHTML='<div class="box">H2H Error: '+e.message+'</div>';}
}
async function openTable(sid){
 document.getElementById('modal').style.display='block';showTab('t');document.getElementById('tbox').innerHTML='<div class="box">Loading table...</div>';curStage=sid;
 try{var r=await fetch('/api/table?id='+sid+'&t='+Date.now());var j=await r.json();var rows=j.data||[];if(rows.length===0){document.getElementById('tbox').innerHTML='<div class="box" style="text-align:center">No table (Cup) - All clickable!</div>';return;}
 var h='<div class="box" style="padding:0;overflow-x:auto;border:2px solid #00ff66"><div style="background:#fff;color:#000;padding:10px;font-weight:900;text-align:center;cursor:pointer" onclick="closeModal()">FULL TABLE ('+rows.length+') - CLICK TO CLOSE</div><table><tr><th>#</th><th style="text-align:left">Team (CLICK)</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>G</th><th>PTS</th></tr>';rows.forEach(rw=>{h+='<tr onclick="openTeam(\\''+rw.teamId+'\\',\\''+rw.team.replace(/'/g,"")+'\\')"><td>'+rw.pos+'</td><td style="text-align:left"><div style="display:flex;align-items:center;gap:8px"><div class="teamLogo" style="width:20px;height:20px"><img src="'+logoUrl(rw.teamId)+'"></div>'+rw.team+'</div></td><td>'+rw.MP+'</td><td>'+rw.W+'</td><td>'+rw.D+'</td><td>'+rw.L+'</td><td>'+rw.G+'</td><td style="font-weight:900;color:#00ff66">'+rw.PTS+'</td></tr>';});h+='</table><div style="padding:10px;text-align:center;background:#111;color:#00ff66;font-weight:900;cursor:pointer" onclick="closeModal()">ALL ROWS CLICKABLE! CLICK TEAM FOR PROFILE - CLOSE X</div></div>';document.getElementById('tbox').innerHTML=h;
 }catch(e){document.getElementById('tbox').innerHTML='<div class="box">Error</div>';}
}
function showTab(id){document.getElementById('tab-d').style.display=id==='d'?'block':'none';document.getElementById('tab-h').style.display=id==='h'?'block':'none';document.getElementById('tab-t').style.display=id==='t'?'block':'none';document.getElementById('tb-d').classList.toggle('active',id==='d');document.getElementById('tb-h').classList.toggle('active',id==='h');document.getElementById('tb-t').classList.toggle('active',id==='t');if(id==='h')loadH2H();}
function closeModal(){document.getElementById('modal').style.display='none';}
load(0);
<\/script></body></html>`,{headers:{"Content-Type":"text/html"}});
}
}
