import * as API from './index'

export function getMenuList (sortIndex) {
  const url = '/menu'
  const data = Object.assign({}, {
    paging: false,
    pageIndex: 0,
    pageSize: 10,
    sortField: sortIndex,
    sortOrder: ''
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

export function addMenu (params) {
  return API.PATCH('/menu', params)
}

export function searchMenu (queryParams, queryParamsIndex) {
  const url = '/menu'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

export function delMenu (id) {
  return API.DELETE(`/menu/${id}`)
}
