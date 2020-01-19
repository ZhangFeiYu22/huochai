<template>
  <div class="container">
    <TopBananer :topImgUrl="topImgUrl"></TopBananer>
    <div class="tabBox mt15">
      <p
        :class="navNum == index ? 'active' : ''"
        v-for="(item,index) in navTabList"
        @click="selectNav(index)"
        :key="item.id"
      >{{item.name}}</p>
    </div>
    <div class="projectList" v-if="navNum == 0">
      <div
        class="projectItem"
        v-for="item in data_projectData"
        :key="item.id"
        @click="goDetail(item.id)"
      >
        <div class="imgBox">
          <img :src="item.coverimgurl" alt />
        </div>
        <div class="summary ellipsis-2">
          <p class="name">{{item.title}}</p>
          <WxPares :content="item.introduction" />
        </div>
        <div class="needBtn">
          <p>需报名</p>
        </div>        
      </div>
    </div>
    <div class="projectList"  v-else-if="navNum == 1">
      <div
        class="projectItem"
        v-for="item in chuangye_projectData"
        :key="item.id"
        @click="goDetail(item.id)"
      >
        <div class="imgBox">
          <img :src="item.coverimgurl" alt />
        </div>
        <div class="summary ellipsis-2">
          <p class="name">{{item.title}}</p>
          <WxPares :content="item.introduction" />
        </div>
        <div class="needBtn">
          <p>需报名</p>
        </div>        
      </div>
    </div>
    <FixedMenu></FixedMenu>
  </div>
</template>

<script>
import TopBananer from '../../components/TopBananer'
import FixedMenu from '../../components/FixedMenu'
import WxPares from 'mpvue-wxparse'
import { humanListData, adListData, litetypeData } from '@/utils/api'
export default {
  components: {
    TopBananer,
    WxPares,
    FixedMenu
  },
  data () {
    return {
      topImgUrl: [],
      navNum: 0,
      navTabList: null,
      data_projectData: [],
      chuangye_projectData: []
    }
  },
  mounted () {
    this.navTabList = wx.getStorageSync('typeList-activity');
    this.getDataList();
  },
  onShow () {
    // this.navNum = 0;
    // this.getDataList();
  },
  methods: {
    // 每日活动 5 
    getDataList () {
      this.$http.get({
        url: 'effect/activitys/5'
      }).then(res => {
        this.data_projectData = res;
        console.log('每日活动数据--',res)
      });
      // 创业专场 6 
      this.$http.get({
        url: 'effect/activitys/6'
      }).then(res => {
        this.chuangye_projectData = res
        console.log('创业专场数据--',res)
      });
      // 广告位
      this.$http.get({
        url: 'effect/ad/4'
      }).then(res => {
        if (res.length == 0) {
          return
        } else {
          this.topImgUrl = res;
        }
      });
    },
    goDetail (aid) {
      wx.navigateTo({
        url: `/pages/activityDetail/main?id=${aid}&isShare=${aid}`
      })
    },
    selectNav (ind) {
      this.navNum = ind;
    }
  }
}
</script>

<style scoped lang="less">
.container {
  .tabBox {
    display: flex;
    direction: row;
    justify-content: space-around;
    border-bottom: 1px solid #e1e1e1;
    p {
      font-size: 32rpx;
      color: #666;
      &.active {
        color: #000;
        font-weight: 600;
        padding-bottom: 3px;
        border-bottom: 3px solid #069979;
      }
    }
  }
  .projectList {
    display: flex;
    flex-direction: column;
    padding: 10px;
    .projectItem {
      position: relative;
      width: 100%;
      margin-bottom: 15px;
      border-radius: 6px;
      box-shadow: 0 0 4px 2px #e1e1e1;
      overflow: hidden;
      .imgBox {
        height: 150px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .summary {
        padding: 0px 10px 0px;
        width: 80%;
        height: 75px;
        p {
          color: #333;
          height: 15px;
          line-height: 15px;
          font-size: 10px;
          &.name {
            font-size: 16px;
            color: #333;
            font-weight: 600;
            height: 30px;
            line-height: 30px;
          }
        }
      }
      .needBtn {
        position: absolute;
        bottom: 15px;
        right: 15px;
        p {
          background-color: #49b69e;
          color: #f1f1f1;
          padding: 2px 8px;
          border-radius: 5px;
          font-size: 10px;
        }
      }
    }
  }
}
</style>
<style>
@import url("~mpvue-wxparse/src/wxParse.css");
.wxParse .p {
  margin: 0;
  font-size: 24rpx;
}
</style>

