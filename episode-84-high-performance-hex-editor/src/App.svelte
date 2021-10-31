<script>
  import {Buffer} from "buffer/"
  import MainView from "./MainView.svelte"
  import Decodings from "./Decodings.svelte"
  import StatusBar from "./StatusBar.svelte"
  import { tick } from "svelte"

  let data = Buffer.from(window.api.data)
  let offset = 0

  let t0 = performance.now()
  tick().then(() => {
    let t1 = performance.now()
    console.log(`Loaded ${Math.round(data.length / 1024)}kB in ${t1 - t0}ms`)
  })
</script>

<div class="editor">
  <MainView {data} on:changeoffset={e => offset = e.detail}/>
  <Decodings {data} {offset} />
  <StatusBar {offset} />
</div>

<svelte:head>
  <title>{window.api.path.split("/").slice(-1)[0]}</title>
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
