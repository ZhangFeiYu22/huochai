<script>
import globalStore from '@/store/globalStore'
import { getSessionKey, fetchUserInfo } from '@/utils/api'
export default {
  data () {
    return {
      optionsPathUrl: ''
    }
  },
  onLaunch (options) {
    var newShareUrl;
    if (options.scene == 1007 || options.scene == 1008) {
      console.log('单人会话进入编号:1007---群聊进入编号:1008', options.scene)
      // 通过单人聊天会话分享进入   或者  通过群聊会话分享进入  
      if (options.query.publishStatusId) {
        newShareUrl = `/${options.path}?publishStatusId=${options.query.publishStatusId}`;
      } else if (options.query.videoId) {
        newShareUrl = `/${options.path}?videoId=${options.query.videoId}`;
      } else if (options.query.videoType) {
        newShareUrl = `/${options.path}?videoId=${options.query.videoId}&videoType=${options.query.videoType}`;
      } else if (options.query.picType) {
        newShareUrl = `/${options.path}?picId=${options.query.picId}&picType=${options.query.picType}`;
      }

      wx.setStorageSync('shareUrlValue', true)  //设置分享进来的返回按钮值
      console.log('分享进来的的判断值--1--',wx.getStorageSync('shareUrlValue'))
      wx.setStorageSync('optionsPathUrlS', newShareUrl)  // 未授权时候  存储跳转地址  授权后直接跳转
      console.log('optionsPathUrl----1007--1008---', newShareUrl, 'shareUrlValue----1007---', wx.getStorageSync('shareUrlValue'))
    } else {
      newShareUrl = `/pages/home/main`;
      wx.setStorageSync('optionsPathUrlS', newShareUrl)  // 未授权时候  存储跳转地址  授权后直接跳转
    }

  },
  mounted () {    
    // this.getSetting();  // 一进来看看用户是否授权过
    wx.getSystemInfo({
      success: res => {
        //导航高度
        globalStore.commit('changeNavHeight', res.statusBarHeight)  //存储 高度
      }, fail (err) {
        console.log(err);
      }
    })
  },
  methods: {
    getSetting () {
      var _this = this;
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            _this.loginFun();
          } else {
            wx.navigateTo({
              url: '/pages/index/main'
            })
          }
        }
      })
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
        wx.setStorageSync('userAllInfo', res.member)
        wx.setStorageSync('authToken', res.member.token)
      }
    },
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
page {
  padding-bottom: 30px;
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
</style>
