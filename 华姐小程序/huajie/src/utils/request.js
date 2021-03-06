var Fly = require("flyio/dist/npm/wx.js") //wx.js为flyio的微信小程序入口文件
const request = new Fly()

const baseUrl = "https://huajie.xdstory.com";

request.config.baseURL = baseUrl
request.config.timeout = 5000

request.interceptors.request.use((request) => {

  const csrfToken = wx.getStorageSync('authToken')
  if (csrfToken) {
    const csrfTokenFormat = csrfToken
    request.headers['Authorization'] = `Bearer ${csrfTokenFormat}`
  }

  wx.showLoading({
    title: '加载中...'
  })
  return request
})

request.interceptors.response.use(
  (response, promise) => {
    if (response.data.code == 700) {
      wx.redirectTo({
        url: '/pages/index/main'
      })
    }
    wx.hideLoading()
    return promise.resolve(response.data)
  },
  (err, promise) => {
    wx.hideLoading()
    if (err) {
      switch (err.status) {
        case 401:
          wx.clearStorageSync()
          break;
        case 404:
          wx.clearStorageSync();
          break;
        default:
          wx.clearStorageSync();
          wx.showToast({
            title: '连接错误'
          })
      }
    } else {
      wx.showToast({
        title: '请检查您的网络',
        icon: 'none',
        duration: 2000
      })
    }
    return promise.resolve()
  }
)

export default request
