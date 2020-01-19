import * as API from './index'

export function getRoleList () {
  const url = '/role'
  const data = Object.assign({}, {
    pageIndex: 0,
    pageSize: 10,
    sortField: '',
    sortOrder: ''
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

export function addRole (roleParams) {
  return API.POST('/role', roleParams)
}

export function editRole (id, roleParams) {
  return API.PUT(`/role/${id}`, roleParams)
}

export function searchRole (queryParams, queryParamsIndex) {
  const url = '/role'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
