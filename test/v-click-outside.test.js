/* global jest describe it expect beforeEach */

import clickOutside from '../lib/index'

const plugin = clickOutside
const { directive } = clickOutside

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
    })

    it('throws an error if the binding value is not a function or an object', () => {
      const bind = () => directive.bind(document.createElement('div'), {})
      expect(bind).toThrowError(/v-click-outside: Binding value must be a function or an object/)
    })

    it('adds an event listener to the element and stores an instance', () => {
      const el = document.createElement('div')
      const noop = () => jest.fn()
      const config = {
        handler: noop,
        events: ['dblclick'],
        middleware: noop,
      }

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
  })

  describe('update', () => {
    it('throws an error if the binding value is not a function or an object', () => {
      const update = () => directive.update(document.createElement('div'), {})
      expect(update).toThrowError(/v-click-outside: Binding value must be a function or an object/)
    })
  })
})
