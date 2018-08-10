const isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0

const directive = {
  instances: [],
  events: isTouch ? ['touchstart', 'click'] : ['click']
}

directive.onEvent = function (event) {
  directive.instances.forEach(({ el, fn, mod, userFn }) => {
    if (event.type === 'touchstart' && mod.notouch) {
      return
    }
    if (event.target !== el && !el.contains(event.target) && userFn(el, event)) {
      fn && fn(event)
    }
  })
}

directive.bind = function (el, binding) {
  const handler = typeof binding.value === 'function' ? binding.value : binding.value.handler
  const middleware = binding.value.middleware || (() => true)
  directive.instances.push({ el, fn: handler, mod: binding.modifiers, userFn: middleware })
  if (directive.instances.length === 1) {
    directive.events.forEach(e => document.addEventListener(e, directive.onEvent))
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
  if (instanceIndex >= 0) {
    directive.instances.splice(instanceIndex, 1)
  }
  if (directive.instances.length === 0) {
    directive.events.forEach(e => document.removeEventListener(e, directive.onEvent))
  }
}

export default typeof window !== 'undefined' ? directive : {}
