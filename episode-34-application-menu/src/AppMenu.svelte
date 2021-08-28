<script>
  import { onMount, getContext } from "svelte"
  let { eventBus } = getContext("app")

  function handleMenuEvent(event, ...args) {
    eventBus.emit(...args)
  }

  onMount(() => {
    window.api.onMenuEvent(handleMenuEvent)
  })
</script>
