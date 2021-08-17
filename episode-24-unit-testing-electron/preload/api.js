let path = require("path")
let { readdir, stat, readlink } = require("fs/promises")

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
      linkTarget,
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
  let results = await readdir(path, { withFileTypes: true })
  return await Promise.all(results.map(entry => fileInfo(path, entry)))
}

let currentDirectory = () => {
  return process.cwd()
}

module.exports = {
  directoryContents,
  currentDirectory,
}
