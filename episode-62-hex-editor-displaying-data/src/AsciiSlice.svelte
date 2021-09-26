<script>
  export let data
</script>

<td class="ascii">
  {#each data as d}
    {#if d >= 33 && d <= 126}
      {String.fromCharCode(d)}
    {:else if d == 32}
      &nbsp;
    {:else}
      <span class="unprintable">.</span>
    {/if}
  {/each}
</td>

<style>
  .unprintable {
    color: #aaa;
  }
</style>
