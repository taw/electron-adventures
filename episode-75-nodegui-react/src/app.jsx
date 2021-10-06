import { Text, Window, hot, View, Button } from "@nodegui/react-nodegui"
import React, { useState } from "react"

function App() {
  let [counter, setCounter] = useState(0)

  return (
    <Window
      windowTitle="Welcome to NodeGui"
      minSize={{ width: 800, height: 600 }}
      styleSheet={styleSheet}
    >
      <View style={containerStyle}>
        <Text id="header">Welcome to NodeGui</Text>
        <Text id="text">The button has been pressed {counter} times.</Text>
        <Button id="button" on={{
          clicked: () => setCounter(c => c+1)
        }}>CLICK ME!</Button>
        <Text id="html">
          {`
            <p>For more complicated things</p>
            <ul>
              <li>Use HTML</li>
              <li>Like this</li>
            </ul>
          `}</Text>
      </View>
    </Window>
  )
}

let containerStyle = `
  flex: 1;
`

let styleSheet = `
  #header {
    font-size: 24px;
    padding-top: 20px;
    qproperty-alignment: 'AlignHCenter';
    font-family: 'sans-serif';
  }

  #text, #html {
    font-size: 18px;
    padding-top: 10px;
    padding-horizontal: 20px;
  }

  #button {
    margin-horizontal: 20px;
    height: 40px;
  }
`

export default hot(App)
