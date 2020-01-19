<template>
  <div class="choiceTab">
    <!-- 搜索 -->
    <div class="searchBox" @click="goSearchPage">
      <div class="search">
        <i class="iconfont searchIcon icon-search"></i>
        <input type="text" placeholder="搜索活动、团购名称" />
      </div>
    </div>
    <!-- 分类栏 -->
    <div class="typeContent">
      <div class="typeList">
        <div
          class="typeItem"
          :class="typeItemNum == index ? 'active' : ''"
          v-for="(item,index) in todayPinMenuList"
          :key="item.id"
          @click="couponToggle(index,item.id)"
        >{{item.name}}</div>
      </div>
      <div class="carrousel w94">
        <swiper
          :indicator-dots="indicatorDots"
          :autoplay="autoplay"
          :interval="interval"
          :duration="duration"
          circular
          class="swiper-box"
          @change="swiperChange"
          v-if="adPosition7.length != 0"
        >
          <block v-for="(item,index) in adPosition7" :key="index">
            <swiper-item>
              <image :src="imgUrlHttp + item.mediaUrl" class="slide-image" mode="aspectFill" />
            </swiper-item>
          </block>
        </swiper>
        <img v-else class="default-image" src="/static/images/default_ad.jpg" mode="aspectFill" />
        <view class="dots">
          <block v-for="(item,index) in adPosition7" :key="index">
            <view :class="index == current ? ' active' : ''" class="dot"></view>
          </block>
        </view>
      </div>

      <div v-if="modulePinTuanList.length==0">
        <Nodata :text="'暂无你要的数据'"></Nodata>
      </div>
      <div v-else>
        <div v-for="item in modulePinTuanList" :key="item.id">
          <div class="voucherCSS" @click="goChoicenessPage(item.id)">
            <div class="choiceImg" v-if="item.coverOne">
              <img :src="imgUrlHttp + item.coverOne" mode="aspectFill" />
            </div>
            <div class="choiceContent">
              <div class="c1">
                <p class="title ellipsis-1">{{item.name}}</p>
              </div>
              <div class="c2 ellipsis-1">{{item.subName}}</div>
              <button class="grabNow">马上抢</button>
              <div class="c3">
                <p>
                  <span class="now">￥{{item.actualPrice}}</span>
                  <span class="old">￥{{item.showPrice}}</span>
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
import globalStore from '@/utils/store'
import Nodata from '../../components/Nodata'
import { getVoucherTypeList, getAdvPosition } from '@/api/choiceTab'
export default {
  components: {
    Nodata
  },
  data () {
    return {
      imgUrlHttp: globalStore.state.imgUrlHttp,
      globalMerchantId: '',   //  存储判断社区变化
      tabActiveNum: 0,
      adPosition7: [],
      indicatorDots: false,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      current: 0,
      typeItemNum: 0,
      todayPinMenuList: [
        { id: 1, name: '精选' },
        { id: 2, name: '美食' },
        { id: 3, name: '生活' },
        { id: 4, name: '健康' }
      ],
      modulePinTuanList: [],
    }
  },
  mounted () {
    this.globalMerchantId = globalStore.state.globalMerchantId;
    this.fetchAdvPosition(7)
    this.couponToggle(0, 1);  //激活第一个
  },
  onShow () {
    if (this.globalMerchantId !== globalStore.state.globalMerchantId) {
      this.globalMerchantId = globalStore.state.globalMerchantId;
      console.log('社区有变化')
      this.fetchAdvPosition(7)
      this.couponToggle(0, 1);  //激活第一个
    }
  },
  methods: {
    async fetchAdvPosition (position) {
      let data = {
        position: position,
        cid: globalStore.state.globalMerchantId
      }
      let adv = await getAdvPosition(data)
      if (adv.status == 200) {
        this.adPosition7 = adv.result
      }
    },
    // 今日精选点击切换
    couponToggle (index, id) {
      this.typeItemNum = index;
      let data = {
        id: id,
        cid: globalStore.state.globalMerchantId
      }
      getVoucherTypeList(data).then(res => {
        if (res.status == 200) {
          this.modulePinTuanList = res.result
        }
      })
    },
    swiperChange: function (e) {
      this.current = e.mp.detail.current
    },
    goSearchPage () {
      wx.navigateTo({
        url: '/pages/search/main'
      })
    },
    goChoicenessPage(id){
      if (wx.getStorageSync('isLogin')) {
        wx.navigateTo({
          url: `/pages/cashCoupon/main?choice_id=${id}`
        })
      } else {
        wx.showToast({
          title: '您还未登录,请先登录',
          duration: 2000,
          icon: 'none',
          success: function () {
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/login/main'
              })
            }, 2000)
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.choiceTab {
  height: 30px;
  line-height: 30px;
  // 搜索
  .searchBox {
    width: 55%;
    margin: 10px auto;
    position: relative;
    .search {
      width: 100%;
      input {
        background-color: #f3f3f3;
        height: 30px;
        line-height: 30px;
        padding: 0 5px 0 35px;
        font-size: 14px;
        border-radius: 30px;
      }
      .searchIcon {
        position: absolute;
        left: 12px;
        font-size: 14px;
        color: #999;
      }
    }
  }
  .typeContent {
    .typeList {
      height: 40px;
      line-height: 40px;
      border-top: 1px solid #f6f6f6;
      border-bottom: 1px solid #f6f6f6;
      display: flex;
      justify-content: space-around;
      .typeItem {
        padding: 0 5px;
        &.active {
          font-weight: 600;
          border-bottom: 3px solid #666;
        }
      }
    }
    // 轮播
    .carrousel {
      height: 112px;
      margin: 15px auto 25px;
      position: relative;
      .swiper-box {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        overflow: hidden;
        .slide-image {
          width: 100%;
          height: 100%;
        }
      }
      .default-image {
        width: 100%;
        height: 100%;
      }
      .dots {
        position: absolute;
        right: 0;
        left: 0;
        bottom: -10px;
        display: flex;
        justify-content: center;
        .dot {
          margin: 0 4px;
          width: 5px;
          height: 5px;
          background: #dedede;
          border-radius: 5rpx;
          transition: all 0.6s;
          &.active {
            width: 11px;
            background: #fe3b30;
          }
        }
      }
    }
  }
}
</style>
