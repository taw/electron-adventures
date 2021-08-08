<script>
  import Icon from "svelte-awesome"
  import { exclamationTriangle } from "svelte-awesome/icons"

  export let command

  let running = true
  let interactions = []
  let error = false
  let input = ""

  function onout(data) {
    interactions.push({data, type: "stdout"})
    interactions = interactions
  }
  function onerr(data) {
    interactions.push({data, type: "stderr"})
    interactions = interactions
  }
  function ondone(code) {
    running = false
    error = (code !== 0)
  }
  function endInput() {
    proc.endInput()
  }
  function kill() {
    proc.kill()
  }
  function submit() {
    let data = input+"\n"
    interactions.push({data, type: "stdin"})
    interactions = interactions
    proc.input(data)
    input = ""
  }
  let proc = window.api.runCommand({command,onout,onerr,ondone})
</script>

<div class='history-entry'>
  <div class='input-line'>
    <span class='prompt'>$</span>
    <span class='command'>{command}</span>
  </div>
  {#each interactions as interaction}
    <div class={interaction.type}>{interaction.data}</div>
  {/each}
  {#if running}
    <form on:submit|preventDefault={submit}>
      <input type="text" bind:value={input} />
      <button type="button" on:click={endInput}>End Input</button>
      <button type="button" on:click={kill}>Kill</button>
    </form>
  {/if}
  {#if error}
    <Icon data={exclamationTriangle} />
  {/if}
</div>

<style>
  .history-entry {
    padding-bottom: 0.5rem;
  }

  .stdin {
    color: #ffa;
    white-space: pre;
  }

  .stdout {
    color: #afa;
    white-space: pre;
  }

  .stderr {
    color: #faa;
    white-space: pre;
  }

  .input-line {
    display: flex;
    gap: 0.5rem;
  }

  .command {
    color: #ffa;
    flex: 1;
  }

  form {
    flex: 1;
    display: flex;
  }

  input {
    flex: 1;
    font-family: inherit;
    background-color: #666;
    color: inherit;
    border: none;
  }
</style>
