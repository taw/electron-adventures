let child_process = require("child_process")
let { app, BrowserWindow } = require("electron")

let runCommand = (command) => {
  return child_process.execSync(command).toString().trim()
}

let toQueryString = (obj) => {
  let q = []
  for (let key in obj) {
    q.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
  }
  return q.join("&")
}

let sysInfo = {
  os: runCommand("uname -s"),
  cpu: runCommand("uname -m"),
  hostname: runCommand("hostname -s"),
  ip: runCommand("ipconfig getifaddr en0"),
}

function createWindow() {
  let win = new BrowserWindow({})
  win.maximize()
  win.loadURL(`file:${__dirname}/index.html?${toQueryString(sysInfo)}`)
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  app.quit()
})
