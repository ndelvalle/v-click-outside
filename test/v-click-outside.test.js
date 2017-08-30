/* global jest describe it expect afterEach */

import directive from '../lib/v-click-outside'

describe('v-click-outside -> directive', () => {
  const div = document.createElement('div')
  const div2 = document.createElement('div')
  const a = document.createElement('a')

  afterEach(() => {
    directive.els = []
  })

  it('it has bind, update and unbind methods available', () => {
    expect(typeof directive.bind).toBe('function')
    expect(typeof directive.update).toBe('function')
    expect(typeof directive.unbind).toBe('function')
  })

  describe('bind', () => {
    it('add element to the list', () => {
      document.addEventListener = jest.fn()
      directive.bind(div)
      expect(directive.els.length).toBe(1)
      expect(directive.els[0][0]).toBe(div)
      expect(document.addEventListener.mock.calls.length).toBe(1)
    })

    it('add multiple element to the list', () => {
      document.addEventListener = jest.fn()
      directive.bind(div)
      directive.bind(div2)
      expect(directive.els.length).toBe(2)
      expect(directive.els[1][0]).toBe(div2)
      expect(document.addEventListener.mock.calls.length).toBe(1)
    })
  })

  describe('update', () => {
    it('throws if value is not a function', () => {
      const updateWithNoFunction = () => {
        directive.update(div, {})
      }
      expect(updateWithNoFunction).toThrowError(/Argument must be a function/)
    })

    it('saves the callback', () => {
      const cb = () => {}
      directive.bind(div)
      directive.update(div, { value: cb })
      expect(directive.els[0][1]).toBe(cb)
    })
  })

  describe('unbind', () => {
    it('remove element of the list', () => {
      document.removeEventListener = jest.fn()
      directive.bind(div)
      directive.unbind(div)
      expect(directive.els.length).toBe(0)
      expect(document.removeEventListener.mock.calls.length).toBe(1)
    })

    it('remove multiple element of the list', () => {
      document.removeEventListener = jest.fn()
      directive.bind(div)
      directive.bind(div2)
      directive.unbind(div)
      expect(directive.els[0][0]).toBe(div2)
      directive.unbind(div2)
      expect(directive.els.length).toBe(0)
      expect(document.removeEventListener.mock.calls.length).toBe(1)
    })
  })

  describe('onEvent', () => {
    const message = 'it calls the callback if the element is not the same and does ' +
                    'not contains the event target'

    it(message, () => {
      const event = { target: a }
      const cb = jest.fn()
      directive.bind(div)
      directive.update(div, { value: cb })

      directive.onEvent(event)
      expect(cb).toHaveBeenCalledWith(event)
    })

    it('dont call any callback', () => {
      const event = { target: div }
      const cb = jest.fn()
      directive.bind(div)
      directive.update(div, { value: cb })

      directive.onEvent(event)
      expect(cb).not.toHaveBeenCalled()
    })
  })
})
