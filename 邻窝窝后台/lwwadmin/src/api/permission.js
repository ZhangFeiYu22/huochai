import * as API from './index'

export function getPermissList (pageNow) {
  const url = '/permission'
  const data = Object.assign({}, {
    pageIndex: pageNow,
    pageSize: 20,
    sortField: '',
    sortOrder: ''
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

export function addPermiss (params) {
  return API.POST('/permission', params)
}

export function searchPermiss (queryParams, queryParamsIndex) {
  const url = '/permission'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

export function delPermiss (id) {
  return API.DELETE(`/permission/${id}`)
}

export function editPermiss (id, params) {
  return API.PUT(`/permission/${id}`, params)
}
