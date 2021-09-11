<script>
  export let alt = false
  export let cmd = false
  export let ctrl = false
  export let shift = false
  export let key

  function keyName(key) {
    if (key === " ") {
      return "Space"
    } else {
      return key
    }
  }
</script>

<span class="shortcut">
  {#if alt}
    <span class="key">Alt</span>
  {/if}
  {#if cmd}
    <span class="key">Cmd</span>
  {/if}
  {#if ctrl}
    <span class="key">Ctrl</span>
  {/if}
  {#if shift}
    <span class="key">Shift</span>
  {/if}
  <span class="key">{keyName(key)}</span>
</span>

<style>
  .shortcut {
    display: flex;
    margin-left: 8px;
  }
  .key {
    display: inline-block;
    background-color: hsl(180,100%,30%);
    padding: 2px;
    border: 1px solid  hsl(180,100%,20%);
    border-radius: 20%;
  }
</style>
