export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "*" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const API_KEY = "98a19520b228fd8dcff8459b07f0d569";

    function getTopRank(l,c){
      l=l.toLowerCase().trim(); c=c.toLowerCase().trim();
      if(l==="uefa champions league") return 1;
      if(l==="uefa europa league") return 2;
      if(l==="premier league" && c==="england") return 3;
      if((l==="la liga"||l==="laliga") && c==="spain") return 4;
      if(l==="ligue 1" && c==="france") return 5;
      if(l==="bundesliga" && c==="germany") return 6;
      if(l==="serie a" && c==="italy") return 7;
      if(l==="eredivisie" && c==="netherlands") return 8;
      if(l==="championship" && c==="england") return 9;
      return 999;
    }

    if(url.pathname==="/api/matches"){
      let date=url.searchParams.get("date");
      const cache=caches.default;
      const cacheKey=new Request("https://cache.local/FIXED-ALL-WORKS-"+(date||"today"));
      if(url.searchParams.get("refresh")!=="1"){
        const cached=await cache.match(cacheKey);
        if(cached) return new Response(await cached.text(), {headers:{...cors,"Content-Type":"application/json"}});
      }
      // Try requested date
      let apiRes=await fetch("https://v3.football.api-sports.io/fixtures?date="+date,{headers:{"x-apisports-key":API_KEY}});
      let j=await apiRes.json();
      let resp=j.response||[];

      // IF NO GAMES FOR THAT FUTURE DATE -> FETCH LIVE GAMES (REAL WORLD)
      if(resp.length===0){
        let liveRes=await fetch("https://v3.football.api-sports.io/fixtures?live=all",{headers:{"x-apisports-key":API_KEY}});
        let liveJ=await liveRes.json();
        resp=liveJ.response||[];
        // If still empty, fetch today real date
        if(resp.length===0){
          const realToday=new Date().toISOString().slice(0,10);
          let todayRes=await fetch("https://v3.football.api-sports.io/fixtures?date="+realToday,{headers:{"x-apisports-key":API_KEY}});
          let todayJ=await todayRes.json();
          resp=todayJ.response||[];
        }
      }

      const data=[];
      for(const f of resp){
        const league=f.league?.name||""; const country=f.league?.country||"WORLD";
        data.push({ 
          country:country.toUpperCase(), league:league, timestamp:f.fixture?.timestamp, 
          status:f.fixture?.status?.short||"NS", elapsed:f.fixture?.status?.elapsed||"", 
          home:f.teams?.home?.name||"", away:f.teams?.away?.name||"", 
          score:(f.goals?.home??0)+"-"+(f.goals?.away??0),
          ht:(f.score?.halftime?.home??"-")+"-"+(f.score?.halftime?.away??"-"),
          ft:(f.score?.fulltime?.home??f.goals?.home??0)+"-"+(f.score?.fulltime?.away??f.goals?.away??0),
          longStatus:f.fixture?.status?.long||"NS", rank:getTopRank(league,country)
        });
      }
      data.sort((a,b)=> a.rank!==b.rank ? a.rank-b.rank : (a.country+" - "+a.league).localeCompare(b.country+" - "+b.league));
      const txt=JSON.stringify({count:data.length,data:data});
      ctx.waitUntil(cache.put(cacheKey,new Response(txt,{headers:{"Content-Type":"application/json","Cache-Control":"max-age=30"}})));
      return new Response(txt,{headers:{...cors,"Content-Type":"application/json"}});
    }

    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND LIVESCORE</title><style>
