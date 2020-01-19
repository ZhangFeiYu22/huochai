import request from '@/utils/request'
// 一
// 获取sessionKey
export const getSessionInfo = (code) => request.get(`/app-user/getSessionInfo/${code}`)
// 获取用户信息
export const getUserInfo = (data) => request.get(`/app-user/info`, data)
// 获取手机号
export const getPhoneInfo = (data) => request.get(`/app-user/phone`, data)
// 登录
export const login = (appid, data) => request.get(`/app-user/login/${appid}`, data)

//  推荐  (猜你喜欢)
export const getRecommend = () => request.get(`/recommend`)
// 推荐的代金券详情
export const getVoucherDetail = (id) => request.get(`/voucher/${id}`)

// 首页广告获取   1为广告位1  2为广告位2   4为广告轮播   3为广告位3
export const getAdvPosition = (data) => request.get(`/home/adv/${data.position}/${data.cid}`)
