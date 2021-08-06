<script>
  import HistoryEntry from "./HistoryEntry.svelte"
  import CommandInput from "./CommandInput.svelte"

  let history = []

  async function onsubmit(command) {
    let entry = {command, stdout: "", stderr: "", error: null, running: true}
    history.push(entry)
    history = history

    Object.assign(entry, {running: false}, await window.api.runCommand(command))
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
