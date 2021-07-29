function displayFreeDiskSpace(data) {
  let info = document.querySelector("#info")

  for (let row of data) {
    let total = parseInt(row[1])
    let used = parseInt(row[2])
    let path = row[5]
    let percent
    if (total !== 0) {
      percent = Math.round(100 * used / total)
    } else {
      percent = 0
    }
    let div = document.createElement("div")
    div.append(`${path}: ${percent}% used (${used}/${total})`)
    info.append(div)
  }
}
