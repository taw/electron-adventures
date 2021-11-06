let { app, BrowserWindow, dialog } = require("electron")

async function createWindow() {
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
    let qs = new URLSearchParams({ path }).toString();
    let win = new BrowserWindow({
      width: 1024,
      height: 768,
      webPreferences: {
        preload: `${__dirname}/preload.js`,
      },
    })
    win.loadURL(`http://localhost:5000/?${qs}`)
  }
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  app.quit()
})
