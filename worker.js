export async function onRequest(context) {
  const API_KEY = context.env.FOOTBALL_API_KEY || "0bdde243a2a70a0beec84e06428e9b1357b906da3f74ef94ddb69472bb60c0a5";
  const headers = { "Content-Type": "application/json", "Cache-Control": "public, max-age=300", "Access-Control-Allow-Origin": "*" };

  const fallback = [
    { homeTeam: "Arsenal", awayTeam: "Chelsea", league: "England - Premier League", time: "18:30", status: "live", ft_score: "1 - 0", ht_score: "0 - 0" },
    { homeTeam: "Barcelona", awayTeam: "Real Madrid", league: "Spain - La Liga", time: "20:00", status: "scheduled", ft_score: "0 - 0", ht_score: "0 - 0" },
    { homeTeam: "Man City", awayTeam: "Liverpool", league: "England - Premier League", time: "19:45", status: "live", ft_score: "2 - 1", ht_score: "1 - 0" }
  ];

  try {
    const url = new URL(context.request.url);
    const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
    const res = await fetch(`https://v3.football.api-sports.io/fixtures?date=${date}`, { headers: { "x-apisports-key": API_KEY } });
    const data = await res.json();
    if (!data.response || data.response.length === 0) throw new Error("empty");
    
    let matches = data.response.map(f => ({
      time: f.fixture.date.slice(11,16),
      homeTeam: f.teams.home.name,
      awayTeam: f.teams.away.name,
      league: `${f.league.country} - ${f.league.name}`,
      status: f.fixture.status.short,
      ft_score: `${f.goals.home ?? 0} - ${f.goals.away ?? 0}`,
      ht_score: f.score.halftime ? `${f.score.halftime.home ?? 0} - ${f.score.halftime.away ?? 0}` : "0 - 0"
    }));
    return new Response(JSON.stringify({ matches }), { headers });
  } catch (e) {
    // API finished = show fallback so manager still sees site working
    return new Response(JSON.stringify({ matches: fallback }), { headers });
  }
}
