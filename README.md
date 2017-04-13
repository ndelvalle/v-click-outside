# v-click-outside

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/5ca72a2dd2044278918b45ea1eba122e)](https://www.codacy.com/app/ndelvalle/v-click-outside?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ndelvalle/v-click-outside&amp;utm_campaign=Badge_Grade)
[![bitHound Overall Score](https://www.bithound.io/github/ndelvalle/v-click-outside/badges/score.svg)](https://www.bithound.io/github/ndelvalle/v-click-outside)
[![bitHound Dependencies](https://www.bithound.io/github/ndelvalle/v-click-outside/badges/dependencies.svg)](https://www.bithound.io/github/ndelvalle/v-click-outside/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/ndelvalle/v-click-outside/badges/devDependencies.svg)](https://www.bithound.io/github/ndelvalle/v-click-outside/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/ndelvalle/v-click-outside/badges/code.svg)](https://www.bithound.io/github/ndelvalle/v-click-outside)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


Vue directive to react on clicks outside of an element. Great for closing dialogues, drawers menus among other things.



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
    name: 'Component',

    methods: {
      onClickOutside () {
        console.log('Clicked...');
      }
    }
  };
</script>

<template>
  <div v-click-outside="onClickOutside"></div>
</template>
```
