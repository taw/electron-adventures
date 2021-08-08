let child_process = require("child_process")
let { contextBridge } = require("electron")

let runCommand = ({command, onout, onerr, ondone}) => {
  const proc = child_process.spawn(
    command,
    [],
    {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    },
  )
  proc.stdout.on("data", (data) => onout(data.toString()))
  proc.stderr.on("data", (data) => onerr(data.toString()))
  proc.on("close", (code) => ondone(code))
  return {
    kill: () => proc.kill(),
    input: (data) => proc.stdin.write(data),
    endInput: () => proc.stdin.end(),
  }
}

contextBridge.exposeInMainWorld(
  "api", { runCommand }
)
