<script>
  import path from "path-browserify"
  import { writable } from "svelte/store"
  import { setContext } from "svelte"
  import Panel from "./Panel.svelte"
  import Footer from "./Footer.svelte"
  import EventBus from "./EventBus.js"
  import Keyboard from "./Keyboard.svelte"
  import Preview from "./Preview.svelte"
  import Dialog from "./Dialog.svelte"

  let eventBus = new EventBus()
  let activePanel = writable("left")
  let dialog = null
  let preview = null
  let keyboardMode

  $: {
    keyboardMode = "default"
    if (dialog) keyboardMode = "dialog"
    if (preview) keyboardMode = "preview"
  }

  setContext("app", {eventBus, activePanel})

  let initialDirectoryLeft = window.api.currentDirectory()
  let initialDirectoryRight = path.join(window.api.currentDirectory(), "node_modules")

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
  function emitToBothPanels(...args) {
    eventBus.emit("left", ...args)
    eventBus.emit("right", ...args)
  }
  function openPalette() {
    dialog = {type: "CommandPalette"}
  }
  function openDialog(type, data) {
    dialog = {type, data}
  }
  function closeDialog() {
    dialog = null
  }
  function viewFile(file) {
    let ext = path.extname(file).toLowerCase()
    if (ext === ".png") {
      preview = {type: "image", file, mimeType: "image/png"}
    } else if (ext === ".jpg" || ext === ".jpeg") {
      preview = {type: "image", file, mimeType: "image/jpeg"}
    } else if (ext === ".gif") {
      preview = {type: "image", file, mimeType: "image/gif"}
    } else if (/\.(css|js|json|md|txt|svelte)$/i.test(ext)) {
      preview = {type: "text", file}
    } else {
      window.api.viewFile(file)
    }
  }
  function editFile(file) {
    window.api.editFile(file)
  }
  function closePreview() {
    preview = null
  }
  eventBus.handle("app", {switchPanel, activatePanel, quit, openPalette, closeDialog, viewFile, editFile, closePreview, openDialog})
  eventBus.handle("activePanel", {"*": emitToActivePanel})
  eventBus.handle("bothPanels", {"*": emitToBothPanels})
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

<Keyboard mode={keyboardMode} />

{#if dialog}
  <Dialog {...dialog} />
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
