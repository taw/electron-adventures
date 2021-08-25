<script>
  export let position
  export let directory
  export let active
  export let onActivate

  let files = []
  let selected = []
  let focusedIdx = 0
  let fileNodes = []
  let fileListNode

  $: filesPromise = window.api.directoryContents(directory)
  $: filesPromise.then(x => {
    files = x
    focusedIdx = 0
    selected = []
  })
  $: filesCount = files.length

  let flipSelected = (idx) => {
    if (selected.includes(idx)) {
      selected = selected.filter(f => f !== idx)
    } else {
      selected = [...selected, idx]
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
    if (fileNodes[focusedIdx]) {
      fileNodes[focusedIdx].scrollIntoViewIfNeeded(true)
    }
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
  let pageSize = () => {
    if (!fileNodes[0] || !fileNodes[1] || !fileListNode) {
      return 16
    }
    let y0 = fileNodes[0].getBoundingClientRect().y
    let y1 = fileNodes[1].getBoundingClientRect().y
    let yh = fileListNode.getBoundingClientRect().height
    return Math.floor(yh / (y1 - y0))
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
        bind:this={fileNodes[idx]}
      >{file.name}</div>
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
