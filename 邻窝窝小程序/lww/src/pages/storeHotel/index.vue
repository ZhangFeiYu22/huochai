<template>
  <div class="storeHotel">
    <div class="storeTop w94">
      <div class="storeImg">
        <image v-if="sellerData.cover" :src="imgUrlHttp + sellerData.cover" mode="aspectFill" />
        <image v-else src="/static/images/default_ad.jpg" mode="aspectFill" />
      </div>
      <div class="storeInfo">
        <p class="title">{{sellerData.name}}</p>
        <p class="p2">
          <span class="startBox" v-for="i of 5" :key="i">
            <i
              class="iconfont"
              :class=" i < sellerData.score ? 'icon-xingxing-shi' : 'icon-xingxing-kong'"
            ></i>
          </span>
          <span class="scoreNum">{{sellerData.score}}分</span>
        </p>
        <p class="p3">
          人均￥
          <span>{{sellerData.perCapita}}</span>/人
        </p>
        <p class="p4">{{sellerData.classId}}</p>
      </div>
    </div>
    <div class="lineBox w94">
      <p class="left">{{sellerData.introduction}}</p>
    </div>
    <div class="lineBox w94">
      <p class="left">
        <i class="iconfont icon-shijian"></i>
        营业时间: {{sellerData.openHours}}
      </p>
      <p class="right phone" @click.stop="callPhone(sellerData.phone)">
        <i class="iconfont icon-dianhua-1"></i>
      </p>
    </div>
    <div class="lineBox w94">
      <p class="left">
        <i class="iconfont icon-dizhi"></i>
        {{sellerData.address}}
      </p>
      <p class="right" @click="goMap(sellerData.address)">
        <i class="iconfont icon-daohang"></i>导航
      </p>
    </div>
    <div class="storeBottom mt10">
      <h2>门店优惠</h2>
      <div v-for="item in voucherData" :key="item.id">
        <ModuleChoiceness :Choiceness="item"></ModuleChoiceness>
      </div>
    </div>
  </div>
</template>

<script>
import globalStore from '@/utils/store'
import ModuleChoiceness from '../../components/Choiceness'
import { getMerchantDetail, getMerchantVoucher } from '@/api/choiceTab'
export default {
  components: {
    ModuleChoiceness
  },
  data () {
    return {
      imgUrlHttp: globalStore.state.imgUrlHttp,
      sellerData: '',
      voucherData: [],
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
        title: '南京市浦口区浦外路苏尚生活广场'
      }]
    }
  },
  onLoad (options) {
    this.sellerData = ''
    this.voucherData = []
    var QQMapWX = require('../../../static/js/qqmap-wx-jssdk1.2/qqmap-wx-jssdk')
    this.qqmapsdk = new QQMapWX({
      key: 'FF5BZ-PETCI-NR6GF-53IFQ-WFCU3-36BNQ'
    })
    // 传过来的店家 id
    if (options.merchantId) {
      this.fetchMerchantDetail(options.merchantId)
      this.fetchMerchantVoucher(options.merchantId)
    }
  },
  methods: {
    // 获取商家详情
    async fetchMerchantDetail (id) {
      let merchant = await getMerchantDetail(id)
      if (merchant.status == 200) {
        this.sellerData = merchant.result
        console.log('----sellerData---', this.sellerData)
      }
    },
    // 获取商家下面的门店优惠代金券推荐
    async fetchMerchantVoucher (id) {
      let merchant = await getMerchantVoucher(id)
      if (merchant.status == 200) {
        this.voucherData = merchant.result
        console.log('----voucherData---', this.voucherData)
      }
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
    goChoicenessPage (id) {
      wx.navigateTo({
        url: `/pages/cashCoupon/main?choice_id=${id}`
      })

    }
  }
}
</script>

<style lang="less" scoped>
.storeHotel {
  .storeTop {
    padding: 10px 0;
    display: flex;
    .storeImg {
      width: 108px;
      height: 108px;
      margin-right: 10px;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .storeInfo {
      flex-grow: 1;
      font-size: 13px;
      .title {
        font-size: 18px;
        font-weight: 600;
        line-height: 20px;
        margin-bottom: 10px;
      }
      .p2 {
        margin: 10px 0;
        .startBox {
          i {
            color: #ff8737;
            font-size: 20px;
          }
        }
        .scoreNum {
          font-size: 14px;
          vertical-align: middle;
          margin-left: 5px;
        }
      }
      .p3 {
        color: #999;
        line-height: 20px;
      }
      .p4 {
        line-height: 30px;
      }
    }
  }
  .lineBox {
    display: flex;
    border-top: 1px solid #f6f6f6;
    line-height: 45px;
    font-size: 15px;
    justify-content: space-between;
    .left {
      i {
        margin-right: 5px;
        font-size: 12px;
      }
    }
    .right {
      i {
        font-size: 14px;
        margin-right: 2px;
      }
      &.phone {
        position: relative;
        .icon-dianhua-1 {
          color: #ff8737;
          font-size: 16px;
        }
        &::before {
          display: block;
          content: "";
          height: 17px;
          border-left: 1px solid #ccc;
          position: absolute;
          left: -15px;
          top: 16px;
        }
      }
    }
  }
  .storeBottom {
    h2 {
      margin-left: 3%;
      font-size: 18px;
      line-height: 40px;
    }
  }
}
</style>
