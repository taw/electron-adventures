<script>
  import { getContext } from "svelte"
  let { eventBus } = getContext("app")

  export let name
  export let keys
  export let action

  function handleClick() {
    eventBus.emit("app", "closePalette")
    eventBus.emit(...action)
  }
</script>

<li on:click={handleClick}>
  <span class="name"> {name}</span>
  {#each keys as key}
    <span class="key">{key}</span>
  {/each}
</li>

<style>
  li {
    display: flex;
    padding:  0px 8px;
  }
  li:first-child {
    background-color: hsl(180,100%,20%);
  }
  .name {
    flex: 1;
  }
  .key {
    display: inline-block;
    background-color: hsl(180,100%,30%);
    padding: 2px;
    border: 1px solid  hsl(180,100%,20%);
    border-radius: 20%;
  }
</style>
