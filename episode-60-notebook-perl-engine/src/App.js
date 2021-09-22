import React, { useState } from "react"
import { useImmer } from "use-immer"
import CommandBox from "./CommandBox.js"

export default (props) => {
  let [sessionId, setSessionId] = useState(Math.random().toString())
  let [notebook, updateNotebook] = useImmer([
    { input: "sub fib {\n  my $n=shift;\n  return 1 if $n < 2;\n  fib($n-1) + fib($n-2);\n}", output: "" },
    { input: 'print(fib($_), "\\n") for 5..8', output: "" },
    { input: 'my @txt = (-38,-9,-6/3,-6/3,3/3,-468/6,-69/3,3/3,4,-6/3,-30/3);\n$\\ = "\\n";\nprint map{pack "C", 330/3 + $_} @txt;', output: "" },
  ])

  let resetSessionId = () => {
    setSessionId(Math.random().toString())
  }

  let runCode = async (code) => {
    let {error, output} = await window.api.runCode(sessionId, code)
    if (error) {
      return output + "\n" + error
    } else {
      return output
    }
  }

  let updateEntry = (index) => (cb) => {
    updateNotebook(draft => {
      cb(draft[index], draft, index)
    })
  }

  let run = (index) => async () => {
    let input = notebook[index].input
    let output = await runCode(input)
    updateNotebook(draft => { draft[index].output = output })
  }

  let addNew = (index) => () => {
    updateNotebook(draft => {
      draft.splice(index + 1, 0, { input: "", output: "" })
    })
  }

  let deleteThis = (index) => () => {
    updateNotebook(draft => {
      draft.splice(index, 1)
      if (draft.length === 0) {
        draft.push({ input: "", output: "" })
      }
    })
  }

  let runAll = async () => {
    resetSessionId()
    for (let index = 0; index < notebook.length; index++) {
      await run(index)()
    }
  }

  return (
    <>
      <h1>Notebook App</h1>
      {notebook.map(({input,output}, index) => (
        <CommandBox
          key={index}
          input={input}
          output={output}
          updateEntry={updateEntry(index)}
          run={run(index)}
          deleteThis={deleteThis(index)}
          addNew={addNew(index)}
        />
       ))}
      <div>
        <button onClick={runAll}>Run All</button>
        <button onClick={resetSessionId}>Reset Session</button>
      </div>
    </>
  )
}
