import * as API from './index'

export function getOrg () {
  const url = '/organizational'
  const data = Object.assign({}, {
    paging: false,
    // pageIndex: 0,
    // pageSize: 10,
    sortField: '',
    sortOrder: ''
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

export function addOrg (params) {
  return API.PATCH('/organizational', params)
}
export function dellOrg (id) {
  return API.DELETE(`/organizational/${id}`)
}
export function addAll (arr) {
  return API.PATCH('/organizational/batch', arr)
}

export function searchOrg (queryParams, queryParamsIndex) {
  const url = '/organizational'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
