<script>
  import { printf } from "fast-printf"
  import HexGroup from "./HexGroup.svelte"
  import AsciiSlice from "./AsciiSlice.svelte"

  export let offset
  export let data
</script>

<tr>
  <td class="offset">{printf("%06d", offset)}</td>
  <HexGroup data={data.slice(0, 4)} on:changeoffset offset={offset} />
  <HexGroup data={data.slice(4, 8)} on:changeoffset offset={offset+4} />
  <HexGroup data={data.slice(8, 12)} on:changeoffset offset={offset+8} />
  <HexGroup data={data.slice(12, 16)} on:changeoffset offset={offset+12} />
  <AsciiSlice {data} />
</tr>

<style>
  tr:nth-child(even) {
    background-color: #555;
  }
</style>
