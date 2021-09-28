let fs = require("fs")
let { contextBridge } = require("electron")

let data = fs.readFileSync(`${__dirname}/samples/256.bin`)

contextBridge.exposeInMainWorld(
  "api", { data }
)
