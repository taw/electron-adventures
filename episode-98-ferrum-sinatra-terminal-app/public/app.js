let form = document.querySelector("form")
let input = document.querySelector("input")
let terminalHistory = document.querySelector("#history")

function createInputLine(command) {
  let inputLine = document.createElement("div")
  inputLine.className = "input-line"

  let promptSpan = document.createElement("span")
  promptSpan.className = "prompt"
  promptSpan.append("$")
  let inputSpan = document.createElement("span")
  inputSpan.className = "input"
  inputSpan.append(command)

  inputLine.append(promptSpan)
  inputLine.append(inputSpan)

  return inputLine
}

function createTerminalHistoryEntry(command, commandOutput) {
  let inputLine = createInputLine(command)
  let output = document.createElement("div")
  output.className = "output"
  output.append(commandOutput)
  terminalHistory.append(inputLine)
  terminalHistory.append(output)
}

async function runCommand(command) {
  let response = await fetch(
    "http://localhost:4567/execute",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({command}),
    },
  )
  if (!response.ok) {
    throw `HTTP error ${response.status}`
  }
  return await response.json()
}

form.addEventListener("submit", async (e) => {
  e.preventDefault()
  let command = input.value
  let {output} = await runCommand(command)
  createTerminalHistoryEntry(command, output)
  input.value = ""
  input.scrollIntoView()
})
