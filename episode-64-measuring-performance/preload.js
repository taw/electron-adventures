let fs = require("fs")
let { contextBridge } = require("electron")

let data = fs.readFileSync(`${__dirname}/samples/64.bin`)

contextBridge.exposeInMainWorld(
  "api", { data }
)
