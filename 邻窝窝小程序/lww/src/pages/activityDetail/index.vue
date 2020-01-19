<template>
  <div class="activityDetail">
    <!-- 轮播 -->
    <div class="carrousel">
      <swiper
        :indicator-dots="indicatorDots"
        :autoplay="autoplay"
        :interval="interval"
        :duration="duration"
        circular
        class="swiper-box"
        @change="swiperChange"
      >
        <block v-for="(item,index) in imgUrls" :key="index">
          <swiper-item>
            <img v-if="item" :src="imgUrlHttp + item" class="slide-image" mode="aspectFill" />
          </swiper-item>
        </block>
      </swiper>
      <view class="dots">
        <block v-for="(item,index) in imgUrls" :key="index">
          <view :class="index == current ? ' active' : ''" class="dot"></view>
        </block>
      </view>
    </div>
    <!-- 信息    名字价格浏览量 -->
    <div class="activityInfo">
      <h2 class="title">{{actData.title}}</h2>
      <div class="priceView">
        <p>
          <span>￥{{actData.actualPrice}}</span>起
        </p>
      </div>
    </div>
    <!-- 信息   时间地址   -->
    <div class="timeAddress">
      <div class="time">
        <i class="iconfont icon-shijian"></i>
        {{actData.actTime}}
      </div>
      <div class="address">
        <i class="iconfont icon-dizhi"></i>
        <div class="pp">{{actData.actAddress}}</div>
        <div class="navigation" @click="goMap(actData.actAddress)">
          <i class="iconfont icon-daohang"></i>导航
        </div>
      </div>
    </div>
    <!-- 活动详情 -->
    <div class="activityCon w95">
      <h2>活动详情</h2>
      <div class="content" v-if="actData.content">
        <wxParse :content="actData.content" />
      </div>
    </div>
    <hr class="line" />
    <!-- 活动须知 -->
    <div class="needNotes w95">
      <h2>活动须知</h2>      
      <div class="content" v-if="actData.notice">
        <wxParse :content="actData.notice" />
      </div>
    </div>
    <div class="bottomBox">
      <div class="item" @click="collectFun(actData)">
        <i class="iconfont" :class="isCollect?'icon-shoucang2':'icon-shoucang'"></i>
        <p>收藏</p>
      </div>
      <button class="item" open-type="share">
        <i class="iconfont icon-fenxiang"></i>
        <p>分享</p>
      </button>
      <div class="item" @click="callPhone('15612341234')">
        <i class="iconfont icon-kefu"></i>
        <p>客服</p>
      </div>
      <div class="item" @click="goSignUp(actData)">报名</div>
    </div>
  </div>
</template>

