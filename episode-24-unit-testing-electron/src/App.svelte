<script>
  let directory = window.api.currentDirectory()
  $: filesPromise = window.api.directoryContents(directory)
  $: isRoot = (directory === "/")

  function navigate(path) {
    if (directory === "/") {
      directory = "/" + path
    } else {
      directory += "/" + path
    }
  }
  function navigateUp() {
    directory = directory.split("/").slice(0, -1).join("/") || "/"
  }
  function formatDate(d) {
    return d ? d.toDateString() : ""
  }
  function formatName(entry) {
    if (entry.linkTarget) {
      return `${entry.name} → ${entry.linkTarget}`
    } else {
      return entry.name
    }
  }
</script>

<h1>{directory}</h1>

{#await filesPromise}
{:then files}
  <div class="file-list">
    {#if !isRoot}
      <div><button on:click={() => navigateUp()}>..</button></div>
      <div></div>
      <div></div>
      <div></div>
    {/if}
    {#each files as entry}
      <div>
        {#if entry.type === "directory"}
          <button on:click={() => navigate(entry.name)}>
            {formatName(entry)}
          </button>
        {:else}
          {formatName(entry)}
        {/if}
      </div>
      <div>
        {entry.type}
        {entry.linkTarget ? " link" : ""}
      </div>
      <div>{entry.size ? entry.size : ""}</div>
      <div>{formatDate(entry.mtime)}</div>
    {/each}
  </div>
{/await}

<style>
  :global(body) {
    background-color: #444;
    color: #ccc;
  }
  .file-list {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr;
  }
</style>
