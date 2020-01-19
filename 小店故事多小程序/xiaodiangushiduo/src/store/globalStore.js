// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    userInfo: null,
    urlPath: 'https://mini.dscs123.com',
    token: '',
    globalAppId: 'wx98fa9989372e7856',
    globalCode: '',
    globalSessionKey: ''
  },
  mutations: {
    changeUserInfo: (state,value) => {
      const obj = state
      obj.userInfo = value
    },
    changeToken: (state,value) => {
      const obj = state
      obj.token = value
    },
    changeOpenid: (state,value) => {
      const obj = state
      obj.globalAppId = value
    },
    changeCode: (state,value) => {
      const obj = state
      obj.globalCode = value
    },
    changeSessionKey: (state,value) => {
      const obj = state
      obj.globalSessionKey = value
    }
    
  }
})

export default store
