export default [
  {key: "F2", action: ["app", "openPalette"]},
  {name: "Close Palette", key: "Escape", action: ["app", "closePalette"] },
  {name: "Enter Directory", key: "Enter", action: ["activePanel", "activateItem"]},
  {name: "Flip Selection", key: " ", action: ["activePanel", "flipItem"]},
  {name: "Go to First File", key: "Home", action: ["activePanel", "firstItem"]},
  {name: "Go to Last File", key: "End", action: ["activePanel", "lastItem"]},
  {name: "Go to Next File", key: "ArrowDown", action: ["activePanel", "nextItem"]},
  {name: "Go to Previous File", key: "ArrowUp", action: ["activePanel", "previousItem"]},
  {name: "Page Down", key: "PageDown", action: ["activePanel", "pageDown"]},
  {name: "Page Up", key: "PageUp", action: ["activePanel", "pageUp"]},
  {name: "Quit", key: "F10", action: ["app", "quit"]},
  {name: "Switch Panel", key: "Tab", action: ["app", "switchPanel"]},
]
