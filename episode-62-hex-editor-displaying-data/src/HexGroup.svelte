<script>
  import { printf } from "fast-printf"

  export let data
</script>

<td class="hex">
  <span>
    {data[0] !== undefined ? printf("%02x", data[0]) : ""}
  </span>
  <span>
    {data[1] !== undefined ? printf("%02x", data[1]) : ""}
  </span>
  <span>
    {data[2] !== undefined ? printf("%02x", data[2]) : ""}
  </span>
  <span>
    {data[3] !== undefined ? printf("%02x", data[3]) : ""}
  </span>
</td>
