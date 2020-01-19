<template>
  <div class="signUp" :style="'min-height:'+viewH">
    <div class="content">
      <div class="top w90">
        <h2 class="hh2">{{activityDetailShow.title}}</h2>
        <div class="pTop">
          <p>参与人数</p>
          <p>
            <span class="reduce" @click="reduceFun">-</span>
            <span class="num">{{buyNum}}</span>
            <span class="plus" @click="plusFun">+</span>
          </p>
          <p>￥{{activityDetailShow.actualPrice}}</p>
        </div>
        <div class="pTopTotal">
          总计:
          <p>
            ￥
            <span>{{total_price}}</span>
          </p>
        </div>
      </div>
      <hr class="line" />
      <div class="bottom w90">
        <h2 class="hh2">填写资料</h2>
        <div class="pBottom">
          <div class="inputItem">
            <p>姓名(必填)</p>
            <input type="text" v-model="nickName" placeholder="请输入您的名字" />
          </div>
          <div class="inputItem">
            <p>电话(必填)</p>
            <input type="text" v-model="phoneNo" placeholder="请输入您的有效手机号码" />
          </div>
        </div>
        <button class="btnSignUp" @click="payFun" v-if="canPay">{{orderNO ? '继续报名' : '确认报名'}}</button>
        <button class="btnSignUp btnSignUpNo" v-else>{{orderNO ? '继续报名' : '确认报名'}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getActivityDetail, activitySignUp } from '@/api/activity'
export default {
  data () {
    return {
      viewH: wx.getStorageSync('windowHeight') + 'px',
      orderNO: '',   //  一开始为空    如果生成订单,则赋值给它  (初始化,判断订单是否生成继续支付)
      orderResed: '',  //暂存信息
      canPay: true,   //防止重复点击支付
      activityDetailShow: {},
      buyNum: 1,
      nickName: '',
      phoneNo: '',
      signData: {
        activityId: '',
        num: 1,
        phoneNo: ''
      }
    }
  },
  computed: {
    total_price () {
      let price = 0;
      price += Number(this.activityDetailShow.actualPrice) * Number(this.buyNum);
      this.orderNO = ''
      return price.toFixed(2)
    }
  },
  onLoad (options) {
    //初始化
    this.orderNO = ''
    this.orderResed = '';
    this.buyNum = 1;
    this.phoneNo = ''
    if (options.activityId) {
      this.fetchActivityDetail(options.activityId)
    }
    if (wx.getStorageSync('userInfoAll')) {
      let userInfoAll = wx.getStorageSync('userInfoAll')
      let rawData = JSON.parse(userInfoAll.rawData)
      this.nickName = rawData.nickName
    }
  },
  methods: {
    async fetchActivityDetail (id) {
      let activityDetail = await getActivityDetail(id)
      if (activityDetail.status == 200) {
        this.activityDetailShow = activityDetail.result
        this.signData.activityId = activityDetail.result.id
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
      var myreg = /^(((1[0-9]{1}))+\d{9})$/;
      if (_this.phoneNo == '') {
        wx.showToast({
          title: '手机号不能为空',
          duration: 1500,
          icon: 'none'
        })
        return false;
      } else if (_this.phoneNo.length != 11) {
        wx.showToast({
          title: '手机号长度有误',
          duration: 1500,
          icon: 'none'
        })
        return false;
      } else if (!myreg.test(_this.phoneNo)) {
        wx.showToast({
          title: '手机号格式有误',
          duration: 1500,
          icon: 'none'
        })
        return false;
      } else {
        _this.canPay = false;
        if (_this.orderNO) {
          _this.wxPayMent(_this.orderResed)
        } else {
          this.signData.num = this.buyNum
          this.signData.phoneNo = this.phoneNo
          activitySignUp(_this.signData).then(orderRes => {
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
              url: `/pages/signUpSuccess/main?orderNo=${payNeed.orderno}`
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
    }
  }

}
</script>

<style lang="less" scoped>
.signUp {
  background: #f1f1f1;
  padding: 10px;
  .content {
    background: #fff;
    box-shadow: 0 0 5px 2px #ddd;
    border-radius: 5px;
    .w90 {
      width: 90%;
      margin: 0 auto;
    }
    .hh2 {
      line-height: 40px;
      font-size: 16px;
      border-bottom: 1px solid #f1f1f1;
    }
    .line {
      border-bottom: 5px solid #f1f1f1;
    }
    .top {
      .pTop {
        display: flex;
        border-bottom: 1px solid #f1f1f1;
        flex-direction: row;
        justify-content: space-between;
        p {
          padding: 12px 0;
          line-height: 22px;
          &:nth-child(1) {
            font-size: 12px;
            font-weight: 600;
          }
          &:nth-child(2) {
            flex-grow: 1;
            text-align: right;
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
            }
          }
          &:nth-child(3) {
            width: 20%;
            text-align: right;
            font-size: 12px;
            color: #ff0000;
          }
        }
      }
      .pTopTotal {
        text-align: right;
        line-height: 50px;
        font-size: 12px;
        font-weight: 600;
        p {
          display: inline-block;
          margin-left: 20px;
          color: #ff0000;
          span {
            font-size: 18px;
          }
        }
      }
    }
    .bottom {
      padding-bottom: 100px;
      .pBottom {
        .inputItem {
          p {
            line-height: 36px;
            font-size: 14px;
          }
          input {
            background-color: #f6f6f6;
            font-size: 13px;
            padding: 4px 10px;
            margin-bottom: 10px;
          }
        }
      }
      .btnSignUp {
        background-color: #ff3b30;
        color: #fff;
        font-size: 15px;
        margin-top: 30px;
        outline: none;
        border: none;
        &::after {
          border: none;
        }
        &.btnSignUpNo {
          background-color: #999;
        }
      }
    }
  }
}
</style>