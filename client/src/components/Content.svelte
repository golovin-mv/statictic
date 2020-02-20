<script>
  import { Router, Link, Route } from "svelte-routing";

  import JobList from "./JobList.svelte";
  import JobInfo from "./JobInfo.svelte";

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
  <Router {url}>
    <Route path="/jobs" component={JobList} />
    <Route path="/job/:id" let:params>
      <JobInfo id={params.id} />
    </Route>
  </Router>
</main>
