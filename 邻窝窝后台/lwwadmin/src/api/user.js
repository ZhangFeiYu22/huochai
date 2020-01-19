// import qs from 'qs'
import * as API from './index'

export function getUser (pageNow, pageSize) {
  const url = '/user'
  const data = Object.assign({}, {
    pageIndex: pageNow,
    pageSize: pageSize,
    sortField: '',
    sortOrder: ''
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

export function addUser (userParams) {
  return API.POST('/user', userParams)
}

// 删除
export function delUser (id) {
  return API.DELETE(`/user/${id}`)
}

export function editUser (id, userParams) {
  return API.PUT(`/user/${id}`, userParams)
}

export function searchUser (queryParams, queryParamsIndex) {
  const url = '/user'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

export function getMenuList () {
  const url = '/menu'
  const data = Object.assign({}, {
    paging: false
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

export function getPermissionList () {
  const url = '/permission'
  const data = Object.assign({}, {
    paging: false
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

export function saveAutzSetting (params) {
  return API.PATCH('/autz-setting', params)
}
