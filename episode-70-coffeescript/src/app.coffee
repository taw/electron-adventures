body = document.querySelector "body"
ul = document.createElement "ul"
body.append ul

for key, val of window.api.versions
  li = document.createElement "li"
  li.append "#{key}: #{val}"
  ul.append li
