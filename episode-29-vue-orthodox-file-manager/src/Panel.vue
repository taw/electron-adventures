<script>
  export default {
    name: "Panel",
    props: ["position", "files", "active"],
    data: (e) => {
      return {
        focused: e.$props.files[0],
        selected: [],
      }
    },
    methods: {
      onclick: function(file) {
        this.$data.focused = file
        this.$emit("activate")
      },
      onrightclick: function(file) {
        this.$data.focused = file
        this.$emit("activate")
        this.flipSelected(file)
      },
      flipSelected: function(file) {
        if (this.$data.selected.includes(file)) {
          this.$data.selected = this.$data.selected.filter(f => f !== file)
        } else {
          this.$data.selected = [...this.$data.selected, file]
        }
      },
      goUp: function() {
        let i = this.$props.files.indexOf(this.$data.focused)
        if (i > 0) {
          this.$data.focused = this.$props.files[i - 1]
        }
      },
      goDown: function() {
        let i = this.$props.files.indexOf(this.$data.focused)
        if (i < this.$props.files.length - 1) {
          this.$data.focused = this.$props.files[i + 1]
        }
      },
      handleKey: function(e) {
        if (!this.$props.active) {
          return
        }
        if (e.key === "ArrowDown") {
          e.preventDefault()
          this.goDown()
        }
        if (e.key === "ArrowUp") {
          e.preventDefault()
          this.goUp()
        }
        if (e.key === " ") {
          e.preventDefault()
          this.flipSelected(this.$data.focused)
          this.goDown()
        }
      },
    },
    mounted() {
      window.addEventListener("keydown", this.handleKey)
    },
  }
</script>

<template>
  <div v-bind:class="{
        panel: true,
        active: active,
        left: (position==='left'),
        right: (position==='right'),
      }">
    <div
      v-for="file in files"
      v-bind:class="{
        file: true,
        focused: (file === focused),
        selected: (selected.includes(file)),
      }"
      @click="() => onclick(file)"
      @contextmenu="() => onrightclick(file)"
    >
      {{file}}
    </div>
  </div>
</template>

<style>
  .left {
    grid-area: panel-left;
  }
  .right {
    grid-area: panel-right;
  }
  .panel {
    background: #338;
    margin: 4px;
  }
  .file {
    cursor: pointer;
  }
  .file.selected {
    color: #ff2;
    font-weight: bold;
  }
  .panel.active .file.focused {
    background-color: #66b;
  }
  .debug {
    max-width: 40vw;
  }
</style>
