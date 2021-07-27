let data = new URLSearchParams(document.location.search)

let info = document.querySelector("#info")

for (const [key, value] of data) {
  let p = document.createElement("p")
  p.append(`${key} = ${value}`)
  info.append(p)
}
