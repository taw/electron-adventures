let child_process = require("child_process")
let lineReader = require("promise-readline")
let { contextBridge } = require("electron")

let languageServer = null

async function startLanguageServer() {
  let process = child_process.spawn(
    "./ruby_language_server",
    [],
    {
      stdio: ["pipe", "pipe", "inherit"],
    },
  )
  languageServer = {
    process,
    stdin: process.stdin,
    stdout: lineReader(process.stdout),
  }
}

async function runCode(session_id, code) {
  if (!languageServer) {
    await startLanguageServer()
  }
  let { stdin, stdout } = languageServer
  await stdin.write(JSON.stringify({ code, session_id }) + "\n")
  let line = await stdout.readLine()
  return JSON.parse(line)
}

contextBridge.exposeInMainWorld(
  "api", { runCode }
)
