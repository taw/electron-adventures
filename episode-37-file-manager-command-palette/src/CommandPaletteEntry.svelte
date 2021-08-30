<script>
  import { getContext } from "svelte"
  let { eventBus } = getContext("app")

  export let name
  export let key
  export let action

  function handleClick() {
    eventBus.emit("app", "closePalette")
    eventBus.emit(...action)
  }
  function keyName(key) {
    if (key === " ") {
      return "Space"
    } else {
      return key
    }
  }
</script>

<li on:click={handleClick}>
  <span class="name">{name}</span>
  {#if key}
    <span class="key">{keyName(key)}</span>
  {/if}
</li>

<style>
  li {
    display: flex;
    padding: 0px 8px;
  }
  li:first-child {
    background-color: #66b;
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
