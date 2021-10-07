import { Text, View, LineEdit } from "@nodegui/react-nodegui"
import React from "react"

export default ({ onsubmit }) => {
  let [command, setCommand] = React.useState("")

  let textChanged = (t) => setCommand(t)
  let returnPressed = () => {
    if (command !== "") {
      onsubmit(command)
    }
    setCommand("")
  }

  return <View styleSheet={inputLineStyle}>
    <Text styleSheet={promptStyle}>$</Text>
    <LineEdit
      styleSheet={lineEditStyle}
      text={command}
      on={{ textChanged, returnPressed }}
     />
  </View>
}

let inputLineStyle = `
  display: flex;
  flex-direction: row;
`

let promptStyle = `
  font-size: 18px;
  font-family: Monaco, monospace;
  flex: 0;
  margin-right: 0.5em;
`

let lineEditStyle = `
  flex: 1;
  font-size: 18px;
  font-family: Monaco, monospace;
`
