<script>
  import Tag from './Tag.svelte';
  import Icon from './Icon.svelte';

  export let job;
</script>

<style>
  .job-card {
    background-color: var(--card-background) ;
    padding: 1em 0 2em 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .job-card .job-header {
    display: flex;
    justify-content: space-between; 
    align-items: center;
    padding: 0 1em;
    color: var(--menu-color);
  }

  .job-card .job-card__title {
    padding: 1em 0;
    font-weight: 600;
  }

  .job-card .job-card__schedule {
    color: var(--warning-color);
    font-size: 1.5em;
  }

  .job-card .tags {
    margin-left: 0.5em;
  }

  .job-card .job-card__description {
    font-size: 0.8em;
    padding: 0 1em;
    color: var(--sub-content-color);
  }

  .job-card .job-card__actions {
    align-self: flex-end;
    margin-top: 1.5em;
  }

  .job-card .job-card__actions a {
    margin-right: 1em;
    text-decoration: none;
    padding: 8px;
    font-weight: 800;
    font-size: 0.8em;
    color: var(--menu-color);
  }

  .job-card .job-card__actions a:hover {
    background-color: #2980b9;
    transition: background-color 0.2s;
    border-radius: 2px;
  }

  .job-card .job-card__actions a:hover {
    background-color: #3498db;
  } 

</style>


<div class="job-card">
  <div class="job-header">
    <div class="job-card__title">
      {job.name}
    </div>
    <div class="job-card__schedule">
      {#if job.schedule}
          <Icon name="time-reverse"/>
      {/if}      
    </div>
  </div>
  <div class="tags">
  {#each job.tags as tag}
    <Tag>
      {tag}
    </Tag>
  {/each}
  </div>
  <p class="job-card__description">
    {job.description ? job.description : ''}
  </p>
  <div class="job-card__actions">
    <a href="/job/{job.id}">ПОДРОБНЕЕ</a>
  </div>
</div>
