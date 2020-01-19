<template>
  <div class="addressMap" :style="{marginTop: headHeight + 'px'}">
    <headView :headData="headData"></headView>
    <div class="mapContent">
      <map
        id="myMap"
        :longitude="poi.longitude"
        :latitude="poi.latitude"
        scale="15"
        :markers="markers"
        show-location
        :style="'width:100%; height:' + mapHeight + 'px;'"
      ></map>
    </div>
    <div class="goHere">
      <div class="name">{{address}}</div>
      <div class="icon" @click="gotohere">
        <img src="../../../static/images/gohere.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import headView from '@/components/headerView'
import activityCom from '@/components/activityComponents'
export default {
  data () {
    return {
      headData: {
        title: '地图',
        bgcolor: '#fff',
        showBlack: true
      },
      headHeight: '',
      mapHeight: '',
      qqmapsdk: '',
      address: '',
      poi: {
        latitude: 23.099994,
        longitude: 113.324520,
      },
      markers: [{
        iconPath: require("../../../static/images/location.png"),
        id: 0,
        latitude: 23.099994,
        longitude: 113.324520,
        width: 50,
        height: 50,
        title: '南京市鼓楼区下关区中山北路282-3(中海凯旋酒店)'
      }]
    }
  },
  components: {
    headView,
    activityCom
  },
  onLoad (options) {
    this.headHeight = this.$store.state.navHeight + 46;
    this.mapHeight = wx.getSystemInfoSync().windowHeight - 46 - this.$store.state.navHeight;
    var QQMapWX = require('../../../static/js/qqmap-wx-jssdk1.2/qqmap-wx-jssdk')
    this.qqmapsdk = new QQMapWX({
      key: 'FF5BZ-PETCI-NR6GF-53IFQ-WFCU3-36BNQ'
    })
    this.address = options.address
    console.log('address--',options.address)
    this.getLocationLL(options.address)
  },
  methods: {
    getLocationLL (searchAddress) {
      var _this = this;
      //调用地址解析接口
      _this.qqmapsdk.geocoder({
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
          _this.poi = { //根据自己data数据设置相应的地图中心坐标变量名称
            latitude: latitude,
            longitude: longitude
          }
        },
        fail: function (error) {
          console.error('fail--', error);
        },
        complete: function (res) {
          console.log('complete--', res);
        }
      })
    },
    gotohere () {
      var _this = this;
      wx.getLocation({//获取当前经纬度
        type: 'wgs84', 
        success: function (res) {
          console.log('111111',res)
          wx.openLocation({//​使用微信内置地图查看位置。
            latitude: _this.poi.latitude,//要去的纬度-地址
            longitude: _this.poi.longitude,//要去的经度-地址
            name: _this.address,
            address: _this.address
          })
        }
      })
    }
  }
}
</script>
  
<style lang="less" scoped>
.addressMap{
  .goHere{
    position: fixed;
    bottom: 0;
    box-sizing: border-box;
    height: 100px;
    background-color: #fff;
    color: #000;
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .name{
      width: 70%;
    }
    .icon{
      width: 61px;
      height: 61px;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
