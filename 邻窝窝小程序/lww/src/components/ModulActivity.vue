<template>
  <div class="content">
    <div class="bigBox" @click="goActivity">
      <div class="counterfoil" v-if="btnShowNum==2">
        <h2>订单号:</h2>
        <p>{{moduleActivityData.orderNo}}</p>
        <p class="status" v-if="moduleActivityData.status == 1">待付款</p>
        <p class="status" v-else-if="moduleActivityData.status == 2">可使用</p>
        <p class="status" v-else-if="moduleActivityData.status == 3">已完成</p>
      </div>
      <div class="modulActivity">
        <div class="leftImg">
          <img
            v-if="moduleActivityData.cover"
            :src="imgUrlHttp + moduleActivityData.cover"
            mode="aspectFill"
          />
        </div>
        <div class="rightCon">
          <h4 class="ellipsis-2">{{moduleActivityData.title}}</h4>
          <p class="address ellipsis-1">{{moduleActivityData.actAddress}}</p>
          <p class="time">
            <span>{{moduleActivityData.actTime}}</span>
            <span class="price" v-if="btnShowNum==2"></span>
            <span class="price" v-else>￥{{moduleActivityData.actualPrice ? moduleActivityData.actualPrice : moduleActivityData.activityPrice}}起</span>
          </p>
        </div>
      </div>
      <div class="counterfoil_num_price clearfix" v-if="btnShowNum==2">
        <p>￥{{moduleActivityData.totalPrice}}</p>
        <p>x{{moduleActivityData.num}}</p>
      </div>
      <button class="buyNow" v-if="btnShowNum == 1">立即报名</button>
      <button class="buyNow buyAgain" v-else-if="btnShowNum == 2">再次购买</button>
    </div>
  </div>
</template>

<script>
import globalStore from '@/utils/store'
export default {
  //moduleActivityData表示数据    btnShowNum是否显示立即报名
  props: ['moduleActivityData', 'btnShowNum'],
  data () {
    return {
      imgUrlHttp: globalStore.state.imgUrlHttp
    }
  },
  methods: {
    goActivity () {
      if (wx.getStorageSync('isLogin')) {
        wx.navigateTo({
          url: `/pages/activityDetail/main?activity_id=${this.moduleActivityData.id}`
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
  },

  created () {

  }
}
</script>

<style lang="less" scoped>
.content {
  .bigBox {
    border-bottom: 5px solid #f1f1f1;
    padding: 15px 2.5%;
    overflow: hidden;
    .counterfoil {
      padding-bottom: 5px;
      h2,
      p {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        vertical-align: top;
      }
      h2 {
        font-weight: 600;
        font-size: 15px;
        margin-right: 5px;
      }
      p {
        font-size: 14px;
        color: #666;
        &.status {
          background: #ff3b30;
          color: #fff;
          font-size: 12px;
          padding: 0 10px;

          float: right;
        }
      }
    }
    .modulActivity {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .leftImg {
        width: 150px;
        min-width: 150px;
        height: 90px;
        margin-right: 10px;
        border-radius: 5px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .rightCon {
        text-align: justify;
        box-sizing: border-box;
        flex: 1;
        width: 50%;
        h4 {
          height: 40px;
          font-weight: 600;
          font-size: 16px;
          line-height: 20px;
        }
        .address {
          color: #999;
          font-size: 13px;
          height: 30px;
          line-height: 30px;
        }
        .time {
          color: #999;
          height: 20px;
          font-size: 13px;
          line-height: 20px;
          .price {
            float: right;
            font-size: 14px;
          }
        }
      }
    }
    .counterfoil_num_price {
      border-bottom: 1px solid #f1f1f1;
      p {
        float: right;
        margin-left: 25px;
        color: #777;
      }
    }
    .buyNow {
      float: right;
      margin-top: 10px;
      padding: 0 6px;
      width: 72px;
      height: 24px;
      line-height: 24px;
      font-size: 12px;
      color: #fe3b30;
      border: 1px solid #fe3b30;
      background: transparent;
      &.buyAgain {
        color: #272727;
        border-color: #272727;
      }
    }
  }
}
</style>
