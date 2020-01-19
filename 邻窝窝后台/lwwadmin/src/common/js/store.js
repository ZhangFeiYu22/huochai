import Vue from 'Vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: '',
    userInfoMe: null,
  },
  actions: {
    getUser (ctx, user) {
      ctx.commit('getUser', user)
    }
  },
  mutations: {
    getUser (state, user) {
      state.user = user
    }
  },
  // mutations: {
  //   changeUserName: (state,value) => {
  //     const obj = state
  //     obj.userName = value
  //   },
  //   changeUserInfoMe: (state,value) => {
  //     const obj = state
  //     obj.userInfoMe = value
  //   }
  // }
})

export default store