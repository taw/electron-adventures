function checkMatch(rxs, name) {
  if (!name) {
    return
  }
  let result = []
  for (let rx of rxs) {
    let m = rx.exec(name)
    if (m) {
      result.push([m[1], false])
      result.push([m[2], true])
      name = m[3]
    } else {
      return null
    }
  }
  result.push([name, false])
  return result
}


function matcher(commands, pattern) {
  let rxs = pattern
    .toLowerCase()
    .replace(/[^a-z0-9]/, "")
    .split("")
    .map(l => new RegExp(`(.*?)(${l})(.*)`, "i"))
  let result = []
  for (let command of commands) {
    let match = checkMatch(rxs, command.name)
    if (match) {
      result.push({...command, match: match})
    }
  }
  return result
}

export default matcher
