let fs = require("fs")
let { contextBridge } = require("electron")

let data = fs.readFileSync(`${__dirname}/sample.bin`)

contextBridge.exposeInMainWorld(
  "api", { data }
)
