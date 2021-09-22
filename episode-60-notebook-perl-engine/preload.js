let child_process = require("child_process")
let lineReader = require("promise-readline")
let { contextBridge } = require("electron")

let languageServers = {}

async function startLanguageServer() {
  let process = child_process.spawn(
    "./perl_language_server",
    [],
    {
      stdio: ["pipe", "pipe", "inherit"],
    },
  )
  return {
    process,
    stdin: process.stdin,
    stdout: lineReader(process.stdout),
  }
}

async function runCode(sessionId, code) {
  if (!languageServers[sessionId]) {
    languageServers[sessionId] = await startLanguageServer()
  }
  let { stdin, stdout } = languageServers[sessionId]
  await stdin.write(JSON.stringify({ code }) + "\n")
  let line = await stdout.readLine()
  return JSON.parse(line)
}

contextBridge.exposeInMainWorld(
  "api", { runCode }
)
