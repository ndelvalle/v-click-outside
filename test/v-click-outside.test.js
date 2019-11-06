/* global jest describe it expect beforeEach beforeAll */

import { merge } from 'lodash'
import clickOutside from '../src/index'

const HANDLERS_PROPERTY = '__v-click-outside'
const { directive } = clickOutside

const createDirective = () => merge({}, directive)

function createHookArguments(el = document.createElement('div'), binding = {}) {
  return [
    el,
    merge(
      {
        value: {
          handler: () => jest.fn(),
          events: ['dblclick'],
          middleware: () => jest.fn(),
          isActive: undefined,
        },
      },
      binding,
    ),
  ]
}

describe('v-click-outside -> plugin', () => {
  it('install the directive into the vue instance', () => {
    const vue = {
      directive: jest.fn(),
    }
    clickOutside.install(vue)
    expect(vue.directive).toHaveBeenCalledWith('click-outside', clickOutside.directive)
    expect(vue.directive).toHaveBeenCalledTimes(1)
  })
})

describe('v-click-outside -> directive', () => {
  it('it has bind, update and unbind methods available', () => {
    expect(typeof clickOutside.directive.bind).toBe('function')
    expect(typeof clickOutside.directive.update).toBe('function')
    expect(typeof clickOutside.directive.unbind).toBe('function')
  })

  describe('bind', () => {
    beforeEach(() => {
      document.documentElement.addEventListener = jest.fn()
      jest.useFakeTimers()
    })

    it('throws an error if the binding value is not a function or an object', () => {
      expect(() => directive.bind(document.createElement('div'), {})).toThrowError(
        /v-click-outside: Binding value must be a function or an object/,
      )
    })

    it('adds an event listener to the element and stores the handlers on the element', () => {
      const directive = createDirective()
      const [el, binding] = createHookArguments()

      directive.bind(el, binding)
      jest.runOnlyPendingTimers()

      expect(el[HANDLERS_PROPERTY].length).toEqual(binding.value.events.length)

      el[HANDLERS_PROPERTY].forEach((eventHandler) =>
        expect(typeof eventHandler.handler).toEqual('function'),
      )

      expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(
        binding.value.events.length,
      )
    })

    it("doesn't do anything when binding value isActive attribute is false", () => {
      const directive = createDirective()
      const [el, binding] = createHookArguments()
      binding.value.isActive = false

      directive.bind(el, binding)
      jest.runOnlyPendingTimers()

      expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(0)
      expect(el[HANDLERS_PROPERTY]).toBeUndefined()
    })
  })

  describe('unbind', () => {
    beforeAll(() => {
      jest.useFakeTimers()
      document.documentElement.removeEventListener = jest.fn()
    })

    it('removes event listeners attached to the element', () => {
      const directive = createDirective()

      const [el1, binding1] = createHookArguments()
      directive.bind(el1, binding1)
      jest.runOnlyPendingTimers()
      expect(el1[HANDLERS_PROPERTY].length).toEqual(1)

      const [el2, binding2] = createHookArguments()
      directive.bind(el2, binding2)
      jest.runOnlyPendingTimers()
      expect(el2[HANDLERS_PROPERTY].length).toEqual(1)

      const [el3, binding3] = createHookArguments()
      directive.bind(el3, binding3)
      jest.runOnlyPendingTimers()
      expect(el3[HANDLERS_PROPERTY].length).toEqual(1)

      const els = [el1, el2, el3]

      els.forEach((el) => {
        directive.unbind(el)
        expect(el[HANDLERS_PROPERTY]).toBeUndefined()
      })
      expect(document.documentElement.removeEventListener).toHaveBeenCalledTimes(3)
    })
  })

  describe('update', () => {
    it('throws an error if the binding value is not a function or an object', () => {
      const directive = createDirective()

      expect(() =>
        directive.update(document.createElement('div'), { value: 'no value' }),
      ).toThrowError(/v-click-outside: Binding value must be a function or an object/)
    })

    describe('updates "isActive" binding value', () => {
      beforeEach(() => {
        jest.useFakeTimers()
        document.documentElement.addEventListener = jest.fn()
        document.documentElement.removeEventListener = jest.fn()
      })

      it('updates isActive binding value from true to true', () => {
        const directive = createDirective()
        const [el, binding] = createHookArguments()

        directive.bind(el, binding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY].length).toEqual(1)
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(1)

        binding.oldValue = binding.value
        directive.update(el, binding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY].length).toEqual(1)
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(1)
        expect(document.documentElement.removeEventListener).toHaveBeenCalledTimes(0)

        const [, newBinding] = createHookArguments(undefined, {
          value: { events: ['click'] },
          oldValue: binding.oldValue,
        })
        directive.update(el, newBinding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY].length).toEqual(1)
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(2)
        expect(document.documentElement.removeEventListener).toHaveBeenCalledTimes(
          binding.value.events.length,
        )
      })

      it('updates is active binding value from true to false', () => {
        const directive = createDirective()
        const [el, binding] = createHookArguments()

        directive.bind(el, binding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY].length).toEqual(1)
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(1)

        binding.value.isActive = false
        directive.update(el, binding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY]).toBeUndefined()
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(1)
        expect(document.documentElement.removeEventListener).toHaveBeenCalledTimes(1)
      })

      it('updates is active binding value from false to true', () => {
        const directive = createDirective()
        const [el, binding] = createHookArguments(undefined, { value: { isActive: false } })

        directive.bind(el, binding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY]).toBeUndefined()
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(0)
        expect(document.documentElement.removeEventListener).toHaveBeenCalledTimes(0)

        binding.oldValue = { ...binding.value }
        binding.value.isActive = true
        directive.update(el, binding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY].length).toEqual(1)
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(1)
        expect(document.documentElement.removeEventListener).toHaveBeenCalledTimes(0)

        const [, newBinding] = createHookArguments(undefined, {
          value: { events: ['click'] },
          oldValue: binding.value,
        })
        directive.update(el, newBinding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY].length).toEqual(1)
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(2)
        expect(document.documentElement.removeEventListener).toHaveBeenCalledTimes(
          binding.value.events.length,
        )
      })

      it('updates is active binding value from false to false', () => {
        const directive = createDirective()
        const [el, binding] = createHookArguments(undefined, { value: { isActive: false } })

        directive.bind(el, binding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY]).toBeUndefined()
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(0)

        directive.update(el, binding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY]).toBeUndefined()
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(0)
        expect(document.documentElement.removeEventListener).toHaveBeenCalledTimes(0)
      })
    })
  })
})
