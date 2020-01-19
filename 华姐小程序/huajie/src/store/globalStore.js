import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    navHeight: '',  //导航栏高度
    userInfo: null,
    authToken: '',
    shareUrl: false
  },
  mutations: {
    changeNavHeight: (state, value) => {
      const obj = state
      obj.navHeight = value
    },
    changeUserInfo: (state, value) => {
      const obj = state
      obj.userInfo = value
    },
    changeToken: (state, value) => {
      const obj = state
      obj.authToken = value
    },
    changeShareUrl: (state, value) => {
      const obj = state
      obj.shareUrl = value
    }

  }
})

export default store
