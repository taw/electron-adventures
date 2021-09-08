<script>
  import commands from "./commands.js"
  import { getContext } from "svelte"

  export let active

  let { eventBus } = getContext("app")

  function matchingShortcut(e, shortcut) {
    return (
      (shortcut.key.toLowerCase() === e.key.toLowerCase()) &&
      ((!!shortcut.ctrl) === e.ctrlKey) &&
      ((!!shortcut.alt) === e.altKey) &&
      ((!!shortcut.shift) === e.shiftKey) &&
      ((!!shortcut.cmd) === e.metaKey)
    )
  }

  function handleKey(e) {
    if (!active) {
      return
    }
    for (let command of commands) {
      for (let shortcut of command.shortcuts) {
        if (matchingShortcut(e, shortcut)) {
          e.preventDefault()
          e.stopPropagation()
          eventBus.emit(...command.action)
          return
        }
      }
    }
  }
</script>

<svelte:window on:keydown={handleKey} />
