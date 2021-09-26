<script>
  import { printf } from "fast-printf"
	import { createEventDispatcher } from "svelte"

	let dispatch = createEventDispatcher()

  export let data
  export let offset
</script>

<td class="hex">
  <span on:mouseover={() => dispatch("changeoffset", offset)}>
    {data[0] !== undefined ? printf("%02x", data[0]) : ""}
  </span>
  <span on:mouseover={() => dispatch("changeoffset", offset+1)}>
    {data[1] !== undefined ? printf("%02x", data[1]) : ""}
  </span>
  <span on:mouseover={() => dispatch("changeoffset", offset+2)}>
    {data[2] !== undefined ? printf("%02x", data[2]) : ""}
  </span>
  <span on:mouseover={() => dispatch("changeoffset", offset+3)}>
    {data[3] !== undefined ? printf("%02x", data[3]) : ""}
  </span>
</td>
