<script>
  export let onsubmit
  let command = ""

  function submit() {
    onsubmit(command)
    command = ""
  }
</script>

<div class="input-line">
  <span class="prompt">$</span>
  <form on:submit|preventDefault={submit}>
    <input type="text" autofocus bind:value={command} />
  </form>
</div>

<style>
  .input-line {
    display: flex;
    gap: 0.5rem;
  }

  form {
    flex: 1;
    display: flex;
  }

  input {
    flex: 1;
    font-family: inherit;
    background-color: inherit;
    color: inherit;
    border: none;
  }
</style>
