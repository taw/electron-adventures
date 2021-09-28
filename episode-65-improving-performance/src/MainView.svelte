<script>
  import Slice from "./Slice.svelte"
	import { createEventDispatcher } from "svelte"

  export let data

	let dispatch = createEventDispatcher()
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

  function onmouseover(e) {
    if (!e.target.dataset.offset) {
      return
    }
    dispatch("changeoffset", e.target.dataset.offset)
  }
</script>

<div class="main" on:mouseover={onmouseover}>
  {#each slices as slice}
    <Slice {...slice} />
  {/each}
</div>

<style>
  .main {
    flex: 1 1 auto;
    overflow-y: auto;
    width: 100%;
  }
</style>
