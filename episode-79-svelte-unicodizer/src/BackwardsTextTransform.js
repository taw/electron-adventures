import {ucs2} from "punycode/"
import TextTransform from "./TextTransform.js"

export default class BackwardsTextTransform extends TextTransform {
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
    result.reverse()
    return ucs2.encode(result)
  }

  get debug() {
    let keys = Object.keys(this.cmap)
    keys.sort((a, b) => (a - b))
    let values = keys.map(i => this.cmap[i])
    values.reverse()
    return ucs2.encode(values)
  }
}
