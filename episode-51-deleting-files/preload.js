let path = require("path")
let child_process = require("child_process")
let fs = require("fs")
let { readdir, stat, readlink } = require("fs/promises")
let { contextBridge } = require("electron")
let trash = require("trash")

let fileInfo = async (basePath, entry) => {
  let { name } = entry
  let fullPath = path.join(basePath, name)
  let linkTarget = null
  let fileStat

  if (entry.isSymbolicLink()) {
    linkTarget = await readlink(fullPath)
  }

  // This most commonly happens with broken symlinks
  // but could also happen if the file is deleted
  // while we're checking it as race condition
  try {
    fileStat = await stat(fullPath)
  } catch {
    return {
      name,
      type: "broken",
      linkTarget,
    }
  }

  let { size, mtime } = fileStat

  if (fileStat.isDirectory()) {
    return {
      name,
      type: "directory",
      mtime,
      linkTarget,
    }
  } else if (fileStat.isFile()) {
    return {
      name,
      type: "file",
      size,
      mtime,
      linkTarget,
    }
  } else {
    return {
      name,
      type: "special",
    }
  }
}

let directoryContents = async (file) => {
  let entries = await readdir(file, { withFileTypes: true })
  let fileInfos = await Promise.all(entries.map(entry => fileInfo(file, entry)))
  if (file !== "/") {
    fileInfos.unshift({
      name: "..",
      type: "directory",
    })
  }
  return fileInfos
}

let currentDirectory = () => {
  return process.cwd()
}

let viewFile = (file) => {
  child_process.spawn("open", [file])
}

let editFile = (file) => {
  child_process.spawn("code", [file])
}

let readTextFile = (file) => {
  return fs.readFileSync(file, "utf8");
}

let readFileToDataUrl = (file, mimeType) => {
  let buffer = fs.readFileSync(file)
  return `data:${mimeType};base64,${buffer.toString("base64")}`
}

let createDirectory = (dir) => {
  fs.mkdirSync(dir, {recursive: true})
}

let moveFileToTrash = async (file) => {
  await trash(file)
}

contextBridge.exposeInMainWorld(
  "api", { directoryContents, currentDirectory, viewFile, editFile, readTextFile, readFileToDataUrl, createDirectory, moveFileToTrash }
)
