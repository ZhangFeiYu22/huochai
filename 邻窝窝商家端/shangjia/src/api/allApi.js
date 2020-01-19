import request from '@/utils/request'

//登录
export function loginBy (data) {
  return request({
    url: `/merchant/login`,
    method: 'post',
    params: data
  })
}


// 店家列表查询   
export function hotelsList (data) {
  return request({
    url: `/merchant`,
    method: 'get',
    params: data
  })
}

// 活动票根列表   
export function activityOrderList (data) {
  return request({
    url: `/orderActivity`,
    method: 'get',
    params: data
  })
}

// 精选订单列表   
export function choiceOrderList (data) {
  return request({
    url: `/orderVoucher/getMerchantVouchers`,
    method: 'get',
    params: data
  })
}

// 代金券订单列表
export function searchOrderList (code) {
  return request({
    url: `/orderVoucher/getVoucherOrderByCode/${code}`,
    method: 'get'
  })
}

// 立即核销
export function cancelOrder (id,code) {
  return request({
    url: `/orderVoucher/checkOrder/${id}/${code}`,
    method: 'post'
  })
}


// 设置修改密码
export function changePwd (data) {
  return request({
    url: `/merchant/changePwd`,
    method: 'get',
    params: data
  })
}
