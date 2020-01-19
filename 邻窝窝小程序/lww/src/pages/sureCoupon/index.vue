<template>
  <div class="sureCoupon">
    <div class="couponInfo">
      <div class="left">
        <img src="../../../static/images/aaa2.png" mode="aspectFill" />
      </div>
      <div class="right">
        <p class="title ellipsis-1">{{couponDetailShow.name}}</p>
        <p class="limit">{{couponDetailShow.subName}}</p>
        <p class="price">￥{{couponDetailShow.actualPrice}}</p>
      </div>
      <div class="numHandle">
        <span class="reduce" @click="reduceFun">-</span>
        <span class="num">{{buyNum}}</span>
        <span class="plus" @click="plusFun">+</span>
      </div>
    </div>
    <div class="other">
      <div class="otherLine subtotal">
        <p>小计</p>
        <p>￥{{total_price}}</p>
      </div>
      <div class="otherLine phoneNo">
        <p>手机号</p>
        <p v-if="nickPhone">{{nickPhoneShow}}</p>
        <button
          v-else
          class="phoneBtn"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >手机号授权</button>
      </div>
    </div>
    <button class="sureBtn" @click="payFun" v-if="canPay">{{orderNO ? '继续支付' : '确认下单'}}</button>
    <button class="sureBtn sureBtnNo" v-else>{{orderNO ? '继续支付' : '确认下单'}}</button>
  </div>
</template>

