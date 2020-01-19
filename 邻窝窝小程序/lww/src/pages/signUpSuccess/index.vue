<template>
  <div class="signUpSuccess">
    <div class="content">
      <div class="imgB">
        <img src="../../../static/images/signup.png" mode="aspectFill" />
      </div>
      <p class="hint1">报名成功</p>
      <p class="hint2">如有问题可联系客服咨询</p>
      <p class="seeDetail" @click="goCounterFoil">查看详情</p>
      <p class="backHome" @click="goHome">返回首页</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      orderNo: ''
    }
  },
  onLoad (options) {
    if (options.orderNo) {
      this.orderNo = options.orderNo
    }
  },
  methods: {
    goCounterFoil () {
      wx.navigateTo({
        url: `/pages/counterfoilOrderDetail/main?orderNo=${this.orderNo}`
      })
    },
    goHome () {
      wx.switchTab({
        url: "/pages/home/main"
      })
    }
  }
}
</script>

<style lang="less" scoped>
.signUpSuccess {
  .content {
    margin-top: 20%;
    text-align: center;
    .imgB {
      display: inline-block;
      width: 119px;
      height: 124px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .hint1 {
      font-size: 22px;
      line-height: 40px;
    }
    .hint2 {
      font-size: 14px;
      color: #999;
      line-height: 40px;
    }
    .seeDetail,
    .backHome {
      display: inline-block;
      width: 60%;
      height: 50px;
      line-height: 50px;
      border-radius: 50px;
      font-size: 16px;
      margin-top: 20px;
    }
    .seeDetail {
      background: #ff3b30;
      color: #fff;
    }
    .backHome {
      border: 1px solid #464646;
    }
  }
}
</style>