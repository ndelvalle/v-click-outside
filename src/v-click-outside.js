const HANDLERS_PROPERTY = '__v-click-outside'
const HAS_WINDOWS = typeof window !== 'undefined'
const HAS_NAVIGATOR = typeof navigator !== 'undefined'
const IS_TOUCH =
  HAS_WINDOWS && ('ontouchstart' in window || (HAS_NAVIGATOR && navigator.msMaxTouchPoints > 0))
const EVENTS = IS_TOUCH ? ['touchstart'] : ['click']

function processDirectiveArguments(bindingValue) {
  const isFunction = typeof bindingValue === 'function'
  if (!isFunction && typeof bindingValue !== 'object') {
    throw new Error('v-click-outside: Binding value must be a function or an object')
  }

  return {
    handler: isFunction ? bindingValue : bindingValue.handler,
    middleware: bindingValue.middleware || ((item) => item),
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

function bind(el, { value }) {
  const { events, handler, middleware, isActive } = processDirectiveArguments(value)
  if (!isActive) {
    return
  }

  el[HANDLERS_PROPERTY] = events.map((eventName) => ({
    event: eventName,
    handler: (event) => onEvent({ event, el, handler, middleware }),
  }))

  el[HANDLERS_PROPERTY].forEach(({ event, handler }) =>
    setTimeout(() => document.documentElement.addEventListener(event, handler, false), 0),
  )
}

function unbind(el) {
  const handlers = el[HANDLERS_PROPERTY] || []
  handlers.forEach(({ event, handler }) =>
    document.documentElement.removeEventListener(event, handler, false),
  )
  delete el[HANDLERS_PROPERTY]
}

function update(el, { value, oldValue }) {
  if (JSON.stringify(value) === JSON.stringify(oldValue)) {
    return
  }
  unbind(el)
  bind(el, { value })
}

export default {
  bind,
  update,
  unbind,
}
