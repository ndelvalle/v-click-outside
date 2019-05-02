# v-click-outside

[![Codeship Status for ndelvalle/v-click-outside](https://app.codeship.com/projects/f8c6e5c0-030c-0135-37dc-52cd8f2ce308/status?branch=master)](https://app.codeship.com/projects/213256)
[![Coverage Status](https://coveralls.io/repos/github/ndelvalle/v-click-outside/badge.svg?branch=master)](https://coveralls.io/github/ndelvalle/v-click-outside?branch=master)
[![dependencies Status](https://david-dm.org/ndelvalle/v-click-outside/status.svg)](https://david-dm.org/ndelvalle/v-click-outside)
[![devDependencies Status](https://david-dm.org/ndelvalle/v-click-outside/dev-status.svg)](https://david-dm.org/ndelvalle/v-click-outside?type=dev)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/5ca72a2dd2044278918b45ea1eba122e)](https://www.codacy.com/app/ndelvalle/v-click-outside?utm_source=github.com&utm_medium=referral&utm_content=ndelvalle/v-click-outside&utm_campaign=Badge_Grade)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-green)](https://github.com/prettier/prettier)

Vue directive to react on clicks outside an element without stopping the event propagation. Great for closing dialogues, menus among other things.

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
        isActive: true
      }
    },
    methods: {
      onClickOutside (event, el) {
        console.log('Clicked outside. Event: ', event)
      },

      handler (event, el) {
        console.log('Clicked outside (Using config), middleware returned true :)')
      },
      // Note: The middleware will be executed if the event was fired outside the element.
      //       It should have only sync functionality and it should return a boolean to
      //       define if the handler should be fire or not
      middleware (event, el) {
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

## Example

[![Edit v-click-outside](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/zx7mx8y1ol?module=%2Fsrc%2Fcomponents%2FHelloWorld.vue)

## Migrate from version 1

The `notouch` modifier is no longer supported, same functionality can be achieved using a middleware function

## License

[MIT License](https://github.com/ndelvalle/v-click-outside/blob/master/LICENSE)
