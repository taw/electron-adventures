<script>
  import { getContext } from "svelte"
  let { eventBus } = getContext("app")

  let keyboard = eventBus.target("keyboard")
  function click(key) {
    keyboard.fakeKey({key})
  }
</script>

<footer>
  <button on:click|preventDefault={() => click("F1")}>F1 Help</button>
  <button on:click|preventDefault={() => click("F2")}>F2 Menu</button>
  <button on:click|preventDefault={() => click("F3")}>F3 View</button>
  <button on:click|preventDefault={() => click("F4")}>F4 Edit</button>
  <button on:click|preventDefault={() => click("F5")}>F5 Copy</button>
  <button on:click|preventDefault={() => click("F6")}>F6 Move</button>
  <button on:click|preventDefault={() => click("F7")}>F7 Mkdir</button>
  <button on:click|preventDefault={() => click("F8")}>F8 Delete</button>
  <button on:click|preventDefault={() => click("F10")}>F10 Quit</button>
</footer>

<style>
  footer {
    text-align: center;
    grid-area: footer;
  }

  button {
    font-family: inherit;
    font-size: inherit;
    background-color: #66b;
    color: inherit;
  }
</style>
