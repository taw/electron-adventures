<script>
  import { writable } from "svelte/store"
  import { setContext } from "svelte"
  import Panel from "./Panel.svelte"
  import Footer from "./Footer.svelte"
  import EventBus from "./EventBus.js"
  import Keyboard from "./Keyboard.svelte"
  import CommandPalette from "./CommandPalette.svelte"
  import Preview from "./Preview.svelte"

  let eventBus = new EventBus()
  let activePanel = writable("left")
  let paletteOpen = false
  let preview = false

    $: keyboardActive = !paletteOpen && !preview

  setContext("app", {eventBus, activePanel})

  let initialDirectoryLeft = window.api.currentDirectory()
  let initialDirectoryRight = window.api.currentDirectory() + "/node_modules"

  function switchPanel() {
    if ($activePanel === "left") {
      activePanel.set("right")
    } else {
      activePanel.set("left")
    }
  }
  function activatePanel(panel) {
    activePanel.set(panel)
  }
  function quit() {
    window.close()
  }
  function emitToActivePanel(...args) {
    eventBus.emit($activePanel, ...args)
  }
  function openPalette() {
    paletteOpen = true
  }
  function closePalette() {
    paletteOpen = false
  }
  function viewFile(path) {
    if (/\.png$/i.test(path)) {
      preview = {type: "image", path, mimeType: "image/png"}
    } else if (/\.jpe?g$/i.test(path)) {
      preview = {type: "image", path, mimeType: "image/jpeg"}
    } else if (/\.gif$/i.test(path)) {
      preview = {type: "image", path, mimeType: "image/gif"}
    } else if (/\.(js|json|md|txt|svelte)$/i.test(path)) {
      preview = {type: "text", path}
    } else {
      window.api.viewFile(path)
    }
  }
  function editFile(path) {
    window.api.editFile(path)
  }
  function closePreview() {
    preview = null
  }
  eventBus.handle("app", {switchPanel, activatePanel, quit, openPalette, closePalette, viewFile, editFile, closePreview})
  eventBus.handle("activePanel", {"*": emitToActivePanel})
</script>

{#if preview}
  <Preview {...preview} />
{/if}

<div class="ui">
  <header>
    File Manager
  </header>
  <Panel initialDirectory={initialDirectoryLeft} id="left" />
  <Panel initialDirectory={initialDirectoryRight} id="right" />
  <Footer />
</div>

<Keyboard active={keyboardActive} />

{#if paletteOpen}
  <CommandPalette />
{/if}

<style>
  :global(body) {
    background-color: #226;
    color: #fff;
    font-family: monospace;
    margin: 0;
    font-size: 16px;
  }
  .ui {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-areas:
      "header header"
      "panel-left panel-right"
      "footer footer";
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto minmax(0, 1fr) auto;
  }
  .ui header {
    grid-area: header;
  }
  header {
    font-size: 24px;
    margin: 4px;
  }
</style>
