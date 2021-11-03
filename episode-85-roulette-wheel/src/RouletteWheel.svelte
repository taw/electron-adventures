<script>
  import Arc from "./Arc.svelte"
  import ArcLabel from "./ArcLabel.svelte"

  export let options
  export let r
  export let onRolled

  let sliceCount = options.length
  let sliceSize = 360 / sliceCount

  let angle = sliceSize / 2
  let rolledOption

  function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function randfloat(min, max) {
    return Math.random() * (max - min) + min
  }

  function roundUp(x, z) {
    return Math.ceil(x / z) * z
  }

  function click() {
    let roll = randint(0, sliceCount-1)
    let rollPlace = randfloat(0.2*sliceSize, 0.8*sliceSize)
    let finalAngle = roll * sliceSize + rollPlace
    let spins = randint(2, 3)
    angle = roundUp(angle, 360) + spins * 360 + finalAngle
    rolledOption = options[roll]
  }

  function transitionend() {
    onRolled(rolledOption)
  }
</script>

<g transform={`rotate(${angle})`} on:click={click} on:transitionend={transitionend}>
  {#each options as opt, i}
    <Arc r={r} a0={sliceSize*i} a1={sliceSize*(i+1)} />
  {/each}
  {#each options as opt, i}
    <ArcLabel r={r*2.0/3.0} a={sliceSize*(i+0.5)} text={opt} />
  {/each}
</g>

<style>
g {
  transition: 3s ease-out;
}
</style>
