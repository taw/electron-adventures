let { Menu } = require("electron")

let isMac = process.platform === "darwin"
let defaultMenuTemplate = [
  ...(isMac ? [{ role: "appMenu" }] : []),
  { role: "fileMenu" },
  { role: "editMenu" },
  { role: "viewMenu" },
  { role: "windowMenu" },
]

let extraMenuTemplate = [
  {
    label: "Box",
    submenu: [
      {
        label: "Box 1",
        click: (item, window) => window.webContents.send("menuevent", "app", "changeBox", "box-1"),
      },
      {
        label: "Box 2",
        click: (item, window) => window.webContents.send("menuevent", "app", "changeBox", "box-2"),
      },
      {
        label: "Box 3",
        click: (item, window) => window.webContents.send("menuevent", "app", "changeBox", "box-3"),
      },
      {
        label: "Box 4",
        click: (item, window) => window.webContents.send("menuevent", "app", "changeBox", "box-4"),
      },
    ],
  },
  {
    label: "BoxEdit",
    submenu: [
      {
        label: "Cut",
        click: (item, window) => window.webContents.send("menuevent", "activeBox", "cut"),
      },
      {
        label: "Copy",
        click: (item, window) => window.webContents.send("menuevent", "activeBox", "copy"),
      },
      {
        label: "Paste",
        click: (item, window) => window.webContents.send("menuevent", "activeBox", "paste"),
      },
    ],
  },
]

let menu = Menu.buildFromTemplate([
  ...defaultMenuTemplate,
  ...extraMenuTemplate ,
])

module.exports = {menu}
