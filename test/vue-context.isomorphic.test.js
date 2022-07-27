import clickOutside from '../src/index'
import {
  mount,
  createLocalVue,
  universalDestroy,
  ifVue2,
  ifVue3,
} from './test-utils'

const MockComponent = {
  name: 'MockComponent',
  directives: {
    clickOutside: clickOutside.directive,
  },
  props: {
    directiveHandlerBinding: {
      type: [Object, Function],
      default: () => () => {},
    },
  },
  data: () => ({
    keys: Object.keys(clickOutside.directive),
  }),
  template: `
    <div data-test-id="outside">
      {{ keys }}
      <div data-test-id="target" v-click-outside="directiveHandlerBinding">
        Inside content
      </div>
    </div>
  `,
}

const factory = (propsData) => {
  return mount(MockComponent, { attachTo: document.body, propsData })
}

let wrapper
beforeAll(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  universalDestroy(wrapper)

  jest.clearAllMocks()
})

describe('module', () => {
  ifVue2('vue2: exports correct direct hook names', () => {
    expect(clickOutside.directive).toMatchObject({
      bind: expect.any(Function),
      update: expect.any(Function),
      unbind: expect.any(Function),
    })
  })

  ifVue3('vue3: exports correct direct hook names', () => {
    expect(clickOutside.directive).toMatchObject({
      beforeMount: expect.any(Function),
      updated: expect.any(Function),
      unmounted: expect.any(Function),
    })
  })
})

describe('directive', () => {
  const directiveHandlerSpy = jest.fn()

  it('does not throw errors on component mount', () => {
    wrapper = factory()
    // console.log(wrapper.html()) check that keys are different between tests
    expect(wrapper.exists()).toBe(true)
  })

  it('works', (done) => {
    wrapper = factory({ directiveHandlerBinding: directiveHandlerSpy })
    jest.runAllTimers()

    return wrapper.trigger('click').then(() => {
      expect(directiveHandlerSpy).toHaveBeenCalledTimes(1)
      done()
    })
  })
})

describe('plugin', () => {
  // no local declaration of directive, it's globally available via plugin
  ifVue2('vue2: installs and works', (done) => {
    const localVue = createLocalVue()
    localVue.use(clickOutside)
    const spy = jest.fn()

    wrapper = mount(
      {
        template: `
          <div data-test-id="outside">
            <div data-test-id="target" v-click-outside="test">
              Inside content
            </div>
          </div>
        `,
        methods: {
          test() {
            spy()
          },
        },
      },
      {
        localVue,
        attachTo: document.body,
      },
    )

    jest.runAllTimers()

    return wrapper.trigger('click').then(() => {
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    })
  })

  ifVue3('vue3: installs and works', (done) => {
    const spy3 = jest.fn()

    wrapper = mount(
      {
        template: `
          <div data-test-id="outside">
            <div data-test-id="target" v-click-outside="test">
              Inside content
            </div>
          </div>
        `,
        methods: {
          test() {
            spy3()
          },
        },
      },
      {
        global: {
          plugins: [clickOutside],
        },
        attachTo: document.body,
      },
    )

    jest.runAllTimers()

    return wrapper.trigger('click').then(() => {
      expect(spy3).toHaveBeenCalledTimes(1)
      done()
    })
  })
})
