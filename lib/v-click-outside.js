const userAgent = navigator.userAgent.toLowerCase()
const event = userAgent.match(/(iphone|ipod|ipad)/) ? "touchstart" : "click"

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
  const instance = directive.instances.find(i => i.el === el)
  const instanceIndex = directive.instances.indexOf(instance)
  directive.instances.splice(instanceIndex, 1)
  if (directive.instances.length === 0) {
    document.removeEventListener(event, directive.onEvent)
  }
}

export default directive
