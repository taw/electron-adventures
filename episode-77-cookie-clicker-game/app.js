let score = 0

let audio = new Audio("coin.wav")

$("body").on("click", (e) => {
  e.preventDefault()
  score += 1
  $("#score").text(`Score: ${score}`)
  audio.currentTime = 0
  audio.play()
})
