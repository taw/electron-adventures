require "native"

counter = 0

button = $$.document.querySelector("button")
count = $$.document.querySelector("#count")

button.addEventListener("click") do
  counter += 1
  count.innerText = counter
end
