<script>
  import HistoryEntry from "./HistoryEntry.svelte"
  import CommandInput from "./CommandInput.svelte"

  let history = []

  function onsubmit(command) {
    let output = window.api.runCommand(command)
    history.push({command, output})
    history = history
  }
</script>

<h1>Svelte Terminal App</h1>

<div id="terminal">
  <div id="history">
    {#each history as entry}
      <HistoryEntry {...entry} />
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
