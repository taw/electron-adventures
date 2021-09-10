<script>
  export let path
  export let type = undefined
  export let mimeType = undefined

  import { getContext } from "svelte"

  let { eventBus } = getContext("app")
  let app = eventBus.target("app")

  let text
  if (type === "text") {
    text = window.api.readTextFile(path)
  }

  let imageData
  if (type === "image") {
    imageData = window.api.readFileToDataUrl(path, mimeType)
  }

  function handleKey(event) {
    let {key} = event

    if (key === "F4") {
      event.preventDefault()
      event.stopPropagation()
      app.closePreview()
      app.editFile(path)
    }
    if (key === "Escape" || key == "F3" || key === "F10" || key.toUpperCase() === "Q") {
      event.preventDefault()
      event.stopPropagation()
      app.closePreview()
    }
  }
  function focus(el) {
    el.focus()
  }
</script>

<div class="preview">
  {#if type === "image"}
    <div class="image" style="background-image: url('{imageData}')" />
  {:else}
    <div class="text" tabindex="-1" use:focus>
      {text}
    </div>
  {/if}
</div>

<svelte:window on:keydown={handleKey} />

<style>
  .preview {
    position: fixed;
    inset: 0;
    background: #338;
    box-shadow: 0px 0px 24px #004;
    overflow-y: auto;
  }
  .image {
    height: 100%;
    width: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  .text {
    white-space: pre-wrap;
  }
</style>
