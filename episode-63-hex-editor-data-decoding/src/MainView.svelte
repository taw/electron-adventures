<script>
  import Slice from "./Slice.svelte"

  export let data

  let slices

  $: {
    slices = []
    for (let i=0; i<data.length; i+=16) {
      slices.push({
        offset: i,
        data: data.slice(i, i+16),
      })
    }
  }
</script>

<div class="main">
  <table>
    {#each slices as slice}
      <Slice {...slice} on:changeoffset />
    {/each}
  </table>
</div>

<style>
  .main {
    flex: 1 1 auto;
    overflow-y: auto;
  }
  table {
    width: 100%;
  }
</style>
