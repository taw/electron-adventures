<script>
  import CommandPalette from "./CommandPalette.svelte"
  import DeleteDialog from "./DeleteDialog.svelte"
  import MkdirDialog from "./MkdirDialog.svelte"
  import ErrorDialog from "./ErrorDialog.svelte"

  let component = {CommandPalette, MkdirDialog, DeleteDialog, ErrorDialog}

  export let type
  export let data = {}
</script>

<div>
  <svelte:component this={component[type]} {...data}/>
</div>

<style>
  div {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    margin: auto;
    max-width: 50vw;
  }
</style>
