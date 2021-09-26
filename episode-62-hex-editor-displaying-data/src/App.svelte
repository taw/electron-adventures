<script>
  import MainView from "./MainView.svelte"
  import Decodings from "./Decodings.svelte"
  import StatusBar from "./StatusBar.svelte"

  let data = []
  let offset = 1234

  for (let i=0; i<10010; i++) {
    data.push(i & 0xFF)
  }
</script>

<div class="editor">
  <MainView {data} />
  <Decodings {data} {offset} />
  <StatusBar {offset} />
</div>

<svelte:head>
  <title>fancy-data.bin</title>
</svelte:head>

<style>
:global(body) {
  background-color: #222;
  color: #fff;
  font-family: monospace;
  padding: 0;
  margin: 0;
}

.editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
}
.editor > :global(*) {
  background-color: #444;
}
</style>
