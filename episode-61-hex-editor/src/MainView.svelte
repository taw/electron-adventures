<div class="main">
  <table>
    {#each {length: 200} as _}
      <tr>
        <td class="offset">012345</td>
        <td class="hex">01 23 34 45</td>
        <td class="hex">01 23 34 45</td>
        <td class="hex">01 23 34 45</td>
        <td class="hex">01 23 34 45</td>
        <td class="ascii">abcdefghijklmnop</td>
      </tr>
    {/each}
  </table>
</div>

<style>
  .main {
    flex: 1 1 auto;
    overflow-y: auto;
  }
  table {
    width: 100%;
  }
  tr:nth-child(even) {
    background-color: #555;
  }
</style>