<script>
import wxParse from 'mpvue-wxparse'
import globalStore from '@/utils/store'
import { getActivityDetail, addCollect, isCollect, delCollect } from '@/api/activity'
export default {
  components: {
    wxParse
  },
  data () {
    return {
      imgUrlHttp: globalStore.state.imgUrlHttp,
      isCollect: false, //是否收藏
      actData: '',
      qqmapsdk: '',
      poi: {
        latitude: 23.099994,  //默认随机给定值
        longitude: 113.324520,
      },
      markers: [{
        iconPath: require("../../../static/images/location.png"),
        id: 0,
        latitude: 23.099994,
        longitude: 113.324520,
        width: 50,
        height: 50,
        title: '南京市秦淮区扇骨里营路88号'
      }],
      imgUrls: [],
      indicatorDots: false,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      current: 0,
    }
  },
  onLoad (options) {
    var QQMapWX = require('../../../static/js/qqmap-wx-jssdk1.2/qqmap-wx-jssdk')
    this.qqmapsdk = new QQMapWX({
      key: 'FF5BZ-PETCI-NR6GF-53IFQ-WFCU3-36BNQ'
    })
    if (options.activity_id) {
      this.fetchActivityDetail(options.activity_id)
      let data = {
        objectId: options.activity_id,
        type: 2
      }
      this.isCollectFun(data)
    }

  },
  methods: {
    async fetchActivityDetail (id) {
      this.imgUrls = []  //初始化
      let activityDetail = await getActivityDetail(id)
      console.log('活动详情----', activityDetail)
      if (activityDetail.status == 200) {
        this.actData = activityDetail.result
        this.imgUrls = activityDetail.result.cover.split(';')
      }
    },
    async isCollectFun (data) {
      let isCol = await isCollect(data)
      if (isCol.status == 200) {
        this.isCollect = isCol.result
      }
    },
    swiperChange: function (e) {
      this.current = e.mp.detail.current
    },
    goSignUp (actData) {
      wx.navigateTo({
        url: `/pages/signUp/main?activityId=${actData.id}`
      })
    },
    // 根据地址获取经纬度
    async getLocationLL (searchAddress) {
      var _this = this;
      //调用地址解析接口
      await _this.qqmapsdk.geocoder({
        //获取表单传入地址
        address: searchAddress, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
        success: function (res) {//成功后的回调
          console.log('success--', res);
          var latitude = res.result.location.lat;
          var longitude = res.result.location.lng;
          //根据地址解析在地图上标记解析地址位置
          // 获取返回结果，放到markers及poi中，并在地图展示
          _this.markers = [{
            latitude: latitude,
            longitude: longitude,
            title: searchAddress
          }];
          wx.getLocation({//获取当前经纬度
            type: 'wgs84',
            success: function (res) {
              wx.openLocation({//​使用微信内置地图查看位置。
                latitude: latitude,//要去的纬度-地址
                longitude: longitude,//要去的经度-地址
                name: searchAddress,
                address: searchAddress
              })
            }
          })
        }
      })
    },
    goMap (address) {
      var _this = this;
      _this.getLocationLL(address);
    },
    callPhone (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    },
    async addCollectFun (data) {
      let result = await addCollect(data)
      if (result.status == 200) {
        this.isCollect = true
        wx.showToast({
          title: '收藏成功',
          icon: 'none',
          duration: 2000
        })
      }
    },
    async delCollectFun (data) {
      let result = await delCollect(data)
      if (result.status == 200) {
        this.isCollect = false
        wx.showToast({
          title: '取消收藏',
          icon: 'none',
          duration: 2000
        })
      }
    },
    // 收藏
    collectFun (actData) {
      let data = {
        objectId: actData.id,
        type: 2
      }
      if (this.isCollect) {
        this.delCollectFun(data)
      } else {
        this.addCollectFun(data)
      }
    }
  },
  //转发 分享
  onShareAppMessage (res) {
    if (res.from === 'button') {
      console.log('button')
    }
    return {
      title: this.actData,
      path: `/pages/activityDetail/main?activity_id=${this.actData.id}`,
      success: function (res) {
        console.log('成功', res)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
.activityDetail {
  padding-bottom: 70px;
  // 轮播
  .carrousel {
    height: 225px;
    position: relative;
    .swiper-box {
      width: 100%;
      height: 100%;
      overflow: hidden;
      .slide-image {
        width: 100%;
        height: 100%;
      }
    }
    .dots {
      position: absolute;
      right: 15px;
      bottom: 25px;
      display: flex;
      justify-content: center;
      .dot {
        margin-right: 4px;
        width: 5px;
        height: 5px;
        background: #dedede;
        border-radius: 5rpx;
        transition: all 0.6s;
        &.active {
          width: 25px;
          background: #fe3b30;
        }
      }
    }
  }
  //.activityInfo
  .activityInfo {
    background-color: #fff;
    padding: 15px 10px 0;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    position: relative;
    margin-top: -15px;
    text-align: justify;
    .title {
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
    }
    .priceView {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      line-height: 40px;
      p {
        font-size: 12px;
        color: #999;
        span {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-right: 10px;
        }
      }
    }
  }
  .timeAddress {
    border-top: 5px solid #f1f1f1;
    border-bottom: 5px solid #f1f1f1;
    padding: 10px;
    .time {
      font-size: 15px;
      line-height: 40px;
      i {
        margin-top: -2px;
        margin-right: 10px;
      }
    }
    .address {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      i {
        margin-right: 10px;
        font-size: 15px;
      }
      .pp {
        flex: 1;
        font-size: 14px;
        line-height: 16px;
        vertical-align: middle;
      }
      .navigation {
        font-size: 12px;
        color: #666;
        i {
          margin-right: 0;
          font-size: 14px;
        }
      }
    }
  }
  // 活动详情
  .activityCon {
    h2 {
      font-size: 15px;
      font-weight: 600;
      line-height: 36px;
    }
    .content {
      color: #333;
    }
  }
  .line {
    border-bottom: 5px solid #f1f1f1;
    margin: 20px 0 10px;
  }
  // 活动须知
  .needNotes {
    h2 {
      font-size: 14px;
      font-weight: 600;
      line-height: 36px;
    }
    .content {
      p {
        font-size: 14px;
        line-height: 30px;
        i {
          font-size: 12px;
          margin-right: 5px;
        }
      }
    }
  }
  .bottomBox {
    position: fixed;
    bottom: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #fff;
    height: 60px;
    width: 100%;
    text-align: center;
    box-shadow: 0 -2px 5px 0 #eee;
    box-sizing: border-box;
    button {
      background: transparent;
      padding: 0;
      margin: 0;
      line-height: 20px;
      &::after {
        border: none;
      }
      i {
        font-size: 20px;
      }
    }
    .item {
      width: 30%;
      padding-top: 10px;
      &:last-child {
        padding-top: 0px;
        width: 40%;
        background: #ff3b30;
        color: #fff;
        font-size: 18px;
        line-height: 60px;
        letter-spacing: 2px;
      }
      i {
        font-size: 20px;
      }
      p {
        font-size: 12px;
        color: #000;
      }
    }
  }
}
</style>

