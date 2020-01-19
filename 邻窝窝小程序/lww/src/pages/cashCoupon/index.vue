<template>
  <div class="cashCoupon">
    <div class="top">
      <h3 class="title">{{voucherData.name}}</h3>
      <div class="titleBottom">
        <!-- <p class="flag">{{voucherData.useLimit}}</p> -->
        <wxParse :content="voucherData.useLimit" />
      </div>
      <view class="cashCouponImgBox">
        <swiper
          class="cashSwiper"
          circular
          :autoplay="autoplay"
          :interval="interval"
          :duration="duration"
          v-if="imgShowList.length != 0"
        >
          <block v-for="(item,index) in imgShowList" :key="index">
            <swiper-item>
              <div class="cashCouponImg">
                <img :src="imgUrlHttp + item" mode="aspectFill" />
              </div>
            </swiper-item>
          </block>
        </swiper>
        <img v-else class="default-image" src="/static/images/default_ad.jpg" mode="aspectFill" />
      </view>
      <!-- 内容 -->
      <div class="containList" v-if="voucherData.content">
        <wxParse :content="voucherData.content" />
      </div>
      <!-- 券使用规则 -->
      <div class="cashCouponMark mt10" v-if="voucherData.notice">
        <wxParse :content="voucherData.notice" />
      </div>
      <!-- 门店介绍 -->
      <div class="storeIntroduction">
        <h2>门店介绍</h2>
        <div class="inContent" @click="goStorePage(voucherData.merchantId)">
          <div class="storeLogo">
            <div class="imgBox">
              <img v-if="sellerData.cover" :src="imgUrlHttp + sellerData.cover" mode="aspectFill" />
              <img v-else src="/static/images/default_ad.jpg" mode="aspectFill" />
            </div>
          </div>
          <div class="storeNA">
            <p class="storeName">{{sellerData.name}}</p>
            <p class="phone" @click.stop="callPhone(sellerData.phone)">
              <i class="iconfont icon-dianhua-1"></i>
            </p>
            <hr class="line" />
            <p class="storeAddress">
              <i class="iconfont icon-dizhi"></i>
              {{sellerData.address}}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 精彩推荐 -->
    <div class="wonderfulRecommendation">
      <h2>精彩推荐</h2>
      <div v-for="item in voucherReList" :key="item.id">
        <ModuleChoiceness :Choiceness="item"></ModuleChoiceness>
      </div>
    </div>
    <!-- 底部 -->
    <div class="fixFoot">
      <div class="fLeft">
        <p class="pt">￥{{voucherData.actualPrice}}</p>
        <p class="pb">最高门市价￥{{voucherData.showPrice}}</p>
        <p class="star" @click="collectFun(voucherData)">
          <i class="iconfont" :class="isCollect?'icon-shoucang2':'icon-shoucang'"></i>
          <span>收藏</span>
        </p>
      </div>
      <div class="fRight" @click="goSureOrderPage">立即抢购</div>
    </div>
  </div>
</template>

