<script>
  import Command from "./Command.svelte"
  import CommandInput from "./CommandInput.svelte"

  let history = []

  async function onsubmit(command) {
    let entry = {command}
    history.push(entry)
    history = history
  }
</script>

<h1>Svelte Terminal App</h1>

<div id="terminal">
  <div id="history">
    {#each history as entry}
      <Command command={entry.command} />
    {/each}
  </div>

  <CommandInput {onsubmit} />
</div>

<style>
:global(body) {
  background-color: #444;
  color: #fff;
  font-family: monospace;
}
</style>
