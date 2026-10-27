export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "*" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const API_KEY = "98a19520b228fd8dcff8459b07f0d569";
    const TODAY = new Date().toISOString().slice(0,10);
    const PARTNER_LINK = "https://1xpart.link/a/YOUR_CODE"; // replace with yours

    function getTopRank(l,c){ l=l.toLowerCase().trim(); c=c.toLowerCase().trim(); if(l==="uefa champions league")return 1; if(l==="uefa europa league")return 2; if(l==="premier league"&&c==="england")return 3; if((l==="la liga"||l==="laliga")&&c==="spain")return 4; if(l==="ligue 1"&&c==="france")return 5; if(l==="bundesliga"&&c==="germany")return 6; if(l==="serie a"&&c==="italy")return 7; if(l==="eredivisie"&&c==="netherlands")return 8; if(l==="championship"&&c==="england")return 9; return 999; }

    if(url.pathname==="/api/matches"){
      const date=url.searchParams.get("date")||TODAY;
      const cacheKey=new Request("https://cache.local/TOP9-AZ-"+date);
      const cache=caches.default; const cached=await cache.match(cacheKey);
      if(cached && url.searchParams.get("refresh")!=="1") return new Response(await cached.text(), {headers:{...cors,"Content-Type":"application/json"}});
      const apiRes=await fetch("https://v3.football.api-sports.io/fixtures?date="+date,{headers:{"x-apisports-key":API_KEY}});
      const j=await apiRes.json(); const data=[];
      for(const f of (j.response||[])){
        data.push({ id:f.fixture?.id, country:(f.league?.country||"WORLD").toUpperCase(), league:f.league?.name||"", leagueId:f.league?.id||0, timestamp:f.fixture?.timestamp, status:f.fixture?.status?.short||"NS", elapsed:f.fixture?.status?.elapsed||"", home:f.teams?.home?.name||"", away:f.teams?.away?.name||"", homeId:f.teams?.home?.id, awayId:f.teams?.away?.id, score:(f.goals?.home??0)+"-"+(f.goals?.away??0), rank:getTopRank(f.league?.name||"", f.league?.country||"") });
      }
      data.sort((a,b)=>{ if(a.rank!==b.rank) return a.rank-b.rank; return (a.country+" - "+a.league).toLowerCase().localeCompare((b.country+" - "+b.league).toLowerCase()); });
      const txt=JSON.stringify({count:data.length,data:data});
      ctx.waitUntil(cache.put(cacheKey,new Response(txt,{headers:{"Content-Type":"application/json","Cache-Control":"max-age=60"}})));
      return new Response(txt,{headers:{...cors,"Content-Type":"application/json"}});
    }

    // NEW APIS FOR DETAIL PAGE
    if(url.pathname==="/api/detail"){
      const fid=url.searchParams.get("id");
      const leagueId=url.searchParams.get("league");
      const homeId=url.searchParams.get("homeId");
      const awayId=url.searchParams.get("awayId");
      // Parallel calls
      const [standRes, h2hRes, lineRes, statRes] = await Promise.all([
        fetch(`https://v3.football.api-sports.io/standings?league=${leagueId}&season=2025`,{headers:{"x-apisports-key":API_KEY}}).then(r=>r.json()).catch(()=>({})),
        fetch(`https://v3.football.api-sports.io/fixtures/headtohead?h2h=${homeId}-${awayId}&last=5`,{headers:{"x-apisports-key":API_KEY}}).then(r=>r.json()).catch(()=>({})),
        fetch(`https://v3.football.api-sports.io/fixtures/lineups?fixture=${fid}`,{headers:{"x-apisports-key":API_KEY}}).then(r=>r.json()).catch(()=>({})),
        fetch(`https://v3.football.api-sports.io/fixtures/statistics?fixture=${fid}`,{headers:{"x-apisports-key":API_KEY}}).then(r=>r.json()).catch(()=>({}))
      ]);
      return new Response(JSON.stringify({standing:standRes.response||[], h2h:h2hRes.response||[], lineup:lineRes.response||[], stats:statRes.response||[]}),{headers:{...cors,"Content-Type":"application/json"}});
    }

    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND LIVESCORE</title><style>
