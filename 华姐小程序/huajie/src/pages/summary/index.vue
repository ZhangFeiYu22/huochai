<template>
  <div class="home">
    <!-- <headView :headData="headData"></headView> -->
    <div class="boxBg">
      <img src="../../../static/images/summary.png" mode="aspectFill">
    </div>
    <div class="content">
      <div class="imgbox">
        <img src="../../../static/images/head.png" mode="aspectFill">
      </div>
      <div class="name">
        <p>MISS HUA</p>
        <p>华&nbsp;&nbsp;姐</p>
      </div>
      <div class="motto">健康美丽的人生源自于自我的修养</div>
      <div class="kindList">
        <ul>
          <li>
            <i class="iconfont icon-icon-test"></i>
            <span>时尚达人 自我典范</span>
          </li>
          <li>
            <i class="iconfont icon-shoutibao"></i>
            <span>街店女王 个性飞扬</span>
          </li>
          <li>
            <i class="iconfont icon--yinliao"></i>
            <span>生活领袖 健康无敌</span>
          </li>
        </ul>
        <button
          class="follower"
          open-type="getUserInfo"
          @getuserinfo="bindGetUserInfo"
        ><span>+</span>成为粉丝</button>
      </div>
      <div class="dataBox">
        <div class="data_box">
          <p class="chart">粉丝</p>
          <p class="num">1024</p>
        </div>
        <div class="data_box">
          <p class="chart">视频</p>
          <p class="num">50</p>
        </div>
        <div class="data_box">
          <p class="chart">相册</p>
          <p class="num">260</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import globalStore from '@/store/globalStore'
import headView from '@/components/headerView'
import { getSessionKey, fetchUserInfo } from '@/utils/api'
export default {
  data () {
    return {
      headData: {
        title: '',
        bgcolor: '#fff',
        showBlack: true
      },
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
                globalStore.commit('changeUserInfo', getuserRes.userInfo)  //存储用户信息
                _this.createSessionKey(loginRes.code, getuserRes)
              }
            })

          }
        },
      })
    }
  },
  created () {

  }
}
</script>

<style scoped lang="less">
.home {
  display: flex;
  justify-content: center;
  .boxBg {
    position: fixed;
    height: 100%;
    width: 100%;
    display: flex;
    z-index: 1;
    flex-direction: column;
    align-items: center; /*垂直居中*/
    justify-content: center; /*水平居中*/
    background-color: #d6d6d6;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .content {
    position: absolute;
    z-index: 5;
    width: 84%;
    bottom: 5%;
    border-radius: 2px;
    background-color: #fff;
    padding: 6px 4% 3%;
    display: flex;
    flex-direction: column;
    .imgbox {
      width: 92px;
      height: 92px;
      border-radius: 100%;
      overflow: hidden;
      position: absolute;
      top: -40px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .name {
      margin-left: 110px;
      font-weight: 600;
      p {
        height: 23px;
        line-height: 23px;
      }
    }
    .motto {
      font-size: 12px;
      color: #636363;
      height: 50px;
      line-height: 50px;
      letter-spacing: 2px;
    }
    .kindList {
      position: relative;
      ul {
        li {
          height: 40px;
          line-height: 40px;
          color: #232323;
          i {
            display: inline-block;
            font-size: 22px;
            vertical-align: middle;
            margin-right: 8px;
          }
          span {
            font-size: 14px;
            vertical-align: middle;
          }
        }
      }
      .follower {
        position: absolute;
        background-color: #6997a0;
        width: 105px;
        padding: 0;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        font-size: 16px;
        border-radius: 5px;
        top: 50%;
        margin-top: -25px;
        right: 10px;
        span {
          margin-right: 3px;
          font-size: 20px;
        }
      }
    }
    .dataBox {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 70%;
      margin: 10px auto 0;
      .data_box {
        text-align: center;
        .chart {
          font-size: 12px;
        }
        .num {
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
