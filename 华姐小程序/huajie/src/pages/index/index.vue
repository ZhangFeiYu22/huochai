<template>
  <div class="home">
    <!-- <headView :title="title" :bgcolor="bgcolor"></headView> -->
    <div class="boxBg">
      <img src="../../../static/images/home_bg.png" alt />
      <div class="bg"></div>
    </div>
    <div class="content">
      <div class="welcome">
        <p>欢迎来到</p>
        <p>华姐的美丽世界</p>
      </div>
      <div class="userInfo">
        <div class="imgBox">
          <img src="../../../static/images/head.png" />
        </div>
        <p class="name">MISS HUA</p>
      </div>
      <div class="btnBox">
        <button class="btnL" @click="goSummary">了解一下</button>
        <button class="btnR" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">授权登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import headView from '@/components/headerView'
import { getSessionKey, fetchUserInfo } from '@/utils/api'
export default {
  data () {
    return {
      title: '首页',
      bgcolor: '#fff'
    }
  },
  components: {
    headView
  },
  methods: {
    bindGetUserInfo (e) {
      if (e.mp.detail.rawData) {
        //用户按了允许授权按钮
        console.log('用户按了允许授权按钮')
        this.loginFun();
      } else {
        //用户按了拒绝按钮
        console.log('用户按了拒绝按钮')
      }
    },
    goSummary () {
      wx.navigateTo({
        url: '/pages/summary/main'
      })
    },
    async createSessionKey (code, data) {
      let res = await getSessionKey(code)
      this.fetchInfo(data, res.session.sessionKey)
    },
    async fetchInfo (data, sess) {
      let needInfoData = {
        sessionKey: sess,
        signature: data.signature,
        rawData: data.rawData,
        encryptedData: data.encryptedData,
        iv: data.iv
      }
      let res = await fetchUserInfo(needInfoData)
      if (res.code == 0) {
        this.$store.commit('changeToken', res.member.token)  //vuex存储 token
        wx.setStorageSync('authToken', res.member.token)
        if (wx.getStorageSync('shareUrlValue')) {
          console.log('分享进--', wx.getStorageSync('optionsPathUrlS'))
          wx.navigateTo({
            url: wx.getStorageSync('optionsPathUrlS')
          })
        } else {
          wx.redirectTo({
            url: '/pages/home/main'
          })
        }

      }
    },
    loginFun () {
      var _this = this;
      wx.login({
        success (loginRes) {
          if (loginRes.code) {
            // 这里可以把code传给后台，后台用此获取openid及session_key
            wx.getUserInfo({
              success: function (getuserRes) {
                _this.createSessionKey(loginRes.code, getuserRes)
              }
            })

          }
        },
      })
    }

  }
}
</script>

<style scoped lang="less">
.home {
  .boxBg {
    position: fixed;
    height: 100%;
    width: 100%;
    display: flex;
    z-index: 1;
    flex-direction: column;
    align-items: center; /*垂直居中*/
    justify-content: center; /*水平居中*/
    img {
      width: 100%;
      height: 100%;
    }
    .bg {
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        rgba(0, 11, 16, 0),
        rgba(0, 11, 16, 0.3),
        rgba(0, 11, 16, 0.7),
        rgba(0, 11, 16, 1)
      );
    }
  }
  .content {
    position: absolute;
    z-index: 2;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    .welcome {
      position: absolute;
      top: 45%;
      left: 4%;
      p {
        font-size: 40px;
        height: 60px;
        line-height: 60px;
        color: #fff;
      }
    }
    .userInfo {
      position: absolute;
      bottom: 120px;
      left: 6%;
      display: flex;
      flex-direction: row;
      .imgBox {
        width: 64px;
        height: 64px;
        border-radius: 100%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .name {
        height: 64px;
        line-height: 64px;
        margin-left: 20px;
        font-size: 24px;
        color: #fff;
      }
    }
    .btnBox {
      position: absolute;
      bottom: 20px;
      display: flex;
      width: 96%;
      padding: 0 2%;
      flex-direction: row;
      button {
        background-color: transparent;
        height: 55px;
        line-height: 55px;
        width: 45%;
        font-size: 16px;
        ::after {
          border: 0;
        }
        &.btnL {
          background-color: #fff;
        }
        &.btnR {
          background-color: #6997a0;
        }
      }
    }
  }
}
</style>
