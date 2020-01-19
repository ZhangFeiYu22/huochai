<template>
  <div class="myCounterfoil">
    <!-- 分类栏 -->
    <div class="typeContent">
      <div class="typeList">
        <div
          class="typeItem"
          :class="typeNavNum == item.status ? 'active' : ''"
          v-for="item in typeNavList"
          :key="item.id"
          @click="typeNavToggle(item.status)"
        >{{item.name}}</div>
      </div>
      <div v-if="voucherListShow.length !== 0">
        <div v-for="item in voucherListShow" :key="item.id" @click.stop="goCouponPage(item)">
          <div class="voucherBox">
            <div class="orderNum">
              <p class="num">
                订单号:
                <span>{{item.orderNo}}</span>
              </p>
              <p class="status" v-if="item.status == 3">待付款</p>
              <p class="status" v-if="item.status == 4">待验票</p>
              <p class="status" v-if="item.status == 5">已使用</p>
            </div>
            <div class="orderContent">
              <div class="leftImg">
                <img v-if="item.img" :src="imgUrlHttp + item.img" mode="aspectFill" />
              </div>
              <div class="rightInfo">
                <p class="infoTitle">{{item.title}}</p>
                <p class="infoUse">{{item.merchantAddress}}</p>
                <div class="bottom">
                  <p>
                    共
                    <span>{{item.num}}</span>件商品 实付总额:
                    <span>￥{{item.totalPrice}}</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="btnBox" v-if="item.status==3">
              <p class="deleteBtn" @click.stop="delCouponOrder(item)">删除订单</p>
              <p class="goon" @click.stop="goCouponPage(item)">继续支付</p>
            </div>
            <div class="btnBox" v-if="item.status==4">
              <p class="buyAgain" @click.stop="againSureOrderPage(item.voucherId)">再次购买</p>
            </div>
            <div class="btnBox" v-if="item.status==5">
              <p class="deleteBtn" @click.stop="delCouponOrder(item)">删除订单</p>
              <p class="buyAgain" @click.stop="againSureOrderPage(item.voucherId)">再次购买</p>
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
import { getVoucherList, continueBuyVoucher, delVoucherOrder } from '@/api/order'
export default {
  components: {
    Nodata
  },
  data () {
    return {
      imgUrlHttp: globalStore.state.imgUrlHttp,
      tabActiveNum: 0,
      typeNavNum: 0,
      typeNavList: [
        { status: 0, name: '全部' },
        { status: 3, name: '待付款' },
        { status: 4, name: '待验票' },
        { status: 5, name: '已核销' }
      ],
      voucherListAll: [],
      voucherListAll_1: [],
      voucherListAll_2: [],
      voucherListAll_3: [],
      voucherListShow: []

    }
  },
  onLoad (options) {
    if (options.active_kinds == 'all') {
      this.typeNavNum = 0
    } else if (options.active_kinds == 'waitPay') {
      this.typeNavNum = 3
    } else if (options.active_kinds == 'waitVerfy') {
      this.typeNavNum = 4
    } else if (options.active_kinds == 'used') {
      this.typeNavNum = 5
    }
    this.fetchVoucherList()
  },
  methods: {
    async fetchVoucherList () {
      let voucherList = await getVoucherList()
      if (voucherList.status == 200) {
        this.voucherListAll = voucherList.result
        this.voucherListShow = voucherList.result
        let newArr_1 = []  //待付款
        let newArr_2 = []  //待验票
        let newArr_3 = []  //已使用
        let arr = voucherList.result
        for (let i in arr) {
          if (arr[i].status == 3) {
            newArr_1.push(arr[i])
          } else if (arr[i].status == 4) {
            newArr_2.push(arr[i])
          } else if (arr[i].status == 5) {
            newArr_3.push(arr[i])
          }
        }
        this.voucherListAll_1 = newArr_1
        this.voucherListAll_2 = newArr_2
        this.voucherListAll_3 = newArr_3
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
        this.voucherListShow = this.voucherListAll
      } else if (num == 3) {
        this.voucherListShow = this.voucherListAll_1
      } else if (num == 4) {
        this.voucherListShow = this.voucherListAll_2
      } else if (num == 5) {
        this.voucherListShow = this.voucherListAll_3
      }
    },
    // 继续支付   未支付继续支付   支付完成跳转详情
    goCouponPage (item) {
      var _this = this
      if (item.status == 3) {
        wx.showModal({
          title: '提示',
          content: '您还未付款,是否去支付',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              _this.continueBuyVoucherFun(item);
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else if (item.status == 4) {
        wx.navigateTo({
          url: `/pages/couponOrderDetail/main?orderNo=${item.orderNo}`
        })
      } else if (item.status == 5) {
        wx.navigateTo({
          url: `/pages/cashCoupon/main?choice_id=${item.voucherId}`
        })
      }
    },
    // 删除订单
    delCouponOrder (item) {
      var _this = this
      wx.showModal({
        title: '提示',
        content: '确定删除吗?',
        success: function (res) {
          if (res.confirm) {
            delVoucherOrder(item.id).then(res => {
              if (res.status == 200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                _this.fetchVoucherList();
              }
            })
          }
        }
      })
    },
    // 再次购买
    againSureOrderPage (id) {
      wx.navigateTo({
        url: `/pages/sureCoupon/main?voucherId=${id}`
      })
    },
    // 继续支付
    async continueBuyVoucherFun (item) {
      var _this = this;
      let orderRes = await continueBuyVoucher(item.id)
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
              _this.fetchVoucherList()
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
.myCounterfoil {
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
  .voucherBox {
    border-bottom: 10px solid #f1f1f1;
    .orderNum {
      display: flex;
      padding: 5px 15px 5px 20px;
      justify-content: space-between;
      border-bottom: 1px solid #f6f6f6;
      font-size: 14px;
      line-height: 30px;
      .num {
        span {
          margin-left: 2px;
          color: #999;
        }
      }
      .status {
        background-color: #ff3b30;
        color: #fff;
        font-size: 12px;
        padding: 0 10px;
        height: 20px;
        line-height: 20px;
        margin-top: 5px;
        float: right;
      }
    }
    .orderContent {
      display: flex;
      justify-content: space-between;
      padding: 10px 15px;
      border-bottom: 1px solid #f6f6f6;
      .leftImg {
        width: 110px;
        height: 110px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
      }
      .rightInfo {
        flex: 1;
        padding: 0 15px;
        position: relative;
        .infoTitle {
          font-size: 14px;
          line-height: 16px;
          font-weight: 600;
        }
        .infoUse {
          color: #999;
          font-size: 12px;
          margin-top: 5px;
          line-height: 16px;
        }
        .bottom {
          position: absolute;
          bottom: 0;
          right: 0;
          font-size: 13px;
          line-height: 16px;
          p {
            span {
              font-size: 14px;
              margin-left: 20px;
              color: #ff0000;
            }
          }
        }
      }
    }
    .btnBox {
      display: flex;
      justify-content: flex-end;
      border-bottom: 1px solid #f6f6f6;
      padding: 10px 15px;
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