#!/usr/bin/env python3

import eel

counter = 0

@eel.expose
def change_counter(num):
  global counter
  counter += num
  if counter >= 10:
    eel.display_message("slow down!")
  return counter

eel.init("web")
eel.start("index.html")
