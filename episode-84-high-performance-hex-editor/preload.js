let fs = require("fs")
let { contextBridge } = require("electron")

let q = new URLSearchParams(window.location.search)

let path = q.get("path")
let data = fs.readFileSync(path)

contextBridge.exposeInMainWorld(
  "api", { path, data }
)
