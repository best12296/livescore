export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "*" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const KEYS = [env.API_FOOTBALL_KEY, env.API_FOOTBALL_KEY2].filter(Boolean);

    function isYouth(league){ const x=league.toLowerCase(); return x.includes("u18")||x.includes("u19")||x.includes("u20")||x.includes("u21")||x.includes("u23")||x.includes("women")||x.includes("youth")||x.includes("reserve")||x.includes("academy"); }
    function getPriority(leagueName, countryName){
      const l=(leagueName||"").toLowerCase().trim(); const c=(countryName||"").toLowerCase().trim();
      if(isYouth(leagueName)) return { rank:999, displayCountry:null };
      if(l==="uefa champions league") return { rank:1, displayCountry:"EUROPE" };
      if(l==="uefa europa league") return { rank:2, displayCountry:"EUROPE" };
      if(l==="premier league" && c==="england") return { rank:10, displayCountry:"ENGLAND" };
      if((l==="la liga"||l==="laliga") && c==="spain") return { rank:11, displayCountry:"SPAIN" };
      if(l==="ligue 1" && c==="france") return { rank:12, displayCountry:"FRANCE" };
      if(l==="bundesliga" && c==="germany") return { rank:13, displayCountry:"GERMANY" };
      if(l==="serie a" && c==="italy") return { rank:14, displayCountry:"ITALY" };
      if(l==="eredivisie" && c==="netherlands") return { rank:15, displayCountry:"NETHERLANDS" };
      if(l==="championship" && c==="england") return { rank:16, displayCountry:"ENGLAND" };
      return { rank:999, displayCountry:null };
    }

    if(url.pathname==="/api/matches"){
      const date=url.searchParams.get("date")||new Date().toISOString().slice(0,10); 
      const force=url.searchParams.get("refresh")==="1";
      const cacheKey=new Request("https://cache.local/v9-WORKING-"+date); 
      const cache=caches.default;
      if(!force){ const cached=await cache.match(cacheKey); if(cached) return new Response(await cached.text(), { headers:{...cors,"Content-Type":"application/json"}}); }
      let finalData=null;
      for(const KEY of KEYS){
        try{
          const apiRes=await fetch("https://v3.football.api-sports.io/fixtures?date="+date,{headers:{"x-apisports-key":KEY}});
          const j=await apiRes.json(); 
          if(j.errors&&Object.keys(j.errors).length>0){ if(JSON.stringify(j.errors).toLowerCase().includes("limit")) continue; }
          const data=[];
          for(const f of (j.response||[])){
            const league=f.league?.name||""; const country=f.league?.country||"WORLD"; const p=getPriority(league,country); const short=f.fixture?.status?.short||"NS";
            data.push({ country:(p.displayCountry||country).toUpperCase(), league:league, timestamp:f.fixture?.timestamp, status:short, elapsed:f.fixture?.status?.elapsed||"", home:f.teams?.home?.name||"", away:f.teams?.away?.name||"", score:(f.goals?.home??0)+"-"+(f.goals?.away??0), ht:(f.score?.halftime?.home??"-")+"-"+(f.score?.halftime?.away??"-"), ft:(f.score?.fulltime?.home??f.goals?.home??0)+"-"+(f.score?.fulltime?.away??f.goals?.away??0), longStatus:f.fixture?.status?.long||short, rank:p.rank });
          }
          data.sort((a,b)=>{ if(a.rank!==b.rank) return a.rank-b.rank; if(a.country!==b.country) return a.country.localeCompare(b.country); return a.league.localeCompare(b.league); });
          finalData={count:data.length,data:data}; break;
        }catch(e){}
      }
      if(!finalData) return new Response(JSON.stringify({count:0,data:[]}), { headers:{...cors,"Content-Type":"application/json"}});
      const txt=JSON.stringify(finalData); 
      ctx.waitUntil(cache.put(cacheKey,new Response(txt,{headers:{"Content-Type":"application/json","Cache-Control":"max-age=3600"}})));
      return new Response(txt,{headers:{...cors,"Content-Type":"application/json"}});
    }

    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND LIVESCORE</title><style>
