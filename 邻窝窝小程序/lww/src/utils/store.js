// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: null,    //用户信息
    imgUrlHttp: process.env.BASE_API,  //定义图片域名前缀
    customerServiceTel: '15855556666',       //客服电话
    token: '',   //token
    globalOpenId: '',   // 用户唯一凭证openid
    globalSessionKey: '',   //sessionKey
    globalMerchantId: ''     //选择社区   存储社区id
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
    changeOpenId: (state,value) => {
      const obj = state
      obj.globalOpenId = value
    },
    changeSessionKey: (state,value) => {
      const obj = state
      obj.globalSessionKey = value
    },
    changeMerchantId: (state,value) => {
      const obj = state
      obj.globalMerchantId = value
    }
  }
})

export default store
