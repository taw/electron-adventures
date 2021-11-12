let button = document.querySelector("button")
let count = document.querySelector("#count")

button.addEventListener("click", async () => {
  await window.pywebview.api.click()
  count.innerText = await window.pywebview.api.getCount()
})
