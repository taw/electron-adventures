<script>
  import { getContext } from "svelte"
  let { eventBus, activeBox, clipboard } = getContext("app")

  export let id
  let text = "A"

  function onClick() {
    eventBus.emit("app", "changeBox", id)
  }
  function letter(key)  {
    text += key
  }
  function backspace() {
    text = text.slice(0, -1)
  }
  function cut() {
    clipboard.set(text)
    text = ""
  }
  function copy() {
    clipboard.set(text)
  }
  function paste() {
    text = $clipboard
  }

  eventBus.handle(id, {letter, backspace, cut, copy, paste})

  $: active = ($activeBox === id)
</script>

<div class="box" class:active on:click={onClick}>
  {text}
</div>

<style>
.box {
  font-size: 48px;
  font-weight: bold;
  background-color: hsl(180,100%,30%);
  display: flex;
  justify-content: center;
  align-items: center;
}
.box.active {
  background-color: hsl(180,100%,40%);
}
</style>
