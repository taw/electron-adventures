let path = require('path')
let api = require("../../preload/api.js")

test("currentDirectory", () => {
  expect(api.currentDirectory()).toEqual(path.join(__dirname, "../.."))
})

test("directoryContents", async () => {
  let examplesDir = `${__dirname}/examples`
  let result = await api.directoryContents(examplesDir)

  expect(result).toMatchObject([
    {
      linkTarget: null,
      name: "example_01.md",
      mtime: expect.anything(),
      size: 6,
      type: "file",
    },
    {
      linkTarget: "example_01.md",
      name: "example_02.md",
      mtime: expect.anything(),
      size: 6,
      type: "file",
    },
    {
      linkTarget: null,
      name: "example_03",
      mtime: expect.anything(),
      type: "directory",
    },
    {
      linkTarget: "example_03",
      name: "example_04",
      mtime: expect.anything(),
      type: "directory",
    },
    {
      linkTarget: "example_05.md",
      name: "missing",
      type: "broken",
    },
  ])
})
