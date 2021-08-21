<script>
  export let position
  export let files
  export let active
  export let onActivate

  let focused = files[0]
  let selected = []
  let onclick = (file) => {
    onActivate(position)
    focused = file
  }
  let onrightclick = (file) => {
    onActivate(position)
    focused = file
    flipSelected(file)
  }
  let flipSelected = (file) => {
    if (selected.includes(file)) {
      selected = selected.filter(f => f !== file)
    } else {
      selected = [...selected, file]
    }
  }
  let goUp = () => {
    let i = files.indexOf(focused)
    if (i > 0) {
      focused = files[i - 1]
    }
  }
  let goDown = () => {
    let i = files.indexOf(focused)
    if (i < files.length - 1) {
      focused = files[i + 1]
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
      flipSelected(focused)
      goDown()
    }
  }
</script>

<div class="panel {position}" class:active={active}>
  {#each files as file}
    <div
      class="file"
      class:focused={file === focused}
      class:selected={selected.includes(file)}
      on:click|preventDefault={() => onclick(file)}
      on:contextmenu|preventDefault={() => onrightclick(file)}
    >{file}</div>
  {/each}
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
