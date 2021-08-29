<script>
  import Command from "./Command.svelte"
  import { getContext } from "svelte"
  let { eventBus } = getContext("app")

  let pattern = ""

  let commands = [
    {name: "Cut", keys: ["F1"], action: ["activeBox", "cut"]},
    {name: "Copy", keys: ["F2"], action: ["activeBox", "copy"]},
    {name: "Paste", keys: ["F3"], action: ["activeBox", "paste"]},
    {name: "Quit", keys: ["F10"], action: ["app", "quit"]},
    {name: "Box 1", keys: ["1"], action: ["app", "changeBox", "box-1"]},
    {name: "Box 2", keys: ["2"], action: ["app", "changeBox", "box-2"]},
    {name: "Box 3", keys: ["3"], action: ["app", "changeBox", "box-3"]},
    {name: "Box 4", keys: ["4"], action: ["app", "changeBox", "box-4"]},
  ]

  $: matchingCommands = commands.filter(({name}) => checkMatch(pattern, name))

  function handleKey(event) {
    let {key} = event;

    if (key === "Enter") {
      event.preventDefault()
      eventBus.emit("app", "closePalette")
      if (matchingCommands[0]) {
        eventBus.emit(...matchingCommands[0].action)
      }
    }
    if (key === "Escape") {
      event.preventDefault()
      eventBus.emit("app", "closePalette")
    }
  }
  function checkMatch(pattern, name) {
    let parts = pattern.toLowerCase().replace(/[^a-z0-9]/, "")
    let rx = new RegExp(parts.split("").join(".*"))
    name = name.toLowerCase().replace(/[^a-z0-9]/, "")
    return rx.test(name)
  }
  function focus(el) {
    el.focus()
  }
</script>

<div class="palette">
  <input use:focus bind:value={pattern} placeholder="Search for command" on:keypress={handleKey}>
  <ul>
    {#each matchingCommands as command}
      <Command {...command} />
    {/each}
  </ul>
</div>

<style>
  .palette {
    font-size: 24px;
    font-weight: bold;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    margin: auto;
    max-width: 50vw;
    background-color: hsl(180,100%,25%);
    color: #333;
    box-shadow: 0px 0px 16px hsl(180,100%,10%);
  }

  input {
    background-color: inherit;
    font-size: inherit;
    font-weight: inherit;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
  }

  input::placeholder {
    color: #333;
    font-weight: normal;
  }

  ul {
    list-style: none;
    padding: 0;
  }
</style>
