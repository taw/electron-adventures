let { app, BrowserWindow } = require("electron")

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit()
}

function createWindow() {
  let win = new BrowserWindow({
    webPreferences: {
      preload: `${__dirname}/preload.js`,
    },
  })
  win.loadFile(`${__dirname}/index.html`)
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  app.quit()
})
