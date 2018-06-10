/* global jest describe it expect afterEach */

import clickOutside from '../lib/index'

const plugin = clickOutside
const directive = clickOutside.directive

describe('v-click-outside -> plugin', () => {
  it('install the directive into the vue instance', () => {
    const vue = {
      directive: jest.fn()
    }
    plugin.install(vue)
    expect(vue.directive).toHaveBeenCalledWith('click-outside', directive)
    expect(vue.directive).toHaveBeenCalledTimes(1)
  })
})

describe('v-click-outside -> directive', () => {
  const div1 = document.createElement('div')
  const div2 = document.createElement('div')
  const a = document.createElement('a')

  afterEach(() => {
    directive.instances = []
    directive.events = ['click']
  })

  it('it has bind, update and unbind methods available', () => {
    expect(typeof directive.bind).toBe('function')
    expect(typeof directive.update).toBe('function')
    expect(typeof directive.unbind).toBe('function')
  })

  describe('bind', () => {
    it('adds an element to the instances list and adds an event listener (On non mobile devices)', () => {
      directive.events = ['click']
      document.addEventListener = jest.fn()
      directive.bind(div1, {})
      expect(directive.instances.length).toBe(1)
      expect(directive.instances[0].el).toBe(div1)
      expect(document.addEventListener.mock.calls.length).toBe(1)
    })

    it('adds multiple elements to the instances list and adds an event listener (On mobile devices)', () => {
      document.addEventListener = jest.fn()
      directive.events = ['click', 'touchstart']
      directive.bind(div1, {})
      directive.bind(div2, {})
      expect(directive.instances.length).toBe(2)
      expect(directive.instances[1].el).toBe(div2)
      expect(document.addEventListener.mock.calls.length).toBe(2)
    })
  })

  describe('update', () => {
    it('throws an error if value is not a function', () => {
      const updateWithNoFunction = () => directive.update(div1, {})
      expect(updateWithNoFunction).toThrowError(/Argument must be a function/)
    })

    it('saves the callback function', () => {
      const cb = () => {}
      directive.bind(div1, {})
      directive.update(div1, { value: cb })
      expect(directive.instances[0].fn).toBe(cb)
    })
  })

  describe('unbind', () => {
    it('removes the instance of the list and the event listener (On non mobile devices)', () => {
      directive.events = ['click']
      document.removeEventListener = jest.fn()
      directive.bind(div1, {})
      directive.unbind(div1)
      expect(directive.instances.length).toBe(0)
      expect(document.removeEventListener.mock.calls.length).toBe(1)
    })

    it('removes the instance of the list and the event listener (On mobile devices)', () => {
      directive.events = ['click', 'touchstart']
      document.removeEventListener = jest.fn()
      directive.bind(div1, {})
      directive.unbind(div1)
      expect(directive.instances.length).toBe(0)
      expect(document.removeEventListener.mock.calls.length).toBe(2)
    })

    it('removes multiple instances of the list and the event listener', () => {
      directive.events = ['click']
      document.removeEventListener = jest.fn()
      directive.bind(div1, {})
      directive.bind(div2, {})
      directive.unbind(div1)
      expect(directive.instances[0].el).toBe(div2)
      directive.unbind(div2)
      expect(directive.instances.length).toBe(0)
      expect(document.removeEventListener.mock.calls.length).toBe(1)
    })
  })

  describe('onEvent', () => {
    const messageTest1 = 'it calls the callback if the element is not the same and ' +
                         'does not contains the event target'
    it(messageTest1, () => {
      const event = { target: a }
      const cb = jest.fn()
      directive.bind(div1, {})
      directive.update(div1, { value: cb })

      directive.onEvent(event)
      expect(cb).toHaveBeenCalledWith(event)
    })

    const messageTest2 = 'It does not execute the callback if the event target is the ' +
                          'element from the directive instance'
    it(messageTest2, () => {
      const event = { target: div1 }
      const cb = jest.fn()
      directive.bind(div1, {})
      directive.update(div1, { value: cb })

      directive.onEvent(event)
      expect(cb).not.toHaveBeenCalled()
    })

    const messageTest3 = 'does not execute the callback if the event type is ' +
                         'touchstart and the instance has notouch modifier'
    it(messageTest3, () => {
      const event = { target: a, type: 'touchstart' }
      const cb = jest.fn()
      directive.events = ['click', 'touchstart']
      directive.bind(div1, { modifiers: { notouch: true } })
      directive.update(div1, { value: cb })

      directive.onEvent(event)
      expect(cb).not.toHaveBeenCalled()
    })
  })
})
