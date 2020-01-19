<template>
  <div class="my" :style="'min-height:'+viewH">
    <headerNav></headerNav>
    <!-- 头像 电话 名字 会员  收藏-->
    <div class="headBgBox">
      <img class="imgbg" src="../../../static/images/mybgtop.png" mode="aspectFill" />
      <div class="userInfo" :style="'top:'+padTop" v-if="userLoginVal">
        <div class="headImg">
          <img :src="avatarUrl" alt />
        </div>
        <div class="namePhone">
          <p class="name">{{nickName}}</p>
          <p class="phone">{{nickPhone}}</p>
        </div>
      </div>
      <div class="userInfo" :style="'top:'+padTop" v-else>
        <div class="headImg">
          <img src="../../../static/images/signup.png" mode="aspectFill" alt />
        </div>
        <div class="namePhone namePhone_no" @click="goLogin">
          <p>用户登录</p>
        </div>
      </div>
      <!-- 会员卡  我的收藏 -->
      <div class="vip-collect">
        <div class="vip">
          <span>普通会员</span>
          <i class="iconfont icon-qr_code"></i>
        </div>
        <div class="collect" @click="goAllCollect">
          <i class="iconfont icon-llalbumdetaildiggyes"></i>
          <span>我的收藏</span>
        </div>
      </div>
      <div class="imgbgB">
        <img src="../../../static/images/bgbottom.png" mode="aspectFill" />
      </div>
    </div>
    <div :style="'height:' + navHeight2"></div>
    <!-- 我的订单 -->
    <div class="groupOrder w95 mt10">
      <h2>我的订单</h2>
      <div class="groupMenu">
        <div class="groupItem" @click="goAllCounterfoil('waitPay')">
          <div class="iconBox">
            <img src="../../../static/images/mytab1.png" mode="aspectFill" />
          </div>
          <p>待付款</p>
        </div>
        <div class="groupItem" @click="goAllCounterfoil('waitVerfy')">
          <div class="iconBox">
            <img src="../../../static/images/mytab2.png" mode="aspectFill" />
          </div>
          <p>可使用</p>
        </div>
        <div class="groupItem" @click="goAllCounterfoil('used')">
          <div class="iconBox">
            <img src="../../../static/images/mytab3.png" mode="aspectFill" />
          </div>
          <p>已完成</p>
        </div>
        <div class="groupItem" @click="goAllCounterfoil('all')">
          <div class="iconBox">
            <img src="../../../static/images/mytab4.png" mode="aspectFill" />
          </div>
          <p>全部订单</p>
        </div>
      </div>
    </div>
    <!-- 活动票根 -->
    <div class="groupOrder stub w95 mt10">
      <h2>活动票根</h2>
      <div class="groupMenu">
        <div class="groupItem" @click="goMyOrder('wait')">
          <div class="iconBox">
            <img src="../../../static/images/mytab1.png" mode="aspectFill" />
          </div>
          <p>待付款</p>
        </div>
        <div class="groupItem" @click="goMyOrder('canUse')">
          <div class="iconBox">
            <img src="../../../static/images/mytab5.png" mode="aspectFill" />
          </div>
          <p>代验票</p>
        </div>
        <div class="groupItem" @click="goMyOrder('finish')">
          <div class="iconBox">
            <img src="../../../static/images/mytab6.png" mode="aspectFill" />
          </div>
          <p>已核销</p>
        </div>
        <div class="groupItem" @click="goMyOrder('all')">
          <div class="iconBox">
            <img src="../../../static/images/mytab7.png" mode="aspectFill" />
          </div>
          <p>全部票根</p>
        </div>
      </div>
    </div>
    <!-- 广告位2 -->
    <div class="adBox w95 mt20" v-if="ad3.length != 0">
      <img v-if="ad3[0].mediaUrl" :src="imgUrlHttp + ad3[0].mediaUrl" mode="aspectFill" />
    </div>
    <div class="adBox w95 mt20" v-else>
      <img src="/static/images/default_ad.jpg" mode="aspectFill" />
    </div>
    <!-- 猜你喜欢 -->
    <div class="guessLike">
      -
      <span>猜你喜欢</span>-
    </div>
    <div class="guessLikeContent">
      <div v-for="(item,index) in voucherReList" :key="item.id">
        <div v-if="index<4">
          <ModuleChoiceness :Choiceness="item"></ModuleChoiceness>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import globalStore from '@/utils/store'