body{margin:0;background:#000;color:#fff;font-family:Arial;font-weight:700}
header{position:sticky;top:0;background:#000;padding:10px 12px;border-bottom:2px solid #0f0;z-index:99}
.top b{color:#0f0;font-size:18px}
.dates{display:flex;gap:8px;overflow-x:auto;margin-top:10px}.dates::-webkit-scrollbar{display:none}
.d{border:1px solid #333;background:#111;color:#888;padding:8px 14px;border-radius:20px;font-size:12px;white-space:nowrap;cursor:pointer}.d.active{background:#0f0;color:#000;font-weight:900}
.filters{display:flex;gap:8px;margin-top:12px;align-items:center}.f{border:1px solid #333;background:#111;color:#888;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer}.f.active{background:#fff;color:#000;font-weight:900}
.refresh{margin-left:auto;background:#000;border:1px solid #0f0;color:#0f0;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;font-weight:900}
.country{background:#00ff00 !important;color:#000 !important;padding:11px 12px;margin-top:12px;font-size:13px;border-left:4px solid #fff !important;display:flex;justify-content:space-between;align-items:center;font-weight:900;cursor:pointer}
.league-group.hidden{display:none}
.card{background:#111;border:1px solid #222;margin:6px 8px;border-radius:10px;padding:12px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}
.card.live{border-left:4px solid #0f0;background:#0f2b0f}
.time{font-size:12px;min-width:58px;text-align:center;padding:6px 8px;border-radius:20px;font-weight:900}
.time.ns{color:#0f0 !important;background:#000 !important;border:1px solid #0f0 !important}
.time.live{color:#000 !important;background:#0f0 !important;border:1px solid #0f0 !important}
.teams{line-height:20px;font-size:14px}.mid{text-align:right;min-width:70px}.score{font-size:18px;font-weight:900}.ftbadge{color:#fff;background:#333;padding:2px 8px;border-radius:10px;font-size:11px}
#modal{position:fixed;inset:0;background:rgba(0,0,0,0.92);display:none;z-index:999;align-items:flex-end}
#modal.show{display:flex}.modal-box{background:#151515;width:100%;max-height:85vh;overflow:auto;border-radius:20px 20px 0 0;border-top:2px solid #0f0;padding:20px}
.modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}.modal-head b{color:#0f0;font-size:14px}.close{color:#fff;border:1px solid #333;background:#222;padding:6px 14px;border-radius:20px;cursor:pointer}
.teamRow{display:flex;justify-content:space-between;padding:14px 0;font-size:18px;border-bottom:1px solid #222}
.resultGrid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:20px;text-align:center}
.rBox{background:#0e0e0e;border:1px solid #333;padding:16px 6px;border-radius:14px}.rBox span{color:#888;font-size:10px;display:block;margin-bottom:6px}.rBox b{color:#0f0;font-size:22px}
</style></head><body>
<header><div class="top"><b>DIAMOND LIVESCORE</b></div><div class="dates" id="dates"></div><div class="filters"><div class="f active" id="f-all">All Games</div><div class="f" id="f-live">Live</div><div class="f" id="f-ft">Finished</div><div class="refresh" id="refreshBtn">Refresh</div></div></header>
<div id="list">Loading...</div>
<div id="modal"><div class="modal-box"><div class="modal-head"><b id="mLeague">Match</b><div class="close" id="closeModal">Close</div></div><div id="mTeams"></div><div class="resultGrid"><div class="rBox"><span>HALF TIME</span><b id="mHT">-</b></div><div class="rBox"><span>FULL TIME</span><b id="mFT">-</b></div><div class="rBox"><span>STATUS</span><b id="mST" style="font-size:11px">-</b></div></div></div></div>
<script>
let list=document.getElementById('list');let datesEl=document.getElementById('dates');
let selectedDate=new Date();let allData=[];let currentFilter='all';let cacheStore={};
function fmtDate(d){return d.toISOString().slice(0,10)}
function dayLabel(d,i){const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];if(i===0)return 'Today';return days[d.getDay()]+' '+String(d.getDate()).padStart(2,'0');}
function buildDates(){datesEl.innerHTML='';for(let i=-1;i<=1;i++){let dt=new Date();dt.setDate(dt.getDate()+i);let btn=document.createElement('div');btn.className='d'+(i===0?' active':'');btn.textContent=dayLabel(dt,i);btn.dataset.date=fmtDate(dt);btn.onclick=function(){selectedDate=dt;document.querySelectorAll('.d').forEach(x=>x.classList.remove('active'));btn.classList.add('active');load(fmtDate(dt),false);};datesEl.appendChild(btn);}}
function getTime(m){ if(m.elapsed) return m.elapsed+"'"; if(!m.timestamp) return ''; let x=new Date(m.timestamp*1000); x.setHours(x.getHours()+1); return x.toISOString().slice(11,16); }
function timeClass(m){ return m.elapsed? 'time live' : 'time ns'; }
function sc(m){ if(m.status==='NS') return '<div class="score" style="color:#555">VS</div>'; return '<div class="score">'+m.score+'</div><div class="ftbadge">'+(m.elapsed? m.elapsed+"' "+m.status : m.status)+'</div>'; }
function setFilter(t){currentFilter=t;document.querySelectorAll('.f').forEach(x=>x.classList.remove('active'));document.getElementById('f-'+t).classList.add('active');render(allData);}
document.getElementById('f-all').onclick=()=>setFilter('all');document.getElementById('f-live').onclick=()=>setFilter('live');document.getElementById('f-ft').onclick=()=>setFilter('ft');
document.getElementById('refreshBtn').onclick=()=>load(fmtDate(selectedDate), true);
document.getElementById('closeModal').onclick=()=>document.getElementById('modal').classList.remove('show');
document.getElementById('modal').onclick=(e)=>{if(e.target.id==='modal')e.currentTarget.classList.remove('show')};

async function load(d, force){
if(!d)d=fmtDate(selectedDate);
if(!force && cacheStore[d]){allData=cacheStore[d]; render(allData); return;}
list.innerHTML='<div style="text-align:center;padding:30px;color:#0f0">Loading '+d+'...</div>';
let r=await fetch('/api/matches?date='+d+(force?'&refresh=1':''));
let j=await r.json();
cacheStore[d]=j.data||[];
allData=cacheStore[d];
render(allData);
}
function render(data){
let filtered=data;
if(currentFilter==='live') filtered=data.filter(m=>m.elapsed && m.status!=='FT');
if(currentFilter==='ft') filtered=data.filter(m=>m.status==='FT');
if(currentFilter==='all') filtered=data; // SHOW ALL

if(!filtered.length){
list.innerHTML='<div style="text-align:center;padding:40px;color:#666">No '+currentFilter+' matches for this date<br><button onclick="load(fmtDate(selectedDate),true)" style="margin-top:10px;background:#0f0;color:#000;padding:8px 16px;border-radius:20px;border:none;font-weight:900">Tap Refresh</button></div>';return;
}
let h='';let lastKey='';let gid=0;
for(let m of filtered){
let key=m.country+' - '+m.league;
if(key!==lastKey){
if(lastKey!=='') h+='</div>';
gid++; h+='<div class="country" data-group="'+gid+'"><span>'+key+'</span><span>▼</span></div><div class="league-group" id="group-'+gid+'">';
lastKey=key;
}
let realIdx=allData.indexOf(m);
let cls=m.elapsed? 'card live' : 'card';
h+='<div class="'+cls+'" data-i="'+realIdx+'"><div class="left"><div class="'+timeClass(m)+'">'+getTime(m)+'</div><div class="teams"><div>'+m.home+'</div><div>'+m.away+'</div></div></div><div class="mid">'+sc(m)+'</div></div>';
}
if(lastKey!=='') h+='</div>';
list.innerHTML=h;
document.querySelectorAll('.country').forEach(el=>{el.onclick=()=>{document.getElementById('group-'+el.dataset.group).classList.toggle('hidden')}});
document.querySelectorAll('.card').forEach(el=>{el.onclick=()=>openMatch(parseInt(el.dataset.i))});
}
function openMatch(i){
let m=allData[i];if(!m)return;
document.getElementById('mLeague').textContent=m.country+' - '+m.league;
let s=m.score.split('-');
document.getElementById('mTeams').innerHTML='<div class="teamRow"><span>'+m.home+'</span><b>'+s[0]+'</b></div><div class="teamRow"><span>'+m.away+'</span><b>'+s[1]+'</b></div>';
document.getElementById('mHT').textContent=m.ht;
document.getElementById('mFT').textContent=m.ft;
document.getElementById('mST').textContent=m.longStatus + (m.elapsed? ' - '+m.elapsed+"'":'');
document.getElementById('modal').classList.add('show');
}
buildDates();load(fmtDate(selectedDate), false);
setInterval(()=>{let d=fmtDate(selectedDate); fetch('/api/matches?date='+d+'&refresh=1').then(r=>r.json()).then(j=>{cacheStore[d]=j.data||[]; if(fmtDate(selectedDate)===d){allData=cacheStore[d]; render(allData);}})},30000);
</script></body></html>`;
    return new Response(html, { headers:{...cors,"Content-Type":"text/html"}});
  }
}
