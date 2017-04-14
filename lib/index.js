import directive from './v-click-outside'

const plugin = {
  install (Vue) {
    Vue.directive('click-outside', directive)
  }
}

export default plugin
