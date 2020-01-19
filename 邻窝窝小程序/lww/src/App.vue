<script>
import globalStore from '@/utils/store'
import { getSessionInfo, getUserInfo, getPhoneInfo  } from '@/api/login'
export default {
  data () {
    return {
      globalData: {
        navHeight: '',
        navTop: '',
        windowHeight: ''
      }
    }
  },
  created () {
    this.getSysInfo();
    this.getLogin();
  },
  methods: {
    getSysInfo () {
      const res = wx.getSystemInfoSync()
      let menuButtonObject = wx.getMenuButtonBoundingClientRect();
      let statusBarHeight = res.statusBarHeight;
      let navTop = menuButtonObject.top;
      let navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;
      wx.setStorageSync('navHeight', navHeight)   //整个导航栏的高度
      wx.setStorageSync('navTop', navTop)   //胶囊按钮与顶部的高度
      wx.setStorageSync('windowHeight', res.windowHeight)   //胶囊按钮与右侧的距离
    },
    getLogin () {
      var _this = this
      // 获取用户的当前设置。本项目里判断用户是否已授权登录
      wx.getSetting({
        success (res) {
          if (res.authSetting['scope.userInfo']) {
            console.log('授权登录')
            wx.login({
              success (logRes) {
                if (logRes.code) {
                  // 通过code获取sessionKey 和 openid
                  getSessionInfo(logRes.code).then(sessionRes => {
                    if (sessionRes.status == 200) {
                      globalStore.commit('changeSessionKey', sessionRes.result.sessionKey)
                      globalStore.commit('changeOpenId', sessionRes.result.openid)
                      wx.getUserInfo({
                        success: function (userRes) {
                          // 如果用户已经授权则会调用该方法
                          wx.setStorageSync('userInfoAll', userRes)
                          let rawData = JSON.parse(userRes.rawData)
                          _this.nickName = rawData.nickName
                          _this.avatarUrl = rawData.avatarUrl
                          _this.getAuthToken(sessionRes.result.sessionKey, userRes)
                        }
                      })
                    }
                  })

                }
              },
            })
          } else {
            console.log('用户没有授权')
            _this.userLoginVal = false;
          }
        }
      })
    },
    // 获取token
    async getAuthToken (sessionKey, userRes) {
      let data = {
        sessionKey: sessionKey,
        signature: userRes.signature,
        rawData: userRes.rawData,
        encryptedData: userRes.encryptedData,
        iv: userRes.iv
      }
      let authToken = await getUserInfo(data);
      wx.setStorageSync('authToken', authToken.result)
      wx.setStorageSync('isLogin', true)
      this.userLoginVal = true
      console.log('authToken---333--', authToken)

    },
  }
}
</script>

<style lang="less">
@import "../static/iconLink/iconfont.css";
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
i {
  display: inline-block !important;
  vertical-align: middle;
}
p,
view,
div {
  box-sizing: border-box !important;
}
.w94 {
  width: 94%;
  margin: 0 auto;
}
.w95 {
  width: 95%;
  margin: 0 auto;
}
.mt10 {
  margin-top: 10px !important;
}
.mt20 {
  margin-top: 20px !important;
}
.mt30 {
  margin-top: 30px !important;
}
.bgtran {
  background: transparent;
}

/*一行出现省略号 */

.ellipsis-1 {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/*两行出现省略号 */

.ellipsis-2 {
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  height: auto;
}

/*三行出现省略号 */

.ellipsis-3 {
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  height: auto;
}
/*css为clearfix，清除浮动*/
.clearfix::before,
.clearfix::after {
  content: "";
  height: 0;
  line-height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}
.clearfix:after {
  clear: both;
}

/* 代金券样式   公用 */
.voucherCSS {
  height: 120px;
  background-color: #f6f6f6;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  flex-grow: 1;
  // justify-content: space-between;
  margin-bottom: 10px;
  .choiceImg {
    min-width: 100px;
    max-width: 100px;
    height: 100px;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }
  }
  .choiceContent {
    width: 100%;
    position: relative;
    .grabNow {
      position: absolute;
      right: 0;
      bottom: 40px;
      width: 60px;
      height: 28px;
      line-height: 28px;
      padding: 0;
      font-size: 14px;
      background: linear-gradient(left, #ff6600, #ff3106);
      background: -webkit-linear-gradient(left, #ff6600, #ff3106);
      color: #fff;
      &::after {
        border: none;
      }
    }
    .c1,
    .c3 {
      display: flex;
      justify-content: space-between;
    }
    .c1 {
      height: 20px;
      line-height: 20px;
      .title {
        max-width: 190px;
        font-weight: 600;
        font-size: 15px;
      }
      .distance {
        color: #777;
        font-size: 14px;
      }
    }
    .c2 {
      font-size: 14px;
      max-width: 180px;
      color: #666;
      height: 20px;
      line-height: 20px;
      margin: 10px 0 20px 0;
    }
    .c3 {
      height: 30px;
      line-height: 30px;
      p {
        .now {
          color: #ff3b30;
          font-size: 14px;
          font-weight: 600;
          margin-right: 5px;
        }
        .old {
          color: #999;
          text-decoration: line-through;
          font-size: 13px;
        }
      }
      .sold {
        font-size: 14px;
        color: #666;
        span {
          margin-left: 5px;
          font-size: 13px;
        }
      }
    }
  }
}
// 活动样式   公用
.activityCSS {
  .bigBox {
    border-bottom: 5px solid #f1f1f1;
    padding: 15px 2.5%;
    overflow: hidden;
    .modulActivity {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .leftImg {
        width: 150px;
        min-width: 150px;
        height: 90px;
        margin-right: 10px;
        border-radius: 5px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .rightCon {
        text-align: justify;
        box-sizing: border-box;
        flex: 1;
        width: 50%;
        h4 {
          height: 40px;
          font-weight: 600;
          font-size: 16px;
          line-height: 20px;
        }
        .address {
          color: #999;
          font-size: 13px;
          height: 30px;
          line-height: 30px;
        }
        .time {
          color: #999;
          height: 20px;
          font-size: 13px;
          line-height: 20px;
          .price {
            float: right;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
