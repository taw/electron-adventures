let { app, BrowserWindow, dialog } = require("electron")
let settings = require("electron-settings")

function createWindow(path) {
  let key = `windowState-${path}`
  let windowState = settings.getSync(key) || { width: 1024, height: 768 }

  let qs = new URLSearchParams({ path }).toString();
  let win = new BrowserWindow({
    ...windowState,
    webPreferences: {
      preload: `${__dirname}/preload.js`,
    },
  })

  function saveSettings() {
    windowState = win.getBounds()
    console.log("SAVING", path, windowState)
    settings.setSync(key, windowState)
  }

  win.on("resize", saveSettings)
  win.on("move", saveSettings)
  win.on("close", saveSettings)

  win.loadURL(`http://localhost:5000/?${qs}`)
}

async function startApp() {
  let { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections", "showHiddenFiles"],
    filters: [
      { name: "CSV files", extensions: ["csv"] },
      { name: "All Files", extensions: ["*"] }
    ],
    message: "Select a CSV file to open",
    defaultPath: `${__dirname}/samples`,
  })
  if (canceled) {
    app.quit()
  }
  for (let path of filePaths) {
    createWindow(path)
  }
}

app.on("ready", startApp)

app.on("window-all-closed", () => {
  app.quit()
})
