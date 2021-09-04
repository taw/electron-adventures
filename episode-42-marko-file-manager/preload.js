let path = require("path")
let { readdir, stat, readlink } = require("fs/promises")
let { contextBridge } = require("electron")

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

let directoryContents = async (path) => {
  let entries = await readdir(path, { withFileTypes: true })
  let fileInfos = await Promise.all(entries.map(entry => fileInfo(path, entry)))
  if (path !== "/") {
    fileInfos.unshift({
      name: "..",
      type: "directory",
    })
  }
  return fileInfos;
}

let currentDirectory = () => {
  return process.cwd()
}

contextBridge.exposeInMainWorld(
  "api", { directoryContents, currentDirectory }
)
