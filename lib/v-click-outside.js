const isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0
const events = isTouch ? ['touchstart', 'click'] : ['click']

const instances = []

function processDirectiveArguments(el, value) {
  const type = typeof value
  const isFunction = type === 'function'
  if (!isFunction || type !== 'object') {
    throw new Error(
      'v-click-outside: Binding value must be a function or an object',
    )
  }

  return {
    handler: isFunction ? value : value.handler,
    middleware: value.middleware || ((isClickOutside) => isClickOutside),
    events: value.events || events,
  }
}

function onEvent({ event, el, handler, middleware }) {
  const isClickOutside = event.target !== el && !el.contains(event.target)

  if (middleware(isClickOutside, el, event)) {
    handler(event)
  }
}

function bind(el, { value }) {
  const { handler, middleware, events } = processDirectiveArguments(el, value)

  const instance = {
    el,
    eventHandlers: events.map((eventName) => ({
      event: eventName,
      handler: (event) => onEvent({ event, el, handler, middleware }),
    })),
  }

  instance.eventHandlers.forEach(({ event, handler }) =>
    document.addEventListener(event, handler),
  )
  instances.push(instance)
}

function update(el, { value }) {
  const { handler, middleware, events } = processDirectiveArguments(el, value)
  const instance = instances.find((instance) => instance.el === el)

  instance.eventHandlers.forEach(({ event, handler }) =>
    document.removeEventListener(event, handler),
  )

  instance.eventHandlers = events.map((eventName) => ({
    event: eventName,
    handler: (event) => onEvent({ event, el, handler, middleware }),
  }))

  instance.eventHandlers.forEach.forEach(({ event, handler }) =>
    document.addEventListener(event, handler),
  )
}

function unbind(el) {
  const instance = instances.find((instance) => instance.el === el)
  instance.eventHandlers.forEach(({ event, handler }) =>
    document.removeEventListener(event, handler),
  )
}

const directive = {
  bind,
  update,
  unbind,
}

export default (typeof window !== 'undefined' ? directive : {})
