<template>
  <div class="myOrder">
    <!-- 分类栏 -->
    <div class="typeContent">
      <div class="typeList">
        <div
          class="typeItem"
          :class="typeNavNum == item.status ? 'active' : ''"
          v-for="item in typeNavList"
          :key="item.status"
          @click="typeNavToggle(item.status)"
        >{{item.name}}</div>
      </div>
      <div v-if="orderListShow.length !== 0">
        <div
          v-for="item in orderListShow"
          :key="item.id"
          @click.stop="goOrderActivity(item)"
          v-if="item.status!=2"
        >
          <div class="bigBox">
            <div class="counterfoil">
              <p>
                订单号:
                <span class="num">{{item.orderNo}}</span>
              </p>
              <p class="status" v-if="item.status == 3">待付款</p>
              <p class="status" v-else-if="item.status == 4">可使用</p>
              <p class="status" v-else-if="item.status == 5">已完成</p>
            </div>
            <div class="modulActivity">
              <div class="leftImg">
                <img v-if="item.img" :src="imgUrlHttp + item.img" mode="aspectFill" />
              </div>
              <div class="rightCon">
                <h4 class="ellipsis-2">{{item.title}}</h4>
                <p class="address ellipsis-1">{{item.actAddress}}</p>
                <p class="time">
                  <span>{{item.actTime}}</span>
                </p>
              </div>
            </div>
            <div class="counterfoil_num_price clearfix">
              <p>￥{{item.totalPrice}}</p>
              <p>x{{item.num}}</p>
            </div>
            <div class="btnBox" v-if="item.status == 3">
              <p class="deleteBtn" @click.stop="delActivityOrderFun(item)">删除订单</p>
              <p class="buyAgain" @click.stop="goOrderActivity(item)">继续支付</p>
            </div>
            <div class="btnBox" v-if="item.status==4">
              <p class="buyAgain" @click.stop="againSureOrderPage(item.activityId)">再次购买</p>
            </div>
            <div class="btnBox" v-if="item.status==5">
              <p class="deleteBtn" @click.stop="delActivityOrderFun(item)">删除订单</p>
              <p class="buyAgain" @click.stop="againSureOrderPage(item.activityId)">再次购买</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <Nodata :text="'暂无你要的数据'"></Nodata>
      </div>
    </div>
  </div>
</template>