body{margin:0;background:#000;color:#fff;font-family:Arial;font-weight:700}
header{position:sticky;top:0;background:#000;padding:10px 12px;border-bottom:2px solid #0f0;z-index:99}
.top b{color:#0f0;font-size:18px}.dates{display:flex;gap:8px;overflow-x:auto;margin-top:10px}.dates::-webkit-scrollbar{display:none}
.d{border:1px solid #333;background:#111;color:#888;padding:8px 14px;border-radius:20px;font-size:12px;white-space:nowrap;cursor:pointer}.d.active{background:#0f0;color:#000;font-weight:900}
.filters{display:flex;gap:8px;margin-top:12px;align-items:center}.f{border:1px solid #333;background:#111;color:#888;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer}.f.active{background:#fff;color:#000;font-weight:900}
.refresh{margin-left:auto;background:#111;border:1px solid #0f0;color:#0f0;padding:6px 12px;border-radius:20px;font-size:12px;cursor:pointer}
.country{background:#00ff00 !important;color:#000 !important;padding:11px 12px;margin-top:12px;font-size:13px;border-left:4px solid #fff !important;display:flex;justify-content:space-between;font-weight:900}
.card{background:#111;border:1px solid #222;margin:6px 8px;border-radius:10px;padding:12px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}
.card.live{border-left:3px solid #0f0;background:#0f0f0f}.card.ft{border-left:3px solid #444}
.left{display:flex;gap:10px;align-items:center}.time{color:#0f0;font-size:12px;min-width:45px;text-align:center;background:#0f0f0f;border:1px solid #0f0;padding:4px 6px;border-radius:6px}.time.ns{color:#888;background:#111;border-color:#333}
.teams{line-height:20px;font-size:14px}.mid{text-align:right;min-width:70px}.score{font-size:18px;font-weight:900}.ftbadge{color:#fff;background:#333;padding:2px 8px;border-radius:10px;font-size:11px}
#modal{position:fixed;inset:0;background:rgba(0,0,0,0.88);display:none;z-index:999;align-items:flex-end}
#modal.show{display:flex}.modal-box{background:#151515;width:100%;border-radius:20px 20px 0 0;border-top:2px solid #0f0;padding:20px}
.modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.modal-head b{color:#0f0;font-size:14px}.close{color:#fff;border:1px solid #333;background:#222;padding:6px 14px;border-radius:20px;cursor:pointer}
.teamRow{display:flex;justify-content:space-between;padding:12px 0;font-size:18px;border-bottom:1px solid #222}
.resultGrid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:18px;text-align:center}.rBox{background:#0e0e0e;border:1px solid #333;padding:14px 6px;border-radius:14px}.rBox span{color:#888;font-size:10px;display:block;margin-bottom:6px}.rBox b{color:#0f0;font-size:20px}
</style></head><body>
<header><div class="top"><b>DIAMOND LIVESCORE</b></div><div class="dates" id="dates"></div><div class="filters"><div class="f active" id="f-all">All Games</div><div class="f" id="f-live">Live</div><div class="f" id="f-ft">Finished</div><div class="refresh" id="refreshBtn">Refresh</div></div></header>
<div id="list">Loading...</div>
<div id="modal"><div class="modal-box"><div class="modal-head"><b id="mLeague">Match</b><div class="close" id="closeBtn">Close</div></div><div id="mTeams"></div><div class="resultGrid"><div class="rBox"><span>HALF TIME</span><b id="mHT">-</b></div><div class="rBox"><span>FULL TIME</span><b id="mFT">-</b></div><div class="rBox"><span>STATUS</span><b id="mST" style="font-size:11px">-</b></div></div><div style="margin-top:14px;color:#666;font-size:12px;text-align:center" id="mInfo"></div></div></div>
<script>
const list=document.getElementById('list');const datesEl=document.getElementById('dates');let selectedDate=new Date();let allData=[];let currentFilter='all';
function fmtDate(d){return d.toISOString().slice(0,10)}function dayLabel(d,i){const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];if(i===0)return 'Today';return days[d.getDay()]+' '+String(d.getDate()).padStart(2,'0');}
function buildDates(){datesEl.innerHTML='';for(let i=-2;i<=2;i++){let dt=new Date();dt.setDate(dt.getDate()+i);let btn=document.createElement('div');btn.className='d'+(i===0?' active':'');btn.textContent=dayLabel(dt,i);btn.onclick=function(){selectedDate=dt;document.querySelectorAll('.d').forEach(function(x){x.classList.remove('active')});btn.classList.add('active');load(fmtDate(dt),true);};datesEl.appendChild(btn);}}
function getTime(ts){if(!ts)return '';let x=new Date(ts*1000);x.setHours(x.getHours()+1);return x.toISOString().slice(11,16);}
function sc(m){if(m.status==='NS')return '';return '<div class="score">'+m.score+'</div><div class="ftbadge">'+m.status+'</div>';}
function setFilter(t){currentFilter=t;document.querySelectorAll('.f').forEach(function(x){x.classList.remove('active')});document.getElementById('f-'+t).classList.add('active');render(allData);}
document.getElementById('f-all').onclick=function(){setFilter('all')};document.getElementById('f-live').onclick=function(){setFilter('live')};document.getElementById('f-ft').onclick=function(){setFilter('ft')};document.getElementById('refreshBtn').onclick=function(){load(fmtDate(selectedDate), true)};document.getElementById('closeBtn').onclick=function(){document.getElementById('modal').classList.remove('show')};document.getElementById('modal').onclick=function(e){if(e.target.id==='modal')e.currentTarget.classList.remove('show')};
async function load(d, force){if(!d)d=fmtDate(selectedDate);list.innerHTML='<div style="text-align:center;padding:30px;color:#0f0">Loading '+d+'...</div>';let url='/api/matches?date='+d+(force?'&refresh=1':'');let r=await fetch(url);let j=await r.json();allData=j.data||[];render(allData);}
function render(data){
let filtered=data;if(currentFilter==='live')filtered=data.filter(function(m){return m.elapsed!=='' && m.status!=='FT'});if(currentFilter==='ft')filtered=data.filter(function(m){return m.status==='FT'});if(!filtered.length){list.innerHTML='<div style="text-align:center;padding:40px;color:#666">No '+currentFilter+' matches for today. Try other date or press Refresh.</div>';return}
let h='';let lc='';let ll='';
for(let idx=0;idx<filtered.length;idx++){
let m=filtered[idx];
if(m.country!==lc || m.league!==ll){
h+='<div class="country top" style="background:#00ff00 !important;color:#000 !important;border-left:4px solid #fff !important;display:flex;justify-content:space-between;font-weight:900;padding:11px 12px;margin-top:12px;font-size:13px;"><span>'+m.country+' - '+m.league+'</span><span>'+(m.rank<100?'★':'')+'</span></div>';
lc=m.country;ll=m.league;
}
let cls=m.status==='FT'?'card ft':(m.elapsed!==''?'card live':'card');let timeClass=m.status==='NS'?'time ns':'time';let realIdx=allData.indexOf(m);
h+='<div class="'+cls+'" data-i="'+realIdx+'"><div class="left"><div class="'+timeClass+'">'+getTime(m.timestamp)+'</div><div class="teams"><div>'+m.home+'</div><div>'+m.away+'</div></div></div><div class="mid">'+sc(m)+'</div></div>';
}
list.innerHTML=h;document.querySelectorAll('.card').forEach(function(el){el.onclick=function(){openMatch(parseInt(el.getAttribute('data-i')))}});
}
function openMatch(i){let m=allData[i];if(!m)return;document.getElementById('mLeague').textContent=m.country+' - '+m.league;let s=m.score.split('-');document.getElementById('mTeams').innerHTML='<div class="teamRow"><span>'+m.home+'</span><b>'+s[0]+'</b></div><div class="teamRow"><span>'+m.away+'</span><b>'+s[1]+'</b></div>';document.getElementById('mHT').textContent=m.ht;document.getElementById('mFT').textContent=m.ft;document.getElementById('mST').textContent=m.longStatus;document.getElementById('mInfo').textContent=m.longStatus;document.getElementById('modal').classList.add('show');}
buildDates();load(fmtDate(selectedDate), true);
</script></body></html>`;
    return new Response(html, { headers:{...cors,"Content-Type":"text/html"}});
  }
}
