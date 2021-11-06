<script>
  import Piece from "./Piece.svelte"
  import {dndzone} from "svelte-dnd-action"
  import {flip} from 'svelte/animate'

  export let cls
  export let items = []

  function handleDND(e) {
		items = e.detail.items
	}
</script>

<div class="field {cls}" use:dndzone={{items}} on:consider={handleDND} on:finalize={handleDND}>
  {#each items as item (item.id)}
    <div animate:flip>
      <Piece symbol={item.symbol} />
    </div>
  {/each}
</div>

<style>
.field {
  border: 2px solid green;
  margin: 0px;
  background-color: #aaf;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dark {
  background-color: #afa;
}
.offboard {
  grid-column: 1 / span 8;
  grid-row: 10;
}
</style>
