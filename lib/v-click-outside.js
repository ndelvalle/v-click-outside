const isTouch =
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.msMaxTouchPoints > 0)
const events = isTouch ? ['touchstart', 'click'] : ['click']

const instances = []

function funcIndexOf(array, func) {
  for (let index = array.length - 1; index >= 0; index--) {
    if (func(array[index])) return index
  }

  return -1
}

function processDirectiveArguments(bindingValue) {
  const isFunction = typeof bindingValue === 'function'
  if (!isFunction && typeof bindingValue !== 'object') {
    throw new Error('v-click-outside: Binding value must be a function or an object')
  }

  return {
    handler: isFunction ? bindingValue : bindingValue.handler,
    middleware: bindingValue.middleware || ((isClickOutside) => isClickOutside),
    events: bindingValue.events || events,
    active: isFunction
      ? true
      : bindingValue.active === undefined
        ? true
        : !!bindingValue.active
  }
}

function onEvent({ el, event, handler, middleware }) {
  const isClickOutside = event.target !== el && !el.contains(event.target)

  if (!isClickOutside) {
    return
  }

  if (middleware(event, el)) {
    handler(event, el)
  }
}


function createInstance(el, events, handler, middleware) {
  const instance = {
    el,
    eventHandlers: events.map((eventName) => ({
      event: eventName,
      handler: (event) => onEvent({ event, el, handler, middleware }),
    })),
  }

  instances.push(instance)

  return instance
}

function destroyInstance(el) {
  const instanceIndex = funcIndexOf(instances, (instance) => instance.el === el)
  if (instanceIndex === -1) throw new Error(`unable to find a v-click-outside instance for el: ${el}`)

  const instance = instances[instanceIndex]
  instance.eventHandlers.forEach(({ event, handler }) =>
    document.removeEventListener(event, handler),
  )

  instances.splice(instanceIndex, 1)
}

function bind(el, { value }) {
  const { events, handler, middleware, active } = processDirectiveArguments(value)

  if (!active) return

  const instance = createInstance(el, events, handler, middleware)

  instance.eventHandlers.forEach(({ event, handler }) => document.addEventListener(event, handler))
}


function update(el, { value }) {
  const { events, handler, middleware, active } = processDirectiveArguments(value)

  const instance = instances.find((instance) => instance.el === el) || createInstance(el, events, handler, middleware)

  if (!active) {
    destroyInstance(el)
    return
  }

  instance.eventHandlers.forEach(({ event, handler }) =>
    document.removeEventListener(event, handler),
  )

  instance.eventHandlers = events.map((eventName) => ({
    event: eventName,
    handler: (event) => onEvent({ event, el, handler, middleware }),
  }))

  instance.eventHandlers.forEach(({ event, handler }) => document.addEventListener(event, handler))
}


const directive = {
  bind,
  update,
  unbind: destroyInstance,
  instances,
}

export default directive
