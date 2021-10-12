import {ucs2} from "punycode/"

export default class TextTransform {
  constructor(name, map_data) {
    this.name = name
    this.cmap = this.compile_map(map_data)
  }

  compile_map(map_data) {
    let result = {}
    for (let group of map_data) {
      let target_start = ucs2.decode(group[0])[0]
      let source_start = ucs2.decode(group[1])[0]
      let source_end = ucs2.decode(group[2] || group[1])[0]
      for (let i=source_start; i<=source_end; i++) {
        let j=target_start - source_start + i
        result[i] = j
      }
    }
    return result
  }

  apply(text) {
    let result = []
    let utext = ucs2.decode(text)
    for (let c of utext) {
      if (this.cmap[c]) {
        result.push(this.cmap[c])
      } else {
        result.push(c)
      }
    }
    return ucs2.encode(result)
  }

  get debug() {
    let keys = Object.keys(this.cmap)
    keys.sort((a, b) => (a - b))
    let values = keys.map((i) => this.cmap[i])
    return ucs2.encode(values)
  }
}
