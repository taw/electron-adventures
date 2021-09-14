<script>
  export let base
  export let files

  import path from "path-browserify"
  import { getContext } from "svelte"

  let { eventBus } = getContext("app")
  let app = eventBus.target("app")
  let bothPanels = eventBus.target("bothPanels")

  async function submit() {
    for (let file of files) {
      let fullPath = path.join(base, file)
      await window.api.moveFileToTrash(fullPath)
    }
    app.closeDialog()
    bothPanels.refresh()
  }
  function focus(el) {
    el.focus()
  }
</script>

<form on:submit|preventDefault={submit}>
  <div>Do you want to delete the following files in {base}:</div>
  <ul>
    {#each files as file}
      <li>{file}</li>
    {/each}
  </ul>
  <div class="buttons">
    <button type="submit" use:focus>Delete</button>
    <button on:click={app.closeDialog}>Cancel</button>
  </div>
</form>

<style>
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
