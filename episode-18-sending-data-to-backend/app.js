let { ipcRenderer } = require("electron")

let form = document.querySelector("form")
let input = document.querySelector("input")
let responses = document.querySelector("#responses")

form.addEventListener("submit", async (e) => {
  e.preventDefault()
  let line = input.value
  input.value = ""
  let responseText = await ipcRenderer.invoke("console", line)
  let response = document.createElement("div")
  response.textContent = responseText
  responses.appendChild(response)
})
