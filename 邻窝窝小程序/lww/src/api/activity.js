import request from '@/utils/request'

// 活动分类
// export const getActivityClass = () => request.get(`/activityClass`)
export const getActivityClass = () => request.get(`/home/activityClass`)

// 活动分类下面的活动列表
export const getActivityClassList = (data) => request.get(`/home/activitys/${data.id}/${data.cid}`)

// 活动详情
export const getActivityDetail = (id) => request.get(`/activity/${id}`)

// 活动轮播  6
export const getAdvPosition = (data) => request.get(`/home/adv/${data.position}/${data.cid}`)

// 活动报名
export const activitySignUp = (data) => request.post(`/orderActivity/buy?activityId=${data.activityId}&num=${data.num}&phoneNo=${data.phoneNo}`)

// 活动报名  成功后  订单详情s
export const activityOrderDetail = (orderId) => request.get(`/orderActivity/getByOrderNo/${orderId}`)

// 收藏   添加收藏
export const addCollect = (data) => request.post(`/collect/add/${data.objectId}/${data.type}`)


// 收藏    查看是否收藏
export const isCollect = (data) => request.post(`/collect/get/${data.objectId}/${data.type}`)

// 收藏    删除收藏
export const delCollect = (data) => request.post(`/collect/del/${data.objectId}/${data.type}`)