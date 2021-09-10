class EventTarget {
  constructor(bus, target) {
    this.bus = bus
    this.target = target
    return new Proxy(this, {
      get: (receiver, name) => {
        return (...args) => {
          bus.emit(target, name, ...args)
        }
      }
    })
  }
}

export default class EventBus {
  constructor() {
    this.callbacks = {}
  }

  handle(target, map) {
    this.callbacks[target] = { ...(this.callbacks[target] || {}), ...map }
  }

  emit(target, event, ...details) {
    let handlers = this.callbacks[target]
    if (handlers) {
      if (handlers[event]) {
        handlers[event](...details)
      } else if (handlers["*"]) {
        handlers["*"](event, ...details)
      } else {
        console.log(`Target ${target} has no handler for ${event}`)
      }
    } else {
      console.log(`Target ${target} not defined`)
    }
  }

  target(t) {
    return new EventTarget(this, t)
  }
}
