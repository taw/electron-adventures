let fs = require("fs")
let path = require("path")
let { app, BrowserWindow } = require("electron")

let imageDir
let argv = process.argv

if (argv.length >= 3) {
  imageDir = argv[2]
} else {
  imageDir = `${__dirname}/images`
}

let findImages = (dir) => {
  let files = fs.readdirSync(dir)
  files.sort()
  return files
    .filter(x => /\.(png|jpg|jpeg|gif)/i.test(x))
    .map(x => path.join(dir, x))
}

let html = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { background-color: black; color: white; }
      img { padding: 10px; }
    </style>
  </head>
  <body>
    <h1>Image Gallery</h1>
    ${ findImages(imageDir).map(x => `<img src="file://${x}" />`).join("") }
  </body>
</html>
`

function createWindow() {
  let win = new BrowserWindow({webPreferences: { webSecurity: false }})
  win.maximize()
  win.loadURL(`data:text/html;charset=utf-8,${encodeURI(html)}`)
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  app.quit()
})
