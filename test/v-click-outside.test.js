import directive from '../lib/v-click-outside';

describe('v-click-outside -> directive', () => {

  const div = document.createElement('div')
  const a = document.createElement('a')

  afterEach(() => {
    directive.onEventBound = undefined
    directive.cb = undefined
  });

  it('it has bind, update and unbind methods available', () => {
    expect(typeof directive.bind).toBe('function')
    expect(typeof directive.update).toBe('function')
    expect(typeof directive.unbind).toBe('function')
  })

  describe('bind', () => {
    it('defines onEventBound function', () => {
      directive.bind(div)
      expect(typeof directive.onEventBound).toBe('function')
    });
  });

  describe('update', () => {
    it('throws if value is not a function', () => {
      const updateWithNoFunction = () => {
        directive.update(div, {})
      }
      expect(updateWithNoFunction).toThrowError(/Argument must be a function/)
    });

    it('saves the callback', () => {
      const cb = () => {};
      directive.update(div, { value: cb })
      expect(directive.cb).toBe(cb)
    });
  });

  describe('onEvent', () => {
    const message = 'it calls the callback if the element is not the same and does ' +
                    'not contains the event target'
    it(message, () => {
      const event = { target: a }
      const onEventBound = directive.onEvent.bind({ el: div })

      directive.cb = jest.fn()

      onEventBound(event)
      expect(directive.cb).toHaveBeenCalled()
    });
  });
});
