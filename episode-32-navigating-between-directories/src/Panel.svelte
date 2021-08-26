<script>
  import { tick } from "svelte"

  export let initialDirectory
  export let position
  export let active
  export let onActivate

  let directory = initialDirectory
  let initialFocus
  let files = []
  let selected = []
  let focusedIdx = 0
  let fileNodes = []
  let fileListNode

  $: filesPromise = window.api.directoryContents(directory)
  $: filesPromise.then(x => {
    files = x
    selected = []
    setInitialFocus()
  })
  $: filesCount = files.length
  $: focused = files[focusedIdx]

  let flipSelected = (idx) => {
    if (selected.includes(idx)) {
      selected = selected.filter(f => f !== idx)
    } else {
      selected = [...selected, idx]
    }
  }
  let setInitialFocus = async () => {
    focusedIdx = 0
    if (initialFocus) {
      focusedIdx = files.findIndex(x => x.name === initialFocus)
      if (focusedIdx === -1) {
        focusedIdx = 0
      }
    } else {
      focusedIdx = 0
    }
    await tick()
    scrollFocusedIntoView()
  }
  let scrollFocusedIntoView = () => {
    if (fileNodes[focusedIdx]) {
      fileNodes[focusedIdx].scrollIntoViewIfNeeded(true)
    }
  }
  let focusOn = (idx) => {
    focusedIdx = idx
    if (focusedIdx > filesCount - 1) {
      focusedIdx = filesCount - 1
    }
    if (focusedIdx < 0) {
      focusedIdx = 0
    }
    scrollFocusedIntoView()
  }
  let onclick = (idx) => {
    onActivate()
    focusOn(idx)
  }
  let onrightclick = (idx) => {
    onActivate()
    focusOn(idx)
    flipSelected(idx)
  }
  let ondoubleclick = (idx) => {
    onActivate()
    focusOn(idx)
    enterCommand()
  }
  let pageSize = () => {
    if (!fileNodes[0] || !fileNodes[1] || !fileListNode) {
      return 16
    }
    let y0 = fileNodes[0].getBoundingClientRect().y
    let y1 = fileNodes[1].getBoundingClientRect().y
    let yh = fileListNode.getBoundingClientRect().height
    return Math.floor(yh / (y1 - y0))
  }
  let enterCommand = () => {
    if (focused?.type === "directory") {
      if (focused.name === "..") {
        initialFocus = directory.split("/").slice(-1)[0]
        directory = directory.split("/").slice(0, -1).join("/") || "/"
      } else {
        initialFocus = null
        directory += "/" + focused.name
      }
    }
  }
  let filySymbol = (file) => {
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
  let handleKey = (e) => {
    if (!active) {
      return
    }
    if (e.key === "ArrowDown") {
      focusOn(focusedIdx + 1)
    } else if (e.key === "ArrowUp") {
      focusOn(focusedIdx - 1)
    } else if (e.key === "PageDown") {
      focusOn(focusedIdx + pageSize())
    } else if (e.key === "PageUp") {
      focusOn(focusedIdx - pageSize())
    } else if (e.key === "Home") {
      focusOn(0)
    } else if (e.key === "End") {
      focusOn(filesCount - 1)
    } else if (e.key === " ") {
      flipSelected(focusedIdx)
      focusOn(focusedIdx + 1)
    } else if (e.key === "Enter") {
      enterCommand()
    } else {
      return
    }
    e.preventDefault()
  }
</script>

<div class="panel {position}" class:active={active}>
  <header>{directory.split("/").slice(-1)[0]}</header>
  <div class="file-list" bind:this={fileListNode}>
    {#each files as file, idx}
      <div
        class="file"
        class:focused={idx === focusedIdx}
        class:selected={selected.includes(idx)}
        on:click|preventDefault={() => onclick(idx)}
        on:contextmenu|preventDefault={() => onrightclick(idx)}
        on:dblclick|preventDefault={() => ondoubleclick(idx)}
        bind:this={fileNodes[idx]}
      >
      {filySymbol(file)}{file.name}
    </div>
    {/each}
  </div>
</div>

<svelte:window on:keydown={handleKey}/>

<style>
  .left {
    grid-area: panel-left;
  }
  .right {
    grid-area: panel-right;
  }
  .panel {
    background: #338;
    margin: 4px;
    display: flex;
    flex-direction: column;
  }
  header {
    text-align: center;
    font-weight: bold;
  }
  .file-list {
    flex: 1;
    overflow-y: scroll;
  }
  .file {
    cursor: pointer;
  }
  .file.selected {
    color: #ff2;
    font-weight: bold;
  }
  .panel.active .file.focused {
    background-color: #66b;
  }
</style>
