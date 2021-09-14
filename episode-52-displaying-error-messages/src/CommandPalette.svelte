<script>
  import commands from "./commands.js"
  import matcher from "./matcher.js"
  import { getContext } from "svelte"
  import CommandPaletteEntry from "./CommandPaletteEntry.svelte"

  let { eventBus } = getContext("app")
  let pattern = ""

  $: matchingCommands = matcher(commands.default, pattern)

  let app = eventBus.target("app")

  function submit() {
    app.closeDialog()
    if (matchingCommands[0]) {
      eventBus.emit(...matchingCommands[0].action)
    }
  }
  function focus(el) {
    el.focus()
  }
</script>

<form on:submit|preventDefault={submit}>
  <input use:focus bind:value={pattern} placeholder="Search for command">
  <ul>
    {#each matchingCommands as command}
      <CommandPaletteEntry {...command} />
    {/each}
  </ul>
</form>

<style>
  form {
    padding: 8px;
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
