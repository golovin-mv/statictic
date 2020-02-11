<script>
  export let fetchFn = () => {};

  let promise = Promise
    .resolve()
    .then(fetchFn);
</script>


{#await promise}
  <slot name="spinner">
    <span>Loading...</span>
  </slot>
{:then data}
  <slot name="then" data={data}></slot>
{:catch error}
  <slot name="catch">
    <p style="color: red">{error.message}</p>
  </slot>
{/await}

