/* global jest describe it expect beforeEach */

import clickOutside from '../lib/index'

const plugin = clickOutside
const { directive } = clickOutside

function makeConfig(argument) {
  const noop = () => jest.fn()
  return [
    document.createElement('div'),
    {
      handler: noop,
      events: ['dblclick'],
      middleware: noop,
      active: undefined,
    }
  ]
}

describe('v-click-outside -> plugin', () => {
  it('install the directive into the vue instance', () => {
    const vue = {
      directive: jest.fn(),
    }
    plugin.install(vue)
    expect(vue.directive).toHaveBeenCalledWith('click-outside', directive)
    expect(vue.directive).toHaveBeenCalledTimes(1)
  })
})

describe('v-click-outside -> directive', () => {
  it('it has bind, update and unbind methods available', () => {
    expect(typeof directive.bind).toBe('function')
    expect(typeof directive.update).toBe('function')
    expect(typeof directive.unbind).toBe('function')
  })

  describe('bind', () => {
    beforeEach(() => {
      document.addEventListener = jest.fn()
      directive.instances.splice(0, directive.instances.length)
    })

    it('throws an error if the binding value is not a function or an object', () => {
      const bind = () => directive.bind(document.createElement('div'), {})
      expect(bind).toThrowError(/v-click-outside: Binding value must be a function or an object/)
    })

    it('adds an event listener to the element and stores an instance', () => {
      const [el, config] = makeConfig()

      directive.bind(el, { value: config })

      const [instance] = directive.instances

      expect(directive.instances.length).toEqual(1)
      expect(instance.eventHandlers.length).toEqual(1)

      const [eventHandler] = instance.eventHandlers

      expect(typeof eventHandler.handler).toEqual('function')
      expect(eventHandler.event).toEqual(config.events[0])
      expect(instance.el).toBe(el)
      expect(document.addEventListener).toHaveBeenCalledTimes(1)
    })

    it("doesn't do anything when config.active is false", () => {
      const [, config] = makeConfig()
      config.active = false

      directive.bind(null, { value: config })

      expect(directive.instances.length).toEqual(0)
    })
  })

  describe('unbind', () => {
    it("can remove whatever bind adds", () => {
      const [el1, config1] = makeConfig()
      directive.bind(el1, { value: config1 })

      expect(directive.instances.length).toEqual(1)

      const [el2, config2] = makeConfig()
      directive.bind(el2, { value: config2 })

      expect(directive.instances.length).toEqual(2)

      const [el3, config3] = makeConfig()
      directive.bind(el3, { value: config3 })

      expect(directive.instances.length).toEqual(3)

      const els = directive.instances.map(instance => instance.el)
      while (els.length) {
        const el = els.pop()

        directive.unbind(el)
        expect(directive.instances.length).toEqual(els.length)
      }
    })
  })

  describe('update', () => {
    it('throws an error if the binding value is not a function or an object', () => {
      const update = () => directive.update(document.createElement('div'), {})
      expect(update).toThrowError(/v-click-outside: Binding value must be a function or an object/)
    })

    describe("transitions correctly", () => {
      beforeEach(() => {
        document.addEventListener = jest.fn()
        document.removeEventListener = jest.fn()
        directive.instances.splice(0, directive.instances.length)
      })

      it("from true to true", () => {
        const [el, config] = makeConfig()
        directive.bind(el, { value: config })
        expect(directive.instances.length).toEqual(1)
        expect(document.addEventListener).toHaveBeenCalledTimes(1)

        directive.update(el, { value: config })
        expect(directive.instances.length).toEqual(1)
        expect(document.addEventListener).toHaveBeenCalledTimes(2)
        expect(document.removeEventListener).toHaveBeenCalledTimes(1)
      })
      it("from true to false", () => {
        const [el, config] = makeConfig()
        directive.bind(el, { value: config })
        expect(directive.instances.length).toEqual(1)
        expect(document.addEventListener).toHaveBeenCalledTimes(1)

        config.active = false
        directive.update(el, { value: config })
        expect(directive.instances.length).toEqual(0)
        expect(document.addEventListener).toHaveBeenCalledTimes(1)
        expect(document.removeEventListener).toHaveBeenCalledTimes(1)
      })
      it("from false to true", () => {
        const [el, config] = makeConfig()
        directive.update(el, { value: config })
        expect(directive.instances.length).toEqual(1)
        expect(document.addEventListener).toHaveBeenCalledTimes(1)
        expect(document.removeEventListener).toHaveBeenCalledTimes(1)
      })
      it("from false to false", () => {
        const [el, config] = makeConfig()
        config.active = false
        directive.update(el, { value: config })
        expect(directive.instances.length).toEqual(0)
        expect(document.addEventListener).toHaveBeenCalledTimes(0)
        expect(document.removeEventListener).toHaveBeenCalledTimes(1)
      })
    })
  })
})
