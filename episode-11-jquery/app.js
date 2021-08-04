function appendInput(command) {
  let e = $(
    `<div class='input-line'>
      <span class='prompt'>$</span>
      <span class='input'></span>
    </div>`)
  e.find('.input').text(command)
  $("#history").append(e)
}

function appendOutput(output) {
  let e = $(`<div class='output'></div>`)
  e.text(output)
  $("#history").append(e)
}

$("form").on("submit", function(e) {
  e.preventDefault()
  let command = $("input").val()
  let output = window.api.runCommand(command)
  appendInput(command)
  appendOutput(output)
  $("input").val("")
  $("input")[0].scrollIntoView()
})
