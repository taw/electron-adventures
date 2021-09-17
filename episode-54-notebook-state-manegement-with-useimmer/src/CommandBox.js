import React from "react"

export default ({input, output, updateEntry, run, deleteThis, addNew}) => {
  let handleChange = e => {
    updateEntry(entry => entry.input = e.target.value)
  }

  let handleKey = (e) => {
    if (e.key === "Enter" && e.metaKey) {
      run()
    }
  }

  return (
    <div className="command">
      <textarea
        className="input"
        onChange={handleChange} value={input}
        onKeyDown={handleKey}
      />
      <div className="output">{output}</div>
      <div>
        <button onClick={run}>Run</button>
        <button onClick={deleteThis}>Delete</button>
        <button onClick={addNew}>Add New</button>
      </div>
    </div>
  )
}
