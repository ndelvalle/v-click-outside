const { isVue3 } = require('../src/utils')

const lifecycleInstanceMethods = {
  unmount: isVue3 ? 'unmount' : 'destroy',
}

module.exports = isVue3
  ? require('@vue/test-utils-vue3')
  : require('@vue/test-utils')

const ifTest = (value) => (value ? it : it.skip)
module.exports.ifVue2 = ifTest(!isVue3)
module.exports.ifVue3 = ifTest(isVue3)
module.exports.universalDestroy = function destroyWrapper(wrapper) {
  if (wrapper) wrapper[lifecycleInstanceMethods.unmount]()
}
