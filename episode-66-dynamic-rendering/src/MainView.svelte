<script>
  import Slice from "./Slice.svelte"
  import { createEventDispatcher } from "svelte"

  export let data

  let dispatch = createEventDispatcher()
  let slices
  let main
  let firstVisible = 0
  let lastVisible = 200

  $: {
    slices = []
    for (let i=0; i<data.length; i+=16) {
      slices.push({
        offset: i,
        data: data.slice(i, i+16),
      })
    }
  }

  $: console.log("Vis", firstVisible, lastVisible)

  function onmouseover(e) {
    if (!e.target.dataset.offset) {
      return
    }
    dispatch("changeoffset", e.target.dataset.offset)
  }

  function setVisible() {
    let rowHeight = main.scrollHeight / slices.length
    firstVisible = Math.floor(main.scrollTop / rowHeight)
    lastVisible = Math.ceil((main.scrollTop + main.clientHeight) / rowHeight)
  }

  function init(node) {
    main = node
    setVisible()
  }
</script>

<div
  class="main"
  on:mouseover={onmouseover}
  on:scroll={setVisible}
  use:init
>
  {#each slices as slice, i}
    <Slice {...slice} visible={i >= firstVisible && i <= lastVisible} />
  {/each}
</div>

<svelte:window on:resize={setVisible} />

<style>
  .main {
    flex: 1 1 auto;
    overflow-y: auto;
    width: 100%;
  }
</style>
