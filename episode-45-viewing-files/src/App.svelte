<script>
  import { writable } from "svelte/store"
  import { setContext } from "svelte"
  import Panel from "./Panel.svelte"
  import Footer from "./Footer.svelte"
  import EventBus from "./EventBus.js"
  import Keyboard from "./Keyboard.svelte"
  import CommandPalette from "./CommandPalette.svelte"

  let eventBus = new EventBus()
  let activePanel = writable("left")
  let paletteOpen = false

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
    window.api.viewFile(path)
  }
  function editFile(path) {
    window.api.editFile(path)
  }
  eventBus.handle("app", {switchPanel, activatePanel, quit, openPalette, closePalette, viewFile, editFile})
  eventBus.handle("activePanel", {"*": emitToActivePanel})
</script>

<div class="ui">
  <header>
    File Manager
  </header>
  <Panel initialDirectory={initialDirectoryLeft} id="left" />
  <Panel initialDirectory={initialDirectoryRight} id="right" />
  <Footer />
</div>

<Keyboard active={!paletteOpen} />

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
