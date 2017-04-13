export default {
  onEvent (event) {
    if (event.target !== this.el && !this.el.contains(event.target)) {
      this.cb()
    }
  },

  bind () {
    this.bindedOnEvent = (...args) => this.onEvent(...args)
    document.addEventListener('click', this.bindedOnEvent)
  },

  update (cb) {
    if (typeof cb !== 'function') {
      throw new Error('Argument must be a function')
    }

    this.cb = cb
  },

  unbind () {
    document.removeEventListener('click', this.bindedOnEvent)
  }
}
