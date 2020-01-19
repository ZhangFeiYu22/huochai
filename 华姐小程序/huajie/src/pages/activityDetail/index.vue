<template>
  <div class="activityDetail" :style="{marginTop: headHeight + 'px'}">
    <headView :headData="headData"></headView>
    <div class="detail">
      <div class="imgLine">
        <img :src="activityData.headUrl" mode="aspectFill" />
      </div>
      <div class="titleLine bottomline">
        <p class="title">{{activityData.title}}</p>
        <p class="remind">提醒: 人数报完即止</p>
      </div>
      <div class="lineCom padding5-20" @click="goMap(activityData.address)">
        <i class="iconfont icon-04"></i>
        <p class="rightIcon ellipsis-1">{{activityData.address}}</p>
      </div>
      <div class="lineCom padding5-20">
        <i class="iconfont icon-shijian"></i>
        <!-- <p>{{activityData.time.date}} / {{activityData.time.week}} / {{activityData.time.timeQuantum}}</p> -->
        <p>{{activityData.acttime}}</p>
      </div>
      <div class="lineCom padding5-20">
        <i class="iconfont icon-jinqian"></i>
        <p>材料费{{activityData.fee}} ¥/人</p>
      </div>
      <div class="lineCom padding5-20" @click="phoneCall(activityData.telephone)">
        <i class="iconfont icon-weibiaoti-"></i>
        <p class="rightIcon">{{activityData.telephone}}</p>
      </div>
      <div class="contentBox">
        <h1>活动详情</h1>
        <div class="content">活动详情内容{{content}}</div>
      </div>
    </div>
    <div class="JoinBtn" @click="goSignUp(activityData.id,activityData.fee)">我要参加</div>
  </div>
</template>

<script>
import headView from '@/components/headerView'
import activityCom from '@/components/activityComponents'
export default {
  data () {
    return {
      csrfToken: null,
      headData: {
        title: '活动',
        bgcolor: '#fff',
        showBlack: true
      },
      headHeight: '',
      activityData: ''
    }
  },
  components: {
    headView,
    activityCom
  },
  onLoad (options) {
    this.csrfToken = wx.getStorageSync('authToken')
    this.headHeight = this.$store.state.navHeight + 46
    this.activityData = JSON.parse(options.activityData)
  },
  methods: {
    goSignUp (id, price) {
      if (this.csrfToken) {
        wx.navigateTo({
          url: `/pages/signUp/main?buyId=${id}&bugPrice=${price}`
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '请先登录,享受更高权益',
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '/pages/index/main'
              })
            }
          }
        });
      }
    },
    goMap (address) {
      wx.navigateTo({
        url: '/pages/addressMap/main?address=' + address
      })
    },
    phoneCall (phone) {
      wx.makePhoneCall({
        phoneNumber: phone
      })
    }
  }
}
</script>
  
<style lang="less" scoped>
.activityDetail {
  .detail {
    .imgLine {
      width: 100%;
      height: 170px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .bottomline {
      border-bottom: 1px solid #eee;
    }
    .padding5-20 {
      padding: 0 0 0 4%;
    }
    .titleLine {
      line-height: 22px;
      padding: 2% 4%;
      .title {
        font-weight: 600;
        font-size: 16px;
      }
      .remind {
        font-size: 12px;
        color: #999;
      }
    }
    .lineCom {
      width: 96%;
      display: flex;
      flex-direction: row;
      height: 40px;
      line-height: 40px;
      i {
        width: 8%;
        vertical-align: middle;
      }
      p {
        width: 90%;
        box-sizing: border-box;
        padding-right: 20px;
        font-size: 14px;
        vertical-align: middle;
        border-bottom: 1px solid #eee;
        position: relative;
        color: #6e7375;
        &.rightIcon::after {
          display: block;
          content: "";
          width: 8px;
          height: 8px;
          border-right: 1px solid #6e7375;
          border-top: 1px solid #6e7375;
          position: absolute;
          right: 5%;
          top: 50%;
          transform: rotate(45deg) translateY(-50%);
        }
      }
    }
    .contentBox {
      border-top: 4px solid #eee;
      h1 {
        padding: 2% 5%;
        font-size: 14px;
        height: 40px;
        line-height: 40px;
      }
      .content {
        font-size: 14px;
      }
    }
  }
  .JoinBtn {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 42px;
    line-height: 42px;
    background-color: #6997a0;
    color: #fff;
    font-size: 16px;
    text-align: center;
  }
}
</style>
