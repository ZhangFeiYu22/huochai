import request from '@/utils/request'
// 大菜单
export const getHomeClass = () => request.get(`/home/homeClass`)

// 社区列表获取
export const getCommunitys = () => request.get(`/home/communitys`)

// 首页广告获取   1为广告位1  2为广告位2   4为广告轮播
export const getAdvPosition = (data) => request.get(`/home/adv/${data.position}/${data.cid}`)

// 精彩活动分类
export const getActivityClass = () => request.get(`/home/activityClass`)

// 精彩活动分类下面的活动列表
export const getActivityClassList = (data) => request.get(`/home/activitys/${data.id}/${data.cid}`)
// 根据社区id查所有
export const getHomeActivityList = (cid) => request.get(`/home/getActivitysByCid/${cid}`)


// 今日精选分类  代金券
export const getVoucherTypeList = (data) => request.get(`/home/vouchers/${data.id}/${data.cid}`)
// 根据社区id查所有
export const getHomeVoucherList = (cid) => request.get(`/home/getVouchersByCid/${cid}`)