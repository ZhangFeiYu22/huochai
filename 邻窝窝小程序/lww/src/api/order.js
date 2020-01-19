
import request from '@/utils/request'
// 活动订单     ---------------------------------
// 所有订单
// export const getOrderActivity = () => request.get(`/orderActivity/no-paging`)
export const getOrderActivity = () => request.get(`/orderActivity/getAllActivitys`)

// 活动分类下面的活动列表
export const getActivityClassList = (classId) => request.get(`/home/activitys/${classId}`)

// 活动详情
export const getActivityDetail = (id) => request.get(`/activity/${id}`)

// 活动轮播  6 
export const getAdvPosition = (position) => request.get(`/home/adv/${position}`)

// 活动 继续支付
export const continueBuyActivity = (oid) => request.post(`/orderActivity/rebuy?orderId=${oid}`)

// 活动  删除
export const delActivityOrder = (orderId) => request.post(`/orderActivity/delActivity/${orderId}`)


// 代金券 精选  订单     -------------------------------
// 代金券订单  查询
export const getVoucherList = () => request.get(`/orderVoucher/getAllVouchers`)

// 代金券 继续支付
export const continueBuyVoucher = (oid) => request.post(`/orderVoucher/rebuy?orderId=${oid}`)


// 代金券  删除
export const delVoucherOrder = (orderId) => request.post(`/orderVoucher/delVoucher/${orderId}`)