<script>
  export let cx=0, cy=0, r, a, text

  let x = cx + Math.sin(a * 2 * Math.PI / 360.0) * r
  let y = cy + Math.cos(a * 2 * Math.PI / 360.0) * r
</script>

<g transform={`translate(${x},${y}) rotate(${180-a})`}>
  <text x={0} y={0} text-anchor="middle">{text}</text>
</g>

<style>
  text {
    font-size: 24px;
    font-family: sans-serif;
    fill: red;
  }
</style>
