<template>
  <div class="playView">
    <div class="contentView">
      <headView :headData="vidHeadData"></headView>
      <div class="picView">
        <div class="picBox">
          <img :src="picData.url" mode="aspectFill" />
          <button
            class="picTopRight"
            open-type="share"
            :data-itemId="picData.id"
            :data-itemTitle="picData.title"
          >
            <i class="iconfont icon-fenxiang3"></i>
          </button>
          <div class="rightIcon">
            <i
              class="iconfont"
              :class=" startVal==1 ? 'icon-shoucang1' : 'icon-lujing' "
              @click="startChange(picData.mediaid)"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headView from '@/components/headerView'
import { albumVideoDetail, collectVideoDetail, albumView, collectMediaGet, collectMediaPut } from '@/utils/api'
export default {
  data () {
    return {
      csrfToken: null,   //登录获取到的token
      // picType  为2  表示从 相册 中的视频列表点击过来播放的
      // picType  为3  表示从 收藏 中的视频列表点击过来播放的
      picType: null,
      vidHeadData: {
        title: '图片预览',
        bgcolor: 'transparent',
        showBlack: true
      },
      headHeight: '',
      picData: '',
      startVal: true
    }
  },
  components: {
    headView
  },
  onLoad: function (options) {
    this.csrfToken = wx.getStorageSync('authToken')
    this.headHeight = this.$store.state.navHeight;

    this.picType = options.picType;
    if (options.picType == 2) {
      console.log('相册中传递过来--picId---', options.picId)
      albumVideoDetail(options.picId).then(res => {
        if (res.code == 0) {
          this.picData = res.album;
          this.picData = {
            id: res.album.id,
            url: res.album.url,
            title: res.album.title,
            mediaid: res.album.mediaid
          };
          this.vidHeadData.title = res.album.title;
          if (this.csrfToken) {
            this.collectMediaFun(res.album.mediaid);
          }
        }
      })
      this.albumViewFun(options.picId);
    } else if (options.picType == 3) {
      console.log('收藏中传递过来--collectPicId---', options.collectPicId)
      collectVideoDetail(options.collectPicId).then(res => {
        if (res.code == 0) {
          console.log(res)
          this.picData = res.collectMedia;
          this.picData = {
            id: res.collectMedia.fileid,
            url: res.collectMedia.httpurl,
            title: '图片',
            mediaid: res.collectMedia.fileid
          };
          if (this.csrfToken) {
            this.collectMediaFun(res.collectMedia.fileid);
          }
        }
      })
    }

  },
  methods: {
    //视频浏览量
    async albumViewFun (id) {
      let result = await albumView(id)
    },
    startChange (pmid) {
      this.collectMediaFunPlay(pmid)
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
    async collectMediaFunPlay (pmid) {
      if (this.csrfToken) {
        let result = await collectMediaPut(pmid)
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
    }
  },
  //转发 分享
  onShareAppMessage (res) {
    // 视频分享的id 携带过来
    let sPid = res.target.dataset.itemid;
    let sPtitle = res.target.dataset.itemtitle;
    console.log(res)
    if (res.from === 'button') {
      console.log('button')
    }
    return {
      title: sPtitle,
      path: this.picType == 2 ? `/pages/picPlay/main?picId=${sPid}&picType=${this.picType}` : `/pages/picPlay/main?collectPicId=${sPid}&picType=${this.picType}`,
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
  display: flex;
  background-color: #000;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  .contentView {
    height: 100%;
    .picView {
      width: 100%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      .picBox {
        position: relative;
        img {
          width: 100%;
        }
        .picTopRight {
          padding: 0;
          margin: 0;
          height: 32px;
          line-height: 32px;
          background: transparent;
          position: absolute;
          right: 10px;
          top: 5px;
          &::after {
            border: none;
          }
          i {
            font-size: 25px;
            color: #f1f1f1;
          }
        }
        .rightIcon {
          position: absolute;
          bottom: 15px;
          right: 10px;
          i {
            display: block !important;
            font-size: 25px;
            height: 25px;
            line-height: 25px;
            color: #f1f1f1;
          }
        }
      }
    }
  }
}
</style>
