let { app, BrowserWindow, ipcMain } = require("electron")

ipcMain.handle("console", (event, line) => {
  console.log(`Received from frontend: ${line}`)
  return `Backend confirms it received: ${line}`
})

function createWindow() {
  let win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  win.loadFile("index.html")
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  app.quit()
})
