import request from '@/utils/request'

// 服务分类
export const getServiceClass = () => request.get(`/serviceClass/no-paging`)

export const getLifeService = (classid) => request.get(`/lifeService/getByClassId/${classid}`)
