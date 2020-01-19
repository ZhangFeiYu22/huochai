/**
 * Created by user on 2017/12/16.
 */
import * as API from './index'

export function getOrgs () {
  const url = '/organizational'
  const data = Object.assign({}, {
    paging: false,
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

export function getDepartment (queryParamsIndex) {
  const url = '/department'
  const data = Object.assign({}, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

export function getPosition (queryParamsIndex) {
  const url = '/position'
  const data = Object.assign({}, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 获取人员信息
export function getPerson (id) {
  const url = `/person/in-position/${id}`
  return API.GET(url)
}
// 添加部门
export function addDepartment (params) {
  return API.POST('/department', params)
}
// 添加职位
export function addPosition (params) {
  return API.POST('/position', params)
}
// 编辑职位  单独保存  传id保存
export function addPositionOne (params) {
  return API.PUT(`/position/${params.positionId}`, params)
}
// 编辑部门
export function editDep (id, params) {
  return API.PUT(`/department/${id}`, params)
}
// 删除部门
export function delDep (id) {
  return API.DELETE(`/department/${id}`)
}
//编辑职位
export function editPos (id, params) {
  return API.PUT(`/position/${id}`, params)
}
// 删除职位
export function delPos (id) {
  return API.DELETE(`/position/${id}`)
}
// 添加人员
export function addPerson (params) {
  return API.POST(`/person/detail`, params)
}
// 获取单个人员详情
// export function getPersonOneDetail ( params) {
//   return API.GET(`/person/${params.id}/detail`, params)
// }
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

