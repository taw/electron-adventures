let child_process = require("child_process")
let { contextBridge } = require("electron")

let runCommand = (command) => {
  return new Promise((resolve, reject) => {
    child_process.exec(command, (error, stdout, stderr) => {
      resolve({stdout, stderr, error})
    })
  })
}

contextBridge.exposeInMainWorld(
  "api", { runCommand }
)
