export default [
  {key: "Tab", action: ["app", "switchPanel"]},
  {key: "F10", action: ["app", "quit"]},
  {key: "ArrowDown", action: ["activePanel", "nextItem"]},
  {key: "ArrowUp", action: ["activePanel", "previousItem"]},
  {key: "PageDown", action: ["activePanel", "pageDown"]},
  {key: "PageUp", action: ["activePanel", "pageUp"]},
  {key: "Home", action: ["activePanel", "firstItem"]},
  {key: "End", action: ["activePanel", "lastItem"]},
  {key: " ", action: ["activePanel", "flipItem"]},
  {key: "Enter", action: ["activePanel", "activateItem"]},
]
