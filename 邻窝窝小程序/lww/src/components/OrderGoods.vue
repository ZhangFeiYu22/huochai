<template>
  <div class="content">
    <div class="orderBox">
      <div class="headTitle">
        <p class="pp">
          订单号:
          <span>2019616123456</span>
        </p>
        <p class="status">可使用</p>
      </div>
      <div class="contentB"  @click="goOrderDetailPage">
        <div class="imgBox">
          <img :src="orderGoods.url" mode="aspectFill" />
        </div>
        <div class="rightContent">
          <p class="goodsTitle">奶思鲜生 芒果西米露小食套餐三选一</p>
          <p class="goodsinfo">芒果椰汁西米露（中杯）</p>
          <div class="bottom">
            共
            <span class="num">1</span>件商品 实付总额:
            <span class="priceIcon">￥</span>
            <span class="price">18</span>
          </div>
        </div>
      </div>
      <button class="btnShow">再次购买</button>
    </div>
  </div>
</template>

<script>
import globalStore from '@/utils/store'
export default {
  props: ['orderGoods'],
  data () {
    return {
      imgUrlHttp: globalStore.state.imgUrlHttp,
    }
  },
  methods: {
    goOrderDetailPage () {
      wx.navigateTo({
        url: '/pages/orderDetail/main'
      })
    }
  },

  created () {

  }
}
</script>

<style lang="less" scoped>
.orderBox {
  position: relative;
  padding-bottom: 44px;
  border-bottom: 10px solid #f6f6f6;
  .headTitle {
    display: flex;
    padding: 20px 20px 15px;
    justify-content: space-between;
    .pp {
      color: #000;
      font-size: 16px;
      span {
        font-style: 14x;
        color: #666;
      }
    }
    .status {
      font-size: 14px;
    }
  }
  .contentB {
    display: flex;
    padding: 10px 20px;
    border-top: 1px solid #f6f6f6;
    border-bottom: 1px solid #f6f6f6;
    .imgBox {
      min-width: 110px;
      flex-grow: 1;
      height: 110px;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .rightContent {
      width: 100%;
      position: relative;
      .goodsTitle {
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
      }
      .goodsinfo {
        font-size: 12px;
        color: #666;
        line-height: 15px;
      }
      .bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        font-size: 14px;
        text-align: right;
        color: #666;
        .priceIcon {
          font-size: 12px;
          color: #ff0000;
          margin-left: 20px;
        }
        .price {
          font-size: 18px;
          color: #ff0000;
        }
      }
    }
  }
  .btnShow {
    position: absolute;
    bottom: 10px;
    right: 20px;
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    color: #272727;
    padding: 0 15px;
    border: 1px solid #999;
    &:after {
      border: none;
    }
  }
}
</style>
