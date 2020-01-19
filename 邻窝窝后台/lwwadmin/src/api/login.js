import qs from 'qs'
import * as API from './index'

export function loginByUsername (loginparams) {
  return API.POST('/authorize/login', qs.stringify(loginparams))
}

export function loginByUsernameMe () {
  return API.GET('/authorize/me')
}

export function logout (params) {
  return API.GET('/authorize/login-out', params)
}

// 修改密码
export function changePassword (params) {
  return API.PUT('/user/password', params)
}