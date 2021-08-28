<script>
  import { writable } from "svelte/store"
  import { setContext } from "svelte"

  import Box from "./Box.svelte"
  import Footer from "./Footer.svelte"
  import Keyboard from "./Keyboard.svelte"
  import AppMenu from "./AppMenu.svelte"
  import EventBus from "./EventBus.js"

  let activeBox = writable("box-1")
  let clipboard = writable("")
  let eventBus = new EventBus()

  setContext("app", {activeBox, clipboard, eventBus})

  function quit() {
    window.close()
  }
  function changeBox(id) {
    activeBox.set(id)
  }
  function emitToActiveBox(...args) {
    eventBus.emit($activeBox, ...args)
  }

  eventBus.handle("app", {quit, changeBox})
  eventBus.handle("activeBox", {"*": emitToActiveBox})
</script>

<div class="app">
  <Box id="box-1" />
  <Box id="box-2" />
  <Box id="box-3" />
  <Box id="box-4" />
  <Footer />
</div>

<Keyboard />
<AppMenu />

<style>
  :global(body) {
    margin: 0;
  }
  .app {
    background-color: hsl(180,100%,20%);
    font-family: monospace;
    color: #333;
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr auto;
    gap: 10px;
  }
</style>
