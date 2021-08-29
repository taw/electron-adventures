<script>
  import { getContext } from "svelte"
  let { eventBus } = getContext("app")
</script>

<footer>
  <button on:click={() => eventBus.emit("app", "changeBox", "box-1")}>Box 1</button>
  <button on:click={() => eventBus.emit("app", "changeBox", "box-2")}>Box 2</button>
  <button on:click={() => eventBus.emit("app", "changeBox", "box-3")}>Box 3</button>
  <button on:click={() => eventBus.emit("app", "changeBox", "box-4")}>Box 4</button>
  <button on:click={() => eventBus.emit("activeBox", "cut")}>F1 Cut</button>
  <button on:click={() => eventBus.emit("activeBox", "copy")}>F2 Copy</button>
  <button on:click={() => eventBus.emit("activeBox", "paste")}>F3 Paste</button>
  <button on:click={() => eventBus.emit("app", "openPalette")}>F5 Palette</button>
  <button on:click={() => eventBus.emit("app", "quit")}>F10 Quit</button>
</footer>

<style>
  footer {
    grid-column-start: span 2;
    text-align: center;
  }
  button {
    font-size: 24px;
    font-weight: bold;
    color: inherit;
    background-color: hsl(180,100%,40%);
    font-family: inherit;
  }
</style>
