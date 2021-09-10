<script>
  export let mode

  import commands from "./commands.js"
  import { getContext } from "svelte"

  let { eventBus } = getContext("app")

  function matchingShortcut(e, shortcut) {
    return (
      (shortcut.key.toLowerCase() === e.key.toLowerCase()) &&
      ((!!shortcut.ctrl) === (!!e.ctrlKey)) &&
      ((!!shortcut.alt) === (!!e.altKey)) &&
      ((!!shortcut.shift) === (!!e.shiftKey)) &&
      ((!!shortcut.cmd) === (!!e.metaKey))
    )
  }

  function findMatch(e) {
    for (let command of commands[mode]) {
      for (let shortcut of command.shortcuts) {
        if (matchingShortcut(e, shortcut)) {
          return command.action
        }
      }
    }
  }

  function handleKey(e) {
    let action = findMatch(e)
    if (action) {
      e.preventDefault()
      e.stopPropagation()
      eventBus.emit(...action)
    }
  }

  function fakeKey(e) {
    let action = findMatch(e)
    if (action) {
      eventBus.emit(...action)
    }
  }

  eventBus.handle("keyboard", {fakeKey})
</script>

<svelte:window on:keydown={handleKey} />
