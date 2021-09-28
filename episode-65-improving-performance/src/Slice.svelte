<script>
  import { printf } from "fast-printf"
  import AsciiSlice from "./AsciiSlice.svelte"

  export let offset
  export let data
</script>

<div class="row">
  <span class="offset">{printf("%06d", offset)}</span>
  <span class="hex">
    {#each {length: 16} as _, i}
      <span data-offset={offset + i}>
        {data[i] !== undefined ? printf("%02x", data[i]) : "  "}
      </span>
    {/each}
  </span>
  <AsciiSlice {data} />
</div>

<style>
  .row:nth-child(even) {
    background-color: #555;
  }
  .offset {
    margin-right: 0.75em;
  }
  .hex span:nth-child(4n) {
    margin-right: 0.75em;
  }
</style>
