# v-click-outside

[![Codeship Status for ndelvalle/v-click-outside](https://app.codeship.com/projects/f8c6e5c0-030c-0135-37dc-52cd8f2ce308/status?branch=master)](https://app.codeship.com/projects/213256)
[![Coverage Status](https://coveralls.io/repos/github/ndelvalle/v-click-outside/badge.svg?branch=master)](https://coveralls.io/github/ndelvalle/v-click-outside?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/5ca72a2dd2044278918b45ea1eba122e)](https://www.codacy.com/app/ndelvalle/v-click-outside?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ndelvalle/v-click-outside&amp;utm_campaign=Badge_Grade)


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

On touch devices, the plugin adds 'touchstart' and 'click' event listeners to support laptops with touch screen. Use 'notouch' modifier, to avoid 'click' event to be fired.

```js
<template>
  <div v-click-outside.notouch="onClickOutside"></div>
</template>
```

## License
[MIT License](https://github.com/ndelvalle/v-click-outside/blob/master/LICENSE)

## Style
[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
