const HAS_WINDOWS = typeof window !== 'undefined'
const HAS_NAVIGATOR = typeof navigator !== 'undefined'
const IS_TOUCH =
  HAS_WINDOWS && ('ontouchstart' in window || (HAS_NAVIGATOR && navigator.msMaxTouchPoints > 0))
const EVENTS = IS_TOUCH ? ['touchstart', 'click'] : ['click']
const IDENTITY = (item) => item

const directive = {
  instances: [],
}

function processDirectiveArguments(bindingValue) {
  const isFunction = typeof bindingValue === 'function'
  if (!isFunction && typeof bindingValue !== 'object') {
    throw new Error('v-click-outside: Binding value must be a function or an object')
  }

  return {
    handler: isFunction ? bindingValue : bindingValue.handler,
    middleware: bindingValue.middleware || IDENTITY,
    events: bindingValue.events || EVENTS,
    isActive: !(bindingValue.isActive === false),
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

function createInstance({ el, events, handler, middleware }) {
  return {
    el,
    eventHandlers: events.map((eventName) => ({
      event: eventName,
      handler: (event) => onEvent({ event, el, handler, middleware }),
    })),
  }
}

function removeInstance(el) {
  const instanceIndex = directive.instances.findIndex((instance) => instance.el === el)
  if (instanceIndex === -1) {
    // Note: This can happen when active status changes from false to false
    return
  }

  const instance = directive.instances[instanceIndex]

  instance.eventHandlers.forEach(({ event, handler }) =>
    document.removeEventListener(event, handler),
  )

  directive.instances.splice(instanceIndex, 1)
}

function bind(el, { value }) {
  const { events, handler, middleware, isActive } = processDirectiveArguments(value)

  if (!isActive) {
    return
  }

  const instance = createInstance({ el, events, handler, middleware })

  instance.eventHandlers.forEach(({ event, handler }) =>
    setTimeout(() => document.addEventListener(event, handler), 0),
  )
  directive.instances.push(instance)
}

function update(el, { value, oldValue }) {
  if (JSON.stringify(value) === JSON.stringify(oldValue)) {
    return
  }

  const { events, handler, middleware, isActive } = processDirectiveArguments(value)

  if (!isActive) {
    removeInstance(el)
    return
  }

  let instance = directive.instances.find((instance) => instance.el === el)

  if (instance) {
    instance.eventHandlers.forEach(({ event, handler }) =>
      document.removeEventListener(event, handler),
    )
    instance.eventHandlers = events.map((eventName) => ({
      event: eventName,
      handler: (event) => onEvent({ event, el, handler, middleware }),
    }))
  } else {
    instance = createInstance({ el, events, handler, middleware })
    directive.instances.push(instance)
  }

  instance.eventHandlers.forEach(({ event, handler }) =>
    setTimeout(() => document.addEventListener(event, handler), 0),
  )
}

directive.bind = bind
directive.update = update
directive.unbind = removeInstance

export default directive
