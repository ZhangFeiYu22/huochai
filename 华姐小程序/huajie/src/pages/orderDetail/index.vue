<template>
  <div class="orderDetail" :style="{marginTop: headHeight + 'px'}">
    <headView :headData="headData"></headView>
    <div class="orderDetailCont">
      <div class="content">
        <h3>订单详情</h3>
        <div class="orderDetail">
          <div class="line">
            <p>订单编号:</p>
            <p>{{orderDetail.orderno}}</p>
          </div>
          <div class="line">
            <p>商品件数:</p>
            <p>{{orderDetail.num}}件</p>
          </div>
          <div class="line">
            <p>订单总价:</p>
            <p class="payPrice">{{orderDetail.payprice}}元</p>
          </div>
          <div class="line" :class="orderDetail.pickupcode?'orderTime':''">
            <p>下单时间:</p>
            <p>{{orderDetail.createtime}}</p>
          </div>
          <div class="identifying" v-if="orderDetail.pickupcode && orderDetail.status==2">
            <img src="../../../static/images/code.png" alt />
            <p class="code">{{orderDetail.pickupcode}}</p>
          </div>
          <div class="line">
            <p>联系人:</p>
            <p>{{orderDetail.membername}}</p>
          </div>
          <div class="line">
            <p>联系电话:</p>
            <p>{{orderDetail.phone}}</p>
          </div>
          <div class="line">
            <p>{{orderDetail.price==0 ? '活动地址:' : '取货地址:'}}</p>
            <p>{{orderDetail.address}}</p>
          </div>
          <div class="line">
            <p>{{orderDetail.price==0 ? '活动时间:' : '取货时间:'}}</p>
            <p>{{orderDetail.avidate}}</p>
          </div>
          <div class="remark">注:如若不能如期取货请联系平台</div>
        </div>
      </div>
      <div class="btnBox">
        <button class="contactBtn" @click="phoneCall">联系客服</button>
      </div>
    </div>
  </div>
</template>

<script>
import headView from '@/components/headerView'
import { orderDetail } from '@/utils/api'
export default {
  data () {
    return {
      headHeight: '',
      headData: {
        title: '订单详情',
        bgcolor: '#fff',
        showBlack: true
      },
      orderDetail: ''
    }
  },
  components: {
    headView
  },
  onLoad(options){
     this.headHeight = this.$store.state.navHeight + 46;
     this.getDataFun(options.orderId);
  },
  methods: {
    async getDataFun(id){
      let result = await orderDetail(id);
      this.orderDetail = result.orderDetail;
    },
    phoneCall () {
      wx.makePhoneCall({
        phoneNumber: '18570373920' 
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.orderDetail {
  .orderDetailCont {
    padding-top: 10px;
    .content {
      box-shadow: 0 2px 4px 2px #e1e1e1;
      width: 90%;
      margin: 0px auto 15px;
      border-radius: 10px;
      h3 {
        height: 40px; 
        line-height: 40px; 
        padding: 0 5%;
        font-size: 14px;
        font-weight: 600; 
        border-bottom: 1px solid #e1e1e1; 
      }
      .orderDetail {
        width: 90%;
        margin: 0 auto;
        .line {
          width: 100%;
          padding: 10px 0;
          border-bottom: 1px solid #e1e1e1; 
          font-size: 14px; 
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          color: #666;
          p{
            &:first-child{
              width: 30%;
            }
          }
          &.orderTime {
            border-bottom: none; 
          }
        }
        .identifying {
          border-top: 8px solid #f1f1f1; 
          border-bottom: 8px solid #f1f1f1; 
          padding: 10px 0;
          position: relative;
          text-align: center;
          img {
            width: 291px;
            height: 95px;
          }
          .code {
            position: absolute;
            top: 48%;
            transform: translateY(-60%);
            right: 6.5%;
            font-size: 28px; 
            color: #fff;
            font-weight: 600;
            letter-spacing: 6px;
          }
        }
        .remark {
          height: 40px; 
          line-height: 40px; 
          font-size: 14px; 
          color: #ff3a3a;
        }
      }
    }
    .btnBox {
      width: 100%;
      text-align: center;
      margin-bottom: 50px;
      .contactBtn {
        background-color: #1ebc21;
        color: #fff;
        width: 50%;
        height: 30px; 
        line-height: 30px;
        border: none;
        font-size: 15px; 
        border-radius: 10px;
      }
    }
  }
}
</style>
  