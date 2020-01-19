import * as API from './index'

// 获取所有人员的列表
export function getPersonList (pageNow, pageSize) {
  const url = '/person'
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
// 根据条件搜索查找
export function searchPerson (queryParams, queryParamsIndex) {
  const url = '/person'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

// 获取机构
export function getOrgs () {
  const url = '/organizational'
  const data = Object.assign({}, {
    paging: false
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 根据id查找机构详情
export function getOrgsDetails (id) {
  const url = `/organizational/${id}`
  return API.GET(url).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 获取部门
export function getDepartment (queryParamsIndex) {
  const url = '/department'
  const data = Object.assign({}, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 根据id查找部门详情
export function getDepartmentDetails (id) {
  const url = `/department/${id}`
  return API.GET(url).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 获取职位
export function getPosition (queryParamsIndex) {
  const url = '/position'
  const data = Object.assign({}, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 根据id查找职位详情
export function getPositionDetails (id) {
  const url = `/position/${id}`
  return API.GET(url).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

// 添加人员
export function addPerson (params) {
  return API.POST(`/person/detail`, params)
}
// 获取单个人员详情
export function getPersonOneDetail (paramsdata) {
  const url = `/person/${paramsdata.id}/detail`
  const data = Object.assign({}, paramsdata)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 编辑保存单个人员
export function savePersonOne (params) {
  return API.PUT(`/person/${params.aimId}/detail`, params)
}
// 删除人员
export function delPerson (id) {
  return API.DELETE(`/person/${id}`)
}

// -----------------------------------------------------------------------

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
