// V20.3 - EVERYTHING CLICKABLE - MATCH + LEAGUE + LOGO + SCORE - ALL CLICK!
export default {
async fetch(req, env){
const url=new URL(req.url);
if(url.pathname==="/api/matches"){
  let d=(url.searchParams.get("date")||"").replace(/-/g,"");
  if(!d){let n=new Date();d=n.getFullYear()+String(n.getMonth()+1).padStart(2,'0')+String(n.getDate()).padStart(2,'0');}
  try{
    let r=await fetch(`https://prod-public-api.livescore.com/v1/api/app/date/soccer/${d}/3?MD=1`,{headers:{"User-Agent":"Mozilla/5.0 (iPhone)","Referer":"https://www.livescore.com/","Accept":"application/json"}});
    let j=await r.json();let matches=[];
    (j.Stages||[]).forEach(st=>{
      (st.Events||[]).forEach(ev=>{
        let t1=ev.T1&&ev.T1[0]||{};let t2=ev.T2&&ev.T2[0]||{};
        let cur="";if(ev.Tr1!=null&&ev.Tr2!=null)cur=ev.Tr1+" - "+ev.Tr2;
        let stt=ev.Eps||"NS";let desc=stt;if(stt==="FT")desc="Finished";else if(["HT","LIVE","1H","2H","ET","PEN"].includes(stt)||ev.Epr===1)desc="Live";else if(stt==="NS")desc=ev.Esd?new Date(ev.Esd*1000).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}):"NS";
        matches.push({id:ev.Eid,league:{id:st.Sid,name:st.Snm||"League",cid:st.Cid},country:{name:st.Cnm||"World"},homeTeam:{name:t1.Nm||"Home",id:t1.ID||t1.Id||0},awayTeam:{name:t2.Nm||"Away",id:t2.ID||t2.Id||0},state:{score:{current:cur},description:desc,status:stt,tr1:ev.Tr1,tr2:ev.Tr2},time:ev.Esd,_stageId:st.Sid,_cid:st.Cid});
      });
    });
    return new Response(JSON.stringify({data:matches}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
  }catch(e){return new Response(JSON.stringify({data:[],err:e.message}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});}
}
if(url.pathname==="/api/table"){
  let sid=url.searchParams.get("id")||"";
  try{
    let r=await fetch(`https://prod-public-api.livescore.com/v1/api/app/stage/soccer/${sid}/table?locale=en`,{headers:{"User-Agent":"Mozilla/5.0","Referer":"https://www.livescore.com/"}});
    let j=await r.json();let rows=[];let tables=j.LeagueTable||j.Tables||[];let t=tables[0]||j;let teamRows=t.teamTables||t.Teams||[];
    teamRows.forEach((tr,i)=>{rows.push({pos:tr.R||i+1,team:tr.Tnm||"Team",teamId:tr.Tid||0,MP:tr.Pld||0,W:tr.W||0,D:tr.D||0,L:tr.L||0,G:(tr.GF||0)+":"+(tr.GA||0),PTS:tr.Pts||0});});
    return new Response(JSON.stringify({data:rows,league:j.Snm||"League"}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
  }catch(e){return new Response(JSON.stringify({data:[]}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});}
}
return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>V20.3 ALL CLICKABLE</title><style>
body{margin:0;background:#000;color:#fff;font-family:Arial;-webkit-tap-highlight-color:transparent}.top{background:#fff;color:#000;padding:12px;text-align:center;font-weight:900;position:sticky;top:0;z-index:200;cursor:pointer}.top:active{background:#eee}
.days{display:flex;gap:6px;padding:8px;background:#111;position:sticky;top:48px;z-index:149;overflow-x:auto;cursor:pointer}.dayBtn{padding:10px 16px;border-radius:8px;font-weight:900;background:#222;color:#fff;border:none;cursor:pointer;transition:0.2s}.dayBtn:active{transform:scale(0.95)}.dayBtn.active{background:#fff;color:#000}
.section{background:#1a1a1a;padding:12px 15px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #00ff66;cursor:pointer;transition:0.2s}.section:active{background:#333;transform:scale(0.99)}
.match{background:#0a0a0a;display:flex;justify-content:space-between;align-items:center;padding:12px 12px;border-bottom:1px solid #1a1a1a;cursor:pointer;transition:0.15s}.match:active{background:#1a1a1a;transform:scale(0.99)}
.teamRow{display:flex;align-items:center;gap:10px;margin:5px 0;cursor:pointer}.teamRow:active{opacity:0.6}
.teamLogo{width:24px;height:24px;background:#222;border-radius:50%;overflow:hidden;flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center}.teamLogo:active{transform:scale(1.2)}.teamLogo img{width:100%;height:100%;object-fit:contain}
.scoreBox{font-weight:900;min-width:50px;text-align:center;cursor:pointer;padding:6px;border-radius:6px;transition:0.2s}.scoreBox:active{background:#00ff66;color:#000;transform:scale(1.1)}
.timeBox{width:50px;font-size:12px;text-align:center;cursor:pointer;padding:6px;border-radius:6px}.timeBox:active{background:#333}
#modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:none;overflow-y:auto}#modalTop{background:#fff;color:#000;padding:12px;position:sticky;top:0;display:flex;justify-content:space-between;z-index:100;cursor:pointer}.box{background:#111;border:1px solid #222;border-radius:10px;padding:12px;margin:8px;cursor:pointer;transition:0.2s}.box:active{transform:scale(0.98)}
table{width:100%;border-collapse:collapse;font-size:12px}th{background:#fff;color:#000;padding:10px 4px;cursor:pointer}th:active{background:#00ff66}td{padding:10px 4px;border-bottom:1px solid #222;text-align:center;cursor:pointer}td:active{background:#1a1a1a}
tr:active{background:#111}
.bottom{position:fixed;bottom:0;left:0;right:0;padding:10px;background:#000;border-top:2px solid #00ff66;z-index:9999}.bottom a{background:#00ff66;color:#000;padding:13px;border-radius:12px;font-weight:900;text-align:center;display:flex;justify-content:center;text-decoration:none;cursor:pointer}.bottom a:active{transform:scale(0.97)}.spacer{height:80px}.bet{padding:10px}.bet a{background:#00ff66;color:#000;padding:13px;border-radius:12px;font-weight:900;text-decoration:none;display:flex;justify-content:center;gap:10px;cursor:pointer}.bet a:active{transform:scale(0.97)}.logo1x{background:#fff;color:#0066ff;padding:5px 14px;border-radius:6px}
.clickHint{background:#00ff66;color:#000;padding:6px 10px;border-radius:12px;font-size:9px;font-weight:900;cursor:pointer}
</style></head><body>
<div class="top" onclick="location.reload()">LiveScore V20.3 - EVERYTHING CLICKABLE ✅ CLICK ANYWHERE</div>
<div class="bet"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank"><span class="logo1x">1XBET</span><span>BET NOW 300% BONUS</span></a></div>
<div class="days"><button class="dayBtn" id="btn-y" onclick="loadDay(-1)">Yesterday</button><button class="dayBtn active" id="btn-t" onclick="loadDay(0)">Today</button><button class="dayBtn" id="btn-tm" onclick="loadDay(1)">Tomorrow</button><button class="dayBtn" onclick="location.reload()">↻ Refresh</button><span class="clickHint">ALL CLICKABLE!</span></div>
<div id="content"><div class="box" style="text-align:center">Loading... Everything clickable!<br>Click match, logo, score, league, time - all work!</div></div>
<div id="modal"><div id="modalTop" onclick="closeModal()"><span id="mt" style="font-weight:900">DETAILS - CLICK TO CLOSE X</span><button style="background:#000;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-weight:900" onclick="closeModal()">X</button></div><div id="modalBody"></div></div>
<div class="spacer"></div><div class="bottom"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank"><span class="logo1x">1XBET</span><span>CLICK ANYWHERE - ALL ACTIVE</span></a></div>
<script>
var ALL=[];var curOffset=0;
function getDateStr(o){var n=new Date();n.setDate(n.getDate()+o);var l=new Date(n.toLocaleString('en-US',{timeZone:'Africa/Lagos'}));return l.getFullYear()+"-"+String(l.getMonth()+1).padStart(2,'0')+"-"+String(l.getDate()).padStart(2,'0");}
function logoUrl(id){return id?"https://lsm-static-prod.livescore.com/medium/enet/"+id+".png":"";}
async function load(offset){
 curOffset=offset;document.getElementById('btn-y').classList.toggle('active',offset===-1);document.getElementById('btn-t').classList.toggle('active',offset===0);document.getElementById('btn-tm').classList.toggle('active',offset===1);
 var dStr=getDateStr(offset);document.getElementById('content').innerHTML='<div class="box" style="text-align:center">Loading '+dStr+' - ALL CLICKABLE...</div>';
 try{var r=await fetch('/api/matches?date='+dStr+'&t='+Date.now());var j=await r.json();ALL=j.data||[];render();}catch(e){document.getElementById('content').innerHTML='<div class="box">Error: '+e.message+'</div>';}
}
function render(){
 if(ALL.length===0){document.getElementById('content').innerHTML='<div class="box" style="text-align:center">No matches<br>Click Yesterday - everything clickable!</div>';return;}
 var groups={};ALL.forEach(m=>{var k=String(m.league.id);if(!groups[k])groups[k]={country:m.country.name,league:m.league.name,leagueId:m.league.id,games:[]};groups[k].games.push(m);});
 var html='<div class="box" style="background:#00ff66;color:#000;text-align:center;font-weight:900;padding:8px">👉 CLICK ANYTHING! Match, Logo, Score, League, Time - ALL WORK! 👈</div>';
 Object.values(groups).forEach(gr=>{
  html+='<div class="section" onclick="openTable(\\''+gr.leagueId+'\\')"><div style="cursor:pointer"><div style="font-weight:900;font-size:14px">⚽ '+gr.league.toUpperCase()+'</div><div style="font-size:11px;color:#00ff66">'+gr.country+' • '+gr.games.length+' games • CLICK FOR TABLE ></div></div><div class="clickHint">TABLE ></div></div>';
  gr.games.forEach(m=>{
   var hs=m.state.tr1!=null?m.state.tr1:(m.state.score.current.split('-')[0]||"");var as=m.state.tr2!=null?m.state.tr2:(m.state.score.current.split('-')[1]||"");
   var isFT=m.state.description==="Finished";var isLive=m.state.description==="Live";
   var timeText=isFT?"<span style='font-weight:900'>FT</span>":(isLive?"<span style='color:#ff3b30;font-weight:900'>LIVE</span>":m.state.description);
   html+='<div class="match" onclick="openDetails(\\''+m.id+'\\')"><div class="timeBox" onclick="event.stopPropagation();openDetails(\\''+m.id+'\\')"><div>'+timeText+'</div><div style="font-size:9px;color:#00ff66;margin-top:4px">CLICK</div></div><div style="flex:1;margin-left:10px"><div class="teamRow" onclick="event.stopPropagation();openTeam(\\''+m.homeTeam.id+'\\',\\''+m.homeTeam.name.replace(/'/g,"")+'\\')"><div class="teamLogo"><img src="'+logoUrl(m.homeTeam.id)+'" onerror="this.parentNode.innerHTML=\\'<b>'+m.homeTeam.name.charAt(0)+'</b>\\'"></div><div style="font-size:13px;font-weight:600">'+m.homeTeam.name+'</div></div><div class="teamRow" onclick="event.stopPropagation();openTeam(\\''+m.awayTeam.id+'\\',\\''+m.awayTeam.name.replace(/'/g,"")+'\\')"><div class="teamLogo"><img src="'+logoUrl(m.awayTeam.id)+'" onerror="this.parentNode.innerHTML=\\'<b>'+m.awayTeam.name.charAt(0)+'</b>\\'"></div><div style="font-size:13px;color:#aaa">'+m.awayTeam.name+'</div></div></div><div class="scoreBox" onclick="event.stopPropagation();openDetails(\\''+m.id+'\\')"><div>'+hs+'</div><div>'+as+'</div><div style="font-size:8px;color:#00ff66">CLICK</div></div></div>';
  });
 });
 document.getElementById('content').innerHTML=html;
}
function loadDay(o){load(o);}
function openDetails(id){
 var m=ALL.find(x=>String(x.id)===String(id));if(!m)return;
 document.getElementById('modal').style.display='block';
 document.getElementById('modalBody').innerHTML='<div class="box" onclick="openTable(\\''+m._stageId+'\\')" style="text-align:center;padding:20px;background:#111;border:2px solid #00ff66"><div style="font-size:11px;color:#00ff66;font-weight:900">CLICK HERE FOR FULL TABLE - '+m.league.name+'</div><div style="display:flex;justify-content:space-around;align-items:center;margin:20px 0"><div style="text-align:center;cursor:pointer" onclick="event.stopPropagation();openTeam(\\''+m.homeTeam.id+'\\',\\''+m.homeTeam.name+'\\')"><div class="teamLogo" style="width:60px;height:60px;margin:0 auto 10px"><img src="'+logoUrl(m.homeTeam.id)+'" style="width:100%;height:100%;object-fit:contain"></div><div style="font-weight:900;font-size:16px">'+m.homeTeam.name+'</div><div style="font-size:10px;color:#00ff66">CLICK TEAM</div></div><div style="font-size:32px;font-weight:900;cursor:pointer" onclick="openTable(\\''+m._stageId+'\\')">'+(m.state.score.current||"vs")+'<br><span style="font-size:10px;color:#00ff66">CLICK FOR TABLE</span></div><div style="text-align:center;cursor:pointer" onclick="event.stopPropagation();openTeam(\\''+m.awayTeam.id+'\\',\\''+m.awayTeam.name+'\\')"><div class="teamLogo" style="width:60px;height:60px;margin:0 auto 10px"><img src="'+logoUrl(m.awayTeam.id)+'" style="width:100%;height:100%;object-fit:contain"></div><div style="font-weight:900;font-size:16px">'+m.awayTeam.name+'</div><div style="font-size:10px;color:#00ff66">CLICK TEAM</div></div></div><div style="color:#fff;font-weight:900;padding:10px;background:#00ff66;color:#000;border-radius:8px;cursor:pointer">STATUS: '+m.state.description+' ('+m.state.status+') - CLICK FOR TABLE</div></div><div id="tbox" class="box" style="text-align:center">Loading table... Click anywhere works!</div>';
 openTableInner(m._stageId);
}
function openTeam(id,name){
 if(!id||id=="0"){alert('Team: '+name+'\\nID: '+id+'\\nEverything is clickable!');return;}
 document.getElementById('modal').style.display='block';
 document.getElementById('modalBody').innerHTML='<div class="box" style="text-align:center;padding:30px"><div class="teamLogo" style="width:80px;height:80px;margin:0 auto 15px"><img src="'+logoUrl(id)+'" style="width:100%;height:100%;object-fit:contain" onerror="this.parentNode.innerHTML=\\'<b style=\\'font-size:30px\\'>'+name.charAt(0)+'</b>\\'"></div><div style="font-size:22px;font-weight:900">'+name+'</div><div style="color:#00ff66;margin-top:10px">Team ID: '+id+'</div><div style="margin-top:20px;padding:12px;background:#00ff66;color:#000;border-radius:8px;font-weight:900;cursor:pointer" onclick="closeModal()">CLOSE - EVERYTHING CLICKABLE WORKS!</div></div>';
}
async function openTable(sid){
 document.getElementById('modal').style.display='block';
 document.getElementById('modalBody').innerHTML='<div id="tbox" class="box" style="text-align:center">Loading full table - Everything clickable!<br>ID:'+sid+'</div>';
 openTableInner(sid);
}
async function openTableInner(sid){
 var box=document.getElementById('tbox')||document.getElementById('modalBody');
 if(!box)return;box.innerHTML='<div class="box" style="text-align:center">Loading full table...</div>';
 try{var r=await fetch('/api/table?id='+sid+'&t='+Date.now());var j=await r.json();var rows=j.data||[];if(rows.length===0){box.innerHTML='<div class="box" style="text-align:center">No table for this league (Cup/Friendly)<br>But everything still clickable! Click match again!</div>';return;}
 var h='<div class="box" style="padding:0;overflow-x:auto;border:2px solid #00ff66"><div style="background:#00ff66;color:#000;padding:12px;font-weight:900;text-align:center;cursor:pointer" onclick="closeModal()">FULL TABLE ('+rows.length+' TEAMS) - CLICK TO CLOSE X</div><table><tr><th onclick="alert(\\'Pos clickable!\\')">#</th><th style="text-align:left" onclick="alert(\\'Team clickable!\\')">Team (CLICK TEAM)</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>G</th><th>PTS</th></tr>';
 rows.forEach(rw=>{h+='<tr onclick="openTeam(\\''+rw.teamId+'\\',\\''+rw.team.replace(/'/g,"")+'\\')"><td>'+rw.pos+'</td><td style="text-align:left"><div style="display:flex;align-items:center;gap:8px"><div class="teamLogo" style="width:20px;height:20px"><img src="'+logoUrl(rw.teamId)+'"></div>'+rw.team+'</div></td><td>'+rw.MP+'</td><td>'+rw.W+'</td><td>'+rw.D+'</td><td>'+rw.L+'</td><td>'+rw.G+'</td><td style="font-weight:900;color:#00ff66">'+rw.PTS+'</td></tr>';});
 h+='</table><div style="padding:10px;text-align:center;background:#111;color:#00ff66;font-weight:900;cursor:pointer" onclick="closeModal()">CLICK ANY TEAM ROW - ALL CLICKABLE! CLICK HERE TO CLOSE</div></div>';
 box.innerHTML=h;
 }catch(e){box.innerHTML='<div class="box">Error</div>';}
}
function closeModal(){document.getElementById('modal').style.display='none';}
load(0);
<\/script></body></html>`,{headers:{"Content-Type":"text/html"}});
}
}
