<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <div class="hello">
      <h1>Welcome to v-click-outside example</h1>
      <div class="ffefd5-box" v-click-outside="ffefd5">
        <p>Click Outside #ffefd5 box</p>
      </div>
      <div class="c13f10-box" v-click-outside="config">
        <p>Click Outside #c13f10 box</p>
      </div>
      <div class="lime-box" ref="limeEl">
        <p>Click Outside #lime box</p>
      </div>
    </div>
  </div>
</template>

<script>
import vClickOutside from '../../../src'
const { bind, unbind } = vClickOutside.directive

export default {
  name: 'home',

  data() {
    return {
      foo: false,
      config: {
        handler: this.c13f10,
        middleware: this.middleware,
        events: ['click'],
      },
    }
  },

  mounted() {
    bind(this.$refs.limeEl, { value: this.lime })
  },

  beforeDestroy() {
    unbind(this.$refs.limeEl)
  },

  methods: {
    ffefd5(ev) {
      console.log('Clicked outside ffefd5!', ev)
    },

    c13f10(ev) {
      console.log('Clicked outside c13f10!', ev)
    },
    middleware(ev) {
      console.log('Middleware!', ev)
      return true
    },
    lime(ev) {
      console.log('Clicked outside lime!', ev)
    },
  },
}
</script>

<style>
.ffefd5-box {
  background-color: #ffefd5;
  height: 50px;
  text-align: center;
}

.c13f10-box {
  background-color: #c13f10;
  height: 50px;
}

.lime-box {
  background-color: lime;
  height: 50px;
}
</style>

