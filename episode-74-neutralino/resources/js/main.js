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

form.addEventListener("submit", async (e) => {
  e.preventDefault()
  let command = input.value
  let output = (await Neutralino.os.execCommand({command})).output.trim()
  console.log(output)
  createTerminalHistoryEntry(command, output)
  input.value = ""
  input.scrollIntoView()
})
