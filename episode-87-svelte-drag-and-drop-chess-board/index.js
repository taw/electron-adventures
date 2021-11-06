let { app, BrowserWindow } = require("electron")
let settings = require("electron-settings")

let windowState = settings.getSync("windowState") || {width: 800, height: 600}

function createWindow() {
  let win = new BrowserWindow({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    webPreferences: {
      preload: `${__dirname}/preload.js`,
    },
  })

  function saveSettings() {
    windowState = win.getBounds()
    settings.setSync("windowState", windowState)
  }

  win.on("resize", saveSettings)
  win.on("move", saveSettings)
  win.on("close", saveSettings)

  win.loadURL("http://localhost:5000/")
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  app.quit()
})
