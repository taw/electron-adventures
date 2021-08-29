<script>
  export let active

  import { getContext } from "svelte"
  let { eventBus } = getContext("app")

  function handleKey({key}) {
    if (!active) {
      return
    }
    if (key.match(/^[1234]$/)) {
      eventBus.emit("app", "changeBox", `box-${key}`)
    }
    if (key.match(/^[a-zA-Z]$/)) {
      eventBus.emit("activeBox", "letter", key)
    }
    if (key === "Backspace") {
      eventBus.emit("activeBox", "backspace", key)
    }
    if (key === "F1") {
      eventBus.emit("activeBox", "cut")
    }
    if (key === "F2") {
      eventBus.emit("activeBox", "copy")
    }
    if (key === "F3") {
      eventBus.emit("activeBox", "paste")
    }
    if (key === "F5") {
      eventBus.emit("app", "openPalette")
    }
    if (key === "F10") {
      eventBus.emit("app", "quit")
    }
  }
</script>

<svelte:window on:keydown={handleKey} />
