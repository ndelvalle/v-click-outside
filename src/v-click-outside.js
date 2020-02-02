const HANDLERS_PROPERTY = '__v-click-outside'
const HAS_WINDOWS = typeof window !== 'undefined'
const HAS_NAVIGATOR = typeof navigator !== 'undefined'
const IS_TOUCH =
  HAS_WINDOWS &&
  ('ontouchstart' in window ||
    (HAS_NAVIGATOR && navigator.msMaxTouchPoints > 0))
const EVENTS = IS_TOUCH ? ['touchstart'] : ['click']

function processDirectiveArguments(bindingValue) {
  const isFunction = typeof bindingValue === 'function'
  if (!isFunction && typeof bindingValue !== 'object') {
    throw new Error(
      'v-click-outside: Binding value must be a function or an object',
    )
  }

  return {
    handler: isFunction ? bindingValue : bindingValue.handler,
    middleware: bindingValue.middleware || ((item) => item),
    events: bindingValue.events || EVENTS,
    isActive: !(bindingValue.isActive === false),
  }
}

function onEvent({ el, event, handler, middleware }) {
  // Note: composedPath is not supported on IE and Edge, more information here:
  //       https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath
  //       In the meanwhile, we are using el.contains for those browsers, not
  //       the ideal solution, but using IE or EDGE is not ideal either.
  const path = event.path || (event.composedPath && event.composedPath())
  const outsideCheck = path ? path.indexOf(el) < 0 : !el.contains(event.target)

  const isClickOutside = event.target !== el && outsideCheck

  if (!isClickOutside) {
    return
  }

  if (middleware(event)) {
    handler(event)
  }
}

function bind(el, { value }) {
  const { events, handler, middleware, isActive } = processDirectiveArguments(
    value,
  )
  if (!isActive) {
    return
  }

  el[HANDLERS_PROPERTY] = events.map((eventName) => ({
    event: eventName,
    handler: (event) => onEvent({ event, el, handler, middleware }),
  }))

  el[HANDLERS_PROPERTY].forEach(({ event, handler }) =>
    setTimeout(() => {
      // Note: More info about this implementation can be found here:
      //       https://github.com/ndelvalle/v-click-outside/issues/137
      if (!el[HANDLERS_PROPERTY]) {
        return
      }
      document.documentElement.addEventListener(event, handler, false)
    }, 0),
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

const directive = {
  bind,
  update,
  unbind,
}

export default HAS_WINDOWS ? directive : {}
