export default {
  async fetch() {
    const html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>DIAMOND LIVESCORE</title><script type="module" src="https://widgets.api-sports.io/3.1.0/widgets.js"><\/script><style>body{margin:0;background:#000}api-sports-widget[data-theme="Diamond"]{--primary-color:#00ff66;--success-color:#00ff66;--background-color:#000;--text-color:#fff;--text-color-info:#00ff66;--border:1px solid #1a1a1a;--hover:rgba(0,255,102,.12);--game-height:2.8rem;--league-height:2.5rem;--teams-logo-size:22px}</style></head><body><api-sports-widget data-type="config" data-key="98a19520b228fd8dcff8459b07f0d569" data-sport="football" data-theme="Diamond" data-show-logos="true" data-target-game="modal" data-target-standings="modal" data-timezone="Africa/Lagos"></api-sports-widget><api-sports-widget data-type="games" data-show-toolbar="true" data-refresh="60"></api-sports-widget></body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=60" }});
  }
}
