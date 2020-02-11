<script>
  import JobList from './JobList.svelte';
  import { Router, Link, Route } from "svelte-routing";

  export let url = "";
</script>

<style>
  main {
    background-color: var(--content-background);
    color: var(--content-color);
    grid-area: mn;
    overflow-y: auto;
    padding: 2em;
  }
</style>

<main class="content">
  <Router url="{url}">
     <Route path="/jobs" component="{JobList}" />
  </Router>
</main>