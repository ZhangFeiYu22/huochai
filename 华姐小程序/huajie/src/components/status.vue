<template>
  <div class="status">
    <div class="statusList" v-for="item in publishListData" :key="item.id">
      <div class="leftTime">
        <p class="date">{{item.timeM}}</p>
        <p class="time">{{item.timeD}}</p>
      </div>
      <div class="rightType">
        <div @click="goPlayView(item.id)" v-if="item.type == 2">
          <div class="photoShow" v-if="item.attach.length > 2">
            <div class="photoShowL">
              <img :src="item.attach[0].httpurl" mode="aspectFill" alt />
            </div>
            <div class="photoShowR">
              <div class="photoShowRT">
                <img :src="item.attach[1].httpurl" mode="center" alt />
              </div>
              <div class="photoShowRB">
                <img :src="item.attach[2].httpurl" mode="aspectFill" alt />
              </div>
            </div>
            <div class="lengthNum">{{item.attach.length}}</div>
          </div>
          <div class="photoShow" @click="goPlayView(item.id)" v-else>
            <div class="photoOne">
              <img :src="item.content.contentData[0].httpurl" mode="center" alt />
            </div>
            <div class="lengthNum">{{item.content.contentData.length}}</div>
          </div>
        </div>
        <div v-if="item.type == 1">
          <div class="videoShow">
            <video
              :controls="controlsVal"
              :show-center-play-btn="playIconBtn"
              :src="item.attach[0].httpurl"
            ></video>
            <!-- <img :src="controlsVal" mode="aspectFill"> -->
            <!-- <txv-video vid="e0354z3cqjp" playerid="txv1" width="100%" height="100%"></txv-video> -->
            <div class="videoCover" @click="goPlayView(item.id)">
              <i class="playIcon iconfont icon-bofang"></i>
            </div>
          </div>
        </div>
        <div class="otherShow">
          <!-- <p class="title">{{item.createtime}}</p> -->
          <p class="summary">{{item.content}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import time from '../utils/filter'
import { publishStatus } from '@/utils/api'
export default {
  data () {
    var time = require('../utils/filter.js');
    return {
      publishListData: [],
      controlsVal: false,
      playIconBtn: false
    }
  },
  onLoad () {
    this.getList();
  },
  methods: {
    getList () {
      publishStatus().then(res => {
        if (res.postpicList) {
          this.publishListData = res.postpicList
          let dd = Date.parse(this.publishListData[0].createtime);
          this.publishListData.forEach(item => {
            item.createtime = item.createtime.replace(/-/g, '/');
            let createT = Date.parse(item.createtime) / 1000
            item.createtime = createT
            item.attach = JSON.parse(item.attach)
            let timeM = time.formatTimeTwo(createT, 'M/D')
            let timeD = time.formatTimeTwo(createT, 'h:m')
            item.timeM = timeM
            item.timeD = timeD
          })
        }
      })
    },
    goPlayView (psid) {
      wx.navigateTo({
        url: `/pages/play/main?publishStatusId=${psid}`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.status {
  width: 86%;
  margin: 30px auto;
  .statusList {
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
    .leftTime {
      width: 30%;
      .date {
        font-weight: 600;
        font-size: 16px;
      }
      .time {
        font-size: 12px;
      }
    }
    .rightType {
      width: 70%;
      .videoShow {
        width: 100%;
        height: 178px;
        position: relative;
        z-index: 0;
        video {
          width: 100%;
          height: 100%;
        }
        .videoCover {
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: 11;
          top: 0;
          background: transparent;
        }
        img {
          width: 100%;
          height: 100%;
        }
        .playIcon {
          font-size: 50px;
          color: #fff;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .photoShow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        position: relative;
        z-index: 0;
        img {
          width: 100%;
          height: 100%;
        }
        .photoOne {
          width: 100%;
          height: 178px;
        }
        .photoShowL {
          width: 55%;
          height: 178px;
        }
        .photoShowR {
          width: 40%;
          height: 178px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .photoShowRT {
            height: 48%;
          }
          .photoShowRB {
            height: 48%;
          }
        }
        .lengthNum {
          position: absolute;
          bottom: 3px;
          right: 5px;
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          background-color: #1c1c1c;
          color: #fff;
          font-size: 12px;
        }
      }
      .otherShow {
        margin-top: 5px;
        .title {
          font-weight: 600;
          font-size: 14px;
        }
        .summary {
          font-size: 12px;
          color: #999;
          text-align: justify;
          overflow: hidden;
          text-overflow: ellipsis;
          word-wrap: break-word;
          display: -webkit-box; //一定要写
          -webkit-line-clamp: 2; //控制行数
          -webkit-box-orient: vertical; //一定要写
        }
      }
    }
  }
}
</style>