<script>
import globalStore from '@/utils/store'
import Nodata from '../../components/Nodata'
import { getOrderActivity, continueBuyActivity, delActivityOrder } from '@/api/order.js'
export default {
  components: {
    Nodata
  },
  data () {
    return {
      imgUrlHttp: globalStore.state.imgUrlHttp,
      typeNavNum: 0,
      typeNavList: [
        { status: 0, name: '全部' },
        { status: 3, name: '待付款' },
        { status: 4, name: '可使用' },
        { status: 5, name: '已完成' }
      ],
      orderListAll_1: [],
      orderListAll_2: [],
      orderListAll_3: [],
      orderListAll: [],
      orderListShow: []
    }
  },
  onLoad (options) {
    this.fetchOrderActivity()
    if (options.active_kinds == 'all') {
      this.typeNavNum = 0
    } else if (options.active_kinds == 'wait') {
      this.typeNavNum = 3
    } else if (options.active_kinds == 'canUse') {
      this.typeNavNum = 4
    } else if (options.active_kinds == 'finish') {
      this.typeNavNum = 5
    }
  },
  methods: {
    async fetchOrderActivity () {
      let orderList = await getOrderActivity()
      if (orderList.status == 200) {
        console.log(orderList)
        let newArr_1 = []  //待付款
        let newArr_2 = []  //可使用
        let newArr_3 = []  //已完成
        this.orderListAll = orderList.result
        this.orderListShow = orderList.result
        let arr = orderList.result
        for (let i in arr) {
          if (arr[i].status == 3) {
            newArr_1.push(arr[i])
          } else if (arr[i].status == 4) {
            newArr_2.push(arr[i])
          } else if (arr[i].status == 5) {
            newArr_3.push(arr[i])
          }
        }
        this.orderListAll_1 = newArr_1
        this.orderListAll_2 = newArr_2
        this.orderListAll_3 = newArr_3
        this.fetChTypeNavNum(this.typeNavNum)
      }

    },
    typeNavToggle (status) {
      this.typeNavNum = status;
      this.fetChTypeNavNum(status)
    },
    // 根据激活的第几个数typeNavNum  来选择判断显示
    fetChTypeNavNum (num) {
      if (num == 0) {
        this.orderListShow = this.orderListAll
      } else if (num == 3) {
        this.orderListShow = this.orderListAll_1
      } else if (num == 4) {
        this.orderListShow = this.orderListAll_2
      } else if (num == 5) {
        this.orderListShow = this.orderListAll_3
      }
    },
    // 删除订单
    delActivityOrderFun (item) {
      var _this = this
      wx.showModal({
        title: '提示',
        content: '确定删除吗?',
        success: function (res) {
          if (res.confirm) {
            delActivityOrder(item.id).then(res => {
              if (res.status == 200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                _this.fetchOrderActivity();
              }
            })
          }
        }
      })
    },
    // 再次购买
    againSureOrderPage (id) {
      wx.navigateTo({
        url: `/pages/signUp/main?activityId=${id}`
      })
    },
    // 继续支付    未支付继续支付   支付完成跳转详情
    goOrderActivity (item) {
      var _this = this;
      if (item.status == 3) {
        wx.showModal({
          title: '提示',
          content: '您还未付款,是否去支付',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              _this.continueBuyActivityFun(item);
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else if (item.status == 4) {
        wx.navigateTo({
          url: `/pages/counterfoilOrderDetail/main?orderNo=${item.orderNo}`
        })
      } else if (item.status == 5) {
        wx.navigateTo({
          url: `/pages/activityDetail/main?activity_id=${item.activityId}`
        })
      }
    },
    // 继续支付
    async continueBuyActivityFun (item) {
      var _this = this;
      let orderRes = await continueBuyActivity(item.id)
      console.log('3----', orderRes)
      if (orderRes.status == 200) {
        let payNeed = orderRes.result
        wx.requestPayment({
          'timeStamp': payNeed.timeStamp,
          'nonceStr': payNeed.nonceStr,
          'package': payNeed.packageValue,
          'signType': 'MD5',
          'paySign': payNeed.paySign,
          'success': function (res) {
            console.log('success---', res)
            if (res.errMsg == "requestPayment:ok") {  // 调用支付成功  跳转
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 2000
              });
              _this.fetchOrderActivity()
            } else if (res.errMsg == 'requestPayment:cancel') {// 用户取消支付的操作
              wx.showToast({
                title: '请支付',
                icon: "none",
                duration: 2000
              })
            }
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败,请稍后再试',
              icon: "none",
              duration: 2000
            })
          },
          'complete': function (res) { }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.myOrder {
  .typeList {
    height: 40px;
    line-height: 40px;
    border-top: 1px solid #f6f6f6;
    border-bottom: 1px solid #f6f6f6;
    display: flex;
    justify-content: space-around;
    .typeItem {
      padding: 0 5px;
      color: #666;
      font-size: 14px;
      &.active {
        font-weight: 600;
        color: #333;
        border-bottom: 3px solid #666;
      }
    }
  }
  .bigBox {
    border-bottom: 5px solid #f1f1f1;
    .counterfoil {
      display: flex;
      padding: 5px 15px 5px 20px;
      justify-content: space-between;
      border-bottom: 1px solid #f6f6f6;
      font-size: 14px;
      line-height: 30px;
      .num {
        color: #666;
      }
      .status {
        background: #ff3b30;
        color: #fff;
        font-size: 12px;
        padding: 0 10px;
        height: 20px;
        line-height: 20px;
        margin-top: 5px;
        float: right;
      }
    }
    .modulActivity {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 15px 10px 0 10px;
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
        flex: 1;
        width: 50%;
        h4 {
          height: 40px;
          font-weight: 600;
          font-size: 14px;
          line-height: 20px;
        }
        .address {
          color: #999;
          font-size: 12px;
          height: 30px;
          line-height: 30px;
        }
        .time {
          color: #999;
          height: 20px;
          font-size: 12px;
          line-height: 20px;
        }
      }
    }
    .counterfoil_num_price {
      border-bottom: 1px solid #f1f1f1;
      padding: 0 10px;
      p {
        float: right;
        margin-left: 25px;
        color: #999;
        font-size: 14px;
        line-height: 26px;
      }
    }
    .btnBox {
      display: flex;
      justify-content: flex-end;
      border-bottom: 1px solid #f6f6f6;
      padding: 10px;
      p {
        border: 1px solid #999;
        font-size: 12px;
        line-height: 14px;
        padding: 3px 12px;
        color: #666;
        margin-left: 10px;
        border-radius: 5px;
      }
    }
  }
}
</style>
