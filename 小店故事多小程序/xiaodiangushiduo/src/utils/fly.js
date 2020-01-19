import globalStore from '@/store/globalStore'
//定义请求地址
const host = 'https://mini.dscs123.cn/';

function request(url, method, data, header = {}) {
    // wx.showLoading({
    //     title: '加载中' 
    // })
    const token = wx.getStorageSync('token')
    return new Promise((resolve, reject) => {
        wx.request({
            url: host + url,
            method: method,
            data: data,
            header: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                // wx.hideLoading();
                resolve(res.data)
            },
            fail: function(error) {
                // wx.hideLoading();
                reject(false)
            },
            complete: function() {
                // wx.hideLoading();
            }
        })
    })
}

function get(obj) {
    return request(obj.url, 'GET', obj.data)
}

function post(obj) {
    return request(obj.url, 'POST', obj.data)
}

export default {
    request,
    get,
    post
}