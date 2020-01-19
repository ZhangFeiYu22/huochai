import request from '@/utils/request'

// 今日精选分类列表
export const getVoucherTypeList = (data) => request.get(`/home/vouchers/${data.id}/${data.cid}`)

// 轮播图片
export const getAdvPosition = (data) => request.get(`/home/adv/${data.position}/${data.cid}`)

// 代金券详情
export const getChoiceDetail = (id) => request.get(`/voucher/${id}`)

// 代金券里面查询店家详情
export const getMerchantDetail = (id) => request.get(`/merchant/${id}`)
//  查询店家下面的门票优惠  代金券推荐
export const getMerchantVoucher = (merchantId) => request.get(`/voucher/getVouchersByMid/${merchantId}`)

// 代金券  推荐
export const getVoucherRecommend = () => request.get(`/recommend`)

// 代金券购买
export const getCouponBuy = (data) => request.post(`/orderVoucher/buy?voucherId=${data.voucherId}&num=${data.num}&phoneNo=${data.phoneNo}`)

// 代金券购买  成功后  订单详情
export const getCouponOrderDetail = (orderId) => request.get(`/orderVoucher/getByOrderNo/${orderId}`)

