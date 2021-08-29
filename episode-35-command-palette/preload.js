let { contextBridge, ipcRenderer } = require("electron")

let onMenuEvent = (callback) => {
  ipcRenderer.on("menuevent", callback)
}

contextBridge.exposeInMainWorld(
  "api", { onMenuEvent }
)
