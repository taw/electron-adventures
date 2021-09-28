let fs = require("fs")
let { contextBridge } = require("electron")

let data = fs.readFileSync(`${__dirname}/samples/1024.bin`)

contextBridge.exposeInMainWorld(
  "api", { data }
)
