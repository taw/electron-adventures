let { app, BrowserWindow } = require("electron")

function createWindow() {
  let win = new BrowserWindow({})
  win.maximize()
  win.loadURL("http://localhost:8080/")
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  app.quit()
})
