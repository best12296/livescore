<script type="module" src="https://widgets.api-sports.io/3.1.0/widgets.js"></script>

<style>
api-sports-widget[data-theme="Diamond"] {
  --primary-color: #00ff66;
  --success-color: #00ff66;
  --background-color: #000000;
  --text-color: #ffffff;
  --text-color-info: #00ff66;
  --border: 1px solid #1a1a1a;
  --hover: rgba(0,255,102,0.15);
  --game-height: 2.8rem;
  --league-height: 2.5rem;
  --teams-logo-size: 20px;
}
</style>

<!-- CONFIG - Color = Diamond, Details = modal, Table = modal -->
<api-sports-widget
  data-type="config"
  data-key="98a19520b228fd8dcff8459b07f0d569"
  data-sport="football"
  data-theme="Diamond"
  data-show-logos="true"
  data-target-game="modal"
  data-target-standings="modal"
></api-sports-widget>

<!-- ALL LEAGUES -->
<api-sports-widget
  data-type="games"
  data-show-toolbar="true"
  data-refresh="60"
></api-sports-widget>
