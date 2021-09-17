let child_process = require("child_process")
let { contextBridge } = require("electron")

let runScript = (interpretter, code) => {
  return new Promise((resolve, reject) => {
    let output = ""
    let proc = child_process.spawn(
      interpretter,
      [],
      {
        shell: true,
        stdio: ["pipe", "pipe", "pipe"],
      },
    )
    proc.stdout.on("data", (data) => output += data.toString())
    proc.stderr.on("data", (data) => output += data.toString())
    proc.stdin.write(code)
    proc.stdin.end()
    proc.on("close", () => resolve(output))
  })
}

contextBridge.exposeInMainWorld(
  "api", { runScript }
)
