<script>
  export default {
    name: "Footer"
  }
</script>

<template>
  <footer>
    <button>F1 Help</button>
    <button>F2 Menu</button>
    <button>F3 View</button>
    <button>F4 Edit</button>
    <button>F5 Copy</button>
    <button>F6 Move</button>
    <button>F7 Mkdir</button>
    <button>F8 Delete</button>
    <button>F10 Quit</button>
  </footer>
</template>

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
