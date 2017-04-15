# v-click-outside

[![Codeship Status](https://img.shields.io/codeship/f8c6e5c0-030c-0135-37dc-52cd8f2ce308/master.svg)](https://app.codeship.com/projects/213256)
[![Coverage Status](https://coveralls.io/repos/github/ndelvalle/v-click-outside/badge.svg?branch=master)](https://coveralls.io/github/ndelvalle/v-click-outside?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/5ca72a2dd2044278918b45ea1eba122e)](https://www.codacy.com/app/ndelvalle/v-click-outside?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ndelvalle/v-click-outside&amp;utm_campaign=Badge_Grade)
[![bitHound Overall Score](https://www.bithound.io/github/ndelvalle/v-click-outside/badges/score.svg)](https://www.bithound.io/github/ndelvalle/v-click-outside)
[![bitHound Dev Dependencies](https://www.bithound.io/github/ndelvalle/v-click-outside/badges/devDependencies.svg)](https://www.bithound.io/github/ndelvalle/v-click-outside/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/ndelvalle/v-click-outside/badges/code.svg)](https://www.bithound.io/github/ndelvalle/v-click-outside)


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

## License
[MIT License](https://github.com/ndelvalle/v-click-outside/blob/master/LICENSE)

## Style
[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
