//vue init F-loat/mpvue-quickstart my-project(初始化项目)
import request from './flynew'
// 一
// 获取sessionKey
export const loginSessionKey = (appid,code) => request.get(`/login/${appid}?code=${code}`)
// 登录获取用户信息
export const authData = (appid,data) => request.get(`/auth/${appid}`, data)

// 二     人物
// 获取人物列表
export const humanListData = () => request.get(`/effect/human`)
// 获取广告
export const adListData = () => request.get(`/effect/ad/1`)
// 获取分类级别名称
export const litetypeData = () => request.get(`/litetype/list`)
// 获取 人物详情
export const humanDetails = (pid) => request.get(`/effect/humanDetails/${pid}`)
//    浏览量
export const humanView = (pid) => request.get(`/effect/addnum/${pid}`)
//    是否点赞
export const humanZan = (pid) => request.get(`/userarticle/get/${pid}`)
//    点赞   取消点赞
export const humanZan1 = (pid) => request.get(`/userarticle/add/${pid}`)
export const humanZan0 = (pid) => request.get(`/userarticle/delete/${pid}`)
//    是否收藏
export const collectGet = (pid) => request.get(`/collect/get/${pid}`)
//    收藏   取消收藏
export const collectGet1 = (pid) => request.get(`/collect/add/${pid}`)
export const collectGet0 = (pid) => request.get(`/collect/delete/${pid}`)


// 三    活动






// 传code获取sessionKey
export const getSessionKey = (code) => request.post(`/api/getSessionInfo/${code}`)

// 通过sessionKey获取用户信息以及token
export const fetchUserInfo = (data) => request.get(`/api/info`, data)

// 获取最新的一条语录
export const newAna = () => request.post(`/api/quotation/getLast`)

// 获取发布状态列表
export const publishStatus = () => request.post(`/api/postpic/list`)

// 根据id获取发布状态的详情
export const publishStatusDetail = (sid) => request.post(`/api/postpic/get/${sid}`)

// 相册  根据父级ID获取分类列表
export const classifyPidData = (pid) => request.post(`/api/classify/list/${pid}`)

// 相册  根据父类id获取视频.图片列表
export const albumClassIdData = (classid) => request.post(`/api/album/list/${classid}`)

// 相册  视频id获取  视频的详情
export const albumVideoDetail = (vid) => request.post(`/api/album/get/${vid}`)

// (相册的视频图片浏览量)
//打开任意视频或者图片链接后回调查看,保证页面浏览量  id 为图片id或者视频id
export const albumView = (id) => request.post(`/api/album/view/${id}`)

// 获取活动列表
export const activityList = () => request.post(`/api/activity/list`)


//根据文件id查看是否收藏   
export const collectMediaGet = (id) => request.post(`/api/collectMedia/get/${id}`)

//收藏中   根据文件id查看详情   (与查看是否收藏接口一致)
export const collectVideoDetail = (id) => request.post(`/api/collectMedia/get/${id}`)

//收藏，取消收藏(同一个接口)
export const collectMediaPut = (id) => request.post(`/api/collectMedia/put/${id}`)

//根据类型获取收藏列表
export const collectMediaList = (type) => request.post(`/api/collectMedia/list/${type}`)

// (动态部分的浏览量)
// 收藏  图片  视频的浏览量
export const postpicView = (id) => request.post(`/api/postpic/view/${id}`)

// 报名支付
export const goodsPayBuy = (data) => request.get(`/api/order/buy`, data)


// 参加过的活动   订单
export const orderList = () => request.post(`/api/order/list`)

// 活动订单  详情
export const orderDetail = (orderId) => request.post(`/api/order/detail/${orderId}`)


// export const changeSecretKey = () => request.post('/api/services/app/ClientService/ChangeSecretKey')

// export const getCurrentLoginInfo = () => request.get(enums.getCurrentLoginInfo)

// export const createMileage = (data) => request.post(enums.createMileage, data)


// let data = {ds:1}
// async createMileage() {
//   let res = await createMileage(data)
// }
