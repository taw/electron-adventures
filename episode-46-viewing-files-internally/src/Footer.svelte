<script>
  import { getContext } from "svelte"
  let { eventBus } = getContext("app")

  let app = eventBus.target("app")
  let activePanel = eventBus.target("activePanel")
</script>

<footer>
  <button>F1 Help</button>
  <button on:click={() => app.openPalette()}>F2 Menu</button>
  <button on:click={() => activePanel.viewFocusedFile()}>F3 View</button>
  <button on:click={() => activePanel.editFocusedFile()}>F4 Edit</button>
  <button>F5 Copy</button>
  <button>F6 Move</button>
  <button>F7 Mkdir</button>
  <button>F8 Delete</button>
  <button on:click={() => app.quit()}>F10 Quit</button>
</footer>

<svelte:window />

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
