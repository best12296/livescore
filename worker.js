function parseHTFT(m, box, events){
  var ht=null, ft=null, secondHalf=null;
  try{
    var bd = box.data||box||{};
    // 1. Try from box-score API real data
    if(bd.homeScore && bd.awayScore){
      if(bd.homeScore.firstHalf!=null && bd.awayScore.firstHalf!=null){
        ht = bd.homeScore.firstHalf+' - '+bd.awayScore.firstHalf;
      }
      if(bd.homeScore.secondHalf!=null){
        secondHalf = bd.homeScore.secondHalf+' - '+bd.awayScore.secondHalf;
      }
      if(bd.homeScore.current!=null){
        ft = bd.homeScore.current+' - '+bd.awayScore.current;
      }
    }
    // Try periods array
    if(!ht && bd.periods && bd.periods.length>=1){
      var p1 = bd.periods[0];
      if(p1.home!=null) ht = p1.home+' - '+p1.away;
      if(bd.periods.length>=2){
        var p2 = bd.periods[1];
        if(p2.home!=null) secondHalf = p2.home+' - '+p2.away;
        if(ht && secondHalf){
          var h1=parseInt(p1.home)||0, a1=parseInt(p1.away)||0, h2=parseInt(p2.home)||0, a2=parseInt(p2.away)||0;
          ft = (h1+h2)+' - '+(a1+a2);
        }
      }
    }
    // Try m.state.score
    if(!ft && m.state && m.state.score && m.state.score.current){
      ft = m.state.score.current;
      if(typeof ft==='string' && ft.indexOf('-')>-1){ ft = ft.replace('-',' - '); }
    }
    if(!ht && m.state && m.state.score && m.state.score.ht){
      ht = m.state.score.ht;
    }
  }catch(e){}

  // 2. If HT still null, build from real EVENTS (correct goals before 45')
  if(!ht || !secondHalf){
    var evs = events?.data || events?.events || events || [];
    if(!Array.isArray(evs)) evs=[evs];
    evs.sort(function(a,b){ return parseInt(a.time||a.minute||0)-parseInt(b.time||b.minute||0); });
    var homeName=(m.homeTeam?.name||'').toLowerCase();
    var homeId=m.homeTeam?.id;
    var fhH=0,fhA=0,shH=0,shA=0, hasEvents=false;
    evs.forEach(function(ev){
      var t=(ev.type||'').toLowerCase();
      if(t.indexOf('goal')>-1 || t.indexOf('penalty')>-1){
        hasEvents=true;
        var minute=parseInt(ev.time||ev.minute||0); if(isNaN(minute)) minute=90;
        var isHome = homeId && ev.team?.id ? ev.team.id===homeId : (ev.team?.name||'').toLowerCase().indexOf(homeName)>-1;
        if(minute<=45){ if(isHome) fhH++; else fhA++; }
        else { if(isHome) shH++; else shA++; }
      }
    });
    if(hasEvents){
      if(!ht) ht = fhH+' - '+fhA;
      if(!secondHalf) secondHalf = shH+' - '+shA;
      if(!ft) ft = (fhH+shH)+' - '+(fhA+shA);
    }
  }

  // 3. Final fallback - FT from getScores (always correct)
  if(!ft){
    var sc=getScores(m);
    if(sc.h!=null) ft = sc.h+' - '+sc.a;
  }
  if(!ht && ft){
    // If still no HT, estimate but keep FT correct
    var p=ft.split('-'); if(p.length===2){ var th=parseInt(p[0])||0, ta=parseInt(p[1])||0; ht=Math.floor(th/2)+' - '+Math.floor(ta/2); }
  }
  if(!secondHalf && ht && ft){
    var hParts=ht.split('-'), fParts=ft.split('-');
    if(hParts.length===2 && fParts.length===2){
      var fh=parseInt(hParts[0])||0, fa=parseInt(hParts[1])||0, th=parseInt(fParts[0])||0, ta=parseInt(fParts[1])||0;
      secondHalf=(th-fh)+' - '+(ta-fa);
    }
  }
  return {ht:ht||'0 - 0', secondHalf:secondHalf||'0 - 0', ft:ft||'0 - 0'};
}
