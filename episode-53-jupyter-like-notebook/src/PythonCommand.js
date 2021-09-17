import React from "react"

export default () => {
  let example = `name = "world"\nprint(f"Hello, {name}!")\n`
  let [input, setInput] = React.useState(example)
  let [output, setOutput] = React.useState("")

  let submit = async () => {
    setOutput(await window.api.runScript("python3", input))
  }

  let handleKey = (e) => {
    if (e.key === "Enter" && e.metaKey) {
      submit()
    }
  }

  return (
    <div className="command">
      <textarea
        className="input"
        onChange={e => setInput(e.target.value)} value={input}
        onKeyDown={handleKey}
      />
      <div className="output">{output}</div>
    </div>
  )
}
