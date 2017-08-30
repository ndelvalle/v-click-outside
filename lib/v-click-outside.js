const directive = {
  els: []
}

directive.onEvent = function (event) {
  directive.els.forEach(function ([el, fn]) {
    if (event.target !== el && !el.contains(event.target)) {
      fn && fn(event)
    }
  })
}

directive.bind = function (el) {
  directive.els.push([el, null])
  if (directive.els.length === 1) {
    document.addEventListener('click', directive.onEvent)
  }
}

directive.update = function (el, binding) {
  if (typeof binding.value !== 'function') {
    throw new Error('Argument must be a function')
  }
  const entry = directive.els.find(([el1, _]) => el1 === el)
  entry[1] = binding.value
}

directive.unbind = function (el) {
  const entry = directive.els.find(([el1, _]) => el1 === el)
  const index = directive.els.indexOf(entry)
  directive.els.splice(index, 1)
  if (directive.els.length === 0) {
    document.removeEventListener('click', directive.onEvent)
  }
}

export default directive
