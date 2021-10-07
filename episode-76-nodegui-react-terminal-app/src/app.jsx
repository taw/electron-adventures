let child_process = require("child_process")
import { Window, hot, View } from "@nodegui/react-nodegui"
import React, { useState } from "react"
import CommandInput from "./CommandInput"
import HistoryEntry from "./HistoryEntry"

function App() {
  let [history, setHistory] = useState([])

  let onsubmit = (command) => {
    let output = child_process.execSync(command).toString().trim()
    setHistory([...history, { command, output }])
  }

  return (
    <Window
      windowTitle="NodeGui React Terminal App"
      minSize={{ width: 800, height: 600 }}
    >
      <View style={containerStyle}>
        {history.map(({ command, output }, index) => (
          <HistoryEntry key={index} command={command} output={output} />
        ))}
        <CommandInput onsubmit={onsubmit} />
      </View>
    </Window>
  )
}

let containerStyle = `
  flex: 1;
`

export default hot(App)
