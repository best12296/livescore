export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    const getName = (v) => {
      if (!v) return "";
      if (typeof v === 'string') return v;
      if (typeof v === 'object') return v.name || v.displayName || v.team_name || v.shortName || v.country || "";
      return String(v);
    };

    if (path === "/api/matches") {
      const dateParam = url.searchParams.get("date") || "today";
      let d = new Date();
      if (dateParam === "yesterday") d.setDate(d.getDate()-1);
      else if (dateParam === "tomorrow") d.setDate(d.getDate()+1);
      else if (/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) d = new Date(dateParam);
      else if (/^-?\d+$/.test(dateParam)) d.setDate(d.getDate()+parseInt(dateParam));
      const dateStr = d.toISOString().slice(0,10);
      
      const API_KEY = env.FOOTBALL_API_KEY || "088f79cadddb9cebccc50b31fc30ff16545878cde9bac042269d8a9bc6b16736";
      let data = [];
      let debug = "";

      try {
        const apiUrl = `https://www.live-football-api.com/api/v1/matches?api_key=${API_KEY}&date=${dateStr}`;
        const apiUrl2 = `https://www.live-football-api.com/api/v1/matches?api_key=${API_KEY}`;
        let j;
        let r = await fetch(apiUrl);
        j = await r.json();
        debug = `date:${dateStr} credits:${j.credits_remaining}`;
        
        let raw = [];
        if (j.data) {
          if (Array.isArray(j.data)) raw = j.data;
          else for (let k in j.data) if (Array.isArray(j.data[k])) raw.push(...j.data[k]);
        }
        // if empty for specific date, get all and filter client will show all
        if (raw.length === 0) {
          r = await fetch(apiUrl2);
          j = await r.json();
          debug += ` | all:${j.credits_remaining}`;
          if (j.data) {
            if (Array.isArray(j.data)) raw = j.data;
            else for (let k in j.data) if (Array.isArray(j.data[k])) raw.push(...j.data[k]);
          }
        }

        data = raw.map(m => ({
          id: m.id || m.match_id || Math.random().toString(36).slice(2),
          country: getName(m.country || m.country_name || m.area) || "World",
          league: getName(m.league || m.competition || m.league_name) || m.league_name || "Live",
          home: getName(m.home_team || m.home || m.homeTeam),
          away: getName(m.away_team || m.away || m.awayTeam),
          time: m.time || m.kickoff_time || m.start_time || m.date || "15:00",
          status: getName(m.status || m.match_status) || m.status || "Scheduled",
          minute: (m.minute || m.timer || "").toString(),
          home_score: m.home_score ?? m.scores?.home ?? m.score?.home ?? 0,
          away_score: m.away_score ?? m.scores?.away ?? m.score?.away ?? 0,
          ht: typeof m.ht_score === 'object' ? `${m.ht_score.home??0}-${m.ht_score.away??0}` : (m.ht_score || m.halftime || m.score?.halftime || "0-0"),
          ft: typeof m.ft_score === 'object' ? `${m.ft_score.home??0}-${m.ft_score.away??0}` : (m.ft_score || `${m.home_score??0}-${m.away_score??0}`),
          raw: m
        }));

      } catch(e){ debug = e.message; }

      return new Response(JSON.stringify({success:true, date:dateStr, source:"live-football-api", debug, count:data.length, data}), {
        headers: {"Content-Type":"application/json", ...cors}
      });
    }

    // GREEN & BLACK PRO UI
    return new Response(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<title>Diamond LiveScore</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#080a08;color:#e8ffe8;font-family:-apple-system,system-ui,Segoe UI,Roboto,sans-serif}
.header{background:#0f1a0f;border-bottom:2px solid #00c853;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:10}
.header b{color:#00ff88;font-size:18px;letter-spacing:0.5px}
.badge{background:#132813;border:1px solid #00c853;color:#00ff88;font-size:10px;padding:5px 10px;border-radius:20px}
.dates{display:flex;gap:8px;overflow-x:auto;padding:12px 12px;background:#0c140c;border-bottom:1px solid #1a2f1a;scrollbar-width:none}
.dates::-webkit-scrollbar{display:none}
.date-tab{min-width:68px;background:#141f14;border:1px solid #1f331f;border-radius:12px;padding:8px 6px;text-align:center;cursor:pointer;flex-shrink:0}
.date-tab.active{background:#00c853;border-color:#00c853;color:#000;font-weight:800}
.date-tab small{display:block;font-size:10px;opacity:0.8}
.date-tab b{font-size:13px}
.league-head{background:#101a10;color:#7fdb7f;padding:8px 14px;font-size:12px;font-weight:700;border-left:4px solid #00c853;margin-top:10px;text-transform:uppercase;letter-spacing:0.6px}
.match{background:#121a12;border:1px solid #1c2e1c;border-radius:14px;margin:6px 10px;padding:12px;display:flex;align-items:center;gap:10px;cursor:pointer;transition:0.15s}
.match:active{transform:scale(0.98);background:#182a18}
.match.live{border-left:4px solid #00ff88;box-shadow:0 0 12px rgba(0,255,136,0.15)}
.time{width:48px;text-align:center;font-size:11px;color:#9be69b;line-height:1.2}
.time b{display:block;color:#00ff88;font-size:13px}
.teams{flex:1}
.team-row{display:flex;justify-content:space-between;align-items:center;padding:2px 0}
.team-name{font-size:14px;font-weight:600}
.score{font-weight:800;font-size:15px;color:#00ff88;min-width:24px;text-align:center}
.status{font-size:11px;text-align:right;min-width:70px}
.status.live{color:#00ff88;font-weight:800;animation:pulse 1.2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.85);display:none;align-items:center;justify-content:center;z-index:100;padding:16px}
.modal-bg.open{display:flex}
.modal{background:#0f1f0f;border:2px solid #00c853;border-radius:18px;width:100%;max-width:380px;padding:18px;box-shadow:0 0 30px rgba(0,200,83,0.3)}
.modal h3{color:#00ff88;margin-bottom:8px;text-align:center}
.modal .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #1a331a;font-size:14px}
.modal .close{background:#00c853;color:#000;border:none;width:100%;padding:12px;border-radius:10px;font-weight:800;margin-top:14px;cursor:pointer}
.live-dot{width:8px;height:8px;background:#00ff88;border-radius:50%;display:inline-block;margin-right:4px;animation:pulse 1s infinite}
</style>
</head><body>
<div class="header"><b>💎 DIAMOND LIVESCORE</b><span id="src" class="badge">LIVE API • 500</span></div>
<div class="dates" id="dates"></div>
<div id="list"></div>

<div class="modal-bg" id="modalBg" onclick="if(event.target===this)closeModal()">
<div class="modal" id="modal"></div>
</div>

<script>
const datesEl = document.getElementById('dates');
const listEl = document.getElementById('list');
let currentOffset = 0;
let allData = [];

// Build 3 back + today + 4 front = 8 days
function buildDates(){
  const container = [];
  for(let i=-3;i<=4;i++){
    let d=new Date(); d.setDate(d.getDate()+i);
    const iso=d.toISOString().slice(0,10);
    const dayName = i===0?'TODAY': i===-1?'YEST': i===1?'TOM': d.toLocaleDateString('en',{weekday:'short'}).toUpperCase();
    const dateNum = d.toLocaleDateString('en',{month:'short', day:'numeric'});
    container.push({offset:i, iso, dayName, dateNum});
  }
  datesEl.innerHTML = container.map(c=>\`<div class="date-tab \${c.offset===0?'active':''}" data-off="\${c.offset}" data-iso="\${c.iso}" onclick="selectDate(\${c.offset},'\${c.iso}')"><small>\${c.dayName}</small><b>\${c.dateNum}</b></div>\`).join('');
}
buildDates();

function selectDate(off, iso){
  currentOffset = off;
  document.querySelectorAll('.date-tab').forEach(t=>t.classList.remove('active'));
  document.querySelector(\`.date-tab[data-off="\${off}"]\`).classList.add('active');
  load(iso);
}

async function load(isoDate){
  listEl.innerHTML = '<div style="padding:30px;text-align:center;color:#7fdb7f">⏳ Loading LIVE...</div>';
  try{
    const r = await fetch('/api/matches?date='+isoDate);
    const j = await r.json();
    allData = j.data;
    document.getElementById('src').innerText = \`LIVE • \${j.count} • \${j.debug}\`;
    
    if(!j.data.length){
      listEl.innerHTML = '<div style="padding:30px;text-align:center">No matches<br><small>'+j.debug+'</small></div>';
      return;
    }
    // Group by country + league
    const groups = {};
    j.data.forEach(m=>{
      const key = (m.country+' - '+m.league).toUpperCase();
      if(!groups[key]) groups[key]=[];
      groups[key].push(m);
    });
    
    let html='';
    for(let league in groups){
      html+=\`<div class="league-head">🌍 \${league}</div>\`;
      groups[league].forEach(m=>{
        const isLive = m.status.toLowerCase().includes('live') || m.status.toLowerCase().includes('half') || m.minute;
        const timeOnly = (m.time||'').toString().slice(11,16) || (m.time||'').toString().slice(0,5) || 'FT';
        html+=\`<div class="match \${isLive?'live':''}" onclick="openModal('\${m.id}')">
          <div class="time"><b>\${timeOnly}</b>\${isLive?'<span class="live"><span class="live-dot"></span>LIVE</span>':m.status}</div>
          <div class="teams">
            <div class="team-row"><span class="team-name">\${m.home}</span><span class="score">\${m.home_score}</span></div>
            <div class="team-row"><span class="team-name">\${m.away}</span><span class="score">\${m.away_score}</span></div>
          </div>
          <div class="status \${isLive?'live':''}">\${m.minute?m.minute+'\'':''}<br><small>HT:\${m.ht}</small></div>
        </div>\`;
      });
    }
    listEl.innerHTML = html;
  }catch(e){
    listEl.innerHTML = 'Error: '+e.message;
  }
}

function openModal(id){
  const m = allData.find(x=>x.id==id);
  if(!m) return;
  document.getElementById('modal').innerHTML = \`
    <h3>\${m.country} • \${m.league}</h3>
    <div style="text-align:center;padding:10px 0;font-size:18px;font-weight:800">\${m.home} \${m.home_score} - \${m.away_score} \${m.away}</div>
    <div class="row"><span>Status</span><b style="color:#00ff88">\${m.status} \${m.minute?m.minute+"'":''}</b></div>
    <div class="row"><span>Kickoff Time</span><b>\${m.time}</b></div>
    <div class="row"><span>Half Time</span><b>\${m.ht}</b></div>
    <div class="row"><span>Full Time</span><b>\${m.ft}</b></div>
    <div class="row"><span>Correct Score HT</span><b>\${m.ht}</b></div>
    <div class="row"><span>Correct Score FT</span><b>\${m.ft}</b></div>
    <button class="close" onclick="closeModal()">CLOSE</button>
  \`;
  document.getElementById('modalBg').classList.add('open');
}
function closeModal(){ document.getElementById('modalBg').classList.remove('open'); }

// Initial load today
const todayIso = new Date().toISOString().slice(0,10);
load(todayIso);
// Auto refresh live every 30s
setInterval(()=>{ const iso = document.querySelector('.date-tab.active')?.dataset.iso || todayIso; load(iso); }, 30000);
</script>
</body></html>`, { headers: {"Content-Type":"text/html", ...cors}});
  }
}
