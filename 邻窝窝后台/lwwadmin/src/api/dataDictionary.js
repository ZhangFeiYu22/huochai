import * as API from './index'

export function getDictionaryList (pageNow, pageSize) {
  const url = '/dictionary'
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

export function getDictionaryItem (queryParamsIndex) {
  const url = '/dictionary-item/no-paging'
  const data0 = Object.assign({}, {
    pageIndex: 0,
    pageSize: 10,
    sortField: '',
    sortOrder: ''
  })
  const data = Object.assign({}, queryParamsIndex)
  return API.GET(url, {
    params: Object.assign(data0, data)
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 一级菜单保存
export function addDictionary (params) {
  return API.PATCH('/dictionary', params)
}
// 二级菜单保存
export function addDictionaryItem (params) {
  return API.PATCH('/dictionary-item', params)
}
// 详情
export function getDictionaryDetail (id) {
  return API.GET(`/dictionary/${id}`)
}

export function searchDictionary (queryParams, queryParamsIndex) {
  const url = '/dictionary'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

// 一级删除
export function delDictionary (id) {
  return API.DELETE(`/dictionary/${id}`)
}
// 二级删除
export function delDictionary2 (id) {
  return API.DELETE(`/dictionary-item/${id}`)
}

export function editPermiss (id, params) {
  return API.PUT(`/permission/${id}`, params)
}
