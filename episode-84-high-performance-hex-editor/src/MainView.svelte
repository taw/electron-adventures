<script>
  import Slice from "./Slice.svelte"
  import { createEventDispatcher } from "svelte"

  export let data

  let dispatch = createEventDispatcher()
  let slices
  let main1
  let main2
  let firstVisible = 0
  let lastVisible = 200

  $: {
    slices = []
    for (let i=0; i<data.length; i+=16) {
      slices.push({
        rowNumber: i/16,
        offset: i,
        data: data.slice(i, i+16),
      })
    }
  }

  $: visibleSlices = slices.slice(firstVisible, lastVisible+1)
  $: totalHeight = `height: ${16*slices.length}px`

  function onmouseover(e) {
    if (!e.target.dataset.offset) {
      return
    }
    dispatch("changeoffset", e.target.dataset.offset)
  }

  function setVisible() {
    let rowHeight = 16
    firstVisible = Math.floor(main1.scrollTop / rowHeight)
    lastVisible = Math.ceil((main1.scrollTop + main1.clientHeight) / rowHeight)
    main2.focus()
  }

  function init1(node) {
    main1 = node
    setVisible()
  }
  function init2(node) {
    main2 = node
  }
</script>

<div
  class="main1"
  on:scroll={setVisible}
  use:init1
  >
  <div
    class="main2"
    on:mouseover={onmouseover}
    style={totalHeight}
    use:init2
    tabindex="-1"
  >
    {#each visibleSlices as slice (slice.offset)}
      <Slice {...slice} />
    {/each}
  </div>
</div>

<svelte:window on:resize={setVisible} />

<style>
  .main1 {
    flex: 1 1 auto;
    overflow-y: auto;
    width: 100%;
  }
  .main2 {
    position: relative;
  }
</style>
