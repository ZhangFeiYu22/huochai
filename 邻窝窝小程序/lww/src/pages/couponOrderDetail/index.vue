<template>
  <div class="orderDetail">
    <!-- 顶部商品 -->
    <div class="topBox" @click="goCouponPage(couponDetailShow.id)">
      <div class="imgBox">
        <img
          v-if="couponDetailShow.coverOne"
          :src="imgUrlHttp + couponDetailShow.coverOne"
          mode="aspectFill"
        />
      </div>
      <div class="infoBox">
        <p class="title">{{couponDetailShow.name}}</p>
        <p class="flag">{{content}}</p>
        <p class="price">
          ￥
          <span class="new">{{couponDetailShow.actualPrice}}</span>
          <span class="old">￥{{couponDetailShow.showPrice}}</span>
        </p>
      </div>
      <div class="iconGo"></div>
    </div>
    <!-- 中间二维码 -->
    <div class="centerBox mt10">
      <div class="centerTop">
        <p>
          <span>{{orderDetailShow.num}}张可用</span>
          <span>{{orderDetailShow.endTime}} 到期</span>
        </p>
        <button @click="callPhone">申请退款</button>
      </div>
      <div class="centerCode">
        <div class="ercodeImg">
          <img src="../../../static/images/code.png" mode="aspectFill" />
          <p class="ercode">{{orderDetailShow.code}}</p>
        </div>
        <p class="ppp1">到店取货时请主动出示该二维码</p>
        <p class="ppp2">为保护您的合法权益，在未实际参与</p>
        <p class="ppp2">活动之前请不要随意分享该页面給任何人</p>
      </div>
    </div>
    <!-- 订单信息 -->
    <div class="orderInfo mt10">
      <h3>订单信息</h3>
      <div class="infoList">
        <p class="left">订单编号:</p>
        <p class="right">{{orderDetailShow.orderNo}}</p>
      </div>
      <div class="infoList">
        <p class="left">联系电话:</p>
        <p class="right">{{orderDetailShow.contactPhone}}</p>
      </div>
      <div class="infoList">
        <p class="left">付款时间:</p>
        <p class="right">{{orderDetailShow.createTime}}</p>
      </div>
      <div class="infoList">
        <p class="left">数量:</p>
        <p class="right">x {{orderDetailShow.num}}</p>
      </div>
      <div class="infoList">
        <p class="left">总计:</p>
        <p class="right sum">￥{{orderDetailShow.totalPrice}}</p>
      </div>
    </div>
    <button class="sweepCodeBtn" @click="goHome">返回首页</button>
  </div>
</template>

<script>
import globalStore from '@/utils/store'
import { getChoiceDetail, getCouponBuy, getCouponOrderDetail } from '@/api/choiceTab'
export default {
  data () {
    return {
      imgUrlHttp: globalStore.state.imgUrlHttp,
      customerServiceTel: globalStore.state.customerServiceTel,
      orderDetailShow: {},   //订单详情
      couponDetailShow: {}  //代金券详情
    }
  },
  onLoad (options) {
    if (options.orderNo) {
      console.log(options.orderNo)
      this.fetchOrderDetail(options.orderNo)
    }
  },
  methods: {
    async fetchOrderDetail (id) {
      let orderDetail = await getCouponOrderDetail(id)
      if (orderDetail.status == 200) {
        this.orderDetailShow = orderDetail.result
        this.fetchChoiceDetail(this.orderDetailShow.voucherId)
      }
    },
    async fetchChoiceDetail (id) {
      let voucherDetail = await getChoiceDetail(id)
      if (voucherDetail.status == 200) {
        this.couponDetailShow = voucherDetail.result
      }
    },
    goCouponPage (id) {
      wx.navigateTo({
        url: `/pages/cashCoupon/main?choice_id=${id}`
      })
    },
    callPhone () {
      wx.makePhoneCall({
        phoneNumber: this.customerServiceTel,
      })
    },
    // 返回首页
    goHome () {
      wx.switchTab({
        url: "/pages/home/main"
      })
    }
  }
}
</script>

<style lang="less" scoped>
.orderDetail {
  width: 100%;
  height: 100%;
  background-color: #f6f6f6;
  // 顶部商品
  .topBox {
    display: flex;
    padding: 10px 20px 15px 5%;
    align-items: center;
    background-color: #fff;
    .imgBox {
      width: 62px;
      height: 62px;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .infoBox {
      flex-grow: 1;
      .title {
        font-size: 14px;
        font-weight: 600;
      }
      .flag {
        font-size: 10px;
        line-height: 20px;
        color: #999;
      }
      .price {
        font-size: 10px;
        color: #ff3b30;
        font-weight: 600;
        margin-top: 10px;
        .new {
          font-size: 14px;
          margin-right: 5px;
        }
        .old {
          text-decoration: line-through;
          color: #999;
          font-weight: 400;
        }
      }
    }
    .iconGo {
      display: inline-block;
      content: "";
      width: 9px;
      height: 9px;
      border-right: 1px solid #666;
      border-bottom: 1px solid #666;
      transform: rotate(-45deg);
    }
  }
  // 中间二维码
  .centerBox {
    background-color: #fff;
    padding: 0 3%;
    .centerTop {
      width: 100%;
      font-size: 13px;
      color: #999;
      display: flex;
      height: 50px;
      line-height: 50px;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px dashed #bbb;
      button {
        height: 29px;
        line-height: 29px;
        padding: 0 10px;
        font-size: 14px;
        margin: 0;
        background-color: transparent;
      }
    }
    .centerCode {
      text-align: center;
      padding: 20px 0 15px;
      .ercodeImg{
        display: inline-block;
        width: 244px;
        height: 80px;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        .ercode{
          position: absolute;
          font-size: 22px;
          right: 8%;
          top: 25%;
          color: #fff;
          letter-spacing: 4px;
        }
      }
      .ppp1 {
        font-size: 16px;
        font-weight: 600;
        margin: 10px 0 5px;
      }
      .ppp2 {
        font-size: 10px;
        color: #999;
      }
    }
  }
  // 订单信息
  .orderInfo {
    background-color: #fff;
    padding: 10px 3%;
    h3 {
      font-size: 16px;
      font-weight: 600;
      line-height: 30px;
      margin-bottom: 10px;
    }
    .infoList {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      line-height: 30px;
      .right {
        color: #999;
        &.sum {
          color: #333;
        }
      }
    }
  }
  .sweepCodeBtn {
    background: linear-gradient(to right, #ff6400, #ff3106);
    background: -webkit-linear-gradient(to right, #ff6400, #ff3106);
    color: #fff;
    font-size: 18px;
    width: 90%;
    margin: 20px auto;
  }
}
</style>
