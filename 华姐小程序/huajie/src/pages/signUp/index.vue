<template>
  <div class="signUp" :style="{marginTop: headHeight + 'px'}">
    <headView :headData="headData"></headView>
    <div class="costBox borderTop">
      <div class="costLine">
        <h2>报名费用</h2>
      </div>
      <div class="costLine">
        <div class="costLeft">费用</div>
        <div class="costRight">
          <div class="countNum">
            <span class="reduce" @click="reduce">-</span>
            <span class="num">{{num}}</span>
            <span class="add" @click="add_num">+</span>
          </div>
          <div class="countprice price">¥{{bugPrice}}</div>
        </div>
      </div>
      <div class="costLine">
        <div class="costLeft"></div>
        <div class="costRight">
          <div class="countNum">总计:</div>
          <div class="countprice sum">¥ {{total_price}}</div>
        </div>
      </div>
    </div>
    <div class="detailBox borderTop costBox">
      <div class="costLine">
        <h2>报名详情</h2>
      </div>
      <div class="detailLine">
        <p>姓名</p>
        <input
          type="text"
          v-model="signUp_name"
          placeholder="请填写你的真实姓名"
          placeholder-style="color: #bbb"
        />
      </div>
      <div class="detailLine">
        <p>手机</p>
        <input
          placeholder="请填写你的手机号码"
          placeholder-style="color: #bbb"
          type="number"
          pattern="[0-9]*"
          v-model="signUp_phone"
          maxlength="11"
        />
      </div>
      <div class="remind">
        <i>!</i>
        <span>请核实信息无误,该信息用于活动现场签到</span>
      </div>
    </div>
    <div class="payBtn" @click="payFun" v-if="canPay">
      <i class="iconfont icon-weixinzhifu"></i>
      <span>{{bugPrice==0?'立即报名':'微信支付'}}</span>
    </div>
    <div class="payBtn no" v-else>
      <i class="iconfont icon-weixinzhifu"></i>
      <span>{{bugPrice==0?'立即报名':'微信支付'}}</span>
    </div>
    <div class="signSuccess" v-if="signSuccessVal">
      <div class="singBox">
        <div class="imgBg">
          <img src="../../../static/images/sign.png" mode="aspectFill" alt />
        </div>
        <p class="ptitle">活动报名成功</p>
        <p class="btn" @click="knowFun">我知道了</p>
      </div>
    </div>
  </div>
</template>

<script>
import headView from '@/components/headerView'
import activityCom from '@/components/activityComponents'
import { goodsPayBuy } from '@/utils/api'
export default {
  data () {
    return {      
      headHeight: '',
      headData: {
        title: '活动报名',
        bgcolor: '#fff',
        showBlack: true
      },
      num: 1,
      buyId: '',
      bugPrice: '',
      signUp_name: '',
      signUp_phone: '',
      signSuccessVal: false,    //报名或者支付成功弹窗显示
      canPay: true,   //防止重复点击支付
      payNeed: ''    //支付所需要的参数信息
    }
  },
  components: {
    headView,
    activityCom
  },
  onLoad (options) {
    // 初始化值
    this.num = 1;
    this.signSuccessVal = false;
    this.signUp_name = '';
    this.signUp_phone = '';
    this.canPay = true;

    this.headHeight = this.$store.state.navHeight + 46;
    this.buyId = options.buyId;
    this.bugPrice = options.bugPrice;
  },
  computed: {
    total_price () {
      let price = 0;
      price += Number(this.bugPrice) * Number(this.num);
      return price.toFixed(2)
    }
  },
  methods: {
    knowFun () {
      wx.redirectTo({
        url: '/pages/home/main'
      })
    },
    reduce () {
      if (this.num <= 1) {
        this.num = 1
      } else {
        this.num--
      }
    },
    add_num () {
      this.num++
    },
    payFun () {
      var _this = this;
      var myreg = /^(((1[0-9]{1}))+\d{9})$/;
      if (_this.signUp_name == '') {
        wx.showToast({
          title: '姓名不能为空',
          duration: 1500
        })
        return false;
      }
      if (_this.signUp_phone == '') {
        wx.showToast({
          title: '手机号不能为空',
          duration: 1500
        })
        return false;
      } else if (_this.signUp_phone.length != 11) {
        wx.showToast({
          title: '手机号长度有误',
          duration: 1500
        })
        return false;
      } else if (!myreg.test(_this.signUp_phone)) {
        wx.showToast({
          title: '手机号格式有误',
          duration: 1500
        })
        return false;
      } else {
        _this.canPay = false;
        _this.signUpForm = {
          id: Number(this.buyId),
          num: _this.num,
          name: _this.signUp_name,
          phone: _this.signUp_phone
        }
        goodsPayBuy(_this.signUpForm).then(res => {
          console.log('生成的订单信息', res)
          _this.payNeed = res.orderResult;
          if (this.bugPrice == 0) {
            wx.showToast({
              title: '报名成功',
              icon: 'success',
              duration: 2000
            });
            _this.signSuccessVal = true;
          } else {
            wx.requestPayment({
              'timeStamp': _this.payNeed.timeStamp,
              'nonceStr': _this.payNeed.nonceStr,
              'package': _this.payNeed.packageValue,
              'signType': 'MD5',
              'paySign': _this.payNeed.paySign,
              'success': function (res) {
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 2000
                });
                _this.signSuccessVal = true;
                _this.canPay = true;
              },
              'fail': function (res) {
                console.log('支付失败')
                _this.canPay = true;
              },
              'complete': function (res) { }
            })
          }
        })
      }
    }
  }
}
</script>
  
