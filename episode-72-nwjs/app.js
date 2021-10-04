nw.Window.get().showDevTools();

let ul = document.querySelector("ul")

for (let k in process.versions) {
  let li = document.createElement("li")
  li.append(`${k} = ${process.versions[k]}`)
  ul.append(li)
}
