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
      }
    }
  }
}
