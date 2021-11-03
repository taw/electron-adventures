<script>
  import RouletteWheel from "./RouletteWheel.svelte"

  function onRolled(opt) {
    console.log(opt)
  }
</script>

<div>
  <svg height="400" width="400">
    <g transform="translate(200,200)">
      <RouletteWheel
        r={150}
        options={[1,2,3,4,5,6,7,8,9,10,11,12]}
        onRolled={onRolled}
      />
    </g>
    <polygon points="200 360 210 370 190 370"/>
  </svg>
</div>

<style>
:global(body) {
  background-color: #444;
  color: #fff;
  margin: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}

svg {
  display: block;
}

polygon {
  fill: yellow;
}
</style>
