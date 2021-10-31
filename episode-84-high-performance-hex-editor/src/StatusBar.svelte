<script>
  import { printf } from "fast-printf"
  export let offset

  $: hexOffset = printf("%x", offset)
</script>

<div>
  Offset: {offset} ({hexOffset})
</div>

<style>
  div {
    margin-top: 8px;
  }
</style>
