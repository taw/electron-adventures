let child_process = require("child_process")
let { app, BrowserWindow } = require("electron")

let runCommand = (command) => {
  return child_process.execSync(command).toString().trim()
}

function df() {
  let output = runCommand("df -kP")
  let rows = output
    .split(/[\r\n]+/)
    .slice(1)
  return rows.map(row => (
    row
      .replace(/\s+(\d+)/g, '\t$1')
      .replace(/\s+\//g, '\t/')
      .split(/\t/)
  ))
}

function createWindow() {
  let payload = JSON.stringify(df())
  let win = new BrowserWindow({})
  win.maximize()
  win.loadFile("index.html")

  win.webContents.on('did-finish-load', function () {
    win.webContents.executeJavaScript(`displayFreeDiskSpace(${payload})`);
  });
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  app.quit()
})
