<script>
  import commands from "./commands.js"
  import { getContext } from "svelte"

  export let active

  let { eventBus } = getContext("app")

  function handleKey(e) {
    if (!active) {
      return
    }
    for (let command of commands) {
      if (command.key === e.key) {
        e.preventDefault()
        e.stopPropagation()
        eventBus.emit(...command.action)
      }
    }
  }
</script>

<svelte:window on:keydown={handleKey} />
