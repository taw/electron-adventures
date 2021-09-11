export default {
  default: [
    {
      shortcuts: [{key: "F2"}, {key: "P", cmd: true, shift: true}],
      action: ["app", "openPalette"]
    },
    {
      name: "Close Palette",
      shortcuts: [{key: "Escape"}],
      action: ["app", "closePalette"],
    },
    {
      name: "Enter Directory",
      shortcuts: [{key: "Enter"}],
      action: ["activePanel", "activateItem"],
    },
    {
      name: "Flip Selection",
      shortcuts: [{key: " "}],
      action: ["activePanel", "flipItem"],
    },
    {
      name: "Go to First File",
      shortcuts: [{key: "Home"}],
      action: ["activePanel", "firstItem"],
    },
    {
      name: "Go to Last File",
      shortcuts: [{key: "End"}],
      action: ["activePanel", "lastItem"],
    },
    {
      name: "Go to Next File",
      shortcuts: [{key: "ArrowDown"}, {key: "N", ctrl: true}],
      action: ["activePanel", "nextItem"],
    },
    {
      name: "Go to Previous File",
      shortcuts: [{key: "ArrowUp"}, {key: "P", ctrl: true}],
      action: ["activePanel", "previousItem"],
    },
    {
      name: "Page Down",
      shortcuts: [{key: "PageDown"}],
      action: ["activePanel", "pageDown"],
    },
    {
      name: "Page Up",
      shortcuts: [{key: "PageUp"}],
      action: ["activePanel", "pageUp"],
    },
    {
      name: "Quit",
      shortcuts: [{key: "F10"}],
      action: ["app", "quit"],
    },
    {
      name: "Switch Panel",
      shortcuts: [{key: "Tab"}],
      action: ["app", "switchPanel"],
    },
    {
      name: "View File",
      shortcuts: [{key: "F3"}],
      action: ["activePanel", "viewFocusedFile"],
    },
    {
      name: "Edit File",
      shortcuts: [{key: "F4"}],
      action: ["activePanel", "editFocusedFile"],
    },
  ],
  palette: [
    {
      shortcuts: [{key: "Escape"}],
      action: ["app", "closePalette"],
    }
  ],
  preview: [
    {
      shortcuts: [{key: "Escape"}, {key: "Q"}, {key: "F3"}, {key: "F10"}],
      action: ["app", "closePreview"],
    }
  ],
}
