import Vue from 'vue'
import App from './App'
import fly from './utils/fly'
Vue.prototype.$http = fly

Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.numChangeFun = function (intent) {
  if (Object.prototype.toString.call(intent) == '[object Array]') {
    intent.map(item => {
      if (999 < item.num && item.num < 9999) {
        var num = item.num / 1000;
        item.num = num.toFixed(1) + 'k';
      } else if (10000 < item.num) {
        var num = item.num / 10000;
        item.num = num.toFixed(1) + 'w';
      }
    })
  } else {
    if (999 < intent.num && intent.num < 9999) {
      var num = intent.num / 1000;
      intent.num = num.toFixed(1) + 'K';
    } else if (10000 < intent.num) {
      var num = intent.num / 10000;
      intent.num = num.toFixed(1) + 'W';
    }
  }

}

const app = new Vue(App)
app.$mount()
