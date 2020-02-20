<script>
  import { getJob, runJob } from "../api";
  import Fetch from "./Fetch.svelte";
  export let id;

  const fetchJob = () => getJob(id);

  let job;

</script>

<style>

</style>

<Fetch fetchFn={fetchJob}>
  <div class="job" slot="then" let:data={job}>
    {JSON.stringify(job)}
    <button on:click={() => runJob(job._id)}>Запустить</button>
  </div>
</Fetch>
