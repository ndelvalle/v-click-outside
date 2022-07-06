/* global jest describe it expect beforeEach afterEach beforeAll */

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
          detectIframe: undefined,
        },
      },
      binding,
    ),
  ]
}

describe('v-click-outside -> directive', () => {
  describe('bind', () => {
    beforeEach(() => {
      document.documentElement.addEventListener = jest.fn()
      window.addEventListener = jest.fn()
      jest.useFakeTimers()
    })

    it('throws an error if the binding value is not a function or an object', () => {
      expect(() =>
        directive.bind(document.createElement('div'), {}),
      ).toThrowError(
        /v-click-outside: Binding value must be a function or an object/,
      )
    })

    it('adds an event listener to the element and stores the handlers on the element', () => {
      const directive = createDirective()
      const [el, binding] = createHookArguments()

      directive.bind(el, binding)
      jest.runOnlyPendingTimers()

      expect(el[HANDLERS_PROPERTY].length).toEqual(
        binding.value.events.length + 1, // [vco:faux-iframe-click]
      )

      el[HANDLERS_PROPERTY].forEach((eventHandler) =>
        expect(typeof eventHandler.handler).toEqual('function'),
      )

      expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(
        binding.value.events.length,
      )

      expect(window.addEventListener).toHaveBeenCalledTimes(1)
    })

    it("doesn't do anything when binding value isActive attribute is false", () => {
      const directive = createDirective()
      const [el, binding] = createHookArguments()
      binding.value.isActive = false

      directive.bind(el, binding)
      jest.runOnlyPendingTimers()

      expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(0)
      expect(window.addEventListener).toHaveBeenCalledTimes(0)
      expect(el[HANDLERS_PROPERTY]).toBeUndefined()
    })

    it('detects iframe clicks, if bindingValue.detectIframe attribute is not false', () => {
      const directive = createDirective()
      const [el, binding] = createHookArguments()

      directive.bind(el, binding)
      jest.runOnlyPendingTimers()

      expect(window.addEventListener).toHaveBeenCalledTimes(1)

      const directive2 = createDirective()
      const [el2, binding2] = createHookArguments(undefined, {
        value: { detectIframe: false },
      })

      directive2.bind(el2, binding2)
      jest.runOnlyPendingTimers()

      expect(window.addEventListener).toHaveBeenCalledTimes(1)
    })

    it('checks that event listener is set correctly with capture option passed', () => {
      const directive = createDirective()
      const [el, binding] = createHookArguments()
      binding.value.capture = true

      directive.bind(el, binding)
      jest.runOnlyPendingTimers()

      el[HANDLERS_PROPERTY].forEach(({ event, srcTarget, handler }) =>
        expect(srcTarget.addEventListener).toHaveBeenCalledWith(
          event,
          handler,
          true,
        ),
      )
    })
  })

  describe('unbind', () => {
    beforeAll(() => {
      jest.useFakeTimers()
      document.documentElement.removeEventListener = jest.fn()
      window.removeEventListener = jest.fn()
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('removes event listeners attached to the element', () => {
      const directive = createDirective()

      const [el1, binding1] = createHookArguments()
      directive.bind(el1, binding1)
      jest.runOnlyPendingTimers()
      expect(el1[HANDLERS_PROPERTY].length).toEqual(2)

      const [el2, binding2] = createHookArguments()
      directive.bind(el2, binding2)
      jest.runOnlyPendingTimers()
      expect(el2[HANDLERS_PROPERTY].length).toEqual(2)

      const [el3, binding3] = createHookArguments()
      directive.bind(el3, binding3)
      jest.runOnlyPendingTimers()
      expect(el3[HANDLERS_PROPERTY].length).toEqual(2)

      const els = [el1, el2, el3]

      els.forEach((el) => {
        directive.unbind(el)
        expect(el[HANDLERS_PROPERTY]).toBeUndefined()
      })
      expect(
        document.documentElement.removeEventListener,
      ).toHaveBeenCalledTimes(3)
    })

    it('removes event listener attached to window', () => {
      const directive = createDirective()
      const [el, bindingValue] = createHookArguments()

      directive.bind(el, bindingValue)
      jest.runOnlyPendingTimers()

      directive.unbind(el)
      expect(window.removeEventListener).toHaveBeenCalledTimes(1)
    })

    it('removes event listeners with capture option passed', () => {
      const directive = createDirective()

      const [el, binding] = createHookArguments()
      binding.value.capture = true
      directive.bind(el, binding)
      jest.runOnlyPendingTimers()

      const elSettings = el[HANDLERS_PROPERTY]
      directive.unbind(el)

      elSettings.forEach(({ event, srcTarget, handler }) =>
        expect(srcTarget.removeEventListener).toHaveBeenCalledWith(
          event,
          handler,
          true,
        ),
      )
    })
  })

  describe('update', () => {
    it('throws an error if the binding value is not a function or an object', () => {
      const directive = createDirective()

      expect(() =>
        directive.update(document.createElement('div'), { value: 'no value' }),
      ).toThrowError(
        /v-click-outside: Binding value must be a function or an object/,
      )
    })

    describe('updates "isActive" binding value', () => {
      beforeEach(() => {
        jest.useFakeTimers()
        document.documentElement.addEventListener = jest.fn()
        document.documentElement.removeEventListener = jest.fn()
        window.addEventListener = jest.fn()
        window.removeEventListener = jest.fn()
      })

      it('updates isActive binding value from true to true', () => {
        const directive = createDirective()
        const [el, binding] = createHookArguments()

        directive.bind(el, binding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY].length).toEqual(2)
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(
          1,
        )
        expect(window.addEventListener).toHaveBeenCalledTimes(1)

        binding.oldValue = binding.value
        directive.update(el, binding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY].length).toEqual(2)
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(
          1,
        )
        expect(
          document.documentElement.removeEventListener,
        ).toHaveBeenCalledTimes(0)
        expect(window.addEventListener).toHaveBeenCalledTimes(1)
        expect(window.removeEventListener).toHaveBeenCalledTimes(0)

        const [, newBinding] = createHookArguments(undefined, {
          value: { events: ['click'] },
          oldValue: binding.oldValue,
        })
        directive.update(el, newBinding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY].length).toEqual(2)
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(
          2,
        )
        expect(
          document.documentElement.removeEventListener,
        ).toHaveBeenCalledTimes(binding.value.events.length)
        expect(window.addEventListener).toHaveBeenCalledTimes(2)
        expect(window.removeEventListener).toHaveBeenCalledTimes(1)
      })

      it('updates is active binding value from true to false', () => {
        const directive = createDirective()
        const [el, binding] = createHookArguments()

        directive.bind(el, binding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY].length).toEqual(2)
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(
          1,
        )
        expect(window.addEventListener).toHaveBeenCalledTimes(1)

        binding.value.isActive = false
        directive.update(el, binding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY]).toBeUndefined()
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(
          1,
        )
        expect(
          document.documentElement.removeEventListener,
        ).toHaveBeenCalledTimes(1)
        expect(window.addEventListener).toHaveBeenCalledTimes(1)
        expect(window.removeEventListener).toHaveBeenCalledTimes(1)
      })

      it('updates is active binding value from false to true', () => {
        const directive = createDirective()
        const [el, binding] = createHookArguments(undefined, {
          value: { isActive: false },
        })

        directive.bind(el, binding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY]).toBeUndefined()
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(
          0,
        )
        expect(
          document.documentElement.removeEventListener,
        ).toHaveBeenCalledTimes(0)
        expect(window.addEventListener).toHaveBeenCalledTimes(0)
        expect(window.removeEventListener).toHaveBeenCalledTimes(0)

        binding.oldValue = { ...binding.value }
        binding.value.isActive = true
        directive.update(el, binding)
        jest.runOnlyPendingTimers()
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY].length).toEqual(2)
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(
          1,
        )
        expect(window.addEventListener).toHaveBeenCalledTimes(1)
        expect(
          document.documentElement.removeEventListener,
        ).toHaveBeenCalledTimes(0)
        expect(window.addEventListener).toHaveBeenCalledTimes(1)
        expect(window.removeEventListener).toHaveBeenCalledTimes(0)

        const [, newBinding] = createHookArguments(undefined, {
          value: { events: ['click'] },
          oldValue: binding.value,
        })
        directive.update(el, newBinding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY].length).toEqual(2)
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(
          2,
        )
        expect(
          document.documentElement.removeEventListener,
        ).toHaveBeenCalledTimes(binding.value.events.length)
        expect(window.addEventListener).toHaveBeenCalledTimes(2)
        expect(window.removeEventListener).toHaveBeenCalledTimes(1)
      })

      it('updates is active binding value from false to false', () => {
        const directive = createDirective()
        const [el, binding] = createHookArguments(undefined, {
          value: { isActive: false },
        })

        directive.bind(el, binding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY]).toBeUndefined()
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(
          0,
        )
        expect(window.addEventListener).toHaveBeenCalledTimes(0)
        expect(window.removeEventListener).toHaveBeenCalledTimes(0)

        directive.update(el, binding)
        jest.runOnlyPendingTimers()

        expect(el[HANDLERS_PROPERTY]).toBeUndefined()
        expect(document.documentElement.addEventListener).toHaveBeenCalledTimes(
          0,
        )
        expect(
          document.documentElement.removeEventListener,
        ).toHaveBeenCalledTimes(0)
        expect(window.addEventListener).toHaveBeenCalledTimes(0)
        expect(window.removeEventListener).toHaveBeenCalledTimes(0)
      })
    })

    describe('updates "detectIframe" binding value', () => {
      beforeEach(() => {
        jest.useFakeTimers()
        window.addEventListener = jest.fn()
        window.removeEventListener = jest.fn()
      })

      it('works', () => {
        const directive = createDirective()
        const [el, binding] = createHookArguments()

        directive.bind(el, binding)
        jest.runOnlyPendingTimers()

        // starts true by default
        expect(window.addEventListener).toHaveBeenCalledTimes(1)
        expect(window.removeEventListener).toHaveBeenCalledTimes(0)

        // TRUE TO FALSE
        binding.oldValue = { ...binding.value }
        binding.value.detectIframe = false
        directive.update(el, binding)
        jest.runOnlyPendingTimers()

        // Same count
        expect(window.addEventListener).toHaveBeenCalledTimes(1)
        // Event remove
        expect(window.removeEventListener).toHaveBeenCalledTimes(1)

        // FALSE TO TRUE
        binding.oldValue = { ...binding.value }
        binding.value.detectIframe = true
        directive.update(el, binding)
        jest.runOnlyPendingTimers()

        expect(window.addEventListener).toHaveBeenCalledTimes(2)
        expect(window.removeEventListener).toHaveBeenCalledTimes(1)

        // TRUE TO TRUE
        binding.oldValue = { ...binding.value }
        binding.value.detectIframe = true
        directive.update(el, binding)
        jest.runOnlyPendingTimers()

        expect(window.addEventListener).toHaveBeenCalledTimes(2)
        expect(window.removeEventListener).toHaveBeenCalledTimes(1)
      })
    })
  })
})
