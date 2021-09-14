<script>
  export let base

  import path from "path-browserify"
  import { getContext } from "svelte"

  let { eventBus } = getContext("app")
  let dir = ""

  let app = eventBus.target("app")
  let bothPanels = eventBus.target("bothPanels")

  function submit() {
    app.closeDialog()
    if (dir !== "") {
      let target = path.join(base, dir)
      try {
        window.api.createDirectory(target)
      } catch (err) {
        console.log(`Error creating directory ${target}`, err)
        app.openDialog("ErrorDialog", {error: `Error creating directory ${target}: ${err.message}`})
      }
      bothPanels.refresh()
    }
  }
  function focus(el) {
    el.focus()
  }
</script>

<form on:submit|preventDefault={submit}>
  <label>
    <div>Enter directory name:</div>
    <input use:focus bind:value={dir} placeholder="directory">
  </label>
  <div class="buttons">
    <button type="submit">Create directory</button>
    <button on:click={app.closeDialog}>Cancel</button>
  </div>
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

  .buttons {
    display: flex;
    flex-direction: row-reverse;
    margin-top: 8px;
    gap: 8px;
  }

  button {
    font-family: inherit;
    font-size: inherit;
    background-color: #66b;
    color: inherit;
  }
</style>
