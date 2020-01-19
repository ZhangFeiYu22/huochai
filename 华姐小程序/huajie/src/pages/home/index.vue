<template>
  <div class="home" :style="{marginTop: headHeight + 'px'}">
    <div class="homeContentBox">
      <headView :headData="headData"></headView>
      <div class="homeContent" :style="{top: headHeight + 'px'}">
        <div class="topTag">
          <div class="left">今日心情:</div>
          <div class="right">{{newAnVal}}</div>
        </div>
        <!-- 点击菜单遮罩层 -->
        <div class="maskView" v-if="maskViewShow" @click="menuChange"></div>
        <div class="navBox">
          <div class="navTag">
            <i class="menuIcon iconfont icon-weibiaoti12" @click.stop="menuChange"></i>
            <div class="menuList" v-show="menuShow">
              <p @click="goActivity">
                <i class="iconfont icon-shouye"></i>
                <span>活动</span>
              </p>
              <p @click="goCollect">
                <i class="iconfont icon-shoucang"></i>
                <span>收藏</span>
              </p>
            </div>
          </div>
          <div class="navList">
            <p
              @click="navListChange(item,index)"
              v-for="(item,index) in navItem"
              :key="item.navId"
              :class="navNum == index ? 'active' : ''"
            >{{item.navName}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="zujian">
      <statusView v-if="contentShowNum == 0" ref="list"></statusView>
      <activityView v-else-if="contentShowNum == 1" ref="list"></activityView>
      <photoView v-else-if="contentShowNum == 2" ref="list"></photoView>
    </div>
    <div class="maskGuide" v-if="!maskGuideShow" @click="changeGuide">
      <img src="../../../static/images/guide.png" mode="widthFix" />
    </div>
  </div>
</template>

<script>
import headView from '@/components/headerView'
import statusView from '@/components/status.vue'
import activityView from '@/components/activity.vue'
import photoView from '@/components/photo.vue'
import { getSessionKey, fetchUserInfo, newAna } from '@/utils/api'
import time from '../../utils/filter'
export default {
  data () {
    return {
      csrfToken: null,   //登录获取到的token
      newAnVal: '',
      maskViewShow: false,
      maskGuideShow: false,
      contentShowNum: 0,
      headData: {
        title: '',
        bgcolor: '#fff',
        showBlack: false
      },
      headHeight: '',
      menuShow: false,
      navNum: 0,
      navItem: [
        { navId: 0, navName: '状态' },
        { navId: 1, navName: '活动' },
        { navId: 2, navName: '相册' },
      ]
    }
  },
  components: {
    headView,
    statusView,
    activityView,
    photoView
  },
  onLoad () {
    this.csrfToken = wx.getStorageSync('authToken')
    console.log('x---vuex缓存token---', this.$store.state.authToken)
    this.headHeight = this.$store.state.navHeight + 46;
    if (wx.getStorageSync('maskGuide')) {
      this.maskGuideShow = wx.getStorageSync('maskGuide')
    }
    this.fetchNewAn();
  },
  // 下拉刷新事件
  onPullDownRefresh () {
    this.$refs.list.getList()
    this.fetchNewAn();
  },
  methods: {
    async fetchNewAn () {
      let newAnData = await newAna();
      this.newAnVal = newAnData.quotation.content;
    },
    goActivity () {
      if (this.csrfToken) {
        wx.navigateTo({
          url: '/pages/activityEd/main'
        })
        this.menuChange()
      } else {
        wx.showModal({
          title: '提示',
          content: '请先登录,享受更高权益',
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '/pages/index/main'
              })
            }
          }
        });
      }
    },
    goCollect () {
      if (this.csrfToken) {
        wx.navigateTo({
          url: '/pages/collect/main'
        })
        this.menuChange()
      } else {
        wx.showModal({
          title: '提示',
          content: '请先登录,享受更高权益',
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '/pages/index/main'
              })
            }
          }
        });
      }
    },
    menuChange () {
      this.menuShow = !this.menuShow;
      this.maskViewShow = !this.maskViewShow;
    },
    navListChange (item, index) {
      this.navNum = index;
      this.contentShowNum = index;
    },
    changeGuide () {
      this.maskGuideShow = true;
      wx.setStorageSync('maskGuide', true)
    }
  },
  //转发 分享
  onShareAppMessage (res) {
    // 视频分享的id 携带过来
    let sVid = res.target.dataset.itemid;
    let sVtitle = res.target.dataset.itemtitle;
    console.log(res)
    if (res.from === 'button') {
      console.log('button')
    }
    return {
      title: sVtitle,
      path: `/pages/videoPlay/main?videoId=${sVid}`,
      success: function (res) {
        console.log('成功', res)
      }
    }
  }
}
</script>
  
<style lang="less" scoped>
.home {
  .maskView {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.2);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }
  .maskGuide {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9;
    image {
      position: absolute;
      top: 17%;
      left: 3%;
    }
  }
  .zujian {
    padding-top: 90px;
    position: relative;
    z-index: 0;
  }
  .homeContentBox {
    background-color: #fff;
    position: fixed;
    z-index: 1;
    width: 100%;
    .homeContent {
      width: 100%;
      margin: 0 auto;
      background-color: #fff;
      box-sizing: border-box;
      padding: 0 7%;
      .topTag {
        background-color: #6997a0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 14px;
        color: #fff;
        padding: 0 2%;
        position: relative;
        margin-bottom: 20px;
        &::before {
          display: block;
          content: "";
          width: 20px;
          height: 20px;
          background-color: #6997a0;
          position: absolute;
          left: 0;
          transform: rotate(45deg) translate(5px, 10px);
        }
        .left {
          width: 27%;
          height: 40px;
          line-height: 40px;
          text-align: right;
        }
        .right {
          width: 70%;
          line-height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .navBox {
    height: 25px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 5px 0;
    .navTag {
      width: 20%;
      position: relative;
      height: 25px;
      line-height: 25px;
      i {
        font-weight: 600;
        font-size: 20px;
        &.menuIcon {
          position: absolute;
          z-index: 9999;
        }
      }
      .menuList {
        position: absolute;
        background-color: #fff;
        z-index: 9999;
        top: 32px;
        box-shadow: 0 4px 8px #ddd;
        padding: 5px 12px 10px;
        width: 70px;
        border-radius: 3px;
        p {
          font-size: 16px;
          padding: 10px 0;
          i {
            margin-right: 10px;
            color: #6997a0;
            font-size: 20px;
            vertical-align: middle;
          }
          span {
            vertical-align: middle;
          }
          &:first-child {
            border-bottom: 1px solid #eee;
          }
        }
      }
    }
    .navList {
      width: 70%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 25px;
      line-height: 25px;
      p {
        font-size: 16px;
        &.active {
          color: #333;
          font-weight: 600;
          font-size: 18px;
          border-bottom: 2px solid #6997a0;
        }
      }
    }
  }
}
</style>
