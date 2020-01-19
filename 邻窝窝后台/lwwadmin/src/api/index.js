import axios from 'axios'
import Vue from 'vue'
import router from '../router/index';
import {Message} from 'element-ui'
let v = new Vue()

axios.defaults.baseURL = '/api'
// axios.defaults.baseURL = ''
axios.create({
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  }
})

// 添加一个响应拦截器
axios.interceptors.response.use((response) => {
  if (response.data && response.data.errcode) {
    if (parseInt(response.data.errcode) === 40001) {
      console.log('未登录')
      // 未登录
      v.$emit('go', '/')
    }
  }
  return response
}, error => {
  if (error.response) {
    switch (error.response.status) {
      // 返回401，清除token信息并跳转到登录页面
      case 401:
        Message('登录失效,请重新登录!');
        router.replace({
          path: '/login'
        })
    }
    // 返回接口返回的错误信息
    return Promise.reject(error.response.data);
  }
})

export const POST = (url, params) => {
  return axios.post(url, params).then(res => res.data)
}

export const GET = (url, params) => {
  return axios.get(url, params).then(res => JSON.stringify(res.data))
}

export const PUT = (url, params) => {
  return axios.put(url, params).then(res => res.data)
}

export const DELETE = (url, params) => {
  return axios.delete(url, params).then(res => res.data)
}

export const PATCH = (url, params) => {
  return axios.patch(url, params).then(res => res.data)
}
