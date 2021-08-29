<script>
  import commands from "./commands.js"
  import { getContext } from "svelte"
  let { eventBus } = getContext("app")

  function handleKey(e) {
    for (let command of commands) {
      if (command.key === e.key) {
        e.preventDefault()
        eventBus.emit(...command.action)
      }
    }
  }
</script>

<svelte:window on:keydown={handleKey} />
