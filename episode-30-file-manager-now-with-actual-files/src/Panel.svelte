<script>
  export let position
  export let directory
  export let active
  export let onActivate

  let files = []
  let selected = []
  let focusedIdx = 0

  $: filesPromise = window.api.directoryContents(directory)
  $: filesPromise.then(x => {
    files = x
    focusedIdx = 0
    selected = []
  })
  $: filesCount = files.length

  let onclick = (idx) => {
    onActivate()
    focusedIdx = idx
  }
  let onrightclick = (idx) => {
    onActivate()
    focusedIdx = idx
    flipSelected(idx)
  }
  let flipSelected = (idx) => {
    if (selected.includes(idx)) {
      selected = selected.filter(f => f !== idx)
    } else {
      selected = [...selected, idx]
    }
  }
  let goUp = () => {
    if (focusedIdx > 0) {
      focusedIdx -= 1
    }
  }
  let goDown = () => {
    if (focusedIdx < filesCount - 1) {
      focusedIdx += 1
    }
  }
  let handleKey = (e) => {
    if (!active) {
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      goDown()
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      goUp()
    }
    if (e.key === " ") {
      e.preventDefault()
      flipSelected(focusedIdx)
      goDown()
    }
  }
</script>

<div class="panel {position}" class:active={active}>
  <header>{directory.split("/").slice(-1)[0]}</header>
  <div class="file-list">
    {#each files as file, idx}
      <div
        class="file"
        class:focused={idx === focusedIdx}
        class:selected={selected.includes(idx)}
        on:click|preventDefault={() => onclick(idx)}
        on:contextmenu|preventDefault={() => onrightclick(idx)}
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
