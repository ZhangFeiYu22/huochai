<template>
  <div class="login">
    <div class="userInfo">
      <div class="welcome">欢迎使用</div>
    </div>
    <div class="info">请依次允许获得您的公开信息和手机号</div>
    <div class="btnBox">
      <button
        class="btn"
        open-type="getUserInfo"
        @getuserinfo="bindGetUserInfo"
        v-if="!isLoginVal"
      >微信登录</button>
      <button v-else class="btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机号授权</button>
    </div>
  </div>
</template>

<script>
import globalStore from '@/utils/store'
import { getSessionInfo, getUserInfo, getPhoneInfo } from '@/api/login'
export default {
  data () {
    return {
      userLoRes: {},
      phoneLoRes: {},
      isLoginVal: false
    }
  },
  mounted () {
    this.getSessionKey();
  },
  methods: {
    getSessionKey () {
      // 获取code  用来获取sessionKey
      wx.login({
        success (res) {
          if (res.code) {
            console.log('获取到code--', res)
            //获取sessionInfo
            getSessionInfo(res.code).then(res => {
              globalStore.commit('changeSessionKey', res.result.sessionKey)
              globalStore.commit('changeOpenId', res.result.openid)
            })
          }
        },
      })

    },
    // 获取用户信息
    bindGetUserInfo (e) {
      var loRes = e.mp.detail;
      this.userLoRes = e.mp.detail;
      let _this = this;
      if (e.mp.detail.userInfo) {
        // 用户按了允许授权按钮
        let data = {
          sessionKey: globalStore.state.globalSessionKey,
          signature: loRes.signature,
          rawData: loRes.rawData,
          encryptedData: loRes.encryptedData,
          iv: loRes.iv
        }
        // 获取token
        getUserInfo(data).then(res => {
          if (res.status == 200) {
            // 存储token   和  用户信息
            wx.setStorageSync('authToken', res.result)
            wx.setStorageSync('userInfoAll', loRes)
            wx.showToast({
              title: '请继续点击授权手机号',//提示文字
              icon: 'none', //图标，支持"success"、"loading"  
              success: function () {
                _this.isLoginVal = true
                wx.setStorageSync('isLogin', true)
              },//接口调用成功
              fail: function () { },  //接口调用失败的回调函数  
              complete: function () { } //接口调用结束的回调函数  
            })
          }
        })
      } else {
        // 用户按了拒绝按钮
        wx.showModal({
          title: '提示',
          content: '您点击了拒绝授权，部分功能将无法使用,请授权登录享受更多权益!',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击了“返回授权”')
            }
          }
        })
      }
    },
    // 获取手机号
    getPhoneNumber (e) {
      var loRes = e.mp.detail;
      var phoneLoRes = e.mp.detail;
      let _this = this;
      if (e.mp.detail.errMsg == 'getPhoneNumber:ok') {
        // 用户按了允许授权按钮
        let data = {
          sessionKey: globalStore.state.globalSessionKey,
          signature: _this.userLoRes.signature,
          rawData: _this.userLoRes.rawData,
          encryptedData: loRes.encryptedData,
          iv: loRes.iv,
          openId: globalStore.state.globalOpenId
        }
        // 获取token
        getPhoneInfo(data).then(res => {
          if (res.status == 200) {
            wx.showToast({
              title: '授权成功,正在跳转',//提示文字
              duration: 2000,//显示时长
              mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false  
              icon: 'success', //图标，支持"success"、"loading"  
              success: function () {
                wx.setStorageSync('userPhone', res.result)
                //返回上一页并刷新数据
                var pages = getCurrentPages();
                var beforePage = pages[pages.length - 2];
                beforePage.onLoad();
                wx.navigateBack({
                  delta: 1,
                })                
              },//接口调用成功
              fail: function () { },  //接口调用失败的回调函数  
              complete: function () { } //接口调用结束的回调函数  
            })
          }
        })
      } else {
        // 用户按了拒绝按钮
        wx.showModal({
          title: '提示',
          content: '您点击了拒绝授权，部分功能将无法使用,请授权登录享受更多权益!',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击了“返回授权”')
            }
          }
        })
      }
    }
  }
}
</script>


<style lang="less" scoped>
.login {
  padding-top: 50px;
  .userInfo {
    padding: 10px;
    width: 92px;
    margin: 0 auto;
    text-align: center;
    .welcome {
      font-size: 14px;
      line-height: 20px;
    }
  }
  .info {
    margin-top: 20px;
    text-align: center;
    font-size: 16px;
    color: #999;
  }
  .btnBox {
    width: 70%;
    margin: 80px auto;
    .btn {
      border: none;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      background: #2aa144;
      color: #fff;
      border-radius: 5px;
      text-align: center;
    }
  }
}
</style>
