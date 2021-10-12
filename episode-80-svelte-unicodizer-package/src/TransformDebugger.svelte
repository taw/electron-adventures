<script>
  export let map
</script>

<div>
  <b>{map.name}</b>
  <div>{map.debug}</div>
</div>

<style>
  div {
    margin-bottom: 1em;
  }
  b ~ div {
    margin-left: 1em;
  }
</style>
