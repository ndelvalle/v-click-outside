const directive = {}

directive.onEvent = function (event) {
  if (event.target !== this.el && !this.el.contains(event.target)) {
    directive.cb && directive.cb(event)
  }
}

directive.bind = function (el) {
  directive.onEventBound = directive.onEvent.bind({ el })
  document.addEventListener('click', directive.onEventBound)
}

directive.update = function (el, binding) {
  if (typeof binding.value !== 'function') {
    throw new Error('Argument must be a function')
  }
  directive.cb = binding.value
}

directive.unbind = function () {
  document.removeEventListener('click', directive.onEventBound)
}

export default directive
