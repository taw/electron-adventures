let { app, BrowserWindow, ipcMain } = require("electron")

ipcMain.handle("increment", (event, x) => (x+1))

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
