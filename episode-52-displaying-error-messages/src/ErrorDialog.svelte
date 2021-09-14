<script>
  export let error

  import { getContext } from "svelte"

  let { eventBus } = getContext("app")
  let app = eventBus.target("app")

  function submit() {
    app.closeDialog()
  }
  function focus(el) {
    el.focus()
  }
</script>

<form on:submit|preventDefault={submit}>
  <div>{error}</div>
  <div class="buttons">
    <button type="submit" use:focus>OK</button>
  </div>
</form>

<style>
  form {
    padding: 8px;
    background: #833;
    box-shadow: 0px 0px 24px #400;
  }

  .buttons {
    display: flex;
    flex-direction: row-reverse;
    margin-top: 8px;
    gap: 8px;
  }

  button {
    font-family: inherit;
    font-size: inherit;
    background-color: #b66;
    color: inherit;
  }
</style>
