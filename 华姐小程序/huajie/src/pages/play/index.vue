<template>
  <div class="playView">
    <div class="contentView">
      <headView :headData="pvHeadData"></headView>
      <div class="picView" v-if="typeNum == 2">
        <swiper
          class="swiperBox"
          :indicator-dots="indicatordots"
          :autoplay="autoplay"
          :interval="interval"
          :duration="duration"
          @change="onSlideChange"
        >
          <block v-for="item in imgArr" :key="item.id">
            <swiper-item class="vol-swiper-item">
              <view style="width:100%;height:100%;">
                <img
                  class="vol-picture"
                  :src="item.httpurl"
                  mode="widthFix"
                  style="width:100%;height:100%;position:absolute;transform:translateY(-50%);top:50%;"
                />
              </view>
            </swiper-item>
          </block>
        </swiper>
      </div>
      <div class="videoView" v-else>
        <div class="videoBox">
          <!-- <video :src="videoUrl"></video> -->
          <txv-video vid="e0354z3cqjp" playerid="txv1" width="100%" height="100%"></txv-video>
        </div>
      </div>
      <div class="bottom">
        <p class="letter">{{detailData.content}}</p>
        <div class="rightIcon">
          <i
            class="iconfont"
            :class=" startVal==1 ? 'icon-shoucang1' : 'icon-lujing' "
            @click="startChange"
          ></i>
          <button class="shareBtn" open-type="share">
            <i class="iconfont icon-fenxiang3"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headView from '@/components/headerView'
import { collectMediaGet, collectMediaPut, postpicView, publishStatusDetail } from '@/utils/api'
export default {
  data () {
    return {
      csrfToken: null,   //登录获取到的token
      pvHeadData: {
        title: '',
        bgcolor: 'transparent',
        showBlack: true
      },
      headHeight: '',
      detailData: '', //所有详细数据
      typeNum: 1,
      nowNum: 1,   //相册  当前个数/总共个数
      videoUrl: '',   //视频的url地址
      imgArr: [],  //图片地址
      hidden: false,
      imgList: [],
      autoplay: false,
      indicatordots: false,
      duration: 500,
      startVal: true,
      appId: 'wx98fa9989372e7856'
    }
  },
  components: {
    headView
  },
  async onLoad (options) {
    this.csrfToken = wx.getStorageSync('authToken')
    this.nowNum = 1;   //初始化显示第一个(只是显示)
    var mData;
    let resSult = await publishStatusDetail(options.publishStatusId)
    let jsondd = JSON.stringify(resSult.postpic)
    mData = JSON.parse(jsondd);
    mData.attach = JSON.parse(mData.attach)
    this.detailData = mData;

    if (mData.type == 1) {
      this.videoUrl = mData.attach[0].httpurl;
      this.imgArr = mData.attach;     //赋值  方便收藏点击 
      //如果登录  则缓存token  判断是否收藏  
      if (this.csrfToken) {
        this.collectMediaFun(mData.attach[0].id)
      }
      this.viewFun(mData.attach[0].id)
    } else {
      this.imgArr = mData.attach;
      //如果登录  则缓存token  判断是否收藏  
      if (this.csrfToken) {
        this.collectMediaFun(this.imgArr[0].id)
      }
      this.imgArr.map(item => {
        this.viewFun(item.id)
      })
    }
    this.typeNum = mData.type

    if (this.typeNum == 2) {
      this.pvHeadData.title = this.nowNum + '/' + this.imgArr.length;
    } else {
      this.pvHeadData.title = '视频播放'
    }
  },
  created () {
    this.headHeight = this.$store.state.navHeight;
  },
  methods: {
    onSlideChange: function (event) {
      this.nowNum = event.target.current + 1;
      this.pvHeadData.title = this.nowNum + '/' + this.imgArr.length;
      //如果登录  则缓存token  判断是否收藏  
      if (this.csrfToken) {
        this.collectMediaFun(this.imgArr[this.nowNum - 1].id);
      }
    },
    startChange () {
      this.collectMediaFunPlay(this.imgArr[this.nowNum - 1].id)
    },
    // 判断收藏
    async collectMediaFun (cid) {
      let result = await collectMediaGet(cid)
      if (result.collectMedia == '') {
        this.startVal = true;
      } else {
        this.startVal = false;
      }
    },
    // 收藏  取消收藏
    async collectMediaFunPlay (cid) {
      if (this.csrfToken) {
        let result = await collectMediaPut(cid)
        if (result.collectMedia !== '') {
          this.startVal = false;
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          this.startVal = true;
          wx.showToast({
            title: '取消收藏',
            icon: 'success',
            duration: 2000
          })
        }
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
    // 浏览量
    async viewFun (id) {
      let view = await postpicView(id);
    }
  },
  //转发 分享
  onShareAppMessage (res) {
    if (res.from === 'button') {
      console.log('button')
    }
    return {
      title: '来自华姐的分享',
      path: `/pages/play/main?publishStatusId=${this.detailData.id}`,
      success: function (res) {
        console.log('成功', res)
      }
    }
  }
}
</script>
  
<style lang="less" scoped>
.playView {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  .contentView {
    height: 100%;
    .picView {
      width: 100%;
      height: 100%;
      position: absolute;
      .swiperBox {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
    }
    .videoView {
      width: 100%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      .videoBox {
        width: 100%;
        height: 225px;
        // video {
        //   width: 100%;
        // }
      }
    }
    .numNow {
      width: 100%;
      text-align: center;
      height: 46px;
      line-height: 46px;
      position: absolute;
      top: 0;
      z-index: 99;
    }
    .bottom {
      position: absolute;
      font-size: 14px;
      bottom: 10px;
      left: 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      .letter {
        padding-right: 10px;
        width: 80%;
        line-height: 20px;
      }
      .rightIcon {
        i {
          display: block !important;
          font-size: 20px;
          height: 25px;
          line-height: 25px;
          color: #f1f1f1;
        }
        .shareBtn {
          padding: 0;
          background-color: transparent;
        }
      }
    }
  }
}
</style>
