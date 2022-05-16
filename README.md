# v-click-outside

[![Build Status](https://travis-ci.com/ndelvalle/v-click-outside.svg?branch=master)](https://travis-ci.com/ndelvalle/v-click-outside)
[![Coverage Status](https://coveralls.io/repos/github/ndelvalle/v-click-outside/badge.svg?branch=master)](https://coveralls.io/github/ndelvalle/v-click-outside?branch=master)

Vue directive to react on clicks outside an element without stopping the event propagation.
Great for closing dialogues and menus among other things.

## Install

```bash
$ npm install --save v-click-outside
```

```bash
$ yarn add v-click-outside
```

## Use

```js
import Vue from 'vue'
import vClickOutside from 'v-click-outside'

Vue.use(vClickOutside)
```

```js
<script>
  export default {
    data () {
      vcoConfig: {
        handler: this.handler,
        middleware: this.middleware,
        events: ['dblclick', 'click'],
        // Note: The default value is true, but in case you want to activate / deactivate
        //       this directive dynamically use this attribute.
        isActive: true,
        // Note: The default value is true. See "Detecting Iframe Clicks" section
        //       to understand why this behavior is behind a flag.
        detectIFrame: true,
        // Note: The default value is false. Sets the capture option for EventTarget addEventListener method.
        //       Could be useful if some event's handler calls stopPropagation method preventing event bubbling.
        capture: false
      }
    },
    methods: {
      onClickOutside (event) {
        console.log('Clicked outside. Event: ', event)
      },

      handler (event) {
        console.log('Clicked outside (Using config), middleware returned true :)')
      },
      // Note: The middleware will be executed if the event was fired outside the element.
      //       It should have only sync functionality and it should return a boolean to
      //       define if the handler should be fire or not
      middleware (event) {
        return event.target.className !== 'modal'
      }
    }
  };
</script>

<template>
  <div v-click-outside="onClickOutside"></div>
  <div v-click-outside="vcoConfig"></div>
</template>
```

Or use it as a directive

```js
import vClickOutside from 'v-click-outside'

<script>
  export default {
    directives: {
      clickOutside: vClickOutside.directive
    },
    methods: {
      onClickOutside (event) {
        console.log('Clicked outside. Event: ', event)
      }
    }
  };
</script>

<template>
  <div v-click-outside="onClickOutside"></div>
</template>
```

Or use directive‘s hooks programmatically

```vue
<script>
import vClickOutside from 'v-click-outside'
const { bind, unbind } = vClickOutside.directive

export default {
  name: 'RenderlessExample',

  mounted() {
    const this._el = document.querySelector('data-ref', 'some-uid')
    // Note: v-click-outside config or handler needs to be passed to the
    //       "bind" function 2nd argument as object with a "value" key:
    //       same as Vue’s directives "binding" format.
    // https://vuejs.org/v2/guide/custom-directive.html#Directive-Hook-Arguments
    bind(this._el, { value: this.onOutsideClick })
  },
  beforeDestroy() {
    unbind(this._el)
  },

  methods: {
    onClickOutside (event) {
      console.log('Clicked outside. Event: ', event)
    }
  },

  render() {
    return this.$scopedSlots.default({
      // Note: you can't pass vue's $refs (ref attribute) via slot-scope,
      //       and have this.$refs property populated as it will be
      //       interpreted as a regular html attribute. Workaround it
      //       with good old data-attr + querySelector combo.
      props: { 'data-ref': 'some-uid' }
    })
  }
};
</script>
```

```vue
<!-- SomeComponent.vue -->
<template>
  <renderless-example v-slot:default="slotScope">
    <div v-bind="slotScope.props">
      Transparently bound v-click-outside directive via slotScope
    </div>
  </renderless-example>
</template>
```

See [#220](https://github.com/ndelvalle/v-click-outside/issues/220) for details or [check-out this demo](https://codesandbox.io/s/v-click-outside-programatic-usage-o9drq)


## Example

[![Edit v-click-outside](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/zx7mx8y1ol?module=%2Fsrc%2Fcomponents%2FHelloWorld.vue)


## Detecting Iframe Clicks

To our knowledge, there isn't an idiomatic way to detect a click on a `<iframe>` (`HTMLIFrameElement`).
Clicks on iframes moves `focus` to its contents’ `window` but don't `bubble` up to main `window`, therefore not triggering our `document.documentElement` listeners. On the other hand, the abovementioned `focus` event does trigger a `window.blur` event on main `window` that we use in conjunction with `document.activeElement` to detect if it came from an `<iframe>`, and execute the provided `handler`.

**As with any workaround, this also has its caveats:**

- Click outside will be triggered once on iframe. Subsequent clicks on iframe will not execute the handler **until focus has been moved back to main window** — as in by clicking anywhere outside the iframe. This is the "expected" behavior since, as mentioned before, by clicking the iframe focus will move to iframe contents — a different window, so subsequent clicks are inside its frame. There might be way to workaround this such as calling window.focus() at the end of the provided handler but that will break normal tab/focus flow;
- Moving focus to `iframe` via `keyboard` navigation also triggers `window.blur` consequently the handler - no workaround found ATM;

Because of these reasons, the detection mechanism is behind the `detectIframe` flag that you can optionally set to `false` if you find it conflicting with your use-case.
Any improvements or suggestions to this are welcomed.


## Migrate from version 1

The `notouch` modifier is no longer supported, same functionality can be achieved using a middleware function

## Migrate from version 2

The HTML `el` is not sent in the handler function argument any more. Review [this issue](https://github.com/ndelvalle/v-click-outside/issues/137) for more details.

## License

[MIT License](https://github.com/ndelvalle/v-click-outside/blob/master/LICENSE)
