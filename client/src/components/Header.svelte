<script>
  import { Router, Link } from "svelte-routing";
</script>

<style>
  .header {
    background-color: var(--header-background);
    grid-area: hd;
    border-bottom: 1px solid #16a085;
  }

  .header_logo {
    line-height: var(--header-heigth);
    padding-left: 1em;
    font-size: 2em;
    line-height: 1.5em;
    color: #ecf0f1;
  }
</style>

<header class="header">
  <Router>
    <Link to="/">
      <div class="header_logo">STATISTIC</div>
    </Link>
  </Router>
</header>
