import * as API from './index'
// 广告管理    ------------------  Begin
// 列表
export function getAdvertList (pageNow, pageSize) {
  const url = '/advert'
  const data = Object.assign({}, {
    pageIndex: pageNow,
    pageSize: pageSize
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 详情
export function getAdvertItem (id) {
  return API.GET(`/advert/${id}`)
}
// 增加
export function addAdvert (params) {
  return API.PATCH('/advert', params)
}
// 删除
export function delAdvert (id) {
  return API.DELETE(`/advert/${id}`)
}
// 搜索
export function searchAdvert (queryParams, queryParamsIndex) {
  const url = '/advert'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 广告管理    ------------------  End

// 首页分类管理    ------------------  Begin
// 列表
export function getHomeTypeList (pageNow, pageSize) {
  const url = '/homeClass'
  const data = Object.assign({}, {
    pageIndex: pageNow,
    pageSize: pageSize
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 详情
export function getHomeTypeItem (id) {
  const url = `/homeClass/${id}`
  return API.GET(url, {}).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 增加
export function addHomeType (params) {
  return API.PATCH('/homeClass', params)
}
// 删除
export function delHomeType (id) {
  return API.DELETE(`/homeClass/${id}`)
}
// 搜索
export function searchHomeType (queryParams, queryParamsIndex) {
  const url = '/homeClass'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 首页分类管理    ------------------  End

// 活动分类    ---------------   Begin
// 活动分类列表不分页
export function getActivityTypeListNoPaging () {
  const url = '/activityClass/no-paging'
  return API.GET(url).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 列表
export function getActivityTypeList (pageNow, pageSize) {
  const url = '/activityClass'
  const data = Object.assign({}, {
    pageIndex: pageNow,
    pageSize: pageSize
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 详情
export function getActivityTypeItem (id) {
  return API.GET(`/activityClass/${id}`)
}
// 增加
export function addActivityType (params) {
  return API.PATCH('/activityClass', params)
}
// 删除
export function delActivityType (id) {
  return API.DELETE(`/activityClass/${id}`)
}
// 搜索
export function searchActivityType (queryParams, queryParamsIndex) {
  const url = '/activityClass'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

// 活动分类    ---------------   End

// 活动    ---------------   Begin
// 列表
// 分页
export function getActivityList (pageNow, pageSize) {
  const url = '/activity'
  const data = Object.assign({}, {
    pageIndex: pageNow,
    pageSize: pageSize
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 不分页
export function getActivityListNoPaging () {
  const url = '/activity/no-paging'
  return API.GET(url, {}).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 详情
export function getActivityItem (id) {
  const url = `/activity/${id}`
  return API.GET(url, {}).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 增加
export function addActivity (params) {
  return API.PATCH('/activity', params)
}
// 删除
export function delActivity (id) {
  return API.DELETE(`/activity/${id}`)
}
// 搜索
export function searchActivity (queryParams, queryParamsIndex) {
  const url = '/activity'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

// 活动    ---------------   End

// 社区    ---------------   Begin
// 列表   分页
export function getCommunityList (pageNow, pageSize) {
  const url = '/community'
  const data = Object.assign({}, {
    pageIndex: pageNow,
    pageSize: pageSize
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
//  不分页
export function getCommunityListNopage () {
  const url = '/community/no-paging'
  return API.GET(url).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 详情
export function getCommunityItem (id) {
  return API.GET(`/community/${id}`)
}
// 增加
export function addCommunity (params) {
  return API.PATCH('/community', params)
}
// 删除
export function delCommunity (id) {
  return API.DELETE(`/community/${id}`)
}
// 搜索
export function searchCommunity (queryParams, queryParamsIndex) {
  const url = '/community'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

// 社区    ---------------   End

// 店家    ---------------   Begin
// 列表
//  没有分页获取
export function getMerchantListNoPaging () {
  const url = '/merchant/no-paging'
  return API.GET(url).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
//  分页获取
export function getMerchantList (pageNow, pageSize) {
  const url = '/merchant'
  const data = Object.assign({}, {
    pageIndex: pageNow,
    pageSize: pageSize
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 详情
export function getMerchantItem (id) {
  return API.GET(`/merchant/${id}`)
}
// 增加
export function addMerchant (params) {
  return API.PATCH('/merchant', params)
}
// 删除
export function delMerchant (id) {
  return API.DELETE(`/merchant/${id}`)
}
// 搜索
export function searchMerchant (queryParams, queryParamsIndex) {
  const url = '/merchant'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

// 店家    ---------------   End
// 代金券    ---------------   Begin
// 列表
//分页
export function getCouponList (pageNow, pageSize) {
  const url = '/voucher'
  const data = Object.assign({}, {
    pageIndex: pageNow,
    pageSize: pageSize
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 不分页
export function getCouponListNoPaging () {
  const url = '/voucher/no-paging'
  return API.GET(url, {}).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 详情
export function getCouponItem (id) {
  return API.GET(`/voucher/${id}`)
}
// 增加
export function addCoupon (params) {
  return API.PATCH('/voucher', params)
}
// 删除
export function delCoupon (id) {
  return API.DELETE(`/voucher/${id}`)
}
// 搜索
export function searchCoupon (queryParams, queryParamsIndex) {
  const url = '/voucher'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

// 代金券    ---------------   End  
// 服务分类    ---------------   Begin
// 列表
export function getServiceClassList (pageNow, pageSize) {
  const url = '/serviceClass'
  const data = Object.assign({}, {
    pageIndex: pageNow,
    pageSize: pageSize
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
export function getServiceClassList2 () {
  const url = '/serviceClass/no-paging'
  return API.GET(url).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 列表   (不分页)
export function getServiceClassList_nopaging (queryParamsIndex) {
  const url = '/serviceClass/no-paging'
  const data0 = Object.assign({}, {
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
// 详情
export function getServiceClassItem (id) {
  return API.GET(`/serviceClass/${id}`)
}
// 增加
export function addServiceClass (params) {
  return API.PATCH('/serviceClass', params)
}
// 删除
export function delServiceClass (id) {
  return API.DELETE(`/serviceClass/${id}`)
}
// 搜索
export function searchServiceClass (queryParams, queryParamsIndex) {
  const url = '/serviceClass'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

// 服务分类    ---------------   End  
// 生活服务    ---------------   Begin
// 列表
export function getLifeServiceList (pageNow, pageSize) {
  const url = '/lifeService'
  const data = Object.assign({}, {
    pageIndex: pageNow,
    pageSize: pageSize
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 详情
export function getLifeServiceItem (id) {
  return API.GET(`/lifeService/${id}`)
}
// 增加  修改
export function addLifeService (params) {
  return API.PATCH('/lifeService', params)
}
// 删除
export function delLifeService (id) {
  return API.DELETE(`/lifeService/${id}`)
}
// 搜索
export function searchLifeService (queryParams, queryParamsIndex) {
  const url = '/lifeService'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

// 生活服务    ---------------   End  
// 活动代金券推荐    ---------------   Begin 
// 列表
export function getRecommendList (pageNow, pageSize) {
  const url = '/recommend'
  const data = Object.assign({}, {
    pageIndex: pageNow,
    pageSize: pageSize
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 详情
export function getRecommendItem (id) {
  return API.GET(`/recommend/${id}`)
}
// 增加
export function addRecommend (params) {
  return API.PATCH('/recommend', params)
}
// 删除
export function delRecommend (id) {
  return API.DELETE(`/recommend/${id}`)
}
// 搜索
export function searchRecommend (queryParams, queryParamsIndex) {
  const url = '/recommend'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

// 活动代金券推荐    ---------------   End  
// 会员管理    ---------------   Begin 
// 列表
export function getMemberList (pageNow, pageSize) {
  const url = '/member'
  const data = Object.assign({}, {
    pageIndex: pageNow,
    pageSize: pageSize
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 详情
export function getMemberItem (id) {
  return API.GET(`/member/${id}`)
}
// 增加
export function addMember (params) {
  return API.PATCH('/member', params)
}
// 删除
export function delMember (id) {
  return API.DELETE(`/member/${id}`)
}
// 搜索
export function searchMember (queryParams, queryParamsIndex) {
  const url = '/member'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

// 会员管理    ---------------   End  
// 会员收藏管理    ---------------   Begin 
// 列表
export function getCollectList (pageNow, pageSize) {
  const url = '/collect'
  const data = Object.assign({}, {
    pageIndex: pageNow,
    pageSize: pageSize
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 详情
export function getCollectItem (id) {
  return API.GET(`/collect/${id}`)
}
// 增加
export function addCollect (params) {
  return API.PATCH('/collect', params)
}
// 删除
export function delCollect (id) {
  return API.DELETE(`/collect/${id}`)
}
// 搜索
export function searchCollect (queryParams, queryParamsIndex) {
  const url = '/collect'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

// 会员收藏管理    ---------------   End 

// 活动订单    ---------------   Begin 
// 列表
export function getOrderActivityList (pageNow, pageSize) {
  const url = '/orderActivity'
  const data = Object.assign({}, {
    pageIndex: pageNow,
    pageSize: pageSize
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 详情
export function getOrderActivityItem (id) {
  return API.GET(`/orderActivity/${id}`)
}
// 增加
export function addOrderActivity (params) {
  return API.PATCH('/orderActivity', params)
}
// 删除
export function delOrderActivity (id) {
  return API.DELETE(`/orderActivity/${id}`)
}
// 搜索
export function searchOrderActivity (queryParams, queryParamsIndex) {
  const url = '/orderActivity'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 立即核销
export function cancelOrder (id,code) {
  return API.POST(`/orderActivity/checkOrder/${id}/${code}`)
}

// 活动订单    ---------------   End 
// 代金券订单    ---------------   Begin 
// 列表
export function getOrderCouponList (pageNow, pageSize) {
  const url = '/orderVoucher'
  const data = Object.assign({}, {
    pageIndex: pageNow,
    pageSize: pageSize
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 详情
export function getOrderCouponItem (id) {
  return API.GET(`/orderVoucher/${id}`)
}
// 增加
export function addOrderCoupon (params) {
  return API.PATCH('/orderVoucher', params)
}
// 删除
export function delOrderCoupon (id) {
  return API.DELETE(`/orderVoucher/${id}`)
}
// 搜索
export function searchOrderCoupon (queryParams, queryParamsIndex) {
  const url = '/orderVoucher'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

// 代金券订单    ---------------   End 
// 服务拨打电话记录    ---------------   Begin 
// 列表
export function getServerPhoneList (pageNow, pageSize) {
  const url = '/dialServiceLog'
  const data = Object.assign({}, {
    pageIndex: pageNow,
    pageSize: pageSize
  })
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}
// 详情
export function getServerPhoneItem (id) {
  return API.GET(`/dialServiceLog/${id}`)
}
// 增加
export function addServerPhone (params) {
  return API.PATCH('/dialServiceLog', params)
}
// 删除
export function delServerPhone (id) {
  return API.DELETE(`/dialServiceLog/${id}`)
}
// 搜索
export function searchServerPhone (queryParams, queryParamsIndex) {
  const url = '/dialServiceLog'
  const data = Object.assign({}, queryParams, queryParamsIndex)
  return API.GET(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

// 服务拨打电话记录    ---------------   End 


// 数据统计    ---------------   begin
export function getCountDataList () {
  const url = '/member/getMemberStatistics'
  return API.GET(url, {}).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

// 数据统计里面的代金券列表
export function vouSearchList (id) {
  const url = `/orderVoucher/getOrderVouchers/${id}`
  return API.GET(url, {}).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}

// 数据统计里面的活动列表
export function actSearchList (id) {
  const url = `/orderActivity/getOrderActivitys/${id}`
  return API.GET(url, {}).then((res) => {
    return Promise.resolve(JSON.parse(res))
  })
}


// 数据统计    ---------------   end