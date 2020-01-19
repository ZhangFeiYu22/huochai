<template>
  <div class="collect" :style="{marginTop: headHeight + 'px'}">
    <headView :headData="headData"></headView>
    <div class="photoVideo">
      <div
        class="nav"
        :class="navNum == item.id ? 'active' : ''"
        v-for="item in navList"
        :key="item.id"
        @click="activeNav(item.id)"
      >{{item.title}}</div>
    </div>
    <div class="collectCont">
      <div class="imgListBox" v-if="navNum == 2">
        <div class="imgListItem" v-for="item in picListData" :key="item.id">
          <img :src="item.httpurl" mode="aspectFill" @click="previewImg(item.fileid)" />
        </div>
      </div>
      <div class="videoListBox" v-else>
        <div class="videoListItem" v-for="item in videoListData" :key="item.id">
          <div class="videoBox">
            <!-- <video :src="item.httpurl"></video> -->
            <txv-video vid="e0354z3cqjp" playerid="txv1" width="100%" height="100%"></txv-video>
            <div class="videoShade" @click="videoPlay(item.fileid)">
              <div class="top">
                <p class="title">{{item.title}}</p>
                <p class="time">{{item.createtime}}</p>
              </div>
              <div class="bottom">
                <p>
                  <i class="iconfont icon-yanjing"></i>
                  <span>{{item.pageviews}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headView from '@/components/headerView'
import activityCom from '@/components/activityComponents'
import { collectMediaList, postpicView } from '@/utils/api'
export default {
  data () {
    return {
      headData: {
        title: '收藏',
        bgcolor: '#fff',
        showBlack: true
      },
      headHeight: '',
      navNum: 2,
      navList: [
        { id: 2, title: '图片' },
        { id: 1, title: '视频' }
      ],
      picListData: [],
      videoListData: []
    }
  },
  components: {
    headView,
    activityCom
  },
  onLoad () {
    this.headHeight = this.$store.state.navHeight + 46;
    this.fetchData(this.navNum);
  },
  methods: {
    async fetchData (typeId) {
      let data = await collectMediaList(typeId);
      if (typeId == 2) {
        this.picListData = data.collectMediaList;
      } else {
        this.videoListData = data.collectMediaList;
      }
    },
    previewImg (pid) {
      wx.navigateTo({
        url: `/pages/picPlay/main?collectPicId=${pid}&picType=3`
      })
    },
    activeNav (acid) {
      if (acid == 2) {
        this.fetchData(2)
      } else {
        this.fetchData(1)
      }
      this.navNum = acid;
    },
    videoPlay(vid){
      wx.navigateTo({
        url: `/pages/videoPlay/main?collectVideoId=${vid}&videoType=3`
      })
    },
    async viewFun (id) {
      let view = await postpicView(id);
    }
  }
}
</script>
  
<style lang="less" scoped>
.collect {
  .photoVideo {
    width: 70%;
    margin: 15px auto;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .nav {
      font-size: 15px;
      height: 20px;
      line-height: 20px;
      &.active {
        position: relative;
        font-weight: 600;
        &::before {
          display: block;
          content: "";
          width: 3px;
          height: 16px;
          background-color: #6997a0;
          position: absolute;
          top: 3px;
          left: -10px;
        }
      }
    }
  }
  .collectCont {
    width: 94%;
    margin: 0 auto;
    .imgListBox {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      .imgListItem {
        width: 32%;
        height: 110px;
        margin-bottom: 10px;
        overflow: hidden;
        border-radius: 4px;
        margin-right: 2%;
        &:nth-child(3n+3){
          margin-right: 0;
          margin-right: 0;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .videoListBox {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
      .videoListItem {
        width: 50%;
        height: 180px;
        margin-bottom: 10px;
        overflow: hidden;
        .videoBox {
          width: 100%;
          height: 100%;
          position: relative;
          video {
            width: 100%;
            height: 100%;
          }
          .videoShade {
            width: 100%;
            height: 100%;
            position: absolute;
            z-index: 11;
            top: 0;
            left: 0;
            .top {
              color: #fff;
              .title {
                font-style: 20px;
                font-weight: 600;
              }
              .time {
                font-size: 12px;
              }
            }
            .bottom {
              position: absolute;
              height: 36px;
              line-height: 36px;
              width: 90%;
              padding: 0 4%;
              bottom: 0;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              color: #fff;
              font-size: 12px;
              i {
                vertical-align: middle;
                margin-right: 5px;
              }
              span {
                vertical-align: middle;
              }
            }
          }
        }
      }
    }
  }
}
</style>
