let { contextBridge } = require("electron")
let api = require("./preload/api")

contextBridge.exposeInMainWorld("api", api)
