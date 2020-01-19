<template>
  <div class="pv-box">
    <div class="photoVideo">
      <div
        class="nav"
        :class="navNum == (index + 2) || navNum == index ? 'active' : ''"
        v-for="(item,index) in navList"
        :key="item.id"
        @click="activeNav(index)"
      >{{item.title}}</div>
    </div>
    <view class="classifyBox">
      <scroll-view class="scroll-view_x" scroll-x style="width: auto;overflow:hidden;">
        <view class="item_list" v-for="item in typeLists" :key="item.id">
          <view
            class="item_book_text"
            :class="cccid == item.id ? 'typtActive': ''"
            @click="changeTypeData(item.id)"
          >{{item.name}}</view>
        </view>
      </scroll-view>
    </view>
    <div class="photoView" v-if="navNum == 2">
      <div class="imgList" v-for="(item,index) in picShowViews" :key="index">
        <img :src="item.url" mode="aspectFill" @click="previewImg(item.id)" alt />
        <div class="info">
          <div class="titleinfo ellipsis-1">{{item.title}}</div>
          <div class="seeNum">
            <i class="iconfont icon-yanjing1"></i>
            <span>{{item.pageviews}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="videoView" v-else>
      <div class="videoViewList">
        <videoView :videoData="videoShowViews" :videoPlayIndex="playIndex"></videoView>
      </div>
    </div>
  </div>
</template>

<script>
import videoView from '@/components/videoComponents.vue'
import { classifyPidData, albumClassIdData, albumView } from '@/utils/api'
export default {
  data () {
    return {
      navNum: 2,
      navList: [
        { id: 2, title: '图片' },
        { id: 1, title: '视频' }
      ],
      classify_p: '',
      classify_v: '',
      cccid: 0,
      typeLists: [],
      picShowViews: [],
      videoShowViews: [],
      playIndex: null   //为改变视频组件的索引  准备
    }
  },
  components: {
    videoView
  },
  onLoad () {
    this.getList()
  },
  methods: {
    async getList () {
      this.classify_p = await classifyPidData(2);
      this.classify_v = await classifyPidData(1);
      this.choseType(this.navNum)
    },
    async fetchData (fid) {
      let albumData = await albumClassIdData(fid);
      if (this.navNum == 1) {
        this.videoShowViews = albumData.albumList
        // 改变video组件里面的视频初始索引值
        this.playIndex = null;
      } else {
        this.picShowViews = albumData.albumList
      }
    },
    async activeNav (index) {
      if (index == 0) {
        this.navNum = 2;
      } else {
        this.navNum = 1;
      }
      this.choseType(this.navNum);
    },
    previewImg (pid) {
      wx.navigateTo({
        url: `/pages/picPlay/main?picId=${pid}&picType=2`
      })
    },
    choseType (num) {
      var fid;
      if (num == 2) {
        this.typeLists = this.classify_p.classifyList
        fid = this.typeLists[0].id
      } else {
        this.typeLists = this.classify_v.classifyList
        fid = this.typeLists[0].id
      }
      this.cccid = fid;
      this.fetchData(fid)
    },
    changeTypeData (cid) {
      this.cccid = cid;
      this.fetchData(cid)
    },
    async albumViewFun (id) {
      let result = await albumView(id)
    }
  }
}
</script>

<style lang="less" scoped>
.pv-box {
  .classifyBox {
    width: 97%;
    padding-right: 3%;
    overflow: hidden;
    height: 30px;
    line-height: 30px;
    white-space: nowrap;
    .item_list {
      height: auto;
      padding-left: 3%;
      display: inline-block;
      .item_book_text {
        font-size: 14px;
        color: #666;
        &.typtActive {
          font-weight: 600;
          color: #333;
        }
      }
    }
  }
  .photoVideo {
    width: 70%;
    margin: 15px auto 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .nav {
      font-size: 16px;
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
  .photoView {
    width: 94%;
    margin: 5px auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    .imgList {
      width: 48%;
      height: 169px;
      overflow: hidden;
      border-radius: 5px;
      position: relative;
      margin-bottom: 10px;
      img {
        width: 100%;
        height: 100%;
      }
      .info {
        position: absolute;
        bottom: 0;
        height: 34px;
        line-height: 34px;
        width: 94%;
        padding: 0 3%;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        font-size: 12px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .titleinfo {
          width: 70%;
        }
        .seeNum {
          width: 30%;
          text-align: right;
          i {
            margin-right: 5px;
          }
          span {
            vertical-align: middle;
          }
        }
      }
    }
  }
  .videoView {
    width: 100%;
    .videoViewList {
      height: 200px;
    }
  }
}
</style>
