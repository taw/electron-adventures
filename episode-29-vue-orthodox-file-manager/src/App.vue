<script>
  import Panel from "./Panel.vue"
  import Footer from "./Footer.vue"

  export default {
    name: "App",
    components: {
      Panel,
      Footer,
    },
    data: () => ({
      filesLeft: [
        "Cat.js",
        "ipsum.js",
        "dolor.js",
        "sit.js",
        "amet.js",
        "walk.js",
        "on.js",
        "keyboard.js",
        "hide.js",
        "when.js",
        "guests.js",
        "come.js",
        "over.js",
        "play.js",
        "with.js",
        "twist.js",
        "ties.js",
      ],
      filesRight: [
        "Ask.png",
        "to.png",
        "be.png",
        "pet.png",
        "then.png",
        "attack.png",
        "owners.png",
        "hand.png",
        "need.png",
        "to.jpg",
        "chase.png",
        "tail.png",
      ],
      activePanel: "left",
    }),
    methods: {
      activateLeft: function() {
        this.$data.activePanel = "left"
      },
      activateRight: function() {
        this.$data.activePanel = "right"
      },
      handleKey: function(e) {
        if (e.key === "Tab") {
          e.preventDefault()
          if (this.$data.activePanel === "left") {
            this.$data.activePanel = "right"
          } else {
            this.$data.activePanel = "left"
          }
        }
      }
    },
    mounted() {
      window.addEventListener("keydown", this.handleKey)
    },
  }
</script>

<template>
  <div class="ui">
    <header>
      File Manager
    </header>
    <Panel
      v-bind:files=filesLeft
      position="left"
      v-bind:active="(activePanel === 'left')"
      @activate="activateLeft"
    />
    <Panel
      v-bind:files=filesRight
      position="right"
      v-bind:active="(activePanel === 'right')"
      @activate="activateRight"
    />
    <Footer />
  </div>
</template>

<style global>
  body{
    background-color: #226;
    color: #fff;
    font-family: monospace;
    margin: 0;
    font-size: 16px;
  }
</style>

<style>
  .ui {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-areas:
      "header header"
      "panel-left panel-right"
      "footer footer";
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr auto;
  }
  .ui header {
    grid-area: header;
  }
  header {
    font-size: 24px;
    margin: 4px;
  }
</style>
