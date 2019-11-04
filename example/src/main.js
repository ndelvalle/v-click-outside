import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vClickOutside from '../../lib'

Vue.config.productionTip = false

Vue.use(vClickOutside)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
