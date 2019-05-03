/* global jest describe it expect beforeEach beforeAll */

import { merge } from 'lodash'
import clickOutside from '../lib/index'

const { directive } = clickOutside

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
      document.addEventListener = jest.fn()
      directive.instances = []
      jest.useFakeTimers()
    })

    it('throws an error if the binding value is not a function or an object', () => {
      expect(() => directive.bind(document.createElement('div'), {})).toThrowError(
        /v-click-outside: Binding value must be a function or an object/,
      )
    })

    it('adds an event listener to the element and stores an instance', () => {
      const [el, binding] = createHookArguments()

      directive.bind(el, binding)
      jest.runOnlyPendingTimers()

      const [instance] = directive.instances

      expect(directive.instances.length).toEqual(binding.value.events.length)
      expect(instance.eventHandlers.length).toEqual(binding.value.events.length)

      instance.eventHandlers.forEach((eventHandler) =>
        expect(typeof eventHandler.handler).toEqual('function'),
      )
      expect(instance.el).toBe(el)
      expect(document.addEventListener).toHaveBeenCalledTimes(binding.value.events.length)
    })

    it("doesn't do anything when binding value isActive is false", () => {
      const [el, binding] = createHookArguments()
      binding.value.isActive = false

      directive.bind(el, binding)
      jest.runOnlyPendingTimers()

      expect(document.addEventListener).toHaveBeenCalledTimes(0)
      expect(directive.instances.length).toEqual(0)
    })
  })

  describe('unbind', () => {
    beforeAll(() => {
      jest.useFakeTimers()
    })
    it('can remove whatever bind adds', () => {
      const [el1, binding1] = createHookArguments()
      directive.bind(el1, binding1)
      jest.runOnlyPendingTimers()
      expect(directive.instances.length).toEqual(1)

      const [el2, binding2] = createHookArguments()
      directive.bind(el2, binding2)
      jest.runOnlyPendingTimers()
      expect(directive.instances.length).toEqual(2)

      const [el3, binding3] = createHookArguments()
      directive.bind(el3, binding3)
      jest.runOnlyPendingTimers()
      expect(directive.instances.length).toEqual(3)

      directive.instances
        .map((instance) => instance.el)
        .forEach((el) => {
          directive.unbind(el)
          expect(directive.instances.find((instance) => instance.el === el)).toBeUndefined()
        })
    })
  })

  describe('update', () => {
    it('throws an error if the binding value is not a function or an object', () => {
      expect(() =>
        directive.update(document.createElement('div'), { value: 'no value' }),
      ).toThrowError(/v-click-outside: Binding value must be a function or an object/)
    })

    describe('updates is active binding value', () => {
      beforeEach(() => {
        jest.useFakeTimers()
        document.addEventListener = jest.fn()
        document.removeEventListener = jest.fn()
        directive.instances = []
      })

      it('updates is active binding value from true to true', () => {
        const [el, binding] = createHookArguments()

        directive.bind(el, binding)
        jest.runOnlyPendingTimers()

        expect(directive.instances.length).toEqual(1)
        expect(document.addEventListener).toHaveBeenCalledTimes(1)

        binding.oldValue = binding.value
        directive.update(el, binding)
        jest.runOnlyPendingTimers()

        expect(directive.instances.length).toEqual(1)
        expect(document.addEventListener).toHaveBeenCalledTimes(1)
        expect(document.removeEventListener).toHaveBeenCalledTimes(0)

        const [, newBinding] = createHookArguments(undefined, {
          value: { events: ['click'] },
          oldValue: binding.oldValue,
        })
        directive.update(el, newBinding)
        jest.runOnlyPendingTimers()

        expect(directive.instances.length).toEqual(1)
        expect(document.addEventListener).toHaveBeenCalledTimes(2)
        expect(document.removeEventListener).toHaveBeenCalledTimes(binding.value.events.length)
      })

      it('updates is active binding value from true to false', () => {
        const [el, binding] = createHookArguments()

        directive.bind(el, binding)
        jest.runOnlyPendingTimers()

        expect(directive.instances.length).toEqual(1)
        expect(document.addEventListener).toHaveBeenCalledTimes(1)

        binding.value.isActive = false
        directive.update(el, binding)
        jest.runOnlyPendingTimers()

        expect(directive.instances.length).toEqual(0)
        expect(document.addEventListener).toHaveBeenCalledTimes(1)
        expect(document.removeEventListener).toHaveBeenCalledTimes(1)
      })

      it('updates is active binding value from false to true', () => {
        const [el, binding] = createHookArguments(undefined, { value: { isActive: false } })

        directive.bind(el, binding)
        jest.runOnlyPendingTimers()

        expect(directive.instances.length).toEqual(0)
        expect(document.addEventListener).toHaveBeenCalledTimes(0)
        expect(document.removeEventListener).toHaveBeenCalledTimes(0)

        binding.oldValue = Object.assign({}, binding.value)
        binding.value.isActive = true
        directive.update(el, binding)
        jest.runOnlyPendingTimers()

        expect(directive.instances.length).toEqual(1)
        expect(document.addEventListener).toHaveBeenCalledTimes(1)
        expect(document.removeEventListener).toHaveBeenCalledTimes(0)

        const [, newBinding] = createHookArguments(undefined, {
          value: { events: ['click'] },
          oldValue: binding.value,
        })
        directive.update(el, newBinding)
        jest.runOnlyPendingTimers()

        expect(directive.instances.length).toEqual(1)
        expect(document.addEventListener).toHaveBeenCalledTimes(2)
        expect(document.removeEventListener).toHaveBeenCalledTimes(binding.value.events.length)
      })

      it('updates is active binding value from false to false', () => {
        const [el, binding] = createHookArguments(undefined, { value: { isActive: false } })

        directive.bind(el, binding)
        jest.runOnlyPendingTimers()

        expect(directive.instances.length).toEqual(0)
        expect(document.addEventListener).toHaveBeenCalledTimes(0)

        directive.update(el, binding)
        jest.runOnlyPendingTimers()

        expect(directive.instances.length).toEqual(0)
        expect(document.addEventListener).toHaveBeenCalledTimes(0)
        expect(document.removeEventListener).toHaveBeenCalledTimes(0)
      })
    })
  })
})