<style lang="less" scoped>
.signUp {
  font-size: 14px;
  .borderTop {
    border-top: 4px solid #f1f1f1;
  }
  .costBox {
    .costLine {
      padding: 10px 4%;
      height: 20px;
      line-height: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-bottom: 1px solid #f1f1f1;
      h2 {
        font-size: 15px;
        font-weight: 600;
      }
      .costLeft {
        width: 60%;
      }
      .costRight {
        width: 40%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .countNum {
          width: 50%;
          .reduce,
          .add,
          .num {
            display: inline-block;
            width: 20px;
            background-color: #f1f1f1;
            text-align: center;
            font-size: 14px;
            color: #bbb;
            font-weight: 600;
          }
          .num {
            margin: 0 2px;
            font-size: 12px;
            color: #333;
            font-weight: normal;
          }
        }
        .countprice {
          width: 50%;
          text-align: right;
          color: #ff5e5e;
          &.price {
            font-size: 12px;
            font-weight: 600;
          }
          &.sum {
            font-size: 16px;
          }
        }
      }
    }
  }
  .detailBox {
    .detailLine {
      padding: 0 4%;
      font-size: 14px;
      margin-bottom: 10px;
      font-size: 16px;
      p {
        line-height: 36px;
        font-weight: 600;
      }
      input {
        border: 1px solid #ddd;
        padding: 4px 8px;
        border-radius: 3px;
        font-size: 15px;
      }
    }
    .remind {
      text-align: center;
      font-size: 12px;
      i {
        vertical-align: middle;
        display: inline-block;
        width: 10px;
        height: 10px;
        line-height: 10px;
        border: 1px solid #ff5e5e;
        border-radius: 50%;
        color: #ff5e5e;
        margin-right: 5px;
      }
      span {
        vertical-align: middle;
        color: #999;
      }
    }
  }
  .payBtn {
    background-color: #1ebc21;
    height: 42px;
    line-height: 42px;
    text-align: center;
    width: 92%;
    margin: 40px auto 0;
    color: #fff;
    &.no {
      background-color: #999;
    }
    i {
      vertical-align: middle;
      margin-right: 5px;
    }
    span {
      vertical-align: middle;
      font-weight: 600;
    }
  }
  .signSuccess {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    .singBox {
      width: 271px;
      height: 332px;
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      .imgBg {
        height: 192px;
        background-color: #fff5ec;
      }
      img {
        width: 92%;
        margin-left: 4%;
      }
      .ptitle {
        margin-top: 40px;
        font-weight: 600;
        font-size: 18px;
      }
      .btn {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        background-color: #6997a0;
        color: #fff;
        width: 80%;
        font-size: 16px;
        margin-top: 20px;
        letter-spacing: 2px;
      }
    }
  }
}
</style>
