<script>
  import Field from "./Field.svelte"
  let board

  function initBoard() {
    let pieces = [
      "♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜",
      "♟︎", "♟︎", "♟︎", "♟︎", "♟︎", "♟︎", "♟︎", "♟︎",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙",
      "♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖",
      "",
    ]
    board = []

    let items, cls

    for (let i=0; i<65; i++) {
      if (pieces[i] === "") {
        items = []
      } else {
        items = [{id: i, symbol: pieces[i]}]
      }
      if (i === 64) {
        cls = "offboard"
      } else if ((i&1) ^ (Math.floor(i/8) & 1)) {
        cls = "light"
      } else {
        cls = "dark"
      }
      board.push({items, cls})
    }
  }

  initBoard()
</script>

<div class="board">
  {#each board as field, i}
    <Field {...field} />
  {/each}
</div>

<style>
:global(body) {
  background-color: #aaa;
  color: #000;
  text-align: center;
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.board {
  display: grid;
  grid-template-columns: repeat(8, 100px);
  grid-template-rows: repeat(8, 100px) 50px 200px;
}
</style>
