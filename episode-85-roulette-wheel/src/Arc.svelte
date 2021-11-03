<script>
  export let cx=0, cy=0, r, a0, a1

  let x0 = cx + Math.sin(a0 * 2 * Math.PI / 360.0) * r
  let y0 = cy + Math.cos(a0 * 2 * Math.PI / 360.0) * r
  let x1 = cx + Math.sin(a1 * 2 * Math.PI / 360.0) * r
  let y1 = cy + Math.cos(a1 * 2 * Math.PI / 360.0) * r

  let arcSweep = (a1 - a0) <= 180 ? 0 : 1

  let d = `
    M ${cx} ${cy}
    L ${x0} ${y0}
    A ${r} ${r} 0 ${arcSweep} 0 ${x1} ${y1}
    Z
  `
</script>

<path {d}/>

<style>
  path {
    fill: green;
    stroke-width: 2;
    stroke: #fff;
  }
</style>
