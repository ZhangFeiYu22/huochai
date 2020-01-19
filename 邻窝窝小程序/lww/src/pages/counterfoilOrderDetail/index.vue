<template>
  <div class="counterfoil">
    <div class="content">
      <div class="head">
        <p class="p1" v-if="orderDetail.totalPrice == 0">免费票</p>
        <p class="p1" v-else>付费票</p>
        <p class="p2">
          <span class="has">有效</span>
        </p>
        <p class="p3">￥{{orderDetail.totalPrice}}</p>
      </div>
      <div class="otherInfo">
        <div class="item" @click="goActivityDetail(orderDetail.activityId)">
          <p>活动</p>
          <p class="ellipsis-1">{{orderDetail.title}}</p>
          <p>
            <i class="rrr"></i>
          </p>
        </div>
        <div class="item">
          <p>时间</p>
          <p class="ellipsis-1">{{orderDetail.actTime}}</p>
          <p></p>
        </div>
        <div class="item">
          <p>地点</p>
          <p class="ellipsis-1">{{orderDetail.actAddress}}</p>
          <p @click="goMap(orderDetail.actAddress)">
            <i class="iconfont icon-daohang"></i>导航
          </p>
        </div>
      </div>
      <div class="centerCode">
        <div class="ercodeImg">
          <img src="../../../static/images/code.png" mode="aspectFill" />
          <p class="code">{{orderDetail.code}}</p>
        </div>
        <p class="codep1">参加活动时候请主动出示该二维码</p>
        <p class="codep2">为保护您的合法权益，在未实际参与</p>
        <p class="codep3">活动之前请不要随意分享该页面給任何人</p>
      </div>
      <div class="lineItem lineb">
        <p class="left">订单编号:</p>
        <p class="right">{{orderDetail.orderNo}}</p>
      </div>
      <div class="lineItem lineb">
        <p class="left">联系人:</p>
        <p class="right">{{nickName}}</p>
      </div>
      <div class="lineItem">
        <p class="left">联系电话:</p>
        <p class="right">{{orderDetail.contactPhone}}</p>
      </div>
    </div>
    <div class="butS w95">
      <p @click="returnActivity">返回首页</p>
      <!-- <p>邀请好友参加</p> -->
    </div>
  </div>
</template>

<script>
import { activityOrderDetail } from '@/api/activity'
export default {
  data () {
    return {
      qqmapsdk: '',
      orderDetail: '',
      nickName: '',  //联系人
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
      }]
    }
  },
  onLoad (options) {
    var QQMapWX = require('../../../static/js/qqmap-wx-jssdk1.2/qqmap-wx-jssdk')
    this.qqmapsdk = new QQMapWX({
      key: 'FF5BZ-PETCI-NR6GF-53IFQ-WFCU3-36BNQ'
    })
    if (options.orderNo) {
      this.fetchOrderDetail(options.orderNo)
    }
    if (wx.getStorageSync('userInfoAll')) {
      let userInfoAll = wx.getStorageSync('userInfoAll')
      let rawData = JSON.parse(userInfoAll.rawData)
      this.nickName = rawData.nickName
    }
  },
  methods: {
    async fetchOrderDetail (id) {
      let data = await activityOrderDetail(id)
      console.log('订单详情---', data)
      if (data.status == 200) {
        this.orderDetail = data.result
      }
    },
    async getLocationLL (searchAddress) {
      var _this = this;
      //调用地址解析接口
      await _this.qqmapsdk.geocoder({
        //获取表单传入地址
        address: searchAddress, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
        success: function (res) {//成功后的回调
          console.log('success--', res);
          var res = res.result;
          var latitude = res.location.lat;
          var longitude = res.location.lng;
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
        },
        fail: function (error) {
          console.error('fail--', error);
        },
        complete: function (res) {
          console.log('complete--', res);
        }
      })
    },
    goMap (address) {
      var _this = this;
      _this.getLocationLL(address);
    },
    goActivityDetail (id) {
      wx.navigateTo({
        url: `/pages/activityDetail/main?activity_id=${id}`
      })
    },
    returnActivity () {
      wx.switchTab({
        url: '/pages/activity/main'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.counterfoil {
  .content {
    width: 95%;
    margin: 10px auto;
    box-shadow: 0 0 5px 0 #ddd;
    padding: 10px;
    border-radius: 8px;
    .head {
      display: flex;
      justify-content: space-between;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #f1f1f1;
      p {
        display: inline-block;
      }
      .p1 {
        font-size: 16px;
        font-weight: 600;
      }
      .p2 {
        flex-grow: 1;
        text-align: right;
        margin-top: -2px;
        span {
          display: inline-block;
          font-size: 10px;
          border: 1px solid #585858;
          width: 40px;
          height: 14px;
          line-height: 14px;
          text-align: center;
          &.no {
            border-color: #585858;
            color: #585858;
          }
          &.has {
            border-color: #1ebc21;
            color: #1ebc21;
          }
        }
      }
      .p3 {
        font-size: 16px;
        font-weight: 600;
        margin-left: 10px;
      }
    }
    .otherInfo {
      .item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        p {
          padding: 10px 0;
          line-height: 20px;
          &:nth-child(1) {
            min-width: 40px;
            margin-right: 10px;
            position: relative;
            font-size: 13px;
            font-weight: 600;
            &::after {
              display: block;
              content: "";
              border-right: 1px solid #707070;
              height: 6px;
              position: absolute;
              right: 0;
              top: 17px;
            }
          }
          &:nth-child(2) {
            flex-grow: 1;
            font-size: 13px;
          }
          &:nth-child(3) {
            margin-left: 20px;
            position: relative;
            font-size: 12px;
            min-width: 45px;
            text-align: right;
            .rrr {
              position: absolute;
              right: 0;
              top: 50%;
              width: 7px;
              height: 7px;
              border-right: 1px solid #707070;
              border-bottom: 1px solid #707070;
              transform: rotate(-45deg) translateY(-70%);
            }
          }
        }
      }
    }
    .centerCode {
      text-align: center;
      border-top: 1px solid #f1f1f1;
      border-bottom: 1px solid #f1f1f1;
      padding: 30px 0 30px;
      .ercodeImg {
        display: inline-block;
        width: 244px;
        height: 80px;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        .code {
          position: absolute;
          font-size: 22px;
          right: 8%;
          top: 25%;
          color: #fff;
          letter-spacing: 4px;
        }
      }
      .codep1 {
        font-size: 14px;
        color: #000;
        font-weight: 600;
        line-height: 20px;
      }
      .codep2,
      .codep3 {
        font-size: 10px;
        color: #999;
      }
    }
    .lineItem {
      display: flex;
      justify-content: space-between;
      line-height: 40px;
      font-size: 15px;
      &.lineb {
        border-bottom: 1px solid #f1f1f1;
      }
      .left {
        color: #000;
      }
      .right {
        color: #999;
      }
    }
  }
  // .butS {
  //   display: flex;
  //   justify-content: space-between;
    
  //   p {
  //     width: 47.5%;
  //     background-color: #f66926;
  //     color: #fff;
  //     height: 42px;
  //     line-height: 42px;
  //     border-radius: 5px;
  //     text-align: center;
  //   }
  // }
  .butS {
    width: 95%;
    margin: 20px auto;
    p {
      width: 100%;
      background-color: #f66926;
      color: #fff;
      height: 42px;
      line-height: 42px;
      border-radius: 5px;
      text-align: center;
    }
  }
}
</style>