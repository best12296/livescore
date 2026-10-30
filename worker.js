addEventListener('fetch', event => { event.respondWith(handle(event.request)) })
const BASE = "https://sports.highlightly.net";
const MY_KEY = "c0ea652f-f82d-4f43-b648-573b736a72a6";
async function handle(req){
const url=new URL(req.url);
if(url.pathname.startsWith("/api/")){
const sport=url.searchParams.get("sport")||"football";
const date=url.searchParams.get("date")||new Date().toISOString().split('T')[0];
const id=url.searchParams.get("id")||"";
const path=sport==="football"?"football":sport;
let apiUrl="";
if(url.pathname==="/api/matches") apiUrl=BASE+"/"+path+"/matches?date="+date;
if(url.pathname==="/api/details") apiUrl=BASE+"/"+path+"/matches/"+id;
if(url.pathname==="/api/standings") apiUrl=BASE+"/"+path+"/standings?leagueId="+id+"&season=2026";
try{
let r=await fetch(apiUrl,{headers:{"x-rapidapi-key":MY_KEY}});
return new Response(await r.text(),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
}catch(e){return new Response(JSON.stringify({data:[]}),{headers:{"Content-Type":"application/json"}});}
}
// RETURN HTML - TODAY WORKING BACK
return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>V16 TODAY</title><style>body{margin:0;background:#000;color:#fff;font-family:Arial}.top{background:#00ff66;color:#000;padding:12px;text-align:center;font-weight:900}.bet{padding:10px}.bet a{background:#00ff66;color:#000;padding:12px;border-radius:10px;display:flex;justify-content:center;text-decoration:none;font-weight:900}.match{padding:12px;border-bottom:1px solid #222;display:flex;justify-content:space-between}.loading{padding:20px;text-align:center;color:#00ff66}</style></head><body><div class="top">DIAMOND V16 TODAY WORKING BACK</div><div class="bet"><a href="https://reffpa.com/L?tag=d_6266277m_97c_Livescore&site=6266277&ad=97" target="_blank">1XBET BET NOW 300% BONUS</a></div><div id="c" class="loading">TODAY WORKING - Loading...</div><script>
async function load(){ 
let d=new Date(); d.setDate(d.getDate()-1); 
let iso=d.toISOString().split('T')[0];
let r=await fetch('/api/matches?sport=football&date='+iso);
let j=await r.json(); let m=j.data||j.matches||[];
if(m.length==0){ document.getElementById('c').innerHTML='No games for '+iso+' - API Key active - Try NBA'; return; }
let h=''; m.slice(0,30).forEach(x=>{ h+='<div class=match><span>'+(x.homeTeam&&x.homeTeam.name||'Home')+' vs '+(x.awayTeam&&x.awayTeam.name||'Away')+'</span><span style=color:#00ff66>'+(x.state&&x.state.score&&x.state.score.current||'VS')+'</span></div>'; });
document.getElementById('c').innerHTML=h;
}
load();
<\/script></body></html>`,{headers:{"Content-Type":"text/html"}});
}
