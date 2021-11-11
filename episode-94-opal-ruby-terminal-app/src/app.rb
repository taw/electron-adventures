require "native"

ChildProcess = Native(`require("child_process")`)

def element(query)
  $$.document.querySelector(query)
end

def create_element(tag, className=nil, children=[])
  el = $$.document.createElement(tag)
  el.className = className if className
  children.each do |child|
    el.append child
  end
  el
end

def create_input_line(command)
  create_element("div", "input-line", [
    create_element("span", "prompt", ["$"]),
    create_element("span", "input", [command])
  ])
end

def create_terminal_history_entry(command, output)
  terminal_history = element("#history")
  terminal_history.append(create_input_line(command))
  terminal_history.append(
    create_element("div", "output", [output])
  )
end

element("form").addEventListener("submit") do |e|
  Native(e).preventDefault
  input = element("input")
  command = input.value
  output = ChildProcess.execSync(command).toString
  create_terminal_history_entry(command, output)
  input.value = ""
  input.scrollIntoView
end
