<script>
import globalStore from '@/store/globalStore'
export default {
  data () {
    return {
      optionsScene: '',
      optionsPathUrl: '',
    }
  },
  onLaunch (options) {
    wx.setStorageSync('firstUse_key', 'true');
    console.log('进入判断---path--', options.scene)
    this.optionsScene = options.scene;
    wx.setStorageSync('optionsScene', options.scene);
    wx.setStorageSync('optionsPathUrl', `/${options.path}`);
    wx.setStorageSync('optionsId', options.query.id);
    if (options.scene == 1007 || options.scene == 1008) {
      console.log('单人会话进入编号:1007   群聊进入编号:1008')
      // 通过单人聊天会话分享进入  通过群聊会话分享进入
      this.optionsPathUrl = `/${options.path}?id=${options.query.id}`;
      wx.setStorageSync('shareVal', true);
    } else if (options.scene == 1011) {
      console.log('调试工具进入编号:1011')
      // 调试工具真机调试
      this.optionsPathUrl = `/${options.path}?id=${options.query.id}`;
    } else if (options.scene == 1017) {
      console.log('体验版进入编号:1017')
      // 体验版入口页进入
      wx.setStorageSync('optionsPathUrl', `/pages/personList/main`);
      this.optionsPathUrl = `/pages/personList/main`;
    } else {
      wx.setStorageSync('optionsPathUrl', `/pages/personList/main`);
      this.optionsPathUrl = `/pages/personList/main`;
    }
  },
  created () { },
  mounted () {
    this.getSetting();
  },
  methods: {
    getSetting () {
      var _this = this;
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.login({
              success (loginRes) {
                if (loginRes.code) {
                  globalStore.commit('changeCode', loginRes.code)
                  // 这里可以把code传给后台，后台用此获取openid及session_key
                  wx.getUserInfo({
                    success: function (getuserRes) {
                      globalStore.commit('changeUserInfo', getuserRes.userInfo)
                      wx.request({
                        url: `https://mini.dscs123.cn/login/${globalStore.state.globalAppId}?code=${globalStore.state.globalCode}`,
                        data: {},
                        header: {
                          'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (response) {
                          globalStore.commit('changeSessionKey', response.data.sessionKey)
                          _this.$http.post({
                            url: `auth/${globalStore.state.globalAppId}`,
                            data: {
                              encryptedData: getuserRes.encryptedData,
                              sessionKey: globalStore.state.globalSessionKey,
                              signature: getuserRes.signature,
                              iv: getuserRes.iv,
                              rawData: getuserRes.rawData
                            }
                          }).then(respon => {
                            wx.setStorageSync('token', respon.token)
                            wx.redirectTo({
                              // url: '/pages/personList/main'
                              url: `${_this.optionsPathUrl}`
                            })
                          })
                        }
                      })

                    }
                  })

                }
              },
            })
          } else {
            wx.reLaunch({
              url: '/pages/loginEmpower/main'
            })
          }
        }
      })

    }
  }
}
</script>

<style>
@import "../static/iconLink/iconfont.css";
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
i {
  display: inline-block;
}

page {
  font-size: 32rpx;
  background-color: #fff;
  box-sizing: border-box;
  font-size: 32rpx;
  height: 100%;
}
.center90 {
  width: 90%;
  margin: 0 auto;
}
i {
  display: inline-block;
}
.mt10 {
  margin-top: 10px !important;
}
.mt15 {
  margin-top: 15px !important;
}
.mt20 {
  margin-top: 20px !important;
}
/*容器 */

.container {
  width: 100%;
  height: auto;
}

view,
navigator {
  box-sizing: border-box;
  display: block;
  padding: 0;
  margin: 0;
}
/*image 默认的宽高 */
image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}
.br2 {
  border-radius: 2px;
}
.br5 {
  border-radius: 5px;
}

.br10 {
  border-radius: 10rpx;
}
/*遮罩层 */

.mask {
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  transition: all 0.5s;
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
.ellipsis-4 {
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  height: auto;
}
.unellipsis {
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  height: auto;
}
</style>
