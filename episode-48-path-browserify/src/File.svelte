<script>
  import { getContext } from "svelte"

  export let file
  export let idx
  export let panelId
  export let focused
  export let selected
  export let node = undefined

  let {eventBus} = getContext("app")

  let app = eventBus.target("app")
  let panel = eventBus.target(panelId)

  function onclick() {
    app.activatePanel(panelId)
    panel.focusOn(idx)
  }
  function onrightclick() {
    app.activatePanel(panelId)
    panel.focusOn(idx)
    panel.flipSelected(idx)
  }
  function ondoubleclick() {
    app.activatePanel(panelId)
    panel.focusOn(idx)
    panel.activateItem()
  }
  function filySymbol(file) {
    if (file.type === "directory") {
      if (file.linkTarget) {
        return "~"
      } else {
        return "/"
      }
    } else if (file.type === "special") {
      return "-"
    } else {
      if (file.linkTarget) {
        return "@"
      } else {
        return "\xA0" // &nbsp;
      }
    }
  }
</script>

<div
  class="file"
  class:focused={focused}
  class:selected={selected}
  on:click|preventDefault={() => onclick()}
  on:contextmenu|preventDefault={() => onrightclick()}
  on:dblclick|preventDefault={() => ondoubleclick()}
  bind:this={node}
>
  {filySymbol(file)}{file.name}
</div>

<style>
  .file {
    cursor: pointer;
  }
  .file.selected {
    color: #ff2;
    font-weight: bold;
  }
  :global(.panel.active) .file.focused {
    background-color: #66b;
  }
</style>
