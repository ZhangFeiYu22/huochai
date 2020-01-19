import request from '@/utils/request'

// 搜索活动
export const getSearchActivity = (data) => request.get(`/home/activitybyn/${data.name}/${data.cid}`)
// 搜索精选(代金券)
export const getSearchVoucher = (data) => request.get(`/home/vouchersbyn/${data.name}/${data.cid}`)

//  推荐
export const getRecommend = () => request.get(`/recommend`)

// 活动详情
export const getActivityDetail = (id) => request.get(`/activity/${id}`)

// 代金券详情
export const getChoiceDetail = (id) => request.get(`/voucher/${id}`)