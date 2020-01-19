<template>
  <div class="activityEd" :style="{marginTop: headHeight + 'px'}">
    <headView :headData="headData"></headView>
    <div class="activityEdCont">
      <div class="orderListCont">
        <div class="listLengthNo" v-if="activityOrderList.length == 0">
          <div class="imgbox">
            <img src="../../../static/images/noorder.png" alt />
          </div>
          <p>暂无相关订单</p>
          <!-- <button @click="goHome">返回首页</button> -->
        </div>
        <div class="listLengthHas" v-else>
          <div
            class="orderItem"
            v-for="item in activityOrderList"
            :key="item.id"
            @click="goOrderDetail(item.id)"
          >
            <p class="orderNumber">订单号: {{item.orderno}}</p>
            <p class="orderName">{{item.goodstitle}}</p>
            <div class="lastLine">
              <p>{{item.createtime}}</p>
              <p>
                共{{item.status}}
                <span>{{item.num}}</span>件商品
              </p>
              <p class="sumPrice">￥{{item.payprice}}</p>
            </div>
            <div class="orderStatus" v-if="item.status==8">
              <img src="../../../static/images/status2.png" mode="aspectFill" alt />
              <p>已报名</p>
            </div>
            <div class="orderStatus" v-else-if="item.status==2">  <!-- 未核销 -->
              <img src="../../../static/images/status1.png" mode="aspectFill" alt />
              <p>未核销</p>
            </div>
            <div class="orderStatus" v-else-if="item.status==3">   <!-- 已核销 -->
              <img src="../../../static/images/status2.png" mode="aspectFill" alt />
              <p>已核销</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headView from '@/components/headerView'
import { orderList } from '@/utils/api'
export default {
  data () {
    return {
      headData: {
        title: '参加过的活动',
        bgcolor: '#fff',
        showBlack: true
      },
      headHeight: '',
      activityOrderList: []
    }
  },
  components: {
    headView
  },
  onLoad () {
    this.headHeight = this.$store.state.navHeight + 46;
    this.getActivityList();
  },
  methods: {
    async getActivityList () {
      let activityOrder = await orderList()
      activityOrder.orderList.map(item=>{
        item.price = this.keepTwoNum(item.price)
        return item.price
      });
      this.activityOrderList = activityOrder.orderList
    },
    goOrderDetail (oid) {
      wx.navigateTo({
        url: `/pages/orderDetail/main?orderId=${oid}`
      })
    }
  }
}
</script>
  
<style lang="less" scoped>
.activityEd {
  .activityEdCont {
    width: 94%;
    margin: 0 auto;
    padding: 10px 0 20px;
    .orderListCont {
      .listLengthNo {
        padding: 25% 0;
        text-align: center;
        .imgbox {
          display: inline-block;
          width: 120px;
          height: 120px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        p {
          font-size: 20px;
        }
        button {
          margin-top: 30px;
          height: 40px;
          line-height: 40px;
          width: 40%;
          border: none;
          background-color: #da5f54;
          color: #fff;
          font-size: 18px;
          border-radius: 5px;
        }
      }
      .orderItem {
        margin: 0 auto 15px;
        border-radius: 10px;
        box-shadow: 0 4px 10px 2px #e1e1e1;
        padding: 10px 20px 20px;
        position: relative;
        .orderNumber {
          font-size: 13px;
          border-bottom: 1px solid #e1e1e1;
          padding: 10px 0;
          color: #999;
        }
        .orderName {
          padding: 15px 0;
          font-size: 16px;
          font-weight: 600;
          color: #666;
        }
        .lastLine {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          height: 30px;
          line-height: 30px;
          font-size: 12px;
          color: #999;
          .sumPrice {
            font-size: 18px;
            font-weight: 600;
            color: #666;
          }
        }
        .orderStatus {
          position: absolute;
          width: 50px;
          height: 22px;
          top: 16px;
          right: -3px;
          img {
            width: 100%;
            height: 100%;
          }
          p {
            position: absolute;
            height: 22px;
            line-height: 24px;
            width: 50px;
            text-align: center;
            top: 0;
            color: #fff;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
