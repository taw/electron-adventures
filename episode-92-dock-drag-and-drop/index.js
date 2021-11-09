let { app, BrowserWindow, dialog, Menu } = require("electron")
let settings = require("electron-settings")
let log = require("electron-log")

let isOSX = (process.platform === "darwin")

function createWindow(path) {
  log.info("Creating window for", path)
  let key = `windowState-${path}`
  let windowState = settings.getSync(key) || { width: 1024, height: 768 }

  let qs = new URLSearchParams({ path }).toString()
  let win = new BrowserWindow({
    ...windowState,
    webPreferences: {
      preload: `${__dirname}/preload.js`,
    },
  })

  function saveSettings() {
    windowState = win.getBounds()
    log.info("Saving window position", path, windowState)
    settings.setSync(key, windowState)
  }

  win.on("resize", saveSettings)
  win.on("move", saveSettings)
  win.on("close", saveSettings)

  if (app.isPackaged) {
    win.loadFile(`${__dirname}/public/index.html`, {query: {path}})
  } else {
    win.loadURL(`http://localhost:5000/?${qs}`)
  }
}

async function openFiles() {
  let { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections", "showHiddenFiles"],
    filters: [
      { name: "CSV files", extensions: ["csv"] },
      { name: "All Files", extensions: ["*"] }
    ],
    message: "Select a CSV file to open",
    defaultPath: `${__dirname}/samples`,
  })
  if (canceled && !isOSX) {
    app.quit()
  }
  for (let path of filePaths) {
    createWindow(path)
  }
}

let dockMenu = Menu.buildFromTemplate([
  {
    label: "Open files",
    click() { openFiles() }
  }
])

async function startApp() {
  if (isOSX) {
    app.dock.setMenu(dockMenu)
  }
  await openFiles()
  if (isOSX) {
    app.on("activate", function() {
      if (BrowserWindow.getAllWindows().length === 0) {
        openFiles()
      }
    })
  }
}

app.on("window-all-closed", () => {
  if (!isOSX) {
    app.quit()
  }
})

app.on("ready", startApp)

app.on("open-file", (event, path) => {
  log.info("Opening file through drag and drop to Dock", path)
  createWindow(path)
})
