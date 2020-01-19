import request from '@/utils/request'

// 收藏   获取    type  1为代金券   2为活动
export const getCollectList = (type) => request.get(`/collect/get/${type}`)

// 收藏    删除收藏
export const delCollect = (data) => request.post(`/collect/del/${data.objectId}/${data.type}`)