<template>
  <div class="lifeServiceContent">
    <div v-if="lifeContentList.length !== 0">
      <div class="contentList" v-for="item in lifeContentList" :key="item.id">
        <div class="leftImg">
          <img :src="imgUrlHttp + item.cover" mode="aspectFill" />
        </div>
        <div class="rightCon">
          <div class="title">{{item.name}}</div>
          <div class="price">人均: {{item.price}}元</div>
          <div class="phone" @click="callPhone(item.phone)">
            <i class="iconfont icon-dianhua-1"></i>
          </div>
          <div class="address">
            <div class="left ellipsis-1">
              <i class="iconfont icon-dizhi"></i>
              {{item.address}}
            </div>
            <div class="right" @click="goMap(item.address)">
              <i class="iconfont icon-daohang"></i>导航
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <Nodata :text="'暂无你要的数据'"></Nodata>
    </div>
  </div>
</template>

<script>
import globalStore from '@/utils/store'
import Nodata from '../../components/Nodata'
import { getLifeService } from '@/api/lifeService.js'
export default {
  components: {
    Nodata
  },
  data () {
    return {
      imgUrlHttp: globalStore.state.imgUrlHttp,
      lifeContentList: [],
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
    }
  },
  onLoad (options) {
    var QQMapWX = require('../../../static/js/qqmap-wx-jssdk1.2/qqmap-wx-jssdk')
    this.qqmapsdk = new QQMapWX({
      key: 'FF5BZ-PETCI-NR6GF-53IFQ-WFCU3-36BNQ'
    })
    wx.setNavigationBarTitle({
      title: options.classname,
    })
    if (options.classid) {
      this.fetchLifeContent(options.classid)
    }
  },
  methods: {
    fetchLifeContent (id) {
      getLifeService(id).then((res) => {
        if (res.status === 200) {
          this.lifeContentList = res.result
        }
      })
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
    callPhone (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    }
  }
}
</script>

<style lang="less" scoped>
.lifeServiceContent {
  padding: 10px;
  .contentList {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 5px solid #f1f1f1;
    margin-bottom: 10px;
    .leftImg {
      width: 90px;
      height: 90px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .rightCon {
      flex: 1;
      width: 50%;
      margin-left: 10px;
      position: relative;
      .title {
        font-size: 16px;
        font-weight: 600;
      }
      .price {
        font-size: 13px;
        line-height: 40px;
        border-bottom: 2px solid #f1f1f1;
        margin-bottom: 7px;
      }
      .phone {
        position: absolute;
        top: 30%;
        right: 10%;
        i {
          font-size: 20px;
          font-size: #000;
        }
      }
      .address {
        display: flex;
        justify-content: space-between;
        i {
          font-size: 13px;
          margin-right: 5px;
        }
        .left {
          flex: 1;
          font-size: 14px;
          color: #999;
        }
        .right {
          width: 60px;
          text-align: right;
          font-size: 15px;
          color: #00a9bc;
        }
      }
    }
  }
}
</style>
