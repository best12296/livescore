export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "*" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const API_KEY = "98a19520b228fd8dcff8459b07f0d569";
    const TODAY = new Date().toISOString().slice(0,10);
    const PARTNER_LINK = "https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97";
    const PROMO_CODE = "1x_6045135";

    function getTopRank(l,c){ l=l.toLowerCase().trim(); c=c.toLowerCase().trim(); if(l==="uefa champions league")return 1; if(l==="uefa europa league")return 2; if(l==="premier league"&&c==="england")return 3; if((l==="la liga"||l==="laliga")&&c==="spain")return 4; if(l==="ligue 1"&&c==="france")return 5; if(l==="bundesliga"&&c==="germany")return 6; if(l==="serie a"&&c==="italy")return 7; return 999; }

    if(url.pathname==="/api/matches"){
      const date=url.searchParams.get("date")||TODAY;
      const cacheKey=new Request("https://cache.local/CARD-MINS-"+date);
      const cache=caches.default; const cached=await cache.match(cacheKey);
      if(cached && url.searchParams.get("refresh")!=="1") return new Response(await cached.text(), {headers:{...cors,"Content-Type":"application/json"}});
      
      const apiRes=await fetch("https://v3.football.api-sports.io/fixtures?date="+date,{headers:{"x-apisports-key":API_KEY}});
      const j=await apiRes.json(); let data=[];
      for(const f of (j.response||[])){
        let ht = (f.score?.halftime?.home!=null) ? f.score.halftime.home+"-"+f.score.halftime.away : "";
        let ft = (f.goals?.home??0)+"-"+(f.goals?.away??0);
        let pen = (f.score?.penalty?.home!=null) ? f.score.penalty.home+"-"+f.score.penalty.away : "";
        data.push({ id:f.fixture?.id, country:(f.league?.country||"WORLD").toUpperCase(), league:f.league?.name||"", timestamp:f.fixture?.timestamp, status:f.fixture?.status?.short||"NS", elapsed:f.fixture?.status?.elapsed||"", home:f.teams?.home?.name||"", away:f.teams?.away?.name||"", score:ft, htScore:ht, penScore:pen, yellow:0, red:0, cards:[], rank:getTopRank(f.league?.name||"", f.league?.country||"") });
      }

      // FETCH CARDS WITH MINUTES - first 30 games (FT + LIVE)
      let toFetch = data.filter(m=>['FT','AET','PEN','1H','2H','HT','ET','LIVE'].includes(m.status)).slice(0,30);
      try{
        let cards = await Promise.all(toFetch.map(async m=>{
          try{
            let r = await fetch("https://v3.football.api-sports.io/fixtures/events?fixture="+m.id,{headers:{"x-apisports-key":API_KEY}}).then(x=>x.json());
            let list = (r.response||[]).filter(e=>e.type==='Card').map(e=>{
              return {
                minute: (e.time?.elapsed||0) + (e.time?.extra ? "+"+e.time.extra : ""),
                player: e.player?.name||"Player",
                team: e.team?.name||"",
                detail: e.detail||"" // Yellow Card, Red Card
              };
            });
            let yellows = list.filter(c=>c.detail==='Yellow Card').length;
            let reds = list.filter(c=>c.detail.includes('Red')).length;
            return {id:m.id, yellow:yellows, red:reds, cards:list};
          }catch(e){ return {id:m.id, yellow:0, red:0, cards:[]} }
        }));
        let map={}; cards.forEach(x=>map[x.id]=x);
        data = data.map(m=>{ if(map[m.id]){ m.yellow=map[m.id].yellow; m.red=map[m.id].red; m.cards=map[m.id].cards; } return m; });
      }catch(e){}

      data.sort((a,b)=>{ if(a.rank!==b.rank) return a.rank-b.rank; return (a.country+" - "+a.league).toLowerCase().localeCompare((b.country+" - "+b.league).toLowerCase()); });
      const txt=JSON.stringify({count:data.length,data:data});
      ctx.waitUntil(cache.put(cacheKey,new Response(txt,{headers:{"Content-Type":"application/json","Cache-Control":"max-age=60"}})));
      return new Response(txt,{headers:{...cors,"Content-Type":"application/json"}});
    }

    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND LIVESCORE</title><style>
