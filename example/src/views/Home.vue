<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <div class="hello">
      <h1>Welcome to v-click-outside example</h1>

      <div class="yellow-box" v-click-outside="onYellowClick">
        <p>Click Outside Yellow box</p>
      </div>

      <div class="red-box" v-click-outside="config">
        <p>Click Outside Red box</p>
      </div>

      <div class="lime-box" ref="limeEl">
        <p>Click Outside Lime box</p>
      </div>

      <div class="blue-box" v-click-outside="onBlueClick">
        <p>Click Outside blue box</p>
        <iframe tabindex="1" class="iframe-button-example" src="/about" />
      </div>

      <iframe class="iframe" src="/about" width="100%" />
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
        handler: this.onRedClick,
        middleware: this.onRedClickMiddleware,
        events: ['click'],
      },
    }
  },

  mounted() {
    bind(this.$refs.limeEl, { value: this.onLimeClick })
  },

  beforeDestroy() {
    unbind(this.$refs.limeEl)
  },

  methods: {
    onYellowClick(ev) {
      console.log('Clicked outside Yellow!', ev)
    },

    onRedClick(ev) {
      console.log('Clicked outside Red!', ev)
    },

    onRedClickMiddleware(ev) {
      console.log('Middleware from click outside Red!', ev)
      return true
    },

    onLimeClick(ev) {
      console.log('Clicked outside Lime!', ev)
    },

    onBlueClick(ev) {
      console.log(`Clicked outside Blue!`, ev)
    },
  },
}
</script>

<style>
.yellow-box {
  background-color: yellow;
  height: 50px;
  text-align: center;
}

.red-box {
  background-color: red;
  height: 50px;
}

.lime-box {
  background-color: lime;
  height: 50px;
}

.blue-box {
  background-color: blue;
  color: white;
}

.iframe-button-example {
  border: 2px solid white;
  border-radius: 8px;
  width: 200px;
  height: 50px;
  overflow: hidden;
}

.iframe {
  border: 1px solid lightgrey;
  margin-top: 1em;
}
</style>
