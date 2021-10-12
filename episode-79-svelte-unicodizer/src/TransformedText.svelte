<script>
  export let map, text

  $: transformed = map.apply(text)
</script>

<div>
  {#if text !== transformed}
    <b>{map.name}</b>
    <div>{transformed}</div>
  {/if}
</div>

<style>
  div {
    margin-bottom: 1em;
  }
  b ~ div {
    margin-left: 1em;
  }
</style>