import headerNav from '../../components/NavigationBar/NavigationBar'
import ModuleChoiceness from '../../components/Choiceness'
import { getUserInfo, getRecommend, getVoucherDetail, getAdvPosition } from '@/api/login'
export default {
  components: {
    headerNav,
    ModuleChoiceness
  },
  data () {
    return {
      imgUrlHttp: globalStore.state.imgUrlHttp,
      globalMerchantId: '',   //  存储判断社区变化
      userLoginVal: false,
      avatarUrl: '',
      nickName: '',  //用户名称
      nickPhone: '',  // 用户号码
      navHeight: 200 - wx.getStorageSync('navHeight') + 'px',
      navHeight2: 214 - wx.getStorageSync('navHeight') + 'px',  //我的订单距离顶部距离
      padTop: wx.getStorageSync('navHeight') + 'px',
      viewH: wx.getStorageSync('windowHeight') + 'px',
      voucherReList: [],
      ad3: '',
      modulePinTuanList: [
        {
          id: 1,
          url: require('../../../static/images/aaa2.png'),
          title: '中秋节浓情中秋美味月饼食品散装套盒精品包装中秋节礼',
          peopleNeed: 3,
          oldPrice: 198.0,
          nowPrice: 99.0
        },
        {
          id: 2,
          url: require('../../../static/images/aaa2.png'),
          title: '中秋节浓情中秋美味月饼食品散装套盒精品包装中秋节礼',
          peopleNeed: 5,
          oldPrice: 256.0,
          nowPrice: 112.0
        }
      ]
    }
  },
  onLoad () {
    this.globalMerchantId = globalStore.state.globalMerchantId;
    this.getSettingFun()
    this.fetchAdvPosition(3)
    // 用户是否登录
    this.userLoginVal = wx.getStorageSync('isLogin')
    if (this.userLoginVal) {
      this.fetchRecommend()
    }
    if (wx.getStorageSync('userInfoAll')) {
      let userInfoAll = wx.getStorageSync('userInfoAll')
      let rawData = JSON.parse(userInfoAll.rawData)
      this.nickName = rawData.nickName
      this.avatarUrl = rawData.avatarUrl
    }
    if (wx.getStorageSync('userPhone')) {
      let userPhone = wx.getStorageSync('userPhone')
      this.nickPhone = userPhone
    } else {
      this.nickPhone = ''
    }
  },
  onShow () {
    if (this.globalMerchantId !== globalStore.state.globalMerchantId) {
      this.globalMerchantId = globalStore.state.globalMerchantId;
      console.log('社区有变化')
      this.fetchAdvPosition(3)
    }
  },
  methods: {
    async fetchAdvPosition (position) {
      let data = {
        position: position,
        cid: globalStore.state.globalMerchantId
      }
      let adv = await getAdvPosition(data)
      console.log('adv---',adv)
      if (adv.status == 200) {
        
        this.ad3 = adv.result
      }
    },
    getSettingFun () {
      var _this = this
      // 获取用户的当前设置。本项目里判断用户是否已授权登录
      wx.getSetting({
        success (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                wx.setStorageSync('userInfoAll', res)
              }
            })
          } else {
            console.log('用户没有授权')
            _this.userLoginVal = false;
          }
        }
      })
    },
    // 获取推荐 (代金券) (猜你喜欢)
    async fetchRecommend () {
      let voucherRecommend = await getRecommend();
      //  1为活动推荐(搜索位置) 5为精选推荐(搜索位置)  2为我的推荐  3为代金券推荐  4为代金券套餐推荐
      if (voucherRecommend.status == 200) {
        let newArr = []
        let arr = voucherRecommend.result.data
        let j = 0;
        for (let i in arr) {
          if (arr[i].position == 2) {
            let data = await getVoucherDetail(arr[i].useId)
            newArr.push(data.result)
          }
        }
        this.voucherReList = newArr
      }

    },
    goMyOrder (typeKinds) {
      wx.navigateTo({
        url: `/pages/myOrder/main?active_kinds=${typeKinds}`
      })
    },
    goAllCollect () {
      wx.navigateTo({
        url: '/pages/myCollect/main'
      })
    },
    goAllCounterfoil (typeKinds) {
      wx.navigateTo({
        url: `/pages/myCounterfoil/main?active_kinds=${typeKinds}`
      })
    },
    // 去登陆
    goLogin () {
      wx.navigateTo({
        url: '/pages/login/main'
      })
    }
  }
}
</script>


