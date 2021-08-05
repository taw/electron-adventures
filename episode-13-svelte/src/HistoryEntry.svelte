<script>
  export let command, output
</script>

<div class='input-line'>
  <span class='prompt'>$</span>
  <span class='input'>{command}</span>
</div>
<div class='output'>{output}</div>

<style>
  .output {
    color: #afa;
    white-space: pre;
    padding-bottom: 0.5rem;
  }

  .input-line {
    display: flex;
    gap: 0.5rem;
  }

  .input {
    color: #ffa;
    flex: 1;
  }
</style>
