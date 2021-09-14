<script>
  import Shortcut from "./Shortcut.svelte"
  import { getContext } from "svelte"
  let { eventBus } = getContext("app")
  let app = eventBus.target("app")

  export let name
  export let match = undefined
  export let shortcuts = []
  export let action

  function handleClick() {
    app.closeDialog()
    eventBus.emit(...action)
  }
</script>

<li on:click={handleClick}>
  <span class="name">
    {#if match}
      {#each match as [part, highlight]}
        {#if highlight}
          <em>{part}</em>
        {:else}
          {part}
        {/if}
      {/each}
    {:else}
      {name}
    {/if}
  </span>
  {#each shortcuts as shortcut}
    <Shortcut {...shortcut} />
  {/each}
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
  .name em {
    color: #ff2;
    font-weight: bold;
    font-style: normal;
  }
</style>
