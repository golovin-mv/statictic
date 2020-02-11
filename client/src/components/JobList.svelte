<script>
  import { getAllJobs } from "../api";
  import Fetch from './Fetch.svelte';
  import JobCard from './JobCard.svelte';

  let jobs = [];
</script>

<style>
  .job-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 1em;
  }
</style>

<Fetch fetchFn={getAllJobs}>
  <div class="job-list"  slot="then" let:data={jobs}> 
    {#each jobs as job}
      <JobCard job={job}/>
    {/each}
  </div>
</Fetch>


