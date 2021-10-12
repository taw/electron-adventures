<script>
  import TransformedText from "./TransformedText.svelte"
  import TransformDebugger from "./TransformDebugger.svelte"
  import TextTransforms from "./TextTransforms.js"

  let text = "Happy New Year 2022!"
  let debug = false
</script>

<div class="app">
  <header>Unicodizer!</header>
  <p>Text goes in. Fancy Unicode goes out. Enjoy.</p>

  <input bind:value={text} type="text">
  <p>
    <label>
      Debug mode
      <input bind:checked={debug} type="checkbox">
    </label>
  </p>

  {#if debug}
    <h2>Debug</h2>
    {#each TextTransforms as map}
      <TransformDebugger {map} />
    {/each}
  {/if}

  <h2>Fancy</h2>
  {#each TextTransforms as map}
    <TransformedText {map} {text} />
  {/each}
</div>

<style>
  :global(body) {
    background-color: #444;
    color: #fff;
  }

  .app {
    max-width: 80em;
    margin: auto;
    font-family: 'Noto Serif', serif;
  }

  input[type="text"] {
    width: 100%;
  }

  input[type="checkbox"] {
    margin-left: 1em;
  }

  header {
    font-size: 64px;
    text-align: center;
  }
</style>
