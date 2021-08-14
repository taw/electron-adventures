import React, { useState } from "react"
import usePromise from "react-use-promise";

export default (props) => {
  let [directory, setDirectory] = useState(window.api.currentDirectory())
  let isRoot = (directory === "/")

  let [files, filesError, filesState] = usePromise(() => (
    window.api.directoryContents(directory)
  ), [directory])

  let navigate = (path) => {
    if (directory === "/") {
      setDirectory("/" + path)
    } else {
      setDirectory(directory + "/" + path)
    }
  }
  let navigateUp = () => {
    setDirectory(directory.split("/").slice(0, -1).join("/") || "/")
  }

  return (
    <>
      <h1>{directory}</h1>
      {!isRoot && <div><button onClick={() => navigateUp()}>..</button></div> }
      {files && files.map((entry, i) => (
        (entry.type === "directory") ? (
          <div key={i}>
            <button onClick={() => navigate(entry.name)}>{entry.name}</button>
          </div>
        ) : (
            <div key={i}>{entry.name}</div>
        )
      ))}
    </>
  )
}
