<script>
  import commands from "./commands.js"
  import matcher from "./matcher.js"
  import { getContext } from "svelte"
  import CommandPaletteEntry from "./CommandPaletteEntry.svelte"

  let { eventBus } = getContext("app")
  let pattern = ""

  $: matchingCommands = matcher(commands, pattern)

  let app = eventBus.target("app")

  function handleKey(event) {
    let {key} = event;

    if (key === "Enter") {
      event.preventDefault()
      event.stopPropagation()
      app.closePalette()
      if (matchingCommands[0]) {
        eventBus.emit(...matchingCommands[0].action)
      }
    }
    if (key === "Escape") {
      event.preventDefault()
      event.stopPropagation()
      app.closePalette()
    }
  }
  function focus(el) {
    el.focus()
  }
</script>

<div class="palette">
  <input use:focus bind:value={pattern} placeholder="Search for command" on:keydown={handleKey}>
  <ul>
    {#each matchingCommands as command}
      <CommandPaletteEntry {...command} />
    {/each}
  </ul>
</div>

<style>
  .palette {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    margin: auto;
    max-width: 50vw;
    background: #338;
    box-shadow: 0px 0px 24px #004;
  }

  input {
    font-family: inherit;
    background-color: inherit;
    font-size: inherit;
    font-weight: inherit;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    background: #66b;
    color: inherit;
  }

  input::placeholder {
    color: inherit;
    font-style: italic;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    margin-top: 8px;
  }
</style>