<style lang="less" scoped>
.my {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  box-sizing: border-box;
  .headBgBox {
    background-color: pink;
    position: absolute;
    top: 0;
    width: 100%;
    height: 214px;
    z-index: 1;
    .imgbg {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 2;
    }
    .userInfo {
      padding: 10px 20px;
      display: flex;
      flex-direction: row;
      width: 95%;
      position: absolute;
      left: 2.5%;
      z-index: 3;
      color: #fff;
      .headImg {
        width: 52px;
        height: 52px;
        border-radius: 55px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .namePhone {
        width: 100%;
        flex: 1;
        margin-left: 10px;
        font-size: 14px;
        .phone {
          font-size: 12px;
        }
        &.namePhone_no {
          position: relative;
          p {
            line-height: 52px;
            &::after {
              display: block;
              content: "";
              width: 8px;
              height: 8px;
              border-right: 1px solid #ddd;
              border-bottom: 1px solid #ddd;
              position: absolute;
              right: 5px;
              top: 22px;
              transform: rotate(-45deg);
            }
          }
        }
        .name {
          height: 28px;
          line-height: 28px;
        }
        .phone {
          height: 24px;
          line-height: 24px;
        }
      }
    }
    .vip-collect {
      height: 58px;
      padding: 10px 0;
      width: 95%;
      background: linear-gradient(to right, #5c5857, #3f3635);
      position: absolute;
      z-index: 3;
      bottom: 0;
      left: 2.5%;
      border-radius: 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      text-align: center;
      color: #e9cc95;
      font-size: 14px;
      .vip {
        width: 50%;
        position: relative;
        height: 20px;
        line-height: 20px;
        span {
          margin-right: 20px;
        }
        &::after {
          width: 1px;
          height: 10px;
          content: "";
          color: #e9cc95;
          position: absolute;
          right: 0;
          top: 5px;
          border-right: 1px solid #e9cc95;
        }
      }
      .collect {
        width: 50%;
        position: relative;
        height: 20px;
        line-height: 20px;
        i {
          font-size: 12px;
          margin-top: -2px;
        }
        span {
          margin-left: 10px;
        }
        &::after {
          width: 1px;
          height: 10px;
          content: ">";
          color: #e9cc95;
          position: absolute;
          right: 12%;
        }
      }
    }
    .imgbgB {
      width: 100%;
      height: 22px;
      position: absolute;
      bottom: 0;
      z-index: 4;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .groupOrder {
    height: 127px;
    background: #fff;
    padding: 10px 0 5px;
    border-radius: 10px;
    &.stub {
      height: 122px;
    }
    h2 {
      padding: 0 20px;
      height: 35px;
      line-height: 35px;
      font-size: 15px;
      font-weight: 600;
      border-bottom: 1px solid #f5f5f5;
    }
    .groupMenu {
      padding: 15px 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .groupItem {
        width: 25%;
        text-align: center;
        .iconBox {
          display: inline-block;
          width: 28px;
          height: 28px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        p {
          font-size: 12px;
        }
      }
    }
  }
  //广告位1
  .adBox {
    height: 100px;
    border-radius: 8px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .guessLike {
    text-align: center;
    font-size: 14px;
    margin: 10px 0;
    span {
      margin: 0 6px;
    }
  }
}
</style>
