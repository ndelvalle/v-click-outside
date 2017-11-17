const isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
const event = isTouch ? 'touchstart' : 'click'

const directive = {
  instances: []
}

directive.onEvent = function (event) {
  directive.instances.forEach(({ el, fn }) => {
    if (event.target !== el && !el.contains(event.target)) {
      fn && fn(event)
    }
  })
}

directive.bind = function (el) {
  directive.instances.push({ el, fn: null })
  if (directive.instances.length === 1) {
    document.addEventListener(event, directive.onEvent)
  }
}

directive.update = function (el, binding) {
  if (typeof binding.value !== 'function') {
    throw new Error('Argument must be a function')
  }
  const instance = directive.instances.find(i => i.el === el)
  instance.fn = binding.value
}

directive.unbind = function (el) {
  const instanceIndex = directive.instances.findIndex(i => i.el === el)
  directive.instances.splice(instanceIndex, 1)
  if (directive.instances.length === 0) {
    document.removeEventListener(event, directive.onEvent)
  }
}

export default directive
