let countSpan = document.querySelector("#count")

document.querySelector("#plus").addEventListener("click", async () => {
  let result = await eel.change_counter(1)()
  countSpan.textContent = result
})

document.querySelector("#minus").addEventListener("click", async () => {
  let result = await eel.change_counter(-1)()
  countSpan.textContent = result
})

eel.expose(display_message)
function display_message(message) {
  document.querySelector("#message").textContent = message
}
