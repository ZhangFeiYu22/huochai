// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
Vue.prototype.$axios=axios

Vue.config.productionTip = false

Vue.use(ElementUI)

import store from './common/js/store'


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  data: function(){
    return {
      // imgUrlHttp: window.location.origin  //定义图片域名前缀
      imgUrlHttp: process.env.BASE_API  //定义图片域名前缀
    }
  },
  template: '<App/>',
  components: { App }
})
