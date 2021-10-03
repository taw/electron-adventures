{app, BrowserWindow} = require("electron")

createWindow = ->
  win = new BrowserWindow
    webPreferences:
      preload: "#{__dirname}/preload.js"
  win.loadFile "#{__dirname}/../index.html"

app.on "ready", createWindow
app.on "window-all-closed", =>
  app.quit()
