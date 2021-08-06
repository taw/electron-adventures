<script>
  import Icon from "svelte-awesome"
  import { spinner, exclamationTriangle } from "svelte-awesome/icons"

  export let command, stdout, stderr, error, running
</script>

<div class='history-entry'>
  <div class='input-line'>
    <span class='prompt'>$</span>
    <span class='input'>{command}</span>
  </div>
  <div class='stdout'>{stdout}</div>
  <div class='stderr'>{stderr}</div>
  {#if running}
    <Icon data={spinner} pulse />
  {/if}
  {#if error}
    <Icon data={exclamationTriangle} />
  {/if}
</div>

<style>
  .history-entry {
    padding-bottom: 0.5rem;
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

  .input {
    color: #ffa;
    flex: 1;
  }
</style>
