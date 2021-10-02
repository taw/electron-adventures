{ contextBridge } = require("electron")

contextBridge.exposeInMainWorld(
  "api",
  versions: process.versions
)
