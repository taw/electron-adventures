let { app, BrowserWindow } = require("electron")

function createWindow() {
  let win = new BrowserWindow({})
  win.maximize()
  win.loadURL("http://localhost:3000/")
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  app.quit()
})
