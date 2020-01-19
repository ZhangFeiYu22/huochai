<template>
  <div class="home">
    <!-- 地址  搜索 -->
    <div class="address-search w95">
      <div class="address" @click="onAddressModalShow">
        <i class="iconfont icon-dizhi addressIcon"></i>
        <span>{{communityName}}</span>
      </div>
      <div class="searchBox" @click="goSearchPage">
        <div class="search">
          <i class="iconfont searchIcon icon-search"></i>
          <input type="text" placeholder="搜索精选、活动" />
        </div>
      </div>
    </div>
    <!-- 轮播 -->
    <div class="carrousel w95">
      <swiper
        :indicator-dots="indicatorDots"
        :autoplay="autoplay"
        :interval="interval"
        :duration="duration"
        circular
        class="swiper-box"
        @change="swiperChange"
        v-if="adPosition4.length != 0"
      >
        <block v-for="(item,index) in adPosition4" :key="index">
          <!-- mediaType  为 1  图片   为 2  视频 -->
          <swiper-item>
            <image
              v-if="item.mediaType == 1"
              :src="imgUrlHttp + item.mediaUrl"
              class="slide-image"
              mode="aspectFill"
            />
            <video
              v-else
              objectFit="cover"
              :controls="swiperVideoControl"
              :show-center-play-btn="swiperVideoPlayBtn"
              class="slide-video"
              :src="imgUrlHttp + item.mediaUrl"
            ></video>
          </swiper-item>
        </block>
      </swiper>
      <img v-else class="default-image" src="/static/images/default_ad.jpg" mode="aspectFill" />
      <view class="dots">
        <block v-for="(item,index) in adPosition4" :key="index">
          <view :class="index == current ? ' active' : ''" class="dot"></view>
        </block>
      </view>
    </div>
    <!-- 大分类菜单 -->
    <scroll-view class="navMenu w95" scroll-x>
      <div
        class="menuItem"
        v-for="(item,index) in menuList"
        :key="item.id"
        @click="goMenu(item,index)"
      >
        <div class="imgBox">
          <image :src="imgUrlHttp + item.icon" mode="aspectFill" />
        </div>
        <p>{{item.title}}</p>
      </div>
    </scroll-view>
    <!-- 广告位1 -->
    <div class="adBox w95 mt20">
      <image v-if="adPosition1" :src="imgUrlHttp + adPosition1" mode="aspectFill" />
      <image v-else src="/static/images/default_ad.jpg" mode="aspectFill" />
    </div>
    <!-- 栏目1   精彩活动 -->
    <div class="columnTitle mt10">
      <div class="cont w95">
        <h2>精彩活动</h2>
        <span @click="moreActivity">more></span>
      </div>
    </div>
    <div class="columnMenuBox">
      <scroll-view class="columnMenu w95" scroll-x>
        <div class="menuItem" v-for="(item,index) in greatEventsMenuList" :key="item.id">
          <p
            :class="ge_Num == index ? 'active':''"
            @click="activityTypeToggle(index,item)"
          >{{item.title}}</p>
        </div>
      </scroll-view>
    </div>
    <!-- 精彩活动 内容 -->
    <div class="greatEventsContent">
      <div v-for="(item,index) in moduleActivityList" :key="item.id">
        <div class="activityCSS" v-if="index < 4">
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
                  <span class="price">￥{{item.actualPrice ? item.actualPrice : item.activityPrice}}起</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 广告位2 -->
    <div class="adBox w95 mt20">
      <image v-if="adPosition2" :src="imgUrlHttp + adPosition2" mode="aspectFill" />
      <image v-else src="/static/images/default_ad.jpg" mode="aspectFill" />
    </div>
    <!-- 栏目2   今日精选(代金券) -->
    <div class="columnTitle mt30">
      <div class="cont w95">
        <h2>今日精选</h2>
        <i class="iconfont icon-hot"></i>
        <span @click="moreVoucher">more></span>
      </div>
    </div>
    <div class="columnMenuBox">
      <scroll-view class="columnMenu w95" scroll-x>
        <div class="menuItem" v-for="(item,index) in todayPinMenuList" :key="item.id">
          <p :class="ge_Num2 == index ? 'active':''" @click="couponToggle(index,item)">{{item.name}}</p>
        </div>
      </scroll-view>
    </div>
    <!-- 今日精选  内容 -->
    <div class="todayChoice mt10">
      <div v-for="(item,index) in ChoicenessList" :key="item.id">
        <div class="voucherCSS" @click.stop="goChoicenessPage(item.id)" v-if="index < 4">
          <div class="choiceImg" v-if="item.coverOne">
            <img v-if="item.coverOne" :src="imgUrlHttp + item.coverOne" mode="aspectFill" />
          </div>
          <div class="choiceContent">
            <div class="c1">
              <p class="title ellipsis-1">{{item.name}}</p>
            </div>
            <div class="c2 ellipsis-1">{{item.subName}}</div>
            <button class="grabNow">马上抢</button>
            <div class="c3">
              <p>
                <span class="now">￥{{item.actualPrice}}</span>
                <span class="old">￥{{item.showPrice}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 地址选择弹出 -->
    <div class="bg" v-if="addressModalShow" @click.stop="onClose">
      <div class="selectAddressDialog">
        <div class="select_box">
          <p
            class="select_one"
            :class="selectNum == index?'selEd' : ''"
            @click.stop="onSelect(item)"
            v-for="(item,index) in addressModalList"
            :key="item.id"
          >{{item.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import globalStore from '@/utils/store'
import { getHomeClass, getAdvPosition, getCommunitys, getActivityClass, getHomeActivityList, getHomeVoucherList } from '@/api/home'
export default {
  data () {
    return {
      refreshVal: false,  //控制停止刷新
      imgUrlHttp: globalStore.state.imgUrlHttp,
      communityName: "",
      searchValue: '',
      clearableV: false,
      adPosition1: '',
      adPosition2: '',
      adPosition4: [],
      indicatorDots: false,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      current: 0,
      swiperVideoControl: false,   //是否显示视频播放的控件
      swiperVideoPlayBtn: false,  //是否显示中间播放图标按钮
      menuList: [],
      addressModalShow: false,
      addressModalList: [],
      moduleActivityList: [],
      ge_Num: 0,
      ge_Num2: 0,
      greatEventsMenuList: [],
      todayPinMenuList: [
        { id: 1, type: 1, name: '精选' },
        { id: 2, type: 2, name: '美食' },
        { id: 3, type: 3, name: '生活' },
        { id: 4, type: 4, name: '健康' }
      ],
      ChoicenessList: [],
      selectNum: 0
    }
  },
  onLoad () {
    this.fetchHomeClassFun()  //获取首页菜单分类
    this.fetchActivityClass();   //获取精彩活动的分类
    this.fetchCommunitys()   //获取社区列表
  },
  methods: {
    // 社区列表
    async fetchCommunitys () {
      let communitysList = await getCommunitys()
      if (communitysList.status == 200) {
        this.addressModalList = communitysList.result
        // 暂时选择浦外路社区
        if (globalStore.state.globalMerchantId) {
          globalStore.commit('changeMerchantId', globalStore.state.globalMerchantId)
        } else {
          this.communityName = this.addressModalList[1].name
          globalStore.commit('changeMerchantId', this.addressModalList[1].id)
        }
        this.refurbishFun()
      }
    },
    refurbishFun () {
      this.fetchAdvPosition(1, globalStore.state.globalMerchantId)   //获取广告位
      this.fetchAdvPosition(2, globalStore.state.globalMerchantId)    //获取广告位
      this.fetchAdvPosition(4, globalStore.state.globalMerchantId)    //获取广告位
      this.fetchActivityAll(globalStore.state.globalMerchantId)
      this.fetchVoucherAll(globalStore.state.globalMerchantId)

    },
    // 广告
    async fetchAdvPosition (position, cid) {
      this.adPosition1 = ''
      this.adPosition2 = ''
      this.adPosition4 = []
      let data = {
        position: position,
        cid: cid
      }
      let adv = await getAdvPosition(data)
      if (position == 1) {
        if (adv.result.length != 0) {
          this.adPosition1 = adv.result[0].mediaUrl
        } else {
          this.adPosition1 = ''
        }
      } else if (position == 2) {
        if (adv.result.length != 0) {
          this.adPosition2 = adv.result[0].mediaUrl
        } else {
          this.adPosition2 = ''
        }
      } else if (position == 4) {
        if (adv.result.length != 0) {
          this.adPosition4 = adv.result
        } else {
          this.adPosition4 = []
        }
      }
    },
    // 首页菜单分类
    async fetchHomeClassFun () {
      let homeClass = await getHomeClass();
      if (homeClass.status == 200) {
        let array = homeClass.result
        // 进行一个排序
        var new_array = array.sort(function (a, b) {
          var n1 = Number(a.sort);
          var n2 = Number(b.sort);
          return n1 - n2;
        });
        this.menuList = new_array
      }
    },
    // 精彩活动分类
    async fetchActivityClass () {
      let activityClass = await getActivityClass()
      if (activityClass.status == 200) {
        let array = activityClass.result
        // 进行一个排序
        var new_array = array.sort(function (a, b) {
          var n1 = Number(a.sort);
          var n2 = Number(b.sort);
          return n2 - n1;
        });
        this.greatEventsMenuList = new_array
        // 挑选是否展示首页的分类
        for (let i = 0; i < this.greatEventsMenuList.length; i++) {
          if (this.greatEventsMenuList[i].isHome == 2) {
            this.greatEventsMenuList.splice(i, 1)
            i--
          }
        }
      }
    },
    // 轮播切换时控制指示点切换
    swiperChange: function (e) {
      this.current = e.mp.detail.current
    },
    // 精彩活动点击切换
    activityTypeToggle (index, item) {
      this.moduleActivityList = []
      this.ge_Num = index;
      this.moduleActivityList = item.activilyList
    },
    // 跳转活动详情
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
    },
    //得到首页所有的活动列表  根据社区id   cid
    async fetchActivityAll (cid) {
      let resAc = await getHomeActivityList(cid);
      let resData = resAc.result
      //筛选给活动分类下面添加一个字段用来存储  当前分类下的活动列表
      for (let i = 0; i < this.greatEventsMenuList.length; i++) {
        this.greatEventsMenuList[i].activilyList = []   //新添加一个属性,用于切换
        for (let j = 0; j < resData.length; j++) {
          if (this.greatEventsMenuList[i].id == resData[j].classId) {
            this.greatEventsMenuList[i].activilyList.push(resData[j])
          }
        }
      }
      // 激活第一个精彩活动类别
      this.moduleActivityList = this.greatEventsMenuList[0].activilyList
    },
    // 今日精选点击切换
    couponToggle (index, item) {
      this.ChoicenessList = []
      this.ge_Num2 = index;
      this.ChoicenessList = item.voucherList
    },
    //得到首页所有的精选(代金券)列表  根据社区id   cid
    async fetchVoucherAll (cid) {
      let resVo = await getHomeVoucherList(cid);
      let resData = resVo.result
      //筛选给精选(代金券)分类下面添加一个字段用来存储  当前分类下的精选(代金券)列表
      for (let i = 0; i < this.todayPinMenuList.length; i++) {
        this.todayPinMenuList[i].voucherList = []   //新添加一个属性,用于切换
        for (let j = 0; j < resData.length; j++) {
          if (this.todayPinMenuList[i].type == resData[j].type) {
            this.todayPinMenuList[i].voucherList.push(resData[j])
          }
        }
      }
      // 激活第一个 精选(代金券) 类别
      this.ChoicenessList = this.todayPinMenuList[0].voucherList

      //终止刷新
      if (this.refreshVal) {
        wx.stopPullDownRefresh()
      }
    },
    // 跳转精选(代金券)详情
    goChoicenessPage (id) {
      if (wx.getStorageSync('isLogin')) {
        wx.navigateTo({
          url: `/pages/cashCoupon/main?choice_id=${id}`
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
    },
    // 去搜索页进行搜索
    goSearchPage () {
      wx.navigateTo({
        url: '/pages/search/main'
      })
    },
    // 点击进行地址选择   显示弹窗
    onAddressModalShow () {
      this.addressModalShow = true;
      this.addressModalList.forEach((item, index) => {
        if (this.communityName == item.name) {
          this.selectNum = index
        }
      });
    },
    // 地址选择关闭   点击遮罩层
    onClose () {
      this.addressModalShow = false;
    },
    // 地址选择
    onSelect (item) {
      this.addressModalShow = false;
      this.communityName = item.name
      globalStore.commit('changeMerchantId', item.id)
      this.refurbishFun()
    },
    // 菜单跳转    跳转生活服务
    goMenu (item, index) {
      let ofVal_life = item.jumpPath.indexOf("lifeService")
      let ofVal_act = item.jumpPath.indexOf("activity")
      let ofVal_https = item.jumpPath.indexOf("https")
      let ofVal_app = item.jumpPath.indexOf("personList")
      if (ofVal_life != -1) {
        wx.navigateTo({
          url: item.jumpPath
        })
      } else if (ofVal_act != -1) {
        wx.reLaunch({
          url: item.jumpPath
        })
      } else if (ofVal_https != -1) {
        wx.navigateTo({
          url: `/pages/aLink/main`
        })
      } else if (ofVal_app != -1) {
        wx.navigateToMiniProgram({
          appId: 'wx98fa9989372e7856',
          path: item.jumpPath,
          extraData: {
            foo: 'bar'
          },
          envVersion: 'trial',
          success (res) {
            // 打开成功
          }
        })
      }
    },
    // 更多活动
    moreActivity () {
      wx.switchTab({
        url: '/pages/activity/main'
      })
    },
    // 更多代金券
    moreVoucher () {
      wx.switchTab({
        url: '/pages/choiceTab/main'
      })
    }
  },
  onPullDownRefresh () {
    this.refreshVal = true
    this.fetchHomeClassFun()  //获取首页菜单分类
    this.fetchActivityClass();   //获取精彩活动的分类
    this.fetchCommunitys()   //获取社区列表
  },
}
</script>


<style lang="less" scoped>
.home {
  margin: 10px auto;
  // 地址  搜索栏
  .address-search {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    justify-items: center;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    .address {
      min-width: 125px;
      height: 30px;
      line-height: 30px;
      .addressIcon {
        font-size: 20px;
        color: #000;
      }
      span {
        font-size: 14px;
        margin-left: 5px;
      }
    }
    .searchBox {
      width: 55%;
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
  }
  // 轮播
  .carrousel {
    height: 164px;
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
      .slide-video {
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
        display: block;
        margin: 0 4px;
        width: 5px;
        height: 5px;
        background: #dedede;
        border-radius: 5rpx;
        transition: all linear 0.3s;
        &.active {
          width: 11px;
          background: #fe3b30;
        }
      }
    }
  }
  // 大分类菜单
  .navMenu {
    width: 100%;
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    .menuItem {
      width: 20%;
      min-width: 48px;
      display: inline-block;
      text-align: center;
      .imgBox {
        display: inline-block;
        width: 48px;
        height: 48px;
        image {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      p {
        height: 24px;
        line-height: 24px;
        font-size: 16px;
      }
    }
  }
  //广告位1
  .adBox {
    height: 100px;
    border-radius: 8px;
    overflow: hidden;
    image {
      width: 100%;
      height: 100%;
    }
  }
  // 栏目标题
  .columnTitle {
    border-bottom: 1px solid #f1f1f1;
    .cont {
      height: 30px;
      line-height: 30px;
      position: relative;
      border-left: 5px solid #ff3b30;
      padding-left: 10px;
      h2 {
        display: inline-block;
        font-weight: 600;
        font-size: 22px;
      }
      .icon-hot {
        color: #fe3b30;
        font-size: 25px;
        margin-left: 10px;
        margin-bottom: 10px;
      }
      span {
        display: block;
        float: right;
        background-color: #ff3b30;
        height: 18px;
        line-height: 18px;
        padding: 0 6px;
        font-size: 13px;
        margin-top: 6px;
        border-radius: 22px;
        color: #f1f1f1;
      }
    }
  }
  .columnMenuBox {
    margin: 15px 0 10px;
    // 精彩分类 今日必拼 小菜单
    .columnMenu {
      display: flex;
      flex-direction: row;
      white-space: nowrap;
      .menuItem {
        padding: 0 15px;
        display: inline-block;
        text-align: left;
        p {
          height: 24px;
          line-height: 24px;
          font-size: 16px;
          color: #666;
          &.active {
            font-size: 20px;
            color: #333;
            font-weight: 600;
          }
        }
      }
    }
  }
  .bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
    background: rgba(0, 0, 0, 0.3);
    .selectAddressDialog {
      position: absolute;
      width: 60%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .select_box {
        background-color: #fff;
        border-radius: 5px;
        padding: 5px 10px;
        border-bottom: 1px solid #f6f6f6;
        .select_one {
          line-height: 30px;
          padding: 5px 10px;
          border-bottom: 1px solid #f6f6f6;
          position: relative;
          &::after {
            display: block;
            content: "";
            width: 12px;
            height: 12px;
            border: 1px solid #ccc;
            position: absolute;
            right: 5px;
            top: 15px;
            border-radius: 12px;
          }
          &.selEd {
            &::after {
              background: #999;
            }
          }
        }
      }
    }
  }
}
</style>