<script>
import globalStore from '@/utils/store'
import { getChoiceDetail, getCouponBuy, getCouponOrderDetail } from '@/api/choiceTab'
import { getSessionInfo, getUserInfo, getPhoneInfo } from '@/api/login'
export default {
  data () {
    return {
      orderNO: '',   //  一开始为空    如果生成订单,则赋值给它  (初始化,判断订单是否生成继续支付)
      orderResed: '',  //暂存信息
      canPay: true,   //防止重复点击支付
      userLoRes: {},
      couponDetailShow: {},
      buyNum: 1,
      nickName: '',
      nickPhone: '',
      nickPhoneShow: '',
      couponBuyData: {
        voucherId: '',
        num: 1,
        phoneNo: ''
      }
    }
  },
  computed: {
    total_price () {
      let price = 0;
      price += Number(this.couponDetailShow.actualPrice) * Number(this.buyNum);
      this.orderNO = ''
      return price.toFixed(2)
    }
  },
  onLoad (options) {
    this.orderNO = ''
    this.orderResed = '';
    this.buyNum = 1;
    this.phoneNo = ''
    if (wx.getStorageSync('userInfoAll')) {
      let userInfoAll = wx.getStorageSync('userInfoAll')
      let rawData = JSON.parse(userInfoAll.rawData)
      this.userLoRes = userInfoAll
    }
    if (options.voucherId) {
      this.fetchChoiceDetail(options.voucherId)
    }
    if (wx.getStorageSync('userPhone')) {
      let userPhone = wx.getStorageSync('userPhone')
      this.nickPhone = userPhone
      this.nickPhoneShow = this.nickPhone.substring(0, 3) + '****' + this.nickPhone.substring(7);
    } else {
      this.nickPhone = ''
    }
  },
  methods: {
    async fetchChoiceDetail (id) {
      let voucherDetail = await getChoiceDetail(id)
      if (voucherDetail.status == 200) {
        this.couponDetailShow = voucherDetail.result
      }
    },
    reduceFun () {
      if (this.buyNum == 1) {
        this.buyNum = 1
      } else {
        this.buyNum--
      }
    },
    plusFun () {
      this.buyNum++
    },
    payFun () {
      var _this = this;
      if (_this.nickPhone == '') {
        wx.showToast({
          title: '手机号不能为空,请授权获取手机号',
          duration: 1500,
          icon: 'none'
        })
        return false;
      } else {
        _this.canPay = false;
        if (_this.orderNO) {
          _this.wxPayMent(_this.orderResed)
        } else {
          this.couponBuyData = {
            voucherId: this.couponDetailShow.id,
            num: this.buyNum,
            phoneNo: this.nickPhone
          }
          getCouponBuy(_this.couponBuyData).then(orderRes => {
            if (orderRes.status == 200) {
              _this.orderNO = orderRes.result.orderno;
              _this.orderResed = orderRes.result;
              _this.wxPayMent(orderRes.result)
            }
          })
        }
      }
    },
    wxPayMent (payNeed) {
      var _this = this;
      wx.requestPayment({
        'timeStamp': payNeed.timeStamp,
        'nonceStr': payNeed.nonceStr,
        'package': payNeed.packageValue,
        'signType': 'MD5',
        'paySign': payNeed.paySign,
        'success': function (res) {
          if (res.errMsg == "requestPayment:ok") {  // 调用支付成功  跳转
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            });
            wx.navigateTo({
              url: `/pages/couponOrderDetail/main?orderNo=${payNeed.orderno}`
            })
            _this.canPay = true;
          }
        },
        'fail': function (res) {
          wx.showToast({
            title: '支付失败',
            icon: "none",
            duration: 2000
          })
          _this.canPay = true;
        },
        'complete': function (res) { }
      })
    },
    // 获取手机号
    getPhoneNumber (e) {
      var loRes = e.mp.detail;
      var phoneLoRes = e.mp.detail;
      let _this = this;
      if (e.mp.detail.errMsg == 'getPhoneNumber:ok') {
        // 用户按了允许授权按钮
        let data = {
          sessionKey: globalStore.state.globalSessionKey,
          signature: _this.userLoRes.signature,
          rawData: _this.userLoRes.rawData,
          encryptedData: loRes.encryptedData,
          iv: loRes.iv,
          openId: globalStore.state.globalOpenId
        }
        // 获取token
        getPhoneInfo(data).then(res => {
          if (res.status == 200) {
            wx.showToast({
              title: '授权成功',//提示文字
              duration: 2000,//显示时长
              mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false  
              icon: 'success', //图标，支持"success"、"loading"  
              success: function () {
                _this.nickPhone = res.result
                _this.nickPhoneShow = _this.nickPhone.substring(0, 3) + '****' + _this.nickPhone.substring(7);
                wx.setStorageSync('userPhone', res.result)
              },//接口调用成功
              fail: function () { },  //接口调用失败的回调函数  
              complete: function () { } //接口调用结束的回调函数  
            })
          }
        })
      } else {
        // 用户按了拒绝按钮
        wx.showModal({
          title: '提示',
          content: '您点击了拒绝授权，部分功能将无法使用,请授权享受更多权益!',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击了“返回授权”')
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.sureCoupon {
  padding: 15px;
  width: 100%;
  .couponInfo {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    justify-content: space-between;
    padding: 20px 0;
    border-bottom: 1px solid #f1f1f1;
    position: relative;
    .left {
      width: 85px;
      height: 85px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .right {
      width: 50%;
      flex: 1;
      margin-left: 10px;
      .title {
        font-size: 15px;
        line-height: 20px;
        font-weight: 600;
      }
      .limit {
        font-size: 11px;
        line-height: 30px;
      }
      .price {
        font-size: 16px;
        line-height: 35px;
      }
    }
    .numHandle {
      position: absolute;
      right: 0;
      bottom: 20px;
      span {
        width: 22px;
        height: 22px;
        display: inline-block;
        text-align: center;
      }
      .reduce {
        background: #e2e2e2;
      }
      .num {
        margin: 0 5px;
        font-weight: 600;
        font-size: 14px;
      }
      .plus {
        background: #bcbcbc;
        color: #fff;
      }
    }
  }
  .other {
    margin: 25px 0;
    .otherLine {
      display: flex;
      justify-content: space-between;
      line-height: 30px;
      font-size: 14px;
    }
    .phoneBtn {
      font-size: 12px;
      margin: 0;
      background-color: #f1f1f1;
      margin-top: 3px;
      height: 24px;
      line-height: 24px;
      &::after {
        border: none;
      }
    }
  }
  .sureBtn {
    background-image: linear-gradient(to left, #ff3106, #ff6400);
    color: #fff;
    font-size: 15px;
    line-height: 40px;
    &::after {
      border: none;
    }
    &.sureBtnNo {
      background-image: linear-gradient(to left, #999, #999);
    }
  }
}
</style>
