let { ipcRenderer } = require("electron")

let localIncrement = (x) => (x+1)

let benchmarkLocal = async () => {
  let startTime = new Date()
  let x = 0;
  while (x < 100_000_000) {
    x = localIncrement(x)
  }
  let endTime = new Date()
  return endTime - startTime
}

let benchmarkIPC = async () => {
  let startTime = new Date()
  let x = 0;
  while (x < 10_000) {
    x = await ipcRenderer.invoke("increment", x)
  }
  let endTime = new Date()
  return endTime - startTime
}

let runBenchmark = async () => {
  let results = document.querySelector("#results")
  results.textContent = `
    10k IPC calls took: ${await benchmarkIPC()}ms
    100M local calls took: ${await benchmarkLocal()}ms
  `
}

runBenchmark()
