let { app, BrowserWindow } = require("electron")

function createWindow() {
  let win = new BrowserWindow({height: 600, width: 800})
  win.loadFile(`${__dirname}/public/index.html`)
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  app.quit()
})
