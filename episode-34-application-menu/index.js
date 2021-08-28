let { app, BrowserWindow, Menu } = require("electron")
let { menu } = require("./main/menu")

function createWindow() {
  let win = new BrowserWindow({
    webPreferences: {
      preload: `${__dirname}/preload.js`,
    },
  })
  win.maximize()
  win.loadURL("http://localhost:5000/")
}

Menu.setApplicationMenu(menu)

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  app.quit()
})
