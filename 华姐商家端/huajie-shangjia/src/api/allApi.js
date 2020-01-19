import request from '@/utils/request'

//登录
export function loginBy(data) {
  return request({
    url: `/auth?username=${data.username}&password=${data.password}`,
    method: 'post'
  })
}

// 商品列表
export function searchOrderList(pickupCode) {
  return request({
    url: `/order/list/${pickupCode}`,
    method: 'post'
  })
}

// 立即核销
export function cancelOrder(orderId) {
  return request({
    url: `/order/pick/${orderId}`,
    method: 'post'
  })
}
