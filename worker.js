export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "*" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const API_KEY = env.
    const TODAY = new Date().toISOString().slice(0,10);
    const PARTNER_LINK = "https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97";
    const PROMO_CODE = "1x_6045135";
    const BC_LINK = "https://bc.game/i-99vfhj262r-n/";

    function getTopRank(l,c){ l=l.toLowerCase().trim(); c=c.toLowerCase().trim(); if(l==="uefa champions league")return 1; if(l==="uefa europa league")return 2; if(l==="premier league"&&c==="england")return 3; if((l==="la liga"||l==="laliga")&&c==="spain")return 4; if(l==="ligue 1"&&c==="france")return 5; if(l==="bundesliga"&&c==="germany")return 6; if(l==="serie a"&&c==="italy")return 7; return 999; }

    if(url.pathname==="/api/matches"){
      const date=url.searchParams.get("date")||TODAY;
      const apiRes=await fetch("https://v3.football.api-sports.io/fixtures?date="+date,{headers:{"x-apisports-key":API_KEY}});
      const j=await apiRes.json(); let data=[];
      for(const f of (j.response||[])){
        let ht = (f.score?.halftime?.home!=null) ? f.score.halftime.home+"-"+f.score.halftime.away : "";
        let ft = (f.goals?.home??0)+"-"+(f.goals?.away??0);
        let pen = (f.score?.penalty?.home!=null) ? f.score.penalty.home+"-"+f.score.penalty.away : "";
        data.push({ id:f.fixture?.id, leagueId:f.league?.id||39, country:(f.league?.country||"WORLD").toUpperCase(), league:f.league?.name||"", timestamp:f.fixture?.timestamp, status:f.fixture?.status?.short||"NS", elapsed:f.fixture?.status?.elapsed||"", home:f.teams?.home?.name||"", away:f.teams?.away?.name||"", score:ft, htScore:ht, penScore:pen, rank:getTopRank(f.league?.name||"", f.league?.country||"") });
      }
      data.sort((a,b)=>{ if(a.rank!==b.rank) return a.rank-b.rank; return (a.country+" - "+a.league).toLowerCase().localeCompare((b.country+" - "+b.league).toLowerCase()); });
      return new Response(JSON.stringify({count:data.length,data:data}),{headers:{...cors,"Content-Type":"application/json","Cache-Control":"no-store"}});
    }

    if(url.pathname==="/api/match-detail"){
      const id = url.searchParams.get("id");
      const [evRes, fixRes] = await Promise.all([
        fetch("https://v3.football.api-sports.io/fixtures/events?fixture="+id,{headers:{"x-apisports-key":API_KEY}}).then(r=>r.json()).catch(()=>({response:[]})),
        fetch("https://v3.football.api-sports.io/fixtures?id="+id,{headers:{"x-apisports-key":API_KEY}}).then(r=>r.json()).catch(()=>({response:[]}))
      ]);
      const events = (evRes.response||[]).map(e=>({
        minuteStr: (e.time?.elapsed||0) + (e.time?.extra ? "+"+e.time.extra : ""),
        type: e.type, detail: e.detail, team: e.team?.name||"", player: e.player?.name||"", assist: e.assist?.name||""
      }));
      return new Response(JSON.stringify({events}),{headers:{...cors,"Content-Type":"application/json","Cache-Control":"max-age=15"}});
    }

    if(url.pathname==="/api/standings"){
      const league = url.searchParams.get("league")||"39";
      const season = url.searchParams.get("season")||"2026";
      const apiRes = await fetch("https://v3.football.api-sports.io/standings?league="+league+"&season="+season,{headers:{"x-apisports-key":API_KEY}});
      const j = await apiRes.json();
      return new Response(JSON.stringify(j),{headers:{...cors,"Content-Type":"application/json"}});
    }

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND LIVESCORE</title><style>
body{margin:0;background:#000;color:#fff;font-family:Arial;font-weight:700}
.top-banner{background:linear-gradient(90deg,#1a5cff,#00d800);color:#fff;text-align:center;padding:8px 12px;position:sticky;top:0;z-index:100;display:flex;justify-content:center;align-items:center;gap:8px;flex-wrap:wrap}
.xlogo{background:#fff;color:#0046ff;padding:2px 8px;border-radius:4px;font-weight:900;font-style:italic;font-size:14px}
.bclogo{background:#111;color:#00ff66;padding:2px 8px;border-radius:4px;font-weight:900;font-size:14px;border:1px solid #00ff66}
.top-banner a{background:#fff;color:#000;padding:6px 14px;border-radius:20px;text-decoration:none;font-weight:900;font-size:13px;display:flex;align-items:center;gap:6px}
.promo-click{background:#fff;color:#000;padding:3px 10px;border-radius:12px;cursor:pointer;font-weight:900;border:2px dashed #1a5cff}
header{position:sticky;top:44px;background:#000;padding:10px 12px;border-bottom:2px solid #0f0;z-index:99}
.top b{color:#0f0;font-size:18px}
.dates{display:flex;gap:8px;overflow-x:auto;margin-top:10px}.dates::-webkit-scrollbar{display:none}
.d{border:1px solid #333;background:#111;color:#888;padding:8px 14px;border-radius:20px;font-size:12px;white-space:nowrap;cursor:pointer}.d.active{background:#0f0;color:#000;font-weight:900}
.filters{display:flex;gap:8px;margin-top:12px;align-items:center;overflow:auto}.filters::-webkit-scrollbar{display:none}
.f{border:1px solid #333;background:#111;color:#888;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;white-space:nowrap}.f.active{background:#fff;color:#000;font-weight:900}
.refresh{margin-left:auto;background:#000;border:1px solid #0f0;color:#0f0;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;font-weight:900;white-space:nowrap}
.country{background:#00ff00 !important;color:#000 !important;padding:11px 12px;margin-top:12px;font-size:13px;border-left:4px solid #fff !important}
.card{background:#111;border:1px solid #222;margin:6px 8px;border-radius:10px;padding:12px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}
.card.live{border-left:3px solid red;background:#1a1111}
.left{display:flex;gap:10px;align-items:center}.time{min-width:60px;text-align:center;background:#000;border:1px solid #0f0;padding:5px 8px;border-radius:20px;font-weight:900;font-size:12px}.time.live{border-color:red !important;color:red;animation:blink 1s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.4}}
.teams{line-height:20px;font-size:14px;max-width:160px}.mid{text-align:right;min-width:110px}.score{font-size:18px;font-weight:900}
.ftbadge{color:#fff;background:#333;padding:2px 8px;border-radius:10px;font-size:11px;display:inline-block;margin-top:3px}
#resultModal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.92);z-index:999;display:none;justify-content:center;align-items:center;padding:15px}
.box{background:#111;border:2px solid #0f0;border-radius:12px;padding:18px;width:100%;max-width:420px;text-align:center;max-height:85vh;overflow:auto}
.betbtn{display:flex;justify-content:center;align-items:center;gap:8px;margin:12px 0;background:#1a5cff;color:#fff;text-align:center;padding:12px;border-radius:8px;text-decoration:none;font-weight:900}
.close{margin-top:10px;background:#222;color:#fff;padding:8px 20px;border-radius:20px;display:inline-block;cursor:pointer}
.card-line{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #222;font-size:13px;text-align:left}
.ev-sec{background:#222;color:#0f0;padding:6px 8px;margin-top:12px;font-size:12px;text-align:left;font-weight:900}
</style></head><body>
<div class="top-banner"><span class="xlogo">1XBET</span> <span class="bclogo">BC.GAME</span> 🔥 BONUS: <span class="promo-click" onclick="copyPromo()">${PROMO_CODE} (Tap)</span> <a href="${PARTNER_LINK}" target="_blank"><span class="xlogo" style="font-size:12px">1XBET</span> BET NOW</a> <a href="${BC_LINK}" target="_blank" style="background:#00ff66;color:#000;padding:6px 14px;border-radius:20px;text-decoration:none;font-weight:900;display:flex;align-items:center;gap:6px"><span style="background:#000;color:#00ff66;padding:2px 6px;border-radius:3px;font-size:12px">BC.GAME</span> BET</a></div>
<header><div class="top"><b>DIAMOND LIVESCORE</b> <span id="liveCount" style="color:red;font-size:12px"></span></div><div class="dates" id="dates"></div><div class="filters"><div class="f active" onclick="filterGames('all',this)">All Games</div><div class="f" onclick="filterGames('live',this)">🔴 LIVE</div><div class="f" onclick="filterGames('finished',this)">Finished</div><div class="refresh" id="refreshBtn">Refresh</div></div></header>
<div id="list">Loading...</div>
<div id="resultModal" onclick="if(event.target.id==='resultModal') closeModal()"><div class="box"><span class="xlogo" style="font-size:22px;padding:6px 14px">1XBET</span> <span class="bclogo" style="font-size:18px">BC.GAME</span><div id="modalTitle" style="font-size:17px;margin:12px 0"></div><div id="modalContent" style="background:#000;padding:12px;border-radius:8px;margin:10px 0;line-height:22px;text-align:left"></div><a href="javascript:void(0)" onclick="copyPromo()" class="betbtn"><span class="xlogo">1XBET</span> BET NOW - ${PROMO_CODE} - 300% BONUS</a><div id="tableBtn" style="margin-top:8px;background:#0f0;color:#000;padding:8px;border-radius:20px;cursor:pointer;display:none" onclick="openTable()">📊 View Table 2026/27</div><div class="close" onclick="closeModal()">X Close</div></div></div>
<script>
const PROMO='${PROMO_CODE}'; const LINK='${PARTNER_LINK}';
function copyPromo(){ navigator.clipboard.writeText(PROMO).then(()=>{ window.open(LINK,'_blank'); }).catch(()=>{ window.open(LINK,'_blank'); }); }
let allData=[]; let currentFilter='all'; let currentMatch=null;
const list=document.getElementById('list');const datesEl=document.getElementById('dates');let selectedDate=new Date();
function fmtDate(d){return d.toISOString().slice(0,10)}function dayLabel(d,i){const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];if(i===0)return 'Today';return days[d.getDay()]+' '+String(d.getDate()).padStart(2,'0');}
function buildDates(){datesEl.innerHTML='';for(let i=-1;i<=1;i++){let dt=new Date();dt.setDate(dt.getDate()+i);let btn=document.createElement('div');btn.className='d'+(i===0?' active':'');btn.textContent=dayLabel(dt,i);btn.onclick=function(){selectedDate=dt;document.querySelectorAll('.d').forEach(x=>x.classList.remove('active'));btn.classList.add('active');load(fmtDate(dt),false);};datesEl.appendChild(btn);}}
function getTime(m){ if(['1H','2H','ET','P'].includes(m.status)) return m.elapsed+"'"; if(m.status==='HT') return 'HT'; let x=new Date(m.timestamp*1000); x.setHours(x.getHours()+1); return x.toISOString().slice(11,16); }
function sc(m){ if(['NS','TBD','PST','CANC'].includes(m.status)) return ''; let penTxt = m.penScore ? '<div style="font-size:11px;color:#0f0">(Pen: '+m.penScore+')</div>' : ''; if(['1H','2H','ET','P'].includes(m.status)) return '<div class="score" style="color:red">'+m.score+'</div>'+penTxt+'<div class="ftbadge" style="background:red">'+m.elapsed+"'" +'</div>'; if(m.status==='HT') return '<div class="score">'+m.score+'</div>'+penTxt+'<div class="ftbadge" style="background:#0f0;color:#000">HT</div>'; if(['FT','AET','PEN'].includes(m.status)) return '<div class="score">'+m.score+'</div>'+penTxt+'<div class="ftbadge">FT</div>'; return '<div class="score">'+m.score+'</div>'+penTxt+'<div class="ftbadge">'+m.status+'</div>'; }
function isLive(s){ return ['1H','2H','HT','ET','BT','P','LIVE'].includes(s); } function isFinished(s){ return ['FT','AET','PEN'].includes(s); }
document.getElementById('refreshBtn').onclick=()=>load(fmtDate(selectedDate),true);
async function load(d,force){ if(!d)d=fmtDate(selectedDate); list.innerHTML='<div style="text-align:center;padding:30px;color:#0f0">Loading ALL leagues...</div>'; let r=await fetch('/api/matches?date='+d+(force?'&refresh=1':''));let j=await r.json();allData=j.data||[]; document.getElementById('liveCount').textContent = allData.filter(m=>isLive(m.status)).length>0 ? '🔴 '+allData.filter(m=>isLive(m.status)).length+' LIVE' : ''; applyFilter(); }
function filterGames(type,el){ currentFilter=type; document.querySelectorAll('.f').forEach(x=>x.classList.remove('active')); el.classList.add('active'); applyFilter(); }
function applyFilter(){ let data=allData; if(currentFilter==='live') data=allData.filter(m=>isLive(m.status)); if(currentFilter==='finished') data=allData.filter(m=>isFinished(m.status)); render(data); }
function render(data){ if(!data.length){ list.innerHTML='<div style="text-align:center;padding:40px;color:#666">No games</div>';return} let h=''; let lastKey=''; for(let m of data){ let key=m.country+' - '+m.league; if(key!==lastKey){ h+='<div class="country"><span>'+key+'</span></div>'; lastKey=key; } let liveClass = isLive(m.status) ? ' live' : ''; let timeClass = isLive(m.status) ? ' time live' : ' time'; h+='<div class="card'+liveClass+'" onclick="openResult('+m.id+')"><div class="left"><div class="'+timeClass+'">'+getTime(m)+'</div><div class="teams"><div>'+m.home+'</div><div>'+m.away+'</div></div></div><div class="mid">'+sc(m)+'</div></div>'; } list.innerHTML=h; }
async function openResult(id){
  let m = allData.find(x=>x.id===id); if(!m) return; currentMatch=m;
  document.getElementById('modalTitle').textContent=m.home+' vs '+m.away;
  document.getElementById('modalContent').innerHTML='<div style="text-align:center;color:#0f0">Loading details... FT: '+m.score+' | HT: '+(m.htScore||'-')+'</div>';
  document.getElementById('resultModal').style.display='flex';
  document.getElementById('tableBtn').style.display='block';
  document.getElementById('tableBtn').textContent='📊 View '+m.league+' Table 2026/27';
  try{
    let r=await fetch('/api/match-detail?id='+id);
    let j=await r.json(); let ev=j.events||[];
    let html='<div style="text-align:center">FT: <b style="color:#0f0;font-size:24px">'+m.score+'</b></div><div>HT: <b>'+(m.htScore||'-')+'</b></div>';
    if(m.penScore) html+='<div style="color:#0f0">Pen: '+m.penScore+'</div>';
    if(!ev.length){
      html+='<div style="margin-top:12px;text-align:center"><b>FT: '+m.score+' | HT: '+(m.htScore||'-')+'</b><br><br><span style="font-size:12px;color:#888">Scorer details not yet published by API for this league. Tap retry.</span><br><br><button onclick="openResult('+id+')" style="background:#0f0;color:#000;padding:8px 16px;border-radius:20px;border:none;font-weight:900">🔄 Retry</button></div>';
    } else {
      function block(title, list){ if(!list.length) return ''; let s='<div class="ev-sec">'+title+'</div>'; list.forEach(e=>{ let col=e.type==='Goal'?'#0f0':e.detail.includes('Yellow')?'#ffeb00':e.detail.includes('Red')?'red':'#0ff'; let icon=e.type==='Goal'?'⚽':e.type==='Card'?(e.detail.includes('Yellow')?'🟨':'🟥'):'🔄'; s+='<div class="card-line"><span style="color:'+col+'">'+e.minuteStr+"' "+icon+' <b>'+e.player+'</b>'+(e.assist?' ('+e.assist+')':'')+'<br><span style="font-size:10px;color:#aaa">['+e.team.slice(0,22)+']</span></span><span style="font-size:10px">'+(e.detail||'')+'</span></div>'; }); return s; }
      html+=block('⚽ Goals - ALL LEAGUES', ev.filter(e=>e.type==='Goal'));
      html+=block('🟨🟥 Cards', ev.filter(e=>e.type==='Card'));
      html+=block('🔄 Subs', ev.filter(e=>e.type==='subst'));
    }
    document.getElementById('modalContent').innerHTML=html;
  }catch(e){ document.getElementById('modalContent').innerHTML='<div style="text-align:center">FT: '+m.score+'<br><button onclick="openResult('+id+')" style="background:#0f0;color:#000;padding:8px 16px;border-radius:20px;border:none">Retry</button></div>'; }
}
async function openTable(){ if(!currentMatch) return; let leagueId = currentMatch.leagueId; let leagueName=currentMatch.league; let country=currentMatch.country; let season=2026; document.getElementById('modalContent').innerHTML='<div style="text-align:center;color:#0f0">Loading '+leagueName+' 2026/27 table...</div>'; try{ let r = await fetch('/api/standings?league='+leagueId+'&season='+season); let j = await r.json(); let table = j.response?.[0]?.league?.standings?.[0]||[]; if(!table.length){ document.getElementById('modalContent').innerHTML='<div style="color:#888">Table not available</div>'; return; } let html='<div style="font-size:12px;color:#0f0;margin-bottom:8px;font-weight:900">'+country+' - '+leagueName+' 2026/27 - ALL LEAGUES</div>'; html+='<div style="display:flex;font-size:11px;color:#888;border-bottom:1px solid #333;padding:6px 0"><span style="width:25px">#</span><span style="flex:1">Team</span><span style="width:20px">MP</span><span style="width:50px">G</span><span style="width:30px">PTS</span></div>'; table.forEach(t=>{ html+='<div style="display:flex;font-size:13px;padding:5px 0;border-bottom:1px solid #222"><span style="width:25px">'+t.rank+'.</span><span style="flex:1">'+t.team.name+'</span><span style="width:20px">'+t.all.played+'</span><span style="width:50px">'+t.all.goals.for+':'+t.all.goals.against+'</span><span style="width:30px;font-weight:900">'+t.points+'</span></div>'; }); document.getElementById('modalContent').innerHTML=html; }catch(e){ document.getElementById('modalContent').innerHTML='<div style="color:red">Error</div>'; } }
function closeModal(){ document.getElementById('resultModal').style.display='none'; }
buildDates();load(fmtDate(selectedDate),false);
setInterval(()=>{ if(allData.some(m=>isLive(m.status))) load(fmtDate(selectedDate),true); }, 40000);
<\/script></body></html>`;
    return new Response(html, { headers:{...cors,"Content-Type":"text/html"}});
  }
}
