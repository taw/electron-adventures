<script>
  import Panel from "./Panel.svelte"
  import Footer from "./Footer.svelte"

  let activePanel = "left"
  let directoryLeft = window.api.currentDirectory()
  let directoryRight = window.api.currentDirectory() + "/node_modules"
  let handleKey = (e) => {
    if (e.key === "Tab") {
      if (activePanel === "left") {
        activePanel = "right"
      } else {
        activePanel = "left"
      }
      e.preventDefault()
    }
  }
</script>

<div class="ui">
  <header>
    File Manager
  </header>
  <Panel
    initialDirectory={directoryLeft}
    position="left"
    active={activePanel === "left"}
    onActivate={() => activePanel = "left"}
  />
  <Panel
    initialDirectory={directoryRight}
    position="right"
    active={activePanel === "right"}
    onActivate={() => activePanel = "right"}
  />
  <Footer />
</div>

<svelte:window on:keydown={handleKey}/>

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
