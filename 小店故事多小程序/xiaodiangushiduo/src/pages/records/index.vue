<template>
  <div class="container">
    <div class="topOneNav">
      <p
        v-for="(item,index) in navOneList"
        :key="item.id"
        :class="navOneActive == index ? 'active' : ''"
        @click="navOneClick(index)"
      >{{item.name}}</p>
    </div>
    <div v-if="showChange == navOneActive">
      <div class="nav-top navTabBox">
        <p
          v-for="(item,index) in navTwoList"
          :key="item.id"
          :class="navTabNum == index ? 'active' : ''"
          @click="navTabClick(index)"
        >{{item.name}}</p>
      </div>
      <div class="contentList" v-if="contentList.length != 0">
        <div class="contentItem" v-for="item in contentList" :key="item.id">
          <i-swipeout
            i-class="i-swipeout-demo-item"
            :operateWidth="80"
            :unclosable="true"
            :toggle="toggle"
          >
            <view slot="content">
              <div class="swipeoutItem" slot="content">
                <div class="itemImg">
                  <img :src="item.img" mode="aspectFill" alt />
                </div>
                <div class="itemInfo">
                  <h3 class="ellipsis-1">{{item.title}}</h3>
                  <p>
                    <i class="iconfont icon-iconset0207"></i>
                    <span>{{item.num}}</span>
                  </p>
                </div>
                <div class="itemSlide" @click="handlerCloseButton">...</div>
              </div>
            </view>
            <div slot="button" class="rightSlideBtn">
              <div
                class="i-swipeout-demo-button"
                style="width:80px"
                @click="actionsTap(item.articleid)"
              >不再关注</div>
            </div>
          </i-swipeout>
        </div>
      </div>
      <div v-else class="contentList_no">
        <p>暂无相关关注</p>
      </div>
    </div>
    <div v-else>
      <div class="orderList" v-if="orderListData.length != 0">
        <div
          class="orderItem"
          v-for="item in orderListData"
          :key="item.id"
          @click="goPageDetail(item)"
        >
          <div class="ordeInfo">
            <div class="itemImg">
              <img :src="item.coverimgurl" mode="aspectFill" alt />
            </div>
            <div class="itemInfo">
              <h3 class="ellipsis-1">{{item.title}}{{item.title}}</h3>
              <p class="orderNum">订单编号: {{item.payno}}</p>
              <!-- <p class="address ellipsis-1">秦淮区御道街街道金蝶创意园H1秦淮区御道街街道金蝶创意园H</p>
              <p class="startTime">2019-4-12 10:00 至 16:00</p>-->
            </div>
          </div>
          <div class="orderTime">
            <p class="time">
              订单时间:
              <span>{{item.createtime}}</span>
            </p>
            <!-- <p class="price">￥20.00</p> -->
          </div>
        </div>
      </div>
      <div v-else class="contentList_no">
        <p>暂无相关订单</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showChange: 0,
      navOneActive: 0,
      navOneList: [
        { id: 1, name: '我的收藏' },
        { id: 2, name: '我的订单' }
      ],
      navTabNum: 0,
      navTwoList: [
        { id: 1, name: '全部' },
        { id: 2, name: '活动' },
        { id: 3, name: '项目' },
        { id: 4, name: '课程' },
        { id: 5, name: '人物' }
      ],
      toggle2: false,
      actions: [
        {
          name: '不再关注',
          color: '#fff',
          fontsize: '20',
          width: 100,
          icon: 'like',
          background: '#039A79'
        }
      ],
      contentListAll: [],
      contentList: [],
      orderListData: []
    }
  },
  mounted () {
    this.getDataList();
  },
  onShow () {
    this.navTabNum = 0;
    this.getDataList();
  },
  methods: {
    getDataList () {
      this.$http.get({
        url: `collect/list`
      }).then(res => {
        this.contentListAll = res;
        this.contentList = res;
        this.switchFun(this.navTabNum);
      });
      this.$http.get({
        url: `order/list`
      }).then(res => {
        this.orderListData = res;
        console.log('orderList--', res)
      });
    },
    navOneClick (indx) {
      this.navOneActive = indx;
    },
    navTabClick (indx) {
      console.log('indx---', indx)
      this.navTabNum = indx;
      this.switchFun(this.navTabNum);
    },
    // 1人物、2课程、3项目、4活动、5分享   
    switchFun (num) {
      switch (num) {
        case 1:
          this.contentList = this.contentListAll.filter(item => item.type == 4)
          break;
        case 2:
          this.contentList = this.contentListAll.filter(item => item.type == 3)
          break;
        case 3:
          this.contentList = this.contentListAll.filter(item => item.type == 2)
          break;
        case 4:
          this.contentList = this.contentListAll.filter(item => item.type == 1)
          break;
        default:
          this.contentList = this.contentListAll
          break;
      }
    },
    handlerCloseButton () {
      console.log(this.toggle2)
      this.toggle2 = this.toggle2 ? false : true
    },
    actionsTap (aId) {
      let _this = this;
      wx.showModal({
        title: '提示',
        content: '确定取消关注吗?',
        success (res) {
          if (res.confirm) {
            console.log('确定')
            _this.$http.get({
              url: `collect/delete/${aId}`
            }).then(res => {
              if (res.code == 200) {
                _this.getDataList();
                wx.showToast({
                  title: '操作成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            });
          } else if (res.cancel) {
            console.log('取消')
          }
        }
      })
    },
    goPageDetail (dataItem) {
      console.log('11---------', dataItem)
      var typeId = dataItem.type;
      var artivleId = dataItem.articleid;
      switch (typeId) {
        // case 1:
        //   wx.navigateTo({
        //     url: `/pages/personDetail/main?id=${artivleId}&isShare=${artivleId}`
        //   })
        //   break;
        case 2:
          wx.navigateTo({
            url: `/pages/courseDetail/main?id=${artivleId}&isShare=${artivleId}`
          })
          break;
        // case 3:
        //   wx.navigateTo({
        //     url: `/pages/projectDetail/main?id=${artivleId}&isShare=${artivleId}`
        //   })
        //   break;
        case 4:
          wx.navigateTo({
            url: `/pages/activityDetail/main?id=${artivleId}&isShare=${artivleId}`
          })
          break;
        default:
          break;
      }
    }
  }
}
</script>

<style scoped lang="less">
.container {
  .topOneNav {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 28px;
    line-height: 28px;
    margin-bottom: 5px;
    p {
      color: #999;
      font-weight: 600;
      font-size: 28rpx;
      &.active {
        color: #039a79;
        border-bottom: 2px solid #039a79;
      }
    }
  }
  .nav-top {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    border-bottom: 1px solid #f5f5f5;
    height: 28px;
    line-height: 28px;
    &.navTabBox {
      p {
        color: #999;
        font-weight: 600;
        font-size: 28rpx;
        &.active {
          color: #ff4a4a;
          border-bottom: none;
        }
      }
    }
  }
  .contentList {
    .contentItem {
      width: 100%;
      i-swipeout {
        width: 100%;
        .i-swipeout-item {
          padding: 0;
        }
      }
      .swipeoutItem {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .itemImg {
          // width: 20%;
          width: 120rpx;
          height: 120rpx;
          border-radius: 100%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .itemInfo {
          width: 60%;
          h3 {
            font-size: 28rpx;
            font-weight: 600;
            line-height: 40px;
          }
          p {
            height: 20px;
            color: #039a79;
            font-weight: 600;
            font-size: 24rpx;
            i {
              display: inline-block;
              margin-right: 5px;
              vertical-align: top;
            }
            span {
              vertical-align: top;
            }
          }
        }
        .itemSlide {
          width: 10%;
          font-weight: 600;
          margin-top: 70rpx;
        }
      }
      .rightSlideBtn {
        background-color: #039a79;
        color: #fff;
        height: 120rpx;
        line-height: 120rpx;
        margin-top: 15px;
        text-align: center;
        &.order {
          background-color: #ff4a4a;
        }
      }
    }
  }
  .orderList {
    width: 95%;
    margin: 0 auto;
    .orderItem {
      box-shadow: 0 0 2px 2px #f1f1f1;
      margin-bottom: 15px;
      padding: 10px;
      border-radius: 5px;
      .ordeInfo {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        box-sizing: border-box;
        .itemImg {
          width: 36%;
          height: 160rpx;
          border-radius: 5px;
          overflow: hidden;
        }
        .itemInfo {
          width: 60%;
          font-size: 24rpx;
          color: #333;
          h3 {
            font-weight: 600;
            font-size: 30rpx;
          }
          .orderNum {
            margin-top: 20px;
          }
          .address {
            margin-top: 20px;
          }
          .startTime {
            margin-top: 5px;
          }
        }
      }
    }
    .orderTime {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 10px;
      line-height: 20px;
      .time {
        font-size: 24rpx;
        color: #999;
      }
      .price {
        color: #333;
      }
    }
  }
  .contentList_no {
    position: absolute;
    width: 50%;
    height: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    display: flex;
    align-items: center;
    p {
      margin: 0 auto;
      color: #999;
      font-size: 40rpx;
    }
  }
}
</style>
