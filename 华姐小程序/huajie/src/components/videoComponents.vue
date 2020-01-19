<template>
  <div class="videoCom">
    <div
      class="videoList"
      v-for="(item,index) in videoData"
      :key="item.id"      
    >
      <!-- <video
        :src="item.url"
        :id="'video_'+index"
        :show-center-play-btn="playIconBtn"
        :controls="controlsVal"
      ></video> -->
      <txv-video vid="e0354z3cqjp" playerid="txv1" width="100%" height="100%"></txv-video>
      <div class="videoTop">
        <div class="videoTopLeft">
          <p class="title">{{item.title}}</p>
          <p class="date">{{item.createtime}}</p>
        </div>
        <!-- <button class="videoTopRight" open-type="share" :data-itemId="item.id" :data-itemTitle="item.title">
          <i class="iconfont icon-fenxiang3"></i>
        </button> -->
      </div>
      <div class="videoCenter" @click.stop="videoPlay(item.id)">
        <i class="iconfont icon-bofang"></i>
      </div>
      <div class="videoBottom">
        <div class="num">
          <i class="iconfont icon-yanjing"></i>
          <span>{{item.pageviews}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { albumView } from '@/utils/api'
export default {
  props: ['videoData'],
  data () {
    return {
      controlsVal: false,
      playIconBtn: false
    }
  },
  methods: {
    videoPlay (vid) {
      wx.navigateTo({
        url: `/pages/videoPlay/main?videoId=${vid}&videoType=2`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.videoCom {
  width: 100%;
  height: 100%;
  .videoList {
    width: 100%;
    height: 100%;
    position: relative;
    margin-top: 5px;
    video {
      width: 100%;
      height: 100%;
    }
    .videoTop {
      position: absolute;
      top: 0;
      width: 90%;
      padding: 2% 5%;
      color: #fff;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 14px;
      line-height: 22px;
      .videoTopLeft {
        .date {
          line-height: 16px;
          font-size: 12px;
        }
      }
      .videoTopRight {
        padding: 0;
        margin: 0;
        height: 32px;
        line-height: 32px;
        background: transparent;
        &::after{
          border: none;
        }
        i {
          font-size: 24px;
          color: #f1f1f1;
        }
      }
    }
    .videoCenter {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 80%;
      height: 55%;
      color: #fff;
      transform: translate(-50%, -50%);
      i {
        font-size: 52px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .videoBottom {
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
</style>
