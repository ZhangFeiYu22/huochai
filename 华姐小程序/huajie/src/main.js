import Vue from 'vue'
import App from './App'
import store from './store/globalStore'

import "../static/iconfont/iconfont.css"

Vue.config.productionTip = false
App.mpType = 'app'

// Vue.filter('keepTwoNum', function(value){
//   value = Number(value);
//   return value.toFixed(2);
// })

Vue.prototype.keepTwoNum = function (value) {
  value = Number(value);
  return value.toFixed(2);
}
const app = new Vue(App)
app.$mount()
Vue.prototype.$store = store
