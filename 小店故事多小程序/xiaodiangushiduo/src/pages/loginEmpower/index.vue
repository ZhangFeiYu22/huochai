<template>
  <div class="container">
    <div class="maskBg">
      <div class="logoModel">
        <p class="p-one">亲爱的用户,您好</p>
        <p class="p-two">初次使用小程序请先登录</p>
        <button class="p-three" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">微信登录</button>
      </div>
    </div>
  </div>
</template>

<script>
// Use Vuex
import globalStore from '@/store/globalStore'
import { loginSessionKey, authData } from '@/utils/api'
export default {
  data () {
    return {
      optionsScene: '',
      optionsPathUrl: '',
    }
  },
  mounted () {
    this.getSessionKey();
    this.optionsPathUrl = wx.getStorageSync('optionsPathUrl');
  },
  onLoad () { },
  methods: {
    getSessionKey () {
      var _this = this;
      wx.login({
        success (res) {
          if (res.code) {
            globalStore.commit('changeCode', res.code)
            _this.loginFun(globalStore.state.globalAppId, globalStore.state.globalCode)
          }
        },
      })

    },
    async loginFun (appid, code) {
      let res = await loginSessionKey(appid, code);
      globalStore.commit('changeSessionKey', res.sessionKey)
    },
    async authFun (appid, data) {
      let respon = await authData(appid, data)
      wx.setStorageSync('token', respon.token)
      if (wx.getStorageSync('shareVal')) {
        console.log('分享进', this.optionsPathUrl)
        wx.redirectTo({
          url: `${wx.getStorageSync('optionsPathUrl')}?id=${wx.getStorageSync('optionsId')}`
        })
      } else {
        console.log('点击允许---sence---默认进入', this.optionsPathUrl)
        wx.switchTab({
          url: `${wx.getStorageSync('optionsPathUrl')}`
        })
      }
    },
    bindGetUserInfo (e) {
      var loRes = e.mp.detail;
      let _this = this;
      if (e.mp.detail.userInfo) {
        // 用户按了允许授权按钮
        // _this.authFun()
        let data = {
          encryptedData: loRes.encryptedData,
          sessionKey: globalStore.state.globalSessionKey,
          signature: loRes.signature,
          iv: loRes.iv,
          rawData: loRes.rawData
        }

        _this.authFun(globalStore.state.globalAppId, data)


      } else {
        // 用户按了拒绝按钮
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
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
.container {
  .maskBg {
    position: fixed;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center; /*垂直居中*/
    justify-content: center; /*水平居中*/
    background-color: rgba(0, 0, 0, 0.5);
    .logoModel {
      width: 60%;
      background-color: #fff;
      padding: 5%;
      border-radius: 10px;
      text-align: center;
      .p-one,
      .p-two {
        font-size: 32rpx;
        line-height: 30px;
      }
      .p-three {
        margin-top: 20px;
        background-color: #069979;
        padding: 3% 10%;
        border-radius: 5px;
        color: #fff;
        font-size: 28rpx;
      }
    }
  }
}
</style>
