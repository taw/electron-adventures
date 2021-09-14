<script>
  import CommandPalette from "./CommandPalette.svelte"
  import DeleteDialog from "./DeleteDialog.svelte"
  import MkdirDialog from "./MkdirDialog.svelte"

  let {type, ...otherProps} = $$props

  let component = {CommandPalette, MkdirDialog, DeleteDialog}
</script>

<div>
  <svelte:component this={component[type]} {...otherProps}/>
</div>

<style>
  div {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    margin: auto;
    padding: 8px;
    max-width: 50vw;
    background: #338;
    box-shadow: 0px 0px 24px #004;
  }
</style>
