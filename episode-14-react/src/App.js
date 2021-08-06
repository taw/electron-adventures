import React from "react"
import CommandInput from "./CommandInput"
import HistoryEntry from "./HistoryEntry"

export default (props) => {
  let [history, setHistory] = React.useState([])

  let onsubmit = (command) => {
    let output = window.api.runCommand(command)
    setHistory([...history, { command, output }])
  }

  return (
    <>
      <h1>React Terminal App</h1>
      { history.map(({command, output}, index) => (
        <HistoryEntry key={index} command={command} output={output} />
      ))}
      <CommandInput onsubmit={onsubmit} />
    </>
  )
}
