let { app, BrowserWindow } = require("electron")

function createWindow() {
  let win = new BrowserWindow({
    webPreferences: {
      preload: `${__dirname}/preload.js`,
    },
  })
  win.maximize()
  if (app.isPackaged) {
    win.loadFile(`${__dirname}/public/index.html`)
  } else {
    win.loadURL("http://localhost:5000/")
  }
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  app.quit()
})
