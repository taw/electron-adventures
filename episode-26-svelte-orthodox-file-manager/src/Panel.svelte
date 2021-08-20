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
    if (selected.includes(file)) {
      selected = selected.filter(f => f !== file)
    } else {
      selected = [...selected, file]
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
