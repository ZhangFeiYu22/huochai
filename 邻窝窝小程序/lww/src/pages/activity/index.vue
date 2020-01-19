<template>
  <div class="activity">
    <!-- 搜索 -->
    <div class="searchBox" @click="goSearchPage">
      <div class="search">
        <i class="iconfont searchIcon icon-search"></i>
        <input type="text" placeholder="搜索活动、团购名称" />
      </div>
    </div>
    <!-- 分类栏 -->
    <div class="typeContent">
      <div class="typeList">
        <div
          class="typeItem"
          :class="typeItemNum == index ? 'active' : ''"
          v-for="(item,index) in activityMenuList"
          :key="item.id"
          @click="activityTypeToggle(index,item.id)"
        >{{item.title}}</div>
      </div>
      <div class="carrousel w94">
        <swiper
          :indicator-dots="indicatorDots"
          :autoplay="autoplay"
          :interval="interval"
          :duration="duration"
          circular
          class="swiper-box"
          @change="swiperChange"
          v-if="adPosition6.length != 0"
        >
          <block v-for="(item,index) in adPosition6" :key="index">
            <swiper-item>
              <image :src="imgUrlHttp + item.mediaUrl" class="slide-image" mode="aspectFill" />
            </swiper-item>
          </block>
        </swiper>
        <img v-else class="default-image" src="/static/images/default_ad.jpg" mode="aspectFill" />
        <view class="dots">
          <block v-for="(item,index) in adPosition6" :key="index">
            <view :class="index == current ? ' active' : ''" class="dot"></view>
          </block>
        </view>
      </div>
      <hr class="line" />
      <div v-if="moduleActivityList.length!==0">
        <div v-for="item in moduleActivityList" :key="item.id">
          <div class="activityCSS">
            <div class="bigBox" @click="goActivity(item.id)">
              <div class="modulActivity">
                <div class="leftImg">
                  <img v-if="item.cover" :src="imgUrlHttp + item.cover" mode="aspectFill" />
                </div>
                <div class="rightCon">
                  <h4 class="ellipsis-2">{{item.title}}</h4>
                  <p class="address ellipsis-1">{{item.actAddress}}</p>
                  <p class="time">
                    <span>{{item.actTime}}</span>
                    <span
                      class="price"
                    >￥{{item.actualPrice ? item.actualPrice : item.activityPrice}}起</span>
                  </p>
                </div>
              </div>
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
import { getAdvPosition, getActivityClass, getActivityClassList } from '@/api/activity'
export default {
  components: {
    Nodata
  },
  data () {
    return {
      imgUrlHttp: globalStore.state.imgUrlHttp,
      globalMerchantId: '',   //  存储判断社区变化
      tabActiveNum: 0,
      adPosition6: [],
      indicatorDots: false,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      current: 0,
      typeItemNum: 0,
      activityMenuList: [],
      moduleActivityList: [],
      moduleActivityList2: []
    }
  },
  onLoad (options) {
    this.globalMerchantId = globalStore.state.globalMerchantId;
    if (options.activeTitle) {
      this.fetchActivityClass(options.activeTitle)
    } else {
      this.fetchActivityClass()
    }
    this.fetchAdvPosition(6)
  },
  onShow () {
    if (this.globalMerchantId !== globalStore.state.globalMerchantId) {
      this.globalMerchantId = globalStore.state.globalMerchantId;
      console.log('社区有变化')
      this.fetchActivityClass()
      this.fetchAdvPosition(6)
    }
  },
  methods: {
    // 活动分类
    async fetchActivityClass (activeTitle) {
      let activityClass = await getActivityClass()
      if (activityClass.status == 200) {
        let array = activityClass.result
        // 进行一个排序
        var new_array = array.sort(function (a, b) {
          var n1 = Number(a.sort);
          var n2 = Number(b.sort);
          return n2 - n1;
        });
        this.activityMenuList = new_array
      }      
      if (activeTitle === undefined) {
        this.activityTypeToggle(0, this.activityMenuList[0].id)
      } else {
        let act = activeTitle.replace(/\"/g, "")
        this.activityMenuList.forEach((item, index) => {
          if (item.title == act) {
            this.activityTypeToggle(index, this.activityMenuList[index].id)

          }
        })
      }

    },
    activityTypeToggle (index, id) {
      this.typeItemNum = index;
      let data = {
        id: id,
        cid: globalStore.state.globalMerchantId
      }
      getActivityClassList(data).then(res => {
        if (res.status == 200) {
          this.moduleActivityList = res.result
        }
      })
    },
    async fetchAdvPosition (position) {
      let data = {
        position: position,
        cid: globalStore.state.globalMerchantId
      }
      let adv = await getAdvPosition(data)
      if (adv.status == 200) {
        this.adPosition6 = adv.result
      }
    },
    swiperChange: function (e) {
      this.current = e.mp.detail.current
    },
    goSearchPage () {
      wx.navigateTo({
        url: '/pages/search/main'
      })
    },
    goActivity (id) {
      if (wx.getStorageSync('isLogin')) {
        wx.navigateTo({
          url: `/pages/activityDetail/main?activity_id=${id}`
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
  }
}
</script>

<style lang="less" scoped>
.activity {
  height: 30px;
  line-height: 30px;
  // 搜索
  .searchBox {
    width: 55%;
    margin: 10px auto;
    position: relative;
    .search {
      width: 100%;
      input {
        background-color: #f3f3f3;
        height: 30px;
        line-height: 30px;
        padding: 0 5px 0 35px;
        font-size: 14px;
        border-radius: 30px;
      }
      .searchIcon {
        position: absolute;
        left: 12px;
        font-size: 14px;
        color: #999;
      }
    }
  }
  .typeContent {
    .typeList {
      height: 40px;
      line-height: 40px;
      border-top: 1px solid #f6f6f6;
      border-bottom: 1px solid #f6f6f6;
      display: flex;
      justify-content: space-around;
      .typeItem {
        padding: 0 5px;
        &.active {
          font-weight: 600;
          border-bottom: 3px solid #666;
        }
      }
    }
    // 轮播
    .carrousel {
      height: 112px;
      margin: 15px auto 25px;
      position: relative;
      .swiper-box {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        overflow: hidden;
        .slide-image {
          width: 100%;
          height: 100%;
        }
      }
      .default-image {
        width: 100%;
        height: 100%;
      }
      .dots {
        position: absolute;
        right: 0;
        left: 0;
        bottom: -10px;
        display: flex;
        justify-content: center;
        .dot {
          margin: 0 4px;
          width: 5px;
          height: 5px;
          background: #dedede;
          border-radius: 5rpx;
          transition: all 0.6s;
          &.active {
            width: 11px;
            background: #fe3b30;
          }
        }
      }
    }
    .line {
      border-bottom: 1px solid #f1f1f1;
    }
  }
}
</style>