import { Text, View } from "@nodegui/react-nodegui"
import React from "react"

export default ({ command, output }) => {
  return <>
    <View styleSheet={inputLineStyle}>
      <Text styleSheet={promptStyle}>$</Text>
      <Text styleSheet={inputStyle}>{command}</Text>
    </View>
    <Text styleSheet={outputStyle}>{output}</Text>
  </>
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

let inputStyle = `
  font-size: 18px;
  font-family: Monaco, monospace;
  color: #ffa;
  flex: 1;
`

let outputStyle = `
  font-size: 18px;
  font-family: Monaco, monospace;
  color: #afa;
  white-space: pre;
  padding-bottom: 0.5rem;
`
