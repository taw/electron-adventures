<script>
  import {csvParseRows} from "d3-dsv"

  let data = csvParseRows(window.api.data)
  let fileName = window.api.path.split("/").slice(-1)[0]
  let title = `CSV Viewer - ${fileName}`
</script>

<h1>CSV Viewer</h1>

<table>
  {#each data as row}
    <tr>
      {#each row as column}
        <td>{column}</td>
      {/each}
    </tr>
  {/each}
</table>


<svelte:head>
  <title>{title}</title>
</svelte:head>

<style>
:global(body) {
  margin: 0;
  background-color: #444;
  color: #fff;
}
tr {
  text-align: center;
}
</style>