<script>
import wxParse from 'mpvue-wxparse'
import globalStore from '@/utils/store'
import ModuleChoiceness from '../../components/Choiceness'
import { getChoiceDetail, getMerchantDetail, getVoucherRecommend } from '@/api/choiceTab'
import { addCollect, isCollect, delCollect } from '@/api/activity'
export default {
  components: {
    ModuleChoiceness, wxParse
  },
  data () {
    return {
      imgUrlHttp: globalStore.state.imgUrlHttp,
      isCollect: false, //是否收藏
      voucherData: '',   //代金券信息
      imgShowList: [],
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 500,
      sellerData: '',   //店家信息
      voucherReList: [],
    }
  },
  onLoad (options) {
    if (options.choice_id) {
      this.fetchChoiceDetail(options.choice_id)
      this.fetchVoucherRecommend()
      let data = {
        objectId: options.choice_id,
        type: 1
      }
      this.isCollectFun(data)
    }
  },
  methods: {
    async fetchChoiceDetail (id) {
      let voucherDetail = await getChoiceDetail(id)
      if (voucherDetail.status == 200) {
        this.voucherData = voucherDetail.result
        if (voucherDetail.result.coverOne) {
          this.imgShowList.push(voucherDetail.result.coverOne)
        }
        if (voucherDetail.result.coverTwo) {
          this.imgShowList.push(voucherDetail.result.coverTwo)
        }
        if (voucherDetail.result.coverThree) {
          this.imgShowList.push(voucherDetail.result.coverThree)
        }
        if (voucherDetail.result.coverFour) {
          this.imgShowList.push(voucherDetail.result.coverFour)
        }
        this.fetchMerchantDetail(voucherDetail.result.merchantId)
      }
    },
    // 获取商家详情
    async fetchMerchantDetail (id) {
      let merchant = await getMerchantDetail(id)
      if (merchant.status == 200) {
        this.sellerData = merchant.result
      }
    },
    // 获取推荐
    async fetchVoucherRecommend () {
      let voucherRecommend = await getVoucherRecommend();
      //  1为活动推荐(搜索位置) 5为精选推荐(搜索位置)  2为我的推荐  3为代金券推荐  4为代金券套餐推荐
      if (voucherRecommend.status == 200) {
        let newArr = []
        let arr = voucherRecommend.result.data
        let j = 0;
        for (let i in arr) {
          if (arr[i].position == 3) {
            let data = await getChoiceDetail(arr[i].useId)
            newArr.push(data.result)
          }
        }
        this.voucherReList = newArr
      }

    },
    goSureOrderPage () {
      wx.navigateTo({
        url: `/pages/sureCoupon/main?voucherId=${this.voucherData.id}`
      })
    },
    goStorePage (mid) {
      wx.navigateTo({
        url: `/pages/storeHotel/main?merchantId=${mid}`
      })
    },
    callPhone (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    },
    async isCollectFun (data) {
      let result = await isCollect(data)
      if (result.result) {
        this.isCollect = true
      }
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
    collectFun (vouData) {
      let data = {
        objectId: vouData.id,
        type: 1
      }
      if (this.isCollect) {
        this.delCollectFun(data)
      } else {
        this.addCollectFun(data)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
.cashCoupon {
  padding-bottom: 50px;
  .top {
    width: 92%;
    margin: 0 auto;
    .title {
      font-size: 18px;
      line-height: 24px;
      font-weight: 600;
    }
    .titleBottom {
      display: flex;
      justify-content: space-between;
      line-height: 17px;
      margin: 5px 0;
      .soldNum {
        font-size: 13px;
      }
    }
    .cashCouponImgBox {
      height: 180px;
      margin: 10px 0 20px;
      .cashSwiper {
        height: 180px;
        border-radius: 5px;
        overflow: hidden;
        .cashCouponImg {
          height: 180px;
          box-shadow: 0 0 5px 3px #eee;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .default-image {
        width: 100%;
        height: 100%;
      }
    }
    // 使用规则
    .cashCouponMark {
      font-size: 11px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f6f6f6;
    }
    // 门店介绍
    .storeIntroduction {
      margin-bottom: 30px;
      h2 {
        font-size: 18px;
        line-height: 50px;
      }
      .inContent {
        display: flex;
        .storeLogo {
          width: 70px;
          height: 70px;
          margin-right: 15px;
          .imgBox {
            width: 70px;
            height: 70px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .storeNA {
          flex-grow: 1;
          position: relative;
          .storeName {
            font-size: 18px;
            line-height: 20px;
          }
          .phone {
            position: absolute;
            right: 10px;
            top: 10px;
            &::before {
              display: inline-block;
              content: "";
              height: 16px;
              border-right: 1px solid #ccc;
              position: absolute;
              left: -10px;
              top: 5px;
            }
            i {
              color: #ff8737;
              font-size: 16px;
            }
          }
          .line {
            border-bottom: 2px solid #f6f6f6;
            margin: 20px 0 10px;
          }
          .storeAddress {
            position: relative;
            font-size: 12px;
            line-height: 18px;
            color: #666;
            i {
              color: #666;
              margin-right: 5px;
              font-size: 12px;
            }
            &::after {
              display: inline-block;
              content: "";
              width: 6px;
              height: 6px;
              border-right: 1px solid #666;
              border-bottom: 1px solid #666;
              transform: rotate(-45deg);
              position: absolute;
              right: 10px;
              top: 5px;
            }
          }
        }
      }
    }
  }
  // 精彩推荐
  .wonderfulRecommendation {
    h2 {
      margin-left: 4%;
      height: 32px;
    }
  }
  .fixFoot {
    height: 50px;
    width: 100%;
    position: fixed;
    bottom: 0;
    .fLeft {
      width: 57%;
      height: 50px;
      position: absolute;
      z-index: 3;
      left: 0;
      padding-left: 20px;
      background-color: #3d2e2f;
      color: #fff;
      border-top-right-radius: 5px;
      border-top-left-radius: 5px;
      border-bottom-right-radius: 5px;
      .pt {
        font-size: 20px;
        line-height: 30px;
      }
      .pb {
        font-size: 13px;
        line-height: 15px;
      }
      .star {
        position: absolute;
        right: 20px;
        top: 0;
        height: 50px;
        width: 30px;
        text-align: center;
        i {
          display: block;
          line-height: 30px;
        }
        span {
          display: block;
          line-height: 15px;
          font-size: 12px;
        }
      }
    }
    .fRight {
      width: 45%;
      position: absolute;
      z-index: 2;
      right: 0;
      background-color: #ff3b30;
      border-top-right-radius: 5px;
      color: #fff;
      font-size: 18px;
      text-align: center;
      line-height: 50px;
      letter-spacing: 2px;
    }
  }
}
</style>
