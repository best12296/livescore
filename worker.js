export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    if (path === "/api/matches") {
      const dateParam = url.searchParams.get("date") || "";
      const API_KEY = env.FOOTBALL_API_KEY || "088f79cadddb9cebccc50b31fc30ff16545878cde9bac042269d8a9bc6b16736";
      let data = [];
      let debug = "";
      try {
        // ALWAYS get ALL matches - your API returns grouped leagues
        const r = await fetch("https://www.live-football-api.com/api/v1/matches?api_key=" + API_KEY);
        const j = await r.json();
        debug = "credits:" + (j.credits_remaining || "?") + " success:" + j.success;
        let raw = [];
        if (j.data) {
          if (Array.isArray(j.data)) raw = j.data;
          else {
            for (let k in j.data) {
              if (Array.isArray(j.data[k])) {
                // keep league name
                j.data[k].forEach(m => { m._leagueKey = k; });
                raw = raw.concat(j.data[k]);
              }
            }
          }
        }
        data = raw.map(m => ({
          id: String(m.id || m.match_id || Math.random()),
          country: (m.country || m.country_name || "World") + "",
          league: (m.league_name || m.league || m.competition || m._leagueKey || "Live") + "",
          home: (m.home_team || m.home || "Home") + "",
          away: (m.away_team || m.away || "Away") + "",
          time: (m.time || m.kickoff || m.start_time || "15:00") + "",
          status: (m.status || m.match_status || "Live") + "",
          minute: (m.minute || "") + "",
          home_score: m.home_score ?? m.home_goals ?? 0,
          away_score: m.away_score ?? m.away_goals ?? 0,
          ht: (m.ht_score || m.halftime || "0-0") + "",
          ft: (m.home_score + "-" + m.away_score),
        }));
      } catch (e) { debug = e.message; }
      return new Response(JSON.stringify({success:true, debug, count:data.length, data}), {headers:{"Content-Type":"application/json", ...cors}});
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Diamond LiveScore</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#050a05;color:#fff;font-family:system-ui;padding-bottom:20px}
.header{background:#0a1a0a;border-bottom:3px solid #00c853;padding:14px;display:flex;justify-content:space-between;align-items:center}
.header b{color:#00ff88}
.badge{border:1px solid #00c853;color:#00ff88;padding:4px 10px;border-radius:20px;font-size:11px}
.dates{display:flex;gap:8px;overflow-x:auto;padding:10px;background:#091209}
.date-tab{min-width:68px;background:#132013;border:1px solid #234723;border-radius:12px;padding:8px;text-align:center;cursor:pointer;flex-shrink:0}
.date-tab.active{background:#00c853;color:#000;font-weight:900}
.league-head{background:#0f2010;color:#8fdb8f;padding:7px 12px;font-size:11px;font-weight:800;border-left:4px solid #00c853;margin-top:12px}
.match{background:#101c10;border:1px solid #1d3a1d;border-radius:14px;margin:6px 10px;padding:12px;display:flex;gap:10px;align-items:center;cursor:pointer}
.match.live{border-left:4px solid #00ff88}
.time{width:55px;text-align:center;font-size:11px;color:#8fd48f}
.time b{display:block;color:#00ff88;font-size:14px}
.teams{flex:1}
.team-row{display:flex;justify-content:space-between;padding:2px 0}
.score{color:#00ff88;font-weight:900}
.status{font-size:11px;min-width:60px;text-align:right}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.9);display:none;align-items:center;justify-content:center;z-index:99;padding:15px}
.modal-bg.open{display:flex}
.modal{background:#0f2410;border:2px solid #00c853;border-radius:18px;width:100%;max-width:380px;padding:18px}
.row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #1d3a1d;font-size:14px}
.close{background:#00c853;color:#000;border:none;width:100%;padding:12px;border-radius:10px;font-weight:900;margin-top:10px}
</style>
</head>
<body>
<div class="header"><b>💎 DIAMOND LIVESCORE</b><span id="src" class="badge">LIVE</span></div>
<div class="dates" id="dates"></div>
<div id="list" style="padding:20px;text-align:center;color:#7fdb7f">Loading...</div>
<div class="modal-bg" id="modalBg"><div class="modal" id="modal"></div></div>
<script>
var datesEl = document.getElementById('dates');
var listEl = document.getElementById('list');
var modalBg = document.getElementById('modalBg');
var modal = document.getElementById('modal');
var allData = [];
var todayISO = new Date().toISOString().slice(0,10);

function buildDates(){
  var html = '';
  for(var i=-3;i<=4;i++){
    var d = new Date(); d.setDate(d.getDate()+i);
    var iso = d.toISOString().slice(0,10);
    var label = i==0?'TODAY':i==-1?'YEST':i==1?'TOM':d.toLocaleDateString('en',{weekday:'short'});
    var num = d.getDate()+' '+d.toLocaleDateString('en',{month:'short'});
    var active = i==0?' active':'';
    html += '<div class="date-tab'+active+'" onclick="loadMatches(\\''+iso+'\\',this)">'+'<small>'+label+'</small><br><b>'+num+'</b></div>';
  }
  datesEl.innerHTML = html;
}

async function loadMatches(iso, el){
  if(el){
    var tabs = document.querySelectorAll('.date-tab');
    tabs.forEach(t=>t.classList.remove('active'));
    el.classList.add('active');
  }
  listEl.innerHTML = 'Loading '+iso+'...';
  try{
    var r = await fetch('/api/matches?date='+iso);
    var j = await r.json();
    allData = j.data;
    document.getElementById('src').innerText = j.count+' matches | '+j.debug;
    if(!j.data || j.data.length==0){
      listEl.innerHTML = '<div style="padding:30px">No matches<br><small>'+j.debug+'</small></div>';
      return;
    }
    var groups = {};
    j.data.forEach(function(m){
      var key = (m.country+' - '+m.league).toUpperCase();
      if(!groups[key]) groups[key]=[];
      groups[key].push(m);
    });
    var out = '';
    for(var league in groups){
      out += '<div class="league-head">🌍 '+league+'</div>';
      groups[league].forEach(function(m){
        var isLive = (m.status+'').toLowerCase().indexOf('live')>-1 || m.minute;
        var t = (m.time+'').substring(11,16);
        if(!t || t.length<3) t = (m.time+'').substring(0,5) || 'FT';
        out += '<div class="match '+(isLive?'live':'')+'" onclick="openM(\\''+m.id+'\\')">'
          +'<div class="time"><b>'+t+'</b><br>'+m.status+'</div>'
          +'<div class="teams"><div class="team-row"><span>'+m.home+'</span><span class="score">'+m.home_score+'</span></div><div class="team-row"><span>'+m.away+'</span><span class="score">'+m.away_score+'</span></div></div>'
          +'<div class="status">'+(m.minute?m.minute+"'":'')+'<br><small>HT:'+m.ht+'</small></div></div>';
      });
    }
    listEl.innerHTML = out;
  }catch(e){
    listEl.innerHTML = 'Error: '+e.message;
  }
}

function openM(id){
  var m = null;
  for(var i=0;i<allData.length;i++) if(allData[i].id==id){m=allData[i];break;}
  if(!m) return;
  modal.innerHTML = '<h3 style="color:#00ff88;text-align:center">'+m.country+' • '+m.league+'</h3>'
    +'<div style="text-align:center;padding:10px;font-weight:900;font-size:18px">'+m.home+' '+m.home_score+' - '+m.away_score+' '+m.away+'</div>'
    +'<div class="row"><span>Time (Left)</span><b>'+m.time+'</b></div>'
    +'<div class="row"><span>Status</span><b style="color:#00ff88">'+m.status+' '+m.minute+'</b></div>'
    +'<div class="row"><span>Half Time</span><b>'+m.ht+'</b></div>'
    +'<div class="row"><span>Full Time</span><b>'+m.ft+'</b></div>'
    +'<div class="row"><span>Correct HT</span><b>'+m.ht+'</b></div>'
    +'<div class="row"><span>Correct FT</span><b>'+m.ft+'</b></div>'
    +'<button class="close" onclick="closeM()">CLOSE</button>';
  modalBg.classList.add('open');
}
function closeM(){modalBg.classList.remove('open');}
modalBg.addEventListener('click',function(e){if(e.target==modalBg)closeM();});

buildDates();
loadMatches(todayISO);
setInterval(function(){loadMatches(todayISO);},30000);
</script>
</body>
</html>
`;
    return new Response(html, {headers:{"Content-Type":"text/html", ...cors}});
  }
}