body{margin:0;background:#000;color:#fff;font-family:Arial;font-weight:700}
.top-banner{background:linear-gradient(90deg,#1a5cff,#00d800);color:#fff;text-align:center;padding:8px 12px;position:sticky;top:0;z-index:100;display:flex;justify-content:center;align-items:center;gap:8px;flex-wrap:wrap}
.xlogo{background:#fff;color:#0046ff;padding:2px 8px;border-radius:4px;font-weight:900;font-style:italic;font-size:14px}
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
.cardbox{display:inline-block;width:10px;height:14px;border-radius:2px;margin-left:3px;border:1px solid #fff;vertical-align:middle}.redbox{background:red}.yellowbox{background:#ffeb00}
.min-tag{font-size:10px;color:#888;margin-left:2px}
.ftbadge{color:#fff;background:#333;padding:2px 8px;border-radius:10px;font-size:11px;display:inline-block;margin-top:3px}
#resultModal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.92);z-index:999;display:none;justify-content:center;align-items:center;padding:15px}
.box{background:#111;border:2px solid #0f0;border-radius:12px;padding:18px;width:100%;max-width:400px;text-align:center;max-height:85vh;overflow:auto}
.betbtn{display:flex;justify-content:center;align-items:center;gap:8px;margin:12px 0;background:#1a5cff;color:#fff;text-align:center;padding:12px;border-radius:8px;text-decoration:none;font-weight:900}
.close{margin-top:10px;background:#222;color:#fff;padding:8px 20px;border-radius:20px;display:inline-block;cursor:pointer}
.card-line{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #222;font-size:13px;text-align:left}
</style></head><body>
<div class="top-banner"><span class="xlogo">1XBET</span> 🔥 BONUS: <span class="promo-click" onclick="copyPromo()">${PROMO_CODE} (Tap)</span> <a href="${PARTNER_LINK}" target="_blank"><span class="xlogo" style="font-size:12px">1XBET</span> BET NOW</a></div>
<header><div class="top"><b>DIAMOND LIVESCORE</b> <span id="liveCount" style="color:red;font-size:12px"></span></div><div class="dates" id="dates"></div><div class="filters"><div class="f active" onclick="filterGames('all',this)">All Games</div><div class="f" onclick="filterGames('live',this)">🔴 LIVE</div><div class="f" onclick="filterGames('finished',this)">Finished</div><div class="refresh" id="refreshBtn">Refresh</div></div></header>
<div id="list">Loading...</div>
<div id="resultModal" onclick="if(event.target.id==='resultModal') closeModal()"><div class="box"><span class="xlogo" style="font-size:22px;padding:6px 14px">1XBET</span><div id="modalTitle" style="font-size:17px;margin:12px 0"></div><div id="modalContent" style="background:#000;padding:12px;border-radius:8px;margin:10px 0;line-height:22px;text-align:left"></div><a href="javascript:void(0)" onclick="copyPromo()" class="betbtn"><span class="xlogo">1XBET</span> BET NOW - ${PROMO_CODE} - 300% BONUS</a><div class="close" onclick="closeModal()">X Close</div></div></div>
<script>
const PROMO='${PROMO_CODE}'; const LINK='${PARTNER_LINK}';
function copyPromo(){ navigator.clipboard.writeText(PROMO).then(()=>{ window.open(LINK,'_blank'); }).catch(()=>{ window.open(LINK,'_blank'); }); }
let allData=[]; let currentFilter='all';
const list=document.getElementById('list');const datesEl=document.getElementById('dates');let selectedDate=new Date();
function fmtDate(d){return d.toISOString().slice(0,10)}function dayLabel(d,i){const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];if(i===0)return 'Today';return days[d.getDay()]+' '+String(d.getDate()).padStart(2,'0');}
function buildDates(){datesEl.innerHTML='';for(let i=-1;i<=1;i++){let dt=new Date();dt.setDate(dt.getDate()+i);let btn=document.createElement('div');btn.className='d'+(i===0?' active':'');btn.textContent=dayLabel(dt,i);btn.onclick=function(){selectedDate=dt;document.querySelectorAll('.d').forEach(x=>x.classList.remove('active'));btn.classList.add('active');load(fmtDate(dt),false);};datesEl.appendChild(btn);}}
function getTime(m){
  if(['1H','2H','ET','P'].includes(m.status)) return m.elapsed+"'";
  if(m.status==='HT') return 'HT';
  let x=new Date(m.timestamp*1000); x.setHours(x.getHours()+1); return x.toISOString().slice(11,16);
}
function sc(m){
  if(['NS','TBD','PST','CANC'].includes(m.status)) return '';
  let cards = '';
  if(m.cards && m.cards.length>0){
    m.cards.slice(0,3).forEach(c=>{
      let box = c.detail.includes('Yellow') ? '<span class="cardbox yellowbox"></span>' : '<span class="cardbox redbox"></span>';
      cards += box+'<span class="min-tag">'+c.minute+"'" +'</span> ';
    });
  } else {
    if(m.yellow>0) cards += '<span class="cardbox yellowbox"></span>';
    if(m.red>0) cards += '<span class="cardbox redbox"></span>';
  }
  let penTxt = m.penScore ? '<div style="font-size:11px;color:#0f0">(Pen: '+m.penScore+')</div>' : '';
  if(['1H','2H','ET','P'].includes(m.status)) return '<div class="score" style="color:red">'+m.score+'<br><span style="font-size:10px">'+cards+'</span></div>'+penTxt+'<div class="ftbadge" style="background:red">'+m.elapsed+"'" +'</div>';
  if(m.status==='HT') return '<div class="score">'+m.score+'<br><span style="font-size:10px">'+cards+'</span></div>'+penTxt+'<div class="ftbadge" style="background:#0f0;color:#000">HT</div>';
  if(['FT','AET','PEN'].includes(m.status)) return '<div class="score">'+m.score+'<br><span style="font-size:10px">'+cards+'</span></div>'+penTxt+'<div class="ftbadge">FT</div>';
  return '<div class="score">'+m.score+'</div>'+penTxt+'<div class="ftbadge">'+m.status+'</div>';
}
function isLive(s){ return ['1H','2H','HT','ET','BT','P','LIVE'].includes(s); }
function isFinished(s){ return ['FT','AET','PEN'].includes(s); }
function isNotStarted(s){ return ['NS','TBD','PST','CANC'].includes(s); }
document.getElementById('refreshBtn').onclick=()=>load(fmtDate(selectedDate),true);
async function load(d,force){
  if(!d)d=fmtDate(selectedDate);
  list.innerHTML='<div style="text-align:center;padding:30px;color:#0f0">Loading cards with minutes...</div>';
  let r=await fetch('/api/matches?date='+d+(force?'&refresh=1':''));let j=await r.json();allData=j.data||[];
  let liveN = allData.filter(m=>isLive(m.status)).length;
  document.getElementById('liveCount').textContent = liveN>0 ? '🔴 '+liveN+' LIVE' : '';
  applyFilter();
}
function filterGames(type,el){ currentFilter=type; document.querySelectorAll('.f').forEach(x=>x.classList.remove('active')); el.classList.add('active'); applyFilter(); }
function applyFilter(){ let data=allData; if(currentFilter==='live') data=allData.filter(m=>isLive(m.status)); if(currentFilter==='finished') data=allData.filter(m=>isFinished(m.status)); render(data); }
function render(data){
  if(!data.length){ let msg = currentFilter==='live' ? 'No LIVE games now' : currentFilter==='finished' ? 'No finished games yet' : 'No games'; list.innerHTML='<div style="text-align:center;padding:40px;color:#666">'+msg+'</div>';return}
  let h=''; let lastKey='';
  for(let m of data){
    let key=m.country+' - '+m.league;
    if(key!==lastKey){ h+='<div class="country"><span>'+key+'</span></div>'; lastKey=key; }
    let liveClass = isLive(m.status) ? ' live' : '';
    let timeClass = isLive(m.status) ? ' time live' : ' time';
    h+='<div class="card'+liveClass+'" onclick="openResult('+m.id+')"><div class="left"><div class="'+timeClass+'">'+getTime(m)+'</div><div class="teams"><div>'+m.home+'</div><div>'+m.away+'</div></div></div><div class="mid">'+sc(m)+'</div></div>';
  }
  list.innerHTML=h;
}
function openResult(id){
  let m = allData.find(x=>x.id===id); if(!m) return;
  let title = m.home+' vs '+m.away; let content='';
  if(isNotStarted(m.status)){
    content = '<div style="color:#0f0;text-align:center">⏳ Not Started</div><div style="margin-top:12px">HT: <b style="color:#888">Not Started</b></div><div>FT: <b style="color:#888">Not Started</b></div><div style="margin-top:8px">Kickoff: <b>'+getTime(m)+'</b></div>';
  } else {
    content = '<div style="text-align:center">FT: <b style="color:#0f0;font-size:24px">'+m.score+'</b></div>'
            + '<div style="margin-top:10px">HT: <b>'+(m.htScore||'-')+'</b></div>'
            + '<div>FT: <b>'+m.score+'</b></div>';
    if(m.cards && m.cards.length>0){
      content += '<div style="margin-top:12px;border-top:1px solid #333;padding-top:8px"><b style="color:#0f0">Cards with Minutes:</b></div>';
      m.cards.forEach(c=>{
        let icon = c.detail.includes('Yellow') ? '<span class="cardbox yellowbox"></span>' : '<span class="cardbox redbox"></span>';
        let color = c.detail.includes('Yellow') ? '#ffeb00' : 'red';
        content += '<div class="card-line"><span>'+icon+' <b style="color:'+color+'">'+c.minute+"'" +'</b> - '+c.player+'</span><span style="font-size:11px;color:#888">'+c.team.substring(0,15)+'</span></div>';
      });
    } else {
      if(m.yellow>0) content += '<div style="margin-top:8px"><span class="cardbox yellowbox"></span> Yellow: '+m.yellow+'</div>';
      if(m.red>0) content += '<div><span class="cardbox redbox"></span> Red: '+m.red+'</div>';
      if(m.yellow==0 && m.red==0) content += '<div style="margin-top:8px;color:#888;font-size:12px">No cards in this match</div>';
    }
    if(m.penScore) content += '<div style="margin-top:8px;color:#0f0">Pen: '+m.penScore+'</div>';
  }
  document.getElementById('modalTitle').textContent=title; document.getElementById('modalContent').innerHTML=content; document.getElementById('resultModal').style.display='flex';
}
function closeModal(){ document.getElementById('resultModal').style.display='none'; }
buildDates();load(fmtDate(selectedDate),false);
setInterval(()=>{ if(allData.some(m=>isLive(m.status))) load(fmtDate(selectedDate),true); }, 40000);
<\/script></body></html>`;
    return new Response(html, { headers:{...cors,"Content-Type":"text/html"}});
  }
}