body{margin:0;background:#000;color:#fff;font-family:Arial;font-weight:700}
header{position:sticky;top:0;background:#000;padding:10px 12px;border-bottom:2px solid #0f0;z-index:99}
.top b{color:#0f0;font-size:18px}
.dates{display:flex;gap:8px;overflow-x:auto;margin-top:10px}.dates::-webkit-scrollbar{display:none}
.d{border:1px solid #333;background:#111;color:#888;padding:8px 14px;border-radius:20px;font-size:12px;white-space:nowrap;cursor:pointer}.d.active{background:#0f0;color:#000;font-weight:900}
.filters{display:flex;gap:8px;margin-top:12px;align-items:center}.f{border:1px solid #333;background:#111;color:#888;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer}.f.active{background:#fff;color:#000;font-weight:900}
.refresh{margin-left:auto;background:#000;border:1px solid #0f0;color:#0f0;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;font-weight:900}
.country{background:#00ff00 !important;color:#000 !important;padding:11px 12px;margin-top:12px;font-size:13px;border-left:4px solid #fff !important}
.card{background:#111;border:1px solid #222;margin:6px 8px;border-radius:10px;padding:12px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}
.left{display:flex;gap:10px;align-items:center}.time{min-width:55px;text-align:center;background:#000 !important;border:1px solid #0f0 !important;padding:5px 8px;border-radius:20px;font-weight:900;font-size:12px}
.teams{line-height:20px;font-size:14px}.mid{text-align:right;min-width:70px}.score{font-size:18px;font-weight:900}.ftbadge{color:#fff;background:#333;padding:2px 8px;border-radius:10px;font-size:11px}
#detail{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:999;overflow:auto;display:none}
.tabbar{display:flex;gap:6px;padding:10px;background:#111;border-bottom:1px solid #333;overflow:auto}
.tab{padding:8px 14px;border-radius:20px;background:#222;color:#888;font-size:12px;cursor:pointer;white-space:nowrap}.tab.active{background:#fff;color:#000}
.table{padding:10px}.row{display:flex;justify-content:space-between;padding:8px;border-bottom:1px solid #222;font-size:13px}
.betbtn{display:block;margin:12px;background:#1a5cff;color:#fff;text-align:center;padding:12px;border-radius:8px;text-decoration:none;font-weight:900}
</style></head><body>
<header><div class="top"><b>DIAMOND LIVESCORE</b></div><div class="dates" id="dates"></div><div class="filters"><div class="f active">All Games</div><div class="refresh" id="refreshBtn">Refresh</div></div></header>
<div id="list">Loading...</div>
<div id="detail"><div style="padding:12px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0f0"><b id="detailTitle">Match</b><span onclick="document.getElementById('detail').style.display='none'" style="background:#222;padding:6px 12px;border-radius:20px;cursor:pointer">X Close</span></div><a href="${PARTNER_LINK}" target="_blank" class="betbtn">🔥 BET NOW - 1XBET - 300% BONUS</a><div class="tabbar"><div class="tab active" onclick="showTab('standing')">2025/26 Standing</div><div class="tab" onclick="showTab('h2h')">H2H</div><div class="tab" onclick="showTab('lineup')">Lineup</div><div class="tab" onclick="showTab('stats')">Stats</div></div><div id="tabContent" class="table">Loading...</div></div>
<script>
let allData=[]; let currentDetail=null; let detailCache=null;
const list=document.getElementById('list');const datesEl=document.getElementById('dates');let selectedDate=new Date();
function fmtDate(d){return d.toISOString().slice(0,10)}function dayLabel(d,i){const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];if(i===0)return 'Today';return days[d.getDay()]+' '+String(d.getDate()).padStart(2,'0');}
function buildDates(){datesEl.innerHTML='';for(let i=-1;i<=1;i++){let dt=new Date();dt.setDate(dt.getDate()+i);let btn=document.createElement('div');btn.className='d'+(i===0?' active':'');btn.textContent=dayLabel(dt,i);btn.onclick=function(){selectedDate=dt;document.querySelectorAll('.d').forEach(x=>x.classList.remove('active'));btn.classList.add('active');load(fmtDate(dt),false);};datesEl.appendChild(btn);}}
function getTime(m){ if(!m.timestamp) return ''; if(m.status==='1H'||m.status==='2H') return '<span style="color:red">'+(m.elapsed||'')+"'" +'</span>'; if(m.status==='HT') return '<span style="color:#0f0">HT</span>'; let x=new Date(m.timestamp*1000); x.setHours(x.getHours()+1); return x.toISOString().slice(11,16); }
function sc(m){ if(m.status==='NS') return ''; if(m.status==='1H'||m.status==='2H') return '<div class="score">'+m.score+'</div><div class="ftbadge" style="background:red">LIVE</div>'; if(m.status==='HT') return '<div class="score">'+m.score+'</div><div class="ftbadge" style="background:#0f0;color:#000">HT</div>'; return '<div class="score">'+m.score+'</div><div class="ftbadge">'+m.status+'</div>'; }
document.getElementById('refreshBtn').onclick=()=>load(fmtDate(selectedDate),true);
async function load(d,force){if(!d)d=fmtDate(selectedDate);list.innerHTML='<div style="text-align:center;padding:30px;color:#0f0">Loading...</div>';let r=await fetch('/api/matches?date='+d+(force?'&refresh=1':''));let j=await r.json();allData=j.data||[];render(allData);}
function render(data){ if(!data.length){list.innerHTML='<div style="text-align:center;padding:40px;color:#666">No games</div>';return} let h=''; let lastKey=''; for(let m of data){ let key=m.country+' - '+m.league; if(key!==lastKey){ h+='<div class="country"><span>'+key+'</span></div>'; lastKey=key; } h+='<div class="card" onclick="openDetail('+m.id+','+m.leagueId+','+m.homeId+','+m.awayId+',\\''+m.home.replace(/'/g,"")+' vs '+m.away.replace(/'/g,"")+'\\')"><div class="left"><div class="time">'+getTime(m)+'</div><div class="teams"><div>'+m.home+'</div><div>'+m.away+'</div></div></div><div class="mid">'+sc(m)+'</div></div>'; } list.innerHTML=h; }
async function openDetail(id,leagueId,homeId,awayId,title){ document.getElementById('detail').style.display='block'; document.getElementById('detailTitle').textContent=title; document.getElementById('tabContent').innerHTML='Loading 2025/26 data...'; let r=await fetch('/api/detail?id='+id+'&league='+leagueId+'&homeId='+homeId+'&awayId='+awayId); detailCache=await r.json(); showTab('standing'); }
function showTab(t){ document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active')); let map={'standing':0,'h2h':1,'lineup':2,'stats':3}; document.querySelectorAll('.tab')[map[t]].classList.add('active'); let c=document.getElementById('tabContent'); if(!detailCache){c.innerHTML='No data';return}
 if(t==='standing'){ let st=detailCache.standing[0]?.league?.standings?.[0]||[]; if(!st.length){c.innerHTML='Standing not available for this league yet (2025/26)'; return} let h='<div class="row" style="background:#111"><span># Team</span><span>Pts</span></div>'; st.forEach(s=>{ h+='<div class="row"><span>'+s.rank+'. '+s.team.name+'</span><span>'+s.points+' pts ('+s.all.played+'P)</span></div>'; }); c.innerHTML=h; }
 if(t==='h2h'){ let h2=detailCache.h2h||[]; if(!h2.length){c.innerHTML='No H2H yet';return} let h=''; h2.forEach(f=>{ h+='<div class="row"><span>'+f.teams.home.name+' '+f.goals.home+'-'+f.goals.away+' '+f.teams.away.name+'</span><span>'+f.fixture.date.slice(0,10)+'</span></div>'; }); c.innerHTML=h; }
 if(t==='lineup'){ let lp=detailCache.lineup||[]; if(!lp.length){c.innerHTML='Lineup not announced yet - shows 1 hour before kickoff';return} let h=''; lp.forEach(l=>{ h+='<div style="padding:10px;background:#111;margin:6px;border-radius:8px"><b>'+l.team.name+' ('+l.formation+')</b><br><span style="font-size:12px;color:#888">'+l.startXI.map(p=>p.player.name).join(', ')+'</span></div>'; }); c.innerHTML=h; }
 if(t==='stats'){ let st=detailCache.stats||[]; if(!st.length){c.innerHTML='Stats available only during/after match';return} let h=''; st.forEach(s=>{ h+='<div style="padding:8px;background:#111;margin:8px;border-radius:8px"><b>'+s.team.name+'</b><br>'+s.statistics.map(x=>'<div class="row"><span>'+x.type+'</span><span>'+x.value+'</span></div>').join('')+'</div>'; }); c.innerHTML=h; }
}
buildDates();load(fmtDate(selectedDate),false);
<\/script></body></html>`;
    return new Response(html, { headers:{...cors,"Content-Type":"text/html"}});
  }
}
