import React from "react"
import { useImmer } from "use-immer"
import CommandBox from "./CommandBox.js"

export default (props) => {
  let [notebook, updateNotebook] = useImmer([
    { input: "print('Hello')", output: "" },
    { input: "print('World')", output: "" },
    { input: "print(f'2+2={2+2}')", output: "" },
  ])

  let updateEntry = (index) => (cb) => {
    updateNotebook(draft => {
      cb(draft[index], draft, index)
    })
  }

  let run = (index) => async () => {
    let input = notebook[index].input
    let output = await window.api.runScript("python3", input)
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
      </div>
    </>
  )
}
