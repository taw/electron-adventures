<script>
  export let data

  let ascii = ""
  for (let d of data) {
    if (d >= 32 && d <= 126) {
      ascii += String.fromCharCode(d)
    } else {
      ascii += "\xB7"
    }
  }
</script>

<span class="ascii">{ascii}</span>
